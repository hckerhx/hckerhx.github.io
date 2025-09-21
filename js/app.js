const years = Array.from({ length: 15 }, (_, idx) => 2010 + idx);

const series = {
    mag7Strategy: [100, 88, 110, 145, 180, 150, 210, 270, 210, 310, 230, 380, 290, 420, 520],
    athleticStrategy: [100, 90, 105, 125, 150, 135, 165, 200, 170, 220, 180, 250, 210, 260, 310],
    sp500DCA: [100, 104.0, 116.5, 130.5, 146.2, 152.0, 170.2, 190.6, 198.2, 222.0, 195.4, 218.8, 205.7, 230.4, 258.0],
    qqqDCA: [100, 105.0, 123.9, 146.2, 172.5, 203.5, 213.7, 252.2, 244.6, 288.6, 262.6, 309.9, 263.4, 310.8, 366.7]
};

const strategyLabels = {
    mag7Strategy: { zh: 'Mag 7 深跌买入', en: 'Mag 7 Tactical Drawdown' },
    athleticStrategy: { zh: '运动服饰深跌买入', en: 'Athletic Leaders Drawdown' },
    sp500DCA: { zh: 'S&P 500 定投', en: 'S&P 500 DCA' },
    qqqDCA: { zh: 'QQQ 定投', en: 'QQQ DCA' }
};

