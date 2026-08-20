<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Notifications\OrderStatusNotification;
use App\Notifications\PrescriptionStatusNotification;
use App\Services\CacheKeyService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AdminDashboardController extends Controller
{
    public function stats(Request $request)
    {
        $totalOrders = Order::count();
        $totalRevenue = Order::where('status', 'completed')->sum('total_amount');
        $totalClients = User::where('role', 'client')->count();
        $totalProducts = Product::count();

        // Produits dont le stock est critique (<=10 unités)
        $lowStockProducts = Product::where('stock', '<=', 10)
            ->orderBy('stock', 'asc')
            ->limit(10)
            ->get(['id', 'name', 'stock', 'image_url']);

        // Ordonnances en attente de validation par l'admin
        $pendingPrescriptionsCount = Order::where('prescription_status', 'pending')
            ->whereNotNull('prescription_path')
            ->count();

        // Recent Orders
        $recentOrders = Order::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'client_name' => $order->user->name,
                    'date' => $order->created_at->format('d/m/Y'),
                    'total' => $order->total_amount,
                    'status' => $order->status,
                ];
            });

        // Sales for the last 7 days
        $salesChart = Order::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(total_amount) as total'),
            DB::raw('COUNT(*) as count')
        )
            ->where('created_at', '>=', now()->subDays(6))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // Top categories sales distribution (group by categories)
        $categorySales = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->select('categories.name as category_name', DB::raw('SUM(order_items.quantity * order_items.price) as total_sales'))
            ->groupBy('categories.id', 'categories.name')
            ->get();

        return response()->json([
            'success' => true,
            'stats' => [
                'orders_count' => $totalOrders,
                'revenue' => $totalRevenue,
                'clients_count' => $totalClients,
                'products_count' => $totalProducts,
                'recent_orders' => $recentOrders,
                'sales_chart' => $salesChart,
                'category_sales' => $categorySales,
                'low_stock_products' => $lowStockProducts,
                'pending_prescriptions_count' => $pendingPrescriptionsCount,
            ],
        ]);
    }

    public function orders(Request $request)
    {
        $orders = Order::with(['user', 'items.product'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'orders' => $orders,
        ]);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:pending,preparing,processing,shipped,delivered,completed,cancelled',
            'payment_status' => 'required|string|in:pending,paid,failed',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $order = Order::find($id);
        if (! $order) {
            return response()->json(['success' => false, 'message' => 'Commande non trouvée.'], 404);
        }

        $oldStatus = $order->status;
        $order->update([
            'status' => $request->status,
            'payment_status' => $request->payment_status,
        ]);

        if ($request->status === 'cancelled' && $oldStatus !== 'cancelled') {
            $order->restoreStock();
        }

        // Dispatch queued notification (in-app + Email + SMS)
        NotificationService::notifyUser(
            $order->user_id,
            '📦 Statut de votre commande mis à jour',
            "Votre commande **#{$order->order_number}** est maintenant : ".NotificationService::statusLabel($request->status),
            'order',
            '/mes-commandes'
        );

        if ($order->user) {
            try {
                $order->user->notify(new OrderStatusNotification($order->load('items.product')));
            } catch (\Exception $e) {
                Log::error('Admin status update: notification dispatch failed.', ['error' => $e->getMessage()]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Statut de la commande mis à jour avec succès.',
            'order' => $order,
        ]);
    }

    public function updatePrescriptionStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'prescription_status' => 'required|string|in:approved,rejected',
            'commentaire_pharmacien' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $order = Order::with('prescriptions')->find($id);
        if (! $order || $order->prescriptions->isEmpty()) {
            return response()->json(['success' => false, 'message' => "Cette commande n'a pas d'ordonnance à valider."], 404);
        }

        // Update all related prescriptions in the new table
        foreach ($order->prescriptions as $prescription) {
            $prescription->update([
                'statut' => $request->prescription_status,
                'commentaire_pharmacien' => $request->commentaire_pharmacien,
                'validated_by' => $request->user()->id,
                'date' => now(),
            ]);
        }

        $oldStatus = $order->status;
        $newStatus = $request->prescription_status === 'rejected' ? 'cancelled' : $order->status;

        $order->update([
            'prescription_status' => $request->prescription_status,
            'status' => $newStatus,
        ]);

        if ($newStatus === 'cancelled' && $oldStatus !== 'cancelled') {
            $order->restoreStock();
        }

        // Notify client based on prescription decision
        if ($request->prescription_status === 'approved') {
            NotificationService::notifyUser(
                $order->user_id,
                '✅ Ordonnances validées',
                "Bonne nouvelle ! Toutes les ordonnances pour votre commande **#{$order->order_number}** ont été validées. Préparation imminente !",
                'order',
                '/mes-commandes'
            );
        } else {
            NotificationService::notifyUser(
                $order->user_id,
                '❌ Ordonnances rejetées',
                "Les ordonnances pour votre commande **#{$order->order_number}** ont été refusées : {$request->commentaire_pharmacien}. La commande a été annulée.",
                'order',
                '/mes-commandes'
            );
        }

        // Send queued notification email/SMS
        if ($order->user) {
            try {
                $firstPresc = $order->prescriptions->first();
                $order->user->notify(new PrescriptionStatusNotification($firstPresc));
            } catch (\Exception $e) {
                Log::error('Admin prescription status update: notification failed.', ['error' => $e->getMessage()]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => $request->prescription_status === 'approved'
                ? 'Ordonnances validées.'
                : 'Ordonnances rejetées, le client a été notifié.',
            'order' => $order->load('prescriptions.product'),
        ]);
    }

    public function products(Request $request)
    {
        $products = Product::with('category')->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'products' => $products,
        ]);
    }

    public function storeProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'brand' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'stock' => 'required|integer|min:0',
            'barcode' => 'nullable|string|max:255|unique:products,barcode',
            'description' => 'required|string',
            'ingredients' => 'nullable|string',
            'usage_instructions' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'image_url' => 'nullable|string',
            'is_featured' => 'nullable|boolean',
            'requires_prescription' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // Handle image upload (file takes priority over URL)
        $imageUrl = $request->image_url ?? 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80';
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $imageUrl = Storage::url($path);
        }

        $product = Product::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name).'-'.rand(100, 999),
            'category_id' => $request->category_id,
            'brand_id' => $request->brand_id,
            'brand' => $request->brand,
            'price' => $request->price,
            'discount_price' => $request->discount_price ?: null,
            'stock' => $request->stock,
            'barcode' => $request->barcode ?: null,
            'description' => $request->description,
            'ingredients' => $request->ingredients,
            'usage_instructions' => $request->usage_instructions,
            'image_url' => $imageUrl,
            'is_featured' => $request->is_featured ?? false,
            'requires_prescription' => $request->requires_prescription ?? false,
        ]);

        CacheKeyService::bump('products');

        return response()->json([
            'success' => true,
            'message' => 'Produit ajouté avec succès.',
            'product' => $product,
        ], 201);
    }

    public function updateProduct(Request $request, $id)
    {
        $product = Product::find($id);
        if (! $product) {
            return response()->json(['success' => false, 'message' => 'Produit non trouvé.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'brand' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'stock' => 'required|integer|min:0',
            'barcode' => 'nullable|string|max:255|unique:products,barcode,'.$product->id,
            'description' => 'required|string',
            'ingredients' => 'nullable|string',
            'usage_instructions' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'image_url' => 'nullable|string',
            'is_featured' => 'nullable|boolean',
            'requires_prescription' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // Handle image upload (file takes priority over URL)
        $imageUrl = $product->image_url;
        if ($request->hasFile('image')) {
            // Delete old image if it was previously uploaded
            if ($product->image_url && str_contains($product->image_url, '/storage/products/')) {
                $oldPath = str_replace('/storage/', '', $product->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('products', 'public');
            $imageUrl = Storage::url($path);
        } elseif ($request->has('image_url') && $request->image_url) {
            $imageUrl = $request->image_url;
        }

        $product->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name).'-'.$product->id,
            'category_id' => $request->category_id,
            'brand_id' => $request->has('brand_id') ? $request->brand_id : $product->brand_id,
            'brand' => $request->brand,
            'price' => $request->price,
            'discount_price' => $request->has('discount_price') ? ($request->discount_price ?: null) : $product->discount_price,
            'stock' => $request->stock,
            'barcode' => $request->has('barcode') ? ($request->barcode ?: null) : $product->barcode,
            'description' => $request->description,
            'ingredients' => $request->ingredients,
            'usage_instructions' => $request->usage_instructions,
            'image_url' => $imageUrl,
            'is_featured' => $request->is_featured ?? $product->is_featured,
            'requires_prescription' => $request->has('requires_prescription') ? $request->requires_prescription : $product->requires_prescription,
        ]);

        CacheKeyService::bump('products');

        return response()->json([
            'success' => true,
            'message' => 'Produit mis à jour avec succès.',
            'product' => $product,
        ]);
    }

    public function deleteProduct(Request $request, $id)
    {
        $product = Product::find($id);
        if (! $product) {
            return response()->json(['success' => false, 'message' => 'Produit non trouvé.'], 404);
        }

        $product->delete();

        CacheKeyService::bump('products');

        return response()->json([
            'success' => true,
            'message' => 'Produit supprimé avec succès.',
        ]);
    }

    public function storeCategory(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $category = Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name).'-'.rand(100, 999),
            'description' => $request->description,
        ]);

        CacheKeyService::bump('categories');

        return response()->json([
            'success' => true,
            'message' => 'Catégorie ajoutée avec succès.',
            'category' => $category,
        ], 201);
    }

    public function updateCategory(Request $request, $id)
    {
        $category = Category::find($id);
        if (! $category) {
            return response()->json(['success' => false, 'message' => 'Catégorie non trouvée.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name,'.$category->id,
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $category->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name).'-'.$category->id,
            'description' => $request->description,
        ]);

        CacheKeyService::bump('categories');

        return response()->json([
            'success' => true,
            'message' => 'Catégorie mise à jour avec succès.',
            'category' => $category,
        ]);
    }

    public function deleteCategory(Request $request, $id)
    {
        $category = Category::find($id);
        if (! $category) {
            return response()->json(['success' => false, 'message' => 'Catégorie non trouvée.'], 404);
        }

        $productsCount = Product::where('category_id', $id)->count();
        if ($productsCount > 0) {
            return response()->json([
                'success' => false,
                'message' => "Impossible de supprimer : {$productsCount} produit(s) appartiennent encore à cette catégorie.",
            ], 422);
        }

        $category->delete();

        CacheKeyService::bump('categories');

        return response()->json([
            'success' => true,
            'message' => 'Catégorie supprimée avec succès.',
        ]);
    }
}
