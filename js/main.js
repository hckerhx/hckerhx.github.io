/**
 * 主要应用逻辑
 * 处理用户交互和数据流程
 */

class MetroWeatherAnalyzer {
    constructor() {
        this.weatherManager = new WeatherDataManager();
        this.salesCalculator = new SalesCalculator();
        this.chartUtils = new ChartUtils();
        
        // 存储图表实例
        this.charts = {
            salesChart: null,
            weatherImpactChart: null,
            categoryChart: null,
            regionalChart: null
        };
        
        this.initialize();
    }

    /**
     * 初始化应用
     */
    initialize() {
        this.setupEventListeners();
        this.setDefaultDates();
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        const timeForm = document.getElementById('timeForm');
        if (timeForm) {
            timeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAnalysisRequest();
            });
        }

        // 日期验证
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');

        if (startDateInput && endDateInput) {
            startDateInput.addEventListener('change', () => this.validateDateRange());
            endDateInput.addEventListener('change', () => this.validateDateRange());
        }
    }

    /**
     * 设置默认日期
     */
    setDefaultDates() {
        const today = new Date();
        const startDate = new Date(today.getFullYear(), 0, 1); // 当年1月1日
        const endDate = new Date(today.getFullYear(), 11, 31); // 当年12月31日

        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');

        if (startDateInput && endDateInput) {
            startDateInput.value = this.formatDateForInput(startDate);
            endDateInput.value = this.formatDateForInput(endDate);
        }
    }

    /**
     * 格式化日期为input[type="date"]格式
     */
    formatDateForInput(date) {
        return date.toISOString().split('T')[0];
    }

    /**
     * 验证日期范围
     */
    validateDateRange() {
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');

        if (!startDateInput || !endDateInput) return;

        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        if (startDate >= endDate) {
            endDateInput.setCustomValidity('结束时间必须晚于开始时间');
        } else if (endDate - startDate > 365 * 24 * 60 * 60 * 1000 * 2) {
            // 限制最大时间跨度为2年
            endDateInput.setCustomValidity('时间跨度不能超过2年');
        } else {
            endDateInput.setCustomValidity('');
        }
    }

    /**
     * 处理分析请求
     */
    async handleAnalysisRequest() {
        try {
            // 显示加载状态
            this.showLoading();

            // 获取用户输入
            const startDateInput = document.getElementById('startDate');
            const endDateInput = document.getElementById('endDate');

            if (!startDateInput || !endDateInput) {
                throw new Error('无法获取日期输入');
            }

            const startDate = startDateInput.value;
            const endDate = endDateInput.value;

            if (!startDate || !endDate) {
                throw new Error('请选择开始时间和结束时间');
            }

            // 模拟异步处理
            await this.delay(1500);

            // 执行分析
            await this.performAnalysis(startDate, endDate);

        } catch (error) {
            console.error('分析过程中出现错误:', error);
            this.showError(error.message);
        }
    }

    /**
     * 执行分析
     */
    async performAnalysis(startDate, endDate) {
        // 1. 获取季度信息
        const quarters = this.weatherManager.getQuartersInRange(startDate, endDate);
        
        if (quarters.length === 0) {
            throw new Error('选择的时间范围内没有完整的季度');
        }

        // 2. 分析每个季度
        const analysisResults = [];
        
        for (const quarter of quarters) {
            // 获取天气事件（优先使用API，失败则回退到模拟数据）
            const weatherEvents = await this.weatherManager.fetchWeatherEvents(
                quarter.startDate,
                quarter.endDate
            );
            
            // 计算销售影响
            const baseSales = this.salesCalculator.calculateBaseSales(quarter, quarter.year);
            const salesImpact = this.salesCalculator.calculateWeatherImpact(baseSales, weatherEvents);
            
            // 生成月度数据
            const monthlyData = this.salesCalculator.generateMonthlySalesData(
                quarter, salesImpact.finalSales, weatherEvents
            );
            
            // 历史对比
            const historicalComparison = this.salesCalculator.calculateHistoricalComparison(
                salesImpact, quarter
            );
            
            // 预测建议
            const recommendations = this.salesCalculator.generateForecastAdjustments(
                salesImpact, weatherEvents
            );

            analysisResults.push({
                quarter: quarter,
                weatherEvents: weatherEvents,
                salesImpact: salesImpact,
                monthlyData: monthlyData,
                historicalComparison: historicalComparison,
                recommendations: recommendations
            });
        }

        // 3. 显示结果
        this.displayResults(analysisResults);
    }

    /**
     * 显示分析结果
     */
    displayResults(analysisResults) {
        // 隐藏加载状态
        this.hideLoading();

        // 显示结果区域
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
            resultsSection.style.display = 'block';
        }

        // 显示季度信息
        this.displayQuarterInfo(analysisResults);

        // 显示天气事件
        this.displayWeatherEvents(analysisResults);

        // 创建图表
        this.createCharts(analysisResults);

        // 显示统计数据
        this.displayStatistics(analysisResults);

        // 滚动到结果区域
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * 显示季度信息
     */
    displayQuarterInfo(analysisResults) {
        const quarterInfoContainer = document.getElementById('quarterInfo');
        if (!quarterInfoContainer) return;

        let html = '';

        analysisResults.forEach((result, index) => {
            const quarter = result.quarter;
            const salesImpact = result.salesImpact;
            const comparison = result.historicalComparison;

            html += `
                <div class="quarter-card">
                    <h4>${quarter.label}</h4>
                    <div class="date-range">
                        ${this.formatDate(quarter.startDate)} - ${this.formatDate(quarter.endDate)}
                    </div>
                    <div class="metric">
                        <span class="metric-label">基础销售额:</span>
                        <span class="metric-value">${this.salesCalculator.formatCurrency(salesImpact.baseSales)}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">实际销售额:</span>
                        <span class="metric-value">${this.salesCalculator.formatCurrency(salesImpact.finalSales)}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">天气影响:</span>
                        <span class="metric-value ${salesImpact.impactPercentage < 0 ? 'negative' : 'positive'}">
                            ${this.salesCalculator.formatPercentage(salesImpact.impactPercentage)}
                        </span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">同比变化:</span>
                        <span class="metric-value ${comparison.isPositive ? 'positive' : 'negative'}">
                            ${this.salesCalculator.formatPercentage(comparison.percentageChange)}
                        </span>
                    </div>
                </div>
            `;
        });

        quarterInfoContainer.innerHTML = html;
    }

    /**
     * 显示天气事件
     */
    displayWeatherEvents(analysisResults) {
        const weatherEventsContainer = document.getElementById('weatherEvents');
        if (!weatherEventsContainer) return;

        let html = '';

        analysisResults.forEach((result) => {
            result.weatherEvents.forEach((event) => {
                html += `
                    <div class="weather-event ${event.impact.severity}">
                        <div class="weather-event-icon">
                            <i class="${event.impact.icon}"></i>
                        </div>
                        <div class="weather-event-info">
                            <div class="weather-event-title">${event.type} - ${event.province}</div>
                            <div class="weather-event-date">
                                ${this.formatDate(event.date)} (持续${event.duration}天)
                            </div>
                            <div class="weather-event-impact">${event.description}</div>
                        </div>
                    </div>
                `;
            });
        });

        if (html === '') {
            html = '<p class="text-center">选择的时间范围内没有记录到极端天气事件。</p>';
        }

        weatherEventsContainer.innerHTML = html;
    }

    /**
     * 创建图表
     */
    createCharts(analysisResults) {
        // 销毁现有图表
        Object.values(this.charts).forEach(chart => {
            this.chartUtils.destroyChart(chart);
        });

        // 合并所有数据用于图表显示
        const allMonthlyData = [];
        const allWeatherEvents = [];
        let totalSalesImpact = null;

        analysisResults.forEach(result => {
            allMonthlyData.push(...result.monthlyData);
            allWeatherEvents.push(...result.weatherEvents);
            
            if (!totalSalesImpact) {
                totalSalesImpact = { ...result.salesImpact };
            } else {
                // 合并销售影响数据
                totalSalesImpact.baseSales += result.salesImpact.baseSales;
                totalSalesImpact.finalSales += result.salesImpact.finalSales;
                totalSalesImpact.totalWeatherImpact += result.salesImpact.totalWeatherImpact;
                
                // 合并类别数据
                Object.keys(result.salesImpact.categoryBreakdown).forEach(category => {
                    if (totalSalesImpact.categoryBreakdown[category]) {
                        totalSalesImpact.categoryBreakdown[category].baseAmount += 
                            result.salesImpact.categoryBreakdown[category].baseAmount;
                        totalSalesImpact.categoryBreakdown[category].weatherImpact += 
                            result.salesImpact.categoryBreakdown[category].weatherImpact;
                        totalSalesImpact.categoryBreakdown[category].finalAmount += 
                            result.salesImpact.categoryBreakdown[category].finalAmount;
                    }
                });
            }
        });

        // 重新计算总体影响百分比
        if (totalSalesImpact) {
            totalSalesImpact.impactPercentage = 
                (totalSalesImpact.totalWeatherImpact / totalSalesImpact.baseSales) * 100;
        }

        // 创建销售趋势图表
        this.charts.salesChart = this.chartUtils.createSalesChart(
            'salesChart', allMonthlyData, allWeatherEvents
        );

        // 创建天气影响对比图表
        this.charts.weatherImpactChart = this.chartUtils.createWeatherImpactChart(
            'weatherImpactChart', allWeatherEvents, this.salesCalculator
        );

        // 如果有多个季度的数据，创建类别影响饼图
        if (totalSalesImpact && totalSalesImpact.categoryBreakdown) {
            // 为类别图表创建一个新的canvas（如果不存在）
            this.createCategoryChartCanvas();
            this.charts.categoryChart = this.chartUtils.createCategoryImpactChart(
                'categoryChart', totalSalesImpact.categoryBreakdown
            );
        }
    }

    /**
     * 创建类别图表画布
     */
    createCategoryChartCanvas() {
        const existingCanvas = document.getElementById('categoryChart');
        if (existingCanvas) return;

        const weatherImpactChartContainer = document.getElementById('weatherImpactChart').parentElement;
        const newChartContainer = weatherImpactChartContainer.cloneNode(false);
        
        newChartContainer.innerHTML = `
            <h3><i class="fas fa-chart-pie"></i> 商品类别影响分析</h3>
            <div class="chart-container">
                <canvas id="categoryChart" style="height: 350px;"></canvas>
            </div>
        `;

        weatherImpactChartContainer.parentElement.insertBefore(
            newChartContainer, weatherImpactChartContainer.nextSibling
        );
    }

    /**
     * 显示统计数据
     */
    displayStatistics(analysisResults) {
        const statsGridContainer = document.getElementById('statsGrid');
        if (!statsGridContainer) return;

        // 计算汇总统计
        let totalEvents = 0;
        let totalBaseSales = 0;
        let totalFinalSales = 0;
        let totalWeatherImpact = 0;
        let severeEventCount = 0;

        analysisResults.forEach(result => {
            totalEvents += result.weatherEvents.length;
            totalBaseSales += result.salesImpact.baseSales;
            totalFinalSales += result.salesImpact.finalSales;
            totalWeatherImpact += result.salesImpact.totalWeatherImpact;
            
            result.weatherEvents.forEach(event => {
                if (event.impact.severity === 'severe') {
                    severeEventCount++;
                }
            });
        });

        const overallImpactPercentage = (totalWeatherImpact / totalBaseSales) * 100;

        const html = `
            <div class="stat-card">
                <h4>总天气事件数</h4>
                <div class="value">${totalEvents}</div>
                <div class="change neutral">
                    其中严重事件 ${severeEventCount} 个
                </div>
            </div>
            
            <div class="stat-card">
                <h4>基础销售额</h4>
                <div class="value">${this.salesCalculator.formatCurrency(totalBaseSales)}</div>
                <div class="change neutral">
                    分析期间预期收入
                </div>
            </div>
            
            <div class="stat-card">
                <h4>实际销售额</h4>
                <div class="value">${this.salesCalculator.formatCurrency(totalFinalSales)}</div>
                <div class="change ${totalWeatherImpact < 0 ? 'negative' : 'positive'}">
                    ${totalWeatherImpact < 0 ? '受天气负面影响' : '天气影响较小'}
                </div>
            </div>
            
            <div class="stat-card">
                <h4>天气影响总额</h4>
                <div class="value">${this.salesCalculator.formatCurrency(Math.abs(totalWeatherImpact))}</div>
                <div class="change ${totalWeatherImpact < 0 ? 'negative' : 'positive'}">
                    ${this.salesCalculator.formatPercentage(overallImpactPercentage)}
                </div>
            </div>
            
            <div class="stat-card">
                <h4>分析季度数</h4>
                <div class="value">${analysisResults.length}</div>
                <div class="change neutral">
                    跨越 ${analysisResults.length} 个季度
                </div>
            </div>
            
            <div class="stat-card">
                <h4>影响评级</h4>
                <div class="value">
                    ${Math.abs(overallImpactPercentage) > 10 ? '严重' : 
                      Math.abs(overallImpactPercentage) > 5 ? '中等' : '轻微'}
                </div>
                <div class="change ${Math.abs(overallImpactPercentage) > 10 ? 'negative' : 
                                     Math.abs(overallImpactPercentage) > 5 ? 'neutral' : 'positive'}">
                    需要${Math.abs(overallImpactPercentage) > 10 ? '立即关注' : 
                           Math.abs(overallImpactPercentage) > 5 ? '密切监控' : '正常监控'}
                </div>
            </div>
        `;

        statsGridContainer.innerHTML = html;
    }

    /**
     * 显示加载状态
     */
    showLoading() {
        const loadingSection = document.getElementById('loadingSection');
        const resultsSection = document.getElementById('resultsSection');

        if (loadingSection) {
            loadingSection.style.display = 'block';
        }
        if (resultsSection) {
            resultsSection.style.display = 'none';
        }
    }

    /**
     * 隐藏加载状态
     */
    hideLoading() {
        const loadingSection = document.getElementById('loadingSection');
        if (loadingSection) {
            loadingSection.style.display = 'none';
        }
    }

    /**
     * 显示错误信息
     */
    showError(message) {
        this.hideLoading();
        
        // 创建错误提示
        const errorHtml = `
            <div class="card text-center" style="border-left: 4px solid #ef4444;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;"></i>
                <h3 style="color: #ef4444;">分析过程中出现错误</h3>
                <p style="color: #6b7280;">${message}</p>
                <button class="btn-primary" onclick="location.reload()">
                    <i class="fas fa-refresh"></i> 重新开始
                </button>
            </div>
        `;

        const loadingSection = document.getElementById('loadingSection');
        if (loadingSection) {
            loadingSection.innerHTML = errorHtml;
            loadingSection.style.display = 'block';
        }
    }

    /**
     * 格式化日期显示
     */
    formatDate(date) {
        return new Intl.DateTimeFormat('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    /**
     * 延迟函数
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 当页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', function() {
    const analyzer = new MetroWeatherAnalyzer();
    
    // 将实例挂载到全局，便于调试
    window.metroAnalyzer = analyzer;
    
    console.log('Metro 天气影响分析系统已初始化');
});