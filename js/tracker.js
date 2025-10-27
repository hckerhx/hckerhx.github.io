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
        languageSwitcherAria: '语言切换',
        nav: {
            aria: '页面导航',
            monitor: '下跌监控',
            theory: '策略理论'
        },
        panel: {
            title: '下跌监控',
            theory: '策略理论',
            locale: '中 / 英'
        },
        ticker: {
            label: '股票代码：',
            helper: '例如：AAPL、MSFT、0700.HK',
            placeholder: '输入股票代码',
            addAria: '添加股票'
        },
        controls: {
            observationTitle: '观测时间',
            observationHelper: '默认 2 个月',
            observationUnit: '个月',
            thresholdTitle: '幅度控制',
            thresholdHelper: '默认 20%'
        },
        email: {
            label: '邮箱',
            placeholder: 'you@example.com'
        },
        buttons: {
            save: '保存设置',
            refreshAll: '刷新全部',
            refresh: '刷新',
            remove: '移除'
        },
        advanced: {
            summary: '提醒服务配置',
            serviceIdLabel: 'EmailJS Service ID',
            templateIdLabel: 'EmailJS Template ID',
            publicKeyLabel: 'EmailJS Public Key'
        },
        status: {
            saved: '已保存设置。',
            batchStart: '正在刷新全部监控股票…',
            batchDone: '全部股票已刷新。',
            refreshing: symbol => `正在获取 ${symbol} 数据…`,
            updated: (symbol, percent) => `已更新 ${symbol}，当前回撤 ${percent}`,
            removed: symbol => `已移除 ${symbol}`,
            duplicate: symbol => `${symbol} 已在监控列表中。`,
            invalidSymbol: '请输入有效的股票代码。',
            notFound: '未从 Yahoo Finance 找到该股票。',
            noData: '暂未获取到该股票的历史价格。',
            networkError: '网络请求失败，请检查网络连接。',
            unknownError: '获取数据时出现问题，请稍后重试。',
            emailSent: email => `已向 ${email} 发送深跌提醒。`,
            emailFailed: '邮件发送失败，请检查 EmailJS 设置。',
            lastUpdated: time => `最近刷新：${time}`,
            neverUpdated: '尚未刷新数据。'
        },
        results: {
            statusLabel: '状态',
            triggered: '已触发提醒',
            normal: '未触发',
            latest: '最新收盘',
            highest: '期间最高',
            highestDate: '最高点日期',
            updated: '最近更新',
            drop: '回撤'
        },
        chart: {
            emptyTitle: '价格走势',
            title: symbol => `${symbol} 过去一年价格`,
            subtitle: (months, threshold) => `观测时间：${months}个月 · 幅度控制：${threshold}%`,
            placeholder: '添加股票后将在此显示价格图。',
            noData: '暂无足够的历史数据用于绘制图表。',
            tooltipPrice: '收盘价',
            tooltipThreshold: '触发阈值'
        },
        emptyState: '请先添加股票代码。',
        footerNote: '示例项目仅用于策略演示，不构成投资建议。'
    },
    en: {
        htmlLang: 'en',
        documentTitle: 'Strategy Lab - Drawdown Monitor',
        languageSwitcherAria: 'Language toggle',
        nav: {
            aria: 'Site navigation',
            monitor: 'Drawdown Monitor',
            theory: 'Strategy Theory'
        },
        panel: {
            title: 'Drawdown Monitor',
            theory: 'Strategy Theory',
            locale: 'CN / EN'
        },
        ticker: {
            label: 'Tickers:',
            helper: 'Examples: AAPL, MSFT, 0700.HK',
            placeholder: 'Enter a ticker',
            addAria: 'Add ticker'
        },
        controls: {
            observationTitle: 'Lookback Window',
            observationHelper: 'Default 2 months',
            observationUnit: 'months',
            thresholdTitle: 'Drawdown Trigger',
            thresholdHelper: 'Default 20%'
        },
        email: {
            label: 'Email',
            placeholder: 'you@example.com'
        },
        buttons: {
            save: 'Save settings',
            refreshAll: 'Refresh all',
            refresh: 'Refresh',
            remove: 'Remove'
        },
        advanced: {
            summary: 'Alert & Email setup',
            serviceIdLabel: 'EmailJS Service ID',
            templateIdLabel: 'EmailJS Template ID',
            publicKeyLabel: 'EmailJS Public Key'
        },
        status: {
            saved: 'Preferences saved.',
            batchStart: 'Refreshing all tracked tickers…',
            batchDone: 'All tickers refreshed.',
            refreshing: symbol => `Fetching ${symbol}…`,
            updated: (symbol, percent) => `${symbol} updated, drawdown ${percent}`,
            removed: symbol => `${symbol} removed`,
            duplicate: symbol => `${symbol} is already being monitored.`,
            invalidSymbol: 'Please enter a valid ticker.',
            notFound: 'Ticker not found on Yahoo Finance.',
            noData: 'No recent price history is available for this ticker.',
            networkError: 'Network error. Please retry in a moment.',
            unknownError: 'Something went wrong while fetching data. Please retry later.',
            emailSent: email => `Alert email sent to ${email}.`,
            emailFailed: 'Unable to send email. Please verify EmailJS settings.',
            lastUpdated: time => `Last updated: ${time}`,
            neverUpdated: 'Not refreshed yet.'
        },
        results: {
            statusLabel: 'Status',
            triggered: 'Triggered',
            normal: 'Normal',
            latest: 'Latest Close',
            highest: 'Window High',
            highestDate: 'High Date',
            updated: 'Updated At',
            drop: 'Drawdown'
        },
        chart: {
            emptyTitle: 'Price trend',
            title: symbol => `${symbol} price — last 12 months`,
            subtitle: (months, threshold) => `Window: ${months} mo · Trigger: ${threshold}%`,
            placeholder: 'Add a ticker to see its price chart here.',
            noData: 'Not enough historical data to display the chart.',
            tooltipPrice: 'Close',
            tooltipThreshold: 'Threshold breach'
        },
        emptyState: 'Add tickers to start monitoring.',
        footerNote: 'For illustration only. Not investment advice.'
    }
};