const translations = {
    zh: {
        htmlLang: 'zh-CN',
        documentTitle: '头部公司深跌买入策略实验室',
        languageSwitcherAria: '语言切换',
        hero: {
            label: '策略可视化平台',
            title: '头部公司深跌买入策略实验室',
            subtitle: '当Mag 7与运动服饰行业龙头因宏观或财报事件急跌超过20%时逆向加仓，持有2-3年，并与长期定投 S&P 500 与 QQQ的收益表现进行对比。',
            cards: [
                {
                    title: 'Mag 7 策略 CAGR',
                    description: '2010-2024 复合增长率，显著高于指数定投。',
                    valueKey: 'mag7Cagr'
                },
                {
                    title: '最大回撤控制',
                    description: '危机期的深跌幅度，凸显需要分批进场。',
                    valueKey: 'mag7Drawdown'
                },
                {
                    title: '超越 S&P 500',
                    description: '相同时间段相对指数的累计超额收益。',
                    valueKey: 'mag7Excess'
                }
            ]
        },
        sections: {
            assumptionsTitle: '策略核心假设',
            assumptionsItems: [
                '聚焦具备稳定盈利和技术护城河的头部公司。',
                '当股价在一个季度内回撤超过20%时触发“深跌买入”。',
                '分批买入后持有2-3年，等待业绩与估值修复。',
                '持仓收益与 S&P 500、QQQ 定投结果进行长期对照。'
            ],
            methodologyTitle: '数据与方法',
            methodologyBody: '历史回测区间覆盖2010-2024年。为突出策略的节奏与风险，我们将关键事件时间线、组合净值走势与核心指标一并呈现。定投参考组合假设每年等额投入并按年度再平衡，数据经过平滑处理以便突出相对趋势。',
            methodologyTag: '结果以100为初始净值，数值为示意回测。',
            mag7Title: 'Mag 7 策略 vs. 指数定投',
            mag7Intro: '深跌买入策略在科技龙头上的表现显示出极强的反弹弹性，尤其在2020年疫情与2022年估值纠偏后，净值恢复速度明显快于被动定投组合。',
            athleticTitle: '运动服饰龙头回撤买入表现',
            athleticIntro: '该策略在耐克、阿迪达斯、露露柠檬等龙头上同样呈现有效性，但周期性需求与库存周期使得回撤修复速度略慢于Mag 7。',
            metricsTitle: '核心指标对比',
            metricsIntro: '通过CAGR、最大回撤与收益稳定性，观察策略在不同资产池的风险收益特征，并与被动定投方案形成直观对照。',
            insightsTitle: '策略洞察'
        },
        table: {
            headers: {
                strategy: '策略',
                cagr: 'CAGR',
                maxDrawdown: '最大回撤',
                tenYear: '十年总收益',
                triggers: '触发次数'
            },
            triggerUnit: '次'
        },
        charts: {
            navLabel: '净值 (2010=100)',
            metricsYAxis: '百分比 (%)',
            datasetLabels: {
                cagr: 'CAGR',
                maxDrawdown: '最大回撤 (绝对值)',
                volatility: '年化波动率'
            },
            mag7Aria: 'Mag 7 策略与指数定投对比折线图',
            athleticAria: '运动服饰策略与指数定投对比折线图',
            metricsAria: '策略核心指标柱状图'
        },
        holdResultLabel: '持有结果：',
        footer: {
            note: '数据用于策略示意，投资需结合实际财务状况与风险承受能力。'
        }
    },
    en: {
        htmlLang: 'en',
        documentTitle: 'Tactical Drawdown Strategy Lab for Market Leaders',
        languageSwitcherAria: 'Language toggle',
        hero: {
            label: 'Strategy Visualization Lab',
            title: 'Tactical Drawdown Strategy Lab for Market Leaders',
            subtitle: 'Buy aggressively when Mag 7 and athletic leaders plunge more than 20% on macro or earnings shocks, hold for 2-3 years, and compare against long-term DCA into the S&P 500 and QQQ.',
            cards: [
                {
                    title: 'Mag 7 Strategy CAGR',
                    description: 'Compound growth rate from 2010-2024, well above passive DCA.',
                    valueKey: 'mag7Cagr'
                },
                {
                    title: 'Drawdown Discipline',
                    description: 'Depth of crisis pullbacks underscores the need to stage entries.',
                    valueKey: 'mag7Drawdown'
                },
                {
                    title: 'Excess vs. S&P 500',
                    description: 'Cumulative outperformance versus an S&P 500 DCA baseline.',
                    valueKey: 'mag7Excess'
                }
            ]
        },
        sections: {
            assumptionsTitle: 'Core Strategy Assumptions',
            assumptionsItems: [
                'Focus on market leaders with resilient earnings and durable moats.',
                'Trigger tactical entries when prices fall more than 20% within a quarter.',
                'Scale in, hold 2-3 years, and wait for fundamentals and valuation to repair.',
                'Benchmark performance against long-horizon DCA in the S&P 500 and QQQ.'
            ],
            methodologyTitle: 'Data & Methodology',
            methodologyBody: 'The illustrative backtest spans 2010-2024. To highlight cadence and risk, we pair trigger timelines, portfolio value paths, and key metrics. The DCA baselines invest equal amounts annually with yearly rebalancing, and curves are smoothed to emphasize relative trends.',
            methodologyTag: 'Results assume 100 starting NAV; values are illustrative.',
            mag7Title: 'Mag 7 Strategy vs. Index DCA',
            mag7Intro: 'The drawdown-buy discipline shows powerful rebound elasticity in mega-cap tech, especially after the 2020 pandemic shock and 2022 de-rating, with NAV recovering faster than passive DCA.',
            athleticTitle: 'Athletic Leaders Drawdown Performance',
            athleticIntro: 'The approach also works for Nike, Adidas, and Lululemon, though cyclical demand and inventory turns mean recoveries trail the Mag 7 cohort.',
            metricsTitle: 'Key Metrics Comparison',
            metricsIntro: 'Review CAGR, max drawdown, and return stability to understand risk-reward across universes versus passive DCA.',
            insightsTitle: 'Strategy Insights'
        },
        table: {
            headers: {
                strategy: 'Strategy',
                cagr: 'CAGR',
                maxDrawdown: 'Max Drawdown',
                tenYear: '10-Year Return',
                triggers: 'Trigger Count'
            },
            triggerUnit: 'triggers'
        },
        charts: {
            navLabel: 'NAV (2010 = 100)',
            metricsYAxis: 'Percentage (%)',
            datasetLabels: {
                cagr: 'CAGR',
                maxDrawdown: 'Max Drawdown (abs)',
                volatility: 'Annual Volatility'
            },
            mag7Aria: 'Line chart comparing the Mag 7 strategy with index DCA baselines',
            athleticAria: 'Line chart comparing the athletic strategy with index DCA baselines',
            metricsAria: 'Bar chart showing core strategy metrics'
        },
        holdResultLabel: 'Holding outcome:',
        footer: {
            note: 'Data are illustrative; align decisions with your financial situation and risk tolerance.'
        }
    }
};

