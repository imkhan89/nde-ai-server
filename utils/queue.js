/*
NDE Automotive AI
Async Task Queue
*/

export class AsyncQueue {

  constructor(concurrency = 5) {

    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];

  }

  push(task) {

    return new Promise((resolve, reject) => {

      this.queue.push({
        task,
        resolve,
        reject
      });

      this.next();

    });

  }

  async next() {

    if (this.running >= this.concurrency) return;

    const item = this.queue.shift();

    if (!item) return;

    this.running++;

    try {

      const result = await item.task();

      item.resolve(result);

    } catch (err) {

      item.reject(err);

    } finally {

      this.running--;

      this.next();

    }

  }

  size() {

    return this.queue.length;

  }

}
