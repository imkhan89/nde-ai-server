/*
NDE Automotive AI
Metrics Collector
*/

class Metrics {

  constructor() {

    this.counters = {};
    this.timers = {};
    this.gauges = {};

  }

  increment(name, value = 1) {

    if (!this.counters[name]) {
      this.counters[name] = 0;
    }

    this.counters[name] += value;

  }

  setGauge(name, value) {

    this.gauges[name] = value;

  }

  startTimer(name) {

    const start = Date.now();

    return () => {

      const duration = Date.now() - start;

      if (!this.timers[name]) {
        this.timers[name] = [];
      }

      this.timers[name].push(duration);

    };

  }

  getMetrics() {

    return {
      counters: this.counters,
      timers: this.timers,
      gauges: this.gauges
    };

  }

}

export const metrics = new Metrics();
