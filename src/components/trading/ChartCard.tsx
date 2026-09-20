'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTrading } from '@/store/TradingContext';
import { cn } from '@/lib/utils';
import { STOCKS_DB } from '@/data/stocks';

// We port the chart generation logic here to avoid cluttering the component
const chartDataCache: Record<string, any> = {};

function generateChartData(symbol: string, timeframe: string, currentPrice: number) {
  const key = `${symbol}_${timeframe}`;
  if (chartDataCache[key]) return chartDataCache[key];

  const stock = STOCKS_DB[symbol];
  if (!stock) return null;

  const basePrice = currentPrice;
  let pointsCount = 40;
  let volatility = 0.003;
  const timestamps: string[] = [];

  const now = new Date();

  if (timeframe === '1D') {
    pointsCount = 38; 
    volatility = 0.0025;
    const startHour = 9.5;
    for (let i = 0; i < pointsCount; i++) {
      const h = Math.floor(startHour + (i * 6.5) / pointsCount);
      const m = Math.floor(((startHour + (i * 6.5) / pointsCount) % 1) * 60);
      const period = h >= 12 ? 'PM' : 'AM';
      const displayH = h > 12 ? h - 12 : h;
      timestamps.push(`${displayH}:${m < 10 ? '0' + m : m} ${period}`);
    }
  } else if (timeframe === '1W') {
    pointsCount = 35;
    volatility = 0.008;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    for (let i = 0; i < pointsCount; i++) {
      const day = days[Math.floor((i / pointsCount) * 5)] || 'Fri';
      timestamps.push(`${day} ${10 + (i % 6)}:00`);
    }
  } else if (timeframe === '1M') {
    pointsCount = 30;
    volatility = 0.012;
    for (let i = 30; i >= 1; i--) {
      const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
      timestamps.push(`${d.getMonth() + 1}/${d.getDate()}`);
    }
  } else if (timeframe === '1Y') {
    pointsCount = 52;
    volatility = 0.02;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 52; i >= 1; i--) {
      const d = new Date(now.getTime() - i * 7 * 24 * 3600 * 1000);
      timestamps.push(`${months[d.getMonth()]} '${String(d.getFullYear()).slice(-2)}`);
    }
  } else {
    pointsCount = 60;
    volatility = 0.035;
    for (let i = 60; i >= 1; i--) {
      const d = new Date(now.getTime() - i * 30 * 24 * 3600 * 1000);
      timestamps.push(`${d.getFullYear()}-${d.getMonth() + 1}`);
    }
  }

  let price = basePrice * (1 - (stock.currentPrice - stock.prevClose) / stock.prevClose * (timeframe === '1D' ? 0.9 : 1.5));
  const points: number[] = [];
  const candles: any[] = [];

  for (let i = 0; i < pointsCount; i++) {
    const progress = i / (pointsCount - 1);
    const noise = (Math.sin(i * 0.7) * 0.4 + (Math.random() - 0.48)) * volatility * basePrice;
    price = price + noise;
    
    if (progress > 0.85) {
      price = price * (1 - (progress - 0.85) * 4) + basePrice * ((progress - 0.85) * 4);
    }
    
    const roundedPrice = Number(price.toFixed(2));
    points.push(roundedPrice);

    const open = i === 0 ? roundedPrice - 0.4 : points[i - 1] || roundedPrice;
    const close = roundedPrice;
    const high = Math.max(open, close) + Math.random() * (basePrice * 0.005);
    const low = Math.min(open, close) - Math.random() * (basePrice * 0.005);
    candles.push({
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      time: timestamps[i]
    });
  }

  points[points.length - 1] = basePrice;
  candles[candles.length - 1].close = basePrice;

  const data = {
    points,
    timestamps,
    candles,
    high: Math.max(...points),
    low: Math.min(...points)
  };

  chartDataCache[key] = data;
  return data;
}