const languageButtons = document.querySelectorAll('.lang-button');
const navMonitor = document.getElementById('navMonitor');
const navTheory = document.getElementById('navTheory');
const panelTitle = document.getElementById('panelTitle');
const panelLocale = document.getElementById('panelLocale');
const tickerLabel = document.getElementById('tickerLabel');
const tickerHelper = document.getElementById('tickerExample');
const addTickerButton = document.getElementById('addTicker');
const tickerList = document.getElementById('tickerList');
const observationInput = document.getElementById('observationMonths');
const thresholdInput = document.getElementById('dropThreshold');
const emailInput = document.getElementById('alertEmail');
const savePreferencesButton = document.getElementById('savePreferences');
const refreshAllButton = document.getElementById('refreshAll');
const statusBanner = document.getElementById('statusBanner');
const lastUpdated = document.getElementById('lastUpdated');
const resultsContainer = document.getElementById('resultsContainer');
const emptyState = document.getElementById('emptyState');
const chartCard = document.getElementById('chartCard');
const chartTitleEl = document.getElementById('chartTitle');
const chartSubtitleEl = document.getElementById('chartSubtitle');
const priceChartCanvas = document.getElementById('priceChart');
const chartPlaceholder = document.getElementById('chartPlaceholder');
const advancedSummary = document.getElementById('advancedSummary');
const serviceIdLabel = document.getElementById('serviceIdLabel');
const serviceIdInput = document.getElementById('serviceId');
const templateIdLabel = document.getElementById('templateIdLabel');
const templateIdInput = document.getElementById('templateId');
const publicKeyLabel = document.getElementById('publicKeyLabel');
const publicKeyInput = document.getElementById('publicKey');
const footerNote = document.getElementById('footerNote');

let currentLang = loadLanguage();
let settings = loadSettings();
let tickers = loadTickers();
let emailInitialized = false;
let refreshTimer;
let priceChart;
let activeSymbol = tickers[0]?.symbol || null;

init();

function init() {
    applyLanguage(currentLang);
    renderSettings();
    renderTickerInputs();
    renderResults();
    scheduleAutoRefresh();
    setUpdatedTime();
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
        if (!raw) {
            return {
                observationMonths: DEFAULT_OBSERVATION_MONTHS,
                dropThreshold: DEFAULT_DROP_THRESHOLD,
                email: { serviceId: '', templateId: '', publicKey: '', toEmail: '' }
            };
        }
        const parsed = JSON.parse(raw);
        return {
            observationMonths: Number.isFinite(parsed.observationMonths) ? parsed.observationMonths : DEFAULT_OBSERVATION_MONTHS,
            dropThreshold: Number.isFinite(parsed.dropThreshold) ? parsed.dropThreshold : DEFAULT_DROP_THRESHOLD,
            email: {
                serviceId: parsed.email?.serviceId || '',
                templateId: parsed.email?.templateId || '',
                publicKey: parsed.email?.publicKey || '',
                toEmail: parsed.email?.toEmail || ''
            }
        };
    } catch (error) {
        console.warn('无法解析存储的设置，已重置。', error);
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
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed
            .filter(item => item && typeof item.symbol === 'string')
            .map(item => ({
                symbol: item.symbol,
                latestPrice: item.latestPrice,
                latestDate: item.latestDate,
                highestPrice: item.highestPrice,
                highestDate: item.highestDate,
                dropPercent: item.dropPercent,
                lastUpdated: item.lastUpdated,
                lastAlertAt: item.lastAlertAt
            }));
    } catch (error) {
        console.warn('无法解析存储的股票列表，已重置。', error);
        return [];
    }
}

