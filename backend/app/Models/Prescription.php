<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Prescription extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'fichier',
        'statut',
        'commentaire_pharmacien',
        'validé_par',
        'date',
    ];

    protected $casts = [
        'date' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function validator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'validé_par');
    }
}
