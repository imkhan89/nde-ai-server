/*
NDE Automotive AI
Performance Timer Utility
*/

export function startTimer() {

  const start = process.hrtime.bigint();

  return {

    stop() {

      const end = process.hrtime.bigint();

      const durationNs = end - start;

      const durationMs = Number(durationNs) / 1e6;

      return durationMs;

    }

  };

}

export function measureAsync(fn) {

  return async function (...args) {

    const timer = startTimer();

    const result = await fn(...args);

    const time = timer.stop();

    return {
      result,
      timeMs: time
    };

  };

}

export function measureSync(fn) {

  return function (...args) {

    const timer = startTimer();

    const result = fn(...args);

    const time = timer.stop();

    return {
      result,
      timeMs: time
    };

  };

}
