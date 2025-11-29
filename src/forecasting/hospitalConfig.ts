import type { HospitalConfig } from './types';

/**
 * Default hospital configuration for demo purposes
 * In production, this would be loaded from a database or API
 */
const DEFAULT_CONFIG: HospitalConfig = {
    hospitalId: 'AIIMS-DEL-001',
    name: 'All India Institute of Medical Sciences, Delhi',
    location: {
        city: 'Delhi',
        state: 'Delhi',
        lat: 28.5672,
        lon: 77.2100
    },

    // Bed capacity
    totalBeds: 500,
    allocatedBedsForRisk: 100, // Beds for respiratory/medicine/emergency
    avgLengthOfStayDays: 3,
    targetOccupancy: 0.85, // 85% target occupancy

    // Staff capacity per shift
    currentDoctorsPerShift: 15,
    currentNursesPerShift: 40,
    maxPatientsPerDoctorPerShift: 15,
    maxPatientsPerNursePerShift: 5,

    // Baseline load
    baselinePatientsPerDay: 50,

    // Uplift factors (expert-provided, to be learned over time)
    upliftFactors: {
        POST_MONSOON: 1.3, // 30% increase
        MONSOON: 1.3,
        SUMMER: 1.2,
        WINTER: 1.4, // 40% increase due to pollution + cold
        FESTIVAL: 1.5 // 50% increase during festivals
    },

    // Hazard-specific overrides
    hazardUpliftOverrides: {
        'POLLUTION_SPIKE': 1.35,
        'HEATWAVE': 1.25,
        'DENGUE_OUTBREAK': 1.4,
        'INFLUENZA_SURGE': 1.45
    }
};

let currentConfig: HospitalConfig = { ...DEFAULT_CONFIG };

/**
 * Get current hospital configuration
 */
export function getHospitalConfig(): HospitalConfig {
    return { ...currentConfig };
}

/**
 * Update hospital configuration (partial update)
 */
export function updateHospitalConfig(partial: Partial<HospitalConfig>): HospitalConfig {
    currentConfig = {
        ...currentConfig,
        ...partial
    };
    return { ...currentConfig };
}

/**
 * Reset to default configuration
 */
export function resetHospitalConfig(): HospitalConfig {
    currentConfig = { ...DEFAULT_CONFIG };
    return { ...currentConfig };
}

/**
 * Get uplift factor for a specific season
 */
export function getSeasonUplift(season: string): number {
    const config = getHospitalConfig();
    return config.upliftFactors[season as keyof typeof config.upliftFactors] || 1.0;
}

/**
 * Get uplift factor for a specific hazard type
 */
export function getHazardUplift(hazardType: string): number {
    const config = getHospitalConfig();
    return config.hazardUpliftOverrides?.[hazardType] || 1.0;
}

// Expose for testing in browser console
if (typeof window !== 'undefined') {
    (window as any).__TEST_updateHospitalConfig = updateHospitalConfig;
    (window as any).__TEST_getHospitalConfig = getHospitalConfig;
}
