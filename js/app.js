const years = Array.from({ length: 15 }, (_, idx) => 2010 + idx);

const series = {
    mag7Strategy: [100, 88, 110, 145, 180, 150, 210, 270, 210, 310, 230, 380, 290, 420, 520],
    athleticStrategy: [100, 90, 105, 125, 150, 135, 165, 200, 170, 220, 180, 250, 210, 260, 310],
    sp500DCA: [100, 104.0, 116.5, 130.5, 146.2, 152.0, 170.2, 190.6, 198.2, 222.0, 195.4, 218.8, 205.7, 230.4, 258.0],
    qqqDCA: [100, 105.0, 123.9, 146.2, 172.5, 203.5, 213.7, 252.2, 244.6, 288.6, 262.6, 309.9, 263.4, 310.8, 366.7]
};

const mag7Signals = [
    {
        year: 2011,
        drop: '-28% 回撤',
        driver: '欧债危机导致全球流动性收紧，Mag 7 普遍出现财报指引下调。',
        outcome: '两年持有收益 +45%，龙头凭借现金流重新估值。'
    },
    {
        year: 2015,
        drop: '-25% 回撤',
        driver: '强美元与硬件周期下行，苹果、微软指引保守。',
        outcome: '2016-2017 年云计算扩张使组合收益翻倍。'
    },
    {
        year: 2018,
        drop: '-30% 回撤',
        driver: '美联储加息与贸易摩擦叠加，科技成长股估值压缩。',
        outcome: '持有 24 个月后净值创历史新高，超越 S&P 500 定投 80 个百分点。'
    },
    {
        year: 2020,
        drop: '-35% 回撤',
        driver: '疫情冲击需求与供应链，市场情绪极度悲观。',
        outcome: '2021 年底受益于远程经济与云服务，净值增幅 +65%。'
    },
    {
        year: 2022,
        drop: '-32% 回撤',
        driver: '加息与盈利增速放缓导致估值重估。',
        outcome: '2024 年 AI 主题驱动，策略净值突破 5 倍。'
    }
];

const athleticSignals = [
    {
        year: 2012,
        drop: '-22% 回撤',
        driver: '欧洲债务危机拖累耐克与阿迪达斯渠道，订单削减。',
        outcome: '2013-2014 年全球运动风潮回归，净值修复 +30%。'
    },
    {
        year: 2015,
        drop: '-24% 回撤',
        driver: '北美库存高企与美元升值压缩利润。',
        outcome: '2016-2017 年大中华区与直销渠道驱动，净值反弹 +40%。'
    },
    {
        year: 2018,
        drop: '-26% 回撤',
        driver: '贸易摩擦与批发渠道去库存造成压力。',
        outcome: '2020 年前露露柠檬与线上渠道增长，累计收益 +32%。'
    },
    {
        year: 2020,
        drop: '-30% 回撤',
        driver: '疫情封锁造成门店关闭与供应链延误。',
        outcome: '2022 年复苏后净值重新站上 2.5 倍。'
    },
    {
        year: 2022,
        drop: '-21% 回撤',
        driver: '库存调整与美元走强再度压缩毛利。',
        outcome: '2024 年客单价上调与轻量化产品推动收益 +18%。'
    }
];

const insightsData = [
    {
        title: '科技龙头的反脆弱性',
        detail: '多次深跌后依旧保持高复合增速，核心原因在于现金流、防御型资产负债表以及技术周期的新叙事。'
    },
    {
        title: '行业属性影响修复速度',
        detail: '运动服饰受库存周期与消费信心影响更大，深跌买入虽能捕捉反弹，但需要更长的持有耐心与分散配置。'
    },
    {
        title: '与指数定投互补',
        detail: '策略提供在危机期加仓的纪律，而 S&P 500、QQQ 定投提供基准收益，组合管理上可通过仓位配比平滑波动。'
    }
];

function calcCagr(values) {
    const yearsCount = values.length - 1;
    return Math.pow(values[values.length - 1] / values[0], 1 / yearsCount) - 1;
}

function calcMaxDrawdown(values) {
    let peak = values[0];
    let maxDrawdown = 0;
    values.forEach(value => {
        if (value > peak) {
            peak = value;
        }
        const drawdown = (value - peak) / peak;
        if (drawdown < maxDrawdown) {
            maxDrawdown = drawdown;
        }
    });
    return maxDrawdown;
}

function calcVolatility(values) {
    if (values.length < 2) return 0;
    const returns = [];
    for (let i = 1; i < values.length; i += 1) {
        returns.push(Math.log(values[i] / values[i - 1]));
    }
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1 || 1);
    return Math.sqrt(Math.max(variance, 0));
}

