<?php

use App\Http\Controllers\AdminBannerController;
use App\Http\Controllers\AdminBrandController;
use App\Http\Controllers\AdminCouponController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminDeliveryController;
use App\Http\Controllers\AdminPromotionController;
use App\Http\Controllers\AdminReviewController;
use App\Http\Controllers\AdminStockController;
use App\Http\Controllers\AdminSubCategoryController;
use App\Http\Controllers\AdminSupplierController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomepageSettingController;
use App\Http\Controllers\LoyaltyController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PharmacienController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PushSubscriptionController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('/verify-2fa', [AuthController::class, 'verify2fa'])->middleware('throttle:5,1');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:3,1');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:5,1');
Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:3,1');

// CMI Webhook Callback (must be public as it is called server-to-server by CMI)
Route::post('/payment/cmi/callback', [PaymentController::class, 'handleCallback']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/brands', [BrandController::class, 'index']);
Route::get('/products/search/autocomplete', [ProductController::class, 'autocomplete']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::post('/coupons/validate', [AdminCouponController::class, 'validate'])->middleware('throttle:15,1');

// New Homepage CMS Public Routes
Route::get('/banners', [AdminBannerController::class, 'publicIndex']);
Route::get('/testimonials', [ProductController::class, 'testimonials']);
Route::get('/blog/articles', [BlogController::class, 'index']);
Route::get('/blog/articles/{slug}', [BlogController::class, 'show']);
Route::get('/partners', [PartnerController::class, 'index']);
Route::get('/settings', [HomepageSettingController::class, 'getAllSettings']);
Route::get('/settings/{key}', [HomepageSettingController::class, 'getSetting']);

// Protected Routes (Clients & Admins)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/password', [AuthController::class, 'updatePassword']);
    Route::get('/profile/export', [AuthController::class, 'exportData']);
    Route::delete('/profile', [AuthController::class, 'deleteAccount']);

    // Client Orders
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::get('/orders/{id}/prescription', [OrderController::class, 'downloadPrescription']);
    Route::get('/orders/{id}/invoice', [OrderController::class, 'downloadInvoice']);

    // Client Prescriptions
    Route::get('/prescriptions', [PrescriptionController::class, 'index']);
    Route::post('/prescriptions', [PrescriptionController::class, 'store']);
    Route::get('/prescriptions/{id}/download', [PrescriptionController::class, 'download']);

    // Product Review
    Route::post('/products/{productId}/reviews', [ProductController::class, 'storeReview']);
    Route::get('/my-reviews', [ProductController::class, 'myReviews']);

    // Admin Dashboard Routes — rate limited to 30 req/min per authenticated user
    Route::prefix('admin')->middleware(['admin', 'throttle:30,1'])->group(function () {
        Route::get('/stats', [AdminDashboardController::class, 'stats']);
        Route::get('/orders', [AdminDashboardController::class, 'orders']);
        Route::get('/orders/export', [AdminDashboardController::class, 'exportOrdersCsv']);
        Route::put('/orders/{id}', [AdminDashboardController::class, 'updateOrderStatus']);
        Route::put('/orders/{id}/prescription', [AdminDashboardController::class, 'updatePrescriptionStatus']);
        Route::get('/products', [AdminDashboardController::class, 'products']);
        Route::post('/products', [AdminDashboardController::class, 'storeProduct']);
        Route::put('/products/{id}', [AdminDashboardController::class, 'updateProduct']);
        Route::delete('/products/{id}', [AdminDashboardController::class, 'deleteProduct']);
        Route::post('/categories', [AdminDashboardController::class, 'storeCategory']);
        Route::put('/categories/{id}', [AdminDashboardController::class, 'updateCategory']);
        Route::delete('/categories/{id}', [AdminDashboardController::class, 'deleteCategory']);

        // Brands (Marques)
        Route::get('/brands', [AdminBrandController::class, 'index']);
        Route::post('/brands', [AdminBrandController::class, 'store']);
        Route::put('/brands/{id}', [AdminBrandController::class, 'update']);
        Route::delete('/brands/{id}', [AdminBrandController::class, 'destroy']);

        // Stocks
        Route::get('/stocks', [AdminStockController::class, 'index']);
        Route::put('/stocks/{id}', [AdminStockController::class, 'updateStock']);
        Route::post('/stocks/scan', [AdminStockController::class, 'scanByBarcode']);
        Route::post('/stocks/{id}/add', [AdminStockController::class, 'addStock']);

        // Moroccan medicines register (AMMPS) — searched after a failed scan
        Route::get('/ammps-search', [AdminStockController::class, 'ammpsSearch']);
        Route::post('/ammps/add', [AdminStockController::class, 'ammpsCreate']);

        // Promotions
        Route::get('/promotions', [AdminPromotionController::class, 'index']);
        Route::post('/promotions', [AdminPromotionController::class, 'store']);
        Route::put('/promotions/{id}', [AdminPromotionController::class, 'update']);
        Route::delete('/promotions/{id}', [AdminPromotionController::class, 'destroy']);

        // Banners (Bannières)
        Route::get('/banners', [AdminBannerController::class, 'index']);
        Route::post('/banners', [AdminBannerController::class, 'store']);
        Route::put('/banners/{id}', [AdminBannerController::class, 'update']);
        Route::delete('/banners/{id}', [AdminBannerController::class, 'destroy']);

        // Clients & Staff Users
        Route::get('/clients', [AdminUserController::class, 'clients']);
        Route::get('/staff', [AdminUserController::class, 'staff']);
        Route::post('/staff', [AdminUserController::class, 'storeStaff']);
        Route::put('/staff/{id}', [AdminUserController::class, 'updateStaff']);
        Route::delete('/staff/{id}', [AdminUserController::class, 'deleteStaff']);

        // Avis clients (Reviews)
        Route::get('/reviews', [AdminReviewController::class, 'index']);
        Route::put('/reviews/{id}/approve', [AdminReviewController::class, 'approve']);
        Route::put('/reviews/{id}/reject', [AdminReviewController::class, 'reject']);
        Route::put('/reviews/{id}/reply', [AdminReviewController::class, 'reply']);
        Route::delete('/reviews/{id}', [AdminReviewController::class, 'destroy']);

        // Settings, Blog, Partners, Contact Admin CMS
        Route::put('/settings/{key}', [HomepageSettingController::class, 'updateSetting']);
        Route::get('/contact-messages', [ContactController::class, 'index']);
        Route::put('/contact-messages/{id}/read', [ContactController::class, 'markAsRead']);
        Route::delete('/contact-messages/{id}', [ContactController::class, 'destroy']);

        Route::get('/blog/admin', [BlogController::class, 'adminIndex']);
        Route::post('/blog/articles', [BlogController::class, 'store']);
        Route::put('/blog/articles/{id}', [BlogController::class, 'update']);
        Route::delete('/blog/articles/{id}', [BlogController::class, 'destroy']);

        Route::get('/partners/admin', [PartnerController::class, 'adminIndex']);
        Route::post('/partners', [PartnerController::class, 'store']);
        Route::put('/partners/{id}', [PartnerController::class, 'update']);
        Route::delete('/partners/{id}', [PartnerController::class, 'destroy']);

        // Subcategories (Sous-catégories)
        Route::get('/subcategories', [AdminSubCategoryController::class, 'index']);
        Route::post('/subcategories', [AdminSubCategoryController::class, 'store']);
        Route::put('/subcategories/{id}', [AdminSubCategoryController::class, 'update']);
        Route::delete('/subcategories/{id}', [AdminSubCategoryController::class, 'destroy']);

        // Coupons
        Route::get('/coupons', [AdminCouponController::class, 'index']);
        Route::post('/coupons', [AdminCouponController::class, 'store']);
        Route::put('/coupons/{id}', [AdminCouponController::class, 'update']);
        Route::delete('/coupons/{id}', [AdminCouponController::class, 'destroy']);

        // Suppliers (Fournisseurs)
        Route::get('/suppliers', [AdminSupplierController::class, 'index']);
        Route::post('/suppliers', [AdminSupplierController::class, 'store']);
        Route::put('/suppliers/{id}', [AdminSupplierController::class, 'update']);
        Route::delete('/suppliers/{id}', [AdminSupplierController::class, 'destroy']);

        // Deliveries (Livraisons)
        Route::get('/deliveries', [AdminDeliveryController::class, 'index']);
        Route::post('/deliveries', [AdminDeliveryController::class, 'store']);
        Route::put('/deliveries/{id}', [AdminDeliveryController::class, 'update']);
        Route::delete('/deliveries/{id}', [AdminDeliveryController::class, 'destroy']);
    });

    // Wishlist Routes (Clients)
    Route::get('/wishlist', [WishlistController::class, 'index']);
    // Wait, the context does: axios.post(`/wishlist/${product.id}`) and axios.delete(`/wishlist/${product.id}`)
    Route::post('/wishlist/{productId}', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{productId}', [WishlistController::class, 'destroy']);

    // Notification Routes (Clients)
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    // Order Tracking Route (Clients)
    Route::get('/deliveries/track/{orderId}', [AdminDeliveryController::class, 'trackOrder']);

    // Loyalty & Referral Routes (Clients)
    Route::get('/loyalty', [LoyaltyController::class, 'index']);
    Route::get('/loyalty/info', [LoyaltyController::class, 'info']);
    Route::get('/referral', [LoyaltyController::class, 'referral']);

    // Subscription Routes (Clients)
    Route::get('/subscriptions', [SubscriptionController::class, 'index']);
    Route::post('/subscriptions', [SubscriptionController::class, 'store']);
    Route::put('/subscriptions/{id}', [SubscriptionController::class, 'update']);
    Route::delete('/subscriptions/{id}', [SubscriptionController::class, 'destroy']);

    // Web Push Subscriptions (PWA)
    Route::get('/push-subscriptions', [PushSubscriptionController::class, 'index']);
    Route::post('/push-subscriptions', [PushSubscriptionController::class, 'store']);
    Route::delete('/push-subscriptions/all', [PushSubscriptionController::class, 'destroyAll']);
    Route::delete('/push-subscriptions', [PushSubscriptionController::class, 'destroy']);

    // Pharmacist Routes (Pharmaciens / Employés)
    Route::prefix('pharmacien')->middleware('pharmacien')->group(function () {
        Route::get('/dashboard', [PharmacienController::class, 'dashboard']);
        Route::get('/orders', [PharmacienController::class, 'listOrders']);
        Route::put('/orders/{id}', [PharmacienController::class, 'updateOrderStatus']);
        Route::post('/scan', [PharmacienController::class, 'scanOrder']);
        Route::put('/prepare/{id}', [PharmacienController::class, 'prepareOrder']);
        Route::get('/stock', [PharmacienController::class, 'listStock']);
        Route::put('/stock/{id}', [PharmacienController::class, 'updateStock']);
        Route::get('/prescriptions/pending', [PharmacienController::class, 'listPendingPrescriptions']);
        Route::put('/prescriptions/{id}/validate', [PharmacienController::class, 'validatePrescription']);
    });
});
