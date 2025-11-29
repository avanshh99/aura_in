// Agent Framework Type Definitions

export type AgentId = string;

export type AgentStatus = 'IDLE' | 'PERCEIVING' | 'REASONING' | 'ACTING';

export type AgentRole = 'PERCEPTION' | 'REASONING' | 'ACTION';

export interface AgentGoal {
    id: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    constraints?: Record<string, any>;
}

export interface Perception {
    agentId: AgentId;
    timestamp: number;
    data: Record<string, any>;
    confidence: number; // 0-1
}

export interface Reasoning {
    agentId: AgentId;
    timestamp: number;
    conclusions: string[];
    confidence: number;
    reasoning: string;
}

export interface Action {
    agentId: AgentId;
    timestamp: number;
    type: string;
    data: Record<string, any>;
    explanation: string;
}

export interface ReasoningTrace {
    agentId: AgentId;
    agentName: string;
    timestamp: number;
    thought: string;
    step: 'PERCEIVE' | 'REASON' | 'ACT';
}

export type AgentMessageType = 'REQUEST' | 'RESPONSE' | 'BROADCAST' | 'DELEGATE';

export interface AgentMessage {
    id: string;
    from: AgentId;
    to: AgentId | 'ALL';
    type: AgentMessageType;
    content: {
        topic: string;
        data: any;
        priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    };
    timestamp: number;
}

export interface AgentMemory {
    // Short-term memory (current session)
    workingMemory: {
        currentPerceptions: Perception[];
        activeGoals: AgentGoal[];
        recentActions: Action[];
    };

    // Long-term memory (persistent)
    knowledgeBase: {
        historicalPatterns: any[];
        learnedRules: any[];
        pastDecisions: any[];
    };

    // Episodic memory (event history)
    episodes: {
        timestamp: number;
        scenario: any;
        actions: Action[];
        outcomes: any[];
    }[];
}

export interface AgentToolkit {
    // Data access tools
    getEnvironmentalData: (location: string) => any;
    getHospitalConfig: () => any;
    getCurrentStats: () => any;

    // Analysis tools
    calculateRiskScore: (factors: any) => number;
    applyFormula: (formula: string, inputs: Record<string, number>) => number;

    // Planning tools
    createActionPlan: (goal: AgentGoal, constraints: any) => any;
    optimizeAllocation: (resources: any, demands: any) => any;

    // Communication tools
    sendMessage: (to: AgentId, message: AgentMessage) => void;
    broadcastInsight: (insight: any) => void;
    queryAgent: (agentId: AgentId, query: any) => Promise<any>;
}

export interface AgentConfig {
    id: AgentId;
    name: string;
    role: AgentRole;
    description: string;
    tools: string[]; // Tool names this agent can use
}

export interface AgentOutputs {
    perceptions: Perception[];
    reasonings: Reasoning[];
    actions: Action[];
    reasoningTraces: ReasoningTrace[];
    recommendations: any[];
}
