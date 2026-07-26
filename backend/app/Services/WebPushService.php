<?php

namespace App\Services;

use App\Models\PushSubscription;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * WebPushService — sends Web Push notifications via the VAPID protocol.
 *
 * Prerequisites (run once):
 *   composer require minishlink/web-push
 *
 * Until the package is installed, the service gracefully logs a warning
 * instead of crashing.
 *
 * ENV variables required in .env:
 *   VAPID_PUBLIC_KEY=...
 *   VAPID_PRIVATE_KEY=...
 *   VAPID_SUBJECT=mailto:contact@parabenmoussa.ma
 *
 * Generate keys:
 *   php artisan pwa:generate-vapid  (or use the npx web-push command)
 */
class WebPushService
{
    /**
     * Send a push notification to all subscriptions of a given user.
     *
     * @param int    $userId
     * @param string $title
     * @param array  $options  — body, icon, badge, tag, url, data, actions
     */
    public function notifyUser(int $userId, string $title, array $options = []): void
    {
        $subscriptions = PushSubscription::where('user_id', $userId)->get();

        if ($subscriptions->isEmpty()) return;

        $payload = json_encode([
            'title'   => $title,
            'body'    => $options['body']   ?? '',
            'icon'    => $options['icon']   ?? '/logo-192.png',
            'badge'   => $options['badge']  ?? '/logo-192.png',
            'tag'     => $options['tag']    ?? 'general',
            'url'     => $options['url']    ?? '/',
            'data'    => $options['data']   ?? [],
            'actions' => $options['actions'] ?? [],
        ]);

        foreach ($subscriptions as $sub) {
            $this->sendToSubscription($sub, $payload);
        }
    }

    /**
     * Send to all active subscriptions (broadcast, e.g. for promo alerts).
     */
    public function broadcast(string $title, array $options = []): void
    {
        $subscriptions = PushSubscription::whereNotNull('user_id')->get();
        $payload = json_encode([
            'title'   => $title,
            'body'    => $options['body']  ?? '',
            'icon'    => $options['icon']  ?? '/logo-192.png',
            'badge'   => $options['badge'] ?? '/logo-192.png',
            'tag'     => $options['tag']   ?? 'broadcast',
            'url'     => $options['url']   ?? '/',
        ]);

        foreach ($subscriptions as $sub) {
            $this->sendToSubscription($sub, $payload);
        }
    }

    private function sendToSubscription(PushSubscription $sub, string $payload): void
    {
        // Check if the minishlink/web-push package is available
        if (!class_exists(\Minishlink\WebPush\WebPush::class)) {
            Log::warning('[WebPush] Package minishlink/web-push not installed. Run: composer require minishlink/web-push');
            return;
        }

        try {
            $auth = [
                'VAPID' => [
                    'subject'    => config('app.vapid_subject', 'mailto:contact@parabenmoussa.ma'),
                    'publicKey'  => config('app.vapid_public_key'),
                    'privateKey' => config('app.vapid_private_key'),
                ],
            ];

            $webPush = new \Minishlink\WebPush\WebPush($auth);

            $subscription = \Minishlink\WebPush\Subscription::create([
                'endpoint' => $sub->endpoint,
                'keys'     => [
                    'p256dh' => $sub->p256dh,
                    'auth'   => $sub->auth,
                ],
            ]);

            $webPush->queueNotification($subscription, $payload);

            foreach ($webPush->flush() as $report) {
                if ($report->isSubscriptionExpired()) {
                    // Remove stale subscription
                    $sub->delete();
                    Log::info('[WebPush] Expired subscription removed: ' . $sub->endpoint);
                } elseif (!$report->isSuccess()) {
                    Log::warning('[WebPush] Failed to send: ' . $report->getReason());
                } else {
                    $sub->update(['last_used_at' => now()]);
                }
            }
        } catch (\Throwable $e) {
            Log::error('[WebPush] Exception: ' . $e->getMessage());
        }
    }
}
