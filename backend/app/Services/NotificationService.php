<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserNotification;
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

        foreach ($staff as $member) {
            UserNotification::create([
                'user_id' => $member->id,
                'title' => $title,
                'message' => $message,
                'type' => $type,
                'link' => $member->role === 'admin'
                    ? $link
                    : str_replace('/admin', '/pharmacien', $link),
                'is_read' => false,
            ]);
        }
    }

    /**
     * Notify all admins only — DB notification.
     */
    public static function notifyAdmins(
        string $title,
        string $message,
        string $type = 'info',
        string $link = '/admin'
    ): void {
        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            UserNotification::create([
                'user_id' => $admin->id,
                'title' => $title,
                'message' => $message,
                'type' => $type,
                'link' => $link,
                'is_read' => false,
            ]);
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
