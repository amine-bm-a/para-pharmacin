<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('contact_person')->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // Add supplier_id to products
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('supplier_id')->nullable()->constrained('suppliers')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Drop the FK constraint by its explicit name first — dropping it
            // and the column in one call can leave the underlying index still
            // referenced by the constraint, which MySQL rejects.
            $table->dropForeign(['supplier_id']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('supplier_id');
        });

        Schema::dropIfExists('suppliers');
    }
};
