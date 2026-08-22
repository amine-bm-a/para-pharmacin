<?php

namespace App\Services;

use App\Models\Product;
use App\Models\User;
use App\Models\UserNotification;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

/**
 * NotificationService — creates in-app DB notifications AND dispatches
 * browser Web Push (via WebPushService) in the same call.
 *
 * All existing callers continue to work unchanged because the method
 * signatures are backwards-compatible.
 */
class NotificationService
{
    // ─── Type → push payload map ────────────────────────────────────────────
    private static array $typeEmoji = [
        'order' => '🛒',
        'prescription' => '💊',
        'stock' => '📦',
        'promo' => '🎁',
        'loyalty' => '🌟',
        'info' => 'ℹ️',
        'warning' => '⚠️',
        'error' => '❌',
    ];

    /**
     * Notify a single user (DB + browser push).
     */
    public static function notifyUser(
        int $userId,
        string $title,
        string $message,
        string $type = 'info',
        string $link = '/'
    ): void {
        // 1. In-app (database) notification
        UserNotification::create([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'link' => $link,
            'is_read' => false,
        ]);

        // 2. Browser push notification (best-effort, never throws)
        try {
            $emoji = self::$typeEmoji[$type] ?? 'ℹ️';
            app(WebPushService::class)->notifyUser($userId, $emoji.' '.$title, [
                'body' => $message,
                'tag' => $type.'-'.$userId.'-'.time(),
                'url' => $link,
                'icon' => '/logo-192.png',
            ]);
        } catch (\Throwable $e) {
            // Log and continue — push failure must NEVER break the main flow
            Log::warning('[Push] notifyUser failed: '.$e->getMessage());
        }
    }

    /**
     * Notify all admins and employees (pharmaciens) — DB only (no push for staff).
     */
    public static function notifyAdminsAndStaff(
        string $title,
        string $message,
        string $type = 'info',
        string $link = '/admin'
    ): void {
        $staff = User::whereIn('role', ['admin', 'employe', 'pharmacien'])->get();

        $notifications = $staff->map(fn ($member) => [
            'user_id' => $member->id,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'link' => $member->role === 'admin'
                ? $link
                : str_replace('/admin', '/pharmacien', $link),
            'is_read' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ])->toArray();

        if ($notifications !== []) {
            UserNotification::insert($notifications);
        }
    }

    /**
     * Notify all admins only — DB notification (bulk insert).
     */
    public static function notifyAdmins(
        string $title,
        string $message,
        string $type = 'info',
        string $link = '/admin'
    ): void {
        $admins = User::where('role', 'admin')->get();

        $notifications = $admins->map(fn ($admin) => [
            'user_id' => $admin->id,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'link' => $link,
            'is_read' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ])->toArray();

        if ($notifications !== []) {
            UserNotification::insert($notifications);
        }
    }

    /**
     * Notify admins and staff when a product crosses into low-stock territory
     * (<= 10 units, or hits 0). Alerts are deduplicated per product per day.
     */
    public static function notifyLowStock(Product $product, int $stockBefore): void
    {
        $threshold = 10;
        $stockAfter = (int) $product->refresh()->stock;

        $enteredLowZone = $stockBefore > $threshold && $stockAfter <= $threshold;
        $hitZero = $stockAfter === 0 && $stockBefore > 0;

        if (! $enteredLowZone && ! $hitZero) {
            return;
        }

        $cacheKey = 'stock_alert:'.$product->id.':'.now()->format('Ymd');
        if (Cache::has($cacheKey)) {
            return;
        }
        Cache::put($cacheKey, true, now()->endOfDay());

        try {
            $label = $stockAfter === 0 ? 'rupture de stock' : 'stock faible';
            self::notifyAdminsAndStaff(
                '⚠️ Stock faible : '.$product->name,
                "Le produit **{$product->name}** est en {$label} ({$stockAfter} unité(s) restante(s)). Pensez à réapprovisionner.",
                'warning',
                '/admin/stocks'
            );
        } catch (\Throwable $e) {
            Log::warning('Low stock notification failed: '.$e->getMessage());
        }
    }

    /**
     * Human-readable French label for order status.
     */
    public static function statusLabel(string $status): string
    {
        $labels = [
            'pending' => '⏳ En attente de traitement',
            'preparing' => '💊 En cours de préparation',
            'shipped' => '🚚 Expédiée — en route vers vous',
            'delivered' => '✅ Livrée avec succès',
            'completed' => '✅ Complétée',
            'cancelled' => '❌ Annulée',
        ];

        return $labels[$status] ?? ucfirst($status);
    }
}
