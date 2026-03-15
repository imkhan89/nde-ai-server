import http from "http";
import { bootstrapServer } from "./server_bootstrap.js";
import { setupGracefulShutdown } from "./graceful_shutdown.js";

/*
NDE Automotive AI
Server Launcher
*/

export async function launchServer() {

  try {

    const app = await bootstrapServer();

    const PORT = process.env.PORT || 3000;

    const server = http.createServer(app);

    server.listen(PORT, () => {

      console.log(`NDE Automotive AI running on port ${PORT}`);

    });

    setupGracefulShutdown(server);

    return server;

  } catch (error) {

    console.error("Server launch failed:", error);

    process.exit(1);

  }

}
