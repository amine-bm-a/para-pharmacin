<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminDeliveryController extends Controller
{
    public function index()
    {
        $deliveries = Delivery::with('order.user')->orderByDesc('created_at')->paginate(20);

        return response()->json(['success' => true, 'data' => $deliveries]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'carrier' => 'nullable|string|max:100',
            'tracking_number' => 'nullable|string|max:100',
            'status' => 'sometimes|in:pending,preparing,shipped,out_for_delivery,delivered,failed',
            'cost' => 'nullable|numeric|min:0',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'zip' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
        ]);
        $delivery = Delivery::create($validated);

        return response()->json(['success' => true, 'data' => $delivery->load('order')], 201);
    }

    public function update(Request $request, $id)
    {
        $delivery = Delivery::findOrFail($id);
        $validated = $request->validate([
            'carrier' => 'nullable|string|max:100',
            'tracking_number' => 'nullable|string|max:100',
            'status' => 'sometimes|in:pending,preparing,shipped,out_for_delivery,delivered,failed',
            'cost' => 'nullable|numeric|min:0',
            'address' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:100',
            'zip' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
        ]);

        if (isset($validated['status'])) {
            if ($validated['status'] === 'shipped' && ! $delivery->shipped_at) {
                $validated['shipped_at'] = now();
            }
            if ($validated['status'] === 'delivered' && ! $delivery->delivered_at) {
                $validated['delivered_at'] = now();
            }
        }

        $delivery->update($validated);

        return response()->json(['success' => true, 'data' => $delivery->load('order')]);
    }

    public function destroy($id)
    {
        Delivery::findOrFail($id)->delete();

        return response()->json(['success' => true, 'message' => 'Livraison supprimée.']);
    }

    // Client: track their order delivery
    public function trackOrder($orderId)
    {
        $delivery = Delivery::where('order_id', $orderId)->first();
        if (! $delivery) {
            return response()->json(['success' => false, 'message' => 'Livraison introuvable.'], 404);
        }

        return response()->json(['success' => true, 'data' => $delivery]);
    }
}
