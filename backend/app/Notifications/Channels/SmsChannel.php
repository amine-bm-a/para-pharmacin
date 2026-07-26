<?php

namespace App\Notifications\Channels;

use App\Services\SmsService;
use Illuminate\Notifications\Notification;

class SmsChannel
{
    /**
     * Send the given notification.
     */
    public function send(object $notifiable, Notification $notification): void
    {
        // 1. Retrieve order or default details
        $order = isset($notification->order) ? $notification->order : null;

        // 2. Resolve recipient phone number (prioritize order shipping phone number, then user profile phone)
        $to = null;
        if ($order && ! empty($order->phone_number)) {
            $to = $order->phone_number;
        } elseif (! empty($notifiable->phone)) {
            $to = $notifiable->phone;
        }

        if (! $to) {
            return;
        }

        // 3. Resolve SMS message content
        if (method_exists($notification, 'toSms')) {
            $message = $notification->toSms($notifiable);

            if (! empty($message)) {
                SmsService::sendSms($to, $message);
            }
        }
    }
}
