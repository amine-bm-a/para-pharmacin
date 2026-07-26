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
        $driver = env('SMS_DRIVER', 'log');

        if ($driver === 'twilio') {
            return self::sendTwilioSms($to, $message);
        }

        // Default 'log' driver: output SMS content directly to local logs
        Log::info('📨 SMS/WhatsApp SIMULATOR (driver: log)', [
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
        $sid = env('TWILIO_SID');
        $token = env('TWILIO_AUTH_TOKEN');
        $from = env('TWILIO_FROM');

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
