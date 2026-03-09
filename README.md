# Slavic Shkaf — Cloudflare D1 + Workers Backend

## Архитектура
```
Cloudflare Pages (HTML)  ←→  Cloudflare Workers (API)  ←→  D1 (Database)
slavyanskiy-shkaf.pages.dev    slavic-shkaf-api.workers.dev    slavic-shkaf-db
```

---

## ШАГ 1 — Установка Wrangler

```bash
npm install -g wrangler
wrangler login
```

---

## ШАГ 2 — Создать D1 базу данных

```bash
wrangler d1 create slavic-shkaf-db
```

Скопируй `database_id` из вывода и вставь в `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "slavic-shkaf-db"
database_id = "СЮДА_ВСТАВИТЬ_ID"
```

---

## ШАГ 3 — Создать таблицы

```bash
# Продакшн
wrangler d1 execute slavic-shkaf-db --file=schema.sql

# Загрузить демо-данные (опционально)
wrangler d1 execute slavic-shkaf-db --file=seed.sql
```

---

## ШАГ 4 — Деплой Worker

```bash
wrangler deploy
```

После деплоя получишь URL вида:
`https://slavic-shkaf-api.YOUR_SUBDOMAIN.workers.dev`

---

## ШАГ 5 — Настроить HTML файлы

В каждом HTML файле перед `</head>` добавь:
```html
<script>
  window.API_BASE = 'https://slavic-shkaf-api.YOUR_SUBDOMAIN.workers.dev';
</script>
<script src="api.js"></script>
```

Или используй **Pages Functions** (рекомендуется):
- Положи `src/index.js` как `functions/api/[[route]].js`
- Тогда `API_BASE = ''` и нет проблем с CORS
- Worker и Pages деплоятся вместе: `wrangler pages deploy`

---

## ШАГ 6 — Настроить CORS (если Worker отдельно)

В `wrangler.toml` укажи свой Pages домен:
```toml
[env.production.vars]
ALLOWED_ORIGIN = "https://slavyanskiy-shkaf.pages.dev"
```

---

## ⚠️ ВАЖНО: данные не пропадут при обновлении кода

D1 — это отдельная база данных, никак не связанная с кодом.
При `wrangler deploy` (обновление воркера) или обновлении HTML файлов
**данные в D1 НЕ удаляются и НЕ изменяются**.

TOP-позиции, анкеты мастеров, заявки — всё сохраняется.

Если нужно изменить структуру таблиц — используй только `ALTER TABLE`:
```sql
-- Пример: добавить поле
ALTER TABLE users ADD COLUMN new_field TEXT;
-- НЕ пересоздавай таблицы через DROP + CREATE!
```

---

## API Endpoints

| Method | Path | Описание |
|--------|------|----------|
| POST | `/api/auth/login` | Вход |
| POST | `/api/auth/register` | Регистрация |
| GET  | `/api/auth/me` | Текущий пользователь |
| GET  | `/api/masters` | Список мастеров (фильтры: q, cat, country, city, online, sort) |
| GET  | `/api/masters/:id` | Профиль мастера + отзывы |
| PUT  | `/api/masters/:id` | Обновить профиль |
| GET  | `/api/orders` | Список заявок (фильтры: status, country, cat, client_id) |
| POST | `/api/orders` | Создать заявку |
| PUT  | `/api/orders/:id` | Обновить заявку |
| POST | `/api/orders/:id/apply` | Откликнуться |
| POST | `/api/reviews` | Оставить отзыв |
| GET  | `/api/admin/users` | Все пользователи (admin) |
| PUT  | `/api/admin/users/:id` | Редактировать пользователя (admin) |
| GET  | `/api/admin/stats` | Статистика (admin) |

---

## Локальная разработка

```bash
# Запустить воркер локально
wrangler dev

# Использовать локальную D1
wrangler dev --local
```

---

## Структура файлов

```
shkaf-worker/
├── wrangler.toml        ← конфиг воркера и D1
├── schema.sql           ← создание таблиц
├── seed.sql             ← демо-данные
├── api.js               ← JS клиент для HTML файлов
└── src/
    └── index.js         ← Worker API (все эндпоинты)
```

---

## Демо аккаунты (после seed.sql)

| Роль | Email | Пароль |
|------|-------|--------|
| Admin | admin@slavic-shkaf.eu | admin2025 |
| Master | aleksey@example.com | demo123 |
| Client | client@example.com | demo123 |
