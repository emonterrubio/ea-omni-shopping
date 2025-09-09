import React from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import Link from "next/link";
import { EAProductType } from "../../types";

interface RecommendedItemsProps {
  displayedProducts: EAProductType[];
  showCompareButton: boolean;
}

export function RecommendedItems({ displayedProducts, showCompareButton }: RecommendedItemsProps) {
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-regular text-gray-900">Recommended for You</h2>
        {showCompareButton && (
          <div className="flex gap-2">
            <Link
              href={`/compare?models=${displayedProducts.map((p) => encodeURIComponent(p.model)).join(",")}`}
              className="text-blue-600 hover:text-blue-800 font-medium py-2 transition-colors"
            >
              Compare models
            </Link>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedProducts.map((product, idx) => (
          <ProductCard key={`${product.model}-${idx}`} product={{
            ...product, 
            price_usd: product.price_usd,
            price_cad: product.price_cad,
            image: product.image || `/images/${product.manufacturer.toLowerCase()}_${product.model.toLowerCase().replace(/\s+/g, "_")}.png`
          }} />
        ))}
      </div>
    </section>
  );
} 