const mag7Signals = [
    {
        year: 2011,
        drop: { zh: '-28% 回撤', en: '-28% drawdown' },
        driver: {
            zh: '欧债危机导致全球流动性收紧，Mag 7 普遍出现财报指引下调。',
            en: 'Eurozone stress drained global liquidity and Mag 7 guidance trended lower.'
        },
        outcome: {
            zh: '两年持有收益 +45%，龙头凭借现金流重新估值。',
            en: 'Two-year hold delivered +45% as cash-flow strength drove a re-rating.'
        }
    },
    {
        year: 2015,
        drop: { zh: '-25% 回撤', en: '-25% drawdown' },
        driver: {
            zh: '强美元与硬件周期下行，苹果、微软指引保守。',
            en: 'A strong dollar and hardware slump led Apple and Microsoft to guide cautiously.'
        },
        outcome: {
            zh: '2016-2017 年云计算扩张使组合收益翻倍。',
            en: 'Cloud expansion through 2016-2017 doubled portfolio value.'
        }
    },
    {
        year: 2018,
        drop: { zh: '-30% 回撤', en: '-30% drawdown' },
        driver: {
            zh: '美联储加息与贸易摩擦叠加，科技成长股估值压缩。',
            en: 'Fed tightening plus trade tensions compressed growth-stock multiples.'
        },
        outcome: {
            zh: '持有 24 个月后净值创历史新高，超越 S&P 500 定投 80 个百分点。',
            en: 'After 24 months NAV hit new highs, topping S&P 500 DCA by 80 ppts.'
        }
    },
    {
        year: 2020,
        drop: { zh: '-35% 回撤', en: '-35% drawdown' },
        driver: {
            zh: '疫情冲击需求与供应链，市场情绪极度悲观。',
            en: 'Pandemic demand shock and supply-chain disruption crushed sentiment.'
        },
        outcome: {
            zh: '2021 年底受益于远程经济与云服务，净值增幅 +65%。',
            en: 'By late 2021 remote-economy tailwinds lifted NAV by +65%.'
        }
    },
    {
        year: 2022,
        drop: { zh: '-32% 回撤', en: '-32% drawdown' },
        driver: {
            zh: '加息与盈利增速放缓导致估值重估。',
            en: 'Rising rates and slower earnings growth forced a valuation reset.'
        },
        outcome: {
            zh: '2024 年 AI 主题驱动，策略净值突破 5 倍。',
            en: 'AI enthusiasm by 2024 pushed strategy NAV past 5x.'
        }
    }
];

const athleticSignals = [
    {
        year: 2012,
        drop: { zh: '-22% 回撤', en: '-22% drawdown' },
        driver: {
            zh: '欧洲债务危机拖累耐克与阿迪达斯渠道，订单削减。',
            en: 'Euro debt turmoil cut Nike and Adidas orders across channels.'
        },
        outcome: {
            zh: '2013-2014 年全球运动风潮回归，净值修复 +30%。',
            en: '2013-2014 global athleisure rebound restored NAV by +30%.'
        }
    },
    {
        year: 2015,
        drop: { zh: '-24% 回撤', en: '-24% drawdown' },
        driver: {
            zh: '北美库存高企与美元升值压缩利润。',
            en: 'North American inventory and a stronger dollar squeezed margins.'
        },
        outcome: {
            zh: '2016-2017 年大中华区与直销渠道驱动，净值反弹 +40%。',
            en: 'Greater China and direct-to-consumer growth in 2016-2017 lifted NAV +40%.'
        }
    },
    {
        year: 2018,
        drop: { zh: '-26% 回撤', en: '-26% drawdown' },
        driver: {
            zh: '贸易摩擦与批发渠道去库存造成压力。',
            en: 'Trade frictions and wholesale destocking created pressure.'
        },
        outcome: {
            zh: '2020 年前露露柠檬与线上渠道增长，累计收益 +32%。',
            en: 'Lululemon and digital growth through 2020 delivered +32% cumulative gains.'
        }
    },
    {
        year: 2020,
        drop: { zh: '-30% 回撤', en: '-30% drawdown' },
        driver: {
            zh: '疫情封锁造成门店关闭与供应链延误。',
            en: 'Lockdowns closed stores and delayed supply chains.'
        },
        outcome: {
            zh: '2022 年复苏后净值重新站上 2.5 倍。',
            en: 'Post-2022 reopening lifted NAV back above 2.5x.'
        }
    },
    {
        year: 2022,
        drop: { zh: '-21% 回撤', en: '-21% drawdown' },
        driver: {
            zh: '库存调整与美元走强再度压缩毛利。',
            en: 'Inventory resets and a stronger dollar squeezed gross margins again.'
        },
        outcome: {
            zh: '2024 年客单价上调与轻量化产品推动收益 +18%。',
            en: 'By 2024 higher ticket sizes and lighter products added +18%.'
        }
    }
];

