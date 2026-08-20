#!/bin/bash

set -e

# Railway injects extra Apache MPM modules at runtime causing:
# AH00534: apache2: Configuration error: More than one MPM loaded.
# Fix must run at container start (after injection), not in the Dockerfile.
a2dismod mpm_event mpm_worker mpm_prefork 2>/dev/null || true
rm -f /etc/apache2/mods-enabled/mpm_event.load \
      /etc/apache2/mods-enabled/mpm_worker.load \
      /etc/apache2/mods-enabled/mpm_event.conf \
      /etc/apache2/mods-enabled/mpm_worker.conf 2>/dev/null || true
a2enmod mpm_prefork 2>/dev/null || true

echo "Cleaning up stuck tables..."
php artisan tinker --execute="
try { Illuminate\Support\Facades\DB::statement('DROP TABLE IF EXISTS push_subscriptions'); echo 'Dropped push_subscriptions\n'; } catch (Exception \$e) { echo 'No table to drop\n'; }
"

echo "Running migrations..."
php artisan migrate --force

exec "$@"
