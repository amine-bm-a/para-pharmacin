<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\CacheKeyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminStockController extends Controller
{
    // List all products with stock info, filterable by threshold
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $query = Product::with(['category', 'brandRelation']);

        if ($request->filled('status')) {
            if ($request->status === 'low') {
                $query->where('stock', '>', 0)->where('stock', '<=', 10);
            } elseif ($request->status === 'out') {
                $query->where('stock', '=', 0);
            } elseif ($request->status === 'ok') {
                $query->where('stock', '>', 10);
            }
        }

        $products = $query->orderBy('stock', 'asc')->get(['id', 'name', 'image_url', 'category_id', 'brand_id', 'brand', 'stock', 'price']);

        return response()->json([
            'success' => true,
            'products' => $products,
            'summary' => [
                'total' => Product::count(),
                'low_stock' => Product::where('stock', '>', 0)->where('stock', '<=', 10)->count(),
                'out_of_stock' => Product::where('stock', '=', 0)->count(),
            ]
        ]);
    }

    // Quick stock adjustment from the Stocks page
    public function updateStock(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        $product = Product::find($id);
        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Produit non trouvé.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'stock' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $product->update(['stock' => $request->stock]);

        CacheKeyService::bump('products');

        return response()->json(['success' => true, 'message' => 'Stock mis à jour avec succès.', 'product' => $product]);
    }
}
