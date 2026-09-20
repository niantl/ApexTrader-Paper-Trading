'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrading } from '@/store/TradingContext';
import { STOCKS_DB } from '@/data/stocks';

export const MarketStats = () => {
  const { state } = useTrading();
  const symbol = state.activeSymbol;
  const stock = STOCKS_DB[symbol];

  if (!stock) return null;

  const stats = [
    { label: '52-Wk High', value: `$${stock.fiftyTwoHigh}` },
    { label: '52-Wk Low', value: `$${stock.fiftyTwoLow}` },
    { label: 'Market Cap', value: stock.marketCap },
    { label: 'P/E Ratio', value: stock.peRatio },
    { label: 'Day Vol', value: stock.dayVolume },
    { label: 'Avg Vol', value: stock.avgVolume },
    { label: 'Beta', value: stock.beta },
    { label: 'Yield', value: stock.divYield },
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white tracking-wide uppercase">Key Statistics</h3>
        <span className="text-[10px] text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          Live Feed
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={symbol}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="flex flex-col bg-white/[0.02] border border-white/5 rounded-xl p-3 hover:bg-white/[0.04] transition-colors"
            >
              <span className="text-xs text-slate-400 font-medium mb-1">{stat.label}</span>
              <span className="text-sm text-slate-200 font-semibold tabular-nums">{stat.value}</span>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
