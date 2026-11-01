"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import {
  getDbCart,
  addProductToDbCart,
  removeProductFromDbCart,
  updateDbCartItemQuantity,
  clearDbCart,
  mergeGuestCartWithDb,
} from "../actions/cart-actions";
import { useSession } from "@/lib/auth-client";

const GUEST_CART_KEY = "thar_delight_guest_cart";
const CartContext = createContext();

function formatDbCartItems(dbCart) {
  if (!dbCart?.items) return [];
  return dbCart.items.map((item) => ({
    ...item.product,
    image: item.product.images?.[0]?.url || item.product.image || "",
    quantity: item.quantity,
  }));
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const { data: session, isPending: sessionPending } = useSession();
  const userId = session?.user?.id;
  const isMergingRef = useRef(false);

  // Sync cart when session status changes or on initial mount
  const syncCartState = useCallback(async () => {
    if (sessionPending) return;

    if (userId) {
      try {
        setLoading(true);
        // Check for existing guest cart to merge
        if (!isMergingRef.current && typeof window !== "undefined") {
          const rawGuestCart = localStorage.getItem(GUEST_CART_KEY);
          if (rawGuestCart) {
            try {
              const guestItems = JSON.parse(rawGuestCart);
              if (Array.isArray(guestItems) && guestItems.length > 0) {
                isMergingRef.current = true;
                await mergeGuestCartWithDb(guestItems);
                localStorage.removeItem(GUEST_CART_KEY);
              }
            } catch (err) {
              console.error("Failed to merge guest cart with account:", err);
            } finally {
              isMergingRef.current = false;
            }
          }
        }

        // Fetch fresh cart from DB
        const dbCart = await getDbCart();
        setCart(formatDbCartItems(dbCart));
      } catch (err) {
        console.error("Failed to fetch user cart:", err);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest mode: load from localStorage
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem(GUEST_CART_KEY);
          if (raw) {
            setCart(JSON.parse(raw));
          } else {
            setCart([]);
          }
        } catch {
          setCart([]);
        }
      }
      setLoading(false);
    }
  }, [userId, sessionPending]);

  useEffect(() => {
    setIsMounted(true);
    syncCartState();
  }, [syncCartState]);

  // Persist guest cart updates to localStorage
  const saveGuestCart = useCallback((updatedCart) => {
    if (typeof window !== "undefined" && !userId) {
      try {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedCart));
      } catch (err) {
        console.error("Failed to save guest cart to localStorage:", err);
      }
    }
  }, [userId]);

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(
      (item) => item.id === product.id || (item.slug && item.slug === product.slug)
    );
    const currentQty = existingItem ? existingItem.quantity : 0;
    const maxStock = product.inventory?.quantity ?? product.stock ?? product.quantityInStock ?? 999;

    if (currentQty + quantity > maxStock) {
      alert(`Cannot add more. Only ${maxStock} units available in stock.`);
      return;
    }

    const previousCart = [...cart];
    const updatedCart = existingItem
      ? cart.map((item) =>
          item.id === product.id || (item.slug && item.slug === product.slug)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [
          ...cart,
          {
            ...product,
            image: product.image || product.images?.[0]?.url || "",
            quantity,
          },
        ];

    setCart(updatedCart);

    if (!userId) {
      saveGuestCart(updatedCart);
      return;
    }

    // Logged in: Sync with DB
    const targetIdentifier = product.slug || product.id;
    addProductToDbCart(targetIdentifier, quantity)
      .then((res) => {
        if (res && res.success === false) {
          setCart(previousCart);
          alert(res.error || "Failed to add to cart");
        }
      })
      .catch((e) => {
        console.error("Failed to add to DB cart:", e);
        setCart(previousCart);
        alert("Failed to add to cart");
      });
  };

  const removeFromCart = (productIdOrSlug) => {
    const previousCart = [...cart];
    const updatedCart = cart.filter(
      (item) => item.id !== productIdOrSlug && item.slug !== productIdOrSlug
    );
    setCart(updatedCart);

    if (!userId) {
      saveGuestCart(updatedCart);
      return;
    }

    removeProductFromDbCart(productIdOrSlug).catch((e) => {
      console.error("Failed to remove item from DB cart:", e);
      setCart(previousCart);
    });
  };

  const updateQuantity = (productIdOrSlug, quantity) => {
    if (quantity < 1) {
      return removeFromCart(productIdOrSlug);
    }

    const item = cart.find((i) => i.id === productIdOrSlug || i.slug === productIdOrSlug);
    const maxStock = item?.inventory?.quantity ?? item?.stock ?? item?.quantityInStock ?? 999;

    if (quantity > maxStock) {
      alert(`Cannot exceed available stock of ${maxStock} units.`);
      return;
    }

    const previousCart = [...cart];
    const updatedCart = cart.map((i) =>
      i.id === productIdOrSlug || i.slug === productIdOrSlug ? { ...i, quantity } : i
    );
    setCart(updatedCart);

    if (!userId) {
      saveGuestCart(updatedCart);
      return;
    }

    updateDbCartItemQuantity(productIdOrSlug, quantity)
      .then((res) => {
        if (res && res.success === false) {
          setCart(previousCart);
          alert(res.error || "Failed to update quantity");
        }
      })
      .catch((e) => {
        console.error("Failed to update item quantity in DB:", e);
        setCart(previousCart);
        alert("Failed to update quantity");
      });
  };

  const clearCart = () => {
    const previousCart = [...cart];
    setCart([]);

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(GUEST_CART_KEY);
      } catch {}
    }

    if (userId) {
      clearDbCart().catch((e) => {
        console.error("Failed to clear DB cart:", e);
        setCart(previousCart);
      });
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        loading: loading || !isMounted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
