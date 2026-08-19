#!/bin/bash

echo "Running migrations..."
php artisan migrate:fresh --force 2>/dev/null || php artisan migrate --force

exec "$@"
