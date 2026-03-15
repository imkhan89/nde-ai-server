/*
NDE Automotive AI
Shutdown Manager
*/

class ShutdownManager {

  constructor() {

    this.handlers = [];

    this.initialized = false;

  }

  register(handler) {

    if (typeof handler === "function") {

      this.handlers.push(handler);

    }

  }

  async runHandlers(signal) {

    console.log(`Shutdown signal received: ${signal}`);

    for (const handler of this.handlers) {

      try {

        await handler(signal);

      } catch (err) {

        console.error("Shutdown handler error:", err);

      }

    }

  }

  initialize() {

    if (this.initialized) return;

    const shutdown = async (signal) => {

      await this.runHandlers(signal);

      process.exit(0);

    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    this.initialized = true;

  }

}

export const shutdownManager = new ShutdownManager();
