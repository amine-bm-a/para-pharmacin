<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use App\Models\Order;
use App\Models\Prescription;
use App\Models\Product;
use App\Notifications\OrderStatusNotification;
use App\Notifications\PrescriptionStatusNotification;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PharmacienController extends Controller
{
    // Dashboard stats
    public function dashboard()
    {
        $pendingPreparation = Order::where('status', 'pending')->count();
        $preparing = Order::where('status', 'preparing')->count();
        $lowStock = Product::where('stock', '<=', 5)->count();
        $pendingPrescriptions = Prescription::where('statut', 'pending')->count();

        $recentOrders = Order::with('user')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'pending_preparation' => $pendingPreparation,
                'preparing' => $preparing,
                'low_stock' => $lowStock,
                'pending_prescriptions' => $pendingPrescriptions,
                'recent_orders' => $recentOrders,
            ],
        ]);
    }

    // Scanner command: find by order ID or tracking number
    public function scanOrder(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $code = $request->code;

        // Try searching by ID
        $order = null;
        if (is_numeric($code)) {
            $order = Order::with(['user', 'items.product'])->find($code);
        }

        // Try searching by tracking number in delivery if not found
        if (! $order) {
            $delivery = Delivery::where('tracking_number', $code)->first();
            if ($delivery) {
                $order = Order::with(['user', 'items.product'])->find($delivery->order_id);
            }
        }

        if (! $order) {
            return response()->json([
                'success' => false,
                'message' => 'Commande introuvable avec ce code ou numéro de suivi.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    // Update order status & payment status (including validating delivered orders)
    public function updateOrderStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $request->validate([
            'status' => 'required|in:pending,preparing,processing,shipped,delivered,completed,cancelled',
            'payment_status' => 'nullable|in:pending,paid,failed',
        ]);

        $oldStatus = $order->status;
        $order->status = $request->status;

        // Auto update payment_status to 'paid' if marked delivered & payment_method is cash on delivery
        if ($request->filled('payment_status')) {
            $order->payment_status = $request->payment_status;
        } elseif ($request->status === 'delivered' && $order->payment_method === 'delivery') {
            $order->payment_status = 'paid';
        }

        $order->save();

        if ($request->status === 'cancelled' && $oldStatus !== 'cancelled') {
            $order->restoreStock();
        }

        // Keep Delivery model in sync
        Delivery::updateOrCreate(
            ['order_id' => $order->id],
            [
                'status' => $request->status,
                'address' => $order->shipping_address ?? 'Retrait en pharmacie',
                'city' => $order->shipping_city ?? 'Marrakech',
            ]
        );

        // Notify client via in-app notification
        $orderNum = $order->order_number ?? "#{$order->id}";
        NotificationService::notifyUser(
            $order->user_id,
            '📦 Statut de votre commande mis à jour',
            "Votre commande **{$orderNum}** est maintenant : ".NotificationService::statusLabel($request->status),
            'order',
            '/mes-commandes'
        );

        // Notify admin for visibility
        NotificationService::notifyAdmins(
            '🔄 Commande mise à jour par l\'employé',
            "La commande **{$orderNum}** a été mise à jour vers : ".NotificationService::statusLabel($request->status),
            'order',
            '/admin/orders'
        );

        // Dispatch queued Email + SMS notification to the client
        if ($order->user) {
            try {
                $order->user->notify(new OrderStatusNotification($order->load('items.product')));
            } catch (\Exception $e) {
                Log::error('Pharmacist status update: notification dispatch failed.', ['error' => $e->getMessage()]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Statut de la commande mis à jour vers: '.NotificationService::statusLabel($request->status),
            'data' => $order->load(['user', 'items.product', 'prescriptions.product']),
            'order' => $order->load(['user', 'items.product', 'prescriptions.product']),
        ]);
    }

    public function prepareOrder(Request $request, $id)
    {
        return $this->updateOrderStatus($request, $id);
    }

    // Stock management for pharmacist
    public function listStock()
    {
        $products = Product::with('category', 'brand')
            ->orderBy('stock')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    public function updateStock(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $request->validate([
            'stock' => 'required|integer|min:0',
        ]);

        $product->stock = $request->stock;
        $product->save();

        return response()->json([
            'success' => true,
            'message' => 'Stock mis à jour avec succès.',
            'data' => $product,
        ]);
    }

    // List all orders with items and product details for preparation
    public function listOrders()
    {
        $orders = Order::with(['user', 'items.product', 'prescriptions.product'])
            ->orderByRaw("FIELD(status, 'pending', 'preparing', 'shipped', 'delivered', 'cancelled')")
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'orders' => $orders,
        ]);
    }

    /**
     * List all prescriptions waiting for pharmacist validation.
     */
    public function listPendingPrescriptions()
    {
        $prescriptions = Prescription::with(['order.user', 'product'])
            ->where('statut', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'prescriptions' => $prescriptions,
        ]);
    }

    /**
     * Validate/reject a single prescription item with comments.
     */
    public function validatePrescription(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|string|in:approved,rejected',
            'commentaire_pharmacien' => 'nullable|string|max:1000',
        ]);

        $prescription = Prescription::with(['order.user', 'product'])->findOrFail($id);

        $prescription->update([
            'statut' => $request->statut,
            'commentaire_pharmacien' => $request->commentaire_pharmacien,
            'validated_by' => $request->user()->id,
            'date' => now(),
        ]);

        $order = $prescription->order;

        // Check overall status of all prescriptions for this order
        $allPrescriptions = $order->prescriptions;
        $hasRejected = $allPrescriptions->contains('statut', 'rejected');
        $allApproved = $allPrescriptions->every(fn ($p) => $p->statut === 'approved');

        if ($hasRejected) {
            $oldStatus = $order->status;
            $order->update([
                'prescription_status' => 'rejected',
                'status' => 'cancelled', // Cancel the order if any prescription is rejected
            ]);

            if ($oldStatus !== 'cancelled') {
                $order->restoreStock();
            }

            NotificationService::notifyUser(
                $order->user_id,
                '❌ Ordonnance refusée',
                "L'ordonnance pour le produit '{$prescription->product->name}' a été refusée : {$request->commentaire_pharmacien}. La commande #{$order->order_number} est annulée.",
                'order',
                '/mes-commandes'
            );
        } elseif ($allApproved) {
            $order->update([
                'prescription_status' => 'approved',
            ]);

            NotificationService::notifyUser(
                $order->user_id,
                '✅ Ordonnances validées',
                "Toutes les ordonnances pour votre commande #{$order->order_number} ont été validées. Préparation imminente !",
                'order',
                '/mes-commandes'
            );
        } else {
            $order->update([
                'prescription_status' => 'pending',
            ]);
        }

        // Notify client via queued Email/SMS
        if ($order->user) {
            try {
                $order->user->notify(new PrescriptionStatusNotification($prescription));
            } catch (\Exception $e) {
                Log::error('Prescription validation notification dispatch failed.', ['error' => $e->getMessage()]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'L\'ordonnance a été traitée.',
            'prescription' => $prescription,
            'order_prescription_status' => $order->prescription_status,
        ]);
    }
}
