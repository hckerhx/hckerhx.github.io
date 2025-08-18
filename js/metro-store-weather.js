/**
 * Metro门店天气查询模块
 * 提供获取示例门店列表及其在指定时间范围内的天气数据的功能。
 * 使用 open-meteo API 获取每日最高/最低气温、降水量和日照时长。
 */

class MetroStoreWeather {
    constructor() {
        // 示例门店数据，可根据实际情况扩展或通过API动态获取
        this.stores = [
            { id: 1, name: 'Downtown Toronto Metro', latitude: 43.6532, longitude: -79.3832 },
            { id: 2, name: 'Montreal Central Metro', latitude: 45.5019, longitude: -73.5674 },
            { id: 3, name: 'Ottawa Metro', latitude: 45.4215, longitude: -75.6972 }
        ];
    }

    /**
     * 获取所有门店在指定时间范围内的天气信息
     * @param {string} startDate - 开始日期，格式 YYYY-MM-DD
     * @param {string} endDate - 结束日期，格式 YYYY-MM-DD
     * @returns {Promise<Array>} 包含每个门店及其天气信息的数组
     */
    async getStoresWeather(startDate, endDate) {
        const results = [];
        for (const store of this.stores) {
            const weather = await this.fetchWeather(
                store.latitude,
                store.longitude,
                startDate,
                endDate
            );
            results.push({ ...store, weather });
        }
        return results;
    }

    /**
     * 调用 open-meteo API 获取指定位置的天气数据，并计算统计信息
     * @param {number} lat - 纬度
     * @param {number} lon - 经度
     * @param {string} startDate - 开始日期，格式 YYYY-MM-DD
     * @param {string} endDate - 结束日期，格式 YYYY-MM-DD
     * @returns {Promise<Object>} 含最高/最低气温、降水总量和日照时长（小时）的对象
     */
    async fetchWeather(lat, lon, startDate, endDate) {
        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            start_date: startDate,
            end_date: endDate,
            daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,sunshine_duration',
            timezone: 'auto'
        });

        const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Weather API request failed');
        }
        const data = await response.json();
        const daily = data.daily || {};

        const maxTemp = Math.max(...(daily.temperature_2m_max || []));
        const minTemp = Math.min(...(daily.temperature_2m_min || []));
        const precipitation = (daily.precipitation_sum || []).reduce((a, b) => a + b, 0);
        const sunlightHours = (daily.sunshine_duration || []).reduce((a, b) => a + b, 0) / 3600; // 秒转小时

        return {
            maxTemp,
            minTemp,
            precipitation,
            sunlightHours
        };
    }
}

// 暴露到全局作用域，便于在控制台中测试
window.MetroStoreWeather = MetroStoreWeather;

