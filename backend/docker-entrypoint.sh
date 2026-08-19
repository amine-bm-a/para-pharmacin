#!/bin/bash

echo "Running migrations (non-blocking)..."
php artisan migrate --force || echo "Migration warning - check manually"

echo "Starting Apache..."
exec "$@"