function saveTickers() {
    const stored = tickers
        .filter(item => item.symbol)
        .map(item => ({
            symbol: item.symbol,
            latestPrice: item.latestPrice,
            latestDate: item.latestDate,
            highestPrice: item.highestPrice,
            highestDate: item.highestDate,
            dropPercent: item.dropPercent,
            lastUpdated: item.lastUpdated,
            lastAlertAt: item.lastAlertAt
        }));
    window.localStorage.setItem(TICKERS_KEY, JSON.stringify(stored));
}

function initEventListeners() {
    languageButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.dataset.lang;
            if (!lang || lang === currentLang || !translations[lang]) return;
            currentLang = lang;
            saveLanguage(lang);
            applyLanguage(lang);
            renderTickerInputs();
            renderResults();
        });
    });

    addTickerButton.addEventListener('click', () => {
        const input = document.getElementById('newTickerInput');
        if (input) {
            input.focus();
            input.select();
        }
    });

    tickerList.addEventListener('click', event => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const action = target.dataset.action;
        const symbol = target.dataset.symbol;
        if (!action || !symbol) return;
        if (action === 'refresh') {
            updateTicker(symbol).catch(error => handleTickerError(error, symbol));
        } else if (action === 'remove') {
            removeTicker(symbol);
        }
    });

    observationInput.addEventListener('change', handleObservationChange);
    thresholdInput.addEventListener('change', handleThresholdChange);
    emailInput.addEventListener('change', handleEmailChange);
    serviceIdInput.addEventListener('change', handleServiceIdChange);
    templateIdInput.addEventListener('change', handleTemplateIdChange);
    publicKeyInput.addEventListener('change', handlePublicKeyChange);

    savePreferencesButton.addEventListener('click', () => {
        updateSettingsFromInputs();
        saveSettings();
        showStatus(translations[currentLang].status.saved, 'success');
    });

    refreshAllButton.addEventListener('click', () => {
        refreshAllTickers();
    });
}

function applyLanguage(lang) {
    const t = translations[lang];
    document.documentElement.lang = t.htmlLang;
    document.title = t.documentTitle;

    const languageSwitcher = document.querySelector('.language-switcher');
    if (languageSwitcher) {
        languageSwitcher.setAttribute('aria-label', t.languageSwitcherAria);
    }

    const siteNav = document.querySelector('.site-nav');
    if (siteNav) {
        siteNav.setAttribute('aria-label', t.nav.aria);
    }

    if (navMonitor) {
        navMonitor.textContent = t.nav.monitor;
    }
    if (navTheory) {
        navTheory.textContent = t.nav.theory;
    }
    panelTitle.textContent = t.panel.title;
    panelLocale.textContent = t.panel.locale;
    tickerLabel.textContent = t.ticker.label;
    tickerHelper.textContent = t.ticker.helper;
    addTickerButton.setAttribute('aria-label', t.ticker.addAria);
    observationInput.setAttribute('aria-label', t.controls.observationTitle);
    thresholdInput.setAttribute('aria-label', t.controls.thresholdTitle);
    observationInput.setAttribute('title', t.controls.observationHelper);
    thresholdInput.setAttribute('title', t.controls.thresholdHelper);
    document.getElementById('observationTitle').textContent = t.controls.observationTitle;
    document.getElementById('observationHelper').textContent = t.controls.observationHelper;
    document.getElementById('observationUnit').textContent = t.controls.observationUnit;
    document.getElementById('thresholdTitle').textContent = t.controls.thresholdTitle;
    document.getElementById('thresholdHelper').textContent = t.controls.thresholdHelper;
    document.getElementById('emailLabel').textContent = t.email.label;
    emailInput.placeholder = t.email.placeholder;
    savePreferencesButton.textContent = t.buttons.save;
    refreshAllButton.textContent = t.buttons.refreshAll;
    advancedSummary.textContent = t.advanced.summary;
    serviceIdLabel.textContent = t.advanced.serviceIdLabel;
    templateIdLabel.textContent = t.advanced.templateIdLabel;
    publicKeyLabel.textContent = t.advanced.publicKeyLabel;
    emptyState.textContent = t.emptyState;
    footerNote.textContent = t.footerNote;

    languageButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.lang === lang);
    });

    setUpdatedTime();
    renderChart();
}

function renderSettings() {
    observationInput.value = settings.observationMonths;
    thresholdInput.value = settings.dropThreshold;
    emailInput.value = settings.email.toEmail;
    serviceIdInput.value = settings.email.serviceId;
    templateIdInput.value = settings.email.templateId;
    publicKeyInput.value = settings.email.publicKey;
}

