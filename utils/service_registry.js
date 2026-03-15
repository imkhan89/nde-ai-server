/*
NDE Automotive AI
Service Registry
*/

class ServiceRegistry {

  constructor() {

    this.services = new Map();

  }

  register(name, instance) {

    if (!name || !instance) {
      throw new Error("Service name and instance required");
    }

    this.services.set(name, instance);

  }

  get(name) {

    if (!this.services.has(name)) {

      throw new Error(`Service not found: ${name}`);

    }

    return this.services.get(name);

  }

  has(name) {

    return this.services.has(name);

  }

  list() {

    return Array.from(this.services.keys());

  }

}

export const serviceRegistry = new ServiceRegistry();
