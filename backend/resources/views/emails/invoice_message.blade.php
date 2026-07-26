<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmation de commande</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #0AA84F;">Bonjour {{ $order->user->name ?? 'Client' }},</h2>
    
    <p>Nous vous remercions pour votre confiance. Votre commande <strong>#{{ $order->order_number }}</strong> a bien été enregistrée et est en cours de traitement.</p>
    
    <div style="background-color: #F4FBF7; border-left: 4px solid #0AA84F; padding: 15px; margin: 20px 0;">
        <strong>Détails de la commande :</strong><br>
        • Numéro de commande : #{{ $order->order_number }}<br>
        • Montant Total : {{ number_format($order->total_amount, 2) }} MAD<br>
        • Mode de paiement : 
        @if($order->payment_method === 'delivery')
            Paiement à la livraison
        @elseif($order->payment_method === 'card')
            Carte bancaire (Payé en ligne)
        @else
            Retrait en pharmacie
        @endif
    </div>

    <p>Vous trouverez votre facture officielle au format PDF en pièce jointe de cet e-mail.</p>

    <p>Si vous avez des questions ou si votre commande nécessite des clarifications (notamment pour les prescriptions médicales), notre équipe reste à votre entière disposition.</p>

    <p>Cordialement,<br>
    <strong>L'équipe de la Pharmacie Benmoussa</strong></p>
</body>
</html>
