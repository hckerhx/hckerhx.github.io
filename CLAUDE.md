# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tactical Drawdown Strategy Lab - a bilingual (Chinese/English) static web application for visualizing "buy-the-dip" investment strategies focused on Mag 7 tech stocks. Features real-time drawdown monitoring, Chart.js visualizations, and email alerts via Resend (Vercel serverless).

## Development

Zero-build static site. No bundler, no build step. Has `package.json` only for the QA test runner (`puppeteer-core`).

### Local Run Modes

| Mode | Command | Email API | Yahoo API |
|---|---|---|---|
| Static (file) | `open index.html` | Simulated (console) | CORS proxy only |
| Static (HTTP) | `python -m http.server 8000` | Simulated (console) | CORS proxy only |
| Full Vercel | `vercel dev` | Live (Resend) | `/api/yahoo` + CORS proxy fallback |

### QA Test Runner

```bash
CHROME_PATH=/path/to/chrome node test-agent.mjs   # Puppeteer-based automated QA
```

Requires `puppeteer-core` (`npm install`) and Chrome/Chromium. Set `CHROME_PATH` env var if Chrome is not at the default macOS location.

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

**Data Fetching:** Both pages try the first-party Vercel `/api/yahoo` route first, then fall back to `api.allorigins.win` CORS proxy for local dev.
```javascript
// tracker.js: /api/yahoo -> allorigins fallback (v8/chart, historical data)
// theory.js: allorigins proxy (v7/quote, live quotes)
```

**State Management:** All state in localStorage under these keys:
- `tracker-settings` - Observation months, drop threshold, alert email address
- `tracker-tickers` - Array of tracked symbols with history/price data
- `tracker-language` - Language preference (`zh`/`en`), defaults to `zh`

**i18n:** Each JS file has its own `translations` object with `zh`/`en` keys. theory.html uses `data-i18n` attributes for static text; index.html translates imperatively in `applyLanguage()`. Both pages persist language to the same `tracker-language` localStorage key.

**Anti-FOUC:** Both pages start `<body class="js-loading">` (opacity: 0) and remove it after `init()` completes.

**UI Style:** Excalidraw-inspired aesthetic via Patrick Hand font and irregular `border-radius` values (e.g., `255px 15px 225px 15px / 15px 225px 15px 255px`). CSS vars `--sketch-border` and `--sketch-radius` define the theme.

### Key Constants

```javascript
// tracker.js
ALERT_COOLDOWN_DAYS = 3        // Email spam prevention
DEFAULT_OBSERVATION_MONTHS = 6
DEFAULT_DROP_THRESHOLD = 20    // Drawdown percentage trigger
M7_TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA']

// theory.js
yahooConfig.refreshMs = 5 * 60 * 1000  // Live quote refresh (5 min)
```

### External Dependencies (CDN only)

- Chart.js + chartjs-adapter-date-fns (charting)
- Patrick Hand font (Google Fonts)

### Vercel Serverless API Routes

| Route | Purpose |
|---|---|
| `/api/yahoo.js` | Proxies Yahoo Finance API requests |
| `/api/send-alert.js` | Sends email alerts via Resend API (requires `RESEND_API_KEY` env var) |

### Email (Resend) Gotchas

- **`from` address uses `onboarding@resend.dev`** (Resend test domain) — can ONLY deliver to the account owner's email (`hangzuoxiang@gmail.com`). Sending to other recipients returns 403. To send to arbitrary addresses, verify a custom domain at resend.com/domains and update the `from` field in `api/send-alert.js`.
- **Test endpoint:** `curl -X POST https://sdmr-liard-zeta.vercel.app/api/send-alert -H "Content-Type: application/json" -d '{"type":"welcome","to_email":"hangzuoxiang@gmail.com","observation_months":6,"threshold":20}'`
- **Alert cooldown:** 3-day per-ticker cooldown in `checkAlerts()` — alerts are silently suppressed during cooldown.

## Guardrails

**i18n:** Every user-facing string must go in the `translations` object (`zh`/`en`). No hardcoded UI text in HTML or JS. Both pages share the same `tracker-language` localStorage key.

**Security:** Do not add new third-party data proxies in production paths; prefer first-party `/api/yahoo` Vercel route. The email API (`/api/send-alert`) must validate all inputs server-side (symbol format, numeric ranges, email format) and check `Origin`/`Referer` headers.

**API Detection:** `hasServerAPI()` in `tracker.js` must only return `true` when the Vercel API is actually available (currently checks known Vercel hostnames). Do not assume all HTTP hosts have `/api` routes.
