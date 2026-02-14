# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tactical Drawdown Strategy Lab - a bilingual (Chinese/English) static web application for visualizing "buy-the-dip" investment strategies focused on Mag 7 tech stocks. Features real-time drawdown monitoring, Chart.js visualizations, and email alerts via EmailJS.

## Development

Zero-build static site. No npm, no bundler, no build step.

```bash
open index.html                # or
python -m http.server 8000     # for CORS proxy to work properly
```

**Deployment:** Push to `main` deploys via Vercel. The repo also has GitHub Pages configured (hckerhx.github.io).

## Architecture

### Page Structure

| Entry Point | JS | Purpose |
|---|---|---|
| `index.html` | `js/tracker.js` | Real-time drawdown monitor - fetches Yahoo Finance data via CORS proxy, renders price charts, triggers email alerts |
| `theory.html` | `js/theory.js` | Strategy theory - historical backtesting (2010-2024), investment planner, live Mag 7 vs SPY/QQQ comparison |
| `tracker.html` | - | Legacy redirect to `index.html` (meta refresh) |
| `css/style.css` | - | Global Excalidraw-style theming |

### Key Patterns

**CORS Proxy:** Both pages use `api.allorigins.win` to bypass CORS for Yahoo Finance API.
```javascript
// tracker.js uses v8/chart endpoint for historical data
const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(
  `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1y&interval=1d`
)}`;
// theory.js uses v7/quote endpoint for live quotes (without proxy currently)
```

**State Management:** All state in localStorage under these keys:
- `tracker-settings` - Observation months, drop threshold, EmailJS credentials
- `tracker-tickers` - Array of tracked symbols with history/price data
- `tracker-language` - Language preference (`zh`/`en`), defaults to `zh`

**i18n:** Each JS file has its own `translations` object with `zh`/`en` keys. theory.html uses `data-i18n` attributes for static text; index.html translates imperatively in `applyLanguage()`. Both pages persist language to the same `tracker-language` localStorage key.

**Anti-FOUC:** Both pages start `<body class="js-loading">` (opacity: 0) and remove it after `init()` completes.

**UI Style:** Excalidraw-inspired aesthetic via Patrick Hand font and irregular `border-radius` values (e.g., `255px 15px 225px 15px / 15px 225px 15px 255px`). CSS vars `--sketch-border` and `--sketch-radius` define the theme.

### Key Constants

```javascript
// tracker.js
ALERT_COOLDOWN_DAYS = 3        // Email spam prevention
REFRESH_INTERVAL_MINUTES = 30  // Live data refresh
DEFAULT_OBSERVATION_MONTHS = 6
DEFAULT_DROP_THRESHOLD = 20    // Drawdown percentage trigger
M7_TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA']

// theory.js
yahooConfig.refreshMs = 5 * 60 * 1000  // Live quote refresh (5 min)
```

### External Dependencies (CDN only)

- Chart.js + chartjs-adapter-date-fns (charting)
- EmailJS SDK (email alerts, index.html only)
- Patrick Hand font (Google Fonts)
