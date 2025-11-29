import { BaseAgent } from '../BaseAgent';
import type { Perception, Reasoning, Action, AgentToolkit } from '../types';
import { getUpcomingFestivals } from '../../forecasting/festivalCalendar';

/**
 * Festival Detector Agent - Anticipates festival-related health impacts
 * Perception Layer
 */
export class FestivalDetectorAgent extends BaseAgent {
    constructor(toolkit: AgentToolkit) {
        super(
            {
                id: 'festival-detector',
                name: 'Festival Detector',
                role: 'PERCEPTION',
                description: 'Detects upcoming festivals and predicts health impacts',
                tools: ['getUpcomingFestivals', 'getFestivalHealthImpact', 'analyzeHistoricalData']
            },
            toolkit
        );
    }

    async perceive(): Promise<Perception> {
        // Get festivals in next 30 days
        const upcomingFestivals = getUpcomingFestivals(30);

        return {
            agentId: this.id,
            timestamp: Date.now(),
            data: {
                festivals: upcomingFestivals,
                count: upcomingFestivals.length
            },
            confidence: 1.0 // Festival calendar is static/known
        };
    }

    async reason(perception: Perception): Promise<Reasoning> {
        const { festivals } = perception.data;
        const conclusions: string[] = [];

        if (festivals.length === 0) {
            conclusions.push('No major festivals detected in next 30 days');
            return {
                agentId: this.id,
                timestamp: Date.now(),
                conclusions,
                confidence: 1.0,
                reasoning: 'Calendar analysis shows no significant cultural events approaching.'
            };
        }

        // Analyze each festival
        for (const festival of festivals) {
            const daysUntil = Math.floor(
                (festival.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );

            conclusions.push(
                `${festival.name} in ${daysUntil} days: ${festival.historicalSurgeMultiplier}x surge expected`
            );
            conclusions.push(`  Health risks: ${festival.healthRisks.join(', ')}`);
            conclusions.push(`  Affected departments: ${festival.affectedDepartments.join(', ')}`);
        }

        return {
            agentId: this.id,
            timestamp: Date.now(),
            conclusions,
            confidence: 0.85, // Historical data-based
            reasoning: `Detected ${festivals.length} upcoming festival(s). Historical data indicates significant patient load increases during these periods.`
        };
    }

    async act(reasoning: Reasoning): Promise<Action> {
        return {
            agentId: this.id,
            timestamp: Date.now(),
            type: 'FESTIVAL_FORECAST',
            data: {
                hasUpcomingFestivals: reasoning.conclusions.length > 1,
                festivalDetails: reasoning.conclusions
            },
            explanation: reasoning.reasoning
        };
    }
}