function renderTickerInputs() {
    tickerList.innerHTML = '';
    tickers.forEach(ticker => {
        tickerList.appendChild(createTrackedRow(ticker));
    });
    tickerList.appendChild(createNewTickerRow());
}

function createTrackedRow(ticker) {
    const t = translations[currentLang];
    const row = document.createElement('div');
    row.className = 'ticker-row readonly';
    row.dataset.symbol = ticker.symbol;

    const input = document.createElement('input');
    input.className = 'ticker-input';
    input.value = ticker.symbol;
    input.readOnly = true;
    input.setAttribute('aria-label', ticker.symbol);

    const refreshButton = document.createElement('button');
    refreshButton.className = 'icon-button small';
    refreshButton.type = 'button';
    refreshButton.textContent = '⟳';
    refreshButton.dataset.action = 'refresh';
    refreshButton.dataset.symbol = ticker.symbol;
    refreshButton.title = t.buttons.refresh;
    refreshButton.setAttribute('aria-label', `${t.buttons.refresh} ${ticker.symbol}`);

    const removeButton = document.createElement('button');
    removeButton.className = 'icon-button small danger';
    removeButton.type = 'button';
    removeButton.textContent = '×';
    removeButton.dataset.action = 'remove';
    removeButton.dataset.symbol = ticker.symbol;
    removeButton.title = t.buttons.remove;
    removeButton.setAttribute('aria-label', `${t.buttons.remove} ${ticker.symbol}`);

    row.append(input, refreshButton, removeButton);
    return row;
}

function createNewTickerRow() {
    const t = translations[currentLang];
    const row = document.createElement('div');
    row.className = 'ticker-row';

    const input = document.createElement('input');
    input.className = 'ticker-input';
    input.placeholder = t.ticker.placeholder;
    input.id = 'newTickerInput';
    input.autocomplete = 'off';

    input.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            commitNewTicker(row, input.value.trim());
        } else if (event.key === 'Escape') {
            input.value = '';
            row.classList.remove('error');
        }
    });

    input.addEventListener('blur', () => {
        const value = input.value.trim();
        if (value) {
            commitNewTicker(row, value);
        } else {
            row.classList.remove('error');
        }
    });

    const placeholderButton = document.createElement('span');
    placeholderButton.className = 'icon-button small';
    placeholderButton.textContent = '＋';
    placeholderButton.setAttribute('aria-hidden', 'true');

    const spacer = document.createElement('span');
    spacer.className = 'icon-button small';
    spacer.textContent = '·';
    spacer.style.visibility = 'hidden';
    spacer.setAttribute('aria-hidden', 'true');

    row.append(input, placeholderButton, spacer);
    return row;
}

async function commitNewTicker(row, value) {
    const symbol = normalizeTicker(value);
    if (!symbol) {
        row.classList.add('error');
        showStatus(translations[currentLang].status.invalidSymbol, 'error');
        return;
    }
    if (tickers.some(item => item.symbol === symbol)) {
        row.classList.add('error');
        showStatus(translations[currentLang].status.duplicate(symbol), 'warning');
        return;
    }

    row.classList.remove('error');
    try {
        await updateTicker(symbol);
        renderTickerInputs();
        const input = document.getElementById('newTickerInput');
        if (input) {
            input.focus();
        }
    } catch (error) {
        handleTickerError(error, symbol, row);
    }
}

function normalizeTicker(symbol) {
    return symbol.trim().toUpperCase();
}

