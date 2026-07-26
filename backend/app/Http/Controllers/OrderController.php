<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Prescription;
use App\Models\Product;
use App\Notifications\OrderStatusNotification;
use App\Services\CacheKeyService;
use App\Services\CmiPaymentService;
use App\Services\LoyaltyService;
use App\Services\NotificationService;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::with(['items.product', 'orderItems.product', 'prescriptions.product'])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'orders' => $orders,
        ]);
    }

    public function show(Request $request, $id)
    {
        $order = Order::with(['items.product', 'prescriptions.product'])
            ->where('user_id', $request->user()->id)
            ->find($id);

        if (! $order) {
            return response()->json([
                'success' => false,
                'message' => 'Commande non trouvée.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'order' => $order,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'shipping_address' => 'required|string|max:255',
            'shipping_city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'phone_number' => 'required|string|max:20',
            'payment_method' => 'required|string|in:delivery,card,pickup',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            // Required only when at least one item needs a prescription
            // (checked manually below, since that depends on DB lookups).
            'prescription_file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'loyalty_points_to_spend' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Determine if any product in the cart legally requires a prescription
        $productIds = collect($request->items)->pluck('product_id');
        $requiresPrescription = Product::whereIn('id', $productIds)
            ->where('requires_prescription', true)
            ->exists();

        if ($requiresPrescription && ! $request->hasFile('prescription_file')) {
            return response()->json([
                'success' => false,
                'message' => 'Cette commande contient un ou plusieurs médicaments soumis à ordonnance. Merci de joindre une photo ou un scan de votre ordonnance valide.',
            ], 422);
        }

        try {
            DB::beginTransaction();

            $totalAmount = 0;
            $itemsToCreate = [];

            // Calculate totals and verify stock
            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);

                if ($product->stock < $item['quantity']) {
                    DB::rollBack();

                    return response()->json([
                        'success' => false,
                        'message' => "Le produit '{$product->name}' n'a pas assez de stock. Stock disponible: {$product->stock}.",
                    ], 400);
                }

                $price = $product->discount_price ?? $product->price;
                $totalAmount += $price * $item['quantity'];

                $itemsToCreate[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $price,
                    'requires_prescription' => $product->requires_prescription,
                ];
            }

            // Store prescription file privately (not publicly accessible) if provided
            $prescriptionPath = null;
            if ($request->hasFile('prescription_file')) {
                // 'local' disk lives in storage/app/private and is NOT publicly
                // accessible — prescriptions must only be reachable through an
                // authenticated, ownership-checked controller action.
                $prescriptionPath = $request->file('prescription_file')->store('prescriptions', 'local');
            }

            // Apply loyalty points discount if requested
            $loyaltyDiscount = 0.0;
            $pointsSpent = 0;
            $user = $request->user();

            if ($request->filled('loyalty_points_to_spend') && $request->loyalty_points_to_spend > 0) {
                $pointsToSpend = (int) $request->loyalty_points_to_spend;
                if ($user->loyalty_points >= $pointsToSpend) {
                    // We can't call LoyaltyService::spendPoints yet (no order), store for after
                    $pointsSpent = $pointsToSpend;
                    // Round down to nearest REDEEM_RATE multiple
                    $pointsSpent = (int) (floor($pointsSpent / LoyaltyService::REDEEM_RATE) * LoyaltyService::REDEEM_RATE);
                    $loyaltyDiscount = ($pointsSpent / LoyaltyService::REDEEM_RATE) * LoyaltyService::REDEEM_MAD;
                    $totalAmount = max(0, $totalAmount - $loyaltyDiscount);
                }
            }

            // Create Order
            $orderNumber = 'CMD'.date('Ymd').strtoupper(bin2hex(random_bytes(3)));

            $order = Order::create([
                'user_id' => $request->user()->id,
                'order_number' => $orderNumber,
                'status' => 'pending',
                'total_amount' => $totalAmount,
                'shipping_address' => $request->shipping_address,
                'shipping_city' => $request->shipping_city,
                'postal_code' => $request->postal_code,
                'phone_number' => $request->phone_number,
                'payment_method' => $request->payment_method,
                'payment_status' => 'pending', // Card starts pending until webhook validates it
                'prescription_path' => $prescriptionPath,
                'prescription_status' => $requiresPrescription ? 'pending' : null,
            ]);

            // Create Order Items, create Prescription records if required, and decrease stock
            foreach ($itemsToCreate as $itemData) {
                $itemRequiresPrescription = $itemData['requires_prescription'];
                unset($itemData['requires_prescription']);

                $itemData['order_id'] = $order->id;
                OrderItem::create($itemData);

                // Create prescription record in the prescriptions table
                if ($itemRequiresPrescription && $prescriptionPath) {
                    Prescription::create([
                        'order_id' => $order->id,
                        'product_id' => $itemData['product_id'],
                        'fichier' => $prescriptionPath,
                        'statut' => 'pending',
                    ]);
                }

                // Decrease stock
                $product = Product::find($itemData['product_id']);
                $product->decrement('stock', $itemData['quantity']);
            }

            DB::commit();

            // Stock levels changed for every ordered product — invalidate the
            // cached product listings so "in stock" / low-stock badges stay accurate.
            CacheKeyService::bump('products');

            // ── Loyalty: spend points if requested ───────────────────────────
            if ($pointsSpent > 0) {
                try {
                    LoyaltyService::spendPoints($user, $pointsSpent, $order);
                } catch (\Exception $e) {
                    Log::warning('OrderController: Failed to deduct loyalty points.', ['error' => $e->getMessage()]);
                }
            }

            // ── Loyalty: apply referral bonus on first ever order ────────────
            $isFirstOrder = Order::where('user_id', $user->id)->count() === 1;
            if ($isFirstOrder && $user->referred_by && ! $user->referral_bonus_granted) {
                try {
                    LoyaltyService::applyReferralBonus($user, $order);
                } catch (\Exception $e) {
                    Log::warning('OrderController: Failed to apply referral bonus.', ['error' => $e->getMessage()]);
                }
            }

            // Notify all admins and staff about the new order
            $clientName = $request->user()->name ?? 'Client';
            NotificationService::notifyAdminsAndStaff(
                '🛒 Nouvelle commande reçue',
                "Commande **#{$order->order_number}** de **{$clientName}** — Montant : ".number_format($totalAmount, 2).' MAD',
                'order',
                '/admin/orders'
            );

            // Notify staff specifically if there is a prescription pending review
            if ($requiresPrescription) {
                NotificationService::notifyAdminsAndStaff(
                    '📄 Nouvelle ordonnance soumise',
                    "Une nouvelle ordonnance a été soumise pour la commande **#{$order->order_number}** de **{$clientName}**.",
                    'prescription',
                    '/pharmacien/prescriptions'
                );
            }

            // Confirm to client inside dashboard
            NotificationService::notifyUser(
                $request->user()->id,
                '✅ Commande confirmée',
                "Votre commande **#{$order->order_number}** a bien été reçue. Nous la préparons dès que possible !",
                'order',
                '/mes-commandes'
            );

            // ── CMI payment generation for Card ──────────────────────────────
            $requiresRedirect = false;
            $paymentParams = null;

            if ($order->payment_method === 'card') {
                $requiresRedirect = true;
                $paymentParams = CmiPaymentService::getPaymentParameters(
                    $order->order_number,
                    $order->total_amount,
                    $request->user()->email
                );

                if (config('app.debug')) {
                    $paymentParams['dev_note'] = 'Sandbox URL: https://testpayment.cmi.co.ma/fim/est3Dgate';
                }
            } else {
                // For delivery or pickup, dispatch queued notification (Email + SMS) immediately
                try {
                    $request->user()->notify(new OrderStatusNotification($order->load('items.product')));
                } catch (\Exception $e) {
                    Log::error('Order creation: Failed to dispatch notification.', ['error' => $e->getMessage()]);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Commande passée avec succès.',
                'order' => $order->load('items.product'),
                'requires_redirect' => $requiresRedirect,
                'payment_params' => $paymentParams,
                'cmi_url' => 'https://testpayment.cmi.co.ma/fim/est3Dgate',
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du traitement de la commande : '.$e->getMessage(),
            ], 500);
        }
    }

    public function downloadPrescription(Request $request, $id)
    {
        $query = Order::where('id', $id);

        // Clients can only access their own order's prescription;
        // admins can access any (checked via the route's 'admin' middleware group).
        if ($request->user()->role !== 'admin') {
            $query->where('user_id', $request->user()->id);
        }

        $order = $query->first();

        if (! $order || ! $order->prescription_path) {
            return response()->json([
                'success' => false,
                'message' => 'Ordonnance non trouvée.',
            ], 404);
        }

        if (! Storage::disk('local')->exists($order->prescription_path)) {
            return response()->json([
                'success' => false,
                'message' => 'Fichier introuvable.',
            ], 404);
        }

        return Storage::disk('local')->download($order->prescription_path);
    }

    public function downloadInvoice(Request $request, $id)
    {
        $order = Order::with(['items.product', 'user'])
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        $options = new Options;
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', false);

        $dompdf = new Dompdf($options);
        $html = view('emails.invoice', ['order' => $order])->render();

        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return response($dompdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="Facture-'.$order->order_number.'.pdf"');
    }
}
