<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            if (!Schema::hasColumn('reviews', 'status')) {
                $table->string('status')->default('pending')->after('comment');
            }
            if (!Schema::hasColumn('reviews', 'admin_reply')) {
                $table->text('admin_reply')->nullable()->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $cols = [];
            if (Schema::hasColumn('reviews', 'status')) {
                $cols[] = 'status';
            }
            if (Schema::hasColumn('reviews', 'admin_reply')) {
                $cols[] = 'admin_reply';
            }
            if (!empty($cols)) {
                $table->dropColumn($cols);
            }
        });
    }
};
