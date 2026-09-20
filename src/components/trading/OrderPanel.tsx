'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTrading } from '@/store/TradingContext';
import { cn } from '@/lib/utils';
import { Minus, Plus, Zap } from 'lucide-react';
import { STOCKS_DB } from '@/data/stocks';

export const OrderPanel = () => {
  const { state, setState, updateQuantity, executeTrade, livePrices } = useTrading();
  
  const currentPrice = livePrices[state.activeSymbol] || STOCKS_DB[state.activeSymbol].currentPrice;
  const totalCost = currentPrice * state.quantity;
  
  const holding = state.holdings.find(h => h.symbol === state.activeSymbol);
  const ownedShares = holding ? holding.shares : 0;

  const handleMax = () => {
    if (state.orderSide === 'BUY') {
      const maxShares = Math.floor(state.cash / currentPrice);
      updateQuantity(maxShares > 0 ? maxShares : 1);
    } else {
      updateQuantity(ownedShares > 0 ? ownedShares : 1);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col h-full gap-6">
      {/* Segmented Control for BUY / SELL */}
      <div className="flex p-1 bg-black/40 rounded-xl border border-white/5 relative">
        {/* Animated Background */}
        <motion.div 
          className="absolute inset-y-1 rounded-lg w-[calc(50%-4px)] z-0"
          layoutId="orderSideBg"
          initial={false}
          animate={{
            x: state.orderSide === 'BUY' ? '4px' : 'calc(100% + 4px)',
            backgroundColor: state.orderSide === 'BUY' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'
          }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
        
        <button 
          onClick={() => setState(s => ({ ...s, orderSide: 'BUY' }))}
          className={cn(
            "flex-1 py-2 text-sm font-semibold rounded-lg z-10 transition-colors",
            state.orderSide === 'BUY' ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"
          )}
        >
          BUY
        </button>
        <button 
          onClick={() => setState(s => ({ ...s, orderSide: 'SELL' }))}
          className={cn(
            "flex-1 py-2 text-sm font-semibold rounded-lg z-10 transition-colors",
            state.orderSide === 'SELL' ? "text-rose-400" : "text-slate-400 hover:text-slate-200"
          )}
        >
          SELL
        </button>
      </div>

      {/* Order Type */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-400">Order Type</span>
        <div className="flex gap-2">
          <button 
            className={cn(
              "px-3 py-1 rounded-md text-xs font-medium transition-all",
              state.orderType === 'MARKET' ? "bg-white/10 text-white border border-white/20" : "text-slate-500 hover:text-slate-300"
            )}
            onClick={() => setState(s => ({ ...s, orderType: 'MARKET' }))}
          >
            Market
          </button>
          <button 
            className={cn(
              "px-3 py-1 rounded-md text-xs font-medium transition-all",
              state.orderType === 'LIMIT' ? "bg-white/10 text-white border border-white/20" : "text-slate-500 hover:text-slate-300"
            )}
            onClick={() => setState(s => ({ ...s, orderType: 'LIMIT' }))}
          >
            Limit
          </button>
        </div>
      </div>

      {/* Quantity Stepper */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-400">Quantity</span>
          <span className="text-xs text-indigo-400 font-medium cursor-pointer hover:text-indigo-300" onClick={handleMax}>
            {state.orderSide === 'BUY' ? `Max Buying Power: $${Math.floor(state.cash).toLocaleString()}` : `Owned: ${ownedShares} Shares`}
          </span>
        </div>
        
        <div className="flex items-center h-12 bg-black/40 rounded-xl border border-white/5 overflow-hidden">
          <button 
            className="w-12 h-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors"
            onClick={() => updateQuantity(state.quantity - 1)}
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <input 
            type="number"
            min="1"
            className="flex-1 h-full bg-transparent text-center font-semibold text-lg text-white tabular-nums outline-none border-x border-white/5"
            value={state.quantity}
            onChange={(e) => updateQuantity(parseInt(e.target.value) || 1)}
          />
          
          <button 
            className="w-12 h-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors"
            onClick={() => updateQuantity(state.quantity + 1)}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Chips */}
        <div className="flex gap-2 mt-1">
          {[10, 50, 100].map(amt => (
            <button 
              key={amt}
              onClick={() => updateQuantity(state.quantity + amt)}
              className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors border border-transparent hover:border-white/10"
            >
              +{amt}
            </button>
          ))}
          <button 
            onClick={handleMax}
            className="flex-1 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-xs font-bold text-indigo-400 transition-colors border border-indigo-500/20"
          >
            MAX
          </button>
        </div>
      </div>

      <div className="flex-1" />

      {/* Order Summary & Execution */}
      <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">Estimated Cost</span>
          <span className="text-lg font-bold text-white tabular-nums">${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={executeTrade}
          className={cn(
            "w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-shadow",
            state.orderSide === 'BUY' 
              ? "bg-emerald-500 text-emerald-950 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
              : "bg-rose-500 text-rose-950 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
          )}
        >
          <Zap className="w-5 h-5 fill-current" />
          {state.orderSide === 'BUY' ? 'Execute Buy Order' : 'Execute Sell Order'}
        </motion.button>
      </div>
    </div>
  );
};
