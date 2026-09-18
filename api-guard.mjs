/**
 * api-guard.mjs - thin wrapper that runs the LiquiStudio API and guarantees
 * it can never outlive its supervisor (start.mjs).
 *
 * Why: Hostinger's Node runtime (Passenger) periodically kills/recycles the
 * supervisor with SIGKILL. A plain child process survives that, keeps port
 * 4000 open, and every later boot then crash-loops on EADDRINUSE. Orphans
 * accumulate until the hosting account hits its 200-process cap, at which
 * point EVERY site on the account (including PHP sites) starts returning 503.
 *
 * Usage (from start.mjs):
 *   spawn(process.execPath, ["api-guard.mjs", serverEntry], { env: { SUPERVISOR_PID } })
 */
import { pathToFileURL } from "node:url";

const serverEntry = process.argv[2];
const parentPid = Number(process.env.SUPERVISOR_PID || process.ppid);

if (!serverEntry) {
  console.error("[api-guard] missing server entry argument");
  process.exit(2);
}

function parentAlive() {
  try {
    process.kill(parentPid, 0); // signal 0 = existence check only
    return process.ppid === parentPid; // re-parented to init/subreaper => orphaned
  } catch {
    return false;
  }
}

// Poll every 2 s. If the supervisor is gone, exit immediately so the port
// and the Prisma engine child are released.
const guard = setInterval(() => {
  if (!parentAlive()) {
    console.error("[api-guard] supervisor gone - exiting to release port");
    process.exit(0);
  }
}, 2000);
guard.unref();

// Forward termination signals as a normal graceful stop.
for (const sig of ["SIGTERM", "SIGINT", "SIGHUP"]) {
  process.on(sig, () => {
    setTimeout(() => process.exit(0), 1500).unref();
  });
}

await import(pathToFileURL(serverEntry).href);
