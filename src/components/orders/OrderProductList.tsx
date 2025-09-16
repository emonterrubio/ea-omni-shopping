import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { OrderProductRow } from './OrderProductRow';
import { OrderItem } from './types';
import { useCurrency } from '../CurrencyContext';

interface OrderProductListProps {
  items: OrderItem[];
}

export function OrderProductList({ items }: OrderProductListProps) {
  const { currency } = useCurrency();
  
  const formatPrice = (price: number | string | undefined) => {
    if (!price) return '$0';
    if (typeof price === 'string') {
      return `$${Math.round(Number(price.replace(/,/g, ""))).toLocaleString()}`;
    }
    return `$${Math.round(price).toLocaleString()}`;
  };

  // Helper function to generate proper product title (same logic as ProductCard)
  const generateProductTitle = (display_name?: string, model?: string, category?: string): string => {
    if (display_name && category?.toLowerCase() === 'monitor') {
      return display_name;
    }
    if (display_name && model && 
        !display_name.toLowerCase().replace(/[^a-z0-9]/g, '').includes(model.toLowerCase().replace(/[^a-z0-9]/g, '')) && 
        !model.toLowerCase().replace(/[^a-z0-9]/g, '').includes(display_name.toLowerCase().replace(/[^a-z0-9]/g, ''))) {
      return `${display_name} (${model})`;
    }
    return display_name || model || 'Unknown Product';
  };

  return (
    <div>
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
              <th className="text-base text-left px-4 py-4 font-semibold text-gray-900 w-2/3">Product Details</th>
              <th className="text-base text-center px-4 py-4 font-semibold text-gray-900 w-16">Quantity</th>
              <th className="text-base text-right px-4 py-4 font-semibold text-gray-900 w-32">Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: OrderItem, index: number) => (
              <tr key={item.model} className={index < items.length - 1 ? "border-b border-gray-200" : ""}>
                <td className="py-4 w-2/3">
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
                        {item.brand} {generateProductTitle(item.display_name, item.model, item.category)}
                      </Link>
                      <div className="text-sm text-gray-600">{item.card_description || item.description}</div>
                    </div>
                  </div>
                </td>
                <td className="text-center text-base px-4 py-4 text-gray-900 w-16">{item.quantity || 1}</td>
                <td className="text-right text-base px-4 py-4 font-regular text-gray-900 w-32">
                  {currency === 'USD' ? (
                    <>
                      {formatPrice(item.price_usd)}<span className="text-sm text-gray-500 font-regular"> USD</span>
                    </>
                  ) : (
                    <>
                      {formatPrice(item.price_cad)}<span className="text-sm text-gray-500 font-regular"> CAD</span>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
