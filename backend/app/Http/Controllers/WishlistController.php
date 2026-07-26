<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        $wishlistItems = Wishlist::where('user_id', $userId)
            ->with('product.brand', 'product.category')
            ->get()
            ->pluck('product');
            
        return response()->json([
            'success' => true,
            'data' => $wishlistItems
        ]);
    }

    public function store($productId)
    {
        $userId = Auth::id();
        
        $exists = Wishlist::where('user_id', $userId)->where('product_id', $productId)->exists();
        if (!$exists) {
            Wishlist::create([
                'user_id' => $userId,
                'product_id' => $productId
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Produit ajouté aux favoris.'
        ]);
    }

    public function destroy($productId)
    {
        $userId = Auth::id();
        Wishlist::where('user_id', $userId)->where('product_id', $productId)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produit retiré des favoris.'
        ]);
    }
}
