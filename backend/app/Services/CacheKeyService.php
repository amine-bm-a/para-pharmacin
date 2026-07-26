<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

/**
 * Version-based cache invalidation.
 *
 * The default cache store here is the "database" driver, which does not
 * support cache tags. Instead of tags, we keep a small "version" counter
 * per resource (products, categories, brands). Every cache key we build
 * includes the current version number. When a resource is created,
 * updated or deleted, we simply bump its version — every previously
 * cached key becomes unreachable (and expires naturally via TTL), and
 * any new read builds a fresh key that is not in cache yet.
 */
class CacheKeyService
{
    private const TTL_SECONDS = 600; // 10 minutes

    public static function ttl(): int
    {
        return self::TTL_SECONDS;
    }

    /**
     * Build a cache key for the given resource ("products", "categories", ...)
     * that includes its current version, plus any extra discriminating parts
     * (e.g. the query string of filters).
     */
    public static function key(string $resource, string $suffix = ''): string
    {
        $version = self::version($resource);

        return "cache:{$resource}:v{$version}" . ($suffix !== '' ? ":{$suffix}" : '');
    }

    public static function version(string $resource): int
    {
        return (int) Cache::rememberForever(self::versionKey($resource), fn () => 1);
    }

    /**
     * Invalidate every cached entry for a resource by bumping its version.
     */
    public static function bump(string $resource): void
    {
        Cache::increment(self::versionKey($resource));

        // Some drivers (e.g. "database") don't auto-create the key for
        // increment() if it never existed — guard against that.
        if (Cache::get(self::versionKey($resource)) === null) {
            Cache::forever(self::versionKey($resource), 2);
        }
    }

    private static function versionKey(string $resource): string
    {
        return "cache:{$resource}:version";
    }
}
