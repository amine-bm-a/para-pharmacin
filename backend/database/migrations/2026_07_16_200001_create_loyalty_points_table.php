<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loyalty_points', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('order_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('type', ['earn', 'spend', 'referral', 'expire', 'admin'])->default('earn');
            $table->integer('points'); // positive = gain, negative = spend
            $table->integer('balance_before')->default(0);
            $table->integer('balance_after')->default(0);
            $table->string('description');
            $table->timestamp('expires_at')->nullable(); // 1 year from earn date
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
            $table->index(['user_id', 'expires_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loyalty_points');
    }
};
