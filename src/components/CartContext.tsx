"use client";

import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { useToast } from "./ToastContext";

// Define a type for cart items
export interface CartItem {
  model: string;
  brand: string;
  image: string;
  price_usd: number | string;
  price_cad?: number;
  quantity: number;
  recommended?: boolean;
  description?: string;
  card_description?: string;
  category?: string;
  display_name?: string;
  // Add other fields as needed
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

// Custom hook to safely access toast context
const useSafeToast = () => {
  try {
    return useToast();
  } catch (error) {
    return { addToast: () => {} };
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { addToast } = useSafeToast();

  // Helper function to ensure laptops are at the top
  const reorderCartItems = (items: CartItem[]): CartItem[] => {
    const laptops = items.filter(ci => ci.category?.toLowerCase() === 'laptop');
    const nonLaptops = items.filter(ci => ci.category?.toLowerCase() !== 'laptop');
    return [...laptops, ...nonLaptops];
  };

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Reorder items to ensure laptops are at the top
        setCartItems(reorderCartItems(parsedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    // Check if trying to add a laptop when one already exists
    const isLaptop = item.category?.toLowerCase() === 'laptop';
    const hasExistingLaptop = cartItems.some(ci => ci.category?.toLowerCase() === 'laptop');
    
    if (isLaptop && hasExistingLaptop) {
      // Show error message and prevent adding
      addToast('You can only have one laptop in your cart. Please remove the existing laptop before adding a new one.', 'error', 5000);
      return;
    }
    
    // Check if item already exists before updating state
    const existing = cartItems.find(ci => ci.model === item.model);
    const isNewItem = !existing;
    
    setCartItems(prev => {
      if (existing) {
        // Item already exists, update quantity
        return prev.map(ci =>
          ci.model === item.model ? { ...ci, quantity: ci.quantity + (item.quantity || 1) } : ci
        );
      }
      
      // New item added - ensure laptops are placed at the top
      const newItem = { ...item, quantity: item.quantity || 1 };
      
      if (isLaptop) {
        // Place laptop at the top
        return [newItem, ...prev];
      } else {
        // Place other items after existing laptops
        const laptops = prev.filter(ci => ci.category?.toLowerCase() === 'laptop');
        const nonLaptops = prev.filter(ci => ci.category?.toLowerCase() !== 'laptop');
        return [...laptops, newItem, ...nonLaptops];
      }
    });

    // Show toast after state update
    if (isNewItem) {
      addToast(`${item.model} added to cart`, "success");
    } else {
      addToast(`${item.model} quantity updated in cart`, "success");
    }
  };

  const removeFromCart = (model: string) => {
    setCartItems(prev => prev.filter(ci => ci.model !== model));
    addToast(`${model} removed from cart`, "info");
  };

  const updateQuantity = (model: string, quantity: number) => {
    setCartItems(prev => {
      const updatedItems = prev.map(ci =>
        ci.model === model ? { ...ci, quantity } : ci
      );
      // Reorder to ensure laptops stay at the top
      return reorderCartItems(updatedItems);
    });
    addToast(`${model} quantity updated`, "success");
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, cartCount, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export type { CartContextType }; 