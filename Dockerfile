FROM php:8.2-apache

# Installer les extensions PHP
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

RUN a2enmod rewrite

# Point Apache to backend/public
ENV APACHE_DOCUMENT_ROOT /var/www/html/backend/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/conf-available/*.conf

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

# Installer Composer f backend
WORKDIR /var/www/html/backend
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chown -R www-data:www-data /var/www/html/backend/storage /var/www/html/backend/bootstrap/cache \
    && chmod -R 775 /var/www/html/backend/storage /var/www/html/backend/bootstrap/cache

EXPOSE 80

CMD php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    apache2-foreground