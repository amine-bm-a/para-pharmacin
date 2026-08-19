<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('push_subscriptions');
        Schema::create('push_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            // The unique push endpoint URL from the browser
            $table->string('endpoint', 2048);
            // VAPID encryption keys
            $table->string('p256dh', 512)->nullable();
            $table->string('auth', 255)->nullable();
            // Browser/device info for the user's settings page
            $table->string('user_agent', 512)->nullable();
            // Track when we last successfully pushed to this endpoint
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();

            // One user can have multiple subscriptions (different browsers/devices)
            // but each endpoint is globally unique
            $table->unique('endpoint', 'push_subscriptions_endpoint_unique');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('push_subscriptions');
    }
};
