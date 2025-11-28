import { create } from 'zustand';
import type { Agent, AgentLog, HospitalStats, Recommendation, SimulationEvent } from './types';

interface SimulationState {
    activeEvent: SimulationEvent | null;
    agents: Agent[];
    logs: AgentLog[];
    stats: HospitalStats;
    recommendations: Recommendation[];

    // Actions
    setEvent: (event: SimulationEvent | null) => void;
    addLog: (log: Omit<AgentLog, 'id' | 'timestamp'>) => void;
    updateStats: (stats: Partial<HospitalStats>) => void;
    updateAgentStatus: (agentId: string, status: Agent['status']) => void;
    addRecommendation: (rec: Recommendation) => void;
    clearRecommendations: () => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
    activeEvent: null,
    agents: [
        { id: 'festival-watcher', name: 'Festival Watcher', role: 'Cultural Event Monitor', status: 'IDLE', avatar: 'calendar' },
        { id: 'bio-hazard', name: 'Bio-Hazard Monitor', role: 'Epidemic Tracker', status: 'IDLE', avatar: 'biohazard' },
        { id: 'resource-opt', name: 'Resource Optimizer', role: 'Logistics AI', status: 'IDLE', avatar: 'box' },
        { id: 'patient-flow', name: 'Patient Flow', role: 'Crowd Manager', status: 'IDLE', avatar: 'users' },
    ],
    logs: [],
    stats: {
        occupancy: 45,
        staffingLevel: 80,
        supplies: 90,
        waitingTime: 15,
    },
    recommendations: [],

    setEvent: (event) => set({ activeEvent: event }),

    addLog: (log) => set((state) => ({
        logs: [
            { ...log, id: Math.random().toString(36).substr(2, 9), timestamp: Date.now() },
            ...state.logs
        ].slice(0, 50) // Keep last 50 logs
    })),

    updateStats: (newStats) => set((state) => ({
        stats: { ...state.stats, ...newStats }
    })),

    updateAgentStatus: (agentId, status) => set((state) => ({
        agents: state.agents.map(a => a.id === agentId ? { ...a, status } : a)
    })),

    addRecommendation: (rec) => set((state) => ({
        recommendations: [rec, ...state.recommendations]
    })),

    clearRecommendations: () => set({ recommendations: [] })
}));
