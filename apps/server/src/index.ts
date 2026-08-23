import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./prisma/client.js";

async function main() {
  const app = createApp();

  await prisma.$connect();
  console.log("[storage] Database connection opened successfully");

  app.listen(env.PORT, () => {
    console.log(`[api] LiquiStudio API listening on http://localhost:${env.PORT}`);
  });
}

async function shutdown(signal: string) {
  console.log(`[api] ${signal} received, shutting down...`);
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

main().catch((error) => {
  console.error("[api] Failed to start server:", error);
  process.exit(1);
});
