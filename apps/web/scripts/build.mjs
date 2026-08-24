// Runs `next build` with NODE_ENV forced to production.
// Hosting providers sometimes pre-set NODE_ENV=development in build
// environments, which breaks static prerendering of /404 and /_error.
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let nextBin;
try {
  nextBin = require.resolve("next/dist/bin/next");
} catch {
  console.error("[build] Could not resolve the next binary. Is next installed?");
  process.exit(1);
}

const result = spawnSync(
  process.execPath,
  [nextBin, "build"],
  {
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" },
  }
);

process.exit(result.status ?? 1);
