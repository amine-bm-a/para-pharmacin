<?php

use App\Models\SubCategory;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sub_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Add subcategory_id to products
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('sub_category_id')->nullable()->constrained('sub_categories')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Drop the FK constraint by its explicit name first — dropping it
            // and the column in one call can leave the underlying index still
            // referenced by the constraint, which MySQL rejects.
            $table->dropForeign(['sub_category_id']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('sub_category_id');
        });

        Schema::dropIfExists('sub_categories');
    }
};