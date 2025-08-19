/**
 * Weather data simulation module
 * Simulates extreme weather events across Canadian regions
 */

class WeatherDataManager {
    constructor() {
        // Weather patterns for major Canadian provinces/regions
        this.weatherPatterns = {
            'Ontario': {
                winter: ['Blizzard', 'Ice Storm', 'Extreme Cold'],
                spring: ['Flood', 'Hailstorm', 'Tornado'],
                summer: ['Heatwave', 'Thunderstorm', 'Drought'],
                autumn: ['Hurricane Remnants', 'Early Frost', 'Heavy Rain']
            },
            'Quebec': {
                winter: ['Blizzard', 'Ice Storm', 'Extreme Cold'],
                spring: ['Spring Flood', 'Hailstorm'],
                summer: ['Heatwave', 'Thunderstorm'],
                autumn: ['Heavy Rain', 'Early Frost']
            },
            'British Columbia': {
                winter: ['Heavy Rain', 'Flood', 'High Winds'],
                spring: ['Flood', 'Landslide'],
                summer: ['Wildfire', 'Drought', 'Heatwave'],
                autumn: ['Heavy Rain', 'High Winds']
            },
            'Alberta': {
                winter: ['Blizzard', 'Extreme Cold', 'High Winds'],
                spring: ['Hailstorm', 'Tornado'],
                summer: ['Thunderstorm', 'Hailstorm', 'Drought'],
                autumn: ['Early Frost', 'Blizzard']
            },
            'Manitoba': {
                winter: ['Blizzard', 'Extreme Cold'],
                spring: ['Flood', 'Hailstorm'],
                summer: ['Thunderstorm', 'Drought'],
                autumn: ['Early Frost', 'Blizzard']
            },
            'Saskatchewan': {
                winter: ['Blizzard', 'Extreme Cold', 'High Winds'],
                spring: ['Hailstorm', 'Tornado'],
                summer: ['Thunderstorm', 'Drought'],
                autumn: ['Early Frost', 'Blizzard']
            }
        };

        // Severity and impact factors for weather events
        this.weatherImpacts = {
            'Blizzard': { severity: 'severe', impactFactor: -0.25, icon: 'fas fa-snowflake' },
            'Ice Storm': { severity: 'severe', impactFactor: -0.30, icon: 'fas fa-icicles' },
            'Extreme Cold': { severity: 'severe', impactFactor: -0.20, icon: 'fas fa-thermometer-empty' },
            'Flood': { severity: 'severe', impactFactor: -0.35, icon: 'fas fa-water' },
            'Hailstorm': { severity: 'moderate', impactFactor: -0.15, icon: 'fas fa-cloud-hail' },
            'Tornado': { severity: 'severe', impactFactor: -0.40, icon: 'fas fa-tornado' },
            'Heatwave': { severity: 'moderate', impactFactor: -0.12, icon: 'fas fa-temperature-high' },
            'Thunderstorm': { severity: 'moderate', impactFactor: -0.08, icon: 'fas fa-bolt' },
            'Drought': { severity: 'moderate', impactFactor: -0.10, icon: 'fas fa-sun' },
            'Hurricane Remnants': { severity: 'severe', impactFactor: -0.28, icon: 'fas fa-hurricane' },
            'Early Frost': { severity: 'mild', impactFactor: -0.05, icon: 'fas fa-snowflake' },
            'Heavy Rain': { severity: 'moderate', impactFactor: -0.12, icon: 'fas fa-cloud-rain' },
            'Spring Flood': { severity: 'moderate', impactFactor: -0.18, icon: 'fas fa-water' },
            'Wildfire': { severity: 'severe', impactFactor: -0.22, icon: 'fas fa-fire' },
            'Landslide': { severity: 'severe', impactFactor: -0.25, icon: 'fas fa-mountain' },
            'High Winds': { severity: 'mild', impactFactor: -0.08, icon: 'fas fa-wind' }
        };
    }

