<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\Prescription;
use App\Models\Product;
use App\Models\User;
use App\Notifications\PrescriptionStatusNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PrescriptionTest extends TestCase
{
    use RefreshDatabase;

    private $client;

    private $pharmacist;

    private $productWithPresc;

    private $productNormal;

    protected function setUp(): void
    {
        parent::setUp();

        // Create client user
        $this->client = User::factory()->create([
            'role' => 'client',
            'email' => 'client@gmail.com',
            'phone' => '+212600000001',
        ]);

        // Create pharmacist user
        $this->pharmacist = User::factory()->create([
            'role' => 'pharmacien',
            'email' => 'ph@gmail.com',
        ]);

        $category = Category::create([
            'name' => 'Médicaments',
            'slug' => 'medicaments',
        ]);

        // Product requiring prescription
        $this->productWithPresc = Product::create([
            'category_id' => $category->id,
            'name' => 'Amoxicilline 500mg',
            'slug' => 'amoxicilline-500mg',
            'brand' => 'MarocPharm',
            'price' => 45.00,
            'stock' => 50,
            'requires_prescription' => true,
        ]);

        // Normal product
        $this->productNormal = Product::create([
            'category_id' => $category->id,
            'name' => 'Doliprane 1g',
            'slug' => 'doliprane-1g',
            'brand' => 'Doliprane',
            'price' => 15.00,
            'stock' => 100,
            'requires_prescription' => false,
        ]);
    }

    public function test_checkout_requires_prescription_if_product_needs_it()
    {
        $response = $this->actingAs($this->client)
            ->postJson('/api/orders', [
                'shipping_address' => '123 Boulevard Zerktouni',
                'shipping_city' => 'Casablanca',
                'postal_code' => '20000',
                'phone_number' => '+212600000001',
                'payment_method' => 'delivery',
                'items' => [
                    [
                        'product_id' => $this->productWithPresc->id,
                        'quantity' => 2,
                    ],
                ],
            ]);

        $response->assertStatus(422)
            ->assertJsonFragment([
                'message' => 'Cette commande contient un ou plusieurs médicaments soumis à ordonnance. Merci de joindre une photo ou un scan de votre ordonnance valide.',
            ]);
    }

    public function test_order_creation_creates_prescription_records()
    {
        Storage::fake('local');
        Notification::fake();

        $file = UploadedFile::fake()->create('ordonnance.pdf', 100, 'application/pdf');

        $response = $this->actingAs($this->client)
            ->postJson('/api/orders', [
                'shipping_address' => '123 Boulevard Zerktouni',
                'shipping_city' => 'Casablanca',
                'postal_code' => '20000',
                'phone_number' => '+212600000001',
                'payment_method' => 'delivery',
                'prescription_file' => $file,
                'items' => [
                    [
                        'product_id' => $this->productWithPresc->id,
                        'quantity' => 2,
                    ],
                    [
                        'product_id' => $this->productNormal->id,
                        'quantity' => 1,
                    ],
                ],
            ]);

        $response->assertStatus(201);
        $order = Order::first();

        // Assert prescription path stored on order
        $this->assertNotNull($order->prescription_path);
        $this->assertEquals('pending', $order->prescription_status);

        // Verify that only 1 record is created in prescriptions table (since only 1 product requires it)
        $this->assertDatabaseHas('prescriptions', [
            'order_id' => $order->id,
            'product_id' => $this->productWithPresc->id,
            'statut' => 'pending',
        ]);

        $this->assertDatabaseMissing('prescriptions', [
            'order_id' => $order->id,
            'product_id' => $this->productNormal->id,
        ]);
    }

    public function test_pharmacist_can_list_pending_prescriptions()
    {
        $order = Order::create([
            'user_id' => $this->client->id,
            'order_number' => 'CMD123',
            'status' => 'pending',
            'total_amount' => 60.00,
            'shipping_address' => 'Addr',
            'shipping_city' => 'City',
            'postal_code' => '100',
            'phone_number' => '+2126',
            'payment_method' => 'delivery',
            'prescription_path' => 'prescriptions/file.jpg',
            'prescription_status' => 'pending',
        ]);

        Prescription::create([
            'order_id' => $order->id,
            'product_id' => $this->productWithPresc->id,
            'fichier' => 'prescriptions/file.jpg',
            'statut' => 'pending',
        ]);

        $response = $this->actingAs($this->pharmacist)
            ->getJson('/api/pharmacien/prescriptions/pending');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'prescriptions')
            ->assertJsonPath('prescriptions.0.product.name', 'Amoxicilline 500mg');
    }

    public function test_pharmacist_can_approve_prescription()
    {
        Notification::fake();

        $order = Order::create([
            'user_id' => $this->client->id,
            'order_number' => 'CMD123',
            'status' => 'pending',
            'total_amount' => 60.00,
            'shipping_address' => 'Addr',
            'shipping_city' => 'City',
            'postal_code' => '100',
            'phone_number' => '+2126',
            'payment_method' => 'delivery',
            'prescription_path' => 'prescriptions/file.jpg',
            'prescription_status' => 'pending',
        ]);

        $prescription = Prescription::create([
            'order_id' => $order->id,
            'product_id' => $this->productWithPresc->id,
            'fichier' => 'prescriptions/file.jpg',
            'statut' => 'pending',
        ]);

        $response = $this->actingAs($this->pharmacist)
            ->putJson("/api/pharmacien/prescriptions/{$prescription->id}/validate", [
                'statut' => 'approved',
                'commentaire_pharmacien' => 'Ordonnance lisible et valide.',
            ]);

        $response->assertStatus(200);

        // Assert prescription model status updated
        $prescription->refresh();
        $this->assertEquals('approved', $prescription->statut);
        $this->assertEquals('Ordonnance lisible et valide.', $prescription->commentaire_pharmacien);
        $this->assertEquals($this->pharmacist->id, $prescription->validated_by);
        $this->assertNotNull($prescription->date);

        // Assert order global status is updated to approved
        $order->refresh();
        $this->assertEquals('approved', $order->prescription_status);

        // Verify queued notification is sent to customer
        Notification::assertSentTo($this->client, PrescriptionStatusNotification::class);
    }

    public function test_pharmacist_rejection_cancels_order()
    {
        Notification::fake();

        $order = Order::create([
            'user_id' => $this->client->id,
            'order_number' => 'CMD123',
            'status' => 'pending',
            'total_amount' => 60.00,
            'shipping_address' => 'Addr',
            'shipping_city' => 'City',
            'postal_code' => '100',
            'phone_number' => '+2126',
            'payment_method' => 'delivery',
            'prescription_path' => 'prescriptions/file.jpg',
            'prescription_status' => 'pending',
        ]);

        $prescription = Prescription::create([
            'order_id' => $order->id,
            'product_id' => $this->productWithPresc->id,
            'fichier' => 'prescriptions/file.jpg',
            'statut' => 'pending',
        ]);

        $response = $this->actingAs($this->pharmacist)
            ->putJson("/api/pharmacien/prescriptions/{$prescription->id}/validate", [
                'statut' => 'rejected',
                'commentaire_pharmacien' => 'Ordonnance expiree.',
            ]);

        $response->assertStatus(200);

        $order->refresh();
        $this->assertEquals('rejected', $order->prescription_status);
        $this->assertEquals('cancelled', $order->status);

        // Verify queued notification is sent to customer with the reason
        Notification::assertSentTo($this->client, PrescriptionStatusNotification::class);
    }
}
