<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('prescriptions', function (Blueprint $table) {
            if (! Schema::hasColumn('prescriptions', 'user_id')) {
                $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->onDelete('cascade');
            }
            if (! Schema::hasColumn('prescriptions', 'file_name')) {
                $table->string('file_name')->nullable()->after('fichier');
            }
        });

        // Change order_id and product_id to nullable if needed
        Schema::table('prescriptions', function (Blueprint $table) {
            $table->foreignId('order_id')->nullable()->change();
            $table->foreignId('product_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prescriptions', function (Blueprint $table) {
            if (Schema::hasColumn('prescriptions', 'user_id')) {
                $table->dropForeign(['user_id']);
                $table->dropColumn('user_id');
            }
            if (Schema::hasColumn('prescriptions', 'file_name')) {
                $table->dropColumn('file_name');
            }
        });
    }
};
