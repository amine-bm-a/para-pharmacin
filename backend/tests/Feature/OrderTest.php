<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    private $user;

    private $product;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'role' => 'client',
        ]);

        $category = Category::create([
            'name' => 'Cosmétiques',
            'slug' => 'cosmetiques',
        ]);

        $this->product = Product::create([
            'category_id' => $category->id,
            'name' => 'Bioderma Créaline',
            'slug' => 'bioderma-crealine',
            'brand' => 'Bioderma',
            'price' => 100.00,
            'stock' => 10,
        ]);
    }

    public function test_authenticated_client_can_place_order()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/orders', [
            'shipping_address' => '123 Rue de la Liberté',
            'shipping_city' => 'Casablanca',
            'postal_code' => '20000',
            'phone_number' => '0612345678',
            'payment_method' => 'delivery',
            'items' => [
                [
                    'product_id' => $this->product->id,
                    'quantity' => 2,
                ],
            ],
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('orders', [
            'user_id' => $this->user->id,
            'shipping_city' => 'Casablanca',
            'total_amount' => 200.00,
            'payment_method' => 'delivery',
            'status' => 'pending',
        ]);

        $this->product->refresh();
        $this->assertEquals(8, $this->product->stock); // stock decr
    }

    public function test_cannot_place_order_with_insufficient_stock()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/orders', [
            'shipping_address' => '123 Rue de la Liberté',
            'shipping_city' => 'Casablanca',
            'postal_code' => '20000',
            'phone_number' => '0612345678',
            'payment_method' => 'delivery',
            'items' => [
                [
                    'product_id' => $this->product->id,
                    'quantity' => 20, // Only 10 in stock
                ],
            ],
        ]);

        $response->assertStatus(400)
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', "Le produit 'Bioderma Créaline' n'a pas assez de stock. Stock disponible: 10.");
    }

    public function test_authenticated_client_can_list_their_orders()
    {
        Sanctum::actingAs($this->user);

        $order = Order::create([
            'order_number' => 'CMD-'.rand(10000, 99999),
            'user_id' => $this->user->id,
            'shipping_address' => '123 Rue de la Liberté',
            'shipping_city' => 'Casablanca',
            'postal_code' => '20000',
            'phone_number' => '0612345678',
            'payment_method' => 'delivery',
            'total_amount' => 100.00,
            'status' => 'pending',
        ]);

        $response = $this->getJson('/api/orders');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'orders');
    }
}
