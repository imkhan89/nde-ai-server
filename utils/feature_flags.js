/*
NDE Automotive AI
Feature Flags
*/

class FeatureFlags {

  constructor() {

    this.flags = new Map();

  }

  enable(name) {

    this.flags.set(name, true);

  }

  disable(name) {

    this.flags.set(name, false);

  }

  isEnabled(name) {

    return this.flags.get(name) === true;

  }

  list() {

    return Array.from(this.flags.entries()).map(([k, v]) => ({
      name: k,
      enabled: v
    }));

  }

}

export const featureFlags = new FeatureFlags();
