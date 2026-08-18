#!/bin/bash
set -e

echo "Running migrations..."
php artisan migrate --force

echo "Creating storage link..."
php artisan storage:link --force

echo "Clearing and caching config..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

exec "$@"
