# Metro Quarterly Sales Weather Impact Analysis System

> A specialized analysis tool for Metro retailers in Canada to evaluate the impact of extreme weather events on quarterly sales.

## 🎯 Overview

The Metro Quarterly Sales Weather Impact Analysis System helps Metro retailers analyze how extreme weather events affect quarterly sales. The system provides intuitive visualizations and detailed analysis reports that support multi-quarter spans.

## ✨ Features

### 🔧 Core Functions
- **Time Range Selection**: Users specify start and end dates, and the system automatically detects complete quarters.
- **Quarter Recognition**: Identifies full quarters within the selected range.
- **Weather Event Simulation**: Generates extreme weather events based on real patterns across Canadian provinces.
- **Sales Impact Calculation**: Evaluates how weather events influence sales from multiple perspectives.
- **Data Visualization**: Uses Chart.js to create interactive charts.
- **Store Weather Query**: Retrieves example Metro store weather data (high/low temperatures, precipitation, sunshine hours) for the chosen period.

### 📊 Analysis Dimensions
- **Regional Analysis**: Covers six major Canadian provinces (Ontario, Quebec, BC, Alberta, Manitoba, Saskatchewan).
- **Seasonal Analysis**: Considers seasonal weather patterns.
- **Product Category Impact**: Assesses four categories—groceries, health products, household items, apparel & footwear.
- **Severity Levels**: Classifies weather events as severe, moderate, or mild.

### 📈 Visualizations
- **Sales Trend Chart**: Baseline vs. actual sales comparison.
- **Weather Impact Chart**: Aggregated impact of various weather events.
- **Category Pie Chart**: Distribution of weather impact across product categories.
- **Regional Radar Chart**: Weather event distribution and severity by province.

### 📋 Data Statistics
- **Summary**: Total weather events, sales totals, impact rating.
- **Historical Comparison**: Comparison with the same period last year.
- **Forecast Suggestions**: Business recommendations based on the analysis.

## 🚀 Usage

1. Open `index.html`.
2. Select the start and end dates.
3. Click **Run Analysis**.
4. Review the generated report.

## 🏗️ Project Structure

```
├── index.html              # Main page
├── css/
│   └── style.css           # Main stylesheet
├── js/
│   ├── main.js             # Application logic
│   ├── weather-data.js     # Weather data simulation
│   ├── sales-calculator.js # Sales impact calculator
│   ├── chart-utils.js      # Chart utilities
│   └── metro-store-weather.js # Sample store weather
└── README.md               # Documentation
```

## 📞 Support

- Modern browser (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- JavaScript enabled
- Internet connection for CDN resources

---

**Development Team**: Metro Data Analysis Team  
**Last Update**: December 2024  
**Version**: 1.0.0

