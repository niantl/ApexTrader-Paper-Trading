/**
 * ApexTrader - Modern Paper Trading Platform & Interactive Stock Dashboard
 * High-fidelity Vanilla JavaScript Engine
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. STOCK MARKET DATABASE & SEED DATA
     ========================================================================== */

  const STOCKS_DB = {
    NVDA: {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      exchange: 'NASDAQ',
      sector: 'Semiconductors • Mega Cap',
      currentPrice: 128.50,
      prevClose: 124.30,
      openPrice: 124.80,
      dayHigh: 129.80,
      dayLow: 124.10,
      fiftyTwoHigh: 140.76,
      fiftyTwoLow: 39.23,
      marketCap: '$3.16T',
      peRatio: '72.4x',
      dayVolume: '54.3M',
      avgVolume: '48.9M',
      beta: '1.68',
      divYield: '0.03%'
    },
    AAPL: {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      exchange: 'NASDAQ',
      sector: 'Consumer Electronics • Mega Cap',
      currentPrice: 224.25,
      prevClose: 221.80,
      openPrice: 222.10,
      dayHigh: 225.40,
      dayLow: 221.50,
      fiftyTwoHigh: 237.23,
      fiftyTwoLow: 164.08,
      marketCap: '$3.44T',
      peRatio: '34.2x',
      dayVolume: '46.1M',
      avgVolume: '52.7M',
      beta: '1.08',
      divYield: '0.45%'
    },
    TSLA: {
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      exchange: 'NASDAQ',
      sector: 'Automotive & Clean Energy • Mega Cap',
      currentPrice: 218.80,
      prevClose: 226.50,
      openPrice: 225.00,
      dayHigh: 227.10,
      dayLow: 216.40,
      fiftyTwoHigh: 271.00,
      fiftyTwoLow: 138.80,
      marketCap: '$698.5B',
      peRatio: '61.8x',
      dayVolume: '68.9M',
      avgVolume: '78.4M',
      beta: '2.42',
      divYield: '0.00%'
    },
    MSFT: {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      exchange: 'NASDAQ',
      sector: 'Enterprise Software & Cloud • Mega Cap',
      currentPrice: 421.15,
      prevClose: 418.90,
      openPrice: 419.50,
      dayHigh: 423.80,
      dayLow: 418.20,
      fiftyTwoHigh: 468.35,
      fiftyTwoLow: 309.45,
      marketCap: '$3.13T',
      peRatio: '35.6x',
      dayVolume: '18.4M',
      avgVolume: '21.6M',
      beta: '1.14',
      divYield: '0.71%'
    },
    AMZN: {
      symbol: 'AMZN',
      name: 'Amazon.com, Inc.',
      exchange: 'NASDAQ',
      sector: 'E-Commerce & Cloud Infrastructure',
      currentPrice: 178.60,
      prevClose: 176.40,
      openPrice: 177.00,
      dayHigh: 179.90,
      dayLow: 176.10,
      fiftyTwoHigh: 201.20,
      fiftyTwoLow: 118.35,
      marketCap: '$1.86T',
      peRatio: '42.1x',
      dayVolume: '32.1M',
      avgVolume: '39.8M',
      beta: '1.26',
      divYield: '0.00%'
    },
    GOOGL: {
      symbol: 'GOOGL',
      name: 'Alphabet Inc. (Google)',
      exchange: 'NASDAQ',
      sector: 'Internet Content & Search Engine',
      currentPrice: 164.40,
      prevClose: 162.90,
      openPrice: 163.20,
      dayHigh: 165.80,
      dayLow: 162.80,
      fiftyTwoHigh: 191.75,
      fiftyTwoLow: 120.21,
      marketCap: '$2.04T',
      peRatio: '23.8x',
      dayVolume: '22.8M',
      avgVolume: '26.4M',
      beta: '1.05',
      divYield: '0.49%'
    },
    META: {
      symbol: 'META',
      name: 'Meta Platforms, Inc.',
      exchange: 'NASDAQ',
      sector: 'Social Media & Artificial Intelligence',
      currentPrice: 532.10,
      prevClose: 524.30,
      openPrice: 526.00,
      dayHigh: 535.80,
      dayLow: 523.50,
      fiftyTwoHigh: 544.23,
      fiftyTwoLow: 279.40,
      marketCap: '$1.35T',
      peRatio: '26.5x',
      dayVolume: '14.2M',
      avgVolume: '16.9M',
      beta: '1.22',
      divYield: '0.38%'
    },
    AMD: {
      symbol: 'AMD',
      name: 'Advanced Micro Devices, Inc.',
      exchange: 'NASDAQ',
      sector: 'Semiconductors & Processors',
      currentPrice: 152.80,
      prevClose: 149.20,
      openPrice: 150.10,
      dayHigh: 154.50,
      dayLow: 148.90,
      fiftyTwoHigh: 227.30,
      fiftyTwoLow: 94.04,
      marketCap: '$247.1B',
      peRatio: '118.2x',
      dayVolume: '38.5M',
      avgVolume: '44.2M',
      beta: '1.74',
      divYield: '0.00%'
    }
  };

  /* ==========================================================================
     2. APPLICATION STATE
     ========================================================================== */

  const INITIAL_STATE = {
    cash: 100000.00,
    holdings: [
      { symbol: 'NVDA', name: 'NVIDIA Corporation', shares: 120, avgBuyPrice: 115.00 },
      { symbol: 'AAPL', name: 'Apple Inc.', shares: 150, avgBuyPrice: 210.00 },
      { symbol: 'TSLA', name: 'Tesla, Inc.', shares: 80, avgBuyPrice: 230.00 }
    ],
    orderHistory: [
      {
        id: 'ORD-98214',
        time: 'Today 09:32:10 AM',
        symbol: 'NVDA',
        side: 'BUY',
        type: 'Market',
        shares: 120,
        price: 115.00,
        total: 13800.00,
        status: 'Filled'
      },
      {
        id: 'ORD-98103',
        time: 'Today 09:30:45 AM',
        symbol: 'AAPL',
        side: 'BUY',
        type: 'Market',
        shares: 150,
        price: 210.00,
        total: 31500.00,
        status: 'Filled'
      },
      {
        id: 'ORD-97842',
        time: 'Yesterday 03:45:12 PM',
        symbol: 'TSLA',
        side: 'BUY',
        type: 'Market',
        shares: 80,
        price: 230.00,
        total: 18400.00,
        status: 'Filled'
      }
    ],
    activeSymbol: 'NVDA',
    activeTimeframe: '1D',
    chartType: 'area', // 'area' | 'candle'
    orderSide: 'BUY',  // 'BUY' | 'SELL'
    orderType: 'MARKET', // 'MARKET' | 'LIMIT'
    quantity: 10,
    limitPrice: 128.50
  };

  // Clone active state from initial
  let state = JSON.parse(JSON.stringify(INITIAL_STATE));

  /* ==========================================================================
     3. HISTORICAL CHART DATA GENERATOR
     ========================================================================== */

  // Cache generated price series per symbol & timeframe
  const chartDataCache = {};

  function generateChartData(symbol, timeframe) {
    const key = `${symbol}_${timeframe}`;
    if (chartDataCache[key]) {
      return chartDataCache[key];
    }

    const stock = STOCKS_DB[symbol];
    const basePrice = stock.currentPrice;
    let pointsCount = 40;
    let volatility = 0.003;
    let timestamps = [];

    const now = new Date();

    if (timeframe === '1D') {
      pointsCount = 38; // 9:30 AM to 4:00 PM (10 min intervals)
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
    } else { // ALL (5 Years)
      pointsCount = 60;
      volatility = 0.035;
      for (let i = 60; i >= 1; i--) {
        const d = new Date(now.getTime() - i * 30 * 24 * 3600 * 1000);
        timestamps.push(`${d.getFullYear()}-${d.getMonth() + 1}`);
      }
    }

    // Deterministic random walk ending at stock.currentPrice
    let price = basePrice * (1 - (stock.currentPrice - stock.prevClose) / stock.prevClose * (timeframe === '1D' ? 0.9 : 1.5));
    const points = [];
    const candles = [];

    for (let i = 0; i < pointsCount; i++) {
      // Guide price towards currentPrice near the end
      const progress = i / (pointsCount - 1);
      const targetFactor = progress;
      const noise = (Math.sin(i * 0.7) * 0.4 + (Math.random() - 0.48)) * volatility * basePrice;
      price = price + noise;
      
      // Interpolate towards actual current price at final points
      if (progress > 0.85) {
        price = price * (1 - (progress - 0.85) * 4) + basePrice * ((progress - 0.85) * 4);
      }
      
      const roundedPrice = Number(price.toFixed(2));
      points.push(roundedPrice);

      // Candlestick mock OHLC
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

    // Ensure last point is exactly current price
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

  /* ==========================================================================
     4. FORMATTING UTILITIES
     ========================================================================== */

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val);
  };

  const formatNumber = (val) => {
    return new Intl.NumberFormat('en-US').format(val);
  };

  const formatSignedCurrency = (val) => {
    const formatted = formatCurrency(Math.abs(val));
    return val >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  const formatSignedPercent = (val) => {
    const sign = val >= 0 ? '+' : '';
    return `(${sign}${val.toFixed(2)}%)`;
  };

  /* ==========================================================================
     5. DOM ELEMENTS CACHE
     ========================================================================== */

  const DOM = {
    // Header KPIs
    headerCashVal: document.getElementById('headerCashVal'),
    headerPortfolioVal: document.getElementById('headerPortfolioVal'),
    headerPnlVal: document.getElementById('headerPnlVal'),
    marketClock: document.getElementById('marketClock'),
    btnResetPortfolio: document.getElementById('btnResetPortfolio'),

    // Search
    tickerSearchInput: document.getElementById('tickerSearchInput'),
    searchDropdown: document.getElementById('searchDropdown'),
    searchContainer: document.getElementById('searchContainer'),

    // Ticker Header
    tickerSymbol: document.getElementById('tickerSymbol'),
    tickerCompanyName: document.getElementById('tickerCompanyName'),
    tickerSector: document.getElementById('tickerSector'),
    currentStockPrice: document.getElementById('currentStockPrice'),
    priceDeltaBadge: document.getElementById('priceDeltaBadge'),
    dayChangeDollar: document.getElementById('dayChangeDollar'),
    dayChangePercent: document.getElementById('dayChangePercent'),

    // Chart Controls & HUD
    timeframeButtons: document.querySelectorAll('.tf-btn'),
    chartHudHigh: document.getElementById('chartHudHigh'),
    chartHudLow: document.getElementById('chartHudLow'),
    chartHudVol: document.getElementById('chartHudVol'),
    btnChartTypeArea: document.getElementById('btnChartTypeArea'),
    btnChartTypeCandle: document.getElementById('btnChartTypeCandle'),
    stockChartCanvas: document.getElementById('stockChartCanvas'),
    chartStageWrapper: document.getElementById('chartStageWrapper'),
    chartTooltip: document.getElementById('chartTooltip'),
    tooltipPrice: document.getElementById('tooltipPrice'),
    tooltipMeta: document.getElementById('tooltipMeta'),
    tooltipDelta: document.getElementById('tooltipDelta'),

    // Stats Grid
    stat52High: document.getElementById('stat52High'),
    stat52Low: document.getElementById('stat52Low'),
    statMarketCap: document.getElementById('statMarketCap'),
    statPeRatio: document.getElementById('statPeRatio'),
    statDayVolume: document.getElementById('statDayVolume'),
    statAvgVolume: document.getElementById('statAvgVolume'),
    statOpenPrice: document.getElementById('statOpenPrice'),
    statDayRange: document.getElementById('statDayRange'),
    statBeta: document.getElementById('statBeta'),
    statDivYield: document.getElementById('statDivYield'),

    // Bottom Tabs & Tables
    portfolioTabBtns: document.querySelectorAll('.portfolio-tab-btn'),
    tabPanels: document.querySelectorAll('.tab-panel'),
    holdingsTableBody: document.getElementById('holdingsTableBody'),
    historyTableBody: document.getElementById('historyTableBody'),
    watchlistGrid: document.getElementById('watchlistGrid'),
    holdingsBadgeCount: document.getElementById('holdingsBadgeCount'),
    historyBadgeCount: document.getElementById('historyBadgeCount'),

    // Order Execution Widget
    orderWidgetTicker: document.getElementById('orderWidgetTicker'),
    orderWidgetPrice: document.getElementById('orderWidgetPrice'),
    btnSideBuy: document.getElementById('btnSideBuy'),
    btnSideSell: document.getElementById('btnSideSell'),
    orderTypeSelect: document.getElementById('orderTypeSelect'),
    limitPriceGroup: document.getElementById('limitPriceGroup'),
    limitPriceInput: document.getElementById('limitPriceInput'),
    orderQuantityInput: document.getElementById('orderQuantityInput'),
    btnQtyMinus: document.getElementById('btnQtyMinus'),
    btnQtyPlus: document.getElementById('btnQtyPlus'),
    qtyPills: document.querySelectorAll('.qty-pill:not(.pill-max)'),
    btnQtyMax: document.getElementById('btnQtyMax'),
    sharesAvailLabel: document.getElementById('sharesAvailLabel'),
    calcExecutionPrice: document.getElementById('calcExecutionPrice'),
    calcEstimatedTotal: document.getElementById('calcEstimatedTotal'),
    calcPowerLabel: document.getElementById('calcPowerLabel'),
    calcAvailablePower: document.getElementById('calcAvailablePower'),
    calcPostCash: document.getElementById('calcPostCash'),
    orderAlertBox: document.getElementById('orderAlertBox'),
    orderAlertMsg: document.getElementById('orderAlertMsg'),
    btnPlaceOrder: document.getElementById('btnPlaceOrder'),
    btnOrderText: document.getElementById('btnOrderText'),
    btnOrderSubtext: document.getElementById('btnOrderSubtext'),

    // Toast
    toastContainer: document.getElementById('toastContainer')
  };

  /* ==========================================================================
     6. PORTFOLIO & KPI CALCULATIONS
     ========================================================================== */

  function computePortfolioMetrics() {
    let holdingsMarketValue = 0;
    let holdingsTotalCost = 0;

    state.holdings.forEach(holding => {
      const stock = STOCKS_DB[holding.symbol];
      const livePrice = stock ? stock.currentPrice : holding.avgBuyPrice;
      const value = holding.shares * livePrice;
      const cost = holding.shares * holding.avgBuyPrice;

      holdingsMarketValue += value;
      holdingsTotalCost += cost;
    });

    const totalPortfolioValue = state.cash + holdingsMarketValue;
    const initialBase = 100000.00;
    const totalPnlDollar = totalPortfolioValue - initialBase;
    const totalPnlPercent = (totalPnlDollar / initialBase) * 100;

    return {
      cash: state.cash,
      holdingsMarketValue,
      totalPortfolioValue,
      totalPnlDollar,
      totalPnlPercent
    };
  }

  function renderHeaderKPIs() {
    const metrics = computePortfolioMetrics();

    DOM.headerCashVal.textContent = formatCurrency(metrics.cash);
    DOM.headerPortfolioVal.textContent = formatCurrency(metrics.totalPortfolioValue);

    const sign = metrics.totalPnlDollar >= 0 ? '+' : '-';
    DOM.headerPnlVal.textContent = `${formatSignedCurrency(metrics.totalPnlDollar)} ${formatSignedPercent(metrics.totalPnlPercent)}`;

    if (metrics.totalPnlDollar >= 0) {
      DOM.headerPnlVal.className = 'kpi-value text-positive tabular-num';
    } else {
      DOM.headerPnlVal.className = 'kpi-value text-negative tabular-num';
    }

    DOM.holdingsBadgeCount.textContent = state.holdings.length;
    DOM.historyBadgeCount.textContent = state.orderHistory.length;
  }

  /* ==========================================================================
     7. TICKER HEADER & KEY STATISTICS RENDERING
     ========================================================================== */

  function renderTickerHeader(flashClass = null) {
    const stock = STOCKS_DB[state.activeSymbol];
    if (!stock) return;

    DOM.tickerSymbol.textContent = stock.symbol;
    DOM.tickerCompanyName.textContent = stock.name;
    DOM.tickerSector.textContent = stock.sector;

    DOM.currentStockPrice.textContent = stock.currentPrice.toFixed(2);

    if (flashClass) {
      DOM.currentStockPrice.classList.add(flashClass);
      setTimeout(() => {
        DOM.currentStockPrice.classList.remove(flashClass);
      }, 500);
    }

    const deltaDollar = stock.currentPrice - stock.prevClose;
    const deltaPercent = (deltaDollar / stock.prevClose) * 100;
    const isPositive = deltaDollar >= 0;

    DOM.dayChangeDollar.textContent = (isPositive ? '+$' : '-$') + Math.abs(deltaDollar).toFixed(2);
    DOM.dayChangePercent.textContent = `(${isPositive ? '+' : ''}${deltaPercent.toFixed(2)}%)`;

    DOM.priceDeltaBadge.className = `price-delta-badge ${isPositive ? 'positive' : 'negative'}`;

    // Render Stats
    DOM.stat52High.textContent = `$${stock.fiftyTwoHigh.toFixed(2)}`;
    DOM.stat52Low.textContent = `$${stock.fiftyTwoLow.toFixed(2)}`;
    DOM.statMarketCap.textContent = stock.marketCap;
    DOM.statPeRatio.textContent = stock.peRatio;
    DOM.statDayVolume.textContent = stock.dayVolume;
    DOM.statAvgVolume.textContent = stock.avgVolume;
    DOM.statOpenPrice.textContent = `$${stock.openPrice.toFixed(2)}`;
    DOM.statDayRange.textContent = `$${stock.dayLow.toFixed(2)} - $${stock.dayHigh.toFixed(2)}`;
    DOM.statBeta.textContent = stock.beta;
    DOM.statDivYield.textContent = stock.divYield;

    // HUD Header Info
    const chartData = generateChartData(state.activeSymbol, state.activeTimeframe);
    DOM.chartHudHigh.textContent = `$${chartData.high.toFixed(2)}`;
    DOM.chartHudLow.textContent = `$${chartData.low.toFixed(2)}`;
    DOM.chartHudVol.textContent = stock.dayVolume;
  }

  /* ==========================================================================
     8. INTERACTIVE CANVAS CHART ENGINE
     ========================================================================== */

  let canvasState = {
    hoverIndex: -1,
    isHovering: false
  };

  function setupCanvasResolution(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.resetTransform();
    ctx.scale(dpr, dpr);
    return { ctx, width: rect.width, height: rect.height };
  }

  function drawStockChart() {
    const canvas = DOM.stockChartCanvas;
    if (!canvas) return;

    const { ctx, width, height } = setupCanvasResolution(canvas);
    ctx.clearRect(0, 0, width, height);

    const stock = STOCKS_DB[state.activeSymbol];
    const data = generateChartData(state.activeSymbol, state.activeTimeframe);
    const points = data.points;
    const timestamps = data.timestamps;
    const candles = data.candles;

    if (!points || points.length === 0) return;

    const isPositiveStock = (points[points.length - 1] >= points[0]);
    const strokeColor = isPositiveStock ? '#10b981' : '#f43f5e';
    const fillGradientStart = isPositiveStock ? 'rgba(16, 185, 129, 0.28)' : 'rgba(244, 63, 94, 0.28)';
    const fillGradientEnd = 'rgba(15, 23, 42, 0.0)';

    // Margins
    const padding = { top: 25, right: 65, bottom: 35, left: 15 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const minPrice = Math.min(...points) * 0.998;
    const maxPrice = Math.max(...points) * 1.002;
    const priceRange = maxPrice - minPrice || 1;

    const getX = (index) => padding.left + (index / (points.length - 1)) * chartW;
    const getY = (price) => padding.top + chartH - ((price - minPrice) / priceRange) * chartH;

    // Draw Background Grid Lines & Y-Axis Labels
    const gridLinesCount = 5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'left';

    for (let i = 0; i <= gridLinesCount; i++) {
      const yVal = minPrice + (i / gridLinesCount) * priceRange;
      const yPos = getY(yVal);

      ctx.beginPath();
      ctx.moveTo(padding.left, yPos);
      ctx.lineTo(width - padding.right, yPos);
      ctx.stroke();

      // Label on the right margin
      ctx.fillText(`$${yVal.toFixed(2)}`, width - padding.right + 8, yPos + 4);
    }

    // Draw Time Labels on X-Axis
    const timeStep = Math.floor(points.length / 5);
    ctx.textAlign = 'center';
    for (let i = 0; i < points.length; i += timeStep) {
      const xPos = getX(i);
      ctx.fillText(timestamps[i] || '', xPos, height - 12);
    }

    // Draw Chart Based on Mode: Area vs Candlestick
    if (state.chartType === 'candle') {
      // DRAW CANDLESTICKS
      const candleWidth = Math.max(3, (chartW / candles.length) * 0.65);

      candles.forEach((c, idx) => {
        const x = getX(idx);
        const yOpen = getY(c.open);
        const yClose = getY(c.close);
        const yHigh = getY(c.high);
        const yLow = getY(c.low);
        const isUp = c.close >= c.open;
        const color = isUp ? '#10b981' : '#f43f5e';

        // Draw Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();

        // Draw Candle Body
        const topY = Math.min(yOpen, yClose);
        const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));
        ctx.fillStyle = color;
        ctx.fillRect(x - candleWidth / 2, topY, candleWidth, bodyHeight);
      });

    } else {
      // DRAW SMOOTH AREA CURVE
      // 1. Area Gradient Fill
      const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
      grad.addColorStop(0, fillGradientStart);
      grad.addColorStop(1, fillGradientEnd);

      ctx.beginPath();
      ctx.moveTo(getX(0), getY(points[0]));

      for (let i = 0; i < points.length - 1; i++) {
        const x0 = getX(i);
        const y0 = getY(points[i]);
        const x1 = getX(i + 1);
        const y1 = getY(points[i + 1]);
        const midX = (x0 + x1) / 2;
        ctx.bezierCurveTo(midX, y0, midX, y1, x1, y1);
      }

      ctx.lineTo(getX(points.length - 1), padding.top + chartH);
      ctx.lineTo(getX(0), padding.top + chartH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // 2. Stroke Line
      ctx.beginPath();
      ctx.moveTo(getX(0), getY(points[0]));
      for (let i = 0; i < points.length - 1; i++) {
        const x0 = getX(i);
        const y0 = getY(points[i]);
        const x1 = getX(i + 1);
        const y1 = getY(points[i + 1]);
        const midX = (x0 + x1) / 2;
        ctx.bezierCurveTo(midX, y0, midX, y1, x1, y1);
      }
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    // DRAW HOVER CROSSHAIR & TOOLTIP HUD
    if (canvasState.isHovering && canvasState.hoverIndex >= 0 && canvasState.hoverIndex < points.length) {
      const idx = canvasState.hoverIndex;
      const hoverX = getX(idx);
      const hoverY = getY(points[idx]);
      const hoverPrice = points[idx];
      const hoverTime = timestamps[idx];

      // Dotted Vertical Line
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(hoverX, padding.top);
      ctx.lineTo(hoverX, padding.top + chartH);
      ctx.stroke();

      // Dotted Horizontal Line
      ctx.beginPath();
      ctx.moveTo(padding.left, hoverY);
      ctx.lineTo(width - padding.right, hoverY);
      ctx.stroke();
      ctx.restore();

      // Glowing Point Circle
      ctx.beginPath();
      ctx.arc(hoverX, hoverY, 6, 0, Math.PI * 2);
      ctx.fillStyle = strokeColor;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Position & Update Floating DOM Tooltip
      const delta = hoverPrice - points[0];
      const deltaPct = (delta / points[0]) * 100;
      const isPos = delta >= 0;

      DOM.tooltipPrice.textContent = `$${hoverPrice.toFixed(2)}`;
      DOM.tooltipMeta.textContent = `${state.activeSymbol} • ${hoverTime}`;
      DOM.tooltipDelta.textContent = `${isPos ? '+' : ''}$${delta.toFixed(2)} (${isPos ? '+' : ''}${deltaPct.toFixed(2)}%)`;
      DOM.tooltipDelta.className = `tooltip-delta ${isPos ? 'text-positive' : 'text-negative'}`;

      const tooltipEl = DOM.chartTooltip;
      tooltipEl.style.display = 'block';

      // Keep tooltip from overflowing right edge
      const tooltipX = hoverX > width - 180 ? hoverX - 160 : hoverX + 15;
      const tooltipY = Math.max(10, Math.min(hoverY - 40, height - 90));
      tooltipEl.style.transform = `translate(${tooltipX}px, ${tooltipY}px)`;
    } else {
      DOM.chartTooltip.style.display = 'none';
    }
  }

  // Handle Chart Hover Events
  function handleChartMouseMove(e) {
    const canvas = DOM.stockChartCanvas;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const data = generateChartData(state.activeSymbol, state.activeTimeframe);
    const pointsCount = data.points.length;
    const padding = { left: 15, right: 65 };
    const chartW = rect.width - padding.left - padding.right;

    const relativeX = mouseX - padding.left;
    let closestIndex = Math.round((relativeX / chartW) * (pointsCount - 1));
    closestIndex = Math.max(0, Math.min(closestIndex, pointsCount - 1));

    canvasState.isHovering = true;
    canvasState.hoverIndex = closestIndex;
    drawStockChart();
  }

  function handleChartMouseLeave() {
    canvasState.isHovering = false;
    canvasState.hoverIndex = -1;
    drawStockChart();
  }

  /* ==========================================================================
     9. TABLES RENDERING (HOLDINGS & ORDER HISTORY & WATCHLIST)
     ========================================================================== */

  function renderHoldingsTable() {
    const tbody = DOM.holdingsTableBody;
    tbody.innerHTML = '';

    if (state.holdings.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2.5rem 1rem;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: 0 auto 0.5rem auto; display: block; opacity: 0.5;">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            No active stock holdings. Execute a BUY order to open a simulated position!
          </td>
        </tr>
      `;
      return;
    }

    state.holdings.forEach(holding => {
      const stock = STOCKS_DB[holding.symbol] || { currentPrice: holding.avgBuyPrice, name: holding.name };
      const totalMarketVal = holding.shares * stock.currentPrice;
      const totalCostVal = holding.shares * holding.avgBuyPrice;
      const unPnlDollar = totalMarketVal - totalCostVal;
      const unPnlPercent = (unPnlDollar / totalCostVal) * 100;
      const isPositive = unPnlDollar >= 0;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="ticker-cell-group" style="cursor: pointer;" data-select-stock="${holding.symbol}">
            <span class="table-sym">${holding.symbol}</span>
            <span class="table-company">${holding.name}</span>
          </div>
        </td>
        <td class="text-right tabular-num font-bold">${formatNumber(holding.shares)}</td>
        <td class="text-right tabular-num">$${holding.avgBuyPrice.toFixed(2)}</td>
        <td class="text-right tabular-num font-bold">$${stock.currentPrice.toFixed(2)}</td>
        <td class="text-right tabular-num font-bold">${formatCurrency(totalMarketVal)}</td>
        <td class="text-right tabular-num ${isPositive ? 'text-positive' : 'text-negative'}">
          ${formatSignedCurrency(unPnlDollar)} ${formatSignedPercent(unPnlPercent)}
        </td>
        <td class="text-center">
          <button class="btn-table-action" data-quick-sell="${holding.symbol}">
            Sell / Trade
          </button>
        </td>
      `;

      // Click ticker to switch stock
      tr.querySelector('[data-select-stock]').addEventListener('click', () => {
        selectActiveStock(holding.symbol);
      });

      // Quick sell action button
      tr.querySelector('[data-quick-sell]').addEventListener('click', () => {
        selectActiveStock(holding.symbol);
        setOrderSide('SELL');
        DOM.orderQuantityInput.value = holding.shares;
        state.quantity = holding.shares;
        updateOrderCalculation();
        DOM.orderExecutionWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });

      tbody.appendChild(tr);
    });
  }

  function renderOrderHistoryTable() {
    const tbody = DOM.historyTableBody;
    tbody.innerHTML = '';

    if (state.orderHistory.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2.5rem 1rem;">
            No simulated trade transactions yet.
          </td>
        </tr>
      `;
      return;
    }

    state.orderHistory.forEach(order => {
      const isBuy = order.side === 'BUY';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="tabular-num" style="color: var(--text-muted); font-size: 0.78rem;">${order.time}</td>
        <td><strong style="color: #ffffff;">${order.symbol}</strong></td>
        <td>
          <span class="badge-side ${isBuy ? 'buy' : 'sell'}">${order.side}</span>
        </td>
        <td style="color: var(--text-secondary); font-size: 0.8rem;">${order.type}</td>
        <td class="text-right tabular-num">${formatNumber(order.shares)}</td>
        <td class="text-right tabular-num">$${order.price.toFixed(2)}</td>
        <td class="text-right tabular-num font-bold">${formatCurrency(order.total)}</td>
        <td class="text-center">
          <span class="badge-status-filled">${order.status}</span>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderWatchlist() {
    const grid = DOM.watchlistGrid;
    grid.innerHTML = '';

    Object.keys(STOCKS_DB).forEach(sym => {
      const s = STOCKS_DB[sym];
      const delta = s.currentPrice - s.prevClose;
      const deltaPct = (delta / s.prevClose) * 100;
      const isPos = delta >= 0;

      const card = document.createElement('div');
      card.className = 'watchlist-card';
      card.innerHTML = `
        <div>
          <div class="wl-sym">${s.symbol}</div>
          <div class="wl-name">${s.name}</div>
        </div>
        <div>
          <div class="wl-price tabular-num">$${s.currentPrice.toFixed(2)}</div>
          <div class="wl-chg tabular-num ${isPos ? 'text-positive' : 'text-negative'}">
            ${isPos ? '+' : ''}${deltaPct.toFixed(2)}%
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        selectActiveStock(s.symbol);
      });

      grid.appendChild(card);
    });
  }

  /* ==========================================================================
     10. ORDER EXECUTION FORM LOGIC & VALIDATION
     ========================================================================== */

  function setOrderSide(side) {
    state.orderSide = side;

    if (side === 'BUY') {
      DOM.btnSideBuy.classList.add('active');
      DOM.btnSideSell.classList.remove('active');
      DOM.btnPlaceOrder.className = 'btn-execute-order buy';
      DOM.btnOrderText.textContent = 'Place Buy Order';
      DOM.calcPowerLabel.textContent = 'Buying Power Available';
    } else {
      DOM.btnSideSell.classList.add('active');
      DOM.btnSideBuy.classList.remove('active');
      DOM.btnPlaceOrder.className = 'btn-execute-order sell';
      DOM.btnOrderText.textContent = 'Place Sell Order';
      DOM.calcPowerLabel.textContent = 'Virtual Cash (Pre-Sale)';
    }

    updateOrderCalculation();
  }

  function getOwnedShares(symbol) {
    const found = state.holdings.find(h => h.symbol === symbol);
    return found ? found.shares : 0;
  }

  function updateOrderCalculation() {
    const stock = STOCKS_DB[state.activeSymbol];
    if (!stock) return;

    DOM.orderWidgetTicker.textContent = stock.symbol;
    DOM.orderWidgetPrice.textContent = `$${stock.currentPrice.toFixed(2)}`;

    // Order type & execution price
    const orderType = DOM.orderTypeSelect.value;
    state.orderType = orderType;

    let executionPrice = stock.currentPrice;
    if (orderType === 'LIMIT') {
      DOM.limitPriceGroup.style.display = 'block';
      const inputLimit = parseFloat(DOM.limitPriceInput.value);
      if (!isNaN(inputLimit) && inputLimit > 0) {
        executionPrice = inputLimit;
      } else {
        DOM.limitPriceInput.value = stock.currentPrice.toFixed(2);
        executionPrice = stock.currentPrice;
      }
    } else {
      DOM.limitPriceGroup.style.display = 'none';
    }

    // Parse Quantity
    let qty = parseInt(DOM.orderQuantityInput.value, 10);
    if (isNaN(qty) || qty < 1) {
      qty = 1;
    }
    state.quantity = qty;

    const ownedShares = getOwnedShares(state.activeSymbol);
    DOM.sharesAvailLabel.textContent = `Position: ${ownedShares} shares owned`;

    const estimatedTotal = qty * executionPrice;
    DOM.calcExecutionPrice.textContent = `$${executionPrice.toFixed(2)}`;
    DOM.calcEstimatedTotal.textContent = formatCurrency(estimatedTotal);
    DOM.btnOrderSubtext.textContent = `• ${formatCurrency(estimatedTotal)}`;

    let isValid = true;
    let errorMsg = '';

    if (state.orderSide === 'BUY') {
      DOM.calcAvailablePower.textContent = formatCurrency(state.cash);
      const postCash = state.cash - estimatedTotal;
      DOM.calcPostCash.textContent = formatCurrency(postCash);

      if (estimatedTotal > state.cash) {
        isValid = false;
        errorMsg = `Insufficient Buying Power (Need ${formatCurrency(estimatedTotal - state.cash)} more)`;
      }
    } else { // SELL
      DOM.calcAvailablePower.textContent = formatCurrency(state.cash);
      const postCash = state.cash + estimatedTotal;
      DOM.calcPostCash.textContent = formatCurrency(postCash);

      if (ownedShares === 0) {
        isValid = false;
        errorMsg = `You do not own any shares of ${state.activeSymbol}`;
      } else if (qty > ownedShares) {
        isValid = false;
        errorMsg = `Cannot sell ${qty} shares (Only ${ownedShares} owned)`;
      }
    }

    if (!isValid) {
      DOM.orderAlertBox.style.display = 'flex';
      DOM.orderAlertMsg.textContent = errorMsg;
      DOM.btnPlaceOrder.disabled = true;
    } else {
      DOM.orderAlertBox.style.display = 'none';
      DOM.btnPlaceOrder.disabled = false;
    }
  }

  function executeTrade() {
    const stock = STOCKS_DB[state.activeSymbol];
    if (!stock) return;

    const qty = parseInt(DOM.orderQuantityInput.value, 10);
    if (isNaN(qty) || qty <= 0) {
      showToast('Invalid Quantity', 'Please specify at least 1 share to trade.', 'error');
      return;
    }

    let executionPrice = stock.currentPrice;
    if (state.orderType === 'LIMIT') {
      const inputLimit = parseFloat(DOM.limitPriceInput.value);
      if (!isNaN(inputLimit) && inputLimit > 0) {
        executionPrice = inputLimit;
      }
    }

    const totalCost = qty * executionPrice;
    const nowTimeStr = `Today ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;

    if (state.orderSide === 'BUY') {
      if (totalCost > state.cash) {
        showToast('Order Rejected', 'Insufficient buying power in your virtual cash account.', 'error');
        return;
      }

      // Deduct cash
      state.cash -= totalCost;

      // Update or add holding
      const existing = state.holdings.find(h => h.symbol === stock.symbol);
      if (existing) {
        const totalShares = existing.shares + qty;
        const totalInvested = (existing.shares * existing.avgBuyPrice) + totalCost;
        existing.avgBuyPrice = totalInvested / totalShares;
        existing.shares = totalShares;
      } else {
        state.holdings.push({
          symbol: stock.symbol,
          name: stock.name,
          shares: qty,
          avgBuyPrice: executionPrice
        });
      }

      // Add to Order History
      const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      state.orderHistory.unshift({
        id: orderId,
        time: nowTimeStr,
        symbol: stock.symbol,
        side: 'BUY',
        type: state.orderType === 'LIMIT' ? 'Limit' : 'Market',
        shares: qty,
        price: executionPrice,
        total: totalCost,
        status: 'Filled'
      });

      showToast(
        'Buy Order Filled! 🚀',
        `Purchased ${qty} shares of ${stock.symbol} @ $${executionPrice.toFixed(2)} for ${formatCurrency(totalCost)}.`,
        'success'
      );

    } else { // SELL
      const existing = state.holdings.find(h => h.symbol === stock.symbol);
      if (!existing || existing.shares < qty) {
        showToast('Order Rejected', `Cannot sell ${qty} shares. You only own ${existing ? existing.shares : 0} shares.`, 'error');
        return;
      }

      // Add cash proceeds
      state.cash += totalCost;

      // Deduct shares or remove
      existing.shares -= qty;
      if (existing.shares <= 0) {
        state.holdings = state.holdings.filter(h => h.symbol !== stock.symbol);
      }

      // Add to Order History
      const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      state.orderHistory.unshift({
        id: orderId,
        time: nowTimeStr,
        symbol: stock.symbol,
        side: 'SELL',
        type: state.orderType === 'LIMIT' ? 'Limit' : 'Market',
        shares: qty,
        price: executionPrice,
        total: totalCost,
        status: 'Filled'
      });

      showToast(
        'Sell Order Filled! 💰',
        `Sold ${qty} shares of ${stock.symbol} @ $${executionPrice.toFixed(2)} (+${formatCurrency(totalCost)} cash).`,
        'success'
      );
    }

    // Re-render UI
    renderHeaderKPIs();
    renderHoldingsTable();
    renderOrderHistoryTable();
    updateOrderCalculation();
  }

  /* ==========================================================================
     11. TOAST NOTIFICATION SYSTEM
     ========================================================================== */

  function showToast(title, message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-content">
        <span class="toast-title">${title}</span>
        <span class="toast-msg">${message}</span>
      </div>
    `;

    DOM.toastContainer.appendChild(toast);

    // Trigger entry transition
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto dismiss
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 400);
    }, 4200);
  }

  /* ==========================================================================
     12. STOCK SWITCHER & SEARCH SYSTEM
     ========================================================================== */

  function selectActiveStock(symbol) {
    if (!STOCKS_DB[symbol]) return;
    state.activeSymbol = symbol;
    DOM.limitPriceInput.value = STOCKS_DB[symbol].currentPrice.toFixed(2);

    renderTickerHeader();
    drawStockChart();
    updateOrderCalculation();
    renderHoldingsTable();

    // Close search dropdown
    DOM.searchDropdown.style.display = 'none';
    DOM.tickerSearchInput.value = '';
  }

  function handleSearchInput(e) {
    const query = e.target.value.trim().toLowerCase();
    const dropdown = DOM.searchDropdown;

    if (!query) {
      dropdown.style.display = 'none';
      return;
    }

    const matches = Object.values(STOCKS_DB).filter(s =>
      s.symbol.toLowerCase().includes(query) || s.name.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      dropdown.innerHTML = `
        <div style="padding: 0.75rem 1rem; color: var(--text-muted); font-size: 0.8rem; text-align: center;">
          No matching stocks found for "${query}"
        </div>
      `;
      dropdown.style.display = 'block';
      return;
    }

    dropdown.innerHTML = '';
    matches.forEach(m => {
      const delta = m.currentPrice - m.prevClose;
      const deltaPct = (delta / m.prevClose) * 100;
      const isPos = delta >= 0;

      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.innerHTML = `
        <div class="search-item-left">
          <span class="search-item-sym">${m.symbol}</span>
          <span class="search-item-name">${m.name}</span>
        </div>
        <div class="search-item-right">
          <div class="search-item-price tabular-num">$${m.currentPrice.toFixed(2)}</div>
          <div class="search-item-chg tabular-num ${isPos ? 'text-positive' : 'text-negative'}">
            ${isPos ? '+' : ''}${deltaPct.toFixed(2)}%
          </div>
        </div>
      `;

      item.addEventListener('click', () => {
        selectActiveStock(m.symbol);
      });

      dropdown.appendChild(item);
    });

    dropdown.style.display = 'block';
  }

  /* ==========================================================================
     13. LIVE TICK SIMULATOR (MARKET PULSE)
     ========================================================================== */

  function initLiveMarketSimulation() {
    // 1. Live Clock
    setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/New_York' });
      DOM.marketClock.textContent = `NYSE ${timeString} EDT`;
    }, 1000);

    // 2. Micro Price Fluctuation Tick (every 2.5s)
    setInterval(() => {
      const activeStock = STOCKS_DB[state.activeSymbol];
      if (!activeStock) return;

      // Realistic random tick ±0.15%
      const tickDelta = (Math.random() - 0.49) * 0.003 * activeStock.currentPrice;
      const oldPrice = activeStock.currentPrice;
      const newPrice = Math.max(1, Number((oldPrice + tickDelta).toFixed(2)));

      if (newPrice !== oldPrice) {
        activeStock.currentPrice = newPrice;
        if (newPrice > activeStock.dayHigh) activeStock.dayHigh = newPrice;
        if (newPrice < activeStock.dayLow) activeStock.dayLow = newPrice;

        const flashClass = newPrice > oldPrice ? 'flash-green' : 'flash-red';

        // Update cached chart's last point
        const cached = chartDataCache[`${state.activeSymbol}_${state.activeTimeframe}`];
        if (cached && cached.points) {
          cached.points[cached.points.length - 1] = newPrice;
          if (cached.candles && cached.candles.length > 0) {
            cached.candles[cached.candles.length - 1].close = newPrice;
          }
        }

        renderTickerHeader(flashClass);
        drawStockChart();
        renderHeaderKPIs();
        renderHoldingsTable();
        updateOrderCalculation();
      }
    }, 2500);
  }

  /* ==========================================================================
     14. EVENT LISTENERS SETUP
     ========================================================================== */

  function setupEventListeners() {
    // Timeframe selector buttons
    DOM.timeframeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.timeframeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeTimeframe = btn.dataset.tf;
        drawStockChart();
        renderTickerHeader();
      });
    });

    // Chart Type Selector
    DOM.btnChartTypeArea.addEventListener('click', () => {
      DOM.btnChartTypeArea.classList.add('active');
      DOM.btnChartTypeCandle.classList.remove('active');
      state.chartType = 'area';
      drawStockChart();
    });

    DOM.btnChartTypeCandle.addEventListener('click', () => {
      DOM.btnChartTypeCandle.classList.add('active');
      DOM.btnChartTypeArea.classList.remove('active');
      state.chartType = 'candle';
      drawStockChart();
    });

    // Chart Canvas Mouse Tracking
    DOM.stockChartCanvas.addEventListener('mousemove', handleChartMouseMove);
    DOM.stockChartCanvas.addEventListener('mouseleave', handleChartMouseLeave);
    window.addEventListener('resize', () => drawStockChart());

    // Search Input & Autocomplete
    DOM.tickerSearchInput.addEventListener('input', handleSearchInput);
    DOM.tickerSearchInput.addEventListener('focus', handleSearchInput);

    // Global shortcut '/' to focus search
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== DOM.tickerSearchInput) {
        e.preventDefault();
        DOM.tickerSearchInput.focus();
        DOM.tickerSearchInput.select();
      }
    });

    // Close search dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!DOM.searchContainer.contains(e.target)) {
        DOM.searchDropdown.style.display = 'none';
      }
    });

    // Portfolio Bottom Tabs
    DOM.portfolioTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.portfolioTabBtns.forEach(b => b.classList.remove('active'));
        DOM.tabPanels.forEach(p => {
          p.classList.remove('active');
          p.style.display = 'none';
        });

        btn.classList.add('active');
        const targetPanel = document.getElementById(btn.dataset.target);
        if (targetPanel) {
          targetPanel.classList.add('active');
          targetPanel.style.display = 'block';
        }
      });
    });

    // Order Execution Side Toggle
    DOM.btnSideBuy.addEventListener('click', () => setOrderSide('BUY'));
    DOM.btnSideSell.addEventListener('click', () => setOrderSide('SELL'));

    // Order Type Selector
    DOM.orderTypeSelect.addEventListener('change', updateOrderCalculation);
    DOM.limitPriceInput.addEventListener('input', updateOrderCalculation);

    // Quantity Steppers & Input
    DOM.orderQuantityInput.addEventListener('input', updateOrderCalculation);
    DOM.btnQtyMinus.addEventListener('click', () => {
      let q = parseInt(DOM.orderQuantityInput.value, 10) || 1;
      if (q > 1) {
        DOM.orderQuantityInput.value = q - 1;
        updateOrderCalculation();
      }
    });
    DOM.btnQtyPlus.addEventListener('click', () => {
      let q = parseInt(DOM.orderQuantityInput.value, 10) || 0;
      DOM.orderQuantityInput.value = q + 1;
      updateOrderCalculation();
    });

    // Quantity Quick Pills (+10, +50, +100)
    DOM.qtyPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const add = parseInt(pill.dataset.add, 10);
        let cur = parseInt(DOM.orderQuantityInput.value, 10) || 0;
        DOM.orderQuantityInput.value = cur + add;
        updateOrderCalculation();
      });
    });

    // Quantity MAX Button
    DOM.btnQtyMax.addEventListener('click', () => {
      const stock = STOCKS_DB[state.activeSymbol];
      if (!stock) return;

      if (state.orderSide === 'BUY') {
        const maxAffordable = Math.floor(state.cash / stock.currentPrice);
        DOM.orderQuantityInput.value = Math.max(1, maxAffordable);
      } else {
        const owned = getOwnedShares(state.activeSymbol);
        DOM.orderQuantityInput.value = Math.max(1, owned);
      }
      updateOrderCalculation();
    });

    // Primary Place Order Button
    DOM.btnPlaceOrder.addEventListener('click', executeTrade);

    // Reset Portfolio Action
    DOM.btnResetPortfolio.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset your paper portfolio back to the initial $100,000.00 cash balance?')) {
        state = JSON.parse(JSON.stringify(INITIAL_STATE));
        renderHeaderKPIs();
        renderTickerHeader();
        renderHoldingsTable();
        renderOrderHistoryTable();
        updateOrderCalculation();
        showToast('Portfolio Reset', 'Virtual cash reset to $100,000.00 and holdings restored to default.', 'info');
      }
    });
  }

  /* ==========================================================================
     15. INITIALIZATION
     ========================================================================== */

  function init() {
    renderHeaderKPIs();
    renderTickerHeader();
    drawStockChart();
    renderHoldingsTable();
    renderOrderHistoryTable();
    renderWatchlist();
    updateOrderCalculation();
    setupEventListeners();
    initLiveMarketSimulation();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