const insightsData = [
    {
        title: { zh: '科技龙头的反脆弱性', en: 'Anti-fragility of Tech Leaders' },
        detail: {
            zh: '多次深跌后依旧保持高复合增速，核心原因在于现金流、防御型资产负债表以及技术周期的新叙事。',
            en: 'Repeated drawdowns still compound strongly thanks to cash flow, fortress balance sheets, and new tech narratives.'
        }
    },
    {
        title: { zh: '行业属性影响修复速度', en: 'Industry Traits Shape Recovery Speed' },
        detail: {
            zh: '运动服饰受库存周期与消费信心影响更大，深跌买入虽能捕捉反弹，但需要更长的持有耐心与分散配置。',
            en: 'Athletic wear depends heavily on inventory cycles and sentiment, so rebounds take patience and diversified exposure.'
        }
    },
    {
        title: { zh: '与指数定投互补', en: 'Complementary to Index DCA' },
        detail: {
            zh: '策略提供在危机期加仓的纪律，而 S&P 500、QQQ 定投提供基准收益，组合管理上可通过仓位配比平滑波动。',
            en: 'The strategy enforces crisis buying while S&P 500 and QQQ DCA deliver baseline growth; position sizing helps smooth volatility.'
        }
    }
];

const state = {
    metrics: [],
    metricsById: {},
    heroValues: {},
    signalCounts: {}
};

const charts = {
    mag7: null,
    athletic: null,
    metrics: null
};

let currentLanguage = 'zh';

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

function renderHeroMetrics(cards) {
    const container = document.getElementById('heroMetrics');
    container.innerHTML = '';
    cards.forEach(metric => container.appendChild(createMetricCard(metric)));
}

function renderSignals(containerId, signals, lang, holdLabel) {
    const wrapper = document.getElementById(containerId);
    wrapper.innerHTML = '';
    signals.forEach(signal => {
        const card = document.createElement('article');
        card.className = 'signal-card';

        const year = document.createElement('span');
        year.className = 'signal-year';
        year.textContent = signal.year;

        const drop = document.createElement('span');
        drop.className = 'signal-drop';
        drop.textContent = signal.drop[lang];

        const driver = document.createElement('p');
        driver.className = 'signal-desc';
        driver.textContent = signal.driver[lang];

        const outcome = document.createElement('p');
        outcome.className = 'signal-desc';
        const outcomeLabel = document.createElement('strong');
        outcomeLabel.textContent = holdLabel;
        outcome.appendChild(outcomeLabel);
        const prefix = lang === 'zh' ? '' : ' ';
        outcome.append(`${prefix}${signal.outcome[lang]}`);

        card.append(year, drop, driver, outcome);
        wrapper.appendChild(card);
    });
}

function renderInsights(data, lang) {
    const wrapper = document.getElementById('insights');
    wrapper.innerHTML = '';
    data.forEach(item => {
        const card = document.createElement('article');
        card.className = 'insight-card';

        const title = document.createElement('h3');
        title.textContent = item.title[lang];

        const detail = document.createElement('p');
        detail.textContent = item.detail[lang];

        card.append(title, detail);
        wrapper.appendChild(card);
    });
}

function buildLineChart(ctx, datasets, options = {}) {
    const { yAxisLabel } = options;
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
                    title: { display: true, text: yAxisLabel || '' },
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
                }
            }
        }
    });
}

