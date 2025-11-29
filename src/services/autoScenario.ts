import { geolocationService } from '../services/geolocation';
import { aqiService } from '../services/aqi';
import { weatherService } from '../services/weather';
import { getUpcomingFestivals } from '../forecasting/festivalCalendar';
import { getCurrentSeason } from '../forecasting/seasonDetector';
import type { EventType, SimulationEvent } from '../types';

/**
 * Auto Scenario Detection Service
 * Analyzes live data to automatically detect and trigger appropriate scenarios
 */

export interface DetectedScenario {
    type: EventType;
    event: SimulationEvent;
    confidence: number;
    triggers: string[];
    liveDataSources: string[];
}

class AutoScenarioService {
    /**
     * Detect current scenario based on live environmental data
     */
    async detectScenario(): Promise<DetectedScenario | null> {
        const triggers: string[] = [];
        const liveDataSources: string[] = [];

        try {
            // Get current location
            const location = geolocationService.getCachedLocation();
            const city = location?.city || 'Delhi';

            // Fetch live data
            const [aqiData, weatherData, festivals] = await Promise.all([
                aqiService.getAQIByCity(city),
                weatherService.getCityWeather(`${city},IN`),
                Promise.resolve(getUpcomingFestivals(7)) // Next 7 days
            ]);

            // Check for pollution spike
            if (aqiData && aqiData.aqi > 200) {
                triggers.push(`Critical AQI: ${aqiData.aqi} (${aqiService.getAQICategory(aqiData.aqi).category})`);
                liveDataSources.push('IQAir API');

                return {
                    type: 'POLLUTION_SPIKE',
                    event: {
                        id: 'auto-pollution',
                        name: 'Air Quality Alert',
                        type: 'POLLUTION_SPIKE',
                        severity: aqiData.aqi > 300 ? 'CRITICAL' : 'HIGH',
                        description: `Live AQI reading of ${aqiData.aqi} detected in ${city}. ${aqiService.getAQICategory(aqiData.aqi).healthImpact}. Expect surge in respiratory cases.`,
                        affectedDepartments: ['Emergency', 'Pulmonology', 'Pediatrics']
                    },
                    confidence: 0.95,
                    triggers,
                    liveDataSources
                };
            }

            // Check for upcoming festivals
            if (festivals.length > 0) {
                const nearestFestival = festivals[0];
                const daysUntil = Math.ceil((nearestFestival.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

                if (daysUntil <= 3) {
                    triggers.push(`${nearestFestival.name} in ${daysUntil} days`);
                    liveDataSources.push('Festival Calendar');

                    return {
                        type: 'FESTIVAL',
                        event: {
                            id: 'auto-festival',
                            name: `${nearestFestival.name} Preparation`,
                            type: 'FESTIVAL',
                            severity: nearestFestival.historicalSurgeMultiplier >= 3 ? 'HIGH' : 'MEDIUM',
                            description: `${nearestFestival.name} is ${daysUntil} days away. Historical data shows ${Math.round((nearestFestival.historicalSurgeMultiplier - 1) * 100)}% surge in ${nearestFestival.healthRisks.join(', ')} cases.`,
                            affectedDepartments: nearestFestival.affectedDepartments
                        },
                        confidence: 0.9,
                        triggers,
                        liveDataSources
                    };
                }
            }

            // Check for epidemic indicators (monsoon + high humidity)
            const season = getCurrentSeason();
            if ((season === 'MONSOON' || season === 'POST_MONSOON') && weatherData) {
                if (weatherData.humidity > 80) {
                    triggers.push(`${season} season with ${weatherData.humidity}% humidity`);
                    liveDataSources.push('Weather API');

                    return {
                        type: 'EPIDEMIC',
                        event: {
                            id: 'auto-epidemic',
                            name: 'Vector-Borne Disease Alert',
                            type: 'EPIDEMIC',
                            severity: 'HIGH',
                            description: `${season} season with high humidity (${weatherData.humidity}%) creates ideal conditions for mosquito breeding. Expect increase in dengue and malaria cases.`,
                            affectedDepartments: ['Emergency', 'Internal Medicine', 'Pediatrics']
                        },
                        confidence: 0.75,
                        triggers,
                        liveDataSources
                    };
                }
            }

            // No critical scenario detected
            return null;

        } catch (error) {
            console.error('Auto scenario detection error:', error);
            return null;
        }
    }

    /**
     * Get scenario summary for display
     */
    getScenarioSummary(scenario: DetectedScenario): string {
        return `Auto-detected: ${scenario.event.name} (${Math.round(scenario.confidence * 100)}% confidence)\nTriggers: ${scenario.triggers.join(', ')}\nData sources: ${scenario.liveDataSources.join(', ')}`;
    }
}

export const autoScenarioService = new AutoScenarioService();
