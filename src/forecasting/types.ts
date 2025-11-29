// Forecasting Module Type Definitions

export type Season = 'WINTER' | 'SUMMER' | 'MONSOON' | 'POST_MONSOON';

export type RiskType =
    | 'POLLUTION_SPIKE'
    | 'HEATWAVE'
    | 'DENGUE_OUTBREAK'
    | 'INFLUENZA_SURGE'
    | 'FESTIVAL_RELATED'
    | 'NORMAL';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface HospitalConfig {
    hospitalId: string;
    name: string;
    location: {
        city: string;
        state: string;
        lat?: number;
        lon?: number;
    };

    // Bed capacity
    totalBeds: number;
    allocatedBedsForRisk: number;
    avgLengthOfStayDays: number;
    targetOccupancy: number; // 0 < x < 1, e.g. 0.85

    // Staff capacity per shift
    currentDoctorsPerShift: number;
    currentNursesPerShift: number;
    maxPatientsPerDoctorPerShift: number;
    maxPatientsPerNursePerShift: number;

    // Baseline load
    baselinePatientsPerDay: number;

    // Uplift factors
    upliftFactors: {
        POST_MONSOON: number;
        MONSOON: number;
        SUMMER: number;
        WINTER: number;
        FESTIVAL: number;
    };

    // Optional hazard-specific overrides
    hazardUpliftOverrides?: {
        [hazardType: string]: number;
    };
}

export interface EnvironmentalData {
    location: string;
    timestamp: number;
    aqi: number;
    temperature: number; // Celsius
    humidity: number; // percentage
    rainfall?: number; // mm
    weatherAlert?: string;
}

export interface FestivalInfo {
    id: string;
    name: string;
    date: Date;
    region: string;
    healthRisks: string[];
    affectedDepartments: string[];
    historicalSurgeMultiplier: number; // e.g., 2.5 = 250% increase
}

export interface HealthRiskForecast {
    id: string;
    riskType: RiskType;
    severity: Severity;
    durationDays: number;
    predictedPatientLoadMultiplier: number;
    affectedDepartments: string[];
    description: string;
    startDate: Date;
}

export interface CapacityPlanningInput {
    hospitalConfig: HospitalConfig;
    forecasts: HealthRiskForecast[];
    environmentalData: EnvironmentalData;
    currentDate: Date;
}

export interface CalculationExplanation {
    formula: string;
    inputs: Record<string, number>;
    result: number;
    reasoning: string;
}

export interface SupplyRecommendation {
    item: string;
    quantity: number;
    unit: string;
    urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    explanation: CalculationExplanation;
}

export interface CapacityRecommendation {
    // Bed recommendations
    extraBeds: number;
    bedExplanation: CalculationExplanation;

    // Staff recommendations
    extraDoctors: number;
    extraNurses: number;
    staffExplanation: CalculationExplanation;

    // Supply recommendations
    supplies: SupplyRecommendation[];

    // Overall assessment
    overallSeverity: Severity;
    summary: string;
}
