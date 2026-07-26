<?php

namespace App\Notifications;

use App\Models\Prescription;
use App\Notifications\Channels\SmsChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PrescriptionStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public Prescription $prescription;

    /**
     * Create a new notification instance.
     */
    public function __construct(Prescription $prescription)
    {
        $this->prescription = $prescription;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        $channels = [];

        if (! empty($notifiable->email)) {
            $channels[] = 'mail';
        }

        $order = $this->prescription->order;
        $to = $order->phone_number ?? $notifiable->phone ?? null;
        if (! empty($to)) {
            $channels[] = SmsChannel::class;
        }

        return $channels;
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $order = $this->prescription->order;
        $product = $this->prescription->product;
        $statut = $this->prescription->statut === 'approved' ? 'Validée' : 'Rejetée';
        $comment = $this->prescription->commentaire_pharmacien;

        $email = (new MailMessage)
            ->subject("Mise à jour de l'ordonnance — Commande #{$order->order_number}")
            ->greeting("Bonjour {$notifiable->name},")
            ->line("L'ordonnance soumise pour le produit '{$product->name}' (commande #{$order->order_number}) a été examinée par notre pharmacien.")
            ->line('Statut : '.($this->prescription->statut === 'approved' ? '✅ Validée' : '❌ Rejetée'));

        if ($comment) {
            $email->line("Commentaire du pharmacien : \"{$comment}\"");
        }

        if ($this->prescription->statut === 'rejected') {
            $email->line("En raison du rejet de cette ordonnance, cette commande a été annulée. N'hésitez pas à passer une nouvelle commande avec une ordonnance conforme.");
        } else {
            $email->line('Toutes les ordonnances requises ayant été validées, la préparation de votre commande se poursuit.');
        }

        return $email
            ->action('Voir mes commandes', url('/mes-commandes'))
            ->line('Merci de votre confiance !');
    }

    /**
     * Get the SMS representation of the notification.
     */
    public function toSms(object $notifiable): string
    {
        $order = $this->prescription->order;
        $product = $this->prescription->product;
        $statut = $this->prescription->statut === 'approved' ? 'VALIDÉE' : 'REJETÉE';
        $comment = $this->prescription->commentaire_pharmacien;

        $msg = "Pharmacie Ben Moussa : Votre ordonnance pour '{$product->name}' (cmd #{$order->order_number}) a ete {$statut}.";

        if ($comment) {
            $msg .= " Motif : {$comment}";
        }

        if ($this->prescription->statut === 'rejected') {
            $msg .= ' La commande a ete annulee.';
        }

        return $msg;
    }
}
