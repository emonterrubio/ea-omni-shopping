import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { OrderItem } from './types';

interface OrderProductRowProps {
  item: OrderItem;
  isLast: boolean;
}

export function OrderProductRow({ item, isLast }: OrderProductRowProps) {
  const formatPrice = (price: number | string | undefined) => {
    if (!price) return '$0';
    if (typeof price === 'string') {
      return `$${Number(price.replace(/,/g, "")).toLocaleString()}`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <div className={`px-4 pb-4 ${!isLast ? "border-b border-gray-200" : ""}`}>
      {/* Mobile: Vertical stacking */}
      <div className="flex flex-col gap-2 lg:hidden">
        <div className="w-32 h-24 relative flex-shrink-0">
          <Image 
            src={item.image || `/images/placeholder-product.svg`} 
            alt={item.model} 
            fill 
            className="object-contain rounded"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder-product.svg';
            }}
          />
        </div>
        <div className="text-gray-900 w-full">
          <Link 
            href={`/product/${encodeURIComponent(item.model)}?from=orders`}
            className="text-xl font-regular text-gray-900 hover:text-blue-600 mb-1 block transition-colors"
          >
            {item.brand} {item.model}
          </Link>
          <div className="text-base leading-tight text-gray-600 mb-2">{item.card_description || item.description}</div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-700 mb-1">Quantity: {item.quantity || 1}</span>
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(item.price_usd)}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop: Horizontal layout with left image */}
      <div className="hidden lg:flex items-start gap-4">
        <div className="w-16 h-12 relative flex-shrink-0">
          <Image 
            src={item.image || `/images/placeholder-product.svg`} 
            alt={item.model} 
            fill 
            className="object-contain rounded"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder-product.svg';
            }}
          />
        </div>
        <div className="flex-1">
          <Link 
            href={`/product/${encodeURIComponent(item.model)}?from=orders`}
            className="text-2xl font-regular text-gray-900 hover:text-blue-600 mb-1 block transition-colors"
          >
            {item.brand} {item.model}
          </Link>
          <div className="text-sm text-gray-600 mb-2">{item.card_description || item.description}</div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">Quantity: {item.quantity || 1}</span>
            <span className="text-base font-bold text-gray-900">
              {formatPrice(item.price_usd)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
