import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  placeOrderSchema,
  addressSchema,
  reviewSchema,
  contactMessageSchema,
  newsletterSchema,
  syncCartSchema,
} from "../lib/validations.js";

describe("Input Validations: Customer Schemas", () => {
  describe("placeOrderSchema", () => {
    const validOrder = {
      email: "customer@thardelight.com",
      firstName: "Mayank",
      lastName: "Aggarwal",
      phone: "9876543210",
      address: "12, Desert Crafts Plaza",
      city: "Jodhpur",
      state: "Rajasthan",
      zipCode: "342001",
      paymentMethod: "ONLINE",
    };

    it("should accept valid order payload", () => {
      const res = placeOrderSchema.safeParse(validOrder);
      assert.equal(res.success, true);
    });

    it("should reject invalid email format", () => {
      const res = placeOrderSchema.safeParse({ ...validOrder, email: "not-an-email" });
      assert.equal(res.success, false);
      const issues = res.error?.issues || res.error?.errors;
      assert.equal(issues[0].path[0], "email");
    });

    it("should reject missing firstName", () => {
      const res = placeOrderSchema.safeParse({ ...validOrder, firstName: "" });
      assert.equal(res.success, false);
      const issues = res.error?.issues || res.error?.errors;
      assert.equal(issues[0].path[0], "firstName");
    });

    it("should reject phone number shorter than 10 digits", () => {
      const res = placeOrderSchema.safeParse({ ...validOrder, phone: "98765432" });
      assert.equal(res.success, false);
      const issues = res.error?.issues || res.error?.errors;
      assert.equal(issues[0].path[0], "phone");
    });

    it("should reject phone number longer than 15 digits", () => {
      const res = placeOrderSchema.safeParse({ ...validOrder, phone: "1234567890123456" });
      assert.equal(res.success, false);
      const issues = res.error?.issues || res.error?.errors;
      assert.equal(issues[0].path[0], "phone");
    });

    it("should reject missing street address", () => {
      const res = placeOrderSchema.safeParse({ ...validOrder, address: "" });
      assert.equal(res.success, false);
      const issues = res.error?.issues || res.error?.errors;
      assert.equal(issues[0].path[0], "address");
    });

    it("should reject missing city", () => {
      const res = placeOrderSchema.safeParse({ ...validOrder, city: "" });
      assert.equal(res.success, false);
      const issues = res.error?.issues || res.error?.errors;
      assert.equal(issues[0].path[0], "city");
    });

    it("should reject missing state", () => {
      const res = placeOrderSchema.safeParse({ ...validOrder, state: "" });
      assert.equal(res.success, false);
      const issues = res.error?.issues || res.error?.errors;
      assert.equal(issues[0].path[0], "state");
    });

    it("should reject ZIP code shorter than 5 characters", () => {
      const res = placeOrderSchema.safeParse({ ...validOrder, zipCode: "123" });
      assert.equal(res.success, false);
      const issues = res.error?.issues || res.error?.errors;
      assert.equal(issues[0].path[0], "zipCode");
    });

    it("should default paymentMethod to ONLINE when omitted", () => {
      const { paymentMethod, ...withoutPayment } = validOrder;
      const res = placeOrderSchema.safeParse(withoutPayment);
      assert.equal(res.success, true);
      assert.equal(res.data.paymentMethod, "ONLINE");
    });

    it("should accept COD payment method", () => {
      const res = placeOrderSchema.safeParse({ ...validOrder, paymentMethod: "COD" });
      assert.equal(res.success, true);
      assert.equal(res.data.paymentMethod, "COD");
    });

    it("should reject invalid payment method enum", () => {
      const res = placeOrderSchema.safeParse({ ...validOrder, paymentMethod: "BITCOIN" });
      assert.equal(res.success, false);
      const issues = res.error?.issues || res.error?.errors;
      assert.equal(issues[0].path[0], "paymentMethod");
    });
  });

  describe("addressSchema", () => {
    it("should accept valid customer address", () => {
      const res = addressSchema.safeParse({
        city: "Jodhpur",
        state: "Rajasthan",
        phone: "9876543210",
        pincode: "342001",
      });
      assert.equal(res.success, true);
    });

    it("should reject address with missing city", () => {
      const res = addressSchema.safeParse({
        state: "Rajasthan",
        city: "",
      });
      assert.equal(res.success, false);
    });
  });

  describe("reviewSchema", () => {
    it("should accept valid review with rating and comment", () => {
      const res = reviewSchema.safeParse({
        productId: "cm123456",
        rating: 5,
        comment: "Excellent crunchy millet cookies!",
      });
      assert.equal(res.success, true);
    });

    it("should reject rating lower than 1", () => {
      const res = reviewSchema.safeParse({
        productId: "cm123456",
        rating: 0,
      });
      assert.equal(res.success, false);
    });

    it("should reject rating greater than 5", () => {
      const res = reviewSchema.safeParse({
        productId: "cm123456",
        rating: 6,
      });
      assert.equal(res.success, false);
    });

    it("should reject comment exceeding 1000 characters", () => {
      const res = reviewSchema.safeParse({
        productId: "cm123456",
        rating: 4,
        comment: "A".repeat(1001),
      });
      assert.equal(res.success, false);
    });
  });

  describe("contactMessageSchema & newsletterSchema", () => {
    it("should accept valid contact form message", () => {
      const res = contactMessageSchema.safeParse({
        name: "Mayank",
        email: "test@example.com",
        phone: "9876543210",
        subject: "Bulk Order Query",
        message: "Hello, looking for corporate gift hampers.",
      });
      assert.equal(res.success, true);
    });

    it("should reject contact message with missing subject", () => {
      const res = contactMessageSchema.safeParse({
        name: "Mayank",
        email: "test@example.com",
        phone: "9876543210",
        subject: "",
        message: "Hi",
      });
      assert.equal(res.success, false);
    });

    it("should accept valid newsletter subscription email", () => {
      const res = newsletterSchema.safeParse({ email: "foodie@thardelight.com" });
      assert.equal(res.success, true);
    });

    it("should reject invalid newsletter email", () => {
      const res = newsletterSchema.safeParse({ email: "invalid-email" });
      assert.equal(res.success, false);
    });
  });

  describe("syncCartSchema", () => {
    it("should accept valid array of cart items", () => {
      const res = syncCartSchema.safeParse([
        { id: "prod_1", quantity: 2 },
        { id: "prod_2", quantity: 1 },
      ]);
      assert.equal(res.success, true);
    });

    it("should reject cart item with quantity less than 1", () => {
      const res = syncCartSchema.safeParse([{ id: "prod_1", quantity: 0 }]);
      assert.equal(res.success, false);
    });
  });
});
