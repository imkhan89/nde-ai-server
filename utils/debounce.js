/*
NDE Automotive AI
Debounce Utility
*/

export function debounce(fn, delay = 300) {

  let timer = null;

  return function (...args) {

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {

      fn.apply(this, args);

    }, delay);

  };

}

export function throttle(fn, limit = 300) {

  let lastCall = 0;

  return function (...args) {

    const now = Date.now();

    if (now - lastCall >= limit) {

      lastCall = now;

      fn.apply(this, args);

    }

  };

}
