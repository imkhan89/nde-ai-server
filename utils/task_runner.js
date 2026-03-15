/*
NDE Automotive AI
Task Runner
*/

export class TaskRunner {

  constructor() {

    this.tasks = new Map();

  }

  register(name, fn) {

    if (!name || typeof fn !== "function") {
      return;
    }

    this.tasks.set(name, fn);

  }

  async run(name, payload) {

    const task = this.tasks.get(name);

    if (!task) {

      throw new Error(`Task not found: ${name}`);

    }

    return await task(payload);

  }

  list() {

    return Array.from(this.tasks.keys());

  }

}

export const taskRunner = new TaskRunner();
