import type { Hospital, SurgePrediction } from '../types';

// ==================== AGENT 1: SURGE PREDICTOR ====================
export class SurgePredictor {
    predict(hospital: Hospital, weatherData: { aqi: number; temp: number }): SurgePrediction[] {
        const predictions: SurgePrediction[] = [];
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1; // 1-12

        // Festival-based predictions
        if (month === 10 || month === 11) { // Diwali season
            predictions.push({
                hospitalId: hospital.id,
                eventType: 'FESTIVAL',
                eventName: 'Diwali',
                predictedDate: new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
                expectedIncrease: {
                    admissions: 60, // 60% increase
                    icuNeed: 40,
                    erNeed: 80,
                },
                recommendations: [
                    'Deploy +8 doctors for ER coverage',
                    'Stock 200 burn kits and IV fluids',
                    'Activate plastic surgery on-call team',
                ],
            });
        }

        if (month === 3) { // Holi
            predictions.push({
                hospitalId: hospital.id,
                eventType: 'FESTIVAL',
                eventName: 'Holi',
                predictedDate: new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000),
                expectedIncrease: {
                    admissions: 30,
                    icuNeed: 15,
                    erNeed: 45,
                },
                recommendations: [
                    'Prepare for eye injuries (chemical exposure)',
                    'Stock anti-allergic medications',
                ],
            });
        }

        // Pollution-based predictions
        if (weatherData.aqi > 300) {
            predictions.push({
                hospitalId: hospital.id,
                eventType: 'POLLUTION',
                eventName: 'Severe Air Quality',
                predictedDate: new Date(),
                expectedIncrease: {
                    admissions: 40,
                    icuNeed: 35,
                    erNeed: 30,
                },
                recommendations: [
                    `Order +${Math.ceil(hospital.inventory.oxygenCylinders * 0.5)} oxygen cylinders`,
                    'Activate pulmonology team',
                    'Set up additional nebulizer stations',
                ],
            });
        }

        // Epidemic predictions (seasonal)
        if ([7, 8, 9, 10].includes(month)) { // Monsoon season - Dengue
            predictions.push({
                hospitalId: hospital.id,
                eventType: 'EPIDEMIC',
                eventName: 'Dengue Outbreak (Seasonal)',
                predictedDate: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000),
                expectedIncrease: {
                    admissions: 50,
                    icuNeed: 60,
                    erNeed: 40,
                },
                recommendations: [
                    'Increase platelet inventory by 100 units',
                    'Open dedicated fever clinic',
                    'Activate hematology consultation team',
                ],
            });
        }

        return predictions;
    }
}

