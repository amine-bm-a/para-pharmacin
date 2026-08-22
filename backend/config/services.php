<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'cmi' => [
        'client_id' => env('CMI_CLIENT_ID'),
        'store_key' => env('CMI_STORE_KEY'),
        'test_url' => env('CMI_TEST_URL', 'https://testpayment.cmi.co.ma/fim/est3Dgate'),
        'prod_url' => env('CMI_PROD_URL', 'https://payment.cmi.co.ma/fim/est3Dgate'),
    ],

    'sms' => [
        'driver' => env('SMS_DRIVER', 'log'),
        'twilio' => [
            'sid' => env('TWILIO_SID'),
            'auth_token' => env('TWILIO_AUTH_TOKEN'),
            'from' => env('TWILIO_FROM'),
            'whatsapp_from' => env('TWILIO_WHATSAPP_FROM'),
        ],
    ],

    'openfoodfacts' => [
        'base_url' => env('OPENFOODFACTS_BASE_URL', 'https://world.openfoodfacts.org'),
        'beauty_base_url' => env('OPENBEAUTYFACTS_BASE_URL', 'https://world.openbeautyfacts.org'),
        'petfood_base_url' => env('OPENPETFOODFACTS_BASE_URL', 'https://world.openpetfoodfacts.org'),
        'products_base_url' => env('OPENPRODUCTSFACTS_BASE_URL', 'https://world.openproductsfacts.org'),
        'timeout' => env('OPENFOODFACTS_TIMEOUT', 8),
    ],

    // Official Moroccan medicines register (AMMPS) — searched by name / DCI.
    // Note: the AMMPS site exposes no barcode (EAN) data and no API, so this
    // is a live HTML search used to help identify a medicine after a failed scan.
    'ammps' => [
        'base_url' => env('AMMPS_BASE_URL', 'https://www.ammps.gov.ma'),
        'timeout' => env('AMMPS_TIMEOUT', 15),
        'user_agent' => env('AMMPS_USER_AGENT', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'),
    ],

];
