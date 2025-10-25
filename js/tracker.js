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
        documentTitle: '策略实验室 - 应用界面',
        languageSwitcherAria: '语言切换',
        nav: {
            aria: '页面导航',
            brand: '策略实验室',
            theory: '理论界面',
            application: '应用界面'
        },
        panel: {
            title: '应用',
            theory: '理论',
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
            summary: '数据源与邮件服务配置',
            apiKeyLabel: 'Alpha Vantage API Key',
            apiKeyHelper: '密钥仅存储在浏览器本地。',
            serviceIdLabel: 'EmailJS Service ID',
            templateIdLabel: 'EmailJS Template ID',
            publicKeyLabel: 'EmailJS Public Key',
            apiKeyPlaceholder: '例如 demo'
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
            missingApiKey: '请先填写 Alpha Vantage API Key。',
            rateLimit: '触发 API 频率限制，请稍后再试。',
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
        emptyState: '请先添加股票代码。',
        footerNote: '示例项目仅用于策略演示，不构成投资建议。'
    },
    en: {
        htmlLang: 'en',
        documentTitle: 'Strategy Lab - Application',
        languageSwitcherAria: 'Language toggle',
        nav: {
            aria: 'Site navigation',
            brand: 'Strategy Lab',
            theory: 'Theory',
            application: 'Application'
        },
        panel: {
            title: 'Application',
            theory: 'Theory',
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
            summary: 'Data source & Email service',
            apiKeyLabel: 'Alpha Vantage API Key',
            apiKeyHelper: 'Stored locally in this browser only.',
            serviceIdLabel: 'EmailJS Service ID',
            templateIdLabel: 'EmailJS Template ID',
            publicKeyLabel: 'EmailJS Public Key',
            apiKeyPlaceholder: 'e.g. demo'
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
            missingApiKey: 'Please provide your Alpha Vantage API key first.',
            rateLimit: 'API rate limit reached. Please try again later.',
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
        emptyState: 'Add tickers to start monitoring.',
        footerNote: 'For illustration only. Not investment advice.'
    }
};

const languageButtons = document.querySelectorAll('.lang-button');
const navBrand = document.getElementById('navBrand');
const navTheory = document.getElementById('navTheory');
const navApplication = document.getElementById('navApplication');
const panelTitle = document.getElementById('panelTitle');
const panelTheoryLink = document.getElementById('panelTheoryLink');
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
const advancedSummary = document.getElementById('advancedSummary');
const apiKeyLabel = document.getElementById('apiKeyLabel');
const apiKeyInput = document.getElementById('apiKey');
const apiKeyHelper = document.getElementById('apiKeyHelper');
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
                apiKey: '',
                observationMonths: DEFAULT_OBSERVATION_MONTHS,
                dropThreshold: DEFAULT_DROP_THRESHOLD,
                email: { serviceId: '', templateId: '', publicKey: '', toEmail: '' }
            };
        }
        const parsed = JSON.parse(raw);
        return {
            apiKey: parsed.apiKey || '',
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
            apiKey: '',
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
        return parsed.filter(item => item && typeof item.symbol === 'string');
    } catch (error) {
        console.warn('无法解析存储的股票列表，已重置。', error);
        return [];
    }
}

function saveTickers() {
    const stored = tickers.filter(item => item.symbol);
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
    apiKeyInput.addEventListener('change', handleApiKeyChange);
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

    navBrand.textContent = t.nav.brand;
    navTheory.textContent = t.nav.theory;
    navApplication.textContent = t.nav.application;
    panelTitle.textContent = t.panel.title;
    panelTheoryLink.textContent = t.panel.theory;
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
    apiKeyLabel.textContent = t.advanced.apiKeyLabel;
    apiKeyInput.placeholder = t.advanced.apiKeyPlaceholder;
    apiKeyHelper.textContent = t.advanced.apiKeyHelper;
    serviceIdLabel.textContent = t.advanced.serviceIdLabel;
    templateIdLabel.textContent = t.advanced.templateIdLabel;
    publicKeyLabel.textContent = t.advanced.publicKeyLabel;
    emptyState.textContent = t.emptyState;
    footerNote.textContent = t.footerNote;

    languageButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.lang === lang);
    });

    setUpdatedTime();
}

function renderSettings() {
    observationInput.value = settings.observationMonths;
    thresholdInput.value = settings.dropThreshold;
    emailInput.value = settings.email.toEmail;
    apiKeyInput.value = settings.apiKey;
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
        return;
    }
    const threshold = Number(settings.dropThreshold) || DEFAULT_DROP_THRESHOLD;
    const t = translations[currentLang];
    emptyState.classList.add('hidden');
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
            resultsContainer.appendChild(card);
        });
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
    handleApiKeyChange();
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

function handleApiKeyChange() {
    settings.apiKey = apiKeyInput.value.trim();
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
    if (!settings.apiKey) {
        const error = new Error('MISSING_API_KEY');
        throw error;
    }

    const url = new URL('https://www.alphavantage.co/query');
    url.searchParams.set('function', 'TIME_SERIES_DAILY_ADJUSTED');
    url.searchParams.set('symbol', symbol);
    url.searchParams.set('apikey', settings.apiKey);

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error('NETWORK_ERROR');
    }

    const data = await response.json();

    if (data.Note) {
        const error = new Error('RATE_LIMIT');
        error.detail = data.Note;
        throw error;
    }

    if (data['Error Message']) {
        throw new Error('INVALID_SYMBOL');
    }

    const series = data['Time Series (Daily)'];
    if (!series) {
        throw new Error('NO_DATA');
    }

    const entries = Object.entries(series)
        .map(([date, values]) => ({
            date: new Date(`${date}T00:00:00Z`),
            close: Number.parseFloat(values['5. adjusted close'])
        }))
        .filter(entry => Number.isFinite(entry.close))
        .sort((a, b) => b.date - a.date);

    if (!entries.length) {
        throw new Error('NO_DATA');
    }

    const months = Number.isFinite(settings.observationMonths) ? settings.observationMonths : DEFAULT_OBSERVATION_MONTHS;
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - months);

    let windowEntries = entries.filter(entry => entry.date >= cutoff);
    if (!windowEntries.length) {
        const fallbackCount = Math.max(60, Math.round(months * 30));
        windowEntries = entries.slice(0, fallbackCount);
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
        lastUpdated: new Date().toISOString()
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
        case 'MISSING_API_KEY':
            showStatus(t.status.missingApiKey, 'error');
            break;
        case 'RATE_LIMIT':
            showStatus(t.status.rateLimit, 'warning');
            break;
        case 'INVALID_SYMBOL':
            showStatus(t.status.invalidSymbol, 'error');
            if (row) row.classList.add('error');
            break;
        case 'NO_DATA':
            showStatus(t.status.unknownError, 'error');
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
