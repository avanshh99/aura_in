// Core types for Perception-Reasoning-Action agent system

export interface AgentContext {
    perceptions: Perception[];
    reasonings: Reasoning[];
    actions: Action[];
}

export interface Perception {
    agentId: string;
    data: Record<string, any>;
    confidence: number;
    timestamp: number;
}

export interface Reasoning {
    agentId: string;
    conclusions: string[];
    reasoning: string;
    timestamp: number;
}

export interface Action {
    type: string;
    data: any;
    explanation: string;
    timestamp: number;
}

// Specific data structures for our domain
export interface EnvironmentData {
    aqi: number;
    temperature: number;
    humidity: number;
    weatherAlert?: string;
}

export interface FestivalData {
    upcomingFestivals: Array<{
        name: string;
        date: string;
        surgeMultiplier: number;
    }>;
}

export interface SeasonData {
    season: 'WINTER' | 'SPRING' | 'SUMMER' | 'MONSOON' | 'AUTUMN';
    baselineRisk: number;
}

export interface RiskAnalysis {
    riskMultiplier: number;
    forecasts: string[];
}

export interface CapacityRequirements {
    extraBeds: number;
    extraDoctors: number;
    extraNurses: number;
    supplies: Array<{
        item: string;
        quantity: number;
    }>;
}
