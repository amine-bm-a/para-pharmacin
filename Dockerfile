# 1. Image PHP officielle m3a Apache
FROM php:8.2-apache

# 2. Extension PHP nécessaires pour Laravel & MySQL
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    curl \
    ca-certificates \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql gd bcmath

# 3. Activer mod_rewrite dyal Apache
RUN a2enmod rewrite

# 4. Configurer le DocumentRoot dyal Apache vers /public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/conf-available/*.conf

# 5. Copier Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# 6. Copier le projet Laravel
COPY . .

# 7. Install composer dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# 8. Permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80

CMD php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    apache2-foreground