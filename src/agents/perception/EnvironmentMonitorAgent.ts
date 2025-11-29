import { BaseAgent } from '../BaseAgent';
import type { Perception, Reasoning, Action, AgentToolkit } from '../types';
import { getCurrentSeason } from '../../forecasting/seasonDetector';
import { getEnvironmentalData, calculateAQIRisk, calculateTemperatureRisk } from '../../forecasting/environmentalSimulator';
import type { Season } from '../../forecasting/types';

/**
 * Environment Monitor Agent - Tracks environmental conditions
 * Perception Layer
 */
export class EnvironmentMonitorAgent extends BaseAgent {
    constructor(toolkit: AgentToolkit) {
        super(
            {
                id: 'environment-monitor',
                name: 'Environment Monitor',
                role: 'PERCEPTION',
                description: 'Monitors environmental conditions (AQI, temperature, weather)',
                tools: ['getEnvironmentalData', 'calculateAQIRisk', 'detectWeatherAlerts']
            },
            toolkit
        );
    }

    async perceive(): Promise<Perception> {
        const season = getCurrentSeason();
        const config = this.toolkit.getHospitalConfig();

        let envData;
        try {
            // Import services dynamically
            const [{ weatherService }, { aqiService }] = await Promise.all([
                import('../../services/weather'),
                import('../../services/aqi')
            ]);

            // Fetch both weather and AQI data in parallel
            const [weatherData, aqiData] = await Promise.all([
                weatherService.getCityWeather(`${config.location.city},IN`),
                aqiService.getAQIByCity(config.location.city, config.location.state)
            ]);

            if (weatherData || aqiData) {
                // Combine live data from both sources
                envData = {
                    location: config.location.city,
                    timestamp: Date.now(),
                    aqi: aqiData?.aqi || weatherData?.aqi || this.estimateAQIFromConditions(weatherData?.conditions || 'Unknown', season),
                    temperature: weatherData?.temp || 25,
                    humidity: weatherData?.humidity || 60,
                    weatherAlert: weatherData?.alert,
                    season // Add season to envData
                };

                console.log(`[EnvironmentMonitor] Live data: AQI=${envData.aqi}, Temp=${envData.temperature}°C, Humidity=${envData.humidity}%`);
            } else {
                // Fallback to simulated data
                console.warn('[EnvironmentMonitor] Live APIs failed, using simulated data');
                envData = getEnvironmentalData(season, config.location.city);
            }
        } catch (error) {
            console.warn('[EnvironmentMonitor] API error, using simulated data:', error);
            envData = getEnvironmentalData(season, config.location.city);
        }

        return {
            agentId: this.id,
            timestamp: Date.now(),
            data: envData,
            confidence: envData.aqi ? 0.95 : 0.7
        };
    }

    /**
     * Estimate AQI from weather conditions when not available from API
     */
    private estimateAQIFromConditions(conditions: string, season: Season): number {
        const conditionsLower = conditions.toLowerCase();

        // Base AQI on season
        let baseAQI = season === 'WINTER' ? 250 : season === 'POST_MONSOON' ? 150 : 80;

        // Adjust based on conditions
        if (conditionsLower.includes('clear') || conditionsLower.includes('sunny')) {
            baseAQI *= 0.8;
        } else if (conditionsLower.includes('rain') || conditionsLower.includes('storm')) {
            baseAQI *= 0.5; // Rain clears air
        } else if (conditionsLower.includes('fog') || conditionsLower.includes('haze')) {
            baseAQI *= 1.5; // Poor visibility indicates pollution
        }

        return Math.round(Math.min(500, Math.max(50, baseAQI)));
    }

    async reason(perception: Perception): Promise<Reasoning> {
        const { aqi, temperature, humidity, weatherAlert } = perception.data;

        const aqiRisk = calculateAQIRisk(aqi);
        const tempRisk = calculateTemperatureRisk(temperature);

        const conclusions: string[] = [
            `AQI: ${aqi} (${aqiRisk.level}) - ${aqiRisk.healthImpact}`,
            `Temperature: ${temperature}°C (${tempRisk.level}) - ${tempRisk.healthImpact}`,
            `Humidity: ${humidity}%`
        ];

        if (weatherAlert) {
            conclusions.push(`Weather Alert: ${weatherAlert}`);
        }

        // Determine overall environmental risk
        const maxSeverity = aqiRisk.severity === 'CRITICAL' || tempRisk.severity === 'CRITICAL'
            ? 'CRITICAL'
            : aqiRisk.severity === 'HIGH' || tempRisk.severity === 'HIGH'
                ? 'HIGH'
                : 'MEDIUM';

        const reasoning = `Environmental monitoring shows ${aqiRisk.level} air quality and ${tempRisk.level} temperature conditions. Overall environmental health risk: ${maxSeverity}.`;

        return {
            agentId: this.id,
            timestamp: Date.now(),
            conclusions,
            confidence: 0.85,
            reasoning
        };
    }

    async act(reasoning: Reasoning): Promise<Action> {
        return {
            agentId: this.id,
            timestamp: Date.now(),
            type: 'ENVIRONMENTAL_ASSESSMENT',
            data: {
                environmentalRisks: reasoning.conclusions,
                severity: reasoning.reasoning.includes('CRITICAL') ? 'CRITICAL' :
                    reasoning.reasoning.includes('HIGH') ? 'HIGH' : 'MEDIUM'
            },
            explanation: reasoning.reasoning
        };
    }
}
