import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";
import { verifyPaymentSignature, verifyWebhookSignature } from "../lib/razorpay.js";

describe("Payment Security: Razorpay Signatures & Integrity", () => {
  const TEST_SECRET = "test_razorpay_secret_key_123456";
  const TEST_WEBHOOK_SECRET = "test_webhook_secret_key_abcdef";

  beforeEach(() => {
    process.env.RAZORPAY_KEY_SECRET = TEST_SECRET;
    process.env.RAZORPAY_WEBHOOK_SECRET = TEST_WEBHOOK_SECRET;
  });

  describe("verifyPaymentSignature", () => {
    const orderId = "order_O123456789";
    const paymentId = "pay_P987654321";

    function computeValidSig(ordId, payId, secret) {
      return crypto
        .createHmac("sha256", secret)
        .update(`${ordId}|${payId}`)
        .digest("hex");
    }

    it("should return true for a cryptographically valid HMAC-SHA256 signature", () => {
      const validSig = computeValidSig(orderId, paymentId, TEST_SECRET);
      const res = verifyPaymentSignature({
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: validSig,
      });
      assert.equal(res, true);
    });

    it("should return false when the signature string is tampered", () => {
      const validSig = computeValidSig(orderId, paymentId, TEST_SECRET);
      const tamperedSig = validSig.slice(0, -2) + "00";
      const res = verifyPaymentSignature({
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: tamperedSig,
      });
      assert.equal(res, false);
    });

    it("should return false when razorpayOrderId belongs to a different order", () => {
      const validSig = computeValidSig(orderId, paymentId, TEST_SECRET);
      const res = verifyPaymentSignature({
        razorpayOrderId: "order_DIFFERENT_999",
        razorpayPaymentId: paymentId,
        razorpaySignature: validSig,
      });
      assert.equal(res, false);
    });

    it("should return false when razorpayPaymentId is altered", () => {
      const validSig = computeValidSig(orderId, paymentId, TEST_SECRET);
      const res = verifyPaymentSignature({
        razorpayOrderId: orderId,
        razorpayPaymentId: "pay_ATTACKER_FRAUD",
        razorpaySignature: validSig,
      });
      assert.equal(res, false);
    });

    it("should return false when the signature length is different (timing-safe check)", () => {
      const res = verifyPaymentSignature({
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: "short_invalid_sig",
      });
      assert.equal(res, false);
    });

    it("should return false when RAZORPAY_KEY_SECRET is not set", () => {
      delete process.env.RAZORPAY_KEY_SECRET;
      const validSig = computeValidSig(orderId, paymentId, TEST_SECRET);
      const res = verifyPaymentSignature({
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: validSig,
      });
      assert.equal(res, false);
    });

    it("should return false when any required argument is missing or undefined", () => {
      assert.equal(verifyPaymentSignature({}), false);
      assert.equal(verifyPaymentSignature({ razorpayOrderId: orderId }), false);
    });
  });

  describe("verifyWebhookSignature", () => {
    const rawBody = JSON.stringify({
      event: "order.paid",
      payload: { payment: { entity: { id: "pay_1", amount: 20000 } } },
    });

    function computeWebhookSig(body, secret) {
      return crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex");
    }

    it("should return true for an authentic webhook event signature", () => {
      const validSig = computeWebhookSig(rawBody, TEST_WEBHOOK_SECRET);
      const res = verifyWebhookSignature(rawBody, validSig);
      assert.equal(res, true);
    });

    it("should return false when raw body content was modified in transit", () => {
      const validSig = computeWebhookSig(rawBody, TEST_WEBHOOK_SECRET);
      const modifiedBody = rawBody.replace("20000", "10000");
      const res = verifyWebhookSignature(modifiedBody, validSig);
      assert.equal(res, false);
    });

    it("should return false when webhook signature is forged or invalid", () => {
      const res = verifyWebhookSignature(rawBody, "invalid_webhook_signature");
      assert.equal(res, false);
    });

    it("should return false when RAZORPAY_WEBHOOK_SECRET is empty", () => {
      delete process.env.RAZORPAY_WEBHOOK_SECRET;
      const validSig = computeWebhookSig(rawBody, TEST_WEBHOOK_SECRET);
      const res = verifyWebhookSignature(rawBody, validSig);
      assert.equal(res, false);
    });
  });
});
