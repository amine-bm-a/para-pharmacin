<?php

namespace App\Console\Commands;

use App\Http\Controllers\SubscriptionController;
use App\Models\Subscription;
use Illuminate\Console\Command;

class RenewSubscriptions extends Command
{
    protected $signature = 'subscriptions:renew';

    protected $description = 'Process all due subscription renewals and generate orders automatically.';

    public function handle(): int
    {
        $due = Subscription::where('status', 'active')
            ->where('next_renewal_at', '<=', now())
            ->with(['user', 'items.product'])
            ->get();

        if ($due->isEmpty()) {
            $this->info('Aucun abonnement à renouveler.');

            return self::SUCCESS;
        }

        $this->info("Traitement de {$due->count()} abonnement(s)...");

        $success = 0;
        $failed = 0;

        foreach ($due as $subscription) {
            $order = SubscriptionController::renewSubscription($subscription);

            if ($order) {
                $this->info("  ✓ Abonnement #{$subscription->id} → Commande #{$order->order_number}");
                $success++;
            } else {
                $this->warn("  ✗ Abonnement #{$subscription->id} → Échec du renouvellement.");
                $failed++;
            }
        }

        $this->info("Terminé : {$success} renouvelé(s), {$failed} échec(s).");

        return self::SUCCESS;
    }
}
