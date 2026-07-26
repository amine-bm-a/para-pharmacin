<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class LoyaltyPoint extends Model
{
    use HasFactory;

    protected $table = 'loyalty_points';

    protected $fillable = [
        'user_id',
        'order_id',
        'type',
        'points',
        'balance_before',
        'balance_after',
        'description',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'points'     => 'integer',
    ];

    // ─── Relations ──────────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    // ─── Scopes ─────────────────────────────────────────────────────────────────

    /**
     * Earned points that haven't expired yet.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')
              ->orWhere('expires_at', '>', now());
        });
    }

    public function scopeExpired(Builder $query): Builder
    {
        return $query->whereNotNull('expires_at')
                     ->where('expires_at', '<=', now());
    }

    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    // ─── Helpers ────────────────────────────────────────────────────────────────

    /**
     * Display sign prefix for the points value.
     */
    public function getFormattedPointsAttribute(): string
    {
        return ($this->points >= 0 ? '+' : '') . $this->points . ' pts';
    }
}
