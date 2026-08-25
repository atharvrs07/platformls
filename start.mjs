/**
 * LiquiStudio production entry point (Hostinger / single Node.js app).
 *
 * Boots the whole platform behind ONE public port ($PORT):
 *   1. Ensures a persistent data directory (DATA_DIR, default ~/liquistudio_data)
 *      and generates a private runtime env file there on first boot
 *      (JWT secrets etc.) so configuration survives redeploys/rebuilds.
 *   2. Runs Prisma migrations + idempotent seed against the persistent DB.
 *   3. Starts the Express API on an internal loopback port.
 *   4. Serves the built Next.js app on $PORT, proxying /api/* internally.
 */
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import http from "node:http";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// This is the production launcher. Some hosts pre-set NODE_ENV=development,
// which would disable production safeguards ---------------- force production here.
process.env.NODE_ENV = "production";

// ---- Boot diagnostics: mirror logs into public_html/boot-debug.log ------
function findPublicHtml() {
  let dir = __dirname;
  for (let i = 0; i < 6; i++) {
    const candidate = path.join(dir, "public_html");
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}
const publicHtmlDir = findPublicHtml();
const bootLogFile = publicHtmlDir
  ? path.join(publicHtmlDir, "boot-debug.log")
  : null;

if (bootLogFile) {
  try {
    fs.writeFileSync(bootLogFile, `--- boot ${new Date().toISOString()} ---\n`);
  } catch {
    /* non-fatal */
  }
}

function writeBootLog(line) {
  if (!bootLogFile) return;
  try {
    fs.appendFileSync(bootLogFile, line + "\n");
  } catch {
    /* non-fatal */
  }
}

const originalConsoleLog = console.log.bind(console);
const originalConsoleError = console.error.bind(console);
console.log = (...args) => {
  const line = args.map((a) => String(a)).join(" ");
  writeBootLog(line);
  originalConsoleLog(...args);
};
console.error = (...args) => {
  const line = args.map((a) => String(a)).join(" ");
  writeBootLog("ERROR: " + line);
  originalConsoleError(...args);
};
process.on("uncaughtException", (err) => {
  writeBootLog("UNCAUGHT_EXCEPTION: " + (err && err.stack));
});
process.on("unhandledRejection", (err) => {
  writeBootLog("UNHANDLED_REJECTION: " + String(err && (err.stack || err)));
});

// ---- Public server bound IMMEDIATELY with live status -------------------
let bootStage = "starting";
log("start", "Boot sequence started");
let bootStartedAt = new Date().toISOString();

const PUBLIC_PORT = Number(process.env.PORT || 3000);
const INTERNAL_PORT = Number(process.env.API_INTERNAL_PORT || 4000);
const INTERNAL_ORIGIN = `http://127.0.0.1:${INTERNAL_PORT}`;

const serverDir = path.join(__dirname, "apps", "server");
const webDir = path.join(__dirname, "apps", "web");
const serverEntry = path.join(serverDir, "dist", "index.js");

let shuttingDown = false;

function log(scope, message) {
  console.log(`[${scope}] ${message}`);
}

function fail(message) {
  console.error(`[start] FATAL: ${message}`);
  process.exit(1);
}

function requireResolveFrom(fromDir, request) {
  return createRequire(path.join(fromDir, "package.json")).resolve(request);
}

// ---- Pre-flight checks -------------------------------------------------
if (!fs.existsSync(serverEntry)) {
  fail(
    `API build output not found at ${serverEntry}. Run the build command first (npm run build:all).`
  );
}
if (!fs.existsSync(path.join(webDir, ".next", "BUILD_ID"))) {
  fail(
    `Next.js build output not found at ${path.join(webDir, ".next")}. Run the build command first (npm run build:all).`
  );
}

// ---- Persistent data directory + runtime env bootstrap -----------------
const DATA_DIR =
  process.env.DATA_DIR && process.env.DATA_DIR.trim().length > 0
    ? path.resolve(process.env.DATA_DIR)
    : path.join(os.homedir(), "liquistudio_data");

// Expand to the real (non-short) absolute path before handing it to Prisma.
let realDataDir = DATA_DIR;
try {
  realDataDir = fs.realpathSync(DATA_DIR);
} catch {
  /* keep resolved path */
}

fs.mkdirSync(realDataDir, { recursive: true });

const RUNTIME_ENV_FILE = path.join(realDataDir, ".env");
if (!fs.existsSync(RUNTIME_ENV_FILE)) {
  const generated = {
    LIQUISTUDIO_RUNTIME_ENV: "generated-by-start.mjs",
    JWT_ACCESS_SECRET: crypto.randomBytes(48).toString("hex"),
    JWT_REFRESH_SECRET: crypto.randomBytes(48).toString("hex"),
    APP_URL: process.env.APP_URL || "https://liquistudio.com",
    WEB_ORIGIN: process.env.WEB_ORIGIN || "https://liquistudio.com",
    COOKIE_SECURE: "true",
    MAILER_FROM: "LiquiStudio <noreply@liquistudio.com>",
  };
  fs.writeFileSync(
    RUNTIME_ENV_FILE,
    Object.entries(generated)
      .map(([k, v]) => `${k}="${v}"`)
      .join("\n") + "\n",
    { encoding: "utf8", mode: 0o600 }
  );
  log("start", `Generated runtime environment file: ${RUNTIME_ENV_FILE}`);
}

// Load the runtime env file WITHOUT overriding variables already set
// (panel-level env vars always win).
for (const line of fs.readFileSync(RUNTIME_ENV_FILE, "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
  if (!m) continue;
  const key = m[1];
  let value = m[2];
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  if (!(key in process.env)) process.env[key] = value;
}

process.env.DATA_DIR = realDataDir;
process.env.DATABASE_URL = `file:${realDataDir.split(path.sep).join("/")}/dev.db`;

log("start", `Persistent database directory: ${DATA_DIR}`);

// ---- Public server: bind the port IMMEDIATELY ---------------------------
// Passenger kills apps that do not listen within ~10 s, so the port must be
// bound before any slow work (migrations). The real handler is swapped in
// once Next.js is prepared.
const publicServer = http.createServer((req, res) => {
  res.writeHead(503, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      status: bootStage,
      since: bootStartedAt,
      note: "Application is booting - try again in a few seconds.",
    })
  );
});

