/**
 * Metro sales calculation module
 * Simulates Metro retailers' quarterly sales data and calculates weather impact
 */

class SalesCalculator {
    constructor() {
        // Base quarterly sales data for Metro (in million CAD)
        this.baseSalesData = {
            Q1: { base: 3800, growth: 0.02 }, // Base sales for Q1
            Q2: { base: 3600, growth: 0.025 }, // Q2
            Q3: { base: 3500, growth: 0.03 }, // Q3
            Q4: { base: 4200, growth: 0.035 } // Q4 (includes holidays)
        };

        // Sensitivity of product categories to weather events
        this.categorySensitivity = {
            'Groceries': {
                positiveWeather: 0.05,
                negativeWeather: -0.12,
                baseShare: 0.65 // Accounts for 65% of total sales
            },
            'Health Products': {
                positiveWeather: 0.02,
                negativeWeather: -0.08,
                baseShare: 0.15
            },
            'Household Items': {
                positiveWeather: -0.03,
                negativeWeather: -0.20,
                baseShare: 0.12
            },
            'Apparel & Footwear': {
                positiveWeather: -0.05,
                negativeWeather: -0.25,
                baseShare: 0.08
            }
        };

        // Regional sales weights (based on Metro's store distribution)
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
     * Calculate base quarterly sales
     */
    calculateBaseSales(quarterInfo, year) {
        const quarterKey = `Q${quarterInfo.quarter}`;
        const baseSales = this.baseSalesData[quarterKey];
        
        // Consider annual growth
        const yearsSince2020 = year - 2020;
        const growthFactor = Math.pow(1 + baseSales.growth, yearsSince2020);
        
        // Add random fluctuation (±3%)
        const randomFactor = 1 + (Math.random() - 0.5) * 0.06;

        return baseSales.base * growthFactor * randomFactor;
    }

    /**
     * Calculate the impact of weather events on sales
     */
    calculateWeatherImpact(baseSales, weatherEvents) {
        let totalImpact = 0;
        const categoryImpacts = {};
        const eventImpacts = [];

        // Initialize category impacts
        Object.keys(this.categorySensitivity).forEach(category => {
            categoryImpacts[category] = {
                baseAmount: baseSales * this.categorySensitivity[category].baseShare,
                weatherImpact: 0,
                finalAmount: 0
            };
        });

        // Calculate the impact of each weather event
        weatherEvents.forEach(event => {
            const regionalWeight = this.regionalWeights[event.province] || 0.01;
            const eventImpactFactor = event.impact.impactFactor * event.duration * regionalWeight;
            
            // Calculate impact for each product category
            Object.keys(this.categorySensitivity).forEach(category => {
                const categoryData = this.categorySensitivity[category];
                const categoryBaseSales = baseSales * categoryData.baseShare;
                
                // Compute category-specific weather impact
                let categoryImpact;
                if (eventImpactFactor < 0) {
                    // Negative weather event
                    categoryImpact = categoryBaseSales * eventImpactFactor * Math.abs(categoryData.negativeWeather);
                } else {
                    // Positive weather event (rare)
                    categoryImpact = categoryBaseSales * eventImpactFactor * categoryData.positiveWeather;
                }
                
                categoryImpacts[category].weatherImpact += categoryImpact;
            });

            // Record the impact of the individual event
            const eventTotalImpact = baseSales * eventImpactFactor;
            eventImpacts.push({
                event: event,
                impact: eventTotalImpact,
                impactPercentage: (eventTotalImpact / baseSales) * 100
            });

            totalImpact += eventTotalImpact;
        });

        // Calculate final sales
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
     * Generate monthly sales distribution data
     */
    generateMonthlySalesData(quarterInfo, finalSales, weatherEvents) {
        const monthlyData = [];
        const quarterStartMonth = (quarterInfo.quarter - 1) * 3;
        
        // Baseline monthly distribution (proportion of each month in a quarter)
        const monthlyDistribution = [0.32, 0.34, 0.34]; // Slightly varied monthly distribution
        
        for (let i = 0; i < 3; i++) {
            const month = quarterStartMonth + i;
            const monthDate = new Date(quarterInfo.year, month, 1);
            
            // Calculate weather impact for the month
            const monthWeatherEvents = weatherEvents.filter(event => {
                return event.date.getMonth() === month;
            });
            
            let monthWeatherImpact = 0;
            monthWeatherEvents.forEach(event => {
                const regionalWeight = this.regionalWeights[event.province] || 0.01;
                monthWeatherImpact += event.impact.impactFactor * event.duration * regionalWeight;
            });
            
            // Baseline monthly sales
            const baseMonthlySales = finalSales * monthlyDistribution[i];

            // Add monthly random fluctuation
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
     * Get month name
     */
    getMonthName(monthIndex) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthIndex];
    }

    /**
     * Calculate comparison with the same period last year
     */
    calculateHistoricalComparison(currentSales, quarterInfo) {
        // Simulate historical sales for comparison
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
     * Generate sales forecast adjustment recommendations
     */
    generateForecastAdjustments(salesData, weatherEvents) {
        const recommendations = [];
        
        // Provide recommendations based on severity of weather impact
        if (salesData.impactPercentage < -10) {
            recommendations.push({
                type: 'critical',
                title: 'Severe Weather Impact Warning',
                message: 'Extreme weather events have severely impacted sales; enhance inventory management and supply chain contingency plans.',
                action: 'Consider increasing essential inventory and optimizing delivery routes.'
            });
        } else if (salesData.impactPercentage < -5) {
            recommendations.push({
                type: 'warning',
                title: 'Moderate Weather Impact',
                message: 'Weather events have a moderate effect on sales; closely monitor developments.',
                action: 'Adjust marketing strategies and monitor operations in affected regions.'
            });
        } else if (salesData.impactPercentage < -2) {
            recommendations.push({
                type: 'info',
                title: 'Minor Weather Impact',
                message: 'Weather events have a minimal effect on sales; maintain normal operations.',
                action: 'Continue monitoring weather conditions and prepare contingency plans.'
            });
        }

        // Provide recommendations based on category impact
        Object.keys(salesData.categoryBreakdown).forEach(category => {
            const categoryData = salesData.categoryBreakdown[category];
            const categoryImpactPercentage = (categoryData.weatherImpact / categoryData.baseAmount) * 100;

            if (categoryImpactPercentage < -15) {
                recommendations.push({
                    type: 'category',
                    title: `Significant Impact on ${category}`,
                    message: `${category} is heavily affected by weather, sales dropped ${Math.abs(categoryImpactPercentage).toFixed(1)}%.`,
                    action: `Consider adjusting procurement and promotion strategies for ${category}.`
                });
            }
        });

        return recommendations;
    }

    /**
     * Format currency display
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount * 1000000); // Convert to actual amount (million CAD)
    }

    /**
     * Format percentage display
     */
    formatPercentage(percentage) {
        return new Intl.NumberFormat('en-CA', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(percentage / 100);
    }
}