function formatCurrency(value) {
    if (!Number.isFinite(value)) return '--';
    return value.toLocaleString(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
}

function formatPercent(value) {
    if (!Number.isFinite(value)) return '--';
    return `${value.toFixed(2)}%`;
}

function formatDate(value) {
    if (!value) return '--';
    const date = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return '--';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function showStatus(message, type = 'info') {
    if (!statusBanner) return;
    if (!message) {
        statusBanner.textContent = '';
        statusBanner.removeAttribute('data-status');
        return;
    }
    statusBanner.textContent = message;
    statusBanner.dataset.status = type;
}

function setUpdatedTime(date) {
    if (!lastUpdated) return;
    if (date) {
        lastUpdated.textContent = translations[currentLang].status.lastUpdated(formatDate(date));
    } else if (tickers.some(item => item.lastUpdated)) {
        const latest = tickers.reduce((max, item) => {
            if (!item.lastUpdated) return max;
            const value = new Date(item.lastUpdated);
            if (!max) return value;
            return value > max ? value : max;
        }, null);
        if (latest) {
            lastUpdated.textContent = translations[currentLang].status.lastUpdated(formatDate(latest));
        } else {
            lastUpdated.textContent = translations[currentLang].status.neverUpdated;
        }
    } else {
        lastUpdated.textContent = translations[currentLang].status.neverUpdated;
    }
}

function renderResults() {
    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(emptyState);
    if (!tickers.length) {
        emptyState.classList.remove('hidden');
        renderChart();
        return;
    }
    const threshold = Number(settings.dropThreshold) || DEFAULT_DROP_THRESHOLD;
    const t = translations[currentLang];
    emptyState.classList.add('hidden');
    if (!activeSymbol || !tickers.some(item => item.symbol === activeSymbol)) {
        activeSymbol = tickers[0]?.symbol || null;
    }
    tickers.forEach(ticker => {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.dataset.symbol = ticker.symbol;

            const header = document.createElement('div');
            header.className = 'result-header';

            const symbolEl = document.createElement('span');
            symbolEl.className = 'result-symbol';
            symbolEl.textContent = ticker.symbol;

            const dropEl = document.createElement('span');
            dropEl.className = 'result-drop';
            dropEl.textContent = formatPercent(ticker.dropPercent);
            if (Number.isFinite(ticker.dropPercent)) {
                if (ticker.dropPercent >= threshold) {
                    dropEl.classList.add('danger');
                } else if (ticker.dropPercent >= threshold * 0.7) {
                    dropEl.classList.add('alert');
                }
            }

            header.append(symbolEl, dropEl);

            const metrics = document.createElement('div');
            metrics.className = 'result-metrics';

            const statusMetric = createMetric(t.results.statusLabel, ticker.dropPercent >= threshold ? t.results.triggered : t.results.normal);
            const latestMetric = createMetric(t.results.latest, formatCurrency(ticker.latestPrice));
            const highestMetric = createMetric(t.results.highest, formatCurrency(ticker.highestPrice));
            const highestDateMetric = createMetric(t.results.highestDate, formatDate(ticker.highestDate));
            const updatedMetric = createMetric(t.results.updated, formatDate(ticker.lastUpdated));

            metrics.append(statusMetric, latestMetric, highestMetric, highestDateMetric, updatedMetric);

            card.append(header, metrics);
            const isActive = ticker.symbol === activeSymbol;
            if (isActive) {
                card.classList.add('active');
            }
            card.tabIndex = 0;
            card.setAttribute('role', 'button');
            card.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            const selectTicker = () => {
                if (activeSymbol === ticker.symbol) return;
                activeSymbol = ticker.symbol;
                renderResults();
            };
            card.addEventListener('click', selectTicker);
            card.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    selectTicker();
                }
            });
            resultsContainer.appendChild(card);
        });
    renderChart();
}

