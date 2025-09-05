"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export const MainNavigationClient = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-200">
      {/* Desktop Menu */}
      <div className="max-w-7xl mx-auto flex-1 overflow-y-auto px-6 md:px-10">
        <div className="flex justify-between h-auto">
          <div className="hidden md:flex items-center space-x-10">
            {/* Home */}
            <Link href="/" className={`font-medium text-gray-900 border-b-4 py-3 border-transparent hover:border-b-4 hover:border-heritageBlue ${pathname === "/" ? "border-b-4 border-heritageBlue !border-heritageBlue" : ""}`}>
              Home
            </Link>
            {/* Hardware Catalog */}
            <Link href="/catalog" className={`font-medium text-gray-900 border-b-4 py-3 border-transparent hover:border-b-4 hover:border-heritageBlue ${pathname === "/catalog" ? "border-b-4 border-heritageBlue !border-heritageBlue" : ""}`}>
              Hardware Catalog
            </Link>
            {/* Compare */}
            <Link href="/compare" className={`font-medium text-gray-900 border-b-4 py-3 border-transparent hover:border-b-4 hover:border-heritageBlue ${pathname === "/compare" ? "border-b-4 border-heritageBlue !border-heritageBlue" : ""}`}>
              Compare
            </Link>
            {/* My Orders */}
            <Link href="/orders" className={`font-medium text-gray-900 border-b-4 py-3 border-transparent hover:border-b-4 hover:border-heritageBlue ${pathname === "/orders" ? "border-b-4 border-heritageBlue !border-heritageBlue" : ""}`}>
              My Orders
            </Link>
            {/* Support */}
            <Link href="/support" className={`font-medium text-gray-900 border-b-4 py-3 border-transparent hover:border-b-4 hover:border-heritageBlue ${pathname === "/support" ? "border-b-4 border-heritageBlue !border-heritageBlue" : ""}`}>
              Support
            </Link>
          </div>
          <div className="md:hidden flex items-center justify-end">
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
      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-2 pb-3 space-y-1 sm:px-3">
            {/* Home */}
            <Link
              href="/"
              className={`block px-4 py-2 text-3xl font-regular text-gray-900 ${pathname === "/" ? "!text-heritageBlue" : ""}`}
            >
              Home
            </Link>
            {/* Hardware Catalog */}
            <Link
              href="/catalog"
              className={`block px-4 py-2 text-3xl font-regular text-gray-900 ${pathname === "/catalog" ? "!text-heritageBlue" : ""}`}
            >
              Hardware Catalog
            </Link>
            {/* Compare */}
            <Link
              href="/compare"
              className={`block px-4 py-2 text-3xl font-regular text-gray-900 ${pathname === "/compare" ? "!text-heritageBlue" : ""}`}
            >
              Compare
            </Link>
            {/* My Orders */}
            <Link
              href="/orders"
              className={`block px-4 py-2 text-3xl font-regular text-gray-900 ${pathname === "/orders" ? "!text-heritageBlue" : ""}`}
            >
              My Orders
            </Link>
            {/* Support */}
            <Link
              href="/support"
              className={`block px-4 py-2 text-3xl font-regular text-gray-900 ${pathname === "/support" ? "!text-heritageBlue" : ""}`}
            >
              Support
            </Link>
        </div>
      </div>
    </nav>
  );
}; 