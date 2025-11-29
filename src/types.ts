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
    timestamp?: number;
}

export interface Hospital {
    id: string;
    name: string;
    location: {
        lat: number;
        lng: number;
        city: string;
        state: string;
        pin?: string;
        coordinates?: { lat: number; lng: number };
    };
    capacity: {
        beds: { total: number; available: number };
        icu: { total: number; available: number };
        er?: { total: number; available: number };
    };
    staff: {
        doctors: { total: number; onDuty: number };
        nurses: { total: number; onDuty: number };
    };
    inventory: {
        oxygenCylinders: number;
        ventilators: number;
        bloodUnits: number;
        burnKits: number;
    };
    currentOccupancy: number;
    credentials?: {
        username: string;
        passwordHash: string;
    };
}

export interface SurgePrediction {
    hospitalId: string;
    eventType: 'FESTIVAL' | 'POLLUTION' | 'EPIDEMIC';
    eventName: string;
    predictedDate: Date;
    expectedIncrease: {
        admissions: number;
        icuNeed: number;
        erNeed: number;
    };
    recommendations: string[];
    // Legacy fields for backward compatibility
    id?: string;
    hospital?: string;
    event?: string;
    predictedSurge?: number;
    daysAway?: number;
    icuNeed?: number;
    aqi?: number;
    vectorIncrease?: number;
}
