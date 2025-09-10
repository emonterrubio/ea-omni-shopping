import React from 'react';
import Image from 'next/image';
import { useCurrency } from '../CurrencyContext';

interface SummaryProductCardProps {
  item: {
    model: string;
    brand: string;
    description?: string;
    image: string;
    price: number | string;
    price_cad?: number | string;
    recommended?: boolean;
    quantity: number;
  };
  onQuantityChange: (model: string, quantity: number) => void;
  onRemove: (model: string) => void;
}

export function SummaryProductCard({ item, onQuantityChange, onRemove }: SummaryProductCardProps) {
  const { currency } = useCurrency();
  return (
    <div className="flex flex-col sm:flex-row items-center bg-white rounded-xl border border-gray-200 px-4 py-4 sm:px-6 sm:py-6 gap-4 sm:gap-6">
      {/* Image */}
      <div className="w-36 h-24 flex-shrink-0 relative flex items-center justify-center">
        <Image src={item.image} alt={item.model} fill className="object-contain" />
      </div>
      {/* Info and actions */}
      <div className="flex-1 w-full">
        <h3 className="text-xl font-semibold leading-tight text-gray-900">{item.brand} {item.model}</h3>
        {item.recommended && (
          <div className="mt-1">
            <span className="bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-md">Recommended</span>
          </div>
        )}
        {item.description && <p className="text-sm text-gray-600 mt-2">{item.description}</p>}
        <div className="flex items-center gap-4 mt-4">
          <label className="text-sm text-gray-700">Quantity</label>
          <select
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
            value={item.quantity}
            onChange={e => onQuantityChange(item.model, Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map(q => <option key={q} value={q}>{q}</option>)}
          </select>
          <button
            className="text-blue-600 hover:underline text-sm font-medium"
            onClick={() => onRemove(item.model)}
          >
            Remove
          </button>
          {/* Price */}
          <div className="font-semibold text-xl text-gray-900 mt-2 sm:mt-0 sm:ml-auto w-full sm:w-auto text-right">
            {currency === 'USD' ? (
              typeof item.price === 'string'
                ? `$${Math.round(Number((item.price as string).replace(/,/g, ''))).toLocaleString()}`
                : `$${Math.round(item.price).toLocaleString()}`
            ) : (
              typeof item.price_cad === 'string'
                ? `$${Math.round(Number((item.price_cad as string).replace(/,/g, ''))).toLocaleString()}`
                : `$${Math.round(item.price_cad || 0).toLocaleString()}`
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 