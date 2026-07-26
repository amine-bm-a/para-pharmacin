<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\LoyaltyPoint;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Services\LoyaltyService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoyaltyTest extends TestCase
{
    use RefreshDatabase;

    private User $client;

    private User $referrer;

    private Product $product;

    private Order $order;

    protected function setUp(): void
    {
        parent::setUp();

        $category = Category::create(['name' => 'Médicaments', 'slug' => 'medicaments']);

        $this->product = Product::create([
            'category_id' => $category->id,
            'name' => 'Doliprane 1g',
            'slug' => 'doliprane-1g',
            'brand' => 'Sanofi',
            'price' => 100.00,
            'stock' => 100,
            'requires_prescription' => false,
        ]);

        // Referrer user (parrain)
        $this->referrer = User::factory()->create([
            'role' => 'client',
            'loyalty_points' => 0,
            'referral_code' => 'PARRAIN1',
        ]);

        // New client (filleul) referred by referrer
        $this->client = User::factory()->create([
            'role' => 'client',
            'loyalty_points' => 0,
            'referral_code' => 'FILLEUL1',
            'referred_by' => $this->referrer->id,
            'referral_bonus_granted' => false,
        ]);

        // A completed order for testing
        $this->order = Order::create([
            'user_id' => $this->client->id,
            'order_number' => 'CMD-TEST-001',
            'status' => 'delivered',
            'total_amount' => 200.00,
            'shipping_address' => '123 Rue',
            'shipping_city' => 'Casablanca',
            'postal_code' => '20000',
            'phone_number' => '+212600000001',
            'payment_method' => 'delivery',
        ]);

        OrderItem::create([
            'order_id' => $this->order->id,
            'product_id' => $this->product->id,
            'quantity' => 2,
            'price' => 100.00,
        ]);
    }

    // ── Earn Points ──────────────────────────────────────────────────────────────

    public function test_earn_points_adds_correct_amount_for_order()
    {
        LoyaltyService::earnPoints($this->client, $this->order);

        // 200 MAD * 1 point/MAD = 200 points
        $this->assertDatabaseHas('loyalty_points', [
            'user_id' => $this->client->id,
            'order_id' => $this->order->id,
            'type' => 'earn',
            'points' => 200,
        ]);

        $this->client->refresh();
        $this->assertEquals(200, $this->client->loyalty_points);
    }

    public function test_earn_points_updates_balance_before_and_after()
    {
        $this->client->update(['loyalty_points' => 50]);

        LoyaltyService::earnPoints($this->client, $this->order);

        $tx = LoyaltyPoint::where('user_id', $this->client->id)->first();
        $this->assertEquals(50, $tx->balance_before);
        $this->assertEquals(250, $tx->balance_after);
    }

    // ── Spend Points ─────────────────────────────────────────────────────────────

    public function test_spend_points_deducts_correct_amount()
    {
        $this->client->update(['loyalty_points' => 500]);

        $discount = LoyaltyService::spendPoints($this->client, 300, $this->order);

        // 300 points / 100 * 5 = 15 MAD
        $this->assertEquals(15.0, $discount);

        $this->client->refresh();
        $this->assertEquals(200, $this->client->loyalty_points);

        $this->assertDatabaseHas('loyalty_points', [
            'user_id' => $this->client->id,
            'type' => 'spend',
            'points' => -300,
        ]);
    }

    public function test_spend_points_rounds_down_to_nearest_100()
    {
        $this->client->update(['loyalty_points' => 500]);

        // Try to spend 150 (not multiple of 100) — should round down to 100
        $discount = LoyaltyService::spendPoints($this->client, 150, $this->order);

        $this->assertEquals(5.0, $discount); // 100 pts = 5 MAD

        $this->client->refresh();
        $this->assertEquals(400, $this->client->loyalty_points);
    }

    public function test_spend_points_throws_if_insufficient_balance()
    {
        $this->client->update(['loyalty_points' => 50]);

        $this->expectException(\InvalidArgumentException::class);

        LoyaltyService::spendPoints($this->client, 100, $this->order);
    }

    // ── Referral ─────────────────────────────────────────────────────────────────

    public function test_referral_bonus_credits_both_parties()
    {
        LoyaltyService::applyReferralBonus($this->client, $this->order);

        // Referrer gets 200 bonus points
        $this->referrer->refresh();
        $this->assertEquals(LoyaltyService::REFERRER_BONUS, $this->referrer->loyalty_points);

        // Referee gets 300 pts (= 15 MAD at rate 100pts/5MAD)
        $expectedRefereePts = LoyaltyService::REFEREE_DISCOUNT * (LoyaltyService::REDEEM_RATE / LoyaltyService::REDEEM_MAD);
        $this->client->refresh();
        $this->assertEquals((int) $expectedRefereePts, $this->client->loyalty_points);

        // Referee is now marked as bonus_granted
        $this->assertTrue((bool) $this->client->referral_bonus_granted);
    }

    public function test_referral_bonus_does_not_apply_twice()
    {
        $this->client->update(['referral_bonus_granted' => true]);

        LoyaltyService::applyReferralBonus($this->client, $this->order);

        // No loyalty_points records should be created
        $this->assertDatabaseMissing('loyalty_points', [
            'user_id' => $this->referrer->id,
            'type' => 'referral',
        ]);
    }

    // ── API Endpoints ─────────────────────────────────────────────────────────────

    public function test_loyalty_info_endpoint_returns_balance()
    {
        $this->client->update(['loyalty_points' => 350]);

        $response = $this->actingAs($this->client)->getJson('/api/loyalty/info');

        $response->assertStatus(200)
            ->assertJsonFragment([
                'success' => true,
                'balance' => 350,
            ])
            ->assertJsonPath('discount_value_mad', 15)  // floor(350/100)*5
            ->assertJsonPath('points_to_next', 50);       // 100 - (350 % 100)
    }

    public function test_loyalty_history_endpoint_returns_transactions()
    {
        $this->client->update(['loyalty_points' => 200]);
        LoyaltyService::earnPoints($this->client, $this->order);

        $response = $this->actingAs($this->client)->getJson('/api/loyalty');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('transactions.data.0.type', 'earn');
    }

    public function test_referral_endpoint_returns_code_and_referrals()
    {
        $response = $this->actingAs($this->referrer)->getJson('/api/referral');

        $response->assertStatus(200)
            ->assertJsonPath('referral_code', 'PARRAIN1')
            ->assertJsonPath('referrals_count', 1);
    }

    // ── Checkout Integration ──────────────────────────────────────────────────────

    public function test_checkout_applies_loyalty_discount_to_total()
    {
        $this->client->update(['loyalty_points' => 200]);

        $response = $this->actingAs($this->client)
            ->postJson('/api/orders', [
                'shipping_address' => '123 Rue',
                'shipping_city' => 'Casablanca',
                'postal_code' => '20000',
                'phone_number' => '+212600000001',
                'payment_method' => 'delivery',
                'loyalty_points_to_spend' => 200,
                'items' => [
                    ['product_id' => $this->product->id, 'quantity' => 2],
                ],
            ]);

        $response->assertStatus(201);

        // Verify that client's balance was reduced
        $this->client->refresh();
        $this->assertEquals(0, $this->client->loyalty_points);

        // Verify a spend transaction was recorded
        $this->assertDatabaseHas('loyalty_points', [
            'user_id' => $this->client->id,
            'type' => 'spend',
            'points' => -200,
        ]);
    }

    // ── Registration with referral code ──────────────────────────────────────────

    public function test_registration_with_valid_referral_code_links_user()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'newuser@gmail.com',
            'phone' => '+212600000099',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
            'referral_code' => 'PARRAIN1',
        ]);

        $response->assertStatus(201);

        $newUser = User::where('email', 'newuser@gmail.com')->first();
        $this->assertEquals($this->referrer->id, $newUser->referred_by);
        $this->assertNotNull($newUser->referral_code); // auto-generated for new user
    }

    public function test_registration_with_invalid_referral_code_fails_validation()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'newuser2@gmail.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
            'referral_code' => 'INVALID1',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['referral_code']);
    }
}
