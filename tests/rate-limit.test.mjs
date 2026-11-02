import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createRateLimiter } from "../lib/rateLimit.js";

describe("Infrastructure: Rate Limiter Mechanism", () => {
  it("should allow requests under the maximum limit", () => {
    const limiter = createRateLimiter({ windowMs: 10000, max: 3 });
    const r1 = limiter.check("user_1");
    const r2 = limiter.check("user_1");

    assert.equal(r1.allowed, true);
    assert.equal(r1.remaining, 2);
    assert.equal(r2.allowed, true);
    assert.equal(r2.remaining, 1);
  });

  it("should block requests once maximum threshold is reached", () => {
    const limiter = createRateLimiter({ windowMs: 10000, max: 2 });
    limiter.check("user_2");
    limiter.check("user_2");
    const blocked = limiter.check("user_2");

    assert.equal(blocked.allowed, false);
    assert.equal(blocked.remaining, 0);
  });

  it("should track rate limits independently across different client keys", () => {
    const limiter = createRateLimiter({ windowMs: 10000, max: 2 });
    limiter.check("alice");
    limiter.check("alice");
    const aliceBlocked = limiter.check("alice");
    const bobAllowed = limiter.check("bob");

    assert.equal(aliceBlocked.allowed, false);
    assert.equal(bobAllowed.allowed, true);
    assert.equal(bobAllowed.remaining, 1);
  });

  it("should reset rate limit window after windowMs has elapsed", async () => {
    const limiter = createRateLimiter({ windowMs: 50, max: 1 });
    const first = limiter.check("user_window");
    assert.equal(first.allowed, true);

    const immediate = limiter.check("user_window");
    assert.equal(immediate.allowed, false);

    // Wait for window to expire
    await new Promise((resolve) => setTimeout(resolve, 60));

    const afterExpiry = limiter.check("user_window");
    assert.equal(afterExpiry.allowed, true);
  });
});

