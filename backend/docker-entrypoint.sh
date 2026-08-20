#!/bin/bash

set -e

echo "Cleaning up stuck tables..."
php artisan tinker --execute="
try { Illuminate\Support\Facades\DB::statement('DROP TABLE IF EXISTS push_subscriptions'); echo 'Dropped push_subscriptions\n'; } catch (Exception \$e) { echo 'No table to drop\n'; }
"

echo "Running migrations..."
php artisan migrate --force

echo "Starting php-fpm..."
php-fpm -D

echo "Starting nginx..."
exec nginx -g 'daemon off;'