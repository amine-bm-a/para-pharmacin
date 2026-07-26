<?php

namespace App\Mail;

use App\Models\Order;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderInvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public Order $order;

    /**
     * Create a new message instance.
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Confirmation de votre commande — Facture #'.$this->order->order_number,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.invoice_message',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        // 1. Configure Dompdf Options
        $options = new Options;
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', false); // No external resource requests for safety and speed

        // 2. Initialize Dompdf
        $dompdf = new Dompdf($options);

        // 3. Render the invoice view as HTML
        $html = view('emails.invoice', ['order' => $this->order])->render();

        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        // 4. Get the PDF binary output
        $pdfOutput = $dompdf->output();

        // 5. Attach the PDF binary as a virtual file attachment
        return [
            Attachment::fromData(fn () => $pdfOutput, "Facture-{$this->order->order_number}.pdf")
                ->withMime('application/pdf'),
        ];
    }
}
