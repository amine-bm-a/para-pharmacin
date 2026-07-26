<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $fillable = ['code', 'type', 'value', 'min_order', 'usage_limit', 'used_count', 'expires_at', 'is_active'];

    protected $casts = [
        'expires_at' => 'date',
        'is_active' => 'boolean',
    ];

    public function isValid(): bool
    {
        if (! $this->is_active) {
            return false;
        }
        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }
        if ($this->usage_limit && $this->used_count >= $this->usage_limit) {
            return false;
        }

        return true;
    }

    public function applyTo(float $amount): float
    {
        if ($amount < $this->min_order) {
            return $amount;
        }
        if ($this->type === 'percent') {
            return max(0, $amount - ($amount * $this->value / 100));
        }

        return max(0, $amount - $this->value);
    }
}
