"use client";

import React, { useContext, useEffect, useState } from "react";
import { ProductCardProps } from "@/types/ProductCardProps";
import { CartContext, CartItem } from "@/components/CartContext";
import Link from "next/link";
import {
  PRODUCT_IMAGE_PLACEHOLDER,
  resolveProductImage,
} from "@/lib/product-image";

function inferCategory(model: string, category: string): string {
  if (category) return category;

  const name = model.toLowerCase();
  if (name.includes("macbook") || name.includes("latitude") || name.includes("xps") || name.includes("surface")) return "Laptops";
  if (name.includes("tower") || name.includes("precision")) return "Desktops";
  if (name.includes("monitor") || name.includes("display")) return "Monitors";
  if (name.includes("headphone") || name.includes("earbud")) return "Audio";
  if (name.includes("mouse") || name.includes("keyboard")) return "Accessories";
  if (name.includes("webcam") || name.includes("camera")) return "Webcams";
  if (name.includes("dock") || name.includes("station")) return "Docking Stations";
  if (name.includes("backpack") || name.includes("bag")) return "Backpacks";
  return "Other";
}

export function ProductCard({ product, fromCatalog = false }: { product: ProductCardProps, fromCatalog?: boolean }) {
  const category = inferCategory(product.model, product.category);
  const { addToCart } = useContext(CartContext);
  const [imageSrc, setImageSrc] = useState(() =>
    resolveProductImage(product.model, product.image, product.brand),
  );

  useEffect(() => {
    setImageSrc(resolveProductImage(product.model, product.image, product.brand));
  }, [product.model, product.image, product.brand]);

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      model: product.model,
      brand: product.brand,
      image: resolveProductImage(product.model, product.image, product.brand),
      price: product.price,
      quantity: 1,
      recommended: product.recommended,
      description: product.description,
      card_description: product.card_description,
      category: category,
    };
    addToCart(cartItem);
  };

  return (
    <div className="flex flex-col max-w-md w-full mx-auto h-full bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow">
      <div className="w-full bg-gray-200 relative mb-3 rounded-t-lg">
        <img
          src={imageSrc}
          alt={product.model}
          className="w-full h-36 object-contain mt-8 -mb-3"
          onError={() => {
            if (imageSrc !== PRODUCT_IMAGE_PLACEHOLDER) {
              setImageSrc(PRODUCT_IMAGE_PLACEHOLDER);
            }
          }}
        />
      </div>
      <div className="p-5 flex flex-col flex-1 w-full h-full">
        {/* Category */}
        <Link
          href={`/catalog/brand/${encodeURIComponent(product.brand)}`}
          className="block"
        >
          <span className="text-blue-600 text-base font-medium mb-1 hover:text-blue-800 transition-colors cursor-pointer">
            {product.brand}
          </span>
        </Link>
        {/* Model Name - Now Clickable */}
        <Link
          href={fromCatalog ? `/product/${encodeURIComponent(product.model)}?from=catalog` : `/product/${encodeURIComponent(product.model)}`}
          className="block"
        >
          <h3 className="text-2xl font-regular text-gray-900 mb-1 hover:text-blue-600 transition-colors cursor-pointer">
            {product.model}
          </h3>
        </Link>
        {/* price */}
        <div className="space-y-2 pb-4 flex-1">
          {(product.card_description || product.description) && <div className="text-gray-700 text-base leading-tight">{product.card_description || product.description}</div>}
          <div className="text-xl font-semibold text-gray-900 mt-2">
            ${(typeof product.price === 'number' && Number.isFinite(product.price) ? product.price : 0).toLocaleString()}<span className="text-base font-normal text-gray-500"> USD</span>
          </div>
        </div>
        {/* <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center font-medium text-sm ${isEligible ? "text-green-600" : "text-gray-600"}`}>
            {isEligible ? (
              <CheckCircle className="w-5 h-5 mr-1" />
            ) : (
              // <AlertCircle className="w-5 h-5 mr-1" />
              ""
            )}
            {isEligible ? "Available" : ""}
          </div>
        </div> */}
        {/* Action buttons */}
        <div className="flex gap-2">
          <Link
            href={fromCatalog ? `/product/${encodeURIComponent(product.model)}?from=catalog` : `/product/${encodeURIComponent(product.model)}`}
            className="flex-1 bg-blue-50 text-blue-600 px-2 py-2 hover:bg-blue-100 transition-colors rounded-md font-medium text-center"
          >
            View Details
          </Link>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 text-white px-2 py-2 hover:bg-blue-700 transition-colors rounded-md font-medium"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
} 