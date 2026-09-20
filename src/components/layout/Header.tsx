'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Activity, User } from 'lucide-react';
import { useTrading } from '@/store/TradingContext';
import { cn } from '@/lib/utils';
import { STOCKS_DB } from '@/data/stocks';

export const Header = () => {
  const { state, livePrices, setActiveSymbol } = useTrading();
  const [time, setTime] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false }) + ' EDT');
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = Object.values(STOCKS_DB).filter(stock => 
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const handleSelectSymbol = (symbol: string) => {
    setActiveSymbol(symbol);
    setSearchQuery('');
    setIsSearchFocused(false);
    searchInputRef.current?.blur();
  };

  const totalPortfolioValue = state.cash + state.holdings.reduce((sum, h) => sum + (h.shares * (livePrices[h.symbol] || STOCKS_DB[h.symbol].currentPrice)), 0);
  const totalPnl = totalPortfolioValue - 100000;
  const pnlPercent = (totalPnl / 100000) * 100;
  const isPositive = totalPnl >= 0;

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 px-6 py-3 flex items-center justify-between">
      {/* Brand & Market Status */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <Activity className="text-indigo-400 w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight tracking-tight text-white">Apex<span className="text-indigo-400">Trader</span></span>
            <span className="text-[10px] font-medium text-indigo-400/80 tracking-widest uppercase">Paper Trading</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-white/5 rounded-full px-3 py-1 border border-white/5">
          <motion.div 
            className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs font-medium text-slate-300">Market Open</span>
          <span className="text-xs text-slate-500 tabular-nums">{time}</span>
        </div>
      </div>

      {/* Center Search */}
      <div className="flex-1 max-w-md mx-6 hidden lg:block relative">
        <div className={cn(
          "relative flex items-center w-full rounded-xl border transition-all duration-300",
          isSearchFocused ? "bg-white/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]" : "bg-white/5 border-white/10"
        )}>
          <Search className="absolute left-3 w-4 h-4 text-slate-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search ticker or company (e.g. NVDA, AAPL)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none py-2 pl-10 pr-12 text-sm text-slate-200 placeholder:text-slate-500"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchResults.length > 0) {
                handleSelectSymbol(searchResults[0].symbol);
              }
            }}
          />
          <div className="absolute right-3 flex items-center justify-center bg-slate-800 rounded px-1.5 py-0.5 border border-white/10 text-[10px] text-slate-400 font-medium">
            /
          </div>
        </div>

        {/* Search Dropdown */}
        <AnimatePresence>
          {isSearchFocused && searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 w-full mt-2 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
            >
              {searchResults.length > 0 ? (
                searchResults.map(stock => (
                  <button
                    key={stock.symbol}
                    onClick={() => handleSelectSymbol(stock.symbol)}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center justify-between transition-colors border-b border-white/5 last:border-none"
                  >
                    <div>
                      <span className="font-bold text-white">{stock.symbol}</span>
                      <span className="text-xs text-slate-400 ml-2">{stock.name}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-300">${stock.currentPrice.toFixed(2)}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-slate-400">No results found</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right KPIs */}
      <div className="flex items-center gap-6">
        <div className="hidden xl:flex items-center gap-6 text-sm">
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-500 font-medium">Virtual Cash</span>
            <span className="font-medium text-slate-200 tabular-nums">
              ${state.cash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="w-px h-8 bg-white/10" />
          
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-500 font-medium">Portfolio Value</span>
            <span className="font-medium text-slate-200 tabular-nums">
              ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="w-px h-8 bg-white/10" />

          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-500 font-medium">Total P&L</span>
            <span className={cn("font-medium tabular-nums", isPositive ? "text-emerald-400 text-glow-positive" : "text-rose-400 text-glow-negative")}>
              {isPositive ? '+' : '-'}${Math.abs(totalPnl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({pnlPercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <button className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
          <User className="w-4 h-4 text-slate-300" />
        </button>
      </div>
    </header>
  );
};
