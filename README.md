# Coffee Shop POS System

A full-featured Point of Sale system built with Next.js + Supabase for coffee shop operations.

## 📌 Overview

- User authentication (sign in, sign up, password reset)
- Admin dashboard: products, inventory, users, transactions, sales report
- POS workflows: add item, checkout, print receipt, transaction history
- Activity log tracking and role-based user management

## 🧰 Tech Stack

- Frontend: Next.js 15 + React 19 + TypeScript
- UI: Tailwind CSS, Radix UI, Framer Motion
- State / data: React Query, Zustand, Zod
- Backend/DB: Supabase (PostgreSQL)
- Utilities: `date-fns`, `recharts`, `react-hook-form`

## 🚀 Prerequisites

- Node.js 18+ or 20+
- npm / pnpm / yarn
- Supabase CLI installed (`supabase`)
- Docker (required for running Supabase locally)

## 🛠️ Setup (local)

1. Clone the repo:

```bash
git clone https://github.com/nerwinalamas/coffee-shop-pos-system.git
cd coffee-shop-pos-system
```

2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

You can find these values in your Supabase project dashboard under **Project Settings → API**.

4. Make sure Docker is running, then start Supabase locally (includes database and auth):

```bash
npm run supabase:start
```

5. Generate Supabase types if needed:

```bash
npm run supabase:types
```

6. Run the dev server:

```bash
npm run dev
```

Open: http://localhost:3000

---

## 📦 Scripts

- `npm run dev`: development server
- `npm run build`: production build
- `npm run start`: serve build
- `npm run lint`: lint code with ESLint
- `npm run typecheck`: TypeScript type-check
- `npm run supabase:start`: start local Supabase
- `npm run supabase:stop`: stop local Supabase
- `npm run supabase:status`: check Supabase status
- `npm run supabase:restart`: stop + start
- `npm run supabase:reset`: reset DB (development only)

---

## 🗂️ Project Structure

- `app/`: Next.js App Router pages and layouts
- `components/`: UI, forms, modals, tables, receipts
- `hooks/`: custom hooks for data fetching
- `lib/`: utilities, helpers, export logic
- `providers/`: global providers (React Query, auth)
- `supabase/`: DB migrations and seed data
- `types/`: TypeScript types and models

---

## 🔐 Supabase Notes

- Check `supabase/config.toml`, `supabase/migrations`, `supabase/seed.sql`
- Docker must be running before executing any `supabase` commands
- When deploying, make sure all three environment variables are set in your hosting provider

---

## ⚠️ Important

- Do not run `supabase db reset` in production
- Commit `migrations` and `seed.sql` to ensure a reproducible environment
- Never commit `.env.local` or expose your `SUPABASE_SERVICE_ROLE_KEY`

---

## ✅ Contribution

1. Branch: `feature/<name>`
2. Open a pull request with a short explanation
3. Run the following before submitting:

```bash
npm run lint
npm run typecheck
npm run build
```

---

## 📬 Contact

For issues or feature requests, please create an issue in the repo.
