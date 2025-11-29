import type { Season, EnvironmentalData } from './types';

/**
 * Simulate environmental data based on season
 * In production, this would call real weather APIs
 */
export function getEnvironmentalData(
    season: Season,
    city: string = 'Delhi',
    date: Date = new Date()
): EnvironmentalData {
    const baseData: EnvironmentalData = {
        location: city,
        timestamp: date.getTime(),
        aqi: 100,
        temperature: 25,
        humidity: 60,
        rainfall: 0
    };

    // Season-specific environmental conditions
    switch (season) {
        case 'WINTER':
            return {
                ...baseData,
                aqi: 350, // Severe pollution in North India
                temperature: 15,
                humidity: 70,
                rainfall: 5,
                weatherAlert: 'Air Quality: Very Poor. Health advisory in effect.'
            };

        case 'SUMMER':
            return {
                ...baseData,
                aqi: 120, // Moderate pollution
                temperature: 40,
                humidity: 30,
                rainfall: 0,
                weatherAlert: 'Heatwave warning. Extreme temperatures expected.'
            };

        case 'MONSOON':
            return {
                ...baseData,
                aqi: 80, // Good air quality due to rain
                temperature: 28,
                humidity: 85,
                rainfall: 150,
                weatherAlert: 'Heavy rainfall expected. Flood risk in low-lying areas.'
            };

        case 'POST_MONSOON':
            return {
                ...baseData,
                aqi: 200, // Pollution starts building up
                temperature: 25,
                humidity: 75,
                rainfall: 20,
                weatherAlert: 'Air quality deteriorating. Vector-borne disease risk continues.'
            };

        default:
            return baseData;
    }
}

/**
 * Calculate AQI risk level
 */
export function calculateAQIRisk(aqi: number): {
    level: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    healthImpact: string;
} {
    if (aqi <= 50) {
        return {
            level: 'Good',
            severity: 'LOW',
            healthImpact: 'Minimal health impact'
        };
    } else if (aqi <= 100) {
        return {
            level: 'Moderate',
            severity: 'LOW',
            healthImpact: 'Acceptable air quality'
        };
    } else if (aqi <= 200) {
        return {
            level: 'Poor',
            severity: 'MEDIUM',
            healthImpact: 'Respiratory issues for sensitive groups'
        };
    } else if (aqi <= 300) {
        return {
            level: 'Very Poor',
            severity: 'HIGH',
            healthImpact: 'Respiratory issues for general population'
        };
    } else {
        return {
            level: 'Severe',
            severity: 'CRITICAL',
            healthImpact: 'Serious health impacts for all'
        };
    }
}

/**
 * Calculate temperature risk level
 */
export function calculateTemperatureRisk(temperature: number): {
    level: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    healthImpact: string;
} {
    if (temperature >= 40) {
        return {
            level: 'Extreme Heat',
            severity: 'CRITICAL',
            healthImpact: 'Heatstroke risk, dehydration'
        };
    } else if (temperature >= 35) {
        return {
            level: 'Very Hot',
            severity: 'HIGH',
            healthImpact: 'Heat exhaustion risk'
        };
    } else if (temperature <= 5) {
        return {
            level: 'Extreme Cold',
            severity: 'HIGH',
            healthImpact: 'Hypothermia risk'
        };
    } else if (temperature <= 10) {
        return {
            level: 'Very Cold',
            severity: 'MEDIUM',
            healthImpact: 'Cold-related illnesses'
        };
    } else {
        return {
            level: 'Normal',
            severity: 'LOW',
            healthImpact: 'Minimal temperature-related health impact'
        };
    }
}
