'use client';

import React from 'react';
import { useCurrency } from '@/components/CurrencyContext';

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'CAD', symbol: '$' },
    { code: 'EUR', symbol: '€' }
  ];

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-regular text-white whitespace-nowrap">Currency:</span>
      <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg p-1">
        {currencies.map((curr) => (
          <button
            key={curr.code}
            onClick={() => setCurrency(curr.code as 'USD' | 'CAD' | 'EUR')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              currency === curr.code
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-white hover:text-gray-200'
            }`}
          >
            {curr.code}
          </button>
        ))}
      </div>
    </div>
  );
}
