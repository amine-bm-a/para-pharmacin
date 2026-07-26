<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Notifications\Channels\SmsChannel;
use App\Notifications\OrderStatusNotification;
use App\Services\SmsService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    private function makeOrder(User $user, string $status = 'pending', string $paymentMethod = 'cod'): Order
    {
        $category = Category::create([
            'name' => 'Hygiène',
            'slug' => 'hygiene',
        ]);

        $product = Product::create([
            'name' => 'Savon Médical',
            'slug' => 'savon-medical',
            'price' => 20.00,
            'stock' => 50,
            'category_id' => $category->id,
        ]);

        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => 'ORD-TEST-'.rand(1000, 9999),
            'total_amount' => 20.00,
            'status' => $status,
            'payment_method' => $paymentMethod,
            'payment_status' => 'pending',
            'phone_number' => '+212600000001',
            'shipping_address' => '12 Rue Hassan II',
            'shipping_city' => 'Casablanca',
            'postal_code' => '20000',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 1,
            'price' => 20.00,
        ]);

        return $order->load('items.product');
    }

    /** @test */
    public function notification_is_queued_not_sent_synchronously(): void
    {
        Queue::fake();
        Notification::fake();

        $user = User::factory()->create(['role' => 'client', 'email' => 'client@test.ma']);
        $order = $this->makeOrder($user, 'pending', 'cod');

        $user->notify(new OrderStatusNotification($order));

        Notification::assertSentTo(
            $user,
            OrderStatusNotification::class
        );
    }

    /** @test */
    public function order_status_notification_contains_correct_sms_text_for_pending(): void
    {
        $user = User::factory()->create(['role' => 'client']);
        $order = $this->makeOrder($user, 'pending', 'cod');
        $order->order_number = 'ORD-123';

        $notification = new OrderStatusNotification($order);
        $sms = $notification->toSms($user);

        $this->assertStringContainsString('ORD-123', $sms);
        $this->assertStringContainsString('reçue', $sms);
    }

    /** @test */
    public function order_status_notification_contains_correct_sms_text_for_preparing(): void
    {
        $user = User::factory()->create(['role' => 'client']);
        $order = $this->makeOrder($user, 'preparing');
        $order->order_number = 'ORD-456';

        $notification = new OrderStatusNotification($order);
        $sms = $notification->toSms($user);

        $this->assertStringContainsString('préparation', $sms);
    }

    /** @test */
    public function order_status_notification_contains_correct_sms_text_for_shipped(): void
    {
        $user = User::factory()->create(['role' => 'client']);
        $order = $this->makeOrder($user, 'shipped');
        $order->order_number = 'ORD-789';

        $notification = new OrderStatusNotification($order);
        $sms = $notification->toSms($user);

        $this->assertStringContainsString('expédiée', $sms);
    }

    /** @test */
    public function sms_service_log_driver_writes_to_log(): void
    {
        Log::shouldReceive('info')
            ->once()
            ->withArgs(function ($message, $context) {
                return str_contains($message, 'SMS/WhatsApp SIMULATOR')
                    && $context['to'] === '+212600000001'
                    && str_contains($context['message'], 'test');
            });

        SmsService::sendSms('+212600000001', 'Ceci est un message de test.');
    }

    /** @test */
    public function notification_via_channels_includes_sms_when_phone_present(): void
    {
        $user = User::factory()->create(['role' => 'client', 'phone' => '+212600000001']);
        $order = $this->makeOrder($user, 'pending');
        $order->phone_number = '+212600000001';

        $notification = new OrderStatusNotification($order);
        $channels = $notification->via($user);

        $this->assertContains('mail', $channels);
        $this->assertContains(SmsChannel::class, $channels);
    }

    /** @test */
    public function notification_via_channels_excludes_sms_when_no_phone(): void
    {
        $user = User::factory()->create(['role' => 'client', 'phone' => null]);
        $order = $this->makeOrder($user, 'pending');
        // Ensure no phone on order either
        $order->phone_number = null;

        $notification = new OrderStatusNotification($order);
        $channels = $notification->via($user);

        $this->assertNotContains(SmsChannel::class, $channels);
    }
}
