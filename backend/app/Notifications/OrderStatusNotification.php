<?php

namespace App\Notifications;

use App\Mail\OrderInvoiceMail;
use App\Models\Order;
use App\Notifications\Channels\SmsChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class OrderStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public Order $order;

    /**
     * Create a new notification instance.
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        $channels = [];

        // Send mail if email exists
        if (! empty($notifiable->email)) {
            $channels[] = 'mail';
        }

        // Send SMS if phone number exists on order or profile
        $to = $this->order->phone_number ?? $notifiable->phone ?? null;
        if (! empty($to)) {
            $channels[] = SmsChannel::class;
        }

        return $channels;
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): OrderInvoiceMail
    {
        // Return our custom Mailable instance, attaching A4 PDF Invoice automatically
        return (new OrderInvoiceMail($this->order))->to($notifiable->email);
    }

    /**
     * Get the SMS representation of the notification.
     */
    public function toSms(object $notifiable): string
    {
        $status = $this->order->status;
        $orderNum = $this->order->order_number;
        $total = number_format($this->order->total_amount, 2);

        switch ($status) {
            case 'pending':
                // Check if payment method is card and status is unpaid vs paid
                if ($this->order->payment_method === 'card' && $this->order->payment_status !== 'paid') {
                    return "Bonjour, votre commande #{$orderNum} d'un montant de {$total} MAD a bien été reçue. Paiement par carte en attente.";
                }

                return "Bonjour, votre commande #{$orderNum} d'un montant de {$total} MAD a bien été reçue et est en attente de préparation.";

            case 'preparing':
                return "Bonne nouvelle ! Votre commande #{$orderNum} est en cours de préparation par notre équipe pharmaceutique.";

            case 'shipped':
                return "Votre commande #{$orderNum} a été expédiée ! Elle est en route vers l'adresse indiquée.";

            case 'delivered':
                return "Votre commande #{$orderNum} a été livrée avec succès. Merci d'avoir choisi la Pharmacie Benmoussa !";

            case 'completed':
                return "Votre commande #{$orderNum} est maintenant complétée. Merci pour votre confiance !";

            case 'cancelled':
                return "Le statut de votre commande #{$orderNum} a été mis à jour : Annulée. Veuillez nous contacter pour plus d'informations.";

            default:
                return "Le statut de votre commande #{$orderNum} a changé : {$status}.";
        }
    }
}
