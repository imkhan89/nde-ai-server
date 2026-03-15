const workers = new Map();

export function startWorker(name, task, intervalMs = 60000) {
  if (!name || typeof task !== "function") {
    throw new Error("Worker requires a name and a task function");
  }

  if (workers.has(name)) {
    return workers.get(name);
  }

  const interval = setInterval(async () => {
    try {
      await task();
    } catch (err) {
      console.error(`Worker ${name} failed:`, err);
    }
  }, intervalMs);

  workers.set(name, interval);

  return interval;
}

export function stopWorker(name) {
  const worker = workers.get(name);

  if (worker) {
    clearInterval(worker);
    workers.delete(name);
  }
}

export function listWorkers() {
  return Array.from(workers.keys());
}

export default {
  startWorker,
  stopWorker,
  listWorkers
};