function calcTenYearReturn(values) {
    if (values.length <= 10) {
        return values[values.length - 1] / values[0] - 1;
    }
    const window = values.slice(-10);
    return window[window.length - 1] / window[0] - 1;
}

function formatPercent(value, options = {}) {
    const { sign = false, digits = 1 } = options;
    const percentage = (value * 100).toFixed(digits);
    if (sign && value > 0) {
        return `+${percentage}%`;
    }
    return `${percentage}%`;
}

function createMetricCard({ title, value, description }) {
    const wrapper = document.createElement('div');
    wrapper.className = 'metric-card';

    const titleEl = document.createElement('span');
    titleEl.className = 'metric-title';
    titleEl.textContent = title;

    const valueEl = document.createElement('span');
    valueEl.className = 'metric-value';
    valueEl.textContent = value;

    const descEl = document.createElement('span');
    descEl.className = 'metric-desc';
    descEl.textContent = description;

    wrapper.append(titleEl, valueEl, descEl);
    return wrapper;
}

function renderHeroMetrics(metrics) {
    const container = document.getElementById('heroMetrics');
    metrics.forEach(metric => container.appendChild(createMetricCard(metric)));
}

function renderSignals(containerId, signals) {
    const wrapper = document.getElementById(containerId);
    signals.forEach(signal => {
        const card = document.createElement('article');
        card.className = 'signal-card';

        const year = document.createElement('span');
        year.className = 'signal-year';
        year.textContent = signal.year;

        const drop = document.createElement('span');
        drop.className = 'signal-drop';
        drop.textContent = signal.drop;

        const driver = document.createElement('p');
        driver.className = 'signal-desc';
        driver.textContent = signal.driver;

        const outcome = document.createElement('p');
        outcome.className = 'signal-desc';
        const outcomeLabel = document.createElement('strong');
        outcomeLabel.textContent = '持有结果：';
        outcome.appendChild(outcomeLabel);
        outcome.append(signal.outcome);

        card.append(year, drop, driver, outcome);
        wrapper.appendChild(card);
    });
}

function renderInsights(data) {
    const wrapper = document.getElementById('insights');
    data.forEach(item => {
        const card = document.createElement('article');
        card.className = 'insight-card';

        const title = document.createElement('h3');
        title.textContent = item.title;

        const detail = document.createElement('p');
        detail.textContent = item.detail;

        card.append(title, detail);
        wrapper.appendChild(card);
    });
}

