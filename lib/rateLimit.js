/**
 * Simple in-memory rate limiter using sliding window.
 * Suitable for single-instance deployments.
 *
 * Usage:
 *   const limiter = createRateLimiter({ windowMs: 60000, max: 5 });
 *   const result = limiter.check("user@email.com");
 *   if (!result.allowed) return { success: false, error: "Too many attempts. Try again later." };
 */

const stores = new Map();

export function createRateLimiter({ windowMs = 60000, max = 5 } = {}) {
  // Each limiter gets its own store keyed by identifier
  const storeKey = `${windowMs}-${max}-${Date.now()}`;

  if (!stores.has(storeKey)) {
    stores.set(storeKey, new Map());
  }

  const store = stores.get(storeKey);

  // Periodically clean up expired entries (every 5 minutes)
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of store.entries()) {
      const filtered = timestamps.filter((t) => now - t < windowMs);
      if (filtered.length === 0) {
        store.delete(key);
      } else {
        store.set(key, filtered);
      }
    }
  }, 5 * 60 * 1000);

  // Don't prevent Node from exiting
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return {
    check(identifier) {
      const now = Date.now();
      const timestamps = store.get(identifier) || [];

      // Remove timestamps outside the window
      const recent = timestamps.filter((t) => now - t < windowMs);

      if (recent.length >= max) {
        return { allowed: false, remaining: 0 };
      }

      recent.push(now);
      store.set(identifier, recent);

      return { allowed: true, remaining: max - recent.length };
    },
  };
}

// Pre-configured limiters for common use cases
export const checkoutLimiter = createRateLimiter({ windowMs: 60000, max: 5 }); // 5 per minute
export const contactLimiter = createRateLimiter({ windowMs: 60000, max: 3 }); // 3 per minute
export const newsletterLimiter = createRateLimiter({ windowMs: 60000, max: 5 }); // 5 per minute

