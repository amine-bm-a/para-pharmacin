#!/bin/bash

set -e

echo "Cleaning up stuck tables..."
php artisan tinker --execute="
try { Illuminate\Support\Facades\DB::statement('DROP TABLE IF EXISTS push_subscriptions'); echo 'Dropped push_subscriptions\n'; } catch (Exception \$e) { echo 'No table to drop\n'; }
"

echo "Running migrations..."
php artisan migrate --force

echo "DIAGNOSTICS ---"
echo "pwd: $(pwd)"
echo "public dir: $(ls -la /var/www/html/public 2>&1 | head -20)"
echo "sites-enabled: $(ls -la /etc/nginx/sites-enabled 2>&1)"
echo "conf.d: $(ls -la /etc/nginx/conf.d 2>&1)"
nginx -t 2>&1 || true
echo "END DIAGNOSTICS ---"

echo "Starting php-fpm..."
php-fpm -D

echo "Starting nginx..."
nginx
sleep 2

echo "INTERNAL TESTS ---"
curl -s -o /dev/null -w "GET /up => %{http_code}\n" http://127.0.0.1/up
curl -s -o /dev/null -w "GET /api/products => %{http_code}\n" http://127.0.0.1/api/products
curl -s -o /dev/null -w "GET /index.php => %{http_code}\n" http://127.0.0.1/index.php
echo "END INTERNAL TESTS ---"

exec nginx -g 'daemon off;'