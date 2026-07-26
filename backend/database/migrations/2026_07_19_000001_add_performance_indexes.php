<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Foreign key columns (user_id, order_id, product_id, ...) already get
     * an index automatically via ->constrained(). These are the plain
     * string/enum "status" columns that are filtered on frequently
     * (admin dashboards, order tracking, pharmacien queue) but were never
     * indexed.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->index('status');
            $table->index('payment_status');
        });

        Schema::table('prescriptions', function (Blueprint $table) {
            $table->index('statut');
        });

        Schema::table('deliveries', function (Blueprint $table) {
            $table->index('status');
        });

        Schema::table('reviews', function (Blueprint $table) {
            if (Schema::hasColumn('reviews', 'status')) {
                $table->index('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['payment_status']);
        });

        Schema::table('prescriptions', function (Blueprint $table) {
            $table->dropIndex(['statut']);
        });

        Schema::table('deliveries', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });

        Schema::table('reviews', function (Blueprint $table) {
            if (Schema::hasColumn('reviews', 'status')) {
                $table->dropIndex(['status']);
            }
        });
    }
};