function renderChart() {
    if (!chartCard || !chartPlaceholder || !priceChartCanvas) {
        return;
    }
    const t = translations[currentLang];
    const months = Number.isFinite(settings.observationMonths) && settings.observationMonths > 0
        ? settings.observationMonths
        : DEFAULT_OBSERVATION_MONTHS;
    const threshold = Number.isFinite(settings.dropThreshold) && settings.dropThreshold > 0
        ? settings.dropThreshold
        : DEFAULT_DROP_THRESHOLD;

    if (chartSubtitleEl) {
        chartSubtitleEl.textContent = t.chart.subtitle(months, threshold);
    }

    if (!tickers.length || !activeSymbol || !tickers.some(item => item.symbol === activeSymbol)) {
        if (chartTitleEl) {
            chartTitleEl.textContent = t.chart.emptyTitle;
        }
        chartPlaceholder.textContent = t.chart.placeholder;
        chartPlaceholder.classList.remove('hidden');
        if (priceChartCanvas) {
            priceChartCanvas.classList.add('hidden');
        }
        if (priceChart) {
            priceChart.destroy();
            priceChart = undefined;
        }
        return;
    }

    const ticker = tickers.find(item => item.symbol === activeSymbol);
    if (chartTitleEl) {
        chartTitleEl.textContent = t.chart.title(activeSymbol);
    }

    if (!ticker || !Array.isArray(ticker.history) || !ticker.history.length) {
        chartPlaceholder.textContent = t.chart.noData;
        chartPlaceholder.classList.remove('hidden');
        if (priceChartCanvas) {
            priceChartCanvas.classList.add('hidden');
        }
        if (priceChart) {
            priceChart.destroy();
            priceChart = undefined;
        }
        return;
    }

    const { series, mask } = prepareChartSeries(ticker.history, months, threshold);
    if (!series.length) {
        chartPlaceholder.textContent = t.chart.noData;
        chartPlaceholder.classList.remove('hidden');
        if (priceChartCanvas) {
            priceChartCanvas.classList.add('hidden');
        }
        if (priceChart) {
            priceChart.destroy();
            priceChart = undefined;
        }
        return;
    }

    if (priceChart) {
        priceChart.destroy();
    }

    const priceData = series.map(entry => ({
        x: entry.date.getTime(),
        y: entry.close
    }));
    const dropData = series.map((entry, index) => (mask[index] ? { x: entry.date.getTime(), y: entry.close } : null));

    chartPlaceholder.classList.add('hidden');
    priceChartCanvas.classList.remove('hidden');

    const ctx = priceChartCanvas.getContext('2d');
    if (!ctx || typeof window.Chart === 'undefined') {
        chartPlaceholder.textContent = t.chart.noData;
        chartPlaceholder.classList.remove('hidden');
        priceChartCanvas.classList.add('hidden');
        return;
    }

    const locale = currentLang === 'zh' ? 'zh-CN' : 'en-US';
    const dateFormatter = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' });

    priceChart = new window.Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: t.chart.tooltipPrice,
                    data: priceData,
                    borderColor: 'rgba(96, 165, 250, 0.9)',
                    backgroundColor: 'rgba(96, 165, 250, 0.15)',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.2
                },
                {
                    label: t.chart.tooltipThreshold,
                    data: dropData,
                    borderColor: 'rgba(248, 113, 113, 0.9)',
                    backgroundColor: 'rgba(248, 113, 113, 0.15)',
                    borderWidth: 3,
                    pointRadius: 0,
                    tension: 0.2,
                    spanGaps: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                x: {
                    type: 'linear',
                    ticks: {
                        color: 'rgba(226, 232, 240, 0.8)',
                        callback: value => dateFormatter.format(new Date(value))
                    },
                    grid: {
                        color: 'rgba(148, 163, 184, 0.25)'
                    }
                },
                y: {
                    ticks: {
                        color: 'rgba(226, 232, 240, 0.8)',
                        callback: value => formatCurrency(value)
                    },
                    grid: {
                        color: 'rgba(148, 163, 184, 0.2)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: items => {
                            if (!items?.length) return '';
                            return dateFormatter.format(new Date(items[0].parsed.x));
                        },
                        label: context => {
                            const labelPrefix = context.datasetIndex === 1 ? t.chart.tooltipThreshold : t.chart.tooltipPrice;
                            return `${labelPrefix}: ${formatCurrency(context.parsed.y)}`;
                        }
                    }
                }
            }
        }
    });
}

function prepareChartSeries(history, months, threshold) {
    const sanitized = history
        .map(entry => {
            const date = new Date(entry.date);
            const close = Number.parseFloat(entry.close);
            return { date, close };
        })
        .filter(item => !Number.isNaN(item.date.getTime()) && Number.isFinite(item.close))
        .sort((a, b) => a.date - b.date);

    const mask = new Array(sanitized.length).fill(false);
    if (!sanitized.length) {
        return { series: sanitized, mask };
    }

    const windowMonths = Number.isFinite(months) && months > 0 ? months : DEFAULT_OBSERVATION_MONTHS;
    const trigger = Number.isFinite(threshold) && threshold > 0 ? threshold : DEFAULT_DROP_THRESHOLD;

    for (let i = 0; i < sanitized.length; i += 1) {
        const entry = sanitized[i];
        const windowStart = new Date(entry.date);
        windowStart.setMonth(windowStart.getMonth() - windowMonths);
        let maxClose = entry.close;
        for (let j = i; j >= 0; j -= 1) {
            const candidate = sanitized[j];
            if (candidate.date < windowStart) break;
            if (candidate.close > maxClose) {
                maxClose = candidate.close;
            }
        }
        if (maxClose > 0) {
            const drop = ((maxClose - entry.close) / maxClose) * 100;
            if (drop >= trigger - 1e-6) {
                mask[i] = true;
            }
        }
    }

    return { series: sanitized, mask };
}

function createMetric(label, value) {
    const wrapper = document.createElement('div');
    wrapper.className = 'result-metric';

    const labelEl = document.createElement('span');
    labelEl.className = 'result-label';
    labelEl.textContent = label;

    const valueEl = document.createElement('span');
    valueEl.className = 'result-value';
    valueEl.textContent = value;

    wrapper.append(labelEl, valueEl);
    return wrapper;
}

function updateSettingsFromInputs() {
    handleObservationChange();
    handleThresholdChange();
    handleEmailChange();
    handleServiceIdChange();
    handleTemplateIdChange();
    handlePublicKeyChange();
}

function handleObservationChange() {
    const value = Number.parseInt(observationInput.value, 10);
    if (!Number.isFinite(value) || value <= 0) {
        settings.observationMonths = DEFAULT_OBSERVATION_MONTHS;
    } else {
        settings.observationMonths = Math.min(24, value);
    }
    observationInput.value = settings.observationMonths;
    saveSettings();
    renderChart();
}

