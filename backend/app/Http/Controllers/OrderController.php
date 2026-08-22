<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
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
        $orders = Order::with(['items.product', 'prescriptions.product'])
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
            'coupon_code' => 'nullable|string|max:50',
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
                $product = Product::where('id', $item['product_id'])->lockForUpdate()->first();

                if (! $product) {
                    DB::rollBack();

                    return response()->json([
                        'success' => false,
                        'message' => "Le produit #{$item['product_id']} n'existe plus dans le catalogue. Merci de mettre à jour votre panier.",
                    ], 400);
                }

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
                    'stock_before' => (int) $product->stock,
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

            // Apply Tier VIP percentage discount automatically (Bronze 0%, Argent 3%, Or 5%, Platine 8%, Diamant 12%)
            $tierDetails = LoyaltyService::getTierDetails($user);
            $tierDiscountPercent = $tierDetails['current_tier']['discount_percent'] ?? 0;
            if ($tierDiscountPercent > 0) {
                $tierDiscountMad = ($totalAmount * $tierDiscountPercent) / 100;
                $totalAmount = max(0, $totalAmount - $tierDiscountMad);
            }

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

            // Apply a promo coupon on the discounted amount if requested
            $coupon = null;
            $couponDiscount = 0.0;
            if ($request->filled('coupon_code')) {
                $coupon = Coupon::where('code', strtoupper(trim($request->coupon_code)))->first();

                if (! $coupon || ! $coupon->isValid()) {
                    DB::rollBack();

                    return response()->json([
                        'success' => false,
                        'message' => 'Code promo invalide ou expiré.',
                    ], 422);
                }

                if ($totalAmount < (float) $coupon->min_order) {
                    DB::rollBack();

                    return response()->json([
                        'success' => false,
                        'message' => "Ce code promo requiert une commande d'au moins {$coupon->min_order} DH.",
                    ], 422);
                }

                $couponDiscount = round($totalAmount - $coupon->applyTo($totalAmount), 2);
                $totalAmount = max(0, $totalAmount - $couponDiscount);
            }

            // Check card balance and bank authorization if payment_method === 'card'
            if ($request->payment_method === 'card') {
                $cardNumber = preg_replace('/\D/', '', $request->input('card_number', ''));
                $cardBalance = $request->filled('card_balance') ? (float) $request->card_balance : null;

                // Simulate bank authorization refusal if balance < total OR test error card (ends with 0000)
                if (str_ends_with($cardNumber, '0000') || ($cardBalance !== null && $cardBalance < $totalAmount)) {
                    DB::rollBack();
                    $availFormatted = $cardBalance !== null ? number_format($cardBalance, 2).' MAD' : '0.00 MAD';
                    $totalFormatted = number_format($totalAmount, 2).' MAD';

                    return response()->json([
                        'success' => false,
                        'message' => "❌ Paiement refusé par votre banque : Solde bancaire insuffisant (Code 51 — Solde Insuffisant). Votre solde disponible ({$availFormatted}) est inférieur au montant total de la commande ({$totalFormatted}).",
                    ], 422);
                }
            }

            // Create Order
            $orderNumber = 'CMD'.date('Ymd').strtoupper(bin2hex(random_bytes(3)));
            $isCard = $request->payment_method === 'card';

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
                'payment_status' => 'pending',
                'prescription_path' => $prescriptionPath,
                'prescription_status' => $requiresPrescription ? 'pending' : null,
                'coupon_code' => $coupon?->code,
                'discount_amount' => $couponDiscount,
            ]);

            // Consume one usage of the coupon
            if ($coupon) {
                $coupon->increment('used_count');
            }

            // Create Order Items, create Prescription records if required, and decrease stock
            foreach ($itemsToCreate as $itemData) {
                $itemRequiresPrescription = $itemData['requires_prescription'];
                $stockBefore = $itemData['stock_before'];
                unset($itemData['requires_prescription'], $itemData['stock_before']);

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

                // Notify staff when the product enters low-stock territory
                NotificationService::notifyLowStock($product, $stockBefore);
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

            // Confirm to client inside dashboard and via Mail / SMS / WhatsApp
            NotificationService::notifyUser(
                $request->user()->id,
                '✅ Commande confirmée',
                "Votre commande **#{$order->order_number}** a bien été reçue. Nous la préparons dès que possible !",
                'order',
                '/mes-commandes'
            );

            try {
                $user->notify(new OrderStatusNotification($order->load('items.product')));
            } catch (\Exception $e) {
                Log::warning('Order creation: SMS/Email notification dispatch failed.', ['error' => $e->getMessage()]);
            }

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
                    $paymentParams['dev_note'] = 'Sandbox URL: '.config('services.cmi.test_url');
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
                'cmi_url' => config('services.cmi.test_url'),
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
        // staff (admin / pharmacien / employe) can access any.
        if (! in_array($request->user()->role, ['admin', 'pharmacien', 'employe'], true)) {
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
