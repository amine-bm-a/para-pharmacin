<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Facture #{{ $order->order_number }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 0;
            font-size: 13px;
            line-height: 1.4;
        }
        .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 20px;
            background: #fff;
        }
        .header-table {
            width: 100%;
            margin-bottom: 30px;
            border-bottom: 2px solid #E2EFE7;
            padding-bottom: 20px;
        }
        .logo-title {
            font-size: 22px;
            font-weight: bold;
            color: #0AA84F;
            margin: 0;
        }
        .subtitle {
            font-size: 11px;
            color: #777;
            margin-top: 5px;
        }
        .meta-info {
            text-align: right;
            font-size: 12px;
        }
        .details-table {
            width: 100%;
            margin-bottom: 35px;
        }
        .details-table td {
            width: 50%;
            vertical-align: top;
        }
        .section-title {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            color: #088C41;
            margin-bottom: 8px;
            border-bottom: 1px solid #E2EFE7;
            padding-bottom: 3px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 35px;
        }
        .items-table th {
            background-color: #F4FBF7;
            border-bottom: 2px solid #0AA84F;
            color: #088C41;
            font-weight: bold;
            text-align: left;
            padding: 10px;
            font-size: 11px;
            text-transform: uppercase;
        }
        .items-table td {
            padding: 10px;
            border-bottom: 1px solid #E2EFE7;
        }
        .total-section {
            width: 100%;
        }
        .total-section td {
            text-align: right;
        }
        .total-amount {
            font-size: 16px;
            font-weight: bold;
            color: #0AA84F;
        }
        .footer {
            margin-top: 50px;
            border-top: 1px solid #E2EFE7;
            padding-top: 15px;
            text-align: center;
            font-size: 10px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="invoice-box">
        <table class="header-table">
            <tr>
                <td>
                    <h1 class="logo-title">PHARMACIE BENMOUSSA</h1>
                    <div class="subtitle">Votre santé, notre priorité absolue</div>
                    <div style="font-size: 11px; margin-top: 3px; color: #555;">
                        Marrakech, Maroc | Tél: +212 524 000 000
                    </div>
                </td>
                <td class="meta-info">
                    <h2 style="margin: 0 0 5px 0; color: #333; font-size: 18px;">FACTURE</h2>
                    <strong>N° de Commande:</strong> #{{ $order->order_number }}<br>
                    <strong>Date:</strong> {{ $order->created_at->format('d/m/Y H:i') }}<br>
                    <strong>Statut Paiement:</strong> {{ $order->payment_status === 'paid' ? 'PAYÉ' : 'EN ATTENTE' }}
                </td>
            </tr>
        </table>

        <table class="details-table">
            <tr>
                <td>
                    <div class="section-title">Facturé à:</div>
                    <strong>Nom:</strong> {{ $order->user->name ?? 'Client' }}<br>
                    <strong>Tél:</strong> {{ $order->phone_number }}<br>
                    <strong>Email:</strong> {{ $order->user->email ?? '-' }}
                </td>
                <td>
                    <div class="section-title">Adresse de Livraison:</div>
                    {{ $order->shipping_address }}<br>
                    {{ $order->postal_code }} {{ $order->shipping_city }}<br>
                    <strong>Méthode de Paiement:</strong> 
                    @if($order->payment_method === 'delivery')
                        Paiement à la livraison (Cash)
                    @elseif($order->payment_method === 'card')
                        Carte bancaire (CMI en ligne)
                    @else
                        Retrait en pharmacie
                    @endif
                </td>
            </tr>
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Produit</th>
                    <th>Marque</th>
                    <th style="text-align: right;">Prix Unitaire</th>
                    <th style="text-align: center;">Qté</th>
                    <th style="text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td>{{ $item->product->name }}</td>
                    <td>{{ $item->product->brand }}</td>
                    <td style="text-align: right;">{{ number_format($item->price, 2) }} MAD</td>
                    <td style="text-align: center;">{{ $item->quantity }}</td>
                    <td style="text-align: right;">{{ number_format($item->price * $item->quantity, 2) }} MAD</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="width: 60%; vertical-align: top;">
                    <div style="font-size: 11px; color: #666; font-style: italic; line-height: 1.5;">
                        Important: Pour les médicaments soumis à prescription, la commande reste conditionnelle à la validation définitive de votre ordonnance par notre pharmacien diplômé.
                    </div>
                </td>
                <td style="width: 40%; vertical-align: top;">
                    <table class="total-section">
                        <tr>
                            <td style="padding: 5px; color: #555;">Sous-total:</td>
                            <td style="padding: 5px; font-weight: bold; width: 120px;">{{ number_format($order->total_amount, 2) }} MAD</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px; color: #555;">Frais de livraison:</td>
                            <td style="padding: 5px; font-weight: bold;">0.00 MAD</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px; border-top: 1px solid #ddd; font-weight: bold;" class="total-amount">Total Général:</td>
                            <td style="padding: 5px; border-top: 1px solid #ddd;" class="total-amount">{{ number_format($order->total_amount, 2) }} MAD</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <div class="footer">
            Merci pour votre confiance.<br>
            Pharmacie Benmoussa — Tous droits réservés &copy; {{ date('Y') }}
        </div>
    </div>
</body>
</html>
