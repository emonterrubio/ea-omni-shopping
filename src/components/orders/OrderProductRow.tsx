import React from 'react';
import Link from 'next/link';

import { OrderItem } from './types';
import { SafeProductImage } from '@/components/ui/SafeProductImage';

interface OrderProductRowProps {
  item: OrderItem;
  isLast: boolean;
}

export function OrderProductRow({ item, isLast }: OrderProductRowProps) {
  const formatPrice = (price: number | string | null | undefined) => {
    if (price == null || price === '') return '$0';
    if (typeof price === 'string') {
      const parsed = Number(price.replace(/,/g, ''));
      return `$${(Number.isFinite(parsed) ? parsed : 0).toLocaleString()}`;
    }
    if (typeof price === 'number' && Number.isFinite(price)) {
      return `$${price.toLocaleString()}`;
    }
    return '$0';
  };

  return (
    <div className={`px-4 pb-4 ${!isLast ? "border-b border-gray-200" : ""}`}>
      <div className="flex flex-col gap-2 lg:hidden">
        <div className="w-20 h-16 relative flex-shrink-0">
          <SafeProductImage
            src={item.image}
            model={item.model}
            alt={item.model}
            fill
            className="object-contain rounded"
          />
        </div>
        <div className="w-full">
          <Link
            href={`/product/${encodeURIComponent(item.model)}?from=orders`}
            className="text-xl font-regular text-gray-900 hover:text-blue-600 mb-1 block transition-colors"
          >
            {item.brand} {item.model}
          </Link>
          <div className="text-base leading-tight text-gray-600 mb-2">
            {item.card_description || item.description}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-700 mb-1">Quantity: {item.quantity || 1}</span>
            <span className="text-xl font-bold text-gray-900">{formatPrice(item.price)}</span>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex items-start gap-4">
        <div className="w-16 h-12 relative flex-shrink-0">
          <SafeProductImage
            src={item.image}
            model={item.model}
            alt={item.model}
            fill
            className="object-contain rounded"
          />
        </div>
        <div className="flex-1">
          <Link
            href={`/product/${encodeURIComponent(item.model)}?from=orders`}
            className="text-base font-bold text-gray-900 hover:text-blue-600 mb-1 block transition-colors"
          >
            {item.brand} {item.model}
          </Link>
          <div className="text-sm text-gray-600 mb-2">
            {item.card_description || item.description}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-700">Quantity: {item.quantity || 1}</span>
            <span className="text-lg font-bold text-gray-900">{formatPrice(item.price)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
