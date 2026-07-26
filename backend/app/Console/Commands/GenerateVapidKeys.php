<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Minishlink\WebPush\VAPID;

/**
 * Artisan command to generate VAPID key pair for Web Push.
 *
 * Usage:
 *   php artisan pwa:generate-vapid
 *
 * Requires the minishlink/web-push package:
 *   composer require minishlink/web-push
 *
 * The command writes the keys to your .env file automatically and prints
 * the public key to copy into frontend/.env as VITE_VAPID_PUBLIC_KEY.
 */
class GenerateVapidKeys extends Command
{
    protected $signature = 'pwa:generate-vapid {--show : Only display the keys, do not write to .env}';

    protected $description = 'Generate VAPID public/private key pair for Web Push notifications';

    public function handle(): int
    {
        if (! class_exists(VAPID::class)) {
            $this->error('❌  Package minishlink/web-push is not installed.');
            $this->line('   Run: <comment>composer require minishlink/web-push</comment>');

            return self::FAILURE;
        }

        $this->info('🔑  Generating VAPID key pair...');

        try {
            $keys = VAPID::createVapidKeys();
        } catch (\Throwable $e) {
            $this->error('Key generation failed: '.$e->getMessage());

            return self::FAILURE;
        }

        $publicKey = $keys['publicKey'];
        $privateKey = $keys['privateKey'];

        $this->newLine();
        $this->table(
            ['Key', 'Value'],
            [
                ['VAPID_PUBLIC_KEY',  $publicKey],
                ['VAPID_PRIVATE_KEY', '(hidden — see .env)'],
            ]
        );

        if ($this->option('show')) {
            $this->line('VAPID_PUBLIC_KEY='.$publicKey);
            $this->line('VAPID_PRIVATE_KEY='.$privateKey);

            return self::SUCCESS;
        }

        // Write to .env
        $envPath = base_path('.env');
        if (! File::exists($envPath)) {
            $this->error('.env file not found. Create one first (cp .env.example .env).');

            return self::FAILURE;
        }

        $env = File::get($envPath);

        $env = $this->replaceOrAppend($env, 'VAPID_PUBLIC_KEY', $publicKey);
        $env = $this->replaceOrAppend($env, 'VAPID_PRIVATE_KEY', $privateKey);

        File::put($envPath, $env);

        $this->newLine();
        $this->info('✅  VAPID keys written to <comment>.env</comment>');
        $this->newLine();
        $this->line('📋  Copy this line into <comment>frontend/.env</comment>:');
        $this->line('    <comment>VITE_VAPID_PUBLIC_KEY='.$publicKey.'</comment>');
        $this->newLine();
        $this->warn('⚠️   Keep VAPID_PRIVATE_KEY secret — never expose it to the frontend!');

        return self::SUCCESS;
    }

    private function replaceOrAppend(string $env, string $key, string $value): string
    {
        $escaped = preg_quote($key, '/');

        if (preg_match("/^{$escaped}=.*/m", $env)) {
            return preg_replace("/^{$escaped}=.*/m", "{$key}={$value}", $env);
        }

        return $env.PHP_EOL."{$key}={$value}";
    }
}
