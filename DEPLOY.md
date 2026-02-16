# Развёртывание Youth Bot на сервере

## Требования

- Docker и Docker Compose
- Токен бота от [@BotFather](https://t.me/BotFather)

## Установка Docker на Ubuntu

```bash
# Удалить старые версии (если есть)
sudo apt remove docker docker-engine docker.io containerd runc 2>/dev/null

# Установить зависимости
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release

# Добавить GPG-ключ и репозиторий Docker
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Установить Docker Engine и Compose
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Добавить пользователя в группу docker (чтобы не писать sudo)
sudo usermod -aG docker $USER
# Выйти из сессии и зайти снова, чтобы группа применилась
```

Проверка:
```bash
docker --version
docker compose version
```

## Развёртывание (2–3 команды)

```bash
# 1. Клонировать репозиторий
git clone <repo-url> youth_bot && cd youth_bot

# 2. Создать .env с токеном бота
echo "TOKEN=ВАШ_ТОКЕН_ОТ_BOTFATHER" > .env
# Или скопировать шаблон и отредактировать:
# cp .env.example .env && nano .env

# 3. Запустить бота
docker compose up -d
```

Бот будет работать в фоне и автоматически перезапускаться при:
- перезагрузке сервера
- падении процесса

## Управление

```bash
# Просмотр логов
docker compose logs -f bot

# Остановка
docker compose down

# Перезапуск
docker compose restart bot
```

## Переменные окружения

| Переменная | Обязательная | Описание |
|------------|--------------|----------|
| TOKEN | Да | Токен Telegram-бота |
| LOG_LEVEL | Нет | Уровень логирования: debug, info, warn, error (по умолчанию: info) |
| DATA_DIR | Нет | Каталог для admin.json, sessions.json, logs.json (в Docker: /app/data) |
| ADMIN_IDS | Нет | ID первого админа (или несколько через запятую). Используется только при пустом admin.json |

## Данные

Файлы `admin.json`, `sessions.json` и `logs.json` хранятся в Docker volume `bot_data` и сохраняются между перезапусками контейнера.

## Первый администратор

**Вариант 1 (рекомендуется):** добавьте свой Telegram user ID в `.env`:

```
ADMIN_IDS=123456789
```

Узнать свой ID: напишите боту [@userinfobot](https://t.me/userinfobot).

**Вариант 2:** создайте `admin.json` вручную в volume (см. `docker volume inspect youth_bot_bot_data`). Формат: `[123456789]`
