/**
 * Metro store weather query module
 * Provides functions to retrieve sample store lists and weather data for a given time range.
 * Uses the open-meteo API to fetch daily high/low temperatures, precipitation, and sunshine duration.
 */

class MetroStoreWeather {
    constructor() {
        // Sample store data; can be extended or fetched dynamically via API
        this.stores = [
            { id: 1, name: 'Downtown Toronto Metro', latitude: 43.6532, longitude: -79.3832 },
            { id: 2, name: 'Montreal Central Metro', latitude: 45.5019, longitude: -73.5674 },
            { id: 3, name: 'Ottawa Metro', latitude: 45.4215, longitude: -75.6972 }
        ];
    }

    /**
     * Get weather information for all stores within a time range
     * @param {string} startDate - start date in YYYY-MM-DD format
     * @param {string} endDate - end date in YYYY-MM-DD format
     * @returns {Promise<Array>} Array containing each store and its weather data
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
     * Call the open-meteo API to fetch weather data for a location and compute statistics
     * @param {number} lat - latitude
     * @param {number} lon - longitude
     * @param {string} startDate - start date in YYYY-MM-DD format
     * @param {string} endDate - end date in YYYY-MM-DD format
     * @returns {Promise<Object>} Object containing high/low temperatures, total precipitation, and sunlight hours
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
        const sunlightHours = (daily.sunshine_duration || []).reduce((a, b) => a + b, 0) / 3600; // seconds to hours

        return {
            maxTemp,
            minTemp,
            precipitation,
            sunlightHours
        };
    }
}

// Expose to global scope for console testing
window.MetroStoreWeather = MetroStoreWeather;

