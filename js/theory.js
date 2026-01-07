const years = Array.from({ length: 15 }, (_, idx) => 2010 + idx);

const series = {
    mag7Strategy: [100, 88, 110, 145, 180, 150, 210, 270, 210, 310, 230, 380, 290, 420, 520],
    sp500DCA: [100, 104.0, 116.5, 130.5, 146.2, 152.0, 170.2, 190.6, 198.2, 222.0, 195.4, 218.8, 205.7, 230.4, 258.0],
    qqqDCA: [100, 105.0, 123.9, 146.2, 172.5, 203.5, 213.7, 252.2, 244.6, 288.6, 262.6, 309.9, 263.4, 310.8, 366.7]
};

const DEFAULT_INVESTMENT_AMOUNT = 10000;

const strategyLabels = {
    mag7Strategy: { zh: 'Mag 7 深跌买入', en: 'Mag 7 Tactical Drawdown' },
    sp500DCA: { zh: 'S&P 500 定投', en: 'S&P 500 DCA' },
    qqqDCA: { zh: 'QQQ 定投', en: 'QQQ DCA' }
};

const translations = {
    zh: {
        htmlLang: 'zh-CN',
        documentTitle: '头部公司深跌买入策略实验室',
        languageSwitcherAria: '语言切换',
        nav: {
            aria: '页面导航',
            monitor: '下跌监控',
            theory: '策略理论'
        },
        hero: {
            label: '策略可视化平台',
            title: '头部公司深跌买入策略实验室',
            subtitle: '当Mag 7 科技龙头因宏观或财报事件急跌超过20%时逆向加仓，持有2-3年，并与长期定投 S&P 500 与 QQQ 的表现进行对比，同时跟踪实时组合净值。',
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
            timelineTitle: 'Mag 7 策略操作时间线',
            timelineIntro: '追踪每次深跌买入的触发背景、加仓节奏与持有结果，理解策略在不同宏观周期下的执行细节。',
            liveTitle: '实时组合净值对比',
            liveIntro: '通过接入 Yahoo Finance API，等权跟踪 Mag 7 组合，并与 SPY、QQQ 的日内表现进行实时比较。',
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
            metricsAria: '策略核心指标柱状图'
        },
        timeline: {
            contextLabel: '背景',
            actionLabel: '执行',
            resultLabel: '持有结果'
        },
        live: {
            mag7Title: 'Mag 7 等权组合',
            spTitle: 'S&P 500 (SPY)',
            qqqTitle: '纳斯达克 100 (QQQ)',
            valueLabel: '当前指数',
            changeLabel: '日内变动',
            updated: '数据更新：',
            error: '无法从 Yahoo Finance 获取实时数据，请稍后重试。'
        },
        investment: {
            title: '投入金额推演',
            intro: '输入计划投入金额，系统将按照历次回撤事件给出分批买入与持有的参考方案。',
            formLabel: '计划投入金额 (USD)',
            helper: '请输入正数金额，建议以美元为单位。',
            submit: '生成操作建议',
            placeholder: '例如 10000',
            summary: '总投入 {amount}，覆盖 {count} 次触发事件。',
            dropLabel: '触发条件：{drop}',
            stepLabel: '步骤 {index}',
            stepAmount: '投入：{amount}（约 {percentage}%）',
            holdLabel: '持有建议：',
            invalid: '请输入正数金额。'
        },
        subscription: {
            title: '邮件提醒订阅',
            intro: '留下邮箱，当策略再次触发深跌买入信号或组合出现显著波动时即时接收提醒。',
            emailLabel: '邮箱地址',
            submit: '订阅提醒',
            placeholder: 'you@example.com',
            success: '已为 {email} 开通提醒，未来有新的触发事件将第一时间通知。',
            invalid: '请输入有效的邮箱地址。'
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
        nav: {
            aria: 'Site navigation',
            monitor: 'Drawdown Monitor',
            theory: 'Strategy Theory'
        },
        hero: {
            label: 'Strategy Visualization Lab',
            title: 'Tactical Drawdown Strategy Lab for Market Leaders',
            subtitle: 'Buy aggressively when Mag 7 leaders plunge more than 20% on macro or earnings shocks, hold for 2-3 years, benchmark against long-term DCA in the S&P 500 and QQQ, and monitor live portfolio values.',
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
            timelineTitle: 'Mag 7 Trade Timeline',
            timelineIntro: 'Follow each deep-drawdown entry, the macro catalyst behind it, execution cadence, and holding outcome across market cycles.',
            liveTitle: 'Live Portfolio Value Check',
            liveIntro: 'Connect to the Yahoo Finance API to track an equal-weight Mag 7 basket in real time against SPY and QQQ intraday moves.',
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
            metricsAria: 'Bar chart showing core strategy metrics'
        },
        timeline: {
            contextLabel: 'Backdrop',
            actionLabel: 'Execution',
            resultLabel: 'Outcome'
        },
        live: {
            mag7Title: 'Mag 7 Equal-Weight Basket',
            spTitle: 'S&P 500 (SPY)',
            qqqTitle: 'NASDAQ 100 (QQQ)',
            valueLabel: 'Current Index',
            changeLabel: 'Day Move',
            updated: 'Last updated: ',
            error: 'Unable to reach Yahoo Finance right now. Please try again later.'
        },
        investment: {
            title: 'Investment Deployment Planner',
            intro: 'Enter your capital commitment to see how each historical drawdown would stage entries and holding guidance.',
            formLabel: 'Planned Capital (USD)',
            helper: 'Use a positive number, ideally in US dollars.',
            submit: 'Generate Action Plan',
            placeholder: 'e.g. 10000',
            summary: 'Total capital {amount} allocated across {count} strategy events.',
            dropLabel: 'Trigger: {drop}',
            stepLabel: 'Step {index}',
            stepAmount: 'Deploy {amount} (~{percentage}%)',
            holdLabel: 'Holding guidance:',
            invalid: 'Enter a positive investment amount.'
        },
        subscription: {
            title: 'Email Alert Subscription',
            intro: 'Share your email to receive alerts whenever deep-drawdown signals fire or the live portfolio swings sharply.',
            emailLabel: 'Email address',
            submit: 'Subscribe',
            placeholder: 'you@example.com',
            success: 'Alerts will reach {email} the next time signals fire.',
            invalid: 'Please provide a valid email address.'
        },
        holdResultLabel: 'Holding outcome:',
        footer: {
            note: 'Data are illustrative; align decisions with your financial situation and risk tolerance.'
        }
    }
};

const timelineEvents = [
    {
        date: '2011-08',
        title: { zh: '欧债危机流动性收紧', en: 'Eurozone Liquidity Shock' },
        drop: { zh: '-28% 回撤触发', en: '-28% drawdown trigger' },
        context: {
            zh: '欧债危机导致全球流动性收紧，苹果、微软、亚马逊纷纷下调营收指引。',
            en: 'Eurozone stress drained liquidity and Apple, Microsoft, Amazon cut revenue guidance.'
        },
        plan: {
            steps: [
                {
                    percentage: 0.4,
                    description: {
                        zh: '首周按等权买入 AAPL、MSFT、GOOGL，占用总资金40%，在恐慌情绪中快速建立核心仓位。',
                        en: 'Deploy 40% equally into AAPL, MSFT, and GOOGL in week one to anchor the panic lows.'
                    }
                },
                {
                    percentage: 0.35,
                    description: {
                        zh: '第二周若波动率维持高位，再投入35%加仓同样标的，利用波动回吐摊低成本。',
                        en: 'Add another 35% the following week while volatility stays elevated, repeating the equal-weight mix to average in.'
                    }
                },
                {
                    percentage: 0.25,
                    description: {
                        zh: '剩余25%放在第三周，逢回调补齐并通过卖出看跌期权获取权利金对冲波动。',
                        en: 'Use the final 25% in week three on additional weakness and finance the entry by writing selective puts.'
                    }
                }
            ],
            hold: {
                zh: '持有18-24个月，跟踪盈利指引恢复节奏逐步收割估值修复。',
                en: 'Hold 18-24 months and let improving guidance drive the re-rating.'
            }
        },
        execution: {
            zh: '等权加仓 AAPL、MSFT、GOOGL，三周内完成分批建仓并同时卖出隐含波动率。',
            en: 'Scaled into equal-weight AAPL, MSFT, and GOOGL over three weeks while harvesting implied vol.'
        },
        outcome: {
            zh: '两年持有收益 +45%，龙头凭借现金流重新估值。',
            en: 'Two-year hold delivered +45% as cash-flow strength drove a re-rating.'
        }
    },
    {
        date: '2015-09',
        title: { zh: '强美元压制硬件周期', en: 'Dollar Surge Hits Hardware Cycle' },
        drop: { zh: '-25% 回撤触发', en: '-25% drawdown trigger' },
        context: {
            zh: '强美元与 PC/手机换机疲软，微软与苹果的盈利预期同步下修。',
            en: 'A surging dollar and weak PC/mobile refresh cycle pulled Microsoft and Apple guidance lower.'
        },
        plan: {
            steps: [
                {
                    percentage: 0.35,
                    description: {
                        zh: '首月以 NVDA、MSFT、AMZN 为核心投入35%，优先锁定云计算与数据中心主线。',
                        en: 'Commit 35% in the first month to NVDA, MSFT, and AMZN to secure cloud and data-center exposure.'
                    }
                },
                {
                    percentage: 0.3,
                    description: {
                        zh: '当美元指数回落或盈利指引趋稳时，再投入30%继续加仓 NVDA 与 AMZN。',
                        en: 'Allocate another 30% once the dollar cools or guidance stabilizes, leaning into NVDA and AMZN.'
                    }
                },
                {
                    percentage: 0.35,
                    description: {
                        zh: '最后35%分散于 META、TSLA 等高波动标的，并保留部分现金等待财报确认。',
                        en: 'Distribute the final 35% across META and TSLA while keeping a cash buffer until earnings confirm the turn.'
                    }
                }
            ],
            hold: {
                zh: '至少持有24个月，关注云支出与数据中心扩张的兑现节奏。',
                en: 'Hold roughly two years while cloud and data-center capex accelerates.'
            }
        },
        execution: {
            zh: '在财报空窗期内逐步买入 NVDA、MSFT、AMZN，同时将 META、TSLA 控制在较低权重。',
            en: 'Accumulated NVDA, MSFT, and AMZN through the earnings quiet period while keeping META and TSLA lighter.'
        },
        outcome: {
            zh: '2016-2017 年云计算扩张使组合收益翻倍。',
            en: 'Cloud expansion through 2016-2017 doubled portfolio value.'
        }
    },
    {
        date: '2018-12',
        title: { zh: '贸易摩擦与加息共振', en: 'Trade Tensions Meet Fed Tightening' },
        drop: { zh: '-30% 回撤触发', en: '-30% drawdown trigger' },
        context: {
            zh: '美联储持续加息与贸易摩擦叠加，成长股估值被系统性压缩。',
            en: 'Aggressive Fed hikes and trade disputes compressed growth valuations across the board.'
        },
        plan: {
            steps: [
                {
                    percentage: 0.3,
                    description: {
                        zh: '第一周投入30%，全面覆盖 Mag 7，建立基准仓位对冲继续下行风险。',
                        en: 'Deploy 30% across the full Mag 7 basket in week one to set the core hedge against further downside.'
                    }
                },
                {
                    percentage: 0.4,
                    description: {
                        zh: '随后两周按“三批法”再投入40%，通过分批抬高均价平滑波动。',
                        en: 'Add 40% over the next two weeks with a three-tranche schedule to smooth volatility.'
                    }
                },
                {
                    percentage: 0.3,
                    description: {
                        zh: '保留30%在期权到期前补仓，并卖出 QQQ 看跌期权获取额外权利金。',
                        en: 'Use the remaining 30% before option expiry, topping up on dips while shorting QQQ puts for premium.'
                    }
                }
            ],
            hold: {
                zh: '持有约24个月，每年再平衡一次，锁定相对指数 80 个百分点的优势。',
                en: 'Hold about 24 months and rebalance annually to lock in the 80ppt spread versus the index.'
            }
        },
        execution: {
            zh: '分三批买入所有 Mag 7 成员，并通过卖出 QQQ 看跌期权获取额外权利金。',
            en: 'Added all Mag 7 names in three tranches and monetized QQQ puts for extra premium.'
        },
        outcome: {
            zh: '持有 24 个月后净值创历史新高，超越 S&P 500 定投 80 个百分点。',
            en: 'After 24 months NAV hit new highs, topping S&P 500 DCA by 80 ppts.'
        }
    },
    {
        date: '2020-03',
        title: { zh: '疫情冲击远程经济崛起', en: 'Pandemic Shock, Remote Boom' },
        drop: { zh: '-35% 回撤触发', en: '-35% drawdown trigger' },
        context: {
            zh: '疫情冲击需求与供应链，市场情绪极度悲观，科技龙头普遍暴跌。',
            en: 'Pandemic demand collapse and supply-chain chaos sent mega-cap tech tumbling amid panic.'
        },
        plan: {
            steps: [
                {
                    percentage: 0.3,
                    description: {
                        zh: '第一季度投入30%，优先配置远程办公与云业务受益股，锁定危机初期的折价。',
                        en: 'Commit 30% in the first quarter to remote work and cloud leaders to capture the initial dislocation.'
                    }
                },
                {
                    percentage: 0.35,
                    description: {
                        zh: '疫情高峰期间再投入35%，扩展到电商与半导体龙头，利用高波动放大仓位。',
                        en: 'Add 35% during peak stress, extending into e-commerce and semiconductor winners while volatility is elevated.'
                    }
                },
                {
                    percentage: 0.35,
                    description: {
                        zh: '剩余35%在经济重启前完成部署，逢反弹分批吸收以锁定估值修复潜力。',
                        en: 'Deploy the remaining 35% before reopening, scaling into rebounds to secure the recovery upside.'
                    }
                }
            ],
            hold: {
                zh: '至少持有18个月，随复工与数字化红利成熟逐步减仓。',
                en: 'Hold at least 18 months and trim as reopening and digital tailwinds mature.'
            }
        },
        execution: {
            zh: '采用“3-5-7”分批法在两个季度内完成加仓，远程办公与云业务成为重点权重。',
            en: 'Deployed a 3-5-7 tranche plan across two quarters, overweighting remote work and cloud beneficiaries.'
        },
        outcome: {
            zh: '2021 年底受益于远程经济与云服务，净值增幅 +65%。',
            en: 'By late 2021 remote-economy tailwinds lifted NAV by +65%.'
        }
    },
    {
        date: '2022-10',
        title: { zh: '估值重置与 AI 预期', en: 'Valuation Reset Sets Up AI' },
        drop: { zh: '-32% 回撤触发', en: '-32% drawdown trigger' },
        context: {
            zh: '加息与盈利增速放缓导致估值重估，但 GPU 与 AI 云支出出现领先指标。',
            en: 'Rising rates and slower earnings forced a reset while GPU and AI cloud demand flashed early signals.'
        },
        plan: {
            steps: [
                {
                    percentage: 0.4,
                    description: {
                        zh: '首月集中40%资金增持 NVDA、MSFT，利用估值压缩窗口建立高确定性仓位。',
                        en: 'Concentrate 40% in NVDA and MSFT during the first month while multiples are compressed.'
                    }
                },
                {
                    percentage: 0.3,
                    description: {
                        zh: '当 AI 订单与资本开支确认后，再投入30%覆盖 GPU 及云基础设施供应链。',
                        en: 'Once AI orders and capex firm up, allocate another 30% across GPU and cloud infrastructure suppliers.'
                    }
                },
                {
                    percentage: 0.3,
                    description: {
                        zh: '最后30%结合备兑开仓策略缓冲 TSLA 波动，同时动态对冲高贝塔仓位。',
                        en: 'Deploy the final 30% alongside covered calls to temper TSLA volatility and hedge high-beta exposure.'
                    }
                }
            ],
            hold: {
                zh: '持有至 2024 年前后，随着 AI 主题扩散分批兑现利润。',
                en: 'Hold into 2024 and stagger exits as the AI theme broadens.'
            }
        },
        execution: {
            zh: '集中增持 NVDA、MSFT，并以备兑开仓策略管理 TSLA 波动性。',
            en: 'Concentrated in NVDA and MSFT while writing covered calls to manage TSLA volatility.'
        },
        outcome: {
            zh: '2024 年 AI 主题驱动，策略净值突破 5 倍。',
            en: 'AI enthusiasm by 2024 pushed strategy NAV past 5x.'
        }
    }
];

const yahooConfig = {
    endpoint: 'https://query1.finance.yahoo.com/v7/finance/quote',
    symbols: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA', 'SPY', 'QQQ'],
    groups: {
        mag7: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA'],
        sp500: ['SPY'],
        qqq: ['QQQ']
    },
    refreshMs: 5 * 60 * 1000
};

const insightsData = [
    {
        title: { zh: '科技龙头的反脆弱性', en: 'Anti-fragility of Tech Leaders' },
        detail: {
            zh: '多次深跌后依旧保持高复合增速，核心原因在于现金流、防御型资产负债表以及技术周期的新叙事。',
            en: 'Repeated drawdowns still compound strongly thanks to cash flow, fortress balance sheets, and new tech narratives.'
        }
    },
    {
        title: { zh: '时间线揭示执行节奏', en: 'Timeline Highlights Execution Cadence' },
        detail: {
            zh: '按时间线记录触发点与分批加仓步骤，帮助复盘在剧烈波动时的纪律与仓位控制。',
            en: 'Documenting triggers and scaling steps clarifies discipline and position sizing during violent swings.'
        }
    },
    {
        title: { zh: '与指数定投互补', en: 'Complementary to Index DCA' },
        detail: {
            zh: '策略提供在危机期加仓的纪律，而 S&P 500、QQQ 定投提供基准收益，实时监测有助于再平衡与风险控制。',
            en: 'The strategy enforces crisis buying while S&P 500 and QQQ DCA deliver baseline growth, and live monitoring supports rebalancing and risk control.'
        }
    }
];

const state = {
    metrics: [],
    metricsById: {},
    heroValues: {},
    signalCounts: {},
    liveData: null,
    liveError: null,
    lastUpdated: null,
    investment: {
        amount: DEFAULT_INVESTMENT_AMOUNT,
        error: false
    },
    subscription: {
        status: 'idle',
        email: ''
    }
};

const charts = {
    mag7: null,
    metrics: null
};

let currentLanguage = 'zh';
let liveRefreshHandle = null;

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

function getLocale(lang) {
    return lang === 'zh' ? 'zh-CN' : 'en-US';
}

function formatPercent(value, options = {}) {
    const { sign = false, digits = 1 } = options;
    const percentage = (value * 100).toFixed(digits);
    if (sign && value > 0) {
        return `+${percentage}%`;
    }
    return `${percentage}%`;
}

function formatCurrency(value, lang) {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        return '--';
    }
    return new Intl.NumberFormat(getLocale(lang), {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: value >= 1000 ? 0 : 2
    }).format(value);
}