function handleThresholdChange() {
    const value = Number.parseFloat(thresholdInput.value);
    if (!Number.isFinite(value) || value <= 0) {
        settings.dropThreshold = DEFAULT_DROP_THRESHOLD;
    } else {
        settings.dropThreshold = Math.min(95, Math.max(1, value));
    }
    thresholdInput.value = settings.dropThreshold;
    saveSettings();
    renderResults();
}

function handleEmailChange() {
    settings.email.toEmail = emailInput.value.trim();
    saveSettings();
}

function handleServiceIdChange() {
    settings.email.serviceId = serviceIdInput.value.trim();
    saveSettings();
}

function handleTemplateIdChange() {
    settings.email.templateId = templateIdInput.value.trim();
    saveSettings();
}

function handlePublicKeyChange() {
    settings.email.publicKey = publicKeyInput.value.trim();
    saveSettings();
    emailInitialized = false;
}

function scheduleAutoRefresh() {
    if (refreshTimer) {
        window.clearInterval(refreshTimer);
    }
    if (!tickers.length) return;
    refreshTimer = window.setInterval(() => {
        refreshAllTickers({ silent: true });
    }, REFRESH_INTERVAL_MINUTES * 60 * 1000);
}

async function refreshAllTickers({ silent = false } = {}) {
    if (!tickers.length) return;
    const t = translations[currentLang];
    if (!silent) {
        showStatus(t.status.batchStart, 'info');
    }
    for (const ticker of tickers) {
        try {
            await updateTicker(ticker.symbol, { silent: true });
        } catch (error) {
            handleTickerError(error, ticker.symbol);
        }
    }
    renderResults();
    if (!silent) {
        showStatus(t.status.batchDone, 'success');
    }
    setUpdatedTime(new Date());
}

async function updateTicker(symbol, { silent = false } = {}) {
    const normalized = normalizeTicker(symbol);
    if (!normalized) {
        throw new Error('EMPTY_SYMBOL');
    }
    const t = translations[currentLang];
    if (!silent) {
        showStatus(t.status.refreshing(normalized), 'info');
    }

    const data = await fetchTicker(normalized);

    let existing = tickers.find(item => item.symbol === normalized);
    if (!existing) {
        existing = { symbol: normalized };
        tickers.push(existing);
    }

    existing.latestPrice = data.latestPrice;
    existing.latestDate = data.latestDate;
    existing.highestPrice = data.highestPrice;
    existing.highestDate = data.highestDate;
    existing.dropPercent = data.dropPercent;
    existing.lastUpdated = data.lastUpdated;
    existing.history = data.history;

    activeSymbol = normalized;

    const alertSent = await maybeSendEmail(existing);
    if (alertSent) {
        existing.lastAlertAt = new Date().toISOString();
    }

    saveTickers();
    renderResults();
    if (!silent) {
        showStatus(t.status.updated(normalized, formatPercent(existing.dropPercent)), existing.dropPercent >= settings.dropThreshold ? 'warning' : 'success');
    }
    setUpdatedTime(new Date());
    scheduleAutoRefresh();
    return existing;
}

