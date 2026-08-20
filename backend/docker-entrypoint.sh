#!/bin/bash

set -e

echo "Cleaning up stuck tables..."
php artisan tinker --execute="
try { Illuminate\Support\Facades\DB::statement('DROP TABLE IF EXISTS push_subscriptions'); echo 'Dropped push_subscriptions\n'; } catch (Exception \$e) { echo 'No table to drop\n'; }
"

echo "Running migrations..."
php artisan migrate --force

SEEDED=$(php artisan tinker --execute="echo App\Models\User::where('email', 'amine2005benm@gmail.com')->exists() ? 'YES' : 'NO';" 2>/dev/null | grep -o 'YES\|NO' | head -1)
if [ "$SEEDED" != "YES" ]; then
    echo "Seeding database..."
    php artisan db:seed --force
else
    echo "Database already seeded."
fi

echo "Starting php-fpm..."
php-fpm -D

echo "Starting nginx..."
exec nginx -g 'daemon off;'