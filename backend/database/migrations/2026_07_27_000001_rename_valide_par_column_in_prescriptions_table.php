<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Renames the legacy accented column `validé_par` to the ASCII-safe
     * `validated_by`. Non-ASCII identifiers are risky across DB tools,
     * exports, and some MySQL/collation configurations, so we normalize it.
     */
    public function up(): void
    {
        if (Schema::hasColumn('prescriptions', 'validé_par') && ! Schema::hasColumn('prescriptions', 'validated_by')) {
            Schema::table('prescriptions', function (Blueprint $table) {
                $table->renameColumn('validé_par', 'validated_by');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('prescriptions', 'validated_by') && ! Schema::hasColumn('prescriptions', 'validé_par')) {
            Schema::table('prescriptions', function (Blueprint $table) {
                $table->renameColumn('validated_by', 'validé_par');
            });
        }
    }
};