function formatIndexValue(value, locale) {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        return '--';
    }
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function formatChangePercentValue(value, locale) {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        return '--';
    }
    const formatter = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        signDisplay: 'always'
    });
    return `${formatter.format(value)}%`;
}

function buildQuoteMap(quotes = []) {
    return quotes.reduce((acc, quote) => {
        if (quote && quote.symbol) {
            acc[quote.symbol.toUpperCase()] = quote;
        }
        return acc;
    }, {});
}

function computePortfolioSnapshot(symbols, quoteMap) {
    let priceSum = 0;
    let previousSum = 0;
    let validCount = 0;

    symbols.forEach(symbol => {
        const quote = quoteMap[symbol];
        if (!quote) return;

        const price = Number(quote.regularMarketPrice ?? quote.postMarketPrice);
        const changePercent = Number(quote.regularMarketChangePercent);
        let previous = Number(quote.regularMarketPreviousClose);

        if (!Number.isFinite(price)) return;
        if (!Number.isFinite(previous)) {
            if (Number.isFinite(changePercent) && changePercent !== -100) {
                previous = price / (1 + changePercent / 100);
            } else {
                return;
            }
        }

        if (!Number.isFinite(previous) || previous === 0) return;

        priceSum += price;
        previousSum += previous;
        validCount += 1;
    });

    if (!validCount || !Number.isFinite(priceSum) || !Number.isFinite(previousSum) || previousSum === 0) {
        return null;
    }

    const index = (priceSum / previousSum) * 100;
    const changePercent = ((priceSum - previousSum) / previousSum) * 100;

    return { index, changePercent };
}