publicServer.listen(PUBLIC_PORT, () => {
  log("start", `Status server listening on port ${PUBLIC_PORT} while booting`);
});

// ---- Migrations + seed (idempotent, safe on every boot) ----------------
function runStep(name, args, extraEnv = {}) {
  log("start", `Running ${name}--------------`);
  return spawnSync(process.execPath, args, {
    cwd: serverDir,
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
  });
}

const prismaCli = requireResolveFrom(serverDir, "prisma/build/index.js");

// Deploy archives lose Unix execute bits; restore them on Prisma's native
// engine binaries or migrations/runtime queries die with EACCES.
function ensureEngineExecutable(dir) {
  try {
    const engines = path.join(dir, "node_modules", "@prisma", "engines");
    if (!fs.existsSync(engines)) return;
    for (const f of fs.readdirSync(engines)) {
      try {
        fs.chmodSync(path.join(engines, f), 0o755);
      } catch {
        /* best effort */
      }
    }
    log("start", `Restored execute permissions on Prisma engines in ${engines}`);
  } catch (e) {
    log("start", `chmod on Prisma engines skipped: ${e.message}`);
  }
}
ensureEngineExecutable(__dirname);
ensureEngineExecutable(serverDir);

// Skip migrations when already applied for this exact deployment; a failure
// must NEVER crash-loop the app under Passenger - keep serving the website
// and retry in the background instead.
const STAMP_FILE = path.join(realDataDir, ".schema-stamp");
let stamp = "";
try {
  stamp = fs.readFileSync(STAMP_FILE, "utf8").trim();
} catch {
  /* first boot */
}
const currentStamp = path.basename(fs.realpathSync(__dirname));
let dbReady = stamp === currentStamp;
if (dbReady) log("start", "Schema already migrated for this deployment - skipping");

if (!dbReady) {
  const mig = runStep("database migrations", [prismaCli, "migrate", "deploy"]);
  let seedOk = true;
  let seedRan = false;
  for (const specifier of ["tsx/cli", "tsx/dist/cli.mjs"]) {
    try {
      const tsxCli = requireResolveFrom(serverDir, specifier);
      const seed = runStep("database seed", [tsxCli, "prisma/seed.ts"]);
      seedRan = true;
      if (seed.status !== 0) seedOk = false;
      break;
    } catch {
      /* try next specifier */
    }
  }
  if (!seedRan) log("start", "Seed skipped (tsx not available in production install)");

  if (mig.status === 0 && seedOk) {
    dbReady = true;
    try {
      fs.writeFileSync(STAMP_FILE, currentStamp);
    } catch {
      /* non-fatal */
    }
    log("start", "Database ready");
  } else {
    log("start", "Database bootstrap failed - website will serve while DB retries in background");
  }
}

