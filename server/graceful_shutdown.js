/*
NDE Automotive AI
Graceful Shutdown Manager
*/

let shuttingDown = false;

export function setupGracefulShutdown(server) {

  async function shutdown(signal) {

    if (shuttingDown) {
      return;
    }

    shuttingDown = true;

    console.log(`Received ${signal}. Shutting down gracefully...`);

    try {

      if (server) {

        server.close(() => {

          console.log("HTTP server closed");

          process.exit(0);

        });

      } else {

        process.exit(0);

      }

    } catch (error) {

      console.error("Shutdown error:", error);

      process.exit(1);

    }

  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

}
