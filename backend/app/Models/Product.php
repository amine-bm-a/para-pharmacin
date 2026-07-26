<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Product extends Model
{
    use HasFactory, Searchable;

    protected $fillable = [
        'category_id',
        'brand_id',
        'name',
        'slug',
        'brand',
        'description',
        'ingredients',
        'usage_instructions',
        'price',
        'discount_price',
        'stock',
        'image_url',
        'is_featured',
        'requires_prescription',
    ];

    protected $casts = [
        'price'                 => 'decimal:2',
        'discount_price'        => 'decimal:2',
        'stock'                 => 'integer',
        'is_featured'           => 'boolean',
        'requires_prescription' => 'boolean',
    ];

    /**
     * The name of the search index for the model.
     */
    public function searchableAs(): string
    {
        return 'products_index';
    }

    /**
     * The indexable data array for the model.
     * Scout uses these fields for full-text search.
     */
    public function toSearchableArray(): array
    {
        $array = [
            'id'             => $this->id,
            'name'           => $this->name,
            'slug'           => $this->slug,
            'brand'          => $this->brand ?? '',
            'description'    => $this->description ?? '',
            'price'          => (float) $this->price,
            'discount_price' => $this->discount_price ? (float) $this->discount_price : null,
            'stock'          => $this->stock,
            'image_url'      => $this->image_url ?? '',
            'is_featured'    => $this->is_featured,
        ];

        if (config('scout.driver') !== 'database') {
            $array['category_name'] = $this->category?->name ?? '';
        }

        return $array;
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brandRelation(): BelongsTo
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getAverageRatingAttribute(): float
    {
        return round($this->reviews()->avg('rating') ?? 0, 1);
    }

    public function prescriptions(): HasMany
    {
        return $this->hasMany(Prescription::class);
    }
}
