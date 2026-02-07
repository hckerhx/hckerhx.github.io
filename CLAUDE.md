# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tactical Drawdown Strategy Lab - a static web application for visualizing "buy-the-dip" investment strategies focused on Mag 7 tech stocks (AAPL, MSFT, GOOGL, AMZN, NVDA, META, TSLA). Features real-time drawdown monitoring and email alerts.

## Development

This is a zero-build static site. No npm, no bundler, no build step.

**Local development:**
```bash
# Simply open in browser
open index.html

# Or use any static server
python -m http.server 8000
```

**Deployment:** Push to `main` branch deploys via GitHub Pages/Vercel.

## Architecture

### Two-Page Structure

- **index.html + tracker.js** - Real-time drawdown monitor
  - Fetches live stock data from Yahoo Finance API (via CORS proxy api.allorigins.win)
  - Renders price charts with Chart.js
  - Triggers email alerts via EmailJS when drawdown thresholds are hit

- **theory.html + theory.js** - Strategy theory and backtesting
  - Historical performance data (2010-2024)
  - Investment planner with batch-buy calculations
  - Live portfolio comparison (Mag 7 vs SPY/QQQ)

### Key Patterns

**State Management:** All state lives in localStorage
- `settings` - Alert configuration, thresholds, email credentials
- `tickers` - Tracked stock symbols
- `currentLang` - Language preference (zh/en)

**i18n:** Bilingual Chinese/English support
- Translation objects in JS files
- `data-i18n` attributes on HTML elements
- Language preference persisted to localStorage

**API Calls:** Yahoo Finance via CORS proxy
```javascript
// Pattern used throughout
const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(yahooUrl)}`;
```

**UI Style:** Excalidraw-inspired handwritten aesthetic using Patrick Hand font and irregular border-radius values for sketchy appearance.

### Key Constants (tracker.js)

```javascript
ALERT_COOLDOWN_DAYS = 3      // Email spam prevention
REFRESH_INTERVAL_MINUTES = 30 // Live data refresh
DEFAULT_OBSERVATION_MONTHS = 6
DEFAULT_DROP_THRESHOLD = 20   // Drawdown percentage
M7_TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA']
```

## File Purposes

| File | Purpose |
|------|---------|
| js/tracker.js | Monitor page: API fetching, Chart.js rendering, EmailJS alerts |
| js/theory.js | Theory page: Historical data, investment calculations, live metrics |
| css/style.css | Global Excalidraw-style theming |
