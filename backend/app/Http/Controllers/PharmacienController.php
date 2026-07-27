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
            $order = Order::with(['user', 'orderItems.product'])->find($code);
        }

        // Try searching by tracking number in delivery if not found
        if (! $order) {
            $delivery = Delivery::where('tracking_number', $code)->first();
            if ($delivery) {
                $order = Order::with(['user', 'orderItems.product'])->find($delivery->order_id);
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

    // Prepare order: change status of order
    public function prepareOrder(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $request->validate([
            'status' => 'required|in:pending,preparing,processing,shipped,delivered,completed,cancelled',
        ]);

        $oldStatus = $order->status;
        $order->status = $request->status;
        $order->save();

        if ($request->status === 'cancelled' && $oldStatus !== 'cancelled') {
            $order->restoreStock();
        }

        // Adjust stock if transitioning to preparing (if not already done at ordering)
        // Usually stock is decremented on checkout. Let's make sure we update delivery state too.
        if ($request->status === 'preparing') {
            Delivery::updateOrCreate(
                ['order_id' => $order->id],
                [
                    'status' => 'preparing',
                    'address' => $order->shipping_address ?? 'Retrait en pharmacie',
                    'city' => $order->shipping_city ?? 'Default',
                ]
            );
        }

        // Notify client via in-app notification
        NotificationService::notifyUser(
            $order->user_id,
            '📦 Statut de votre commande mis à jour',
            "Votre commande **#{$order->id}** est maintenant : ".NotificationService::statusLabel($request->status),
            'order',
            '/mes-commandes'
        );

        // Notify admin for visibility
        NotificationService::notifyAdmins(
            '🔄 Commande mise à jour par l\'employé',
            "La commande **#{$order->id}** a été mise à jour vers : ".NotificationService::statusLabel($request->status),
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
            'message' => "Statut de la commande mis à jour vers: {$request->status}",
            'data' => $order,
        ]);
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
        $orders = Order::with(['user', 'orderItems.product', 'prescriptions.product'])
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
