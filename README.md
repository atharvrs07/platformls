# LiquiStudio Platform

> **Phase 1 — Foundation.** A production-grade monorepo for an all-in-one AI workspace.

## Structure

```
├── apps/
│   ├── web/         Next.js (App Router) frontend — landing, auth, dashboard
│   └── server/      Node.js + Express API — JWT auth, users, workspaces, settings
```

## Prerequisites

- Node.js ≥ 20
- No database install needed for local dev — SQLite is used by default (`apps/server/prisma/dev.db`)
- PostgreSQL ≥ 14 only if you switch back (set `DATABASE_URL` to a `postgresql://` URL and set `provider = "postgresql"` in `apps/server/prisma/schema.prisma`, then run `npm run db:migrate`)

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env.local

# 3. Set up the database
npm run db:generate
npm run db:migrate

# 4. Run both apps (web on :3000, api on :4000)
npm run dev:server
npm run dev:web
```

## Branding

Company name, domain, colors, and links live in a single file:
`apps/web/src/config/brand.ts`. Edit one file to rebrand the entire platform.

## Scripts

| Command               | Purpose                          |
| --------------------- | -------------------------------- |
| `npm run dev:web`     | Next.js dev server (:3000)       |
| `npm run dev:server`  | Express API dev server (:4000)   |
| `npm run build`       | Production build of the web app  |
| `npm run lint`        | Lint all workspaces              |
| `npm run typecheck`   | Type-check all workspaces        |
| `npm run db:generate` | Generate Prisma client           |
| `npm run db:migrate`  | Run database migrations          |


..
