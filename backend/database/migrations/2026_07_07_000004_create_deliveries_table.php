<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->string('carrier')->default('Standard');
            $table->string('tracking_number')->nullable();
            $table->enum('status', ['pending', 'preparing', 'shipped', 'out_for_delivery', 'delivered', 'failed'])->default('pending');
            $table->decimal('cost', 8, 2)->default(0);
            $table->string('address');
            $table->string('city');
            $table->string('zip')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('deliveries');
    }
};
