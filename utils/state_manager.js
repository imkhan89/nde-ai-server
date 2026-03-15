/*
NDE Automotive AI
State Manager
*/

class StateManager {

  constructor() {

    this.state = new Map();

  }

  set(key, value) {

    if (!key) return;

    this.state.set(key, value);

  }

  get(key) {

    return this.state.get(key);

  }

  has(key) {

    return this.state.has(key);

  }

  delete(key) {

    this.state.delete(key);

  }

  clear() {

    this.state.clear();

  }

  keys() {

    return Array.from(this.state.keys());

  }

  size() {

    return this.state.size;

  }

}

export const stateManager = new StateManager();
