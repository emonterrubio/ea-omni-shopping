"use client";

import Link from "next/link";
import { SafeProductImage } from "@/components/ui/SafeProductImage";

export type NowAssistProduct = {
  brand: string;
  model: string;
  category: string;
  description: string;
  image: string;
  price: number;
  recommended?: boolean;
  matchLabel?: string;
};

interface NowAssistProductCardProps {
  product: NowAssistProduct;
}

export function NowAssistProductCard({ product }: NowAssistProductCardProps) {
  return (
    <article className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden w-full">
      <div className="relative w-full h-36 bg-gradient-to-b from-gray-50 to-white">
        <SafeProductImage
          src={product.image}
          model={product.model}
          alt={product.model}
          fill
          className="object-contain p-3"
        />
      </div>
      <div className="px-3.5 pb-3.5 pt-2">
        {product.matchLabel && (
          <span className="inline-flex mb-2 text-[11px] font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">
            + {product.matchLabel}
          </span>
        )}
        <p className="text-sm font-medium text-heritageBlue">{product.brand}</p>
        <h4 className="text-[15px] font-bold text-gray-900 leading-snug mt-0.5">
          {product.model}
        </h4>
        {product.description && (
          <p className="text-xs text-gray-600 mt-1.5 leading-relaxed line-clamp-3">
            {product.description}
          </p>
        )}
        <div className="mt-3 flex items-end justify-between gap-2">
          <p className="text-base font-bold text-gray-900">
            ${product.price.toLocaleString()}
            <span className="text-xs font-normal text-gray-500"> USD</span>
          </p>
        </div>
        <Link
          href={`/product/${encodeURIComponent(product.model)}`}
          className="mt-3 block text-center text-sm font-semibold text-heritageBlue hover:text-blue-800 transition-colors"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
