<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_products()
    {
        $category = Category::create([
            'name' => 'Cosmétiques',
            'slug' => 'cosmetiques',
        ]);

        Product::create([
            'category_id' => $category->id,
            'name' => 'CeraVe Crème Hydratante',
            'slug' => 'cerave-creme-hydratante',
            'brand' => 'CeraVe',
            'price' => 150.00,
            'stock' => 10,
        ]);

        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'products');
    }

    public function test_can_filter_products_by_category()
    {
        $cat1 = Category::create(['name' => 'Bébé', 'slug' => 'bebe']);
        $cat2 = Category::create(['name' => 'Visage', 'slug' => 'visage']);

        Product::create([
            'category_id' => $cat1->id,
            'name' => 'Lait Bébé',
            'slug' => 'lait-bebe',
            'brand' => 'Mustela',
            'price' => 120.00,
            'stock' => 5,
        ]);

        Product::create([
            'category_id' => $cat2->id,
            'name' => 'Crème Solaire',
            'slug' => 'creme-solaire',
            'brand' => 'SVR',
            'price' => 180.00,
            'stock' => 8,
        ]);

        $response = $this->getJson('/api/products?category=bebe');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'products')
            ->assertJsonFragment(['slug' => 'lait-bebe']);
    }

    public function test_can_search_products()
    {
        $category = Category::create(['name' => 'Soin', 'slug' => 'soin']);

        Product::create([
            'category_id' => $category->id,
            'name' => 'Bioderma Créaline H2O',
            'slug' => 'bioderma-crealine-h2o',
            'brand' => 'Bioderma',
            'price' => 110.00,
            'stock' => 15,
        ]);

        $response = $this->getJson('/api/products?search=Créaline');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'products')
            ->assertJsonFragment(['slug' => 'bioderma-crealine-h2o']);
    }

    public function test_can_get_product_detail()
    {
        $category = Category::create(['name' => 'Soin', 'slug' => 'soin']);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Bioderma Créaline H2O',
            'slug' => 'bioderma-crealine-h2o',
            'brand' => 'Bioderma',
            'price' => 110.00,
            'stock' => 15,
        ]);

        $response = $this->getJson("/api/products/{$product->slug}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('product.slug', 'bioderma-crealine-h2o');
    }

    public function test_autocomplete_returns_suggestions()
    {
        $category = Category::create(['name' => 'Soin', 'slug' => 'soin']);
        Product::create([
            'category_id' => $category->id,
            'name' => 'Bioderma Créaline H2O',
            'slug' => 'bioderma-crealine',
            'brand' => 'Bioderma',
            'price' => 110.00,
            'stock' => 5,
        ]);

        $response = $this->getJson('/api/products/search/autocomplete?q=bioderma');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['success', 'suggestions' => [['id', 'name', 'slug', 'price']]]);
    }

    public function test_autocomplete_returns_empty_for_short_query()
    {
        $response = $this->getJson('/api/products/search/autocomplete?q=b');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonCount(0, 'suggestions');
    }

    public function test_can_filter_products_by_stock_availability()
    {
        $category = Category::create(['name' => 'Hygiène', 'slug' => 'hygiene']);

        Product::create([
            'category_id' => $category->id, 'name' => 'Produit En Stock', 'slug' => 'produit-en-stock',
            'brand' => 'TestBrand', 'price' => 50.00, 'stock' => 10,
        ]);
        Product::create([
            'category_id' => $category->id, 'name' => 'Produit Rupture', 'slug' => 'produit-rupture',
            'brand' => 'TestBrand', 'price' => 60.00, 'stock' => 0,
        ]);

        $response = $this->getJson('/api/products?in_stock=1');

        $response->assertStatus(200);
        $products = $response->json('products');
        $this->assertCount(1, $products);
        $this->assertEquals('produit-en-stock', $products[0]['slug']);
    }
}
