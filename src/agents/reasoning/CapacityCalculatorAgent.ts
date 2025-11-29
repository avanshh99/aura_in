import { BaseAgent } from '../BaseAgent';
import type { Perception, Reasoning, Action, AgentToolkit } from '../types';
import type { CapacityRecommendation, CalculationExplanation } from '../../forecasting/types';

/**
 * Capacity Calculator Agent - Applies mathematical formulas for resource planning
 * Reasoning Layer - CORE MATHEMATICAL ENGINE
 */
export class CapacityCalculatorAgent extends BaseAgent {
    constructor(toolkit: AgentToolkit) {
        super(
            {
                id: 'capacity-calculator',
                name: 'Capacity Calculator',
                role: 'REASONING',
                description: 'Computes resource requirements using explicit mathematical formulas',
                tools: ['calculateBedNeeds', 'calculateStaffNeeds', 'calculateSupplyNeeds']
            },
            toolkit
        );
    }

    async perceive(): Promise<Perception> {
        // Receive risk forecasts and hospital config
        const config = this.toolkit.getHospitalConfig();

        return {
            agentId: this.id,
            timestamp: Date.now(),
            data: {
                hospitalConfig: config,
                riskForecasts: []
            },
            confidence: 1.0
        };
    }

    async reason(perception: Perception): Promise<Reasoning> {
        const config = perception.data.hospitalConfig;

        // Calculate bed capacity using explicit formula
        const bedCalculation = this.calculateBedCapacity(config, 1.5); // 1.5x multiplier for demo

        // Calculate staff capacity using explicit formula
        const staffCalculation = this.calculateStaffCapacity(config, 1.5);

        // Calculate supply needs
        const supplyCalculation = this.calculateSupplyNeeds(config, 1.5);

        const conclusions = [
            `Bed calculation: ${bedCalculation.reasoning}`,
            `Staff calculation: ${staffCalculation.explanation.reasoning}`,
            `Supply calculation: ${supplyCalculation.explanation.reasoning}`
        ];

        return {
            agentId: this.id,
            timestamp: Date.now(),
            conclusions,
            confidence: 0.95,
            reasoning: 'Applied mathematical formulas to calculate resource requirements based on predicted patient load.'
        };
    }

    async act(reasoning: Reasoning): Promise<Action> {
        const config = this.toolkit.getHospitalConfig();
        const riskMultiplier = 1.5; // Simplified for demo

        const bedCalc = this.calculateBedCapacity(config, riskMultiplier);
        const staffCalc = this.calculateStaffCapacity(config, riskMultiplier);
        const supplyCalc = this.calculateSupplyNeeds(config, riskMultiplier);

        const recommendation: CapacityRecommendation = {
            extraBeds: bedCalc.result,
            bedExplanation: bedCalc,
            extraDoctors: staffCalc.doctors,
            extraNurses: staffCalc.nurses,
            staffExplanation: staffCalc.explanation,
            supplies: supplyCalc.supplies,
            overallSeverity: 'HIGH',
            summary: reasoning.reasoning
        };

        return {
            agentId: this.id,
            timestamp: Date.now(),
            type: 'CAPACITY_CALCULATION',
            data: recommendation,
            explanation: `Calculated resource needs: ${bedCalc.result} beds, ${staffCalc.doctors} doctors, ${staffCalc.nurses} nurses. ${reasoning.reasoning}`
        };
    }

    /**
     * BED CAPACITY FORMULA:
     * predictedDailyAdmissions = baselinePatientsPerDay × upliftFactor × riskMultiplier
     * peakOccupancy = predictedDailyAdmissions × avgLengthOfStayDays
     * requiredBeds = peakOccupancy / targetOccupancy
     * extraBedsNeeded = max(0, requiredBeds - allocatedBedsForRisk)
     */
    private calculateBedCapacity(config: any, riskMultiplier: number): CalculationExplanation {
        const baseline = config.baselinePatientsPerDay;
        const uplift = 1.3; // Seasonal uplift (simplified)
        const avgLOS = config.avgLengthOfStayDays;
        const targetOcc = config.targetOccupancy;
        const allocated = config.allocatedBedsForRisk;

        const predictedAdmissions = baseline * uplift * riskMultiplier;
        const peakOccupancy = predictedAdmissions * avgLOS;
        const requiredBeds = peakOccupancy / targetOcc;
        const extraBeds = Math.max(0, Math.ceil(requiredBeds - allocated));

        return {
            formula: 'extraBeds = max(0, ceil((baseline × uplift × risk × LOS / targetOcc) - allocated))',
            inputs: {
                baseline,
                uplift,
                riskMultiplier,
                avgLOS,
                targetOcc,
                allocated
            },
            result: extraBeds,
            reasoning: `Predicted ${predictedAdmissions.toFixed(0)} admissions/day → ${peakOccupancy.toFixed(0)} patient-days → ${requiredBeds.toFixed(0)} beds required → ${extraBeds} extra beds needed`
        };
    }

