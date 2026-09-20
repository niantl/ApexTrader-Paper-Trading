'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrading } from '@/store/TradingContext';
import { STOCKS_DB } from '@/data/stocks';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ActiveTickerHeader = () => {
  const { state, livePrices } = useTrading();
  
  const symbol = state.activeSymbol;
  const stock = STOCKS_DB[symbol];
  if (!stock) return null;

  const currentPrice = livePrices[symbol] || stock.currentPrice;
  const deltaDollar = currentPrice - stock.prevClose;
  const deltaPercent = (deltaDollar / stock.prevClose) * 100;
  const isPositive = deltaDollar >= 0;

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex gap-4 items-center">
        <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-white/5 border border-white/10 font-bold text-lg text-white">
          {symbol}
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-white tracking-tight">{stock.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">{stock.exchange}</span>
            <span className="text-xs font-medium text-slate-500">{stock.sector}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:items-end">
        <div className="flex items-baseline gap-1">
          <span className="text-slate-400 font-semibold text-lg">$</span>
          <AnimatePresence mode="popLayout">
            <motion.span
              key={currentPrice}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={cn(
                "text-4xl font-bold tabular-nums tracking-tighter",
                isPositive ? "text-white" : "text-white"
              )}
            >
              {currentPrice.toFixed(2)}
            </motion.span>
          </AnimatePresence>
        </div>
        
        <div className={cn(
          "flex items-center gap-1 mt-1 font-semibold text-sm",
          isPositive ? "text-emerald-400 text-glow-positive" : "text-rose-400 text-glow-negative"
        )}>
          {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          <span className="tabular-nums">
            {isPositive ? '+' : '-'}${Math.abs(deltaDollar).toFixed(2)}
          </span>
          <span className="tabular-nums">
            ({isPositive ? '+' : ''}{deltaPercent.toFixed(2)}%)
          </span>
          <span className="text-slate-500 ml-1 text-xs">Today</span>
        </div>
      </div>
    </div>
  );
};
