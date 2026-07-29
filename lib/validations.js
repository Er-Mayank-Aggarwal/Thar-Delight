import { z } from "zod";

// ─── Checkout / Address ──────────────────────────────────────────────
export const placeOrderSchema = z.object({
  email: z.string().email("Invalid email"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
  address: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  district: z.string().optional(),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters").max(10),
  landmark: z.string().optional(),
  saveAddress: z.boolean().optional().default(false),
  couponCode: z.string().optional(),
  addressId: z.string().optional(),
});

export const addressSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(100).optional(),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(15).optional(),
  street: z.string().min(1).max(200).optional(),
  addressLine1: z.string().min(1).max(200).optional(),
  city: z.string().min(1, "City is required"),
  district: z.string().optional(),
  state: z.string().min(1, "State is required"),
  country: z.string().max(50).optional(),
  zipCode: z.string().min(5).max(10).optional(),
  pincode: z.string().min(5).max(10).optional(),
  landmark: z.string().optional(),
  isDefault: z.boolean().optional().default(false),
});

// ─── Profile ─────────────────────────────────────────────────────────
export const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(15).optional().nullable(),
  gender: z.string().optional().nullable(),
  dob: z.union([z.string(), z.date()]).optional().nullable(),
});

// ─── Admin: Inventory ────────────────────────────────────────────────
export const stockUpdateSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  newStock: z.number().int().min(0, "Stock cannot be negative"),
});

// ─── Admin: Order Status ─────────────────────────────────────────────
export const orderStatusSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  newStatus: z.enum([
    "PENDING",
    "CONFIRMED",
    "PACKED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
  ]),
});

// ─── Admin: Product ──────────────────────────────────────────────────
export const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200),
  description: z.string().min(1, "Description is required").max(2000),
  price: z.number().positive("Price must be positive"),
  categoryId: z.string().min(1, "Category is required"),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  imageUrl: z.string().url().optional(),
});

// ─── Admin: Coupon ───────────────────────────────────────────────────
export const couponSchema = z.object({
  code: z.string().min(1, "Coupon code is required").max(50),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().positive("Discount value must be positive"),
  minimumOrder: z.number().min(0).optional().nullable(),
  maximumDiscount: z.number().min(0).optional().nullable(),
  usageLimit: z.number().int().min(1).optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

// ─── Contact & Newsletter ─────────────────────────────────────────────
export const contactMessageSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Valid email is required").max(150),
  phone: z.string().min(1, "Phone number is required").max(20),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(1, "Message is required").max(2000),
});

export const newsletterSchema = z.object({
  email: z.string().email("Valid email address is required").max(150),
});

// ─── Cart Sync ────────────────────────────────────────────────────────
export const syncCartSchema = z.array(
  z.object({
    id: z.string().min(1, "Product ID is required"),
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
  })
);

