/**
 * Retry utility for API calls
 */

export interface RetryOptions {
  maxRetries?: number;
  delay?: number;
  backoff?: "linear" | "exponential";
  retryCondition?: (error: any) => boolean;
  onRetry?: (attempt: number, error: any) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  delay: 1000,
  backoff: "exponential",
  retryCondition: (error: any) => {
    // Retry on network errors or 5xx errors
    const status = error?.response?.status || error?.status;
    return (
      !status || // Network error
      status >= 500 || // Server error
      status === 429 // Rate limit
    );
  },
  onRetry: () => {},
};

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate delay based on attempt and backoff strategy
 */
function calculateDelay(attempt: number, baseDelay: number, backoff: "linear" | "exponential"): number {
  if (backoff === "exponential") {
    return baseDelay * Math.pow(2, attempt - 1);
  }
  return baseDelay * attempt;
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: any;

  for (let attempt = 1; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Check if we should retry
      if (!opts.retryCondition(error)) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt >= opts.maxRetries) {
        break;
      }

      // Call onRetry callback
      opts.onRetry(attempt, error);

      // Calculate delay
      const delay = calculateDelay(attempt, opts.delay, opts.backoff);
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Retry with specific conditions
 */
export const retryOnNetworkError = <T>(fn: () => Promise<T>, maxRetries = 3) =>
  retry(fn, {
    maxRetries,
    retryCondition: (error) => {
      // Only retry on network errors (no status code)
      return !error?.response?.status && !error?.status;
    },
  });

export const retryOnServerError = <T>(fn: () => Promise<T>, maxRetries = 3) =>
  retry(fn, {
    maxRetries,
    retryCondition: (error) => {
      const status = error?.response?.status || error?.status;
      return status >= 500 || status === 429;
    },
  });

