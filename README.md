# Kalyani masale – React + Express + Supabase

**Stack:** React · Express.js · Supabase (PostgreSQL)

Includes **Admin Panel** for products, categories, and orders.

---

## Setup

### 1. Supabase
1. Create project at https://supabase.com
2. SQL Editor → run `supabase/schema.sql`
3. SQL Editor → run `supabase/seed.sql`
4. Project Settings → API → copy **Project URL** + **service_role** key

### 2. Backend `.env`
```env
PORT=5000
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_SECRET=replace_with_a_long_random_secret
```

### 3. Run
```bash
# Terminal 1
cd backend && npm install && npm run dev

# Terminal 2
cd frontend && npm install && npm run dev
```

- Store: http://localhost:3000
- Admin: http://localhost:3000/admin/login

**Admin login key** = value of `ADMIN_SECRET` in `backend/.env`
Set `ADMIN_SECRET` to a long, unique random value before starting the backend.

---

## Admin Panel features

| Page | Features |
|------|----------|
| **Dashboard** | Product / order counts, recent orders |
| **Products** | List, add, edit, delete |
| **Categories** | List, add |
| **Orders** | List, change status, view items |

URL: `/admin` (protected by admin key)

---

## Architecture

```
React (store + admin UI)
    ↓
Express API  (/api/* and /api/admin/*)
    ↓
Supabase (PostgreSQL)
```

---

## API

### Public
- `GET /api/categories`
- `GET /api/products`
- `GET /api/products/:slug`
- `POST /api/orders`

### Admin (header: `x-admin-key: YOUR_ADMIN_SECRET`)
- `GET/POST /api/admin/products`
- `PUT/DELETE /api/admin/products/:id`
- `GET/POST /api/admin/categories`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:id`
