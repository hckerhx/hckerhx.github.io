/**
 * 天气数据模拟模块
 * 模拟加拿大不同地区的极端天气事件数据
 */

class WeatherDataManager {
    constructor() {
        // 加拿大主要省份/地区的天气模式
        this.weatherPatterns = {
            'Ontario': {
                winter: ['暴雪', '冰暴', '严寒'],
                spring: ['洪水', '冰雹', '龙卷风'],
                summer: ['热浪', '雷暴', '干旱'],
                autumn: ['飓风残余', '早霜', '暴雨']
            },
            'Quebec': {
                winter: ['暴雪', '冰暴', '严寒'],
                spring: ['春汛', '冰雹'],
                summer: ['热浪', '雷暴'],
                autumn: ['暴雨', '早霜']
            },
            'British Columbia': {
                winter: ['暴雨', '洪水', '大风'],
                spring: ['洪水', '滑坡'],
                summer: ['森林火灾', '干旱', '热浪'],
                autumn: ['暴雨', '大风']
            },
            'Alberta': {
                winter: ['暴雪', '严寒', '大风'],
                spring: ['冰雹', '龙卷风'],
                summer: ['雷暴', '冰雹', '干旱'],
                autumn: ['早霜', '暴雪']
            },
            'Manitoba': {
                winter: ['暴雪', '严寒'],
                spring: ['洪水', '冰雹'],
                summer: ['雷暴', '干旱'],
                autumn: ['早霜', '暴雪']
            },
            'Saskatchewan': {
                winter: ['暴雪', '严寒', '大风'],
                spring: ['冰雹', '龙卷风'],
                summer: ['雷暴', '干旱'],
                autumn: ['早霜', '暴雪']
            }
        };

        // 天气事件的严重程度和影响系数
        this.weatherImpacts = {
            '暴雪': { severity: 'severe', impactFactor: -0.25, icon: 'fas fa-snowflake' },
            '冰暴': { severity: 'severe', impactFactor: -0.30, icon: 'fas fa-icicles' },
            '严寒': { severity: 'severe', impactFactor: -0.20, icon: 'fas fa-thermometer-empty' },
            '洪水': { severity: 'severe', impactFactor: -0.35, icon: 'fas fa-water' },
            '冰雹': { severity: 'moderate', impactFactor: -0.15, icon: 'fas fa-cloud-hail' },
            '龙卷风': { severity: 'severe', impactFactor: -0.40, icon: 'fas fa-tornado' },
            '热浪': { severity: 'moderate', impactFactor: -0.12, icon: 'fas fa-temperature-high' },
            '雷暴': { severity: 'moderate', impactFactor: -0.08, icon: 'fas fa-bolt' },
            '干旱': { severity: 'moderate', impactFactor: -0.10, icon: 'fas fa-sun' },
            '飓风残余': { severity: 'severe', impactFactor: -0.28, icon: 'fas fa-hurricane' },
            '早霜': { severity: 'mild', impactFactor: -0.05, icon: 'fas fa-snowflake' },
            '暴雨': { severity: 'moderate', impactFactor: -0.12, icon: 'fas fa-cloud-rain' },
            '春汛': { severity: 'moderate', impactFactor: -0.18, icon: 'fas fa-water' },
            '森林火灾': { severity: 'severe', impactFactor: -0.22, icon: 'fas fa-fire' },
            '滑坡': { severity: 'severe', impactFactor: -0.25, icon: 'fas fa-mountain' },
            '大风': { severity: 'mild', impactFactor: -0.08, icon: 'fas fa-wind' }
        };
    }

    /**
     * 获取指定时间范围内的季度
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
                label: `${currentYear}年第${currentQuarter}季度`
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
     * 根据季度获取季节
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
        
        // 每个季度生成3-8个随机天气事件
        const eventCount = Math.floor(Math.random() * 6) + 3;
        
        for (let i = 0; i < eventCount; i++) {
            const province = provinces[Math.floor(Math.random() * provinces.length)];
            const seasonEvents = this.weatherPatterns[province][quarterInfo.season];
            const eventType = seasonEvents[Math.floor(Math.random() * seasonEvents.length)];
            
            // 生成随机日期（在季度范围内）
            const eventDate = this.generateRandomDateInRange(quarterInfo.startDate, quarterInfo.endDate);
            
            // 生成持续天数
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
        
        // 按日期排序
        events.sort((a, b) => a.date - b.date);
        
        return events;
    }

    /**
     * 生成随机日期
     */
    generateRandomDateInRange(start, end) {
        const startTime = start.getTime();
        const endTime = end.getTime();
        const randomTime = startTime + Math.random() * (endTime - startTime);
        return new Date(randomTime);
    }

    /**
     * 生成天气事件描述
     */
    generateEventDescription(eventType, province, duration) {
        const descriptions = {
            '暴雪': `${province}地区遭遇强烈暴雪，积雪深度超过30厘米`,
            '冰暴': `${province}出现严重冰暴天气，导致大面积停电`,
            '严寒': `${province}经历极端低温，气温降至-30°C以下`,
            '洪水': `${province}发生洪涝灾害，多条道路被淹`,
            '冰雹': `${province}遭遇冰雹袭击，冰雹直径达2-5厘米`,
            '龙卷风': `${province}出现龙卷风警报，风速超过200km/h`,
            '热浪': `${province}经历极端高温，气温超过35°C`,
            '雷暴': `${province}出现强雷暴天气，伴有强风和暴雨`,
            '干旱': `${province}持续干旱，降水量比往年同期减少70%`,
            '飓风残余': `${province}受飓风残余影响，出现强风暴雨`,
            '早霜': `${province}出现异常早霜，影响农作物生长`,
            '暴雨': `${province}遭遇暴雨袭击，24小时降水量超过100毫米`,
            '春汛': `${province}春季融雪导致河流水位上涨`,
            '森林火灾': `${province}发生大规模森林火灾，烟雾影响空气质量`,
            '滑坡': `${province}山区因暴雨引发滑坡灾害`,
            '大风': `${province}出现大风天气，阵风风力达8-10级`
        };
        
        const baseDescription = descriptions[eventType] || `${province}出现${eventType}天气`;
        return `${baseDescription}，持续${duration}天，对零售业务造成显著影响。`;
    }

    /**
     * 计算天气事件对销售的综合影响
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
     * 获取天气事件的统计数据
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
        
        // 转换Set为数组
        Object.keys(stats).forEach(type => {
            stats[type].provinces = Array.from(stats[type].provinces);
        });
        
        return stats;
    }
}
