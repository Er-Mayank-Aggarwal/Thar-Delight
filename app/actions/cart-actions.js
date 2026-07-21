"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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
        include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
        orderBy: { createdAt: "asc" }
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: { include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } } },
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

export async function addProductToDbCart(productId, quantity = 1) {
  const cartId = await getDbCartId();
  if (!cartId) return null;

  const inventory = await prisma.inventory.findUnique({ where: { productId } });
  
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId,
      productId,
    },
  });
  
  const totalQuantity = (existingItem?.quantity || 0) + quantity;
  if (inventory && inventory.quantity < totalQuantity) {
    return { success: false, error: "Product is out of stock or requested quantity exceeds available stock" };
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
        productId,
        quantity,
      },
    });
  }
  
  return { success: true };
}

export async function removeProductFromDbCart(productId) {
  const cartId = await getDbCartId();
  if (!cartId) return null;
  
  await prisma.cartItem.deleteMany({
    where: {
      cartId,
      productId,
    },
  });
}

export async function updateDbCartItemQuantity(productId, quantity) {
  if (quantity < 1) {
    await removeProductFromDbCart(productId);
    return { success: true };
  }

  const cartId = await getDbCartId();
  if (!cartId) return null;
  
  const inventory = await prisma.inventory.findUnique({ where: { productId } });
  if (inventory && inventory.quantity < quantity) {
    return { success: false, error: "Requested quantity exceeds available stock" };
  }
  
  await prisma.cartItem.updateMany({
    where: {
      cartId,
      productId,
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

  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  
  if (clientCartItems && clientCartItems.length > 0) {
    await prisma.cartItem.createMany({
      data: clientCartItems.map(item => ({
        cartId: cart.id,
        productId: item.id,
        quantity: item.quantity
      }))
    });
  }

  return { success: true };
}