function buildMetricsChart(ctx, metrics, config) {
    const { labels, datasetLabels, yAxisLabel } = config;
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: datasetLabels.cagr,
                    data: metrics.map(metric => Number((metric.cagr * 100).toFixed(1))),
                    backgroundColor: 'rgba(56, 189, 248, 0.8)'
                },
                {
                    label: datasetLabels.maxDrawdown,
                    data: metrics.map(metric => Number(Math.abs(metric.maxDrawdown * 100).toFixed(1))),
                    backgroundColor: 'rgba(249, 115, 22, 0.8)'
                },
                {
                    label: datasetLabels.volatility,
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
                    title: { display: true, text: yAxisLabel || '' },
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

function populateMetricsTable(metrics, signalsCount, lang, triggerUnit) {
    const tbody = document.getElementById('metricsTableBody');
    tbody.innerHTML = '';
    metrics.forEach(metric => {
        const tr = document.createElement('tr');

        const nameTd = document.createElement('td');
        nameTd.textContent = strategyLabels[metric.id][lang];

        const cagrTd = document.createElement('td');
        cagrTd.textContent = formatPercent(metric.cagr);

        const drawdownTd = document.createElement('td');
        drawdownTd.textContent = formatPercent(metric.maxDrawdown, { digits: 1 });

        const tenYearTd = document.createElement('td');
        tenYearTd.textContent = formatPercent(metric.tenYearReturn);

        const triggerTd = document.createElement('td');
        const badge = document.createElement('span');
        badge.className = 'badge';
        const count = signalsCount[metric.id] || 0;
        badge.textContent = lang === 'zh' ? `${count}${triggerUnit}` : `${count} ${triggerUnit}`;
        triggerTd.appendChild(badge);

        tr.append(nameTd, cagrTd, drawdownTd, tenYearTd, triggerTd);
        tbody.appendChild(tr);
    });
}

function getTranslation(lang, path) {
    return path.split('.').reduce((acc, key) => (acc !== undefined ? acc[key] : undefined), translations[lang]);
}

function translateStatic(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.dataset.i18n;
        const value = getTranslation(lang, key);
        if (typeof value === 'string') {
            element.textContent = value;
        }
    });
}

function renderHeroMetricsSection(lang) {
    const cardsCopy = translations[lang].hero.cards;
    const cards = cardsCopy.map(card => ({
        title: card.title,
        description: card.description,
        value: state.heroValues[card.valueKey]
    }));
    renderHeroMetrics(cards);
}

function renderSignalsSection(lang) {
    renderSignals('mag7Signals', mag7Signals, lang, translations[lang].holdResultLabel);
    renderSignals('athleticSignals', athleticSignals, lang, translations[lang].holdResultLabel);
}

function renderInsightsSection(lang) {
    renderInsights(insightsData, lang);
}

function renderCharts(lang) {
    if (charts.mag7) charts.mag7.destroy();
    charts.mag7 = buildLineChart(
        document.getElementById('mag7Chart'),
        [
            {
                label: strategyLabels.mag7Strategy[lang],
                data: series.mag7Strategy,
                borderColor: '#38bdf8',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                borderWidth: 3,
                tension: 0.35
            },
            {
                label: strategyLabels.sp500DCA[lang],
                data: series.sp500DCA,
                borderColor: '#94a3b8',
                backgroundColor: 'rgba(148, 163, 184, 0.15)',
                borderWidth: 2,
                tension: 0.35
            },
            {
                label: strategyLabels.qqqDCA[lang],
                data: series.qqqDCA,
                borderColor: '#f97316',
                backgroundColor: 'rgba(249, 115, 22, 0.12)',
                borderWidth: 2,
                tension: 0.35
            }
        ],
        { yAxisLabel: translations[lang].charts.navLabel }
    );

    if (charts.athletic) charts.athletic.destroy();
    charts.athletic = buildLineChart(
        document.getElementById('athleticChart'),
        [
            {
                label: strategyLabels.athleticStrategy[lang],
                data: series.athleticStrategy,
                borderColor: '#22d3ee',
                backgroundColor: 'rgba(34, 211, 238, 0.12)',
                borderWidth: 3,
                tension: 0.35
            },
            {
                label: strategyLabels.sp500DCA[lang],
                data: series.sp500DCA,
                borderColor: '#94a3b8',
                backgroundColor: 'rgba(148, 163, 184, 0.15)',
                borderWidth: 2,
                tension: 0.35
            },
            {
                label: strategyLabels.qqqDCA[lang],
                data: series.qqqDCA,
                borderColor: '#f97316',
                backgroundColor: 'rgba(249, 115, 22, 0.12)',
                borderWidth: 2,
                tension: 0.35
            }
        ],
        { yAxisLabel: translations[lang].charts.navLabel }
    );

    if (charts.metrics) charts.metrics.destroy();
    charts.metrics = buildMetricsChart(
        document.getElementById('metricsChart'),
        state.metrics,
        {
            labels: state.metrics.map(metric => strategyLabels[metric.id][lang]),
            datasetLabels: translations[lang].charts.datasetLabels,
            yAxisLabel: translations[lang].charts.metricsYAxis
        }
    );
}

