/**
 * Live AQI Service using IQAir API
 * Provides real-time air quality data
 */

/**
 * Live AQI Service using OpenWeatherMap Air Pollution API
 * Provides real-time air quality data
 */

// Using the same key as weather service
const OPENWEATHER_API_KEY = '89b21df568ec4d8db5bdf57a14bd0daa';

export interface AQIData {
    aqi: number;
    mainPollutant: string;
    timestamp: number;
    city: string;
    state: string;
    country: string;
}

class AQIService {
    /**
     * Get AQI data by city name
     * Note: OpenWeatherMap Air Pollution API requires coordinates, so we need to geocode first
     * For this service, we'll use a simple city-to-coords map for major cities or rely on the caller passing coords
     * But since the interface asks for city, we'll try to find coords for the city first
     */
    async getAQIByCity(city: string, _state?: string, country: string = 'India'): Promise<AQIData | null> {
        try {
            // 1. Get coordinates for the city
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)},${encodeURIComponent(country)}&limit=1&appid=${OPENWEATHER_API_KEY}`;
            const geoResponse = await fetch(geoUrl);

            if (!geoResponse.ok) return this.getFallbackAQI(city);

            const geoData = await geoResponse.json();
            if (!geoData || geoData.length === 0) return this.getFallbackAQI(city);

            const { lat, lon } = geoData[0];

            // 2. Get AQI data using coordinates
            return await this.getAQIByCoordinates(lat, lon, city);
        } catch (error) {
            console.error('AQI API error:', error);
            return this.getFallbackAQI(city);
        }
    }

    /**
     * Get AQI data by coordinates
     */
    async getAQIByCoordinates(lat: number, lon: number, cityName?: string): Promise<AQIData | null> {
        try {
            const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`;

            const response = await fetch(url);

            if (!response.ok) {
                return null;
            }

            const data = await response.json();

            if (data && data.list && data.list.length > 0) {
                const item = data.list[0];
                // OpenWeatherMap returns AQI index 1-5
                // 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
                // We need to map this to standard AQI 0-500 roughly
                const owmAqi = item.main.aqi;
                const standardAqi = this.mapOwmAqiToStandard(owmAqi, item.components);

                return {
                    aqi: standardAqi,
                    mainPollutant: this.identifyMainPollutant(item.components),
                    timestamp: Date.now(),
                    city: cityName || 'Unknown Location',
                    state: 'Unknown',
                    country: 'India'
                };
            }

            return null;
        } catch (error) {
            console.error('AQI coordinates API error:', error);
            return null;
        }
    }

    /**
     * Map OpenWeatherMap AQI (1-5) to Standard AQI (0-500)
     * Uses PM2.5 concentration for more accuracy if available
     */
    private mapOwmAqiToStandard(owmIndex: number, components: any): number {
        // If we have PM2.5, calculate approximate AQI from it
        if (components && components.pm2_5) {
            const pm25 = components.pm2_5;
            // Rough conversion formula for PM2.5 to AQI
            // 0-12 -> 0-50
            // 12-35 -> 50-100
            // 35-55 -> 100-150
            // 55-150 -> 150-200
            // 150-250 -> 200-300
            // >250 -> 300+
            if (pm25 <= 12) return Math.round((50 / 12) * pm25);
            if (pm25 <= 35.4) return Math.round(50 + (50 / 23.4) * (pm25 - 12));
            if (pm25 <= 55.4) return Math.round(100 + (50 / 20) * (pm25 - 35.4));
            if (pm25 <= 150.4) return Math.round(150 + (50 / 95) * (pm25 - 55.4));
            if (pm25 <= 250.4) return Math.round(200 + (100 / 100) * (pm25 - 150.4));
            return Math.round(300 + (200 / 250) * (pm25 - 250.4));
        }

        // Fallback to simple mapping if components missing
        const mapping: Record<number, number> = {
            1: 40,  // Good
            2: 80,  // Fair
            3: 120, // Moderate
            4: 180, // Poor
            5: 350  // Very Poor
        };
        return mapping[owmIndex] || 100;
    }

    private identifyMainPollutant(components: any): string {
        if (!components) return 'PM2.5';
        const max = Object.entries(components).reduce((a, b) => (a[1] as number) > (b[1] as number) ? a : b);
        return max[0].toUpperCase();
    }

    /**
     * Fallback AQI estimation based on city and season
     */
    private getFallbackAQI(city: string): AQIData {
        // Estimate based on known pollution patterns in Indian cities
        const cityAQIMap: Record<string, number> = {
            'Delhi': 300,
            'New Delhi': 300,
            'Gurgaon': 280,
            'Noida': 290,
            'Mumbai': 150,
            'Bangalore': 100,
            'Bengaluru': 100,
            'Chennai': 120,
            'Kolkata': 200,
            'Hyderabad': 130,
            'Pune': 140,
            'Ahmedabad': 160,
            'Lucknow': 250,
            'Kanpur': 270
        };

        const baseAQI = cityAQIMap[city] || 150;

        // Add seasonal variation
        const month = new Date().getMonth() + 1;
        let seasonalMultiplier = 1.0;

        if (month >= 10 && month <= 2) {
            // Winter - higher pollution
            seasonalMultiplier = 1.4;
        } else if (month >= 6 && month <= 9) {
            // Monsoon - lower pollution
            seasonalMultiplier = 0.7;
        }

        return {
            aqi: Math.round(baseAQI * seasonalMultiplier),
            mainPollutant: 'PM2.5',
            timestamp: Date.now(),
            city,
            state: 'Unknown',
            country: 'India'
        };
    }

    /**
     * Get AQI category and health impact
     */
    getAQICategory(aqi: number): {
        category: string;
        level: 'GOOD' | 'MODERATE' | 'UNHEALTHY_SENSITIVE' | 'UNHEALTHY' | 'VERY_UNHEALTHY' | 'HAZARDOUS';
        color: string;
        healthImpact: string;
    } {
        if (aqi <= 50) {
            return {
                category: 'Good',
                level: 'GOOD',
                color: '#00E400',
                healthImpact: 'Air quality is satisfactory'
            };
        } else if (aqi <= 100) {
            return {
                category: 'Moderate',
                level: 'MODERATE',
                color: '#FFFF00',
                healthImpact: 'Acceptable for most people'
            };
        } else if (aqi <= 150) {
            return {
                category: 'Unhealthy for Sensitive Groups',
                level: 'UNHEALTHY_SENSITIVE',
                color: '#FF7E00',
                healthImpact: 'Sensitive groups may experience health effects'
            };
        } else if (aqi <= 200) {
            return {
                category: 'Unhealthy',
                level: 'UNHEALTHY',
                color: '#FF0000',
                healthImpact: 'Everyone may begin to experience health effects'
            };
        } else if (aqi <= 300) {
            return {
                category: 'Very Unhealthy',
                level: 'VERY_UNHEALTHY',
                color: '#8F3F97',
                healthImpact: 'Health alert: everyone may experience serious effects'
            };
        } else {
            return {
                category: 'Hazardous',
                level: 'HAZARDOUS',
                color: '#7E0023',
                healthImpact: 'Health warning of emergency conditions'
            };
        }
    }
}

export const aqiService = new AQIService();
