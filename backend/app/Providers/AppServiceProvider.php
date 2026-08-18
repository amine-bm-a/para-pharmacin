<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->validateEnvironment();
    }

    /**
     * Validate that critical environment variables are set.
     */
    private function validateEnvironment(): void
    {
        if ($this->app->environment('production')) {
            $required = [
                'APP_KEY',
                'APP_URL',
                'FRONTEND_URL',
                'DB_HOST',
                'DB_DATABASE',
                'DB_USERNAME',
            ];

            foreach ($required as $key) {
                if (empty(config('app.'.strtolower(str_replace('_', '.', $key))))) {
                    $envValue = env($key);
                    if (empty($envValue)) {
                        throw new \RuntimeException(
                            "Missing required environment variable: {$key}. "
                            .'Please set it in your .env file.'
                        );
                    }
                }
            }
        }
    }
}
