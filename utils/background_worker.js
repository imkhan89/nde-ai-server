/*
NDE Automotive AI
Background Worker Utility
*/

export class BackgroundWorker {

  constructor(intervalMs = 60000) {

    this.intervalMs = intervalMs;
    this.timer = null;
    this.task = null;

  }

  start(task) {

    if (typeof task !== "function") {
      throw new Error("Worker task must be a function");
    }

    this.task = task;

    if (this.timer) return;

    this.timer = setInterval(async () => {

      try {

        await this.task();

      } catch (err) {

        console.error("Background worker error:", err);

      }

    }, this.intervalMs);

  }

  stop() {

    if (this.timer) {

      clearInterval(this.timer);

      this.timer = null;

    }

  }

  isRunning() {

    return !!this.timer;

  }

}
