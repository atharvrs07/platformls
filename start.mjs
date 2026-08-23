/**
 * LiquiStudio production entry point (Hostinger / single Node.js app).
 *
 * Starts both workspaces behind ONE public port ($PORT):
 *   1. Express API (apps/server/dist/index.js) on an internal loopback port
 *   2. Next.js production server (apps/web/.next) on process.env.PORT
 *
 * The Next.js rewrite rule forwards public /api/* requests to the internal
 * API, so the whole platform is served from a single origin.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PUBLIC_PORT = Number(process.env.PORT || 3000);
const INTERNAL_PORT = Number(process.env.API_INTERNAL_PORT || 4000);
const INTERNAL_ORIGIN = `http://127.0.0.1:${INTERNAL_PORT}`;

const serverEntry = path.join(__dirname, "apps", "server", "dist", "index.js");
const webDir = path.join(__dirname, "apps", "web");

let shuttingDown = false;

function log(scope, message) {
  console.log(`[${scope}] ${message}`);
}

function fail(message) {
  console.error(`[start] FATAL: ${message}`);
  process.exit(1);
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
if (!process.env.DATA_DIR && process.env.NODE_ENV === "production") {
  log("start", "WARNING: DATA_DIR is not set; the API will refuse to start in production.");
}

// ---- Start the internal API -------------------------------------------
const api = spawn(process.execPath, [serverEntry], {
  cwd: path.join(__dirname, "apps", "server"),
  env: { ...process.env, PORT: String(INTERNAL_PORT) },
  stdio: ["ignore", "inherit", "inherit"],
});

api.on("exit", (code) => {
  if (!shuttingDown) {
    fail(`API process exited unexpectedly with code ${code}`);
  }
});

// Wait until the API answers /api/health before serving traffic.
async function waitForApi(retries = 40, delayMs = 500) {
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

// ---- Start the public Next.js server -----------------------------------
async function start() {
  const ok = await waitForApi();
  if (!ok) fail("API did not become healthy in time");

  // Read by next.config.mjs when Next loads — must point rewrites at the
  // internal API before requiring Next.
  process.env.NEXT_PUBLIC_API_URL = INTERNAL_ORIGIN;

  const next = (await import("next")).default;
  const { createServer } = await import("node:http");

  const nextApp = next({ dev: false, dir: webDir });
  await nextApp.prepare();
  const handler = nextApp.getRequestHandler();

  const server = createServer((req, res) => handler(req, res));

  server.listen(PUBLIC_PORT, () => {
    log("start", `LiquiStudio running on port ${PUBLIC_PORT} (public)`);
    log("start", `NODE_ENV=${process.env.NODE_ENV || "development"} DATA_DIR=${process.env.DATA_DIR ? "configured" : "not set"}`);
  });

  return server;
}

function shutdown(server) {
  if (shuttingDown) return;
  shuttingDown = true;
  log("start", "Shutting down…");
  if (server) server.close(() => log("start", "Web server closed"));
  api.kill("SIGTERM");
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
