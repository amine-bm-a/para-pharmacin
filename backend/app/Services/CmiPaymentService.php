<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class CmiPaymentService
{
    /**
     * Get CMI parameters for the HTML redirection form.
     */
    public static function getPaymentParameters(string $orderNumber, float $amount, string $email): array
    {
        $clientId = config('services.cmi.client_id');
        $storeKey = config('services.cmi.store_key');
        $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
        $okUrl = $frontendUrl.'/mes-commandes?payment=success&oid='.urlencode($orderNumber);
        $failUrl = $frontendUrl.'/checkout?payment=failed&oid='.urlencode($orderNumber);
        $callbackUrl = config('app.url').'/api/payment/cmi/callback';

        $params = [
            'clientid' => $clientId,
            'amount' => number_format($amount, 2, '.', ''),
            'okUrl' => $okUrl,
            'failUrl' => $failUrl,
            'shopurl' => config('app.frontend_url', 'http://localhost:3000').'/panier',
            'TransactionType' => 'Sale',
            'callbackUrl' => $callbackUrl,
            'rnd' => now()->timestamp.rand(1000, 9999),
            'storetype' => '3D_PAY_HOSTING',
            'currency' => '504', // Code MAD (Dirham Marocain)
            'oid' => $orderNumber,
            'email' => $email,
            'lang' => 'fr',
            'hashAlgorithm' => 'ver3',
        ];

        $params['hash'] = self::generateHash($params, $storeKey);

        return $params;
    }

    /**
     * Validate the webhook signature sent by CMI callback.
     */
    public static function validateCallbackSignature(array $postData): bool
    {
        if (! isset($postData['HASH'])) {
            Log::warning('CMI Webhook: HASH parameter is missing.');

            return false;
        }

        $storeKey = config('services.cmi.store_key');
        $receivedHash = $postData['HASH'];

        // Remove HASH and HASHPARAMS from parameters list to rebuild signature
        $paramsToHash = $postData;
        unset($paramsToHash['HASH']);
        unset($paramsToHash['HASHPARAMS']);

        $calculatedHash = self::generateHash($paramsToHash, $storeKey);

        if (! hash_equals($calculatedHash, $receivedHash)) {
            Log::warning('CMI Webhook: Signature mismatch.', [
                'received' => $receivedHash,
                'calculated' => $calculatedHash,
            ]);

            return false;
        }

        return true;
    }

    /**
     * Generate CMI SHA-256 base64 signature/hash.
     */
    private static function generateHash(array $params, string $storeKey): string
    {
        // 1. Convert all keys to lowercase to ensure case-insensitive alphabetical sorting
        $lowercaseParams = [];
        foreach ($params as $key => $val) {
            $lowercaseParams[strtolower($key)] = $val;
        }

        // 2. Sort keys alphabetically
        ksort($lowercaseParams);

        // 3. Escape and concatenate parameter values
        $escapedValues = [];
        foreach ($lowercaseParams as $key => $val) {
            // Null or empty parameters should not be included or should be empty string
            $val = $val ?? '';
            // Escape '\\' and '|' characters in values
            $escapedVal = str_replace('|', '\\|', str_replace('\\', '\\\\', $val));
            $escapedValues[] = $escapedVal;
        }

        // Append the store key as the final parameter
        $escapedValues[] = str_replace('|', '\\|', str_replace('\\', '\\\\', $storeKey));

        // 4. Concatenate using the pipe character
        $hashString = implode('|', $escapedValues);

        // 5. Generate SHA-256 base64 encoded hash
        return base64_encode(hash('sha256', $hashString, true));
    }
}
