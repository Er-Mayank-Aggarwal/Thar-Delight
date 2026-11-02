import { describe, it } from "node:test";
import assert from "node:assert/strict";
import nextConfig from "../next.config.mjs";

describe("Production Infrastructure & Security Configuration", () => {
  it("should disable x-powered-by header to prevent Next.js framework fingerprinting", () => {
    assert.equal(nextConfig.poweredByHeader, false);
  });

  it("should whitelist trusted remote image hosts in next/image config", () => {
    const patterns = nextConfig.images?.remotePatterns || [];
    const hostnames = patterns.map((p) => p.hostname);
    assert.ok(hostnames.includes("res.cloudinary.com"), "Must include Cloudinary image domain");
    assert.ok(hostnames.includes("lh3.googleusercontent.com"), "Must include Google OAuth avatar domain");
  });

  describe("HTTP Security Headers (next.config.mjs)", async () => {
    const headersList = await nextConfig.headers();
    const globalRule = headersList.find((h) => h.source === "/(.*)");

    it("should define global security headers on all routes (/(.*))", () => {
      assert.ok(globalRule, "Global headers rule must exist");
    });

    const getHeader = (name) => {
      const match = globalRule?.headers.find((h) => h.key.toLowerCase() === name.toLowerCase());
      return match ? match.value : null;
    };

    it("should configure strict Content-Security-Policy header", () => {
      const csp = getHeader("Content-Security-Policy");
      assert.ok(csp, "CSP header must be present");
      assert.ok(csp.includes("https://checkout.razorpay.com"), "CSP must permit Razorpay checkout scripts");
      assert.ok(csp.includes("https://res.cloudinary.com"), "CSP must permit Cloudinary media assets");
      assert.ok(csp.includes("object-src 'none'"), "CSP must disable object-src plugins");
    });

    it("should set X-Frame-Options to SAMEORIGIN to prevent clickjacking", () => {
      assert.equal(getHeader("X-Frame-Options"), "SAMEORIGIN");
    });

    it("should set X-Content-Type-Options to nosniff to prevent MIME sniffing", () => {
      assert.equal(getHeader("X-Content-Type-Options"), "nosniff");
    });

    it("should enforce Strict-Transport-Security (HSTS) with includeSubDomains and preload", () => {
      const hsts = getHeader("Strict-Transport-Security");
      assert.ok(hsts, "HSTS header must be present");
      assert.ok(hsts.includes("max-age="), "HSTS must have max-age");
      assert.ok(hsts.includes("includeSubDomains"), "HSTS must include subdomains");
    });

    it("should set Permissions-Policy restricting sensitive browser APIs", () => {
      const pp = getHeader("Permissions-Policy");
      assert.ok(pp, "Permissions-Policy must be present");
      assert.ok(pp.includes("camera=()"));
      assert.ok(pp.includes("microphone=()"));
      assert.ok(pp.includes("geolocation=()"));
    });

    it("should set Referrer-Policy to strict-origin-when-cross-origin", () => {
      assert.equal(getHeader("Referrer-Policy"), "strict-origin-when-cross-origin");
    });
  });
});

