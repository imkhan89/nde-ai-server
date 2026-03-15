const shutdownTasks = [];

export function registerShutdownTask(task) {
  if (typeof task === "function") {
    shutdownTasks.push(task);
  }
}

async function runShutdownTasks() {
  for (const task of shutdownTasks) {
    try {
      await task();
    } catch (err) {
      console.error("Shutdown task failed:", err);
    }
  }
}

export function setupShutdownHandlers(server) {
  async function shutdown(signal) {
    console.log(`Received ${signal}. Shutting down...`);

    await runShutdownTasks();

    if (server) {
      server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

export default {
  registerShutdownTask,
  setupShutdownHandlers
};
