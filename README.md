# 📈 ApexTrader — Pro Paper Trading & Real-Time Stock Dashboard

[![Platform](https://img.shields.io/badge/Platform-Web-38bdf8?style=flat-square)](https://github.com)
[![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-10b981?style=flat-square)](https://developer.mozilla.org)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero%20(Pure%20Native)-f59e0b?style=flat-square)](https://vanilla-js.com)
[![Design](https://img.shields.io/badge/Theme-FinTech%20Dark%20Slate-6366f1?style=flat-square)](styles.css)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

**ApexTrader** is a high-fidelity, client-side simulated paper trading platform and interactive stock market dashboard. Engineered with pure vanilla web technologies (HTML5 Canvas, CSS3, and modern JavaScript), it delivers a Bloomberg/TradingView-inspired dark-mode trading experience with real-time simulated price ticks, order execution, position tracking, and dynamic interactive charting.

---

## ✨ Key Features

### 1. 📊 Interactive Canvas Charting Engine
- **Dual Visual Modes**: Seamlessly toggle between **Smooth Area Curve** (with dynamic gradient fill) and **Japanese Candlestick OHLC** rendering.
- **Dynamic Crosshair & HUD Tooltip**: Real-time cursor tracking with high/low bounds, timestamp interpolation, and percentage delta calculations.
- **Multi-Timeframe Analysis**: Instant switching across `1D` (Intraday 10-min ticks), `1W`, `1M`, `1Y`, and `ALL` (5-year historical simulations).
- **High-DPI / Retina Ready**: Automatic device pixel ratio scaling (`window.devicePixelRatio`) prevents blurriness on 4K/Retina displays.

### 2. 💼 Paper Trading & Simulated Execution Engine
- **$100,000 Starting Virtual Capital**: Practice trading risk-free with accurate financial calculations.
- **Order Types**:
  - **Market Orders**: Instant execution at the current simulated bid/ask price.
  - **Limit Orders**: Set price boundaries and triggers.
- **Live Margin & Buying Power Validation**: Automatic pre-trade safety checks preventing overspending or shorting unowned shares.
- **Smart Quantity Inputs**: Precision steppers (`-` / `+`), quick-increment preset chips (`+10`, `+50`, `+100`), and a `MAX` affordable/owned shares calculation button.
- **Live Unrealized P&L Tracking**: Continuous calculation of average buy price, current market value, and unrealized gain/loss ($ and %).
- **Audited Order History**: Complete transactional ledger capturing timestamp, ticker, side (BUY/SELL), order type, price, total value, and fill status.

### 3. ⚡ Market Pulse & Real-Time Simulation
- **NYSE Live Clock**: Synchronized New York market status and time display (EDT).
- **Stochastic Micro-Tick Generator**: Simulates live market microstructure every 2.5 seconds with visual green/red price flash animations and continuous DOM updates.
- **Real-Time Market Statistics**: Comprehensive fundamental and intraday stats for each stock:
  - 52-Week High & Low
  - Market Capitalization & P/E Ratio (TTM)
  - Day Volume & 30-Day Average Volume
  - Day Open & Day Range
  - Beta & Dividend Yield

### 4. 🔍 Instant Search & Watchlist
- **Global Search (`/` Shortcut)**: Press `/` anywhere to focus the ticker search and query companies by symbol or company name.
- **Watchlist Grid**: Instant overview of supported equities with live mini-quotes and daily delta percentages.
- **Quick-Trade Actions**: Click any ticker in the watchlist or holdings table to immediately load the asset and populate the order execution card.

### 5. 🎨 FinTech Dark Design System
- **Optimized Typography**: Built on Google Fonts' *Inter* with tabular numeral alignments (`tnum`) to eliminate layout shifts during high-frequency price updates.
- **Zero-Dependency Architecture**: No bloated frameworks, build steps, npm packages, or external runtime libraries.
- **Toast Notification Center**: Animated visual feedback for filled orders, execution rejections, and portfolio resets.
- **Fully Responsive**: Adaptive flexbox and grid layouts crafted for ultrawide monitors, laptops, tablets, and mobile devices.

---

## 🏛️ Stock Universe

ApexTrader comes pre-configured with top market equities:

| Symbol | Company Name | Sector / Category |
| :--- | :--- | :--- |
| **NVDA** | NVIDIA Corporation | Semiconductors & AI Hardware (Mega Cap) |
| **AAPL** | Apple Inc. | Consumer Electronics & Ecosystem (Mega Cap) |
| **TSLA** | Tesla, Inc. | Automotive & Clean Energy (Mega Cap) |
| **MSFT** | Microsoft Corporation | Enterprise Software & Cloud Infrastructure |
| **AMZN** | Amazon.com, Inc. | E-Commerce & Cloud Computing (AWS) |
| **GOOGL** | Alphabet Inc. (Google) | Internet Search & Digital Media |
| **META** | Meta Platforms, Inc. | Social Media & Artificial Intelligence |
| **AMD** | Advanced Micro Devices | Semiconductors & High-Performance Computing |

---

## 📁 Project Structure

```
Paper Trading & Stock Dashboard/
├── index.html       # Semantic HTML5 layout, accessible widgets, and HUDs
├── styles.css       # FinTech design system, CSS variables, dark theme & animations
├── script.js        # Core engine: market state, canvas chart, order execution & simulation
└── README.md        # Comprehensive documentation and project guide
```

### Component Breakdown

- **`index.html`**
  - **Top Navigation**: Brand header, market status indicator, search bar, and live KPI ribbon (Cash, Total Portfolio Value, Overall P&L).
  - **Main Trading Zone**: Active ticker header, canvas charting stage, key statistics grid, and bottom tabbed tables (Holdings, History, Watchlist).
  - **Order Execution Sidebar**: Buy/Sell side toggle, order type selector, quantity steppers, cost calculator breakdown, and order execution trigger.
  - **Notification Portal**: Floating toast container for trade execution alerts.

- **`styles.css`**
  - Custom CSS variables (`:root`) defining color tokens, glassmorphism surfaces, glow effects, borders, and transitions.
  - Reset, responsive layout containers, tabular number formatting, table styles, and scrollbar styling.

- **`script.js`**
  - **`STOCKS_DB`**: Central equity database holding fundamentals, seed pricing, and metrics.
  - **`generateChartData()`**: Deterministic random-walk algorithm producing realistic multi-timeframe price curves and OHLC candlestick series.
  - **`drawStockChart()`**: Custom 2D canvas drawing routine with Bezier curve smoothing, gradients, wicks, and interactive crosshair hover HUD.
  - **`executeTrade()`**: Transaction processor managing cash balance, weighted average price calculations, and trade logging.
  - **`initLiveMarketSimulation()`**: Interval-driven ticker simulation updating active quotes and synchronizing portfolio values.

---

## 🚀 Quick Start

ApexTrader runs entirely in the browser with **zero installation or build steps** required.

### Method 1: Direct File Launch
Simply double-click [`index.html`](file:///d:/Paper%20Trading%20&%20Stock%20Dashboard/index.html) or open it directly in any modern browser (Chrome, Firefox, Edge, Safari, Brave).

### Method 2: Local Static Web Server

If you prefer running through a local development server:

#### Using Python 3:
```bash
python -m http.server 3000
```
Then visit `http://localhost:3000` in your browser.

#### Using Node.js (`npx serve`):
```bash
npx serve .
```

#### Using VS Code:
Install the **Live Server** extension, right-click [`index.html`](file:///d:/Paper%20Trading%20&%20Stock%20Dashboard/index.html), and click **"Open with Live Server"**.

---

## ⌨️ Keyboard Shortcuts & Pro Tips

| Action / Shortcut | Description |
| :--- | :--- |
| <kbd>/</kbd> | Instantly focus the global ticker search bar. |
| **Click on Any Stock Row** | Instantly switches the active chart and order card to that equity. |
| **Sell / Trade Button** | Automatically switches the order card to `SELL`, loads the position, and sets quantity to owned shares. |
| **`MAX` Button** | Calculates the maximum number of shares you can afford to BUY, or all shares available to SELL. |
| **Chart Hover** | Move cursor over the chart canvas to inspect price, time, and period return at any data point. |
| **Reset Icon (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path></svg>)** | Located in top header to restore initial $100,000 cash balance and default seed positions. |

---

## 🛠️ Customization & Extensibility

### Adding New Stocks
To add a new ticker to the platform, open [`script.js`](file:///d:/Paper%20Trading%20&%20Stock%20Dashboard/script.js) and append your asset to `STOCKS_DB`:

```javascript
// Example: Adding SPY (S&P 500 ETF Trust)
STOCKS_DB.SPY = {
  symbol: 'SPY',
  name: 'SPDR S&P 500 ETF Trust',
  exchange: 'NYSE Arca',
  sector: 'Index ETF • Large Cap',
  currentPrice: 550.25,
  prevClose: 548.10,
  openPrice: 549.00,
  dayHigh: 551.40,
  dayLow: 547.80,
  fiftyTwoHigh: 555.00,
  fiftyTwoLow: 410.00,
  marketCap: '$560.0B',
  peRatio: '26.8x',
  dayVolume: '62.4M',
  avgVolume: '58.1M',
  beta: '1.00',
  divYield: '1.24%'
};
```

### Adjusting Initial Cash & Seed Portfolio
Modify the `INITIAL_STATE` constant in [`script.js`](file:///d:/Paper%20Trading%20&%20Stock%20Dashboard/script.js#L172):

```javascript
const INITIAL_STATE = {
  cash: 250000.00, // Custom starting cash
  holdings: [
    // Define initial positions or leave empty []
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
```

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute for educational, personal, or commercial purposes.
