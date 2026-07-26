<?php

namespace App\Http\Controllers;

use App\Models\PushSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Manages Web Push subscriptions for the authenticated user.
 *
 * POST   /push-subscriptions        — register a new subscription
 * GET    /push-subscriptions        — list user's subscriptions (for settings)
 * DELETE /push-subscriptions        — remove a specific subscription
 * DELETE /push-subscriptions/all    — remove all user subscriptions
 */
class PushSubscriptionController extends Controller
{
    /** Register (or update) a browser push subscription */
    public function store(Request $request)
    {
        $request->validate([
            'subscription' => 'required|array',
            'subscription.endpoint' => 'required|string|url',
            'subscription.keys' => 'required|array',
            'subscription.keys.p256dh' => 'required|string',
            'subscription.keys.auth' => 'required|string',
        ]);

        $sub = $request->input('subscription');

        PushSubscription::updateOrCreate(
            ['endpoint' => $sub['endpoint']],
            [
                'user_id' => Auth::id(),
                'p256dh' => $sub['keys']['p256dh'],
                'auth' => $sub['keys']['auth'],
                'user_agent' => $request->header('User-Agent'),
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Abonnement push enregistré.',
        ]);
    }

    /** List all subscriptions for the authenticated user */
    public function index()
    {
        $subscriptions = PushSubscription::where('user_id', Auth::id())
            ->select(['id', 'endpoint', 'user_agent', 'last_used_at', 'created_at'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($sub) {
                // Truncate endpoint for display
                return [
                    'id' => $sub->id,
                    'endpoint' => substr($sub->endpoint, 0, 60).'…',
                    'user_agent' => $this->parseUserAgent($sub->user_agent),
                    'last_used' => $sub->last_used_at?->diffForHumans(),
                    'created_at' => $sub->created_at->format('d/m/Y'),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $subscriptions,
        ]);
    }

    /** Unsubscribe a specific endpoint */
    public function destroy(Request $request)
    {
        $request->validate([
            'subscription' => 'required|array',
            'subscription.endpoint' => 'required|string',
        ]);

        PushSubscription::where('user_id', Auth::id())
            ->where('endpoint', $request->input('subscription.endpoint'))
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Abonnement push supprimé.',
        ]);
    }

    /** Remove ALL push subscriptions for this user */
    public function destroyAll()
    {
        PushSubscription::where('user_id', Auth::id())->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tous les abonnements push supprimés.',
        ]);
    }

    private function parseUserAgent(?string $ua): string
    {
        if (! $ua) {
            return 'Navigateur inconnu';
        }
        if (str_contains($ua, 'iPhone') || str_contains($ua, 'iPad')) {
            return '📱 Safari iOS';
        }
        if (str_contains($ua, 'Android')) {
            return '📱 Android';
        }
        if (str_contains($ua, 'Chrome')) {
            return '🖥️ Chrome';
        }
        if (str_contains($ua, 'Firefox')) {
            return '🖥️ Firefox';
        }
        if (str_contains($ua, 'Safari')) {
            return '🖥️ Safari';
        }
        if (str_contains($ua, 'Edge')) {
            return '🖥️ Edge';
        }

        return '🖥️ Navigateur';
    }
}
