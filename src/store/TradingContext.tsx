'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { STOCKS_DB } from '@/data/stocks';

export type Order = {
  id: string;
  time: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'Market' | 'Limit';
  shares: number;
  price: number;
  total: number;
  status: string;
};

export type Holding = {
  symbol: string;
  name: string;
  shares: number;
  avgBuyPrice: number;
};

export type TradingState = {
  cash: number;
  holdings: Holding[];
  orderHistory: Order[];
  activeSymbol: string;
  activeTimeframe: '1D' | '1W' | '1M' | '1Y' | 'ALL';
  chartType: 'area' | 'candle';
  orderSide: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT';
  quantity: number;
  limitPrice: number;
};

interface TradingContextType {
  state: TradingState;
  setState: React.Dispatch<React.SetStateAction<TradingState>>;
  executeTrade: () => void;
  updateQuantity: (qty: number) => void;
  setActiveSymbol: (symbol: string) => void;
  setActiveTimeframe: (timeframe: '1D' | '1W' | '1M' | '1Y' | 'ALL') => void;
  setChartType: (type: 'area' | 'candle') => void;
  livePrices: Record<string, number>;
}

const INITIAL_STATE: TradingState = {
  cash: 36300.00, // $100,000 total initial equity - $63,700 cost basis of demo holdings
  holdings: [
    { symbol: 'NVDA', name: 'NVIDIA Corporation', shares: 120, avgBuyPrice: 115.00 },
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 150, avgBuyPrice: 210.00 },
    { symbol: 'TSLA', name: 'Tesla, Inc.', shares: 80, avgBuyPrice: 230.00 }
  ],
  orderHistory: [],
  activeSymbol: 'NVDA',
  activeTimeframe: '1D',
  chartType: 'area',
  orderSide: 'BUY',
  orderType: 'MARKET',
  quantity: 10,
  limitPrice: 128.50
};

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<TradingState>(INITIAL_STATE);
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});

  // Initialize live prices from STOCKS_DB
  useEffect(() => {
    const initialPrices: Record<string, number> = {};
    Object.keys(STOCKS_DB).forEach(symbol => {
      initialPrices[symbol] = STOCKS_DB[symbol].currentPrice;
    });
    setLivePrices(initialPrices);
  }, []);

  // Market Simulation Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrices(prev => {
        const newPrices = { ...prev };
        Object.keys(STOCKS_DB).forEach(symbol => {
          const basePrice = STOCKS_DB[symbol].currentPrice;
          const volatility = parseFloat(STOCKS_DB[symbol].beta) * 0.001;
          const change = basePrice * volatility * (Math.random() - 0.5);
          newPrices[symbol] = Math.max(0.01, (prev[symbol] || basePrice) + change);
        });
        return newPrices;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const updateQuantity = (qty: number) => {
    setState(prev => ({ ...prev, quantity: Math.max(1, qty) }));
  };

  const setActiveSymbol = (symbol: string) => {
    if (STOCKS_DB[symbol]) {
      setState(prev => ({ ...prev, activeSymbol: symbol, limitPrice: livePrices[symbol] || STOCKS_DB[symbol].currentPrice }));
    }
  };

  const setActiveTimeframe = (activeTimeframe: '1D' | '1W' | '1M' | '1Y' | 'ALL') => {
    setState(prev => ({ ...prev, activeTimeframe }));
  };

  const setChartType = (chartType: 'area' | 'candle') => {
    setState(prev => ({ ...prev, chartType }));
  };

  const executeTrade = () => {
    setState(prev => {
      const currentPrice = livePrices[prev.activeSymbol] || STOCKS_DB[prev.activeSymbol].currentPrice;
      const totalCost = currentPrice * prev.quantity;
      
      let newCash = prev.cash;
      const newHoldings = [...prev.holdings];
      
      const holdingIndex = newHoldings.findIndex(h => h.symbol === prev.activeSymbol);
      
      if (prev.orderSide === 'BUY') {
        if (newCash < totalCost) return prev; // Not enough cash
        newCash -= totalCost;
        
        if (holdingIndex >= 0) {
          const h = newHoldings[holdingIndex];
          const totalValue = (h.shares * h.avgBuyPrice) + totalCost;
          const newShares = h.shares + prev.quantity;
          h.avgBuyPrice = totalValue / newShares;
          h.shares = newShares;
        } else {
          newHoldings.push({
            symbol: prev.activeSymbol,
            name: STOCKS_DB[prev.activeSymbol].name,
            shares: prev.quantity,
            avgBuyPrice: currentPrice
          });
        }
      } else {
        // SELL
        if (holdingIndex < 0 || newHoldings[holdingIndex].shares < prev.quantity) return prev; // Not enough shares
        
        newCash += totalCost;
        newHoldings[holdingIndex].shares -= prev.quantity;
        
        if (newHoldings[holdingIndex].shares === 0) {
          newHoldings.splice(holdingIndex, 1);
        }
      }

      const newOrder: Order = {
        id: `ORD-${Math.floor(Math.random() * 100000)}`,
        time: new Date().toLocaleTimeString(),
        symbol: prev.activeSymbol,
        side: prev.orderSide,
        type: prev.orderType === 'MARKET' ? 'Market' : 'Limit',
        shares: prev.quantity,
        price: currentPrice,
        total: totalCost,
        status: 'Filled'
      };

      return {
        ...prev,
        cash: newCash,
        holdings: newHoldings,
        orderHistory: [newOrder, ...prev.orderHistory]
      };
    });
  };

  return (
    <TradingContext.Provider value={{ state, setState, executeTrade, updateQuantity, setActiveSymbol, setActiveTimeframe, setChartType, livePrices }}>
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) throw new Error('useTrading must be used within TradingProvider');
  return context;
};
