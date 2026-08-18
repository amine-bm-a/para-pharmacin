<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->index('slug');
            $table->index('brand_id');
            $table->index('is_featured');
            $table->index('discount_price');
        });

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'referral_code')) {
                $table->index('referral_code');
            }
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->index('product_id');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['slug']);
            $table->dropIndex(['brand_id']);
            $table->dropIndex(['is_featured']);
            $table->dropIndex(['discount_price']);
        });

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'referral_code')) {
                $table->dropIndex(['referral_code']);
            }
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropIndex(['product_id']);
        });
    }
};
