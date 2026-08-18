<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsService
{
    /**
     * Send SMS or WhatsApp message using the configured driver.
     */
    public static function sendSms(string $to, string $message): bool
    {
        $driver = config('services.sms.driver');

        if ($driver === 'twilio') {
            return self::sendTwilioSms($to, $message);
        }

        if ($driver === 'twilio_whatsapp' || $driver === 'whatsapp') {
            return self::sendWhatsApp($to, $message);
        }

        // Default 'log' driver: output SMS content directly to local logs
        Log::info('📨 SMS/WhatsApp SIMULATOR (driver: log)', [
            'to' => $to,
            'message' => $message,
        ]);

        return true;
    }

    /**
     * Send dedicated WhatsApp notification.
     */
    public static function sendWhatsApp(string $to, string $message): bool
    {
        $driver = config('services.sms.driver');

        if ($driver === 'twilio_whatsapp' || $driver === 'twilio') {
            $sid = config('services.sms.twilio.sid');
            $token = config('services.sms.twilio.auth_token');
            $from = config('services.sms.twilio.whatsapp_from') ?? config('services.sms.twilio.from');

            if (! $sid || ! $token || ! $from) {
                Log::error('Twilio WhatsApp: Missing credentials in .env');

                return false;
            }

            // Ensure WhatsApp prefix for Twilio
            $formattedTo = str_starts_with($to, 'whatsapp:') ? $to : "whatsapp:{$to}";
            $formattedFrom = str_starts_with($from, 'whatsapp:') ? $from : "whatsapp:{$from}";

            try {
                $response = Http::asForm()
                    ->withBasicAuth($sid, $token)
                    ->post("https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json", [
                        'To' => $formattedTo,
                        'From' => $formattedFrom,
                        'Body' => $message,
                    ]);

                if ($response->successful()) {
                    Log::info("WhatsApp sent via Twilio to {$to}.", ['sid' => $response->json('sid')]);

                    return true;
                }

                Log::error("Twilio WhatsApp failed for {$to}.", ['status' => $response->status(), 'response' => $response->body()]);

                return false;
            } catch (\Exception $e) {
                Log::error('Twilio WhatsApp exception: '.$e->getMessage());

                return false;
            }
        }

        Log::info('💬 WHATSAPP SIMULATOR (driver: log)', [
            'to' => $to,
            'message' => $message,
        ]);

        return true;
    }

    /**
     * Send SMS message using Twilio REST API.
     */
    private static function sendTwilioSms(string $to, string $message): bool
    {
        $sid = config('services.sms.twilio.sid');
        $token = config('services.sms.twilio.auth_token');
        $from = config('services.sms.twilio.from');

        if (! $sid || ! $token || ! $from) {
            Log::error('Twilio SMS: Missing configuration credentials.');

            return false;
        }

        try {
            $response = Http::asForm()
                ->withBasicAuth($sid, $token)
                ->post("https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json", [
                    'To' => $to,
                    'From' => $from,
                    'Body' => $message,
                ]);

            if ($response->successful()) {
                Log::info("Twilio SMS sent successfully to {$to}.", ['sid' => $response->json('sid')]);

                return true;
            }

            Log::error("Twilio SMS request failed for {$to}.", [
                'status' => $response->status(),
                'response' => $response->body(),
            ]);

            return false;
        } catch (\Exception $e) {
            Log::error('Twilio SMS sending exception: '.$e->getMessage());

            return false;
        }
    }
}