function computeLiveData(quoteMap) {
    return {
        mag7: computePortfolioSnapshot(yahooConfig.groups.mag7, quoteMap),
        sp500: computePortfolioSnapshot(yahooConfig.groups.sp500, quoteMap),
        qqq: computePortfolioSnapshot(yahooConfig.groups.qqq, quoteMap)
    };
}

function applyChangeClass(element, value) {
    if (!element) return;
    element.classList.remove('change-positive', 'change-negative');
    if (typeof value !== 'number' || Number.isNaN(value) || value === 0) return;
    if (value > 0) {
        element.classList.add('change-positive');
    } else {
        element.classList.add('change-negative');
    }
}

function renderLiveSection(lang) {
    const locale = lang === 'zh' ? 'zh-CN' : 'en-US';
    const liveLabels = translations[lang].live;
    const cards = [
        { key: 'mag7', valueId: 'mag7LiveValue', changeId: 'mag7LiveChange' },
        { key: 'sp500', valueId: 'spLiveValue', changeId: 'spLiveChange' },
        { key: 'qqq', valueId: 'qqqLiveValue', changeId: 'qqqLiveChange' }
    ];

    cards.forEach(({ key, valueId, changeId }) => {
        const metrics = state.liveData ? state.liveData[key] : null;
        const valueEl = document.getElementById(valueId);
        const changeEl = document.getElementById(changeId);

        if (valueEl) {
            valueEl.textContent = metrics ? formatIndexValue(metrics.index, locale) : '--';
        }
        if (changeEl) {
            const percentValue = metrics ? metrics.changePercent : null;
            changeEl.textContent = metrics ? formatChangePercentValue(percentValue, locale) : '--';
            applyChangeClass(changeEl, metrics ? percentValue : null);
        }
    });

    const updatedEl = document.getElementById('liveUpdated');
    if (updatedEl) {
        if (state.lastUpdated) {
            const formatter = new Intl.DateTimeFormat(locale, {
                hour12: false,
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            updatedEl.textContent = `${liveLabels.updated}${formatter.format(state.lastUpdated)}`;
        } else {
            updatedEl.textContent = '';
        }
    }

    const errorEl = document.getElementById('liveError');
    if (errorEl) {
        errorEl.textContent = state.liveError ? liveLabels.error : '';
    }
}

async function loadLiveQuotes() {
    try {
        const url = `${yahooConfig.endpoint}?symbols=${yahooConfig.symbols.join(',')}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const payload = await response.json();
        const quotes = payload?.quoteResponse?.result || [];
        const quoteMap = buildQuoteMap(quotes);
        state.liveData = computeLiveData(quoteMap);
        state.lastUpdated = new Date();
        state.liveError = null;
        renderLiveSection(currentLanguage);
    } catch (error) {
        console.error('Failed to fetch live quotes', error);
        state.liveError = true;
        renderLiveSection(currentLanguage);
    }
}

function startLiveRefresh() {
    if (liveRefreshHandle) {
        clearInterval(liveRefreshHandle);
    }
    loadLiveQuotes();
    liveRefreshHandle = setInterval(loadLiveQuotes, yahooConfig.refreshMs);
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
    if (!container) return;
    container.innerHTML = '';
    cards.forEach(metric => container.appendChild(createMetricCard(metric)));
}

function renderTimeline(events, lang, labels) {
    const container = document.getElementById('timeline');
    if (!container) return;
    container.innerHTML = '';

    events.forEach(event => {
        const item = document.createElement('div');
        item.className = 'timeline-item';

        const marker = document.createElement('span');
        marker.className = 'timeline-marker';

        const content = document.createElement('div');
        content.className = 'timeline-content';

        const dateEl = document.createElement('span');
        dateEl.className = 'timeline-date';
        dateEl.textContent = event.date;

        const titleEl = document.createElement('h3');
        titleEl.className = 'timeline-title';
        titleEl.textContent = event.title[lang];

        const dropEl = document.createElement('span');
        dropEl.className = 'timeline-drop';
        dropEl.textContent = event.drop[lang];

        const contextEl = document.createElement('p');
        contextEl.className = 'timeline-text';
        const contextLabel = document.createElement('strong');
        contextLabel.textContent = labels.contextLabel;
        contextEl.appendChild(contextLabel);
        contextEl.append(` ${event.context[lang]}`);

        const executionEl = document.createElement('p');
        executionEl.className = 'timeline-text';
        const executionLabel = document.createElement('strong');
        executionLabel.textContent = labels.actionLabel;
        executionEl.appendChild(executionLabel);
        executionEl.append(` ${event.execution[lang]}`);

        const outcomeEl = document.createElement('p');
        outcomeEl.className = 'timeline-text';
        const outcomeLabel = document.createElement('strong');
        outcomeLabel.textContent = labels.resultLabel;
        outcomeEl.appendChild(outcomeLabel);
        outcomeEl.append(` ${event.outcome[lang]}`);

        content.append(dateEl, titleEl, dropEl, contextEl, executionEl, outcomeEl);
        item.append(marker, content);
        container.appendChild(item);
    });
}

function renderInvestmentPlanner(lang) {
    const config = translations[lang].investment;
    const amount = state.investment.amount;
    const results = document.getElementById('planResults');
    const summaryEl = document.getElementById('planSummary');
    const errorEl = document.getElementById('planError');
    const inputEl = document.getElementById('investmentAmount');
    const helperEl = document.getElementById('investmentHelper');

    if (inputEl) {
        if (amount && !Number.isNaN(amount)) {
            inputEl.value = amount;
        } else if (!inputEl.value) {
            inputEl.value = '';
        }
        inputEl.placeholder = config.placeholder;
    }

    if (helperEl) {
        helperEl.textContent = config.helper;
    }

    if (errorEl) {
        errorEl.textContent = state.investment.error ? config.invalid : '';
    }

    if (!results) return;
    results.innerHTML = '';

    const plannedEvents = timelineEvents.filter(event => event.plan);

    if (summaryEl) {
        if (amount && amount > 0 && !state.investment.error) {
            summaryEl.textContent = formatTemplate(config.summary, {
                amount: formatCurrency(amount, lang),
                count: plannedEvents.length
            });
        } else {
            summaryEl.textContent = '';
        }
    }

    if (!amount || amount <= 0 || state.investment.error) {
        return;
    }

    plannedEvents.forEach(event => {
        const card = document.createElement('article');
        card.className = 'plan-card';

        const header = document.createElement('header');
        const dateEl = document.createElement('span');
        dateEl.className = 'plan-date';
        dateEl.textContent = event.date;

        const titleEl = document.createElement('h3');
        titleEl.textContent = event.title[lang];

        const dropEl = document.createElement('span');
        dropEl.className = 'plan-drop';
        dropEl.textContent = formatTemplate(config.dropLabel, { drop: event.drop[lang] });

        header.append(dateEl, titleEl, dropEl);

        const stepsWrapper = document.createElement('div');
        stepsWrapper.className = 'plan-steps';

        event.plan.steps.forEach((step, index) => {
            const stepWrapper = document.createElement('div');
            stepWrapper.className = 'plan-step';

            const stepTitle = document.createElement('div');
            stepTitle.className = 'plan-step-title';
            stepTitle.textContent = formatTemplate(config.stepLabel, { index: index + 1 });

            const stepAmount = document.createElement('div');
            stepAmount.className = 'plan-step-amount';
            const percentage = step.percentage * 100;
            const percentageText = Number.isInteger(percentage) ? percentage.toFixed(0) : percentage.toFixed(1);
            stepAmount.textContent = formatTemplate(config.stepAmount, {
                amount: formatCurrency(amount * step.percentage, lang),
                percentage: percentageText
            });

            const stepDesc = document.createElement('p');
            stepDesc.className = 'plan-step-desc';
            stepDesc.textContent = step.description[lang];

            stepWrapper.append(stepTitle, stepAmount, stepDesc);
            stepsWrapper.appendChild(stepWrapper);
        });

        card.append(header, stepsWrapper);

        if (event.plan.hold) {
            const holdEl = document.createElement('p');
            holdEl.className = 'plan-hold';
            holdEl.textContent = `${config.holdLabel} ${event.plan.hold[lang]}`;
            card.appendChild(holdEl);
        }

        results.appendChild(card);
    });
}

function renderInsights(data, lang) {
    const wrapper = document.getElementById('insights');
    if (!wrapper) return;
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

function renderSubscription(lang) {
    const config = translations[lang].subscription;
    const input = document.getElementById('subscriptionEmail');
    const message = document.getElementById('subscriptionMessage');

    if (input) {
        input.placeholder = config.placeholder;
    }

    if (!message) return;

    message.textContent = '';
    message.classList.remove('error');

    if (state.subscription.status === 'success') {
        message.textContent = formatTemplate(config.success, { email: state.subscription.email });
    } else if (state.subscription.status === 'error') {
        message.textContent = config.invalid;
        message.classList.add('error');
    }
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
    if (!tbody) return;
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

function formatTemplate(template, params = {}) {
    if (typeof template !== 'string') return '';
    return template.replace(/\{(\w+)\}/g, (match, key) => {
        const value = params[key];
        return value !== undefined ? value : '';
    });
}

function isValidEmail(value) {
    if (typeof value !== 'string') return false;
    const trimmed = value.trim();
    if (!trimmed) return false;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(trimmed);
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

function renderTimelineSection(lang) {
    renderTimeline(timelineEvents, lang, translations[lang].timeline);
}

function renderInsightsSection(lang) {
    renderInsights(insightsData, lang);
}

function renderCharts(lang) {
    const mag7Canvas = document.getElementById('mag7Chart');
    if (mag7Canvas) {
        if (charts.mag7) charts.mag7.destroy();
        charts.mag7 = buildLineChart(
            mag7Canvas,
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


    }

    const metricsCanvas = document.getElementById('metricsChart');
    if (metricsCanvas) {
        if (charts.metrics) charts.metrics.destroy();
        charts.metrics = buildMetricsChart(
            metricsCanvas,
            state.metrics,
            {
                labels: state.metrics.map(metric => strategyLabels[metric.id][lang]),
                datasetLabels: translations[lang].charts.datasetLabels,
                yAxisLabel: translations[lang].charts.metricsYAxis
            }
        );
    }
}

function renderTable(lang) {
    populateMetricsTable(state.metrics, state.signalCounts, lang, translations[lang].table.triggerUnit);
}

function updateAriaLabels(lang) {
    const mag7Chart = document.getElementById('mag7Chart');
    if (mag7Chart) mag7Chart.setAttribute('aria-label', translations[lang].charts.mag7Aria);

    const metricsChart = document.getElementById('metricsChart');
    if (metricsChart) metricsChart.setAttribute('aria-label', translations[lang].charts.metricsAria);
    const switcher = document.querySelector('.language-switcher');
    if (switcher) {
        switcher.setAttribute('aria-label', translations[lang].languageSwitcherAria);
    }
    const nav = document.querySelector('.site-nav');
    if (nav) {
        nav.setAttribute('aria-label', translations[lang].nav.aria);
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
    renderTimelineSection(lang);
    renderInsightsSection(lang);
    renderCharts(lang);
    renderTable(lang);
    updateAriaLabels(lang);
    renderLiveSection(lang);
    renderInvestmentPlanner(lang);
    renderSubscription(lang);
}

function setupLanguageSwitcher() {
    document.querySelectorAll('.lang-button').forEach(button => {
        button.addEventListener('click', () => {
            const { lang } = button.dataset;
            if (lang && lang !== currentLanguage) {
                setLanguage(lang);
                saveLanguage(lang); // Persist selection
            }
        });
    });
}

function setupInvestmentPlanner() {
    const form = document.getElementById('investmentForm');
    const input = document.getElementById('investmentAmount');
    if (!form || !input) return;

    form.addEventListener('submit', event => {
        event.preventDefault();
        const value = Number.parseFloat(input.value);
        if (!Number.isFinite(value) || value <= 0) {
            state.investment.amount = 0;
            state.investment.error = true;
        } else {
            state.investment.amount = value;
            state.investment.error = false;
        }
        renderInvestmentPlanner(currentLanguage);
    });

    input.addEventListener('input', () => {
        const raw = input.value;
        if (raw === '') {
            state.investment.amount = 0;
            state.investment.error = false;
            renderInvestmentPlanner(currentLanguage);
            return;
        }
        const value = Number.parseFloat(raw);
        if (Number.isFinite(value) && value > 0) {
            state.investment.amount = value;
            state.investment.error = false;
            renderInvestmentPlanner(currentLanguage);
        }
    });
}

function setupSubscriptionForm() {
    const form = document.getElementById('subscriptionForm');
    const input = document.getElementById('subscriptionEmail');
    if (!form || !input) return;

    form.addEventListener('submit', event => {
        event.preventDefault();
        const email = input.value.trim();
        if (!isValidEmail(email)) {
            state.subscription.status = 'error';
            state.subscription.email = email;
        } else {
            state.subscription.status = 'success';
            state.subscription.email = email;
            input.value = '';
        }
        renderSubscription(currentLanguage);
    });

    input.addEventListener('input', () => {
        if (state.subscription.status === 'error') {
            state.subscription.status = 'idle';
            renderSubscription(currentLanguage);
        }
    });
}

const LANG_KEY = 'tracker-language';

function loadLanguage() {
    try {
        const stored = window.localStorage.getItem(LANG_KEY);
        return stored && translations[stored] ? stored : 'zh';
    } catch (e) {
        console.warn('LocalStorage access failed:', e);
        return 'zh';
    }
}

function saveLanguage(lang) {
    try {
        window.localStorage.setItem(LANG_KEY, lang);
    } catch (e) {
        console.warn('LocalStorage access failed:', e);
    }
}

function init() {
    state.metrics = [
        {
            id: 'mag7Strategy',
            cagr: calcCagr(series.mag7Strategy),
            maxDrawdown: calcMaxDrawdown(series.mag7Strategy),
            volatility: calcVolatility(series.mag7Strategy),
            tenYearReturn: calcTenYearReturn(series.mag7Strategy)
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

    state.metricsById = state.metrics.reduce((acc, metric) => {
        acc[metric.id] = metric;
        return acc;
    }, {});
    state.signalCounts = {
        mag7Strategy: timelineEvents.length,
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

    currentLanguage = loadLanguage(); // Load saved language

    setupLanguageSwitcher();
    setupInvestmentPlanner();
    setupSubscriptionForm();
    setLanguage(currentLanguage);
    setupSubscriptionForm();
    setLanguage(currentLanguage);
    startLiveRefresh();

    // Remove loading class after init to prevent flash
    document.body.classList.remove('js-loading');
}

document.addEventListener('DOMContentLoaded', init);
