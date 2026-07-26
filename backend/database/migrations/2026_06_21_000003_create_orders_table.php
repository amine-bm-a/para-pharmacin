<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('order_number')->unique();
            $table->string('status')->default('pending'); // pending, processing, completed, cancelled
            $table->decimal('total_amount', 10, 2);
            $table->string('shipping_address');
            $table->string('shipping_city');
            $table->string('postal_code');
            $table->string('phone_number');
            $table->string('payment_method'); // delivery (delivery at home), card (credit card), pickup (pickup in pharmacy)
            $table->string('payment_status')->default('pending'); // pending, paid, failed
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
