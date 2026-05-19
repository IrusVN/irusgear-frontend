/**
 * Run a function and retry on transient failures (5xx or network errors)
 * with exponential backoff. 4xx responses (validation, auth, idempotency
 * conflicts) are propagated immediately so the UI can show a precise error.
 *
 * @param {() => Promise<T>} fn
 * @param {{ retries?: number, backoff?: number[], shouldRetry?: (err: any) => boolean }} options
 * @returns {Promise<T>}
 */
export async function retryWithBackoff(fn, options = {}) {
  const retries = typeof options.retries === "number" ? options.retries : 2;
  const backoff = Array.isArray(options.backoff) && options.backoff.length
    ? options.backoff
    : [1000, 3000];
  const shouldRetry = options.shouldRetry || defaultShouldRetry;

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === retries || !shouldRetry(err)) {
        throw err;
      }
      const wait = backoff[Math.min(attempt, backoff.length - 1)];
      await sleep(wait);
    }
  }
  throw lastError;
}

function defaultShouldRetry(err) {
  if (!err) return false;
  // Plain network failures (no response) → retry.
  if (err.name === "TypeError" || err.message === "Failed to fetch") return true;

  const status = err.status ?? err?.response?.status;
  if (typeof status !== "number") return false;
  return status >= 500 && status < 600;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
