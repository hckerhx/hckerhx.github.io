const SETTINGS_KEY = 'tracker-settings';
const TICKERS_KEY = 'tracker-tickers';
const LANG_KEY = 'tracker-language';

const ALERT_COOLDOWN_DAYS = 3;
const REFRESH_INTERVAL_MINUTES = 30;
const DEFAULT_OBSERVATION_MONTHS = 2;
const DEFAULT_DROP_THRESHOLD = 20;

const translations = {
    zh: {
        htmlLang: 'zh-CN',
        documentTitle: '策略实验室 - 下跌监控',
        nav: { monitor: '下跌监控', theory: '策略理论' },
        panel: { title: '下跌监控', locale: '简单直观的策略辅助工具' },
        ticker: { placeholder: '输入代码 (如 AAPL)', example: '支持美股与港股' },
        controls: { observationTitle: '观测时间 (月)', thresholdTitle: '买入阈值 (%)', emailLabel: '提醒邮箱' },
        buttons: { save: '保存设置', refreshAll: '刷新数据' },
        status: {
            saved: '已保存设置。',
            batchStart: '正在刷新...',
            batchDone: '刷新完成。',
            refreshing: symbol => `正在获取 ${symbol}...`,
            updated: (symbol, percent) => `已更新 ${symbol}，回撤 ${percent}`,
            duplicate: symbol => `${symbol} 已在列表中。`,
            invalidSymbol: '请输入有效的代码。',
            notFound: '未找到该股票。',
            networkError: '网络错误。',
            unknownError: '发生错误。',
            lastUpdated: time => `更新于 ${time}`
        },
        chart: {
            emptyTitle: '价格走势',
            title: symbol => `${symbol} 价格走势`,
            subtitle: (months, threshold) => `近 ${months} 个月 · 阈值 ${threshold}%`,
            placeholder: '输入代码或点击下方标签查看走势',
            noData: '暂无数据'
        }
    },
    en: {
        htmlLang: 'en',
        documentTitle: 'Strategy Lab - Monitor',
        nav: { monitor: 'Drawdown Monitor', theory: 'Strategy Theory' },
        panel: { title: 'Drawdown Monitor', locale: 'Simple Strategy Tool' },
        ticker: { placeholder: 'Enter Ticker (e.g. AAPL)', example: 'Supports US & HK Stocks' },
        controls: { observationTitle: 'Lookback (Months)', thresholdTitle: 'Threshold (%)', emailLabel: 'Alert Email' },
        buttons: { save: 'Save Settings', refreshAll: 'Refresh Data' },
        status: {
            saved: 'Settings saved.',
            batchStart: 'Refreshing...',
            batchDone: 'Refresh complete.',
            refreshing: symbol => `Fetching ${symbol}...`,
            updated: (symbol, percent) => `Updated ${symbol}, Drawdown ${percent}`,
            duplicate: symbol => `${symbol} already exists.`,
            invalidSymbol: 'Invalid ticker.',
            notFound: 'Ticker not found.',
            networkError: 'Network error.',
            unknownError: 'Error occurred.',
            lastUpdated: time => `Updated: ${time}`
        },
        chart: {
            emptyTitle: 'Price Trend',
            title: symbol => `${symbol} Price Trend`,
            subtitle: (months, threshold) => `${months} Mo Lookback · ${threshold}% Threshold`,
            placeholder: 'Enter ticker or click tag to view',
            noData: 'No Data'
        }
    }
};

// DOM Elements
const languageButtons = document.querySelectorAll('.lang-button');
const navMonitor = document.getElementById('navMonitor');
const navTheory = document.getElementById('navTheory');
const panelTitle = document.getElementById('panelTitle');
const heroSubtitle = document.getElementById('heroSubtitle');
const newTickerInput = document.getElementById('newTickerInput');
const tickerList = document.getElementById('tickerList');
const tickerExample = document.getElementById('tickerExample');
const observationInput = document.getElementById('observationMonths');
const thresholdInput = document.getElementById('dropThreshold');
const emailInput = document.getElementById('alertEmail');
const savePreferencesButton = document.getElementById('savePreferences');
const refreshAllButton = document.getElementById('refreshAll');
const statusBanner = document.getElementById('statusBanner');
const chartTitleEl = document.getElementById('chartTitle');
const chartSubtitleEl = document.getElementById('chartSubtitle');
const priceChartCanvas = document.getElementById('priceChart');
const chartPlaceholder = document.getElementById('chartPlaceholder');
const serviceIdInput = document.getElementById('serviceId');
const templateIdInput = document.getElementById('templateId');
const publicKeyInput = document.getElementById('publicKey');

// State
let currentLang = loadLanguage();
let settings = loadSettings();
let tickers = loadTickers();
let priceChart;
let activeSymbol = tickers[0]?.symbol || null;

init();

function init() {
    applyLanguage(currentLang);
    renderSettings();
    renderTickerTags();
    if (activeSymbol) {
        renderChart();
    }
    initEventListeners();
}

function loadLanguage() {
    const stored = window.localStorage.getItem(LANG_KEY);
    return stored && translations[stored] ? stored : 'zh';
}

