import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Pricing & Checkout Calculations: Business Rules", () => {
  // Pure pricing logic extracted from app/actions/checkout-actions.js
  function calculateOrderFinancials({ items, discount = 0, freeDeliveryThreshold = 1000, baseDeliveryCharge = 100 }) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const effectiveDiscount = Math.min(discount, subtotal);
    const discountedSubtotal = subtotal - effectiveDiscount;
    const tax = Number((discountedSubtotal * 0.18).toFixed(2));
    const deliveryCharge = discountedSubtotal > freeDeliveryThreshold ? 0 : baseDeliveryCharge;
    const total = Number((discountedSubtotal + tax + deliveryCharge).toFixed(2));
    const paise = Math.round(total * 100);

    return {
      subtotal,
      effectiveDiscount,
      discountedSubtotal,
      tax,
      deliveryCharge,
      total,
      paise,
    };
  }

  describe("Subtotal Calculation", () => {
    it("should accurately compute subtotal across multiple items and quantities", () => {
      const items = [
        { price: 200, quantity: 2 }, // 400
        { price: 250, quantity: 1 }, // 250
        { price: 50, quantity: 3 },  // 150
      ];
      const res = calculateOrderFinancials({ items });
      assert.equal(res.subtotal, 800);
    });

    it("should return 0 subtotal when cart is empty", () => {
      const res = calculateOrderFinancials({ items: [] });
      assert.equal(res.subtotal, 0);
    });
  });

  describe("Delivery Fee Rules (Threshold: Rs 1000)", () => {
    it("should charge Rs 100 delivery fee when discounted subtotal is below Rs 1000", () => {
      const items = [{ price: 200, quantity: 4 }]; // 800
      const res = calculateOrderFinancials({ items });
      assert.equal(res.deliveryCharge, 100);
    });

    it("should charge Rs 100 delivery fee when discounted subtotal is exactly Rs 1000", () => {
      const items = [{ price: 250, quantity: 4 }]; // 1000
      const res = calculateOrderFinancials({ items });
      assert.equal(res.deliveryCharge, 100);
    });

    it("should waive delivery fee (Rs 0) when discounted subtotal exceeds Rs 1000", () => {
      const items = [
        { price: 250, quantity: 4 }, // 1000
        { price: 50, quantity: 1 },  // 50 -> 1050
      ];
      const res = calculateOrderFinancials({ items });
      assert.equal(res.deliveryCharge, 0);
    });

    it("should consider post-discount subtotal for free delivery qualification", () => {
      // Subtotal 1200, discount 300 -> discountedSubtotal = 900 (should not be free)
      const items = [{ price: 300, quantity: 4 }];
      const res = calculateOrderFinancials({ items, discount: 300 });
      assert.equal(res.discountedSubtotal, 900);
      assert.equal(res.deliveryCharge, 100);
    });
  });

  describe("Taxation (18% GST)", () => {
    it("should calculate 18% GST on the discounted subtotal", () => {
      const items = [{ price: 1000, quantity: 1 }];
      const res = calculateOrderFinancials({ items });
      assert.equal(res.tax, 180); // 18% of 1000
    });

    it("should apply 18% GST after discount is subtracted", () => {
      const items = [{ price: 1000, quantity: 1 }];
      const res = calculateOrderFinancials({ items, discount: 200 }); // discountedSubtotal = 800
      assert.equal(res.tax, 144); // 18% of 800
    });
  });

  describe("Coupon & Total Aggregation", () => {
    it("should not allow discount to exceed order subtotal (no negative balances)", () => {
      const items = [{ price: 200, quantity: 1 }];
      const res = calculateOrderFinancials({ items, discount: 500 });
      assert.equal(res.effectiveDiscount, 200);
      assert.equal(res.discountedSubtotal, 0);
    });

    it("should correctly compute grand total and convert to integer paise for Razorpay", () => {
      const items = [{ price: 200, quantity: 1 }]; // subtotal: 200, delivery: 100, tax: 36 -> total: 336
      const res = calculateOrderFinancials({ items });
      assert.equal(res.total, 336);
      assert.equal(res.paise, 33600); // 336.00 in paise
    });
  });
});

