<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminPromotionController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $promotions = Promotion::with('category')->orderBy('starts_at', 'desc')->get();

        return response()->json(['success' => true, 'promotions' => $promotions]);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'discount_percent' => 'required|integer|min:1|max:90',
            'starts_at' => 'required|date',
            'ends_at' => 'required|date|after_or_equal:starts_at',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $promotion = Promotion::create($validator->validated());

        return response()->json(['success' => true, 'message' => 'Promotion créée avec succès.', 'promotion' => $promotion], 201);
    }

    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $promotion = Promotion::find($id);
        if (! $promotion) {
            return response()->json(['success' => false, 'message' => 'Promotion non trouvée.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'discount_percent' => 'required|integer|min:1|max:90',
            'starts_at' => 'required|date',
            'ends_at' => 'required|date|after_or_equal:starts_at',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $promotion->update($validator->validated());

        return response()->json(['success' => true, 'message' => 'Promotion mise à jour avec succès.', 'promotion' => $promotion]);
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $promotion = Promotion::find($id);
        if (! $promotion) {
            return response()->json(['success' => false, 'message' => 'Promotion non trouvée.'], 404);
        }

        $promotion->delete();

        return response()->json(['success' => true, 'message' => 'Promotion supprimée avec succès.']);
    }
}
