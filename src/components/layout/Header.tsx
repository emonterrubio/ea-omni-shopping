"use client";
import React, { useContext, useEffect } from "react";
import { ShoppingCart, Search as SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { CartContext } from "../CartContext";
import type { CartContextType } from "../CartContext";
import { useSpring, animated } from "@react-spring/web";
import { LogoutButton } from "../auth/LogoutButton";

export function Header({ cartItems: cartItemsProp }: { cartItems?: number }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { cartCount } = useContext(CartContext) as CartContextType;
  const cartItems = cartItemsProp !== undefined ? cartItemsProp : cartCount;
  const [styles, api] = useSpring(() => ({ scale: 1 }));

  useEffect(() => {
    if (cartItems > 0) {
      api.start({
        scale: 1.4,
        config: { tension: 450, friction: 20 },
      });
      const timeout = setTimeout(() => {
        api.start({ scale: 1 });
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [cartItems, api]);

  return (
    <header className="sticky top-0 z-50 bg-deepBlue relative">
      <div className="absolute left-0 w-full h-full pointer-events-none z-0">
        <svg
          viewBox="0 0 200 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <polygon points="0,0 50,0 60,100 0,100" fill="#255AF6" />
        </svg>
      </div>
      <div className="absolute right-0 w-full h-full pointer-events-none z-0">
        <svg
          viewBox="0 0 150 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <circle cx="270" cy="60" r="150" fill="#255AF6" />
        </svg>
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between ml-1 px-4 sm:px-6 md:px-8 py-6">
          <div className="flex items-center">
            <Link href="/">
              <img
                src="/logo/ea_logo_white.svg"
                alt="Omni Shopping"
                className="h-10 object-contain"
              />
            </Link>
          </div>
          <div className="flex-1 flex justify-end items-center relative space-x-1 sm:space-x-4">
            {!isHome && (
              <Link
                href="/search"
                className="p-2 text-white hover:text-gray-100"
                aria-label="Search"
              >
                <SearchIcon className="w-6 h-6" />
              </Link>
            )}
            <Link
              href="/cart"
              className="relative p-2 text-white hover:text-gray-100"
              aria-label="Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItems > 0 && (
                <animated.span
                  style={styles}
                  className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full"
                >
                  {cartItems}
                </animated.span>
              )}
            </Link>
            <LogoutButton />
            <button type="button" className="p-2 text-white hover:text-gray-100" aria-label="Account">
              <img
                src="/images/ed-avatar.png"
                alt="User Avatar"
                className="h-10 object-contain rounded-full"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