function saveLanguage(lang) {
    window.localStorage.setItem(LANG_KEY, lang);
}

function loadSettings() {
    try {
        const raw = window.localStorage.getItem(SETTINGS_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        return {
            observationMonths: parsed.observationMonths || DEFAULT_OBSERVATION_MONTHS,
            dropThreshold: parsed.dropThreshold || DEFAULT_DROP_THRESHOLD,
            email: {
                serviceId: parsed.email?.serviceId || '',
                templateId: parsed.email?.templateId || '',
                publicKey: parsed.email?.publicKey || '',
                toEmail: parsed.email?.toEmail || ''
            }
        };
    } catch {
        return {
            observationMonths: DEFAULT_OBSERVATION_MONTHS,
            dropThreshold: DEFAULT_DROP_THRESHOLD,
            email: { serviceId: '', templateId: '', publicKey: '', toEmail: '' }
        };
    }
}

function saveSettings() {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function loadTickers() {
    try {
        const raw = window.localStorage.getItem(TICKERS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveTickers() {
    window.localStorage.setItem(TICKERS_KEY, JSON.stringify(tickers));
}

function initEventListeners() {
    languageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (lang !== currentLang) {
                currentLang = lang;
                saveLanguage(lang);
                applyLanguage(lang);
                renderTickerTags(); // Re-render to update any lang-dependent UI if we had any in tags
                renderChart();
            }
        });
    });

    if (newTickerInput) {
        newTickerInput.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                addTicker(newTickerInput.value);
            }
        });
    }

    if (savePreferencesButton) {
        savePreferencesButton.addEventListener('click', () => {
            settings.observationMonths = parseInt(observationInput.value, 10);
            settings.dropThreshold = parseInt(thresholdInput.value, 10);
            settings.email.toEmail = emailInput.value.trim();
            settings.email.serviceId = serviceIdInput.value.trim();
            settings.email.templateId = templateIdInput.value.trim();
            settings.email.publicKey = publicKeyInput.value.trim();
            saveSettings();
            showStatus(translations[currentLang].status.saved, 'success');
            renderChart(); // threshold/months might change
        });
    }

    if (refreshAllButton) {
        refreshAllButton.addEventListener('click', refreshAllTickers);
    }
}

function applyLanguage(lang) {
    const t = translations[lang];
    document.title = t.documentTitle;

    // Switcher UI
    languageButtons.forEach(b => b.classList.toggle('active', b.dataset.lang === lang));

    if (navMonitor) navMonitor.textContent = t.nav.monitor;
    if (navTheory) navTheory.textContent = t.nav.theory;
    if (panelTitle) panelTitle.textContent = t.panel.title;
    if (heroSubtitle) heroSubtitle.textContent = t.panel.locale;
    if (newTickerInput) newTickerInput.placeholder = t.ticker.placeholder;
    if (tickerExample) tickerExample.textContent = t.ticker.example;

    document.getElementById('observationTitle').textContent = t.controls.observationTitle;
    document.getElementById('thresholdTitle').textContent = t.controls.thresholdTitle;
    document.getElementById('emailLabel').textContent = t.controls.emailLabel;

    savePreferencesButton.textContent = t.buttons.save;
    refreshAllButton.textContent = t.buttons.refreshAll;
}

function renderSettings() {
    observationInput.value = settings.observationMonths;
    thresholdInput.value = settings.dropThreshold;
    emailInput.value = settings.email.toEmail;
    serviceIdInput.value = settings.email.serviceId;
    templateIdInput.value = settings.email.templateId;
    publicKeyInput.value = settings.email.publicKey;
}

// --- Ticker Logic ---

async function addTicker(inputVal) {
    const symbol = inputVal.trim().toUpperCase();
    if (!symbol) return;

    if (tickers.some(t => t.symbol === symbol)) {
        showStatus(translations[currentLang].status.duplicate(symbol), 'error');
        newTickerInput.value = '';
        return;
    }

    showStatus(translations[currentLang].status.refreshing(symbol));
    try {
        // Here we would normally call API. For this UI refactor demo, we mock or allow logic to proceed.
        // Assuming updateTicker fetches data.
        await updateTicker(symbol);
        newTickerInput.value = '';
        renderTickerTags();
        activeSymbol = symbol;
        renderChart();
    } catch (e) {
        console.error(e);
        showStatus(translations[currentLang].status.notFound, 'error');
    }
}

function renderTickerTags() {
    tickerList.innerHTML = '';
    tickers.forEach(t => {
        const tag = document.createElement('div');
        tag.className = `history-tag ${t.symbol === activeSymbol ? 'active' : ''}`;
        tag.innerHTML = `${t.symbol} <span class="remove-btn">×</span>`; // using innerHTML for simplicity

        // Tag Click -> Select
        tag.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-btn')) {
                removeTicker(t.symbol);
            } else {
                activeSymbol = t.symbol;
                renderTickerTags(); // Re-render to update active class
                renderChart();
            }
        });

        tickerList.appendChild(tag);
    });
}