// ---- Internal API lifecycle --------------------------------------------
let api = null;
let apiRestartCount = 0;
const API_MAX_RESTARTS = 10;
const API_RESTART_BASE_DELAY_MS = 2000;

let apiRestartTimer = null;

function startApi() {
  if (api) return;
  bootStage = "starting-api";
  api = spawn(process.execPath, [serverEntry], {
    cwd: serverDir,
    env: { ...process.env, PORT: String(INTERNAL_PORT) },
    stdio: ["ignore", "inherit", "inherit"],
  });
  api.on("exit", (code) => {
    log("start", `API process exited with code ${code}`);
    api = null;
    if (apiRestartTimer) { clearTimeout(apiRestartTimer); apiRestartTimer = null; }
    if (!shuttingDown) {
      if (apiRestartCount < API_MAX_RESTARTS) {
        apiRestartCount += 1;
        const delay = Math.min(API_RESTART_BASE_DELAY_MS * apiRestartCount, 30000);
        log("start", `Scheduling API restart #${apiRestartCount} in ${delay}ms`);
        setTimeout(() => startApi(), delay);
      } else {
        log("start", `API restart limit reached (${API_MAX_RESTARTS}). Will not restart automatically.`);
      }
    }
  });
  log("start", "API process launched");
  // If the API stays alive for 60 s, reset the restart counter so
  // transient failures later are not penalised by earlier crashes.
  apiRestartTimer = setTimeout(() => { apiRestartCount = 0; }, 60000);
}

function scheduleDbRetry() {
  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    if (tries > 30) {
      clearInterval(timer);
      log("start", "Database retry limit reached - giving up until next restart");
      return;
    }
    log("start", `Retrying database bootstrap (attempt ${tries})`);
    const mig = runStep("database migrations", [prismaCli, "migrate", "deploy"]);
    if (mig.status === 0) {
      dbReady = true;
      try {
        fs.writeFileSync(STAMP_FILE, currentStamp);
      } catch {
        /* non-fatal */
      }
      clearInterval(timer);
      startApi();
      log("start", "Database became ready after retry");
    }
  }, 45000);
}

if (dbReady) startApi();
else scheduleDbRetry();

async function waitForApi(retries = 120, delayMs = 500) {
  for (let i = 1; i <= retries; i++) {
    try {
      const res = await fetch(`${INTERNAL_ORIGIN}/api/health`);
      if (res.ok) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, delayMs));
  }
  return false;
}

// ---- Swap in the Next.js handler once prepared --------------------------
async function start() {
  const ok = await waitForApi();
  if (!ok) log("start", "API not healthy yet - continuing in web-only mode until DB retry succeeds");

  // Read by next.config.mjs when Next loads ---------------- must point rewrites at the
  // internal API before requiring Next.
  process.env.NEXT_PUBLIC_API_URL = INTERNAL_ORIGIN;

  bootStage = "preparing-web";
  const next = (await import("next")).default;

  const nextApp = next({ dev: false, dir: webDir });
  await nextApp.prepare();
  const handler = nextApp.getRequestHandler();

  publicServer.removeAllListeners("request");
  publicServer.on("request", (req, res) => handler(req, res));

  bootStage = "ready";
  log("start", `LiquiStudio running on port ${PUBLIC_PORT} (public)`);
  return publicServer;
}

function shutdown(server) {
  if (shuttingDown) return;
  shuttingDown = true;
  log("start", "Shutting down--------------");
  if (server) server.close(() => log("start", "Web server closed"));
  if (api) api.kill("SIGTERM");
  setTimeout(() => process.exit(0), 3000);
}

start()
  .then((server) => {
    process.on("SIGTERM", () => shutdown(server));
    process.on("SIGINT", () => shutdown(server));
  })
  .catch((error) => {
    console.error("[start] Failed to start:", error);
    process.exit(1);
  });
