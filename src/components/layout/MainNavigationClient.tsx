"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { LogoutButton } from "../auth/LogoutButton";

export const MainNavigationClient = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-200">
      <div className="max-w-7xl mx-auto flex-1 overflow-y-auto px-6 md:px-10">
        <div className="flex justify-between h-auto items-center">
          <div className="hidden md:flex items-center space-x-10">
            <Link href="/" className={`font-medium text-gray-900 border-b-4 py-3 border-transparent hover:border-b-4 hover:border-heritageBlue ${pathname === "/" ? "border-b-4 border-heritageBlue !border-heritageBlue" : ""}`}>
              Home
            </Link>
            <Link href="/catalog" className={`font-medium text-gray-900 border-b-4 py-3 border-transparent hover:border-b-4 hover:border-heritageBlue ${pathname === "/catalog" ? "border-b-4 border-heritageBlue !border-heritageBlue" : ""}`}>
              Hardware Catalog
            </Link>
            <Link href="/compare" className={`font-medium text-gray-900 border-b-4 py-3 border-transparent hover:border-b-4 hover:border-heritageBlue ${pathname === "/compare" ? "border-b-4 border-heritageBlue !border-heritageBlue" : ""}`}>
              Compare
            </Link>
            <Link href="/orders" className={`font-medium text-gray-900 border-b-4 py-3 border-transparent hover:border-b-4 hover:border-heritageBlue ${pathname === "/orders" ? "border-b-4 border-heritageBlue !border-heritageBlue" : ""}`}>
              My Orders
            </Link>
            <Link href="/support" className={`font-medium text-gray-900 border-b-4 py-3 border-transparent hover:border-b-4 hover:border-heritageBlue ${pathname === "/support" ? "border-b-4 border-heritageBlue !border-heritageBlue" : ""}`}>
              Support
            </Link>
          </div>
          <div className="hidden md:flex items-center">
            <LogoutButton className="font-medium text-gray-900 py-3 hover:text-heritageBlue underline-offset-2 hover:underline disabled:opacity-60" />
          </div>
          <div className="md:hidden flex items-center justify-end w-full">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none py-3"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className={`block px-4 py-2 text-3xl font-regular text-gray-900 ${pathname === "/" ? "!text-heritageBlue" : ""}`}
            >
              Home
            </Link>
            <Link
              href="/catalog"
              className={`block px-4 py-2 text-3xl font-regular text-gray-900 ${pathname === "/catalog" ? "!text-heritageBlue" : ""}`}
            >
              Hardware Catalog
            </Link>
            <Link
              href="/compare"
              className={`block px-4 py-2 text-3xl font-regular text-gray-900 ${pathname === "/compare" ? "!text-heritageBlue" : ""}`}
            >
              Compare
            </Link>
            <Link
              href="/orders"
              className={`block px-4 py-2 text-3xl font-regular text-gray-900 ${pathname === "/orders" ? "!text-heritageBlue" : ""}`}
            >
              My Orders
            </Link>
            <Link
              href="/cart"
              className={`block px-4 py-2 text-3xl font-regular text-gray-900 ${pathname === "/cart" ? "!text-heritageBlue" : ""}`}
            >
              Cart
            </Link>
            <Link
              href="/profile"
              className={`block px-4 py-2 text-3xl font-regular text-gray-900 ${pathname === "/profile" ? "!text-heritageBlue" : ""}`}
            >
              Profile
            </Link>
            <Link
              href="/support"
              className={`block px-4 py-2 text-3xl font-regular text-gray-900 ${pathname === "/support" ? "!text-heritageBlue" : ""}`}
            >
              Support
            </Link>
            <div className="px-4 py-2">
              <LogoutButton className="text-3xl font-regular text-gray-900 hover:text-heritageBlue disabled:opacity-60" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
