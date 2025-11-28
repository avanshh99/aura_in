export type EventType = 'FESTIVAL' | 'POLLUTION_SPIKE' | 'EPIDEMIC' | 'NORMAL';

export interface SimulationEvent {
    id: string;
    type: EventType;
    name: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
    affectedDepartments: string[];
}

export interface AgentLog {
    id: string;
    agentName: string;
    timestamp: number;
    message: string;
    type: 'INFO' | 'WARNING' | 'ACTION' | 'ALERT';
}

export interface HospitalStats {
    occupancy: number; // 0-100%
    staffingLevel: number; // 0-100%
    supplies: number; // 0-100%
    waitingTime: number; // in minutes
}

export interface Agent {
    id: string;
    name: string;
    role: string;
    status: 'IDLE' | 'ANALYZING' | 'ACTING';
    avatar: string; // URL or icon name
}

export interface Recommendation {
    id: string;
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    category: 'STAFFING' | 'SUPPLIES' | 'ADVISORY';
    actionLabel?: string;
}
