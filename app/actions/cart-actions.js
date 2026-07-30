"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { syncCartSchema } from "@/lib/validations";

async function getUserId() {
  const session = await getSession();
  return session?.userId || null;
}


export async function getDbCart() {
  const userId = await getUserId();
  
  if (!userId) {
    return null;
  }

  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: { include: { inventory: true, images: { where: { isPrimary: true }, take: 1 } } } },
        orderBy: { createdAt: "asc" }
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: { include: { product: { include: { inventory: true, images: { where: { isPrimary: true }, take: 1 } } } } },
      },
    });
  }


  return cart;
}

async function getDbCartId() {
  const userId = await getUserId();
  if (!userId) return null;

  let cart = await prisma.cart.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      select: { id: true },
    });
  }

  return cart.id;
}


async function resolveProduct(identifier) {
  if (!identifier) return null;

  return await prisma.product.findFirst({
    where: {
      OR: [
        { id: identifier },
        { slug: identifier }
      ]
    },
    include: { inventory: true }
  });
}

export async function addProductToDbCart(productIdOrSlug, quantity = 1) {
  const cartId = await getDbCartId();
  if (!cartId) return null;

  const product = await resolveProduct(productIdOrSlug);
  if (!product) {
    return { success: false, error: "Product not found" };
  }

  const realProductId = product.id;
  const inventory = product.inventory;
  
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId,
      productId: realProductId,
    },
  });
  
  const totalQuantity = (existingItem?.quantity || 0) + quantity;
  if (inventory && inventory.quantity < totalQuantity) {
    return { success: false, error: `Only ${inventory.quantity} units available in stock` };
  }

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId,
        productId: realProductId,
        quantity,
      },
    });
  }
  
  return { success: true };
}

export async function removeProductFromDbCart(productIdOrSlug) {
  const cartId = await getDbCartId();
  if (!cartId) return null;
  
  const product = await resolveProduct(productIdOrSlug);
  if (!product) return;

  await prisma.cartItem.deleteMany({
    where: {
      cartId,
      productId: product.id,
    },
  });
}

export async function updateDbCartItemQuantity(productIdOrSlug, quantity) {
  if (quantity < 1) {
    await removeProductFromDbCart(productIdOrSlug);
    return { success: true };
  }

  const cartId = await getDbCartId();
  if (!cartId) return null;
  
  const product = await resolveProduct(productIdOrSlug);
  if (!product) return { success: false, error: "Product not found" };

  const inventory = product.inventory;
  if (inventory && inventory.quantity < quantity) {
    return { success: false, error: `Only ${inventory.quantity} units available in stock` };
  }
  
  await prisma.cartItem.updateMany({
    where: {
      cartId,
      productId: product.id,
    },
    data: { quantity },
  });
  
  return { success: true };
}


export async function clearDbCart() {
  const cartId = await getDbCartId();
  if (!cartId) return null;
  
  await prisma.cartItem.deleteMany({
    where: { cartId },
  });
}

export async function syncClientCartToDb(clientCartItems) {
  const userId = await getUserId();
  if (!userId) return { success: false, error: "Not logged in" };

  if (!Array.isArray(clientCartItems) || clientCartItems.length === 0) {
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    return { success: true };
  }

  const parsed = syncCartSchema.safeParse(clientCartItems);
  if (!parsed.success) {
    return { success: false, error: "Invalid cart data format" };
  }

  const validItems = parsed.data;
  const productIds = validItems.map((i) => i.id);

  // Fetch valid existing product IDs from DB
  const existingProducts = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    select: { id: true },
  });
  const validProductSet = new Set(existingProducts.map((p) => p.id));

  const itemsToInsert = validItems.filter((item) => validProductSet.has(item.id));

  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  if (itemsToInsert.length > 0) {
    await prisma.cartItem.createMany({
      data: itemsToInsert.map((item) => ({
        cartId: cart.id,
        productId: item.id,
        quantity: item.quantity,
      })),
    });
  }

  return { success: true };
}

