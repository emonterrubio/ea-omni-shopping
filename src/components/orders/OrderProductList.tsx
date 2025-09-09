import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { OrderProductRow } from './OrderProductRow';
import { OrderItem } from './types';

interface OrderProductListProps {
  items: OrderItem[];
}

export function OrderProductList({ items }: OrderProductListProps) {
  const formatPrice = (price: number | string | undefined) => {
    if (!price) return '$0';
    if (typeof price === 'string') {
      return `$${Number(price.replace(/,/g, "")).toLocaleString()}`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <div className="lg:px-8 py-6">
      {/* Mobile: Product list layout */}
      <div className="lg:hidden">
        <div className="bg-gray-100 rounded-t-lg px-4 py-3 mb-4">
          <h3 className="text-base font-bold text-gray-900">Product Details</h3>
        </div>
        <div className="space-y-4">
          {items.map((item: OrderItem, index: number) => (
            <OrderProductRow 
              key={item.model} 
              item={item} 
              isLast={index === items.length - 1} 
            />
          ))}
        </div>
      </div>
      
      {/* Desktop: Table layout */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-base text-left px-6 py-4 font-semibold text-gray-900">Product Details</th>
              <th className="text-base text-center px-6 py-4 font-semibold text-gray-900">Quantity</th>
              <th className="text-base text-right px-6 py-4 font-semibold text-gray-900">Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: OrderItem, index: number) => (
              <tr key={item.model} className={index < items.length - 1 ? "border-b border-gray-200" : ""}>
                <td className="py-4">
                  <div className="flex items-center gap-4">
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
                    <div>
                      <Link 
                        href={`/product/${encodeURIComponent(item.model)}?from=orders`}
                        className="text-lg font-regular text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {item.brand} {item.model}
                      </Link>
                      <div className="text-sm text-gray-600">{item.card_description || item.description}</div>
                    </div>
                  </div>
                </td>
                <td className="text-center px-6 py-4 text-gray-900">{item.quantity || 1}</td>
                <td className="text-right px-6 py-4 font-semibold text-gray-900">
                  {formatPrice(item.price_usd)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
