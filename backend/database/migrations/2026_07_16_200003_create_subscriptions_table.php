<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('status', ['active', 'paused', 'cancelled'])->default('active');
            $table->enum('frequency', ['weekly', 'biweekly', 'monthly'])->default('monthly');
            $table->string('shipping_address');
            $table->string('shipping_city');
            $table->string('postal_code');
            $table->string('phone_number');
            $table->string('payment_method')->default('delivery');
            $table->unsignedTinyInteger('discount_percent')->default(5);
            $table->timestamp('next_renewal_at');
            $table->timestamp('last_renewed_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'next_renewal_at']);
        });

        Schema::create('subscription_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('quantity')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_items');
        Schema::dropIfExists('subscriptions');
    }
};
