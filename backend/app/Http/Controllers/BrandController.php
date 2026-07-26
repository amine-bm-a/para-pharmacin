<?php

namespace App\Http\Controllers;

use App\Models\Brand;

class BrandController extends Controller
{
    public function index()
    {
        $brands = Brand::withCount('products')
            ->having('products_count', '>', 0)
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'brands' => $brands
        ]);
    }
}
