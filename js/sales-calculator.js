/**
 * Metro销售额计算模块
 * 模拟Metro零售商的季度销售数据并计算天气影响
 */

class SalesCalculator {
    constructor() {
        // Metro基础季度销售数据（单位：百万加元）
        this.baseSalesData = {
            Q1: { base: 3800, growth: 0.02 }, // 第一季度基础销售额
            Q2: { base: 3600, growth: 0.025 }, // 第二季度
            Q3: { base: 3500, growth: 0.03 }, // 第三季度
            Q4: { base: 4200, growth: 0.035 } // 第四季度（包含假期）
        };

        // 不同商品类别在天气事件中的敏感度
        this.categorySensitivity = {
            '食品杂货': { 
                positiveWeather: 0.05, 
                negativeWeather: -0.12,
                baseShare: 0.65 // 占总销售额的65%
            },
            '药品保健': { 
                positiveWeather: 0.02, 
                negativeWeather: -0.08,
                baseShare: 0.15
            },
            '家居用品': { 
                positiveWeather: -0.03, 
                negativeWeather: -0.20,
                baseShare: 0.12
            },
            '服装鞋帽': { 
                positiveWeather: -0.05, 
                negativeWeather: -0.25,
                baseShare: 0.08
            }
        };

        // 地区销售权重（基于Metro在各省的门店分布）
        this.regionalWeights = {
            'Ontario': 0.55,
            'Quebec': 0.35,
            'British Columbia': 0.05,
            'Alberta': 0.03,
            'Manitoba': 0.015,
            'Saskatchewan': 0.005
        };
    }

    /**
     * 计算季度基础销售额
     */
    calculateBaseSales(quarterInfo, year) {
        const quarterKey = `Q${quarterInfo.quarter}`;
        const baseSales = this.baseSalesData[quarterKey];
        
        // 考虑年度增长
        const yearsSince2020 = year - 2020;
        const growthFactor = Math.pow(1 + baseSales.growth, yearsSince2020);
        
        // 添加随机波动（±3%）
        const randomFactor = 1 + (Math.random() - 0.5) * 0.06;
        
        return baseSales.base * growthFactor * randomFactor;
    }

    /**
     * 计算天气事件对销售的影响
     */
    calculateWeatherImpact(baseSales, weatherEvents) {
        let totalImpact = 0;
        const categoryImpacts = {};
        const eventImpacts = [];

        // 初始化类别影响
        Object.keys(this.categorySensitivity).forEach(category => {
            categoryImpacts[category] = {
                baseAmount: baseSales * this.categorySensitivity[category].baseShare,
                weatherImpact: 0,
                finalAmount: 0
            };
        });

        // 计算每个天气事件的影响
        weatherEvents.forEach(event => {
            const regionalWeight = this.regionalWeights[event.province] || 0.01;
            const eventImpactFactor = event.impact.impactFactor * event.duration * regionalWeight;
            
            // 对每个商品类别计算影响
            Object.keys(this.categorySensitivity).forEach(category => {
                const categoryData = this.categorySensitivity[category];
                const categoryBaseSales = baseSales * categoryData.baseShare;
                
                // 计算类别特定的天气影响
                let categoryImpact;
                if (eventImpactFactor < 0) {
                    // 负面天气事件
                    categoryImpact = categoryBaseSales * eventImpactFactor * Math.abs(categoryData.negativeWeather);
                } else {
                    // 正面天气事件（极少见）
                    categoryImpact = categoryBaseSales * eventImpactFactor * categoryData.positiveWeather;
                }
                
                categoryImpacts[category].weatherImpact += categoryImpact;
            });

            // 记录单个事件的影响
            const eventTotalImpact = baseSales * eventImpactFactor;
            eventImpacts.push({
                event: event,
                impact: eventTotalImpact,
                impactPercentage: (eventTotalImpact / baseSales) * 100
            });

            totalImpact += eventTotalImpact;
        });

        // 计算最终销售额
        Object.keys(categoryImpacts).forEach(category => {
            const categoryData = categoryImpacts[category];
            categoryData.finalAmount = categoryData.baseAmount + categoryData.weatherImpact;
        });

        const finalSales = baseSales + totalImpact;
        const impactPercentage = (totalImpact / baseSales) * 100;

        return {
            baseSales: baseSales,
            totalWeatherImpact: totalImpact,
            finalSales: finalSales,
            impactPercentage: impactPercentage,
            categoryBreakdown: categoryImpacts,
            eventImpacts: eventImpacts.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
        };
    }

