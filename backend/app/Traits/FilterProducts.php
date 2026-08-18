<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait FilterProducts
{
    /**
     * Apply common product filters to a query builder.
     */
    protected function applyProductFilters(
        Builder $query,
        string $category = '',
        string $brand = '',
        string $minPrice = '',
        string $maxPrice = '',
        bool $inStock = false,
        bool $promos = false,
        bool $featured = false,
        string $sort = 'popular'
    ): Builder {
        if ($category !== '') {
            $query->whereHas('category', fn ($q) => $q->where('slug', $category));
        }

        if ($brand !== '') {
            $query->whereIn('brand', explode(',', $brand));
        }

        if ($minPrice !== '') {
            $query->whereRaw('COALESCE(discount_price, price) >= ?', [$minPrice]);
        }

        if ($maxPrice !== '') {
            $query->whereRaw('COALESCE(discount_price, price) <= ?', [$maxPrice]);
        }

        if ($inStock) {
            $query->where('stock', '>', 0);
        }

        if ($promos) {
            $query->whereNotNull('discount_price');
        }

        if ($featured) {
            $query->where('is_featured', true);
        }

        switch ($sort) {
            case 'price_asc':
                $query->orderByRaw('COALESCE(discount_price, price) asc');
                break;
            case 'price_desc':
                $query->orderByRaw('COALESCE(discount_price, price) desc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            default:
                $query->orderBy('id', 'desc');
        }

        return $query;
    }
}
