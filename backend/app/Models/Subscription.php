<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status',
        'frequency',
        'shipping_address',
        'shipping_city',
        'postal_code',
        'phone_number',
        'payment_method',
        'discount_percent',
        'next_renewal_at',
        'last_renewed_at',
    ];

    protected $casts = [
        'next_renewal_at'  => 'datetime',
        'last_renewed_at'  => 'datetime',
        'discount_percent' => 'integer',
    ];

    // ─── Relations ──────────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(SubscriptionItem::class);
    }

    // ─── Helpers ────────────────────────────────────────────────────────────────

    /**
     * Calculate the next renewal date based on frequency.
     */
    public function getNextRenewalDate(): Carbon
    {
        $base = $this->last_renewed_at ?? now();

        return match ($this->frequency) {
            'weekly'    => $base->copy()->addWeeks(1),
            'biweekly'  => $base->copy()->addWeeks(2),
            default     => $base->copy()->addMonth(), // monthly
        };
    }

    /**
     * Human-readable label for the frequency.
     */
    public function getFrequencyLabelAttribute(): string
    {
        return match ($this->frequency) {
            'weekly'   => 'Toutes les semaines',
            'biweekly' => 'Toutes les 2 semaines',
            default    => 'Chaque mois',
        };
    }

    /**
     * Human-readable status label (French).
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'active'    => 'Actif',
            'paused'    => 'En pause',
            'cancelled' => 'Annulé',
            default     => $this->status,
        };
    }

    /**
     * Whether this subscription is due for renewal.
     */
    public function isDue(): bool
    {
        return $this->status === 'active' && $this->next_renewal_at->isPast();
    }
}
