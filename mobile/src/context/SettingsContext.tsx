import React, { createContext, useContext, useState } from 'react';

type Currency = '€' | '$' | 'R$';

interface SettingsContextData {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (price: number) => string;
}

const SettingsContext = createContext<SettingsContextData>({} as SettingsContextData);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>('€');

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
  };

  const formatPrice = (price: number) => {
    const p = Number(price) || 0;
    if (currency === '€') return `${p.toFixed(2)} €`;
    if (currency === '$') return `$ ${p.toFixed(2)}`;
    return `R$ ${p.toFixed(2)}`;
  };

  return (
    <SettingsContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
