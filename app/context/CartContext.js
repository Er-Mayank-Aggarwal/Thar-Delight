"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getDbCart, addProductToDbCart, removeProductFromDbCart, updateDbCartItemQuantity, clearDbCart } from "../actions/cart-actions";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load cart from DB on mount
  useEffect(() => {
    setIsMounted(true);
    getDbCart()
      .then((dbCart) => {
        if (!dbCart) {
          setLoading(false);
          return;
        }
        // Map DB CartItems to the format our frontend expects: { ...product, quantity }
        const formattedCart = dbCart.items.map((item) => ({
          ...item.product,
          quantity: item.quantity,
        }));
        setCart(formattedCart);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Failed to fetch cart from DB", e);
        setLoading(false);
      });
  }, []);

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find((item) => item.id === product.id);
    const currentQty = existingItem ? existingItem.quantity : 0;
    const maxStock = product.inventory?.quantity ?? product.stock ?? product.quantityInStock ?? 999;

    if (currentQty + quantity > maxStock) {
      alert(`Cannot add more. Only ${maxStock} units available in stock.`);
      return;
    }

    const previousCart = [...cart];
    // Optimistic update
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });

    // DB update in background
    addProductToDbCart(product.id, quantity)
      .then((res) => {
        if (res && res.success === false) {
          setCart(previousCart);
          alert(res.error);
        }
      })
      .catch((e) => {
        console.error("Failed to add to DB cart", e);
        setCart(previousCart);
        alert("Failed to add to cart");
      });
  };

  const removeFromCart = (productId) => {
    const previousCart = [...cart];
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    removeProductFromDbCart(productId).catch((e) => {
      console.error(e);
      setCart(previousCart);
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId);

    const item = cart.find((i) => i.id === productId);
    const maxStock = item?.inventory?.quantity ?? item?.stock ?? item?.quantityInStock ?? 999;

    if (quantity > maxStock) {
      alert(`Cannot exceed available stock of ${maxStock} units.`);
      return;
    }

    const previousCart = [...cart];
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );

    updateDbCartItemQuantity(productId, quantity)
      .then((res) => {
        if (res && res.success === false) {
          setCart(previousCart);
          alert(res.error);
        }
      })
      .catch((e) => {
        console.error(e);
        setCart(previousCart);
        alert("Failed to update quantity");
      });
  };


  const clearCart = () => {
    const previousCart = [...cart];
    setCart([]);
    clearDbCart().catch((e) => {
      console.error(e);
      setCart(previousCart);
    });
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

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
        loading,
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
