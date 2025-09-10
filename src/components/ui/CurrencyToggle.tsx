'use client';

import React from 'react';
import { useCurrency } from '@/components/CurrencyContext';

export function CurrencyToggle() {
  const { currency, toggleCurrency } = useCurrency();

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-regular text-white whitespace-nowrap">Currency:</span>
      <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg p-1">
        <button
          onClick={() => currency !== 'USD' && toggleCurrency()}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            currency === 'USD'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-white hover:text-gray-200'
          }`}
        >
          USD
        </button>
        <button
          onClick={() => currency !== 'CAD' && toggleCurrency()}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            currency === 'CAD'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-white hover:text-gray-200'
          }`}
        >
          CAD
        </button>
      </div>
    </div>
  );
}
