/**
 * 图表工具模块
 * 使用Chart.js创建各种数据可视化图表
 */

class ChartUtils {
    constructor() {
        this.defaultColors = {
            primary: '#4f46e5',
            secondary: '#7c3aed',
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444',
            info: '#3b82f6',
            gradient1: 'rgba(79, 70, 229, 0.8)',
            gradient2: 'rgba(124, 58, 237, 0.8)'
        };

        this.weatherColors = {
            'severe': '#ef4444',
            'moderate': '#f59e0b',
            'mild': '#10b981'
        };
    }

    /**
     * 创建销售趋势图表
     */
    createSalesChart(canvasId, monthlyData, weatherEvents) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        // 准备数据
        const labels = monthlyData.map(data => data.monthName);
        const baseSalesData = monthlyData.map(data => data.baseSales);
        const finalSalesData = monthlyData.map(data => data.finalSales);
        const weatherEventsCount = monthlyData.map(data => data.weatherEvents);

        // 创建渐变色
        const gradient1 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient1.addColorStop(0, 'rgba(79, 70, 229, 0.8)');
        gradient1.addColorStop(1, 'rgba(79, 70, 229, 0.1)');

        const gradient2 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient2.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
        gradient2.addColorStop(1, 'rgba(239, 68, 68, 0.1)');

        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '基础销售额（百万加元）',
                        data: baseSalesData,
                        borderColor: this.defaultColors.primary,
                        backgroundColor: gradient1,
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: this.defaultColors.primary,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    },
                    {
                        label: '实际销售额（受天气影响）',
                        data: finalSalesData,
                        borderColor: this.defaultColors.danger,
                        backgroundColor: gradient2,
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: this.defaultColors.danger,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Monthly Sales Trend with Weather Impact',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ¥${context.parsed.y.toFixed(1)}M`;
                            },
                            afterBody: function(tooltipItems) {
                                const index = tooltipItems[0].dataIndex;
                                const eventCount = weatherEventsCount[index];
                                return eventCount > 0 ? `天气事件: ${eventCount}个` : '';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: '月份'
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: '销售额（百万加元）'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '¥' + value.toFixed(0) + 'M';
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    /**
     * 创建天气影响对比图表
     */
    createWeatherImpactChart(canvasId, weatherEvents, salesCalculator) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        // 按天气类型汇总影响
        const weatherTypeImpacts = {};
        weatherEvents.forEach(event => {
            const impactAmount = Math.abs(event.impact.impactFactor * event.duration * 1000); // 转换为更易读的数值
            
            if (!weatherTypeImpacts[event.type]) {
                weatherTypeImpacts[event.type] = {
                    count: 0,
                    totalImpact: 0,
                    severity: event.impact.severity,
                    provinces: new Set()
                };
            }
            
            weatherTypeImpacts[event.type].count++;
            weatherTypeImpacts[event.type].totalImpact += impactAmount;
            weatherTypeImpacts[event.type].provinces.add(event.province);
        });

        // 准备图表数据
        const labels = Object.keys(weatherTypeImpacts);
        const impacts = labels.map(type => weatherTypeImpacts[type].totalImpact);
        const counts = labels.map(type => weatherTypeImpacts[type].count);
        const colors = labels.map(type => this.weatherColors[weatherTypeImpacts[type].severity]);

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '累计影响程度',
                        data: impacts,
                        backgroundColor: colors.map(color => color + '80'), // 添加透明度
                        borderColor: colors,
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Weather Event Impact by Type',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const type = context.label;
                                const data = weatherTypeImpacts[type];
                                return [
                                    `影响程度: ${context.parsed.y.toFixed(2)}`,
                                    `事件次数: ${data.count}次`,
                                    `影响省份: ${Array.from(data.provinces).join(', ')}`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: '天气事件类型'
                        },
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: '累计影响程度'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    /**
     * 创建商品类别影响饼图
     */
    createCategoryImpactChart(canvasId, categoryBreakdown) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const categories = Object.keys(categoryBreakdown);
        const impacts = categories.map(cat => Math.abs(categoryBreakdown[cat].weatherImpact));
        const colors = [
            '#4f46e5', '#7c3aed', '#ef4444', '#f59e0b', 
            '#10b981', '#3b82f6', '#8b5cf6', '#06b6d4'
        ];

        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories,
                datasets: [{
                    data: impacts,
                    backgroundColor: colors.slice(0, categories.length),
                    borderColor: '#ffffff',
                    borderWidth: 3,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Weather Impact by Product Category',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const category = context.label;
                                const data = categoryBreakdown[category];
                                const percentage = ((Math.abs(data.weatherImpact) / data.baseAmount) * 100).toFixed(1);
                                return [
                                    `${category}`,
                                    `影响金额: ¥${Math.abs(data.weatherImpact).toFixed(1)}M`,
                                    `影响比例: ${percentage}%`
                                ];
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * 创建地区影响对比图表
     */
    createRegionalImpactChart(canvasId, weatherEvents, regionalWeights) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        // 按省份汇总天气事件
        const provincialData = {};
        
        weatherEvents.forEach(event => {
            if (!provincialData[event.province]) {
                provincialData[event.province] = {
                    eventCount: 0,
                    totalDuration: 0,
                    severityScore: 0,
                    weight: regionalWeights[event.province] || 0.01
                };
            }
            
            const data = provincialData[event.province];
            data.eventCount++;
            data.totalDuration += event.duration;
            
            // 计算严重程度分数
            const severityScores = { severe: 3, moderate: 2, mild: 1 };
            data.severityScore += severityScores[event.impact.severity] || 1;
        });

        // 准备图表数据
        const provinces = Object.keys(provincialData);
        const eventCounts = provinces.map(p => provincialData[p].eventCount);
        const severityScores = provinces.map(p => provincialData[p].severityScore);

        return new Chart(ctx, {
            type: 'radar',
            data: {
                labels: provinces,
                datasets: [
                    {
                        label: '天气事件次数',
                        data: eventCounts,
                        borderColor: this.defaultColors.primary,
                        backgroundColor: this.defaultColors.primary + '40',
                        borderWidth: 2,
                        pointBackgroundColor: this.defaultColors.primary,
                        pointBorderColor: '#ffffff',
                        pointRadius: 6
                    },
                    {
                        label: '严重程度分数',
                        data: severityScores,
                        borderColor: this.defaultColors.danger,
                        backgroundColor: this.defaultColors.danger + '40',
                        borderWidth: 2,
                        pointBackgroundColor: this.defaultColors.danger,
                        pointBorderColor: '#ffffff',
                        pointRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Regional Weather Impact Distribution',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        pointLabels: {
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * 销毁图表实例
     */
    destroyChart(chartInstance) {
        if (chartInstance && typeof chartInstance.destroy === 'function') {
            chartInstance.destroy();
        }
    }

    /**
     * 创建简单的进度条
     */
    createProgressBar(containerId, percentage, label, color = this.defaultColors.primary) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const progressHtml = `
            <div class="progress-bar-container">
                <div class="progress-bar-label">${label}</div>
                <div class="progress-bar-track">
                    <div class="progress-bar-fill" style="width: ${Math.abs(percentage)}%; background-color: ${color};"></div>
                </div>
                <div class="progress-bar-value">${percentage.toFixed(1)}%</div>
            </div>
        `;

        container.innerHTML = progressHtml;
    }
}