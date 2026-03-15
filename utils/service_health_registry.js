/*
NDE Automotive AI
Service Health Registry
*/

class ServiceHealthRegistry {

  constructor() {

    this.services = new Map();

  }

  register(name, healthFn) {

    if (!name || typeof healthFn !== "function") {
      return;
    }

    this.services.set(name, healthFn);

  }

  async check(name) {

    const fn = this.services.get(name);

    if (!fn) {

      return {
        name,
        status: "unknown"
      };

    }

    try {

      const result = await fn();

      return {
        name,
        status: "ok",
        result
      };

    } catch (err) {

      return {
        name,
        status: "error",
        error: err.message
      };

    }

  }

  async checkAll() {

    const results = [];

    for (const name of this.services.keys()) {

      const res = await this.check(name);

      results.push(res);

    }

    return results;

  }

}

export const serviceHealthRegistry = new ServiceHealthRegistry();
