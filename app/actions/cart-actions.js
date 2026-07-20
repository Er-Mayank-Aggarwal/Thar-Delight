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

export async function addProductToDbCart(productId, quantity = 1) {
  const cart = await getDbCart();
  if (!cart) return null;

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
    },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }
}

export async function removeProductFromDbCart(productId) {
  const cart = await getDbCart();
  if (!cart) return null;
  
  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
      productId,
    },
  });
}

export async function updateDbCartItemQuantity(productId, quantity) {
  if (quantity < 1) {
    return await removeProductFromDbCart(productId);
  }

  const cart = await getDbCart();
  if (!cart) return null;
  
  await prisma.cartItem.updateMany({
    where: {
      cartId: cart.id,
      productId,
    },
    data: { quantity },
  });
}

export async function clearDbCart() {
  const cart = await getDbCart();
  if (!cart) return null;
  
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });
}
