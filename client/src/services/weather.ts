const API_KEY = 'XJWQ444BA2MHNCWS6757AC3PP';
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

export interface WeatherData {
    location: string;
    temp: number;
    conditions: string;
    humidity: number;
    aqi?: number; // Visual Crossing might not always provide AQI in the standard timeline without specific params, but we'll check
    alert?: string;
}

export const CITIES = [
    'Delhi,IN',
    'Mumbai,IN',
    'Bangalore,IN',
    'Chennai,IN',
    'Kolkata,IN',
    'Hyderabad,IN'
];

export const weatherService = {
    async getCityWeather(city: string): Promise<WeatherData | null> {
        try {
            // Fetching current weather
            const response = await fetch(`${BASE_URL}/${city}?unitGroup=metric&key=${API_KEY}&contentType=json`);

            if (!response.ok) {
                throw new Error(`Weather API Error: ${response.statusText}`);
            }

            const data = await response.json();
            const current = data.currentConditions;

            return {
                location: data.address,
                temp: current.temp,
                conditions: current.conditions,
                humidity: current.humidity,
                // Simulating AQI if not present (Visual Crossing standard plan might not have full air quality data easily accessible in this endpoint without addons)
                // For the purpose of this demo, we will infer risk or use a mock if missing, 
                // but let's try to map it if available or use cloud cover/visibility as proxies for "poor conditions" in a pinch
                aqi: current.aqi || undefined,
                alert: data.alerts && data.alerts.length > 0 ? data.alerts[0].event : undefined
            };
        } catch (error) {
            console.error(`Failed to fetch weather for ${city}:`, error);
            return null;
        }
    },

    async getAllCitiesWeather(): Promise<WeatherData[]> {
        const promises = CITIES.map(city => this.getCityWeather(city));
        const results = await Promise.all(promises);
        return results.filter((data): data is WeatherData => data !== null);
    }
};
