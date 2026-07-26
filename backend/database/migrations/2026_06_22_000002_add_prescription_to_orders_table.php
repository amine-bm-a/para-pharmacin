<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Stores the uploaded prescription file (image/PDF) when the order
            // contains at least one product flagged as requires_prescription.
            $table->string('prescription_path')->nullable()->after('payment_status');

            // Lets pharmacy staff approve/reject the prescription before
            // the order is allowed to move forward.
            $table->string('prescription_status')->nullable()->after('prescription_path');
            // null  = no prescription needed
            // pending  = uploaded, waiting for pharmacist review
            // approved = pharmacist validated it
            // rejected = pharmacist rejected it, client must re-upload
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['prescription_path', 'prescription_status']);
        });
    }
};
