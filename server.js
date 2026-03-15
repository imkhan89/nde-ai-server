import { bootstrapServer } from "./server/server_bootstrap.js";

async function start() {
  try {
    await bootstrapServer();
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
