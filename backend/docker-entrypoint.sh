#!/bin/sh
set -e
 
cd /var/www/html
 
# Idha APP_KEY makaynach, wlid wahda (khass ykoun 3andk secret f Fly bach ma-titbdlch f kol deploy)
if [ -z "$APP_KEY" ]; then
  echo "WARNING: APP_KEY machi mzbouta f environment. Dir 'fly secrets set APP_KEY=...'"
fi
 
# Nettoyer cache dyal l-build l9dima (idha kanet baqya f l-image)
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true
 
# 3awd dir cache jdid, walakin ma-tqad4ch l-container idha fchel
php artisan config:cache || echo "config:cache fchel, kaykml b default config"
php artisan route:cache || echo "route:cache fchel, kaykml bla cache"
php artisan view:cache || echo "view:cache fchel, kaykml bla cache"
 
# Storage link (idha khddam)
php artisan storage:link || true
 
exec "$@"