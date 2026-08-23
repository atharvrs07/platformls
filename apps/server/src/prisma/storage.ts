import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Legacy location when no DATA_DIR is configured (apps/server/prisma/dev.db). */
const LEGACY_DB_PATH = path.resolve(__dirname, "../../prisma/dev.db");
/** Filename preserved from the original setup. */
export const DB_FILENAME = "dev.db";

let resolved = false;

/**
 * Persistent storage resolution.
 *
 * Production: DATA_DIR must be set to an absolute directory OUTSIDE the
 * deployment folder (e.g. /home/uXXXX/liquistudio_data). The SQLite database
 * lives there as <DATA_DIR>/dev.db and survives redeploys.
 *
 * Development: if DATA_DIR is unset, falls back to the historical local file
 * apps/server/prisma/dev.db so nothing changes for local work.
 */
export function resolvePersistentDatabase() {
  if (resolved) return;
  resolved = true;

  const isProduction = process.env.NODE_ENV === "production";
  const dataDir = process.env.DATA_DIR?.trim();

  if (!dataDir) {
    if (isProduction) {
      throw new Error(
        "[storage] DATA_DIR is required in production. Set it to an absolute path outside the deployment directory, e.g. DATA_DIR=/home/<user>/liquistudio_data"
      );
    }
    console.log("[storage] DATA_DIR not set — using local development database (apps/server/prisma/dev.db)");
    return;
  }

  const absoluteDir = path.resolve(dataDir);

  try {
    fs.mkdirSync(absoluteDir, { recursive: true });
    fs.accessSync(absoluteDir, fs.constants.W_OK);
  } catch {
    throw new Error(`[storage] DATA_DIR is not usable: ${absoluteDir}`);
  }

  const targetDb = path.join(absoluteDir, DB_FILENAME);
  const targetUrl = `file:${targetDb.split(path.sep).join("/")}`;

  // One-time, non-destructive migration of an existing legacy database:
  // only copies when the persistent database does not exist yet.
  if (!fs.existsSync(targetDb) && fs.existsSync(LEGACY_DB_PATH)) {
    try {
      for (const suffix of ["", "-journal", "-wal", "-shm"]) {
        const src = `${LEGACY_DB_PATH}${suffix}`;
        if (fs.existsSync(src)) fs.copyFileSync(src, `${targetDb}${suffix}`);
      }
      console.log(`[storage] Migrated existing database -> ${targetDb}`);
    } catch (error) {
      throw new Error(
        `[storage] Failed to copy existing database into DATA_DIR (${absoluteDir}): ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // Prisma reads DATABASE_URL lazily at connect time; point it at the
  // persistent absolute location without touching schema.prisma or .env.
  process.env.DATABASE_URL = targetUrl;

  console.log(`[storage] DATA_DIR configured — persistent database: ${targetDb}`);
}
