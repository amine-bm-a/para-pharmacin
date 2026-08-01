
FROM php:8.2-apache
 
# 1. Update w install les dépendances système f nafs RUN (bach ma-y-w9a3ch 404 cache)
RUN apt-get update --fix-missing && apt-get install -y --no-install-recommends \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    ca-certificates \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql gd bcmath mbstring exif zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*
 
# 2. Activer mod_rewrite dyal Apache (Obligatoire pour les routes Laravel)
RUN a2enmod rewrite
 
# 3. Configurer le DocumentRoot dyal Apache
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/conf-available/*.conf
 
# 3b. Fly.io kat-forwardi trafic l port 8080 b default f template dyalha,
# walakin ghadi nkhaliw Apache khddam 3la 80 w n-configuriw fly.toml bach ydir map l 80.
# (Khass ykoun match m3a internal_port f fly.toml)
 
# 4. Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
 
WORKDIR /var/www/html
 
# 5. Copier le projet (khtar .dockerignore mzyan bach ma-tzidch vendor/.env/.git)
COPY . .
 
# 6. Install dependencies dyal Composer
RUN composer install --no-dev --optimize-autoloader --no-interaction
 
# 7. Set permissions pour Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
 
# 8. Entrypoint li kaydir cache w kayb9a Apache f foreground b grace-handling
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
 
EXPOSE 80
 
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-foreground"]