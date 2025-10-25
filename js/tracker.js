const SETTINGS_KEY = 'tracker-settings';
const TICKERS_KEY = 'tracker-tickers';
const ALERT_COOLDOWN_DAYS = 3;
const REFRESH_INTERVAL_MINUTES = 30;

const settingsForm = document.getElementById('settingsForm');
const clearSettingsButton = document.getElementById('clearSettings');
const settingsMessage = document.getElementById('settingsMessage');
const tickerForm = document.getElementById('tickerForm');
const tickerInput = document.getElementById('tickerInput');
const tickerError = document.getElementById('tickerError');
const refreshAllButton = document.getElementById('refreshAll');
const trackerUpdated = document.getElementById('trackerUpdated');
const trackerStatus = document.getElementById('trackerStatus');
const tableBody = document.getElementById('tickerTableBody');
const emptyRow = document.getElementById('trackerEmpty');

let settings = loadSettings();
let tickers = loadTickers();
let emailInitialized = false;
let refreshTimer;

function loadSettings() {
    try {
        const raw = window.localStorage.getItem(SETTINGS_KEY);
        if (!raw) return {
            apiKey: '',
            email: { serviceId: '', templateId: '', publicKey: '', toEmail: '' }
        };
        const parsed = JSON.parse(raw);
        return {
            apiKey: parsed.apiKey || '',
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
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.warn('无法解析存储的股票列表，已重置。', error);
        return [];
    }
}

function saveTickers() {
    window.localStorage.setItem(TICKERS_KEY, JSON.stringify(tickers));
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

function renderSettings() {
    const apiKey = document.getElementById('apiKey');
    const serviceId = document.getElementById('serviceId');
    const templateId = document.getElementById('templateId');
    const publicKey = document.getElementById('publicKey');
    const toEmail = document.getElementById('toEmail');

    if (apiKey) apiKey.value = settings.apiKey;
    if (serviceId) serviceId.value = settings.email.serviceId;
    if (templateId) templateId.value = settings.email.templateId;
    if (publicKey) publicKey.value = settings.email.publicKey;
    if (toEmail) toEmail.value = settings.email.toEmail;
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
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function normalizeTicker(symbol) {
    return symbol.trim().toUpperCase();
}

function showStatus(message, type = 'info') {
    if (!trackerStatus) return;
    if (message) {
        trackerStatus.textContent = message;
        trackerStatus.dataset.status = type;
        trackerStatus.classList.add('visible');
    } else {
        trackerStatus.textContent = '';
        trackerStatus.removeAttribute('data-status');
        trackerStatus.classList.remove('visible');
    }
}

function setUpdatedTime(date) {
    if (!trackerUpdated) return;
    trackerUpdated.textContent = date ? `最近刷新：${formatDate(date)}` : '';
}

function renderTable() {
    if (!tableBody) return;
    tableBody.innerHTML = '';
    if (!tickers.length) {
        if (emptyRow) {
            emptyRow.classList.remove('hidden');
            tableBody.appendChild(emptyRow);
        }
        return;
    }

    if (emptyRow) {
        emptyRow.classList.add('hidden');
    }

    tickers
        .sort((a, b) => a.symbol.localeCompare(b.symbol))
        .forEach(ticker => {
            const tr = document.createElement('tr');
            tr.dataset.symbol = ticker.symbol;

            tr.innerHTML = `
                <td>${ticker.symbol}</td>
                <td>${formatCurrency(ticker.latestPrice)}</td>
                <td>${formatCurrency(ticker.highestPrice)}</td>
                <td>
                    <span class="status-pill ${ticker.dropPercent >= 20 ? 'danger' : ticker.dropPercent >= 10 ? 'warning' : ''}">
                        ${formatPercent(ticker.dropPercent)}
                    </span>
                </td>
                <td>${formatDate(ticker.lastUpdated)}</td>
                <td>
                    <span class="status-label ${ticker.dropPercent >= 20 ? 'alert' : 'ok'}">
                        ${ticker.dropPercent >= 20 ? '触发提醒' : '正常'}
                    </span>
                </td>
                <td class="table-actions">
                    <button type="button" class="link-button" data-action="refresh" data-symbol="${ticker.symbol}">刷新</button>
                    <button type="button" class="link-button danger" data-action="remove" data-symbol="${ticker.symbol}">移除</button>
                </td>
            `;

            tableBody.appendChild(tr);
        });
}

function persistAndRender() {
    saveTickers();
    renderTable();
}

async function fetchTicker(symbol) {
    if (!settings.apiKey) {
        throw new Error('MISSING_API_KEY');
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

    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 2);

    const windowEntries = entries.filter(entry => entry.date >= cutoff);
    const relevant = windowEntries.length ? windowEntries : entries.slice(0, 60);

    const latestEntry = relevant[0];
    const highestEntry = relevant.reduce((max, entry) => (entry.close > max.close ? entry : max), relevant[0]);

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

async function maybeSendEmail(tickerState) {
    if (tickerState.dropPercent < 20) {
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
        showStatus(`已向 ${toEmail} 发送 ${tickerState.symbol} 深跌提醒`, 'success');
        return true;
    } catch (error) {
        console.error('发送邮件失败', error);
        showStatus('邮件发送失败，请检查 EmailJS 设置。', 'error');
        return false;
    }
}

async function updateTicker(symbol, { silent = false } = {}) {
    const normalized = normalizeTicker(symbol);
    if (!normalized) {
        throw new Error('EMPTY_SYMBOL');
    }

    if (!silent) {
        showStatus(`正在获取 ${normalized} 数据…`, 'info');
    }

    const data = await fetchTicker(normalized);

    let existing = tickers.find(item => item.symbol === normalized);
    if (!existing) {
        existing = { symbol: normalized };
        tickers.push(existing);
    }

    existing.latestPrice = data.latestPrice;
    existing.highestPrice = data.highestPrice;
    existing.dropPercent = data.dropPercent;
    existing.lastUpdated = data.lastUpdated;
    existing.latestDate = data.latestDate;
    existing.highestDate = data.highestDate;

    const alertSent = await maybeSendEmail(existing);
    if (alertSent) {
        existing.lastAlertAt = new Date().toISOString();
    }

    if (!alertSent && existing.dropPercent < 20) {
        existing.lastAlertAt = existing.lastAlertAt || null;
    }

    persistAndRender();
    setUpdatedTime(new Date());
    showStatus(`已更新 ${normalized}，当前回撤 ${formatPercent(existing.dropPercent)}`, existing.dropPercent >= 20 ? 'warning' : 'success');
    return existing;
}

async function handleTickerSubmit(event) {
    event.preventDefault();
    tickerError.textContent = '';

    const symbol = normalizeTicker(tickerInput.value || '');
    if (!symbol) {
        tickerError.textContent = '请输入股票代码。';
        return;
    }

    if (tickers.some(item => item.symbol === symbol)) {
        tickerError.textContent = `${symbol} 已在监控列表中。`;
        return;
    }

    try {
        await updateTicker(symbol);
        tickerInput.value = '';
    } catch (error) {
        handleTickerError(error, symbol);
    }
}

function handleTickerError(error, symbol) {
    console.error(error);
    switch (error.message) {
        case 'MISSING_API_KEY':
            tickerError.textContent = '请先在左侧填写 Alpha Vantage API Key。';
            break;
        case 'RATE_LIMIT':
            tickerError.textContent = '触发 API 频率限制，请稍后再试。';
            showStatus(error.detail || 'Alpha Vantage 限流，请等待 60 秒后重试。', 'error');
            break;
        case 'INVALID_SYMBOL':
            tickerError.textContent = `${symbol} 不是有效的股票代码。`;
            break;
        case 'NO_DATA':
            tickerError.textContent = `未能获取 ${symbol} 的历史数据。`;
            break;
        case 'NETWORK_ERROR':
            tickerError.textContent = '网络请求失败，请检查网络连接。';
            break;
        default:
            tickerError.textContent = '获取数据时出现问题，请稍后重试。';
    }
}

function handleTableClick(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    if (!action) return;
    const symbol = target.dataset.symbol;
    if (!symbol) return;

    if (action === 'remove') {
        tickers = tickers.filter(item => item.symbol !== symbol);
        persistAndRender();
        showStatus(`已移除 ${symbol}`, 'info');
        return;
    }

    if (action === 'refresh') {
        updateTicker(symbol, { silent: true }).catch(error => {
            handleTickerError(error, symbol);
        });
    }
}

function handleSettingsSubmit(event) {
    event.preventDefault();
    const formData = new FormData(settingsForm);

    settings.apiKey = (formData.get('apiKey') || '').toString().trim();
    settings.email = {
        serviceId: (formData.get('serviceId') || '').toString().trim(),
        templateId: (formData.get('templateId') || '').toString().trim(),
        publicKey: (formData.get('publicKey') || '').toString().trim(),
        toEmail: (formData.get('toEmail') || '').toString().trim()
    };

    saveSettings();
    settingsMessage.textContent = '设置已保存。';
    showStatus('设置已更新。', 'success');
    emailInitialized = false;
    initEmailClient();
}

function clearSettings() {
    settings = {
        apiKey: '',
        email: { serviceId: '', templateId: '', publicKey: '', toEmail: '' }
    };
    saveSettings();
    renderSettings();
    settingsMessage.textContent = '已清除保存的密钥。';
    showStatus('已清除设置。', 'info');
    emailInitialized = false;
}

async function refreshAll() {
    if (!tickers.length) {
        showStatus('暂无股票需要刷新。', 'info');
        return;
    }

    for (const ticker of [...tickers]) {
        try {
            await updateTicker(ticker.symbol, { silent: true });
            await new Promise(resolve => setTimeout(resolve, 1500));
        } catch (error) {
            handleTickerError(error, ticker.symbol);
            break;
        }
    }
}

function scheduleAutoRefresh() {
    if (refreshTimer) {
        clearInterval(refreshTimer);
    }
    refreshTimer = window.setInterval(() => {
        refreshAll().catch(error => console.error('自动刷新失败', error));
    }, REFRESH_INTERVAL_MINUTES * 60 * 1000);
}

function setupEventListeners() {
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSettingsSubmit);
    }
    if (clearSettingsButton) {
        clearSettingsButton.addEventListener('click', clearSettings);
    }
    if (tickerForm) {
        tickerForm.addEventListener('submit', handleTickerSubmit);
    }
    if (tableBody) {
        tableBody.addEventListener('click', handleTableClick);
    }
    if (refreshAllButton) {
        refreshAllButton.addEventListener('click', () => {
            refreshAll().catch(error => console.error(error));
        });
    }
}

function bootstrap() {
    renderSettings();
    renderTable();
    initEmailClient();
    scheduleAutoRefresh();
    if (tickers.length) {
        setUpdatedTime(tickers.reduce((latest, item) => {
            return !latest || new Date(item.lastUpdated) > new Date(latest) ? item.lastUpdated : latest;
        }, null));
    }
}

setupEventListeners();
bootstrap();
