import { launchServer } from "./server_launcher.js";
import { startSyncScheduler } from "../scheduler/sync_scheduler.js";

export async function bootstrapServer() {
  try {
    const server = launchServer();

    startSyncScheduler();

    console.log("NDE Automotive AI Bootstrap Complete");

    return server;
  } catch (error) {
    console.error("Server bootstrap failed:", error);
    process.exit(1);
  }
}

export default {
  bootstrapServer
};
