<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Notifications\OrderStatusNotification;
use App\Services\CmiPaymentService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Webhook callback sent server-to-server by CMI to confirm transaction status.
     */
    public function handleCallback(Request $request)
    {
        Log::info('CMI Webhook Callback received.', $request->all());

        // 1. Validate signature using the shared Store Key
        if (! CmiPaymentService::validateCallbackSignature($request->all())) {
            return response('INVALID SIGNATURE', 400);
        }

        $orderNumber = $request->input('oid');
        $responseStatus = $request->input('Response');
        $transactionId = $request->input('TransId');
        $amount = (float) $request->input('amount');

        // 2. Locate the corresponding order
        $order = Order::with('user')->where('order_number', $orderNumber)->first();

        if (! $order) {
            Log::error('CMI Webhook: Order not found.', ['oid' => $orderNumber]);

            return response('ORDER NOT FOUND', 404);
        }

        // 3. Prevent duplicate processing (if already marked paid)
        if ($order->payment_status === 'paid') {
            Log::info("CMI Webhook: Order #{$orderNumber} already marked paid.");

            return response('ACTION=POSTAUTH', 200)->header('Content-Type', 'text/plain');
        }

        // 3.5 Defense-in-depth: Validate amount matches order total_amount
        if (abs($amount - (float) $order->total_amount) > 0.05) {
            Log::error('CMI Webhook: Paid amount does not match order total.', [
                'order_amount' => $order->total_amount,
                'paid_amount' => $amount,
                'order_number' => $orderNumber,
            ]);

            return response('INVALID AMOUNT', 400);
        }

        // 4. Process payment status
        if ($responseStatus === 'Approved') {
            // Update order status
            $order->update([
                'payment_status' => 'paid',
            ]);

            // Insert details into payments table
            Payment::create([
                'order_id' => $order->id,
                'provider' => 'cmi',
                'transaction_id' => $transactionId,
                'status' => 'success',
                'montant' => $amount,
                'payload' => $request->all(),
            ]);

            // Notify user inside dashboard
            NotificationService::notifyUser(
                $order->user_id,
                '💳 Paiement en ligne validé',
                "Le paiement par carte de votre commande **#{$order->order_number}** a été reçu avec succès !",
                'payment',
                '/mes-commandes'
            );

            // Dispatch queued notification (Email Invoice + SMS) to client
            try {
                if ($order->user) {
                    $order->user->notify(new OrderStatusNotification($order->load('items.product')));
                }
            } catch (\Exception $e) {
                Log::error('CMI Webhook: Failed to dispatch notification.', ['error' => $e->getMessage()]);
            }

            Log::info("CMI Webhook: Payment succeeded and invoice sent for Order #{$orderNumber}.");
        } else {
            // Payment failed or cancelled
            $order->update([
                'payment_status' => 'failed',
            ]);

            Payment::create([
                'order_id' => $order->id,
                'provider' => 'cmi',
                'transaction_id' => $transactionId,
                'status' => 'failed',
                'montant' => $amount,
                'payload' => $request->all(),
            ]);

            NotificationService::notifyUser(
                $order->user_id,
                '⚠️ Échec de paiement',
                "Le paiement par carte de votre commande **#{$order->order_number}** a échoué.",
                'payment',
                '/checkout'
            );

            Log::warning("CMI Webhook: Payment failed for Order #{$orderNumber}.");
        }

        // Exact response CMI expects to finalize/acknowledge webhook reception
        return response('ACTION=POSTAUTH', 200)->header('Content-Type', 'text/plain');
    }
}
