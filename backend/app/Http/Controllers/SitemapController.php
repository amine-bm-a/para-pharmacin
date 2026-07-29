<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Generate dynamic Google-compliant sitemap XML for products, categories, blog, and static pages.
     */
    public function index(): Response
    {
        $baseUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));

        $staticPages = [
            '/',
            '/boutique',
            '/nouveautes',
            '/promotions',
            '/blog',
            '/contact',
            '/faq',
            '/politique-de-confidentialite',
            '/cgv',
        ];

        $products = Product::where('stock', '>', 0)->select('slug', 'updated_at')->get();
        $categories = Category::select('slug', 'updated_at')->get();
        $blogPosts = BlogPost::where('is_published', true)->select('slug', 'updated_at')->get();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">'."\n";

        // Static pages
        foreach ($staticPages as $page) {
            $xml .= "  <url>\n";
            $xml .= "    <loc>{$baseUrl}{$page}</loc>\n";
            $xml .= "    <changefreq>daily</changefreq>\n";
            $xml .= "    <priority>0.8</priority>\n";
            $xml .= "  </url>\n";
        }

        // Categories
        foreach ($categories as $cat) {
            $updated = $cat->updated_at ? $cat->updated_at->toAtomString() : date('Y-m-d');
            $xml .= "  <url>\n";
            $xml .= "    <loc>{$baseUrl}/category/{$cat->slug}</loc>\n";
            $xml .= "    <lastmod>{$updated}</lastmod>\n";
            $xml .= "    <changefreq>weekly</changefreq>\n";
            $xml .= "    <priority>0.7</priority>\n";
            $xml .= "  </url>\n";
        }

        // Products
        foreach ($products as $prod) {
            $updated = $prod->updated_at ? $prod->updated_at->toAtomString() : date('Y-m-d');
            $xml .= "  <url>\n";
            $xml .= "    <loc>{$baseUrl}/products/{$prod->slug}</loc>\n";
            $xml .= "    <lastmod>{$updated}</lastmod>\n";
            $xml .= "    <changefreq>daily</changefreq>\n";
            $xml .= "    <priority>0.9</priority>\n";
            $xml .= "  </url>\n";
        }

        // Blog Posts
        foreach ($blogPosts as $post) {
            $updated = $post->updated_at ? $post->updated_at->toAtomString() : date('Y-m-d');
            $xml .= "  <url>\n";
            $xml .= "    <loc>{$baseUrl}/blog/{$post->slug}</loc>\n";
            $xml .= "    <lastmod>{$updated}</lastmod>\n";
            $xml .= "    <changefreq>weekly</changefreq>\n";
            $xml .= "    <priority>0.6</priority>\n";
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml',
        ]);
    }
}