export const ChartCard = () => {
  const { state, setActiveTimeframe, setChartType, livePrices } = useTrading();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverData, setHoverData] = useState<{ price: number, time: string, x: number, y: number } | null>(null);

  const currentPrice = livePrices[state.activeSymbol] || STOCKS_DB[state.activeSymbol]?.currentPrice;

  // Draw chart logic
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !currentPrice) return;

    const data = generateChartData(state.activeSymbol, state.activeTimeframe, currentPrice);
    if (!data) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const { points, candles, timestamps } = data;
    const isPositiveStock = (points[points.length - 1] >= points[0]);
    const strokeColor = isPositiveStock ? '#10b981' : '#f43f5e';
    const fillGradientStart = isPositiveStock ? 'rgba(16, 185, 129, 0.28)' : 'rgba(244, 63, 94, 0.28)';
    
    const padding = { top: 20, right: 50, bottom: 30, left: 10 };
    const chartW = rect.width - padding.left - padding.right;
    const chartH = rect.height - padding.top - padding.bottom;

    const minPrice = Math.min(...points) * 0.998;
    const maxPrice = Math.max(...points) * 1.002;
    const priceRange = maxPrice - minPrice || 1;

    const getX = (index: number) => padding.left + (index / (points.length - 1)) * chartW;
    const getY = (price: number) => padding.top + chartH - ((price - minPrice) / priceRange) * chartH;

    // Draw Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'left';

    for (let i = 0; i <= 4; i++) {
      const yVal = minPrice + (i / 4) * priceRange;
      const yPos = getY(yVal);
      ctx.beginPath();
      ctx.moveTo(padding.left, yPos);
      ctx.lineTo(rect.width - padding.right, yPos);
      ctx.stroke();
      ctx.fillText(`$${yVal.toFixed(2)}`, rect.width - padding.right + 8, yPos + 4);
    }

    if (state.chartType === 'candle') {
      const candleWidth = Math.max(3, (chartW / candles.length) * 0.65);
      candles.forEach((c: any, idx: number) => {
        const x = getX(idx);
        const yOpen = getY(c.open);
        const yClose = getY(c.close);
        const yHigh = getY(c.high);
        const yLow = getY(c.low);
        const isUp = c.close >= c.open;
        const color = isUp ? '#10b981' : '#f43f5e';

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();

        const topY = Math.min(yOpen, yClose);
        const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));
        ctx.fillStyle = color;
        ctx.fillRect(x - candleWidth / 2, topY, candleWidth, bodyHeight);
      });
    } else {
      const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
      grad.addColorStop(0, fillGradientStart);
      grad.addColorStop(1, 'rgba(15, 23, 42, 0.0)');

      ctx.beginPath();
      ctx.moveTo(getX(0), getY(points[0]));

      for (let i = 0; i < points.length - 1; i++) {
        const midX = (getX(i) + getX(i + 1)) / 2;
        ctx.bezierCurveTo(midX, getY(points[i]), midX, getY(points[i + 1]), getX(i + 1), getY(points[i + 1]));
      }

      ctx.lineTo(getX(points.length - 1), padding.top + chartH);
      ctx.lineTo(getX(0), padding.top + chartH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(getX(0), getY(points[0]));
      for (let i = 0; i < points.length - 1; i++) {
        const midX = (getX(i) + getX(i + 1)) / 2;
        ctx.bezierCurveTo(midX, getY(points[i]), midX, getY(points[i + 1]), getX(i + 1), getY(points[i + 1]));
      }
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    // Hover logic
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX - rect.left;
      const relativeX = mouseX - padding.left;
      let closestIndex = Math.round((relativeX / chartW) * (points.length - 1));
      closestIndex = Math.max(0, Math.min(closestIndex, points.length - 1));
      
      const px = getX(closestIndex);
      const py = getY(points[closestIndex]);
      
      setHoverData({
        price: points[closestIndex],
        time: timestamps[closestIndex],
        x: px,
        y: py
      });
    };

    const handleMouseLeave = () => setHoverData(null);

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };

  }, [state.activeSymbol, state.activeTimeframe, state.chartType, currentPrice]);

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-[400px] overflow-hidden relative">
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
          {['1D', '1W', '1M', '1Y', 'ALL'].map(tf => (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf as any)}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-semibold transition-all",
                state.activeTimeframe === tf ? "bg-indigo-500/20 text-indigo-400" : "text-slate-400 hover:text-slate-200"
              )}
            >
              {tf}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
          <button
            onClick={() => setChartType('area')}
            className={cn(
              "px-3 py-1 rounded-md text-xs font-semibold transition-all",
              state.chartType === 'area' ? "bg-white/10 text-white" : "text-slate-400 hover:text-slate-200"
            )}
          >
            Line
          </button>
          <button
            onClick={() => setChartType('candle')}
            className={cn(
              "px-3 py-1 rounded-md text-xs font-semibold transition-all",
              state.chartType === 'candle' ? "bg-white/10 text-white" : "text-slate-400 hover:text-slate-200"
            )}
          >
            Candle
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative w-full h-full p-2" ref={containerRef}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full outline-none" />
        
        {/* Animated Tooltip HUD */}
        {hoverData && (
          <>
            {/* Crosshair lines */}
            <div 
              className="absolute pointer-events-none border-l border-dashed border-white/30 top-0 bottom-[30px]"
              style={{ left: hoverData.x }}
            />
            <div 
              className="absolute pointer-events-none border-t border-dashed border-white/30 left-[10px] right-[50px]"
              style={{ top: hoverData.y }}
            />
            {/* Tooltip Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute pointer-events-none bg-slate-900 border border-white/10 rounded-lg shadow-xl p-3 z-10"
              style={{ 
                left: hoverData.x > 200 ? hoverData.x - 140 : hoverData.x + 20, 
                top: Math.max(20, hoverData.y - 60) 
              }}
            >
              <div className="text-white font-bold tabular-nums text-lg">${hoverData.price.toFixed(2)}</div>
              <div className="text-slate-400 text-xs">{hoverData.time}</div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};
