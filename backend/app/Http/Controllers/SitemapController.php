<?php

namespace App\Http\Controllers;

use App\Models\BlogArticle;
use App\Models\Category;
use App\Models\Product;
use App\Services\CacheKeyService;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class SitemapController extends Controller
{
    /**
     * GET /sitemap.xml
     *
     * The React frontend is a client-rendered SPA hosted separately from
     * this API, so it can't generate its own sitemap at build time. This
     * endpoint builds one dynamically instead, using FRONTEND_URL as the
     * public base URL. Point your frontend host's /sitemap.xml route (a
     * rewrite/redirect rule on Vercel, Netlify, Nginx, etc.) at this
     * endpoint so search engines find it at the usual location.
     */
    public function index(): Response
    {
        $xml = Cache::remember(
            CacheKeyService::key('sitemap', 'xml'),
            CacheKeyService::ttl(),
            fn () => $this->buildXml()
        );

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }

    private function buildXml(): string
    {
        $baseUrl = rtrim(config('app.frontend_url'), '/');

        $urls = [];

        // Static pages
        foreach (['/', '/products', '/categories', '/brands', '/blog', '/contact'] as $path) {
            $urls[] = ['loc' => $baseUrl . $path, 'changefreq' => 'daily', 'priority' => '0.8'];
        }

        // Categories
        Category::select('slug', 'updated_at')->get()->each(function ($category) use (&$urls, $baseUrl) {
            $urls[] = [
                'loc' => "{$baseUrl}/categories/{$category->slug}",
                'lastmod' => optional($category->updated_at)->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.7',
            ];
        });

        // Products
        Product::select('slug', 'updated_at')->get()->each(function ($product) use (&$urls, $baseUrl) {
            $urls[] = [
                'loc' => "{$baseUrl}/products/{$product->slug}",
                'lastmod' => optional($product->updated_at)->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.9',
            ];
        });

        // Blog articles
        if (class_exists(BlogArticle::class)) {
            BlogArticle::select('slug', 'updated_at')->get()->each(function ($article) use (&$urls, $baseUrl) {
                $urls[] = [
                    'loc' => "{$baseUrl}/blog/{$article->slug}",
                    'lastmod' => optional($article->updated_at)->toAtomString(),
                    'changefreq' => 'monthly',
                    'priority' => '0.6',
                ];
            });
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($urls as $url) {
            $xml .= "  <url>\n";
            $xml .= '    <loc>' . htmlspecialchars($url['loc'], ENT_XML1) . "</loc>\n";
            if (!empty($url['lastmod'])) {
                $xml .= '    <lastmod>' . $url['lastmod'] . "</lastmod>\n";
            }
            $xml .= '    <changefreq>' . $url['changefreq'] . "</changefreq>\n";
            $xml .= '    <priority>' . $url['priority'] . "</priority>\n";
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>';

        return $xml;
    }
}
