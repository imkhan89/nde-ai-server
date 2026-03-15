/*
NDE Automotive AI
Retry Utilities
*/

export async function retryAsync(fn, retries = 3, delayMs = 500) {

  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {

    try {

      return await fn();

    } catch (error) {

      lastError = error;

      if (attempt < retries) {

        await wait(delayMs * attempt);

      }

    }

  }

  throw lastError;

}

export async function wait(ms = 1000) {

  return new Promise(resolve => {

    setTimeout(resolve, ms);

  });

}
