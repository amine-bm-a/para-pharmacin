<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Services\CacheKeyService;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Cache::remember(
            CacheKeyService::key('categories', 'index'),
            CacheKeyService::ttl(),
            fn () => Category::withCount('products')->get()
        );

        return response()->json([
            'success' => true,
            'categories' => $categories,
        ]);
    }
}