function removeTicker(symbol) {
    tickers = tickers.filter(t => t.symbol !== symbol);
    saveTickers();
    if (activeSymbol === symbol) {
        activeSymbol = tickers[0]?.symbol || null;
    }
    renderTickerTags();
    renderChart();
}

// --- Chart Logic ---

function renderChart() {
    if (!priceChartCanvas) return;

    const t = translations[currentLang];
    const threshold = settings.dropThreshold;
    const months = settings.observationMonths;

    if (chartSubtitleEl) chartSubtitleEl.textContent = t.chart.subtitle(months, threshold);

    if (!activeSymbol) {
        chartTitleEl.textContent = t.chart.emptyTitle;
        chartPlaceholder.textContent = t.chart.placeholder;
        chartPlaceholder.classList.remove('hidden');
        priceChartCanvas.classList.add('hidden');
        if (priceChart) priceChart.destroy();
        return;
    }

    chartTitleEl.textContent = t.chart.title(activeSymbol);
    const tickerData = tickers.find(item => item.symbol === activeSymbol);

    // If no history data (yet), show placeholder
    if (!tickerData || !tickerData.history || tickerData.history.length === 0) {
        chartPlaceholder.textContent = t.chart.noData;
        chartPlaceholder.classList.remove('hidden');
        priceChartCanvas.classList.add('hidden');
        if (priceChart) priceChart.destroy();
        return;
    }

    chartPlaceholder.classList.add('hidden');
    priceChartCanvas.classList.remove('hidden');

    // Prepare data for Chart.js
    const ctx = priceChartCanvas.getContext('2d');
    if (priceChart) priceChart.destroy();

    // Simplify chart data prep for this demo
    // Assuming history is array of {date, close}
    const history = tickerData.history.map(h => ({ x: new Date(h.date).getTime(), y: h.close }));
    history.sort((a, b) => a.x - b.x);

    // Limit to observation window if needed, or just show all history available
    // For visual correctness, let's just slice last N points roughly

    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: t.chart.tooltipPrice,
                data: history,
                borderColor: '#1e1e1e', // Sketchy black line
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.1, // rougher lines
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: { unit: 'month' },
                    grid: { display: false } // clean look
                },
                y: {
                    grid: { borderDash: [5, 5] } // sketchy grid
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// --- Real Yahoo Finance API Logic ---

async function fetchStockHistory(symbol) {
    // Yahoo Finance Chart API (public endpoint)
    // We request 1 year of data with daily intervals
    // Use a CORS proxy to bypass browser restrictions
    // Note: In a production backend, you would proxy this yourself.
    const symbolClean = symbol.toUpperCase().replace(/\.HK$/, ''); // Handle HK suffix if needed, though YF uses .HK
    const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1y&interval=1d`;
    const url = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Yahoo API limit or network error: ${response.status}`);
    }

    const json = await response.json();
    const result = json.chart.result[0];

    if (!result || !result.timestamp || !result.indicators.quote[0]) {
        throw new Error('Invalid data structure from Yahoo');
    }

    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];
    const closes = quotes.close;

    const history = [];
    for (let i = 0; i < timestamps.length; i++) {
        if (timestamps[i] && closes[i] !== null) {
            history.push({
                date: new Date(timestamps[i] * 1000).toISOString(),
                close: closes[i]
            });
        }
    }

    return history;
}

async function updateTicker(symbol) {
    // Fetch real history
    let history = [];
    try {
        history = await fetchStockHistory(symbol);
    } catch (e) {
        console.warn(`Direct fetch failed for ${symbol}, trying fallback/proxy if available...`, e);
        // Fallback or re-throw? For visible UI feedback, re-throw so the user sees "Network error"
        throw e;
    }

    if (history.length === 0) {
        throw new Error('No history data found');
    }

    const latestPrice = history[history.length - 1].close;

    // Calculate Drop from 1-Year High (or window high)
    // We use the full fetched history (1 year) for the "Highest" reference usually
    const maxPrice = Math.max(...history.map(h => h.close));
    const dropPercent = ((maxPrice - latestPrice) / maxPrice) * 100;

    const now = new Date();
    const existingIndex = tickers.findIndex(t => t.symbol === symbol);

    const newTicker = {
        symbol,
        latestPrice,
        dropPercent,
        history, // Store full history for chart
        lastUpdated: now.toISOString()
    };

    if (existingIndex >= 0) {
        tickers[existingIndex] = newTicker;
    } else {
        tickers.push(newTicker);
    }
    saveTickers();
}

async function refreshAllTickers() {
    showStatus(translations[currentLang].status.batchStart);
    for (const t of tickers) {
        try {
            await updateTicker(t.symbol);
        } catch { }
    }
    saveTickers();
    renderTickerTags();
    renderChart();
    showStatus(translations[currentLang].status.batchDone, 'success');
}

function showStatus(msg, type = 'info') {
    if (!statusBanner) return;
    statusBanner.textContent = msg;
    statusBanner.dataset.status = type;
    setTimeout(() => {
        statusBanner.textContent = '';
        statusBanner.dataset.status = '';
    }, 5000);
}
