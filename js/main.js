/**
 * Main application logic
 * Handles user interactions and data flow
 */

class MetroWeatherAnalyzer {
    constructor() {
        this.weatherManager = new WeatherDataManager();
        this.salesCalculator = new SalesCalculator();
        this.chartUtils = new ChartUtils();
        
        // Store chart instances
        this.charts = {
            salesChart: null,
            weatherImpactChart: null,
            categoryChart: null,
            regionalChart: null
        };
        
        this.initialize();
    }

    /**
     * Initialize the application
     */
    initialize() {
        this.setupEventListeners();
        this.setDefaultDates();
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        const timeForm = document.getElementById('timeForm');
        if (timeForm) {
            timeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAnalysisRequest();
            });
        }

        // Date validation
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');

        if (startDateInput && endDateInput) {
            startDateInput.addEventListener('change', () => this.validateDateRange());
            endDateInput.addEventListener('change', () => this.validateDateRange());
        }
    }

    /**
     * Set default dates
     */
    setDefaultDates() {
        const today = new Date();
        const startDate = new Date(today.getFullYear(), 0, 1); // January 1 of the current year
        const endDate = new Date(today.getFullYear(), 11, 31); // December 31 of the current year

        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');

        if (startDateInput && endDateInput) {
            startDateInput.value = this.formatDateForInput(startDate);
            endDateInput.value = this.formatDateForInput(endDate);
        }
    }

    /**
     * Format date for input[type="date"]
     */
    formatDateForInput(date) {
        return date.toISOString().split('T')[0];
    }

    /**
     * Validate date range
     */
    validateDateRange() {
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');

        if (!startDateInput || !endDateInput) return;

        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        if (startDate >= endDate) {
            endDateInput.setCustomValidity('End date must be after start date');
        } else if (endDate - startDate > 365 * 24 * 60 * 60 * 1000 * 2) {
            // Limit maximum time range to 2 years
            endDateInput.setCustomValidity('Time range cannot exceed 2 years');
        } else {
            endDateInput.setCustomValidity('');
        }
    }

    /**
     * Handle analysis request
     */
    async handleAnalysisRequest() {
        try {
            // Show loading state
            this.showLoading();

            // Get user input
            const startDateInput = document.getElementById('startDate');
            const endDateInput = document.getElementById('endDate');

            if (!startDateInput || !endDateInput) {
                throw new Error('Unable to retrieve date inputs');
            }

            const startDate = startDateInput.value;
            const endDate = endDateInput.value;

            if (!startDate || !endDate) {
                throw new Error('Please select start and end dates');
            }

            // Simulate asynchronous processing
            await this.delay(1500);

            // Perform analysis
            await this.performAnalysis(startDate, endDate);

        } catch (error) {
            console.error('Error occurred during analysis:', error);
            this.showError(error.message);
        }
    }

    /**
     * Perform analysis
     */
    async performAnalysis(startDate, endDate) {
        // 1. Get quarter information
        const quarters = this.weatherManager.getQuartersInRange(startDate, endDate);
        
        if (quarters.length === 0) {
            throw new Error('No complete quarters found within the selected range');
        }

        // 2. Analyze each quarter
        const analysisResults = [];
        
        for (const quarter of quarters) {
     
            // Generate weather events
            const weatherEvents = await this.weatherManager.fetchWeatherEvents(
                quarter.startDate,
                quarter.endDate
            );
            
            // Calculate sales impact
            const baseSales = this.salesCalculator.calculateBaseSales(quarter, quarter.year);
            const salesImpact = this.salesCalculator.calculateWeatherImpact(baseSales, weatherEvents);
            
            // Generate monthly data
            const monthlyData = this.salesCalculator.generateMonthlySalesData(
                quarter, salesImpact.finalSales, weatherEvents
            );
            
            // Historical comparison
            const historicalComparison = this.salesCalculator.calculateHistoricalComparison(
                salesImpact, quarter
            );
            
            // Forecast recommendations
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

        // 3. Display results
        this.displayResults(analysisResults);
    }

    /**
     * Display analysis results
     */
    displayResults(analysisResults) {
        // Hide loading state
        this.hideLoading();

        // Show results section
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
            resultsSection.style.display = 'block';
        }

        // Display quarter information
        this.displayQuarterInfo(analysisResults);

        // Display weather events
        this.displayWeatherEvents(analysisResults);

        // Create charts
        this.createCharts(analysisResults);

        // Display statistics
        this.displayStatistics(analysisResults);

        // Scroll to results section
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Display quarter information
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
                        <span class="metric-label">Base Sales:</span>
                        <span class="metric-value">${this.salesCalculator.formatCurrency(salesImpact.baseSales)}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Actual Sales:</span>
                        <span class="metric-value">${this.salesCalculator.formatCurrency(salesImpact.finalSales)}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Weather Impact:</span>
                        <span class="metric-value ${salesImpact.impactPercentage < 0 ? 'negative' : 'positive'}">
                            ${this.salesCalculator.formatPercentage(salesImpact.impactPercentage)}
                        </span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Year-over-Year Change:</span>
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
     * Display weather events
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
                                ${this.formatDate(event.date)} (lasting ${event.duration} days)
                            </div>
                            <div class="weather-event-impact">${event.description}</div>
                        </div>
                    </div>
                `;
            });
        });

        if (html === '') {
            html = '<p class="text-center">No extreme weather events were recorded for the selected time range.</p>';
        }

        weatherEventsContainer.innerHTML = html;
    }

    /**
     * Create charts
     */
    createCharts(analysisResults) {
        // Destroy existing charts
        Object.values(this.charts).forEach(chart => {
            this.chartUtils.destroyChart(chart);
        });

        // Combine all data for chart display
        const allMonthlyData = [];
        const allWeatherEvents = [];
        let totalSalesImpact = null;

        analysisResults.forEach(result => {
            allMonthlyData.push(...result.monthlyData);
            allWeatherEvents.push(...result.weatherEvents);
            
            if (!totalSalesImpact) {
                totalSalesImpact = { ...result.salesImpact };
            } else {
                // Merge sales impact data
                totalSalesImpact.baseSales += result.salesImpact.baseSales;
                totalSalesImpact.finalSales += result.salesImpact.finalSales;
                totalSalesImpact.totalWeatherImpact += result.salesImpact.totalWeatherImpact;
                
                // Merge category data
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

        // Recalculate overall impact percentage
        if (totalSalesImpact) {
            totalSalesImpact.impactPercentage = 
                (totalSalesImpact.totalWeatherImpact / totalSalesImpact.baseSales) * 100;
        }

        // Create sales trend chart
        this.charts.salesChart = this.chartUtils.createSalesChart(
            'salesChart', allMonthlyData, allWeatherEvents
        );

        // Create weather impact comparison chart
        this.charts.weatherImpactChart = this.chartUtils.createWeatherImpactChart(
            'weatherImpactChart', allWeatherEvents, this.salesCalculator
        );

        // If multiple quarters exist, create category impact pie chart
        if (totalSalesImpact && totalSalesImpact.categoryBreakdown) {
            // Create a new canvas for the category chart if it doesn't exist
            this.createCategoryChartCanvas();
            this.charts.categoryChart = this.chartUtils.createCategoryImpactChart(
                'categoryChart', totalSalesImpact.categoryBreakdown
            );
        }
    }

    /**
     * Create category chart canvas
     */
    createCategoryChartCanvas() {
        const existingCanvas = document.getElementById('categoryChart');
        if (existingCanvas) return;

        const weatherImpactChartContainer = document.getElementById('weatherImpactChart').parentElement;
        const newChartContainer = weatherImpactChartContainer.cloneNode(false);
        
        newChartContainer.innerHTML = `
            <h3><i class="fas fa-chart-pie"></i> Product Category Impact Analysis</h3>
            <div class="chart-container">
                <canvas id="categoryChart" style="height: 350px;"></canvas>
            </div>
        `;

        weatherImpactChartContainer.parentElement.insertBefore(
            newChartContainer, weatherImpactChartContainer.nextSibling
        );
    }

    /**
     * Display statistics
     */
    displayStatistics(analysisResults) {
        const statsGridContainer = document.getElementById('statsGrid');
        if (!statsGridContainer) return;

        // Calculate summary statistics
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
                <h4>Total Weather Events</h4>
                <div class="value">${totalEvents}</div>
                <div class="change neutral">
                    including ${severeEventCount} severe events
                </div>
            </div>
            
            <div class="stat-card">
                <h4>Base Sales</h4>
                <div class="value">${this.salesCalculator.formatCurrency(totalBaseSales)}</div>
                <div class="change neutral">
                    Projected revenue during the analysis period
                </div>
            </div>
            
            <div class="stat-card">
                <h4>Actual Sales</h4>
                <div class="value">${this.salesCalculator.formatCurrency(totalFinalSales)}</div>
                <div class="change ${totalWeatherImpact < 0 ? 'negative' : 'positive'}">
                    ${totalWeatherImpact < 0 ? 'Negative weather impact' : 'Minimal weather impact'}
                </div>
            </div>
            
            <div class="stat-card">
                <h4>Total Weather Impact</h4>
                <div class="value">${this.salesCalculator.formatCurrency(Math.abs(totalWeatherImpact))}</div>
                <div class="change ${totalWeatherImpact < 0 ? 'negative' : 'positive'}">
                    ${this.salesCalculator.formatPercentage(overallImpactPercentage)}
                </div>
            </div>
            
            <div class="stat-card">
                <h4>Number of Quarters Analyzed</h4>
                <div class="value">${analysisResults.length}</div>
                <div class="change neutral">
                    Covering ${analysisResults.length} quarters
                </div>
            </div>
            
            <div class="stat-card">
                <h4>Impact Rating</h4>
                <div class="value">
                    ${Math.abs(overallImpactPercentage) > 10 ? 'Severe' :
                      Math.abs(overallImpactPercentage) > 5 ? 'Moderate' : 'Mild'}
                </div>
                <div class="change ${Math.abs(overallImpactPercentage) > 10 ? 'negative' :
                                     Math.abs(overallImpactPercentage) > 5 ? 'neutral' : 'positive'}">
                    Requires ${Math.abs(overallImpactPercentage) > 10 ? 'immediate attention' :
                           Math.abs(overallImpactPercentage) > 5 ? 'close monitoring' : 'routine monitoring'}
                </div>
            </div>
        `;

        statsGridContainer.innerHTML = html;
    }

    /**
     * Show loading state
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
     * Hide loading state
     */
    hideLoading() {
        const loadingSection = document.getElementById('loadingSection');
        if (loadingSection) {
            loadingSection.style.display = 'none';
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        this.hideLoading();
        
        // Create error message
        const errorHtml = `
            <div class="card text-center" style="border-left: 4px solid #ef4444;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;"></i>
                <h3 style="color: #ef4444;">An error occurred during analysis</h3>
                <p style="color: #6b7280;">${message}</p>
                <button class="btn-primary" onclick="location.reload()">
                    <i class="fas fa-refresh"></i> Restart
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
     * Format date display
     */
    formatDate(date) {
        return new Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    /**
     * Delay helper
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const analyzer = new MetroWeatherAnalyzer();
    
    // Expose the instance globally for debugging
    window.metroAnalyzer = analyzer;
    
    console.log('Metro Weather Impact Analysis System initialized');
});