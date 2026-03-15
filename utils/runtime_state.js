/*
NDE Automotive AI
Runtime State
*/

class RuntimeState {

  constructor() {

    this.startedAt = Date.now();

    this.flags = new Map();

    this.data = new Map();

  }

  uptime() {

    return Math.floor((Date.now() - this.startedAt) / 1000);

  }

  setFlag(name, value = true) {

    this.flags.set(name, value);

  }

  getFlag(name) {

    return this.flags.get(name);

  }

  set(key, value) {

    this.data.set(key, value);

  }

  get(key) {

    return this.data.get(key);

  }

  has(key) {

    return this.data.has(key);

  }

  delete(key) {

    this.data.delete(key);

  }

  clear() {

    this.data.clear();

  }

}

export const runtimeState = new RuntimeState();
