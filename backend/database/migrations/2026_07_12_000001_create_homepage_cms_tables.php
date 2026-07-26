<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Modify reviews table to support moderation and admin replies
        if (Schema::hasTable('reviews')) {
            Schema::table('reviews', function (Blueprint $table) {
                if (! Schema::hasColumn('reviews', 'status')) {
                    $table->string('status')->default('approved'); // default approved so existing reviews show up
                }
                if (! Schema::hasColumn('reviews', 'admin_reply')) {
                    $table->text('admin_reply')->nullable();
                }
            });
        }

        // 2. Create blog_articles table for Health & Beauty tips
        Schema::create('blog_articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category')->nullable();
            $table->text('content');
            $table->string('image_url')->nullable();
            $table->integer('read_time')->default(5); // in minutes
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        // 3. Create partners table for brand logos carousel
        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('logo_url');
            $table->integer('position')->default(0);
            $table->timestamps();
        });

        // 4. Create homepage_settings table for dynamic configurations
        Schema::create('homepage_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable(); // JSON configuration
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('homepage_settings');
        Schema::dropIfExists('partners');
        Schema::dropIfExists('blog_articles');

        if (Schema::hasTable('reviews')) {
            Schema::table('reviews', function (Blueprint $table) {
                if (Schema::hasColumn('reviews', 'status')) {
                    $table->dropColumn('status');
                }
                if (Schema::hasColumn('reviews', 'admin_reply')) {
                    $table->dropColumn('admin_reply');
                }
            });
        }
    }
};