function renderTable(lang) {
    populateMetricsTable(state.metrics, state.signalCounts, lang, translations[lang].table.triggerUnit);
}

function updateAriaLabels(lang) {
    document.getElementById('mag7Chart').setAttribute('aria-label', translations[lang].charts.mag7Aria);
    document.getElementById('athleticChart').setAttribute('aria-label', translations[lang].charts.athleticAria);
    document.getElementById('metricsChart').setAttribute('aria-label', translations[lang].charts.metricsAria);
    const switcher = document.querySelector('.language-switcher');
    if (switcher) {
        switcher.setAttribute('aria-label', translations[lang].languageSwitcherAria);
    }
}

function setLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = translations[lang].htmlLang;
    document.title = translations[lang].documentTitle;

    document.querySelectorAll('.lang-button').forEach(button => {
        button.classList.toggle('active', button.dataset.lang === lang);
    });

    translateStatic(lang);
    renderHeroMetricsSection(lang);
    renderSignalsSection(lang);
    renderInsightsSection(lang);
    renderCharts(lang);
    renderTable(lang);
    updateAriaLabels(lang);
}

function setupLanguageSwitcher() {
    document.querySelectorAll('.lang-button').forEach(button => {
        button.addEventListener('click', () => {
            const { lang } = button.dataset;
            if (lang && lang !== currentLanguage) {
                setLanguage(lang);
            }
        });
    });
}

function init() {
    const metrics = [
        {
            id: 'mag7Strategy',
            cagr: calcCagr(series.mag7Strategy),
            maxDrawdown: calcMaxDrawdown(series.mag7Strategy),
            volatility: calcVolatility(series.mag7Strategy),
            tenYearReturn: calcTenYearReturn(series.mag7Strategy)
        },
        {
            id: 'athleticStrategy',
            cagr: calcCagr(series.athleticStrategy),
            maxDrawdown: calcMaxDrawdown(series.athleticStrategy),
            volatility: calcVolatility(series.athleticStrategy),
            tenYearReturn: calcTenYearReturn(series.athleticStrategy)
        },
        {
            id: 'sp500DCA',
            cagr: calcCagr(series.sp500DCA),
            maxDrawdown: calcMaxDrawdown(series.sp500DCA),
            volatility: calcVolatility(series.sp500DCA),
            tenYearReturn: calcTenYearReturn(series.sp500DCA)
        },
        {
            id: 'qqqDCA',
            cagr: calcCagr(series.qqqDCA),
            maxDrawdown: calcMaxDrawdown(series.qqqDCA),
            volatility: calcVolatility(series.qqqDCA),
            tenYearReturn: calcTenYearReturn(series.qqqDCA)
        }
    ];

    state.metrics = metrics;
    state.metricsById = metrics.reduce((acc, metric) => {
        acc[metric.id] = metric;
        return acc;
    }, {});
    state.signalCounts = {
        mag7Strategy: mag7Signals.length,
        athleticStrategy: athleticSignals.length,
        sp500DCA: 0,
        qqqDCA: 0
    };

    const mag7TotalReturn = series.mag7Strategy[series.mag7Strategy.length - 1] / series.mag7Strategy[0] - 1;
    const spTotalReturn = series.sp500DCA[series.sp500DCA.length - 1] / series.sp500DCA[0] - 1;

    state.heroValues = {
        mag7Cagr: formatPercent(state.metricsById.mag7Strategy.cagr, { sign: true }),
        mag7Drawdown: formatPercent(state.metricsById.mag7Strategy.maxDrawdown, { digits: 1 }),
        mag7Excess: formatPercent(mag7TotalReturn - spTotalReturn, { sign: true })
    };

    setupLanguageSwitcher();
    setLanguage(currentLanguage);
}

document.addEventListener('DOMContentLoaded', init);
