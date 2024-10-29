FROM php:8.3-apache

# Устанавливаем зависимости
RUN apt-get -y update && \
    apt-get -y upgrade && \
    apt-get install -y curl git

RUN docker-php-ext-install mysqli pdo pdo_mysql

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Устанавливаем Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Устанавливаем pnpm
RUN npm install -g pnpm

# Включаем модуль headers для Apache
RUN a2enmod headers

RUN a2enmod rewrite

# Добавляем настройку для папки /var/www/html
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Копируем кастомный php.ini с увеличенными лимитами и настройками логирования
COPY custom-php.ini $PHP_INI_DIR/

RUN mv "$PHP_INI_DIR/custom-php.ini" "$PHP_INI_DIR/php.ini"

# Устанавливаем рабочую директорию
WORKDIR /var/www

# Копируем файлы backend
COPY . /var/www/

# Переходим в папку с фронтендом и устанавливаем зависимости с помощью pnpm
WORKDIR /var/www/frontend
RUN pnpm install

# Собираем фронтенд с помощью pnpm
RUN pnpm build

# Переносим сборку фронтенда в директорию Apache
RUN cp -r /var/www/frontend/dist/* /var/www/html/

# Возвращаемся в основную рабочую директорию
WORKDIR /var/www

RUN chmod -R 777 /var/www/html/api/smartphones

RUN composer install

RUN composer dump-autoload

# Открываем нужные порты
EXPOSE 80

# Запуск Apache
CMD ["apache2-foreground"]

