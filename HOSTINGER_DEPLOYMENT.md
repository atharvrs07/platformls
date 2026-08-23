# LiquiStudio — Hostinger Node.js Deployment Guide

This guide deploys the **entire platform (web + API) as ONE Hostinger Node.js application**.
The production entry file (`start.mjs`) boots the Express API on an internal loopback port
and serves the built Next.js app on your public `$PORT`, proxying `/api/*` to the API —
a single origin, no CORS setup needed.

---

## 1. Prerequisites

- A GitHub repository containing this project
- Hostinger **Node.js application hosting** (hPanel → Website → Node.js)
- Node.js **20 LTS or newer** on the hosting plan
- Your JWT secrets ready (see §4)

## 2. GitHub Repository

- Push the repository root (the monorepo) — `apps/`, `package.json`, `package-lock.json`, `start.mjs`
- The repo must include: `package-lock.json` (npm workspaces), `prisma/schema.prisma`, `start.mjs`
- `.env` files are git-ignored and must NOT be committed
- SQLite database files (`*.db`) are git-ignored and must NOT be committed

## 3. Hostinger Node.js Settings

| Setting | Exact Value |
|---|---|
| Root Directory | `/` (repository root — NOT `apps/server`) |
| Package Manager | **npm** (lockfile: `package-lock.json`) |
| Node.js Version | **20.x or 22.x** |
| Install Command | `npm install` (must include devDependencies for the build) |
| Build Command | `npm run build:all` |
| Output Directory | *not applicable* — this is a running Node server, not static output. Leave empty / set to the default if the field is required. |
| Entry File | `start.mjs` |
| Start Command / Script | `npm start` (runs `node start.mjs`) |

> The public application listens on **`process.env.PORT`**, which Hostinger injects automatically.
> Never hardcode a port in the panel.

## 4. Environment Variables

Add these in hPanel (Node.js app → Environment Variables). None of them belong in Git.

### Required

| Variable | Purpose | Secret? | Example format |
|---|---|---|---|
| `NODE_ENV` | Enables production mode; makes `DATA_DIR` mandatory | No | `production` |
| `DATA_DIR` | Persistent directory OUTSIDE the deployment folder; holds the SQLite DB so data survives redeploys | No | `/home/YOUR_HOSTINGER_USER/liquistudio_data` |
| `JWT_ACCESS_SECRET` | Signs short-lived access tokens (min 16 chars, use 48+) | **Yes** | long random string |
| `JWT_REFRESH_SECRET` | Signs refresh tokens (min 16 chars, use 48+) | **Yes** | different long random string |

Generate secrets locally with:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```
(Run it twice — one value per secret.)

### Optional

| Variable | Purpose | Default if omitted |
|---|---|---|
| `APP_URL` | Public site URL used in verification/reset emails | `http://localhost:3000` — **set to your domain**, e.g. `https://yourdomain.com` |
| `WEB_ORIGIN` | CORS allow-list for direct API calls | `http://localhost:3000` — set to your domain |
| `ALLOWED_SIGNUP_EMAILS` | Comma-separated emails allowed to register (private beta gate; first entry becomes ADMIN) | `blacktechguy6@gmail.com,atharvrs2010@gmail.com` |
| `BRAND_NAME` | Brand used in emails/UI metadata | `LiquiStudio` |
| `MAILER_HOST` / `MAILER_PORT` / `MAILER_USER` / `MAILER_PASS` / `MAILER_FROM` / `MAILER_SECURE` | SMTP for verification & password-reset emails | unset = emails logged as skipped |
| `SEED_PASSWORD` | Password used by `npm run db:seed` | `LiquiStudio123` |
| `API_INTERNAL_PORT` | Internal loopback port between Next and the API inside `start.mjs` | `4000` |

Build-time note: `NEXT_PUBLIC_API_URL` is injected automatically by `start.mjs` at runtime;
you do not need to set it.

## 5. Persistent Data Setup

**How storage works:** the app reads `process.env.DATA_DIR`, creates the directory recursively,
and uses `<DATA_DIR>/dev.db` as its SQLite database (Prisma + SQLite — unchanged technology).
On first boot it copies an existing legacy `apps/server/prisma/dev.db` into `DATA_DIR`
**only if the persistent database does not already exist** — existing data is never overwritten.

1. Create the directory once via SSH or hPanel File Manager:
   ```bash
   mkdir -p ~/liquistudio_data
   ```
   (Replace with your real home path; it must be **outside** the deployment directory.)
2. Permissions: your Node.js user needs read/write on the directory (default ownership is enough).
3. Expected layout after first boot:
   ```
   /home/YOUR_USER/liquistudio_data/
   └── dev.db        ← all users, sessions, waitlist entries, credits…
   ```
4. To seed the two beta accounts into the persistent DB, run **once** from the app's SSH console:
   ```bash
   npm run db:seed
   ```

## 6. Deployment Procedure

```
git push  →  Hostinger detects push  →  npm install  →  npm run build:all
         →  npm start (node start.mjs)  →  verify logs
```

1. Push your code to GitHub.
2. In hPanel, trigger/redeploy the Node.js application.
3. Watch the startup log. You should see exactly:
   ```
   [storage] DATA_DIR configured — persistent database: /home/…/liquistudio_data/dev.db
   [storage] Database connection opened successfully
   [api] LiquiStudio API listening on http://localhost:4000
   [start] LiquiStudio running on port <PORT> (public)
   ```
4. If you see `[start] FATAL: … build output not found`, the Build Command did not run or failed — check the build log.

## 7. Post-Deployment Verification

- [ ] Landing page loads at your domain (`https://yourdomain.com`)
- [ ] "Sign up for the waitlist" flow completes (email → name → confirmation)
- [ ] Login works with the admin account (`blacktechguy6@gmail.com`) — lands in dashboard, Admin Panel visible in sidebar
- [ ] Login works with the testing account (`atharvrs2010@gmail.com`) — no Admin Panel entry
- [ ] Admin Panel shows overview stats, users and any existing waitlist entries
- [ ] Startup log shows `DATA_DIR configured` and `Database connection opened successfully`
- [ ] No secrets, passwords or tokens appear anywhere in the logs

## 8. Persistence Test (do this after first deploy)

1. Note an existing piece of data (or submit a new waitlist entry).
2. Confirm it exists (e.g. visible in the Admin Panel).
3. Make a harmless code change (e.g. edit a README line).
4. Push to GitHub.
5. Let Hostinger redeploy.
6. Log back in.
7. Confirm the **same data still exists** — users, sessions and waitlist entries are intact because they live in `DATA_DIR`, untouched by redeploys.

---

## Alternative topology (not required)

You can also host web and API separately: deploy only `apps/server` as the Node.js app
(Root Directory `apps/server`, entry `dist/index.js`) and put the Next.js frontend on any
platform that runs `next start`. In that case set the web app's `NEXT_PUBLIC_API_URL` to your
API's public URL at **build time**. The single-app setup above is simpler and recommended.
