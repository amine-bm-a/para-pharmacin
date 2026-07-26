<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Stores Web Push subscriptions (VAPID) per user/browser.
 *
 * Columns:
 *  - user_id        FK → users (nullable for anonymous)
 *  - endpoint       unique push endpoint URL
 *  - p256dh         public key for encryption
 *  - auth           auth secret
 *  - user_agent     browser identifier (for display in settings)
 *  - last_used_at   updated each time we push to this subscription
 */
class PushSubscription extends Model
{
    protected $fillable = [
        'user_id',
        'endpoint',
        'p256dh',
        'auth',
        'user_agent',
        'last_used_at',
    ];

    protected $casts = [
        'last_used_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