function buildLineChart(ctx, datasets, config = {}) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                y: {
                    title: { display: true, text: '净值 (2010=100)' },
                    grid: { color: 'rgba(148, 163, 184, 0.2)' },
                    ticks: { callback: value => value.toFixed(0) }
                },
                x: {
                    grid: { display: false }
                }
            },
            plugins: {
                legend: {
                    labels: { usePointStyle: true }
                },
                tooltip: {
                    callbacks: {
                        label(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}`;
                        }
                    }
                },
                ...config.plugins
            }
        }
    });
}

function buildMetricsChart(ctx, metrics) {
    const labels = metrics.map(metric => metric.label);
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'CAGR',
                    data: metrics.map(metric => Number((metric.cagr * 100).toFixed(1))),
                    backgroundColor: 'rgba(56, 189, 248, 0.8)'
                },
                {
                    label: '最大回撤 (绝对值)',
                    data: metrics.map(metric => Number(Math.abs(metric.maxDrawdown * 100).toFixed(1))),
                    backgroundColor: 'rgba(249, 115, 22, 0.8)'
                },
                {
                    label: '年化波动率',
                    data: metrics.map(metric => Number((metric.volatility * 100).toFixed(1))),
                    backgroundColor: 'rgba(148, 163, 184, 0.8)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(148, 163, 184, 0.2)' },
                    ticks: {
                        callback: value => `${value}%`
                    }
                },
                x: {
                    grid: { display: false }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { usePointStyle: true }
                }
            }
        }
    });
}

function populateMetricsTable(metrics, signalsCount) {
    const tbody = document.getElementById('metricsTableBody');
    metrics.forEach(metric => {
        const tr = document.createElement('tr');

        const nameTd = document.createElement('td');
        nameTd.textContent = metric.label;

        const cagrTd = document.createElement('td');
        cagrTd.textContent = formatPercent(metric.cagr);

        const drawdownTd = document.createElement('td');
        drawdownTd.textContent = formatPercent(metric.maxDrawdown, { digits: 1 });

        const tenYearTd = document.createElement('td');
        tenYearTd.textContent = formatPercent(metric.tenYearReturn);

        const triggerTd = document.createElement('td');
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = `${signalsCount[metric.id] || 0} 次`;
        triggerTd.appendChild(badge);

        tr.append(nameTd, cagrTd, drawdownTd, tenYearTd, triggerTd);
        tbody.appendChild(tr);
    });
}

function init() {
    const mag7Metrics = {
        label: 'Mag 7 深跌买入',
        id: 'mag7Strategy',
        cagr: calcCagr(series.mag7Strategy),
        maxDrawdown: calcMaxDrawdown(series.mag7Strategy),
        volatility: calcVolatility(series.mag7Strategy),
        tenYearReturn: calcTenYearReturn(series.mag7Strategy)
    };

    const athleticMetrics = {
        label: '运动服饰深跌买入',
        id: 'athleticStrategy',
        cagr: calcCagr(series.athleticStrategy),
        maxDrawdown: calcMaxDrawdown(series.athleticStrategy),
        volatility: calcVolatility(series.athleticStrategy),
        tenYearReturn: calcTenYearReturn(series.athleticStrategy)
    };

    const spMetrics = {
        label: 'S&P 500 定投',
        id: 'sp500DCA',
        cagr: calcCagr(series.sp500DCA),
        maxDrawdown: calcMaxDrawdown(series.sp500DCA),
        volatility: calcVolatility(series.sp500DCA),
        tenYearReturn: calcTenYearReturn(series.sp500DCA)
    };

    const qqqMetrics = {
        label: 'QQQ 定投',
        id: 'qqqDCA',
        cagr: calcCagr(series.qqqDCA),
        maxDrawdown: calcMaxDrawdown(series.qqqDCA),
        volatility: calcVolatility(series.qqqDCA),
        tenYearReturn: calcTenYearReturn(series.qqqDCA)
    };

    const metrics = [mag7Metrics, athleticMetrics, spMetrics, qqqMetrics];

    const heroCards = [
        {
            title: 'Mag 7 策略 CAGR',
            value: formatPercent(mag7Metrics.cagr, { sign: true }),
            description: '2010-2024 复合增长率，显著高于指数定投。'
        },
        {
            title: '最大回撤控制',
            value: formatPercent(mag7Metrics.maxDrawdown, { digits: 1 }),
            description: '危机期的深跌幅度，凸显需要分批进场。'
        },
        {
            title: '超越 S&P 500',
            value: formatPercent(
                series.mag7Strategy[series.mag7Strategy.length - 1] / series.mag7Strategy[0] -
                series.sp500DCA[series.sp500DCA.length - 1] / series.sp500DCA[0],
                { sign: true }
            ),
            description: '相同时间段相对指数的累计超额收益。'
        }
    ];

    renderHeroMetrics(heroCards);
    renderSignals('mag7Signals', mag7Signals);
    renderSignals('athleticSignals', athleticSignals);
    renderInsights(insightsData);

    buildLineChart(
        document.getElementById('mag7Chart'),
        [
            {
                label: 'Mag 7 深跌买入',
                data: series.mag7Strategy,
                borderColor: '#38bdf8',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                borderWidth: 3,
                tension: 0.35
            },
            {
                label: 'S&P 500 定投',
                data: series.sp500DCA,
                borderColor: '#94a3b8',
                backgroundColor: 'rgba(148, 163, 184, 0.15)',
                borderWidth: 2,
                tension: 0.35
            },
            {
                label: 'QQQ 定投',
                data: series.qqqDCA,
                borderColor: '#f97316',
                backgroundColor: 'rgba(249, 115, 22, 0.12)',
                borderWidth: 2,
                tension: 0.35
            }
        ]
    );

    buildLineChart(
        document.getElementById('athleticChart'),
        [
            {
                label: '运动服饰深跌买入',
                data: series.athleticStrategy,
                borderColor: '#22d3ee',
                backgroundColor: 'rgba(34, 211, 238, 0.12)',
                borderWidth: 3,
                tension: 0.35
            },
            {
                label: 'S&P 500 定投',
                data: series.sp500DCA,
                borderColor: '#94a3b8',
                backgroundColor: 'rgba(148, 163, 184, 0.15)',
                borderWidth: 2,
                tension: 0.35
            },
            {
                label: 'QQQ 定投',
                data: series.qqqDCA,
                borderColor: '#f97316',
                backgroundColor: 'rgba(249, 115, 22, 0.12)',
                borderWidth: 2,
                tension: 0.35
            }
        ]
    );

    buildMetricsChart(document.getElementById('metricsChart'), metrics);

    populateMetricsTable(metrics, {
        mag7Strategy: mag7Signals.length,
        athleticStrategy: athleticSignals.length,
        sp500DCA: 0,
        qqqDCA: 0
    });
}

document.addEventListener('DOMContentLoaded', init);
