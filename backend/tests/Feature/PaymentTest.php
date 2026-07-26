<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Payment;
use App\Services\CmiPaymentService;
use App\Notifications\OrderStatusNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    private $user;
    private $order;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'role'  => 'client',
            'email' => 'client@gmail.com',
        ]);

        $category = Category::create([
            'name' => 'Soin',
            'slug' => 'soin',
        ]);

        $product = Product::create([
            'category_id' => $category->id,
            'name'        => 'Bioderma Créaline',
            'slug'        => 'bioderma-crealine',
            'brand'       => 'Bioderma',
            'price'       => 100.00,
            'stock'       => 10,
        ]);

        $this->order = Order::create([
            'order_number'     => 'CMD20260716ABCDEF',
            'user_id'          => $this->user->id,
            'shipping_address' => '123 Avenue Mohamed V',
            'shipping_city'    => 'Marrakech',
            'postal_code'      => '40000',
            'phone_number'     => '0612345678',
            'payment_method'   => 'card',
            'total_amount'     => 100.00,
            'status'           => 'pending',
            'payment_status'   => 'pending',
        ]);
    }

    public function test_cmi_payment_service_generates_valid_parameters()
    {
        $params = CmiPaymentService::getPaymentParameters(
            $this->order->order_number,
            $this->order->total_amount,
            $this->user->email
        );

        $this->assertArrayHasKey('clientid', $params);
        $this->assertArrayHasKey('amount', $params);
        $this->assertArrayHasKey('hash', $params);
        $this->assertEquals('100.00', $params['amount']);
        $this->assertEquals('CMD20260716ABCDEF', $params['oid']);
    }

    public function test_webhook_approves_payment_and_sends_invoice_mail()
    {
        Notification::fake();

        // 1. Build payment webhook request parameters
        $postData = [
            'clientid'        => '600000000',
            'amount'          => '100.00',
            'okUrl'           => 'http://localhost:3000/mes-commandes',
            'failUrl'         => 'http://localhost:3000/checkout',
            'shopurl'         => 'http://localhost:3000/panier',
            'TransactionType' => 'Sale',
            'callbackUrl'     => 'http://127.0.0.1:8000/api/payment/cmi/callback',
            'rnd'             => '1234567890',
            'storetype'       => '3D_PAY_HOSTING',
            'currency'        => '504',
            'oid'             => 'CMD20260716ABCDEF',
            'email'           => 'client@gmail.com',
            'lang'            => 'fr',
            'hashAlgorithm'   => 'ver3',
            'Response'        => 'Approved',
            'TransId'         => 'CMI999888777',
        ];

        // Add correct signature hash for test store key
        $storeKey = env('CMI_STORE_KEY', 'TEST_STORE_KEY');
        
        // Emulate generateHash logic
        $lowercaseParams = [];
        foreach ($postData as $k => $v) {
            $lowercaseParams[strtolower($k)] = $v;
        }
        ksort($lowercaseParams);
        $escaped = [];
        foreach ($lowercaseParams as $k => $v) {
            $escaped[] = str_replace('|', '\\|', str_replace('\\', '\\\\', $v));
        }
        $escaped[] = str_replace('|', '\\|', str_replace('\\', '\\\\', $storeKey));
        $hashString = implode('|', $escaped);
        $postData['HASH'] = base64_encode(hash('sha256', $hashString, true));

        // 2. Call callback route
        $response = $this->postJson('/api/payment/cmi/callback', $postData);

        // 3. Verify response
        $response->assertStatus(200)
                 ->assertHeader('Content-Type', 'text/plain; charset=UTF-8')
                 ->assertSee('ACTION=POSTAUTH');

        // 4. Check order updated to paid
        $this->order->refresh();
        $this->assertEquals('paid', $this->order->payment_status);

        // 5. Check payment log created
        $this->assertDatabaseHas('payments', [
            'order_id'       => $this->order->id,
            'provider'       => 'cmi',
            'transaction_id' => 'CMI999888777',
            'status'         => 'success',
            'montant'        => 100.00,
        ]);

        // 6. Verify queued notification dispatched to user
        Notification::assertSentTo($this->user, OrderStatusNotification::class);
    }

    public function test_webhook_handles_failed_payment()
    {
        Notification::fake();

        $postData = [
            'clientid'        => '600000000',
            'amount'          => '100.00',
            'okUrl'           => 'http://localhost:3000/mes-commandes',
            'failUrl'         => 'http://localhost:3000/checkout',
            'shopurl'         => 'http://localhost:3000/panier',
            'TransactionType' => 'Sale',
            'callbackUrl'     => 'http://127.0.0.1:8000/api/payment/cmi/callback',
            'rnd'             => '1234567890',
            'storetype'       => '3D_PAY_HOSTING',
            'currency'        => '504',
            'oid'             => 'CMD20260716ABCDEF',
            'email'           => 'client@gmail.com',
            'lang'            => 'fr',
            'hashAlgorithm'   => 'ver3',
            'Response'        => 'Declined',
            'TransId'         => 'CMI000000000',
        ];

        $storeKey = env('CMI_STORE_KEY', 'TEST_STORE_KEY');
        $lowercaseParams = [];
        foreach ($postData as $k => $v) {
            $lowercaseParams[strtolower($k)] = $v;
        }
        ksort($lowercaseParams);
        $escaped = [];
        foreach ($lowercaseParams as $k => $v) {
            $escaped[] = str_replace('|', '\\|', str_replace('\\', '\\\\', $v));
        }
        $escaped[] = str_replace('|', '\\|', str_replace('\\', '\\\\', $storeKey));
        $hashString = implode('|', $escaped);
        $postData['HASH'] = base64_encode(hash('sha256', $hashString, true));

        $response = $this->postJson('/api/payment/cmi/callback', $postData);

        $response->assertStatus(200)
                 ->assertSee('ACTION=POSTAUTH');

        $this->order->refresh();
        $this->assertEquals('failed', $this->order->payment_status);

        $this->assertDatabaseHas('payments', [
            'order_id' => $this->order->id,
            'status'   => 'failed',
        ]);

        // On failure, no notification should be sent to client
        Notification::assertNotSentTo($this->user, OrderStatusNotification::class);
    }
}
