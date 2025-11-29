import { BaseAgent } from '../BaseAgent';
import type { Perception, Reasoning, Action, AgentToolkit } from '../types';
import { getCurrentSeason, getSeasonDescription } from '../../forecasting/seasonDetector';

/**
 * Season Tracker Agent - Monitors seasonal health patterns
 * Perception Layer
 */
export class SeasonTrackerAgent extends BaseAgent {
    constructor(toolkit: AgentToolkit) {
        super(
            {
                id: 'season-tracker',
                name: 'Season Tracker',
                role: 'PERCEPTION',
                description: 'Monitors seasonal health patterns and applies uplift factors',
                tools: ['getCurrentSeason', 'getSeasonalDiseases', 'getSeasonalUplift']
            },
            toolkit
        );
    }

    async perceive(): Promise<Perception> {
        // Detect current season
        const currentDate = new Date();
        const season = getCurrentSeason(currentDate);
        const description = getSeasonDescription(season);

        return {
            agentId: this.id,
            timestamp: Date.now(),
            data: {
                season,
                description,
                month: currentDate.getMonth() + 1,
                date: currentDate
            },
            confidence: 1.0 // Season detection is deterministic
        };
    }

    async reason(perception: Perception): Promise<Reasoning> {
        const { season, description } = perception.data;
        const config = this.toolkit.getHospitalConfig();
        const upliftFactor = config.upliftFactors[season as keyof typeof config.upliftFactors];

        const conclusions = [
            `Current season: ${season}`,
            `Seasonal uplift factor: ${upliftFactor}x`,
            `Expected ${((upliftFactor - 1) * 100).toFixed(0)}% increase in baseline patient load`
        ];

        return {
            agentId: this.id,
            timestamp: Date.now(),
            conclusions,
            confidence: 0.9,
            reasoning: `${description}. Applying seasonal uplift factor of ${upliftFactor}x to baseline predictions.`
        };
    }

    async act(reasoning: Reasoning): Promise<Action> {
        const config = this.toolkit.getHospitalConfig();
        const season = reasoning.conclusions[0].split(': ')[1];
        const upliftFactor = config.upliftFactors[season as keyof typeof config.upliftFactors];

        return {
            agentId: this.id,
            timestamp: Date.now(),
            type: 'SEASON_ASSESSMENT',
            data: {
                season,
                upliftFactor,
                seasonalRisks: reasoning.conclusions
            },
            explanation: reasoning.reasoning
        };
    }
}
