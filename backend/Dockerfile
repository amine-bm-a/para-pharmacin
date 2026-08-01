# 1. Image PHP officielle m3a Apache
FROM php:8.2-apache

# 2. Installer les extensions PHP nécessaires pour Laravel & MySQL
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

# 3. Activer mod_rewrite dyal Apache (Obligatoire pour les routes Laravel)
RUN a2enmod rewrite

# 4. Configurer le DocumentRoot dyal Apache vers le dossier /public dyal Laravel
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/conf-available/*.conf

# 5. Copier Composer men l-image officielle dyalo
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 6. Set le dossier de travail f le container
WORKDIR /var/www/html

# 7. Copier le projet Laravel kamel f le container
COPY . .

# 8. Installer les dépendances Composer (sans les dépendances dev pour la prod)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# 9. Dder les permissions nécessaires pour storage w bootstrap/cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# 10. Exposer le port 80 (Le port standard d'Apache)
EXPOSE 80

# 11. Script dyal Démarrage (Cache config/routes w Lancer Apache)
CMD php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    apache2-foreground