    /**
     * STAFF CAPACITY FORMULA:
     * peakPatientLoad = predictedDailyAdmissions × 1.5 (peak shift factor)
     * requiredDoctors = ceil(peakPatientLoad / maxPatientsPerDoctorPerShift)
     * requiredNurses = ceil(peakPatientLoad / maxPatientsPerNursePerShift)
     * extraDoctorsNeeded = max(0, requiredDoctors - currentDoctorsPerShift)
     * extraNursesNeeded = max(0, requiredNurses - currentNursesPerShift)
     */
    private calculateStaffCapacity(config: any, riskMultiplier: number): {
        doctors: number;
        nurses: number;
        explanation: CalculationExplanation;
    } {
        const baseline = config.baselinePatientsPerDay;
        const uplift = 1.3;
        const predictedAdmissions = baseline * uplift * riskMultiplier;
        const peakLoad = predictedAdmissions * 1.5; // Peak shift factor

        const requiredDoctors = Math.ceil(peakLoad / config.maxPatientsPerDoctorPerShift);
        const requiredNurses = Math.ceil(peakLoad / config.maxPatientsPerNursePerShift);

        const extraDoctors = Math.max(0, requiredDoctors - config.currentDoctorsPerShift);
        const extraNurses = Math.max(0, requiredNurses - config.currentNursesPerShift);

        return {
            doctors: extraDoctors,
            nurses: extraNurses,
            explanation: {
                formula: 'extraStaff = max(0, ceil(peakLoad / maxPatientsPerStaff) - current)',
                inputs: {
                    peakLoad,
                    maxPatientsPerDoctor: config.maxPatientsPerDoctorPerShift,
                    maxPatientsPerNurse: config.maxPatientsPerNursePerShift,
                    currentDoctors: config.currentDoctorsPerShift,
                    currentNurses: config.currentNursesPerShift
                },
                result: extraDoctors + extraNurses,
                reasoning: `Peak load ${peakLoad.toFixed(0)} patients → Need ${requiredDoctors} doctors (+${extraDoctors}), ${requiredNurses} nurses (+${extraNurses})`
            }
        };
    }

    /**
     * SUPPLY FORMULAS (case-specific):
     * oxygen = predictedPatients × 0.4 × durationDays × 10 (liters)
     * nebulizers = ceil(predictedPatients × 0.3)
     * burnDressings = predictedBurnCases × 5 (kits)
     */
    private calculateSupplyNeeds(config: any, riskMultiplier: number): {
        supplies: any[];
        explanation: CalculationExplanation;
    } {
        const baseline = config.baselinePatientsPerDay;
        const uplift = 1.3;
        const predictedPatients = baseline * uplift * riskMultiplier;
        const duration = 7; // days

        const supplies = [
            {
                item: 'Oxygen',
                quantity: Math.ceil(predictedPatients * 0.4 * duration * 10),
                unit: 'liters',
                urgency: 'HIGH' as const,
                explanation: {
                    formula: 'oxygen = patients × 0.4 × days × 10',
                    inputs: { predictedPatients, duration },
                    result: Math.ceil(predictedPatients * 0.4 * duration * 10),
                    reasoning: '40% of patients need oxygen support'
                }
            },
            {
                item: 'Nebulizers',
                quantity: Math.ceil(predictedPatients * 0.3),
                unit: 'units',
                urgency: 'MEDIUM' as const,
                explanation: {
                    formula: 'nebulizers = ceil(patients × 0.3)',
                    inputs: { predictedPatients },
                    result: Math.ceil(predictedPatients * 0.3),
                    reasoning: '30% of patients need nebulizer treatment'
                }
            }
        ];

        return {
            supplies,
            explanation: {
                formula: 'Various supply-specific formulas',
                inputs: { predictedPatients, duration },
                result: supplies.length,
                reasoning: `Calculated ${supplies.length} critical supply categories`
            }
        };
    }
}
