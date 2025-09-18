'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'USD' | 'CAD' | 'EUR';

interface CurrencyContextType {
  currency: Currency;
  toggleCurrency: () => void;
  setCurrency: (currency: Currency) => void;
  getCurrencySymbol: () => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('USD');

  // Load currency preference from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferred-currency') as Currency;
    if (savedCurrency && (savedCurrency === 'USD' || savedCurrency === 'CAD' || savedCurrency === 'EUR')) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  // Save currency preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('preferred-currency', currency);
  }, [currency]);

  const toggleCurrency = () => {
    setCurrencyState(prev => {
      switch (prev) {
        case 'USD': return 'CAD';
        case 'CAD': return 'EUR';
        case 'EUR': return 'USD';
        default: return 'USD';
      }
    });
  };

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  };

  const getCurrencySymbol = () => {
    switch (currency) {
      case 'USD':
      case 'CAD':
        return '$';
      case 'EUR':
        return '€';
      default:
        return '$';
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, setCurrency, getCurrencySymbol }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
