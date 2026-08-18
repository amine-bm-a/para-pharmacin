<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Services\CacheKeyService;
use App\Traits\FilterProducts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    use FilterProducts;

    public function index(Request $request)
    {
        $search = $request->get('search', '');
        $category = $request->get('category', '');
        $brand = $request->get('brand', '');
        $minPrice = $request->get('min_price', '');
        $maxPrice = $request->get('max_price', '');
        $sort = $request->get('sort', 'popular');
        $inStock = $request->boolean('in_stock');
        $promos = $request->has('promotions');
        $featured = $request->has('featured');

        // ── Scout full-text search (database driver in dev, meilisearch in prod) ──
        if ($search !== '') {
            $productQuery = Product::search($search)->query(function ($q) use (
                $category, $brand, $minPrice, $maxPrice, $inStock, $promos, $featured, $sort
            ) {
                $q->with('category')->withAvg('reviews', 'rating');
                $this->applyProductFilters($q, $category, $brand, $minPrice, $maxPrice, $inStock, $promos, $featured, $sort);
            });

            $products = $productQuery->get()->map(fn ($p) => tap($p, fn ($p) => $p->average_rating));
        } else {
            // ── Standard Eloquent query when no full-text search ──
            // Cached for a short TTL, keyed by the exact filter combination
            // and the current "products" cache version (bumped whenever an
            // admin creates/edits/deletes a product, see AdminDashboardController).
            $cacheKey = CacheKeyService::key('products', md5(json_encode([
                $category, $brand, $minPrice, $maxPrice, $sort, $inStock, $promos, $featured,
            ])));

            $products = Cache::remember($cacheKey, CacheKeyService::ttl(), function () use (
                $category, $brand, $minPrice, $maxPrice, $inStock, $promos, $featured, $sort
            ) {
                $query = Product::with('category')->withAvg('reviews', 'rating');
                $this->applyProductFilters($query, $category, $brand, $minPrice, $maxPrice, $inStock, $promos, $featured, $sort);

                return $query->get()->map(fn ($p) => tap($p, fn ($p) => $p->average_rating));
            });
        }

        // Unique brands for sidebar filter — small, cheap to cache too.
        $brands = Cache::remember(
            CacheKeyService::key('products', 'brands'),
            CacheKeyService::ttl(),
            fn () => Product::distinct()->pluck('brand')->filter()->values()
        );

        return response()->json([
            'success' => true,
            'products' => $products,
            'brands' => $brands,
        ]);
    }

    /**
     * Autocomplete endpoint: returns up to 8 product suggestions.
     * GET /api/products/search/autocomplete?q=bioderma
     */
    public function autocomplete(Request $request)
    {
        $q = trim($request->get('q', ''));

        if (strlen($q) < 2) {
            return response()->json(['success' => true, 'suggestions' => []]);
        }

        $suggestions = Product::search($q)
            ->query(fn ($query) => $query->where('stock', '>', 0)->with('category'))
            ->take(8)
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'brand' => $p->brand,
                'category' => $p->category?->name,
                'price' => (float) $p->price,
                'discount_price' => $p->discount_price ? (float) $p->discount_price : null,
                'image_url' => $p->image_url,
            ]);

        return response()->json([
            'success' => true,
            'suggestions' => $suggestions,
        ]);
    }

    public function show($slug)
    {
        $product = Product::with([
            'category',
            'reviews' => function ($query) {
                $query->where('status', 'approved')->with('user:id,name,email');
            },
        ])->withAvg('reviews', 'rating')->where('slug', $slug)->first();

        if (! $product) {
            return response()->json([
                'success' => false,
                'message' => 'Produit non trouvé.',
            ], 404);
        }

        $product->average_rating = $product->average_rating;

        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get();

        // ── Frequently Bought Together (Cross-sell recommendation) ───────────
        $coBoughtProductIds = OrderItem::whereIn('order_id', function ($query) use ($product) {
            $query->select('order_id')->from('order_items')->where('product_id', $product->id);
        })
            ->where('product_id', '!=', $product->id)
            ->select('product_id', DB::raw('COUNT(*) as occurrences'))
            ->groupBy('product_id')
            ->orderByDesc('occurrences')
            ->limit(2)
            ->pluck('product_id');

        $frequentlyBoughtTogether = Product::whereIn('id', $coBoughtProductIds)->get();

        // Fallback if no order history co-purchases exist yet
        if ($frequentlyBoughtTogether->isEmpty()) {
            $frequentlyBoughtTogether = Product::where('id', '!=', $product->id)
                ->where(function ($q) use ($product) {
                    if ($product->brand) {
                        $q->where('brand', $product->brand);
                    }
                    $q->orWhere('category_id', $product->category_id);
                })
                ->where('stock', '>', 0)
                ->limit(2)
                ->get();
        }

        return response()->json([
            'success' => true,
            'product' => $product,
            'related_products' => $relatedProducts,
            'frequently_bought_together' => $frequentlyBoughtTogether,
        ]);
    }

    public function storeReview(Request $request, $productId)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $product = Product::find($productId);
        if (! $product) {
            return response()->json([
                'success' => false,
                'message' => 'Produit non trouvé.',
            ], 404);
        }

        $hasPurchased = Order::where('user_id', $request->user()->id)
            ->whereHas('items', fn ($q) => $q->where('product_id', $productId))
            ->exists();

        if (! $hasPurchased) {
            return response()->json([
                'success' => false,
                'message' => 'Vous devez avoir acheté ce produit pour pouvoir laisser un avis.',
            ], 403);
        }

        $review = Review::create([
            'product_id' => $product->id,
            'user_id' => $request->user()->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => "Votre avis a été soumis pour validation par l'administrateur.",
            'review' => $review->load('user'),
        ], 201);
    }

    public function testimonials()
    {
        $testimonials = Review::with(['product:id,name,image_url', 'user:id,name,email'])
            ->where('status', 'approved')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'testimonials' => $testimonials,
        ]);
    }
}
