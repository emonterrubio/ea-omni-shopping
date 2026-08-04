"use client";

import React, { createContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";
import { findProductByModel } from "@/data/products";
import { resolveProductImage } from "@/lib/product-image";

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

function normalizeCartItem(item: CartItem): CartItem {
  const catalog = findProductByModel(item.model);
  const rawPrice = item.price ?? catalog?.price;
  let price: number | string = 0;
  if (typeof rawPrice === "number" && Number.isFinite(rawPrice)) {
    price = rawPrice;
  } else if (typeof rawPrice === "string" && rawPrice.trim()) {
    const parsed = Number(rawPrice.replace(/,/g, ""));
    price = Number.isFinite(parsed) ? parsed : catalog?.price ?? 0;
  } else if (catalog?.price != null) {
    price = catalog.price;
  }

  return {
    ...item,
    brand: item.brand || catalog?.brand || "",
    image: resolveProductImage(item.model, item.image || catalog?.image, item.brand || catalog?.brand),
    price,
    quantity: item.quantity > 0 ? item.quantity : 1,
    description: item.description ?? catalog?.description,
    card_description: item.card_description ?? catalog?.card_description,
    category: item.category ?? catalog?.category,
  };
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem, options?: { silent?: boolean }) => void;
  addItemsToCart: (items: CartItem[]) => void;
  removeFromCart: (model: string) => void;
  updateQuantity: (model: string, quantity: number) => void;
  cartCount: number;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  addItemsToCart: () => {},
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
          setCartItems(parsedCart.map((item: CartItem) => normalizeCartItem(item)));
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

  const addToCart = (item: CartItem, options?: { silent?: boolean }) => {
    const normalized = normalizeCartItem(item);
    const existing = cartItems.find((ci) => ci.model === normalized.model);
    const isNewItem = !existing;

    setCartItems((prev) => {
      const current = prev.find((ci) => ci.model === normalized.model);
      if (current) {
        return prev.map((ci) =>
          ci.model === normalized.model
            ? { ...ci, quantity: ci.quantity + (normalized.quantity || 1) }
            : ci,
        );
      }
      return [...prev, normalized];
    });

    if (!options?.silent) {
      if (isNewItem) {
        addToast(`${normalized.model} added to cart`, "success");
      } else {
        addToast(`${normalized.model} quantity updated in cart`, "success");
      }
    }
  };

  const addItemsToCart = (items: CartItem[]) => {
    if (!items.length) return;

    setCartItems((prev) => {
      let next = prev;
      for (const item of items) {
        const normalized = normalizeCartItem(item);
        const index = next.findIndex((ci) => ci.model === normalized.model);
        if (index >= 0) {
          next = next.map((ci, i) =>
            i === index
              ? { ...ci, quantity: ci.quantity + (normalized.quantity || 1) }
              : ci,
          );
        } else {
          next = [...next, normalized];
        }
      }
      return next;
    });

    addToast(
      items.length === 1
        ? `${normalizeCartItem(items[0]).model} added to cart`
        : `${items.length} items added to cart`,
      "success",
    );
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
      value={{ cartItems, addToCart, addItemsToCart, removeFromCart, updateQuantity, cartCount, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export type { CartContextType };
