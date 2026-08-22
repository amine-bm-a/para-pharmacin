<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CouponTest extends TestCase
{
    use RefreshDatabase;

    private $user;

    private $product;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create(['role' => 'client']);

        $category = Category::create([
            'name' => 'Medicaments',
            'slug' => 'medicaments',
        ]);

        $this->product = Product::create([
            'category_id' => $category->id,
            'name' => 'Doliprane 1000mg',
            'slug' => 'doliprane-1000mg',
            'brand' => 'Sanofi',
            'price' => 100.00,
            'stock' => 50,
        ]);
    }

    private function placeOrderPayload(): array
    {
        return [
            'shipping_address' => '123 Rue Test',
            'shipping_city' => 'Marrakech',
            'postal_code' => '40000',
            'phone_number' => '0612345678',
            'payment_method' => 'delivery',
            'items' => [
                ['product_id' => $this->product->id, 'quantity' => 2],
            ],
        ];
    }

    public function test_valid_percent_coupon_discounts_order_and_is_tracked()
    {
        Sanctum::actingAs($this->user);

        $coupon = Coupon::create([
            'code' => 'WELCOME10',
            'type' => 'percent',
            'value' => 10,
            'min_order' => 150,
            'usage_limit' => 5,
            'used_count' => 0,
            'is_active' => true,
        ]);

        // Validate endpoint
        $validate = $this->postJson('/api/coupons/validate', [
            'code' => 'welcome10', // lowercase must still resolve
            'amount' => 200,
        ]);
        $validate->assertOk();
        $this->assertEquals(20.0, (float) $validate->json('discount'));

        // Order creation applies the coupon
        $response = $this->postJson('/api/orders', array_merge($this->placeOrderPayload(), [
            'coupon_code' => 'WELCOME10',
        ]));

        $response->assertCreated()
            ->assertJsonPath('success', true);

        $order = $response->json('order');
        $this->assertSame('WELCOME10', $order['coupon_code']);
        $this->assertEquals(180.00, (float) $order['total_amount']);
        $this->assertEquals(20.00, (float) $order['discount_amount']);

        $this->assertDatabaseHas('coupons', [
            'id' => $coupon->id,
            'used_count' => 1,
        ]);
    }

    public function test_invalid_coupon_is_rejected_at_order_time()
    {
        Sanctum::actingAs($this->user);

        Coupon::create([
            'code' => 'EXPIRED',
            'type' => 'fixed',
            'value' => 30,
            'min_order' => 0,
            'expires_at' => now()->subDay(),
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/orders', array_merge($this->placeOrderPayload(), [
            'coupon_code' => 'EXPIRED',
        ]));

        $response->assertStatus(422)
            ->assertJsonFragment(['message' => 'Code promo invalide ou expiré.']);

        $this->assertDatabaseMissing('coupons', ['code' => 'EXPIRED', 'used_count' => 1]);
    }

    public function test_coupon_below_min_order_is_rejected()
    {
        Sanctum::actingAs($this->user);

        Coupon::create([
            'code' => 'BIG50',
            'type' => 'percent',
            'value' => 50,
            'min_order' => 500,
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/orders', array_merge($this->placeOrderPayload(), [
            'coupon_code' => 'BIG50',
        ]));

        $response->assertStatus(422);
        $this->assertStringContainsString('500', $response->json('message'));
    }
}