// ==================== AGENT 2: RESOURCE OPTIMIZER ====================
export class ResourceOptimizer {
    optimizeResources(hospitals: Hospital[]): Array<{
        recommendation: string;
        priority: 'HIGH' | 'MEDIUM' | 'LOW';
        action: string;
    }> {
        const recommendations: Array<{
            recommendation: string;
            priority: 'HIGH' | 'MEDIUM' | 'LOW';
            action: string;
        }> = [];

        // Find hospitals with surplus and deficit
        hospitals.forEach((hospital) => {
            // Oxygen deficit check
            if (hospital.inventory.oxygenCylinders < 100) {
                const surplus = hospitals.find(
                    (h) => h.id !== hospital.id && h.inventory.oxygenCylinders > 300
                );
                if (surplus) {
                    recommendations.push({
                        recommendation: `Transfer 100 O₂ cylinders from ${surplus.name} to ${hospital.name}`,
                        priority: 'HIGH',
                        action: 'TRANSFER_OXYGEN',
                    });
                } else {
                    recommendations.push({
                        recommendation: `Emergency order: 200 O₂ cylinders for ${hospital.name}`,
                        priority: 'HIGH',
                        action: 'ORDER_OXYGEN',
                    });
                }
            }

            // Blood expiry tracking
            if (hospital.inventory.bloodUnits > 600) {
                const lowBlood = hospitals.find(
                    (h) => h.id !== hospital.id && h.inventory.bloodUnits < 200
                );
                if (lowBlood) {
                    recommendations.push({
                        recommendation: `Transfer 150 blood units from ${hospital.name} to ${lowBlood.name} (prevent expiry)`,
                        priority: 'MEDIUM',
                        action: 'TRANSFER_BLOOD',
                    });
                }
            }

            // Ventilator availability
            if (hospital.capacity.icu.available < 5 && hospital.inventory.ventilators < 10) {
                recommendations.push({
                    recommendation: `ICU at ${hospital.name} near capacity. Request 5 ventilators from central pool`,
                    priority: 'HIGH',
                    action: 'REQUEST_VENTILATORS',
                });
            }
        });

        return recommendations.sort((a, b) => {
            const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }
}

// ==================== AGENT 3: STAFFING COORDINATOR ====================
export class StaffingCoordinator {
    optimizeStaffing(hospitals: Hospital[]): Array<{
        recommendation: string;
        type: 'TRANSFER' | 'OVERTIME' | 'ON_CALL';
        urgency: 'URGENT' | 'NORMAL';
    }> {
        const recommendations: Array<{
            recommendation: string;
            type: 'TRANSFER' | 'OVERTIME' | 'ON_CALL';
            urgency: 'URGENT' | 'NORMAL';
        }> = [];

        hospitals.forEach((hospital) => {
            const occupancy = hospital.currentOccupancy;
            const staffingRatio =
                ((hospital.staff.doctors.onDuty + hospital.staff.nurses.onDuty) /
                    (hospital.staff.doctors.total + hospital.staff.nurses.total)) *
                100;

            // Critical staffing shortage
            if (occupancy > 80 && staffingRatio < 50) {
                recommendations.push({
                    recommendation: `URGENT: ${hospital.name} at ${occupancy}% occupancy but only ${Math.round(staffingRatio)}% staff. Activate on-call pool immediately.`,
                    type: 'ON_CALL',
                    urgency: 'URGENT',
                });
            }

            // Suggest staff transfer from underutilized hospitals
            if (occupancy > 75 && staffingRatio < 60) {
                const lowOccupancy = hospitals.find(
                    (h) =>
                        h.id !== hospital.id &&
                        h.currentOccupancy < 50 &&
                        ((h.staff.doctors.onDuty + h.staff.nurses.onDuty) /
                            (h.staff.doctors.total + h.staff.nurses.total)) *
                        100 >
                        70
                );

                if (lowOccupancy) {
                    recommendations.push({
                        recommendation: `Transfer 3 doctors and 8 nurses from ${lowOccupancy.name} (${lowOccupancy.currentOccupancy}% occupied) to ${hospital.name}`,
                        type: 'TRANSFER',
                        urgency: 'NORMAL',
                    });
                } else {
                    recommendations.push({
                        recommendation: `${hospital.name}: Approve overtime for 5 doctors and 12 nurses to cover surge`,
                        type: 'OVERTIME',
                        urgency: 'NORMAL',
                    });
                }
            }
        });

        return recommendations.sort((a, b) =>
            a.urgency === 'URGENT' && b.urgency !== 'URGENT' ? -1 : 1
        );
    }
}

// ==================== AGENT 4: PUBLIC ADVISORY GENERATOR ====================
export class PublicAdvisoryGenerator {
    generateAdvisories(
        weatherData: { aqi: number; temp: number },
        surges: SurgePrediction[]
    ): Array<{
        title: string;
        message: string;
        channel: 'SMS' | 'WEBSITE' | 'SOCIAL_MEDIA';
        severity: 'INFO' | 'WARNING' | 'CRITICAL';
    }> {
        const advisories: Array<{
            title: string;
            message: string;
            channel: 'SMS' | 'WEBSITE' | 'SOCIAL_MEDIA';
            severity: 'INFO' | 'WARNING' | 'CRITICAL';
        }> = [];

        // AQI-based advisories
        if (weatherData.aqi > 400) {
            advisories.push({
                title: 'CRITICAL AIR QUALITY ALERT',
                message: `AQI at ${weatherData.aqi}. Avoid outdoor activities. Free N95 masks available at hospital ERs. Asthma patients: keep inhalers ready.`,
                channel: 'SMS',
                severity: 'CRITICAL',
            });
            advisories.push({
                title: 'Air Pollution Emergency',
                message: `Delhi NCR AQI: ${weatherData.aqi} (Severe). Stay indoors. Schools closed. All hospitals on high alert for respiratory cases.`,
                channel: 'SOCIAL_MEDIA',
                severity: 'CRITICAL',
            });
        } else if (weatherData.aqi > 200) {
            advisories.push({
                title: 'Poor Air Quality',
                message: `AQI: ${weatherData.aqi}. Limit outdoor exposure. Vulnerable groups should wear masks.`,
                channel: 'WEBSITE',
                severity: 'WARNING',
            });
        }

        // Festival safety advisories
        surges.forEach((surge) => {
            if (surge.eventType === 'FESTIVAL' && surge.eventName === 'Diwali') {
                advisories.push({
                    title: 'Diwali Safety Tips',
                    message:
                        'Burn treatment centers open 24/7 at these locations: AIIMS, Max, Fortis. Keep water buckets ready. Supervise children with firecrackers.',
                    channel: 'SOCIAL_MEDIA',
                    severity: 'INFO',
                });
            }

            if (surge.eventType === 'EPIDEMIC' && surge.eventName.includes('Dengue')) {
                advisories.push({
                    title: 'Dengue Alert',
                    message:
                        'Dengue cases rising. Eliminate standing water. Free mosquito repellent drive this weekend at community centers.',
                    channel: 'WEBSITE',
                    severity: 'WARNING',
                });
            }
        });

        return advisories;
    }
}

// Export singleton instances
export const surgePredictor = new SurgePredictor();
export const resourceOptimizer = new ResourceOptimizer();
export const staffingCoordinator = new StaffingCoordinator();
export const advisoryGenerator = new PublicAdvisoryGenerator();
