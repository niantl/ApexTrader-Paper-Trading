'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrading } from '@/store/TradingContext';
import { STOCKS_DB } from '@/data/stocks';
import { cn } from '@/lib/utils';
import { ArrowRightLeft } from 'lucide-react';

export const PortfolioTables = () => {
  const { state, setState, livePrices, setActiveSymbol } = useTrading();
  const [activeTab, setActiveTab] = useState<'holdings' | 'history' | 'watchlist'>('holdings');

  const handleQuickTrade = (symbol: string, side: 'BUY' | 'SELL', shares?: number) => {
    setActiveSymbol(symbol);
    setState(s => ({ 
      ...s, 
      orderSide: side, 
      quantity: shares || 1 
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="glass-panel rounded-2xl flex flex-col mt-6 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-white/5 bg-white/[0.02] p-2 gap-2">
        {(['holdings', 'history', 'watchlist'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "relative px-4 py-2 text-sm font-semibold capitalize rounded-lg transition-colors",
              activeTab === tab ? "text-white" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            )}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white/10 rounded-lg border border-white/10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">
              {tab}
              {tab === 'holdings' && state.holdings.length > 0 && (
                <span className="ml-2 bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {state.holdings.length}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-0 overflow-x-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'holdings' && (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="text-xs text-slate-400 bg-white/[0.02] border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-medium">Asset</th>
                    <th className="px-6 py-4 font-medium text-right">Shares</th>
                    <th className="px-6 py-4 font-medium text-right">Avg Price</th>
                    <th className="px-6 py-4 font-medium text-right">Live Price</th>
                    <th className="px-6 py-4 font-medium text-right">Market Value</th>
                    <th className="px-6 py-4 font-medium text-right">Unrealized P&L</th>
                    <th className="px-6 py-4 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {state.holdings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                        No active stock holdings. Execute a BUY order to open a simulated position!
                      </td>
                    </tr>
                  ) : (
                    state.holdings.map(h => {
                      const currentPrice = livePrices[h.symbol] || h.avgBuyPrice;
                      const marketValue = h.shares * currentPrice;
                      const costBasis = h.shares * h.avgBuyPrice;
                      const pnl = marketValue - costBasis;
                      const pnlPct = (pnl / costBasis) * 100;
                      const isPos = pnl >= 0;

                      return (
                        <tr key={h.symbol} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-6 py-4">
                            <div 
                              className="flex flex-col cursor-pointer" 
                              onClick={() => setActiveSymbol(h.symbol)}
                            >
                              <span className="font-bold text-white group-hover:text-indigo-400 transition-colors">{h.symbol}</span>
                              <span className="text-xs text-slate-500">{h.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right tabular-nums font-semibold">{h.shares}</td>
                          <td className="px-6 py-4 text-right tabular-nums">${h.avgBuyPrice.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right tabular-nums font-semibold">${currentPrice.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right tabular-nums font-semibold">${marketValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className={cn("px-6 py-4 text-right tabular-nums font-medium", isPos ? "text-emerald-400" : "text-rose-400")}>
                            {isPos ? '+' : '-'}${Math.abs(pnl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                            <span className="text-xs ml-1 opacity-80">({isPos ? '+' : ''}{pnlPct.toFixed(2)}%)</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button 
                              onClick={() => handleQuickTrade(h.symbol, 'SELL', h.shares)}
                              className="px-3 py-1.5 text-xs font-semibold bg-white/5 hover:bg-white/10 rounded-md transition-colors border border-white/10"
                            >
                              Sell / Trade
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'history' && (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="text-xs text-slate-400 bg-white/[0.02] border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-medium">Time</th>
                    <th className="px-6 py-4 font-medium">Symbol</th>
                    <th className="px-6 py-4 font-medium">Side</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium text-right">Shares</th>
                    <th className="px-6 py-4 font-medium text-right">Price</th>
                    <th className="px-6 py-4 font-medium text-right">Total</th>
                    <th className="px-6 py-4 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {state.orderHistory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                        No order history.
                      </td>
                    </tr>
                  ) : (
                    state.orderHistory.map(o => (
                      <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-xs text-slate-500">{o.time}</td>
                        <td className="px-6 py-4 font-bold text-white">{o.symbol}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider",
                            o.side === 'BUY' ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                          )}>
                            {o.side}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-xs">{o.type}</td>
                        <td className="px-6 py-4 text-right tabular-nums font-semibold">{o.shares}</td>
                        <td className="px-6 py-4 text-right tabular-nums">${o.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right tabular-nums font-bold">${o.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider bg-slate-700/50 text-slate-300 border border-slate-600/50">
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'watchlist' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
                {Object.values(STOCKS_DB).map((stock: any) => {
                  const currentPrice = livePrices[stock.symbol] || stock.currentPrice;
                  const deltaDollar = currentPrice - stock.prevClose;
                  const deltaPercent = (deltaDollar / stock.prevClose) * 100;
                  const isPos = deltaDollar >= 0;

                  return (
                    <motion.div 
                      key={stock.symbol}
                      whileHover={{ y: -2 }}
                      onClick={() => handleQuickTrade(stock.symbol, 'BUY')}
                      className="cursor-pointer bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.04] p-4 rounded-xl transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white text-lg">{stock.symbol}</span>
                        <ArrowRightLeft className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100" />
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="font-semibold text-lg tabular-nums text-slate-200">${currentPrice.toFixed(2)}</span>
                        <span className={cn("text-sm font-medium tabular-nums", isPos ? "text-emerald-400" : "text-rose-400")}>
                          {isPos ? '+' : ''}{deltaPercent.toFixed(2)}%
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
