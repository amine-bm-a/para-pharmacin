<?php

namespace Tests\Feature;

use App\Http\Controllers\SubscriptionController;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Subscription;
use App\Models\SubscriptionItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class SubscriptionTest extends TestCase
{
    use RefreshDatabase;

    private User    $client;
    private Product $productNormal;
    private Product $productPresc;

    protected function setUp(): void
    {
        parent::setUp();

        $category = Category::create(['name' => 'Médicaments', 'slug' => 'medicaments']);

        $this->productNormal = Product::create([
            'category_id'           => $category->id,
            'name'                  => 'Doliprane 1g',
            'slug'                  => 'doliprane-1g',
            'brand'                 => 'Sanofi',
            'price'                 => 50.00,
            'stock'                 => 100,
            'requires_prescription' => false,
        ]);

        $this->productPresc = Product::create([
            'category_id'           => $category->id,
            'name'                  => 'Amoxicilline 500mg',
            'slug'                  => 'amoxicilline',
            'brand'                 => 'Generic',
            'price'                 => 80.00,
            'stock'                 => 50,
            'requires_prescription' => true,
        ]);

        $this->client = User::factory()->create([
            'role'           => 'client',
            'loyalty_points' => 0,
        ]);
    }

    // ── Create Subscription ──────────────────────────────────────────────────────

    public function test_client_can_create_a_monthly_subscription()
    {
        Notification::fake();

        $response = $this->actingAs($this->client)
            ->postJson('/api/subscriptions', [
                'frequency'        => 'monthly',
                'shipping_address' => '15 Rue Zerktouni',
                'shipping_city'    => 'Casablanca',
                'postal_code'      => '20000',
                'phone_number'     => '+212600000001',
                'payment_method'   => 'delivery',
                'items'            => [
                    ['product_id' => $this->productNormal->id, 'quantity' => 2],
                ],
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('subscription.frequency', 'monthly')
            ->assertJsonPath('subscription.status', 'active')
            ->assertJsonPath('subscription.discount_percent', 5);

        $this->assertDatabaseHas('subscriptions', [
            'user_id'   => $this->client->id,
            'frequency' => 'monthly',
            'status'    => 'active',
        ]);

        $this->assertDatabaseHas('subscription_items', [
            'product_id' => $this->productNormal->id,
            'quantity'   => 2,
        ]);
    }

    public function test_subscription_with_prescription_product_is_rejected()
    {
        $response = $this->actingAs($this->client)
            ->postJson('/api/subscriptions', [
                'frequency'        => 'monthly',
                'shipping_address' => '15 Rue Zerktouni',
                'shipping_city'    => 'Casablanca',
                'postal_code'      => '20000',
                'phone_number'     => '+212600000001',
                'payment_method'   => 'delivery',
                'items'            => [
                    ['product_id' => $this->productPresc->id, 'quantity' => 1],
                ],
            ]);

        $response->assertStatus(422)
            ->assertJsonFragment([
                'message' => 'Les médicaments sur ordonnance ne peuvent pas être ajoutés à un abonnement récurrent.',
            ]);
    }

    // ── List Subscriptions ───────────────────────────────────────────────────────

    public function test_client_can_list_their_subscriptions()
    {
        $subscription = Subscription::create([
            'user_id'          => $this->client->id,
            'status'           => 'active',
            'frequency'        => 'monthly',
            'shipping_address' => '15 Rue',
            'shipping_city'    => 'Casa',
            'postal_code'      => '20000',
            'phone_number'     => '+2126',
            'payment_method'   => 'delivery',
            'discount_percent' => 5,
            'next_renewal_at'  => now()->addMonth(),
        ]);

        SubscriptionItem::create([
            'subscription_id' => $subscription->id,
            'product_id'      => $this->productNormal->id,
            'quantity'        => 1,
        ]);

        $response = $this->actingAs($this->client)->getJson('/api/subscriptions');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'subscriptions')
            ->assertJsonPath('subscriptions.0.frequency', 'monthly');
    }

    // ── Pause / Resume ───────────────────────────────────────────────────────────

    public function test_client_can_pause_and_resume_subscription()
    {
        $subscription = Subscription::create([
            'user_id'          => $this->client->id,
            'status'           => 'active',
            'frequency'        => 'monthly',
            'shipping_address' => '15 Rue',
            'shipping_city'    => 'Casa',
            'postal_code'      => '20000',
            'phone_number'     => '+2126',
            'payment_method'   => 'delivery',
            'discount_percent' => 5,
            'next_renewal_at'  => now()->addMonth(),
        ]);

        // Pause
        $this->actingAs($this->client)
            ->putJson("/api/subscriptions/{$subscription->id}", ['status' => 'paused'])
            ->assertStatus(200)
            ->assertJsonPath('subscription.status', 'paused');

        // Resume
        $this->actingAs($this->client)
            ->putJson("/api/subscriptions/{$subscription->id}", ['status' => 'active'])
            ->assertStatus(200)
            ->assertJsonPath('subscription.status', 'active');
    }

    // ── Delete ───────────────────────────────────────────────────────────────────

    public function test_client_can_cancel_subscription()
    {
        $subscription = Subscription::create([
            'user_id'          => $this->client->id,
            'status'           => 'active',
            'frequency'        => 'weekly',
            'shipping_address' => '15 Rue',
            'shipping_city'    => 'Casa',
            'postal_code'      => '20000',
            'phone_number'     => '+2126',
            'payment_method'   => 'delivery',
            'discount_percent' => 5,
            'next_renewal_at'  => now()->addWeek(),
        ]);

        $response = $this->actingAs($this->client)
            ->deleteJson("/api/subscriptions/{$subscription->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('subscriptions', ['id' => $subscription->id]);
    }

    // ── Renewal ──────────────────────────────────────────────────────────────────

    public function test_subscription_renewal_creates_order_and_advances_date()
    {
        Notification::fake();

        $subscription = Subscription::create([
            'user_id'          => $this->client->id,
            'status'           => 'active',
            'frequency'        => 'monthly',
            'shipping_address' => '15 Rue Zerktouni',
            'shipping_city'    => 'Casablanca',
            'postal_code'      => '20000',
            'phone_number'     => '+212600000001',
            'payment_method'   => 'delivery',
            'discount_percent' => 5,
            'next_renewal_at'  => now()->subDay(), // due yesterday
        ]);

        SubscriptionItem::create([
            'subscription_id' => $subscription->id,
            'product_id'      => $this->productNormal->id,
            'quantity'        => 2,
        ]);

        $order = SubscriptionController::renewSubscription($subscription);

        $this->assertNotNull($order);
        $this->assertInstanceOf(Order::class, $order);

        // Order number should start with ABO
        $this->assertStringStartsWith('ABO', $order->order_number);

        // Total should have 5% discount applied
        $expectedTotal = 50.00 * 2 * 0.95;
        $this->assertEquals(round($expectedTotal, 2), (float)$order->total_amount);

        // Stock should have been decremented
        $this->productNormal->refresh();
        $this->assertEquals(98, $this->productNormal->stock);

        // next_renewal_at should be advanced by 1 month
        $subscription->refresh();
        $this->assertTrue($subscription->next_renewal_at->isAfter(now()));
    }

    public function test_renewal_skips_if_stock_is_insufficient()
    {
        Notification::fake();

        $this->productNormal->update(['stock' => 0]);

        $subscription = Subscription::create([
            'user_id'          => $this->client->id,
            'status'           => 'active',
            'frequency'        => 'monthly',
            'shipping_address' => '15 Rue',
            'shipping_city'    => 'Casa',
            'postal_code'      => '20000',
            'phone_number'     => '+2126',
            'payment_method'   => 'delivery',
            'discount_percent' => 5,
            'next_renewal_at'  => now()->subDay(),
        ]);

        SubscriptionItem::create([
            'subscription_id' => $subscription->id,
            'product_id'      => $this->productNormal->id,
            'quantity'        => 5,
        ]);

        $order = SubscriptionController::renewSubscription($subscription);

        // No order should have been created (all items skipped due to stock)
        $this->assertNull($order);
    }
}
