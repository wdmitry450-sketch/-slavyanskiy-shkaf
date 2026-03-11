# Slavic Shkaf — Marketplace for Tradespeople

Full-stack platform connecting Slavic-speaking tradespeople with clients across Europe.
Built for Telegram Mini App (mobile-first), deployed on Cloudflare Pages + Workers + D1.

## Architecture

```
slavic-shkaf/
├── public/               # Frontend (static files)
│   ├── index.html        # React SPA (all-in-one)
│   ├── api.js            # API client utility
│   ├── logo-closed.png   # Main logo
│   └── logo-open.png     # Master logo (open cabinet)
├── functions/            # Cloudflare Pages Functions (API)
│   └── api/
│       └── [[route]].js  # Catch-all API router
├── migrations/
│   └── 0001_init.sql     # D1 database schema
├── wrangler.toml         # Cloudflare configuration
└── package.json
```

## Features

### Users
- **Registration** with role selection (Master / Client)
- **Auth** with JWT tokens
- Full profile with documents upload
- Telegram account linking

### Masters
- Job board with search & filters by category
- Respond to orders with proposals
- Calendar for scheduling
- Messages with clients
- Premium/TOP badge system

### Clients
- Create orders (category, description, budget, deadline)
- Browse & filter master catalog by 20 categories
- View responses from masters
- Rate & review completed work

### Admin Panel
- Dashboard with statistics & charts
- User management (block/unblock, promote premium)
- Order management (set TOP/Premium)
- Broadcast messaging via Telegram bot (All / Masters / Clients)
- Reports & complaints system

### i18n
- Russian / English toggle
- All UI elements translated

## Deployment

### 1. Create Cloudflare D1 Database

```bash
npx wrangler d1 create slavic-shkaf-db
```

Copy the `database_id` and update `wrangler.toml`.

### 2. Run Database Migration

```bash
# Local development
npx wrangler d1 execute slavic-shkaf-db --local --file=./migrations/0001_init.sql

# Production
npx wrangler d1 execute slavic-shkaf-db --file=./migrations/0001_init.sql
```

### 3. Set Environment Variables

Update `wrangler.toml`:
- `JWT_SECRET` — change to a strong random string
- `TELEGRAM_BOT_TOKEN` — your bot token

### 4. Deploy to Cloudflare Pages

```bash
# Via Wrangler
npx wrangler pages deploy public

# Or connect GitHub repo in Cloudflare Dashboard:
# Build command: (none)
# Output directory: public
```

### 5. Local Development

```bash
npm install
npm run db:migrate:local
npm run dev
```

Open http://localhost:8788

## API Endpoints

### Auth
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user

### Orders
- `GET /api/orders?status=open&category=plumbing&page=1` — List orders
- `POST /api/orders` — Create order (client)
- `GET /api/orders/:id` — Get order details
- `PUT /api/orders/:id` — Update order
- `DELETE /api/orders/:id` — Delete order
- `POST /api/orders/:id/respond` — Respond to order (master)
- `GET /api/orders/:id/responses` — Get order responses

### Masters
- `GET /api/masters?category=plumbing&country=DE&search=name` — Search masters

### Profile
- `GET /api/profile/:id` — View profile
- `PUT /api/profile` — Update own profile

### Messages
- `GET /api/messages` — List conversations
- `GET /api/messages?with=userId` — Chat history
- `POST /api/messages` — Send message

### Calendar
- `GET /api/calendar?month=2025-03` — Get events
- `POST /api/calendar` — Create event

### Admin
- `GET /api/admin/stats` — Dashboard statistics
- `GET /api/admin/users?role=master&status=active` — List users
- `PUT /api/admin/users/:id` — Update user (block/premium)
- `PUT /api/admin/orders/:id/top` — Toggle TOP/Premium
- `POST /api/admin/broadcast` — Send Telegram broadcast
- `GET /api/admin/broadcasts` — Broadcast history

## Test Credentials

After migration, default admin:
- Email: `admin@slavicshkaf.com`
- Password: `admin123`

In the login form there are quick test login links for demo mode.

## Categories (20)

Plumbing, Electrical, Painting, Tiling, Renovation, Roofing, Carpentry, Welding, Heating, AC, Plastering, Drywall, Flooring, Facades, Landscaping, Cleaning, Moving, Windows & Doors, Furniture, Interior Design

## Countries (33)

All of Europe except Lithuania, Latvia, Estonia, Ukraine (as specified).

## Telegram Bot Integration

The bot token is configured in `wrangler.toml`. Broadcasting works by:
1. Users link their Telegram chat_id via `/api/telegram/link`
2. Admin sends broadcast via admin panel
3. API sends messages to all linked users via Telegram Bot API

For Telegram Mini App integration, use the WebApp `initData` to auto-link accounts.
