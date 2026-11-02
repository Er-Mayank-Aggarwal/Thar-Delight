import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  stockUpdateSchema,
  orderStatusSchema,
  productSchema,
  couponSchema,
  profileUpdateSchema,
} from "../lib/validations.js";

describe("Input Validations: Admin & Management Schemas", () => {
  describe("stockUpdateSchema", () => {
    it("should accept valid stock update", () => {
      const res = stockUpdateSchema.safeParse({ productId: "prod_1", newStock: 50 });
      assert.equal(res.success, true);
    });

    it("should accept 0 stock (out-of-stock state)", () => {
      const res = stockUpdateSchema.safeParse({ productId: "prod_1", newStock: 0 });
      assert.equal(res.success, true);
    });

    it("should reject negative stock count", () => {
      const res = stockUpdateSchema.safeParse({ productId: "prod_1", newStock: -5 });
      assert.equal(res.success, false);
    });

    it("should reject non-integer stock count", () => {
      const res = stockUpdateSchema.safeParse({ productId: "prod_1", newStock: 5.5 });
      assert.equal(res.success, false);
    });

    it("should reject missing productId", () => {
      const res = stockUpdateSchema.safeParse({ productId: "", newStock: 10 });
      assert.equal(res.success, false);
    });
  });

  describe("orderStatusSchema", () => {
    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "PACKED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "RETURNED",
    ];

    for (const status of validStatuses) {
      it(`should accept valid order status: ${status}`, () => {
        const res = orderStatusSchema.safeParse({ orderId: "ord_1", newStatus: status });
        assert.equal(res.success, true);
      });
    }

    it("should reject invalid order status transition", () => {
      const res = orderStatusSchema.safeParse({ orderId: "ord_1", newStatus: "REFUNDED" });
      assert.equal(res.success, false);
    });
  });

  describe("productSchema", () => {
    const validProduct = {
      name: "Organic Millet Cookies",
      description: "Baked with pure desi cow ghee and organic millets.",
      price: 250,
      categoryId: "cat_1",
      isActive: true,
      isFeatured: false,
    };

    it("should accept valid product payload", () => {
      const res = productSchema.safeParse(validProduct);
      assert.equal(res.success, true);
    });

    it("should reject negative product price", () => {
      const res = productSchema.safeParse({ ...validProduct, price: -100 });
      assert.equal(res.success, false);
    });

    it("should reject zero product price", () => {
      const res = productSchema.safeParse({ ...validProduct, price: 0 });
      assert.equal(res.success, false);
    });

    it("should reject missing categoryId", () => {
      const res = productSchema.safeParse({ ...validProduct, categoryId: "" });
      assert.equal(res.success, false);
    });

    it("should reject product description exceeding 2000 characters", () => {
      const res = productSchema.safeParse({ ...validProduct, description: "B".repeat(2001) });
      assert.equal(res.success, false);
    });
  });

  describe("couponSchema", () => {
    it("should accept valid percentage coupon", () => {
      const res = couponSchema.safeParse({
        code: "DIWALI20",
        discountType: "PERCENTAGE",
        value: 20,
        maximumDiscount: 200,
        minimumOrder: 500,
        isActive: true,
      });
      assert.equal(res.success, true);
    });

    it("should accept valid fixed value coupon", () => {
      const res = couponSchema.safeParse({
        code: "FLAT100",
        discountType: "FIXED",
        value: 100,
        minimumOrder: 1000,
        isActive: true,
      });
      assert.equal(res.success, true);
    });

    it("should reject negative discount value", () => {
      const res = couponSchema.safeParse({
        code: "BADCOUPON",
        discountType: "PERCENTAGE",
        value: -15,
      });
      assert.equal(res.success, false);
    });
  });

  describe("profileUpdateSchema", () => {
    it("should accept valid profile update", () => {
      const res = profileUpdateSchema.safeParse({
        name: "Mayank Aggarwal",
        email: "mayank@thardelight.com",
        phone: "9876543210",
        gender: "male",
      });
      assert.equal(res.success, true);
    });

    it("should reject profile update with empty name", () => {
      const res = profileUpdateSchema.safeParse({
        name: "",
        email: "mayank@thardelight.com",
      });
      assert.equal(res.success, false);
    });
  });
});