    /**
     * Get quarters within a date range
     */
    getQuartersInRange(startDate, endDate) {
        const quarters = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        let currentYear = start.getFullYear();
        let currentQuarter = Math.floor((start.getMonth()) / 3) + 1;
        
        while (new Date(currentYear, (currentQuarter - 1) * 3, 1) <= end) {
            const quarterStart = new Date(currentYear, (currentQuarter - 1) * 3, 1);
            const quarterEnd = new Date(currentYear, currentQuarter * 3, 0);
            
            quarters.push({
                year: currentYear,
                quarter: currentQuarter,
                startDate: quarterStart,
                endDate: quarterEnd,
                season: this.getSeason(currentQuarter),
                label: `Q${currentQuarter} ${currentYear}`
            });
            
            currentQuarter++;
            if (currentQuarter > 4) {
                currentQuarter = 1;
                currentYear++;
            }
        }
        
        return quarters;
    }

    /**
     * Get season from quarter
     */
    getSeason(quarter) {
        const seasons = ['winter', 'spring', 'summer', 'autumn'];
        return seasons[(quarter - 1) % 4];
    }

    /**
     * 尝试从API获取真实天气事件数据
     * 如果API调用失败则回退到模拟数据
     */
    async fetchWeatherEvents(startDate, endDate) {
        const start = new Date(startDate).toISOString();
        const end = new Date(endDate).toISOString();
        const apiUrl = `https://api.weather.gc.ca/collections/alerts/items?start=${start}&end=${end}&f=json`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            if (!data || !data.features) {
                throw new Error('Invalid API response');
            }

            // API事件类型到本地事件类型的映射
            const typeMap = {
                'Snowfall Warning': '暴雪',
                'Snow Squall Warning': '暴雪',
                'Blizzard Warning': '暴雪',
                'Freezing Rain Warning': '冰暴',
                'Extreme Cold Warning': '严寒',
                'Flood Warning': '洪水',
                'Rainfall Warning': '暴雨',
                'Heat Warning': '热浪',
                'Wind Warning': '大风',
                'Severe Thunderstorm Warning': '雷暴',
                'Tornado Warning': '龙卷风',
                'Dust Advisory': '干旱',
                'Wildfire': '森林火灾'
            };

            const events = data.features.map(feature => {
                const props = feature.properties || {};
                const apiType = props.event || '未知天气';
                const type = typeMap[apiType] || apiType;
                const province = props.province || props.areaDesc || 'Unknown';
                const eventStart = props.onset ? new Date(props.onset) : new Date(startDate);
                const eventEnd = props.ended ? new Date(props.ended) : (props.expires ? new Date(props.expires) : eventStart);
                const duration = Math.max(1, Math.ceil((eventEnd - eventStart) / (24 * 60 * 60 * 1000)));
                const impact = this.weatherImpacts[type] || { severity: 'moderate', impactFactor: -0.1, icon: 'fas fa-exclamation-triangle' };
                const description = props.description || `${province}出现${type}天气`;

                return {
                    type: type,
                    province: province,
                    date: eventStart,
                    duration: duration,
                    impact: impact,
                    description: description
                };
            });

            // 按日期排序
            events.sort((a, b) => a.date - b.date);
            return events;
        } catch (error) {
            console.warn('获取天气事件失败，使用模拟数据', error);
            const quarters = this.getQuartersInRange(startDate, endDate);
            let events = [];
            for (const quarter of quarters) {
                events = events.concat(this.generateWeatherEvents(quarter));
            }
            return events;
        }
    }

    /**
     * 生成指定季度的天气事件
     */
    generateWeatherEvents(quarterInfo) {
        const events = [];
        const provinces = Object.keys(this.weatherPatterns);
        
        // Generate 3-8 random weather events per quarter
        const eventCount = Math.floor(Math.random() * 6) + 3;
        
        for (let i = 0; i < eventCount; i++) {
            const province = provinces[Math.floor(Math.random() * provinces.length)];
            const seasonEvents = this.weatherPatterns[province][quarterInfo.season];
            const eventType = seasonEvents[Math.floor(Math.random() * seasonEvents.length)];
            
            // Generate random date within the quarter
            const eventDate = this.generateRandomDateInRange(quarterInfo.startDate, quarterInfo.endDate);
            
            // Generate duration
            const duration = Math.floor(Math.random() * 7) + 1;
            
            events.push({
                type: eventType,
                province: province,
                date: eventDate,
                duration: duration,
                impact: this.weatherImpacts[eventType],
                description: this.generateEventDescription(eventType, province, duration)
            });
        }
        
        // Sort by date
        events.sort((a, b) => a.date - b.date);
        
        return events;
    }

    /**
     * Generate random date
     */
    generateRandomDateInRange(start, end) {
        const startTime = start.getTime();
        const endTime = end.getTime();
        const randomTime = startTime + Math.random() * (endTime - startTime);
        return new Date(randomTime);
    }

    /**
     * Generate weather event description
     */
    generateEventDescription(eventType, province, duration) {
        const descriptions = {
            'Blizzard': `${province} was hit by a severe blizzard with snow over 30 cm deep`,
            'Ice Storm': `${province} experienced a major ice storm causing widespread power outages`,
            'Extreme Cold': `${province} faced extreme cold with temperatures dropping below -30°C`,
            'Flood': `${province} suffered flooding with multiple roads submerged`,
            'Hailstorm': `${province} was struck by hail with stones 2-5 cm in diameter`,
            'Tornado': `${province} issued a tornado warning with winds over 200 km/h`,
            'Heatwave': `${province} endured extreme heat with temperatures above 35°C`,
            'Thunderstorm': `${province} had severe thunderstorms with strong winds and heavy rain`,
            'Drought': `${province} experienced prolonged drought with 70% less rainfall than average`,
            'Hurricane Remnants': `${province} was impacted by hurricane remnants bringing strong winds and rain`,
            'Early Frost': `${province} saw an unusually early frost affecting crops`,
            'Heavy Rain': `${province} was hit by heavy rain exceeding 100 mm in 24 hours`,
            'Spring Flood': `${province} dealt with spring melt flooding as river levels rose`,
            'Wildfire': `${province} suffered a large wildfire, with smoke affecting air quality`,
            'Landslide': `Landslides triggered by heavy rain occurred in ${province}`,
            'High Winds': `${province} experienced high winds with gusts up to 100 km/h`
        };

        const baseDescription = descriptions[eventType] || `${province} experienced ${eventType} conditions`;
        return `${baseDescription}, lasting ${duration} days, causing significant impact on retail operations.`;
    }

    /**
     * Calculate overall sales impact from weather events
     */
    calculateWeatherImpact(events) {
        let totalImpact = 0;
        let severeEvents = 0;
        let moderateEvents = 0;
        let mildEvents = 0;
        
        events.forEach(event => {
            const impact = event.impact.impactFactor * event.duration;
            totalImpact += impact;
            
            switch (event.impact.severity) {
                case 'severe':
                    severeEvents++;
                    break;
                case 'moderate':
                    moderateEvents++;
                    break;
                case 'mild':
                    mildEvents++;
                    break;
            }
        });
        
        return {
            totalImpact: totalImpact,
            averageImpact: events.length > 0 ? totalImpact / events.length : 0,
            eventCounts: {
                severe: severeEvents,
                moderate: moderateEvents,
                mild: mildEvents,
                total: events.length
            }
        };
    }

    /**
     * Get statistics for weather events
     */
    getWeatherStats(events) {
        const stats = {};
        
        events.forEach(event => {
            if (!stats[event.type]) {
                stats[event.type] = {
                    count: 0,
                    totalDuration: 0,
                    provinces: new Set()
                };
            }
            
            stats[event.type].count++;
            stats[event.type].totalDuration += event.duration;
            stats[event.type].provinces.add(event.province);
        });
        
        // Convert Set to array
        Object.keys(stats).forEach(type => {
            stats[type].provinces = Array.from(stats[type].provinces);
        });
        
        return stats;
    }
}
