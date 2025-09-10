'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'USD' | 'CAD';

interface CurrencyContextType {
  currency: Currency;
  toggleCurrency: () => void;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('USD');

  // Load currency preference from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferred-currency') as Currency;
    if (savedCurrency && (savedCurrency === 'USD' || savedCurrency === 'CAD')) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  // Save currency preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('preferred-currency', currency);
  }, [currency]);

  const toggleCurrency = () => {
    setCurrencyState(prev => prev === 'USD' ? 'CAD' : 'USD');
  };

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, setCurrency }}>
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
