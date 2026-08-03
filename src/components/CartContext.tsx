"use client";

import React, { createContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

export interface CartItem {
  model: string;
  brand: string;
  image: string;
  price: number | string;
  quantity: number;
  recommended?: boolean;
  description?: string;
  card_description?: string;
  category?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (model: string) => void;
  updateQuantity: (model: string, quantity: number) => void;
  cartCount: number;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  cartCount: 0,
  clearCart: () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems, hydrated]);

  const addToCart = (item: CartItem) => {
    const existing = cartItems.find((ci) => ci.model === item.model);
    const isNewItem = !existing;

    setCartItems((prev) => {
      const current = prev.find((ci) => ci.model === item.model);
      if (current) {
        return prev.map((ci) =>
          ci.model === item.model
            ? { ...ci, quantity: ci.quantity + (item.quantity || 1) }
            : ci,
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });

    if (isNewItem) {
      addToast(`${item.model} added to cart`, "success");
    } else {
      addToast(`${item.model} quantity updated in cart`, "success");
    }
  };

  const removeFromCart = (model: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.model !== model));
    addToast(`${model} removed from cart`, "info");
  };

  const updateQuantity = (model: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((ci) => (ci.model === model ? { ...ci, quantity } : ci)),
    );
    addToast(`${model} quantity updated`, "success");
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, cartCount, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export type { CartContextType };