async function fetchTicker(symbol) {
    const months = Number.isFinite(settings.observationMonths) ? settings.observationMonths : DEFAULT_OBSERVATION_MONTHS;
    const fetchMonths = Math.max(months * 2, 12);
    const periodEnd = new Date();
    const periodStart = new Date();
    periodStart.setMonth(periodStart.getMonth() - fetchMonths);

    const period1 = Math.floor(periodStart.getTime() / 1000);
    const period2 = Math.floor(periodEnd.getTime() / 1000);

    const url = new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`);
    url.searchParams.set('period1', period1.toString());
    url.searchParams.set('period2', period2.toString());
    url.searchParams.set('interval', '1d');
    url.searchParams.set('includePrePost', 'false');
    url.searchParams.set('events', 'div,splits');

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error('NETWORK_ERROR');
    }

    const data = await response.json();
    const result = data?.chart?.result?.[0];
    const errorInfo = data?.chart?.error;

    if (!result) {
        if (errorInfo) {
            const code = String(errorInfo.code || '').toLowerCase();
            const description = String(errorInfo.description || '').toLowerCase();
            if (code.includes('not found') || description.includes('not found') || description.includes('delisted')) {
                throw new Error('INVALID_SYMBOL');
            }
            throw new Error('NO_DATA');
        }
        throw new Error('NO_DATA');
    }

    const timestamps = Array.isArray(result.timestamp) ? result.timestamp : [];
    const closes = result.indicators?.quote?.[0]?.close || [];

    const entries = timestamps
        .map((ts, index) => ({
            date: new Date(ts * 1000),
            close: Number.parseFloat(closes[index])
        }))
        .filter(entry => Number.isFinite(entry.close))
        .sort((a, b) => b.date - a.date);

    if (!entries.length) {
        throw new Error('NO_DATA');
    }

    const ascendingEntries = entries.slice().sort((a, b) => a.date - b.date);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    let yearlyEntries = ascendingEntries.filter(entry => entry.date >= oneYearAgo);
    if (!yearlyEntries.length) {
        const maxPoints = Math.min(ascendingEntries.length, 365);
        yearlyEntries = ascendingEntries.slice(-maxPoints);
    }

    const history = yearlyEntries.map(entry => ({
        date: entry.date.toISOString(),
        close: entry.close
    }));

    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - months);

    let windowEntries = entries.filter(entry => entry.date >= cutoff);
    if (!windowEntries.length) {
        const fallbackCount = Math.max(60, Math.round(months * 30));
        windowEntries = entries.slice(0, fallbackCount);
    }

    if (!windowEntries.length) {
        throw new Error('NO_DATA');
    }

    const latestEntry = windowEntries[0];
    const highestEntry = windowEntries.reduce((max, entry) => (entry.close > max.close ? entry : max), windowEntries[0]);
    const dropPercent = Math.max(0, ((highestEntry.close - latestEntry.close) / highestEntry.close) * 100);

    return {
        symbol,
        latestPrice: latestEntry.close,
        latestDate: latestEntry.date.toISOString(),
        highestPrice: highestEntry.close,
        highestDate: highestEntry.date.toISOString(),
        dropPercent,
        lastUpdated: new Date().toISOString(),
        history
    };
}

function daysBetween(dateA, dateB) {
    const a = new Date(dateA);
    const b = new Date(dateB);
    if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return Infinity;
    const diff = Math.abs(b - a);
    return diff / (1000 * 60 * 60 * 24);
}

function initEmailClient() {
    if (emailInitialized) return;
    if (!settings.email.publicKey || !window.emailjs) return;
    try {
        window.emailjs.init(settings.email.publicKey);
        emailInitialized = true;
    } catch (error) {
        console.warn('EmailJS 初始化失败', error);
    }
}

async function maybeSendEmail(tickerState) {
    const threshold = Number(settings.dropThreshold) || DEFAULT_DROP_THRESHOLD;
    if (!Number.isFinite(tickerState.dropPercent) || tickerState.dropPercent < threshold) {
        return false;
    }

    const { serviceId, templateId, publicKey, toEmail } = settings.email;
    if (!serviceId || !templateId || !publicKey || !toEmail) {
        return false;
    }

    if (!window.emailjs) {
        console.warn('EmailJS 未加载，无法发送邮件');
        return false;
    }

    initEmailClient();
    if (!emailInitialized) return false;

    if (tickerState.lastAlertAt && daysBetween(tickerState.lastAlertAt, new Date()) < ALERT_COOLDOWN_DAYS) {
        return false;
    }

    try {
        await window.emailjs.send(serviceId, templateId, {
            to_email: toEmail,
            ticker: tickerState.symbol,
            drop_percent: tickerState.dropPercent.toFixed(2),
            current_price: tickerState.latestPrice.toFixed(2),
            highest_price: tickerState.highestPrice.toFixed(2),
            highest_date: formatDate(tickerState.highestDate),
            last_updated: formatDate(tickerState.lastUpdated)
        });
        showStatus(translations[currentLang].status.emailSent(toEmail), 'success');
        return true;
    } catch (error) {
        console.error('发送邮件失败', error);
        showStatus(translations[currentLang].status.emailFailed, 'error');
        return false;
    }
}

function handleTickerError(error, symbol, row) {
    console.error(error);
    const t = translations[currentLang];
    switch (error?.message) {
        case 'INVALID_SYMBOL':
        case 'NOT_FOUND':
            showStatus(t.status.notFound, 'error');
            if (row) row.classList.add('error');
            break;
        case 'NO_DATA':
            showStatus(t.status.noData, 'warning');
            if (row) row.classList.add('error');
            break;
        case 'NETWORK_ERROR':
            showStatus(t.status.networkError, 'error');
            break;
        default:
            showStatus(t.status.unknownError, 'error');
    }
}

function removeTicker(symbol) {
    tickers = tickers.filter(item => item.symbol !== symbol);
    if (activeSymbol === symbol) {
        activeSymbol = tickers[0]?.symbol || null;
    }
    saveTickers();
    renderTickerInputs();
    renderResults();
    showStatus(translations[currentLang].status.removed(symbol), 'info');
    setUpdatedTime();
    if (tickers.length) {
        scheduleAutoRefresh();
    } else if (refreshTimer) {
        window.clearInterval(refreshTimer);
        refreshTimer = undefined;
    }
}