    /**
     * 生成月度销售分布数据
     */
    generateMonthlySalesData(quarterInfo, finalSales, weatherEvents) {
        const monthlyData = [];
        const quarterStartMonth = (quarterInfo.quarter - 1) * 3;
        
        // 基础月度分布（每月占季度的比例）
        const monthlyDistribution = [0.32, 0.34, 0.34]; // 略有变化的月度分布
        
        for (let i = 0; i < 3; i++) {
            const month = quarterStartMonth + i;
            const monthDate = new Date(quarterInfo.year, month, 1);
            
            // 计算该月的天气事件影响
            const monthWeatherEvents = weatherEvents.filter(event => {
                return event.date.getMonth() === month;
            });
            
            let monthWeatherImpact = 0;
            monthWeatherEvents.forEach(event => {
                const regionalWeight = this.regionalWeights[event.province] || 0.01;
                monthWeatherImpact += event.impact.impactFactor * event.duration * regionalWeight;
            });
            
            // 基础月销售额
            const baseMonthlySales = finalSales * monthlyDistribution[i];
            
            // 添加月度随机波动
            const randomFactor = 1 + (Math.random() - 0.5) * 0.04;
            const finalMonthlySales = baseMonthlySales * randomFactor;
            
            monthlyData.push({
                month: month + 1,
                monthName: this.getMonthName(month),
                date: monthDate,
                baseSales: baseMonthlySales,
                weatherImpact: monthWeatherImpact * finalSales,
                finalSales: finalMonthlySales,
                weatherEvents: monthWeatherEvents.length
            });
        }
        
        return monthlyData;
    }

    /**
     * 获取月份名称
     */
    getMonthName(monthIndex) {
        const months = [
            '一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'
        ];
        return months[monthIndex];
    }

    /**
     * 计算与历史同期的对比
     */
    calculateHistoricalComparison(currentSales, quarterInfo) {
        // 模拟历史同期数据
        const historicalSales = this.calculateBaseSales(quarterInfo, quarterInfo.year - 1);
        const difference = currentSales.finalSales - historicalSales;
        const percentageChange = (difference / historicalSales) * 100;
        
        return {
            historicalSales: historicalSales,
            currentSales: currentSales.finalSales,
            difference: difference,
            percentageChange: percentageChange,
            isPositive: difference >= 0
        };
    }

    /**
     * 生成销售预测调整建议
     */
    generateForecastAdjustments(salesData, weatherEvents) {
        const recommendations = [];
        
        // 基于天气影响严重程度提供建议
        if (salesData.impactPercentage < -10) {
            recommendations.push({
                type: 'critical',
                title: '严重天气影响预警',
                message: '极端天气事件对销售造成严重负面影响，建议加强库存管理和供应链应急预案。',
                action: '考虑增加必需品库存，优化配送路线。'
            });
        } else if (salesData.impactPercentage < -5) {
            recommendations.push({
                type: 'warning',
                title: '中等天气影响',
                message: '天气事件对销售产生中等程度影响，建议密切关注后续发展。',
                action: '调整营销策略，关注受影响地区的门店运营。'
            });
        } else if (salesData.impactPercentage < -2) {
            recommendations.push({
                type: 'info',
                title: '轻微天气影响',
                message: '天气事件对销售影响较小，维持正常运营策略。',
                action: '继续监控天气条件，做好应急准备。'
            });
        }

        // 基于商品类别影响提供建议
        Object.keys(salesData.categoryBreakdown).forEach(category => {
            const categoryData = salesData.categoryBreakdown[category];
            const categoryImpactPercentage = (categoryData.weatherImpact / categoryData.baseAmount) * 100;
            
            if (categoryImpactPercentage < -15) {
                recommendations.push({
                    type: 'category',
                    title: `${category}类别影响严重`,
                    message: `${category}受天气影响严重，销售下降${Math.abs(categoryImpactPercentage).toFixed(1)}%。`,
                    action: `考虑调整${category}的采购计划和促销策略。`
                });
            }
        });

        return recommendations;
    }

    /**
     * 格式化货币显示
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('zh-CN', {
            style: 'currency',
            currency: 'CAD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount * 1000000); // 转换为实际金额（百万加元）
    }

    /**
     * 格式化百分比显示
     */
    formatPercentage(percentage) {
        return new Intl.NumberFormat('zh-CN', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(percentage / 100);
    }
}