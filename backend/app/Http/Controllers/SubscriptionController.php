<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Subscription;
use App\Models\SubscriptionItem;
use App\Notifications\OrderStatusNotification;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class SubscriptionController extends Controller
{
    /**
     * GET /subscriptions
     * List all subscriptions for the authenticated user.
     */
    public function index(Request $request)
    {
        $subscriptions = Subscription::with('items.product')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'subscriptions' => $subscriptions,
        ]);
    }

    /**
     * POST /subscriptions
     * Create a new recurring subscription.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'frequency' => 'required|in:weekly,biweekly,monthly',
            'shipping_address' => 'required|string|max:255',
            'shipping_city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'phone_number' => 'required|string|max:20',
            'payment_method' => 'required|in:delivery,pickup',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1|max:99',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Ensure no product in the subscription requires a prescription
        $productIds = collect($request->items)->pluck('product_id');
        $prescriptionRequired = Product::whereIn('id', $productIds)
            ->where('requires_prescription', true)
            ->exists();

        if ($prescriptionRequired) {
            return response()->json([
                'success' => false,
                'message' => 'Les médicaments sur ordonnance ne peuvent pas être ajoutés à un abonnement récurrent.',
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Determine first renewal date based on frequency
            $nextRenewal = match ($request->frequency) {
                'weekly' => now()->addWeek(),
                'biweekly' => now()->addWeeks(2),
                default => now()->addMonth(),
            };

            $subscription = Subscription::create([
                'user_id' => $request->user()->id,
                'status' => 'active',
                'frequency' => $request->frequency,
                'shipping_address' => $request->shipping_address,
                'shipping_city' => $request->shipping_city,
                'postal_code' => $request->postal_code,
                'phone_number' => $request->phone_number,
                'payment_method' => $request->payment_method,
                'discount_percent' => 5,
                'next_renewal_at' => $nextRenewal,
            ]);

            foreach ($request->items as $item) {
                SubscriptionItem::create([
                    'subscription_id' => $subscription->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            DB::commit();

            // Notify client
            NotificationService::notifyUser(
                $request->user()->id,
                '🔄 Abonnement créé',
                "Votre abonnement **#{$subscription->id}** est actif. Prochain renouvellement : ".
                $subscription->next_renewal_at->format('d/m/Y').'.',
                'subscription',
                '/mon-compte/abonnements'
            );

            return response()->json([
                'success' => true,
                'message' => 'Abonnement créé avec succès.',
                'subscription' => $subscription->load('items.product'),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Subscription creation failed', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'abonnement : '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * PUT /subscriptions/{id}
     * Update frequency or status (pause/resume).
     */
    public function update(Request $request, int $id)
    {
        $subscription = Subscription::where('user_id', $request->user()->id)->find($id);

        if (! $subscription) {
            return response()->json(['success' => false, 'message' => 'Abonnement introuvable.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|in:active,paused,cancelled',
            'frequency' => 'sometimes|in:weekly,biweekly,monthly',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $subscription->update($request->only(['status', 'frequency']));

        // Recalculate next_renewal_at if frequency changed
        if ($request->has('frequency')) {
            $subscription->update(['next_renewal_at' => $subscription->getNextRenewalDate()]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Abonnement mis à jour.',
            'subscription' => $subscription->fresh('items.product'),
        ]);
    }

    /**
     * DELETE /subscriptions/{id}
     * Cancel and permanently remove a subscription.
     */
    public function destroy(Request $request, int $id)
    {
        $subscription = Subscription::where('user_id', $request->user()->id)->find($id);

        if (! $subscription) {
            return response()->json(['success' => false, 'message' => 'Abonnement introuvable.'], 404);
        }

        $subscription->update(['status' => 'cancelled']);
        $subscription->delete();

        return response()->json([
            'success' => true,
            'message' => 'Abonnement annulé et supprimé.',
        ]);
    }

    /**
     * Internal method: process a single subscription renewal.
     * Creates a real order and advances next_renewal_at.
     */
    public static function renewSubscription(Subscription $subscription): ?Order
    {
        $user = $subscription->user;
        $items = $subscription->items()->with('product')->get();

        if ($items->isEmpty()) {
            return null;
        }

        try {
            return DB::transaction(function () use ($subscription, $user, $items) {
                $totalAmount = 0;
                $orderItems = [];

                foreach ($items as $subItem) {
                    $product = $subItem->product;

                    if (! $product || $product->stock < $subItem->quantity) {
                        Log::warning("Subscription #{$subscription->id}: stock insuffisant pour {$product?->name}");

                        continue;
                    }

                    $unitPrice = $product->discount_price ?? $product->price;
                    // Apply subscription discount
                    $unitPrice = $unitPrice * (1 - ($subscription->discount_percent / 100));
                    $totalAmount += $unitPrice * $subItem->quantity;

                    $orderItems[] = [
                        'product_id' => $product->id,
                        'quantity' => $subItem->quantity,
                        'price' => round($unitPrice, 2),
                    ];

                    $product->decrement('stock', $subItem->quantity);
                }

                if (empty($orderItems)) {
                    return null;
                }

                $orderNumber = 'ABO'.date('Ymd').strtoupper(bin2hex(random_bytes(3)));

                $order = Order::create([
                    'user_id' => $user->id,
                    'order_number' => $orderNumber,
                    'status' => 'pending',
                    'total_amount' => $totalAmount,
                    'shipping_address' => $subscription->shipping_address,
                    'shipping_city' => $subscription->shipping_city,
                    'postal_code' => $subscription->postal_code,
                    'phone_number' => $subscription->phone_number,
                    'payment_method' => $subscription->payment_method,
                    'payment_status' => 'pending',
                ]);

                foreach ($orderItems as $item) {
                    $item['order_id'] = $order->id;
                    OrderItem::create($item);
                }

                // Advance next_renewal_at
                $subscription->update([
                    'last_renewed_at' => now(),
                    'next_renewal_at' => $subscription->getNextRenewalDate(),
                ]);

                // Notify client
                NotificationService::notifyUser(
                    $user->id,
                    '🔄 Renouvellement automatique',
                    "Votre commande récurrente **#{$order->order_number}** a été passée automatiquement (abonnement #{$subscription->id}).",
                    'subscription',
                    '/mes-commandes'
                );

                // Dispatch order confirmation notification
                try {
                    $user->notify(new OrderStatusNotification($order->load('items.product')));
                } catch (\Exception $e) {
                    Log::error('Subscription renewal: Failed to dispatch notification', ['error' => $e->getMessage()]);
                }

                return $order;
            });

        } catch (\Exception $e) {
            Log::error("Subscription #{$subscription->id} renewal failed", ['error' => $e->getMessage()]);

            return null;
        }
    }
}
