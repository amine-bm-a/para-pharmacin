<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;

class AdminCouponController extends Controller
{
    public function index()
    {
        $coupons = Coupon::orderByDesc('created_at')->get();

        return response()->json(['success' => true, 'data' => $coupons]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:coupons,code|max:50',
            'type' => 'required|in:percent,fixed',
            'value' => 'required|numeric|min:0',
            'min_order' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date',
            'is_active' => 'boolean',
        ]);
        $coupon = Coupon::create($validated);

        return response()->json(['success' => true, 'data' => $coupon], 201);
    }

    public function update(Request $request, $id)
    {
        $coupon = Coupon::findOrFail($id);
        $validated = $request->validate([
            'code' => 'sometimes|string|max:50|unique:coupons,code,'.$id,
            'type' => 'sometimes|in:percent,fixed',
            'value' => 'sometimes|numeric|min:0',
            'min_order' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date',
            'is_active' => 'boolean',
        ]);
        $coupon->update($validated);

        return response()->json(['success' => true, 'data' => $coupon]);
    }

    public function destroy($id)
    {
        Coupon::findOrFail($id)->delete();

        return response()->json(['success' => true, 'message' => 'Coupon supprimé.']);
    }

    // Public: validate a coupon code
    public function validate(Request $request)
    {
        $request->validate(['code' => 'required|string', 'amount' => 'required|numeric|min:0']);
        $coupon = Coupon::where('code', strtoupper($request->code))->first();
        if (! $coupon || ! $coupon->isValid()) {
            return response()->json(['success' => false, 'message' => 'Code promo invalide ou expiré.'], 422);
        }
        if ($request->amount < $coupon->min_order) {
            return response()->json(['success' => false, 'message' => "Montant minimum requis: {$coupon->min_order} DH"], 422);
        }
        $discounted = $coupon->applyTo($request->amount);
        $discount = $request->amount - $discounted;

        return response()->json([
            'success' => true,
            'coupon' => $coupon,
            'discount' => round($discount, 2),
            'new_total' => round($discounted, 2),
        ]);
    }
}
