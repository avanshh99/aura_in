import { useSimulationStore } from '../store';
import type { EventType, SimulationEvent } from '../types';
import { AgentOrchestrator } from '../agents/AgentOrchestrator';
import { createAgentToolkit } from '../agents/toolkit';
import { EnvironmentMonitorAgent } from '../agents/perception/EnvironmentMonitorAgent';
import { FestivalDetectorAgent } from '../agents/perception/FestivalDetectorAgent';
import { SeasonTrackerAgent } from '../agents/perception/SeasonTrackerAgent';
import { ForecasterAgent } from '../agents/reasoning/ForecasterAgent';
import { CapacityCalculatorAgent } from '../agents/reasoning/CapacityCalculatorAgent';
import { ResourcePlannerAgent } from '../agents/action/ResourcePlannerAgent';

const THOUGHT_DELAY = 1500; // ms between thoughts

export const SCENARIOS: Record<EventType, SimulationEvent> = {
    FESTIVAL: {
        id: 'diwali-2025',
        type: 'FESTIVAL',
        name: 'Diwali Celebration Week',
        severity: 'HIGH',
        description: 'Major festival involving firecrackers and large gatherings. Expect burn cases and respiratory issues.',
        affectedDepartments: ['Emergency', 'Pulmonology', 'Ophthalmology']
    },
    POLLUTION_SPIKE: {
        id: 'smog-nov-2025',
        type: 'POLLUTION_SPIKE',
        name: 'Severe Smog Episode',
        severity: 'CRITICAL',
        description: 'AQI levels exceeding 450. High risk for asthma and COPD exacerbations.',
        affectedDepartments: ['Pulmonology', 'Pediatrics', 'Geriatrics']
    },
    EPIDEMIC: {
        id: 'dengue-outbreak',
        type: 'EPIDEMIC',
        name: 'Dengue Surge',
        severity: 'HIGH',
        description: 'Rapid increase in vector-borne disease cases. Platelet demand expected to rise.',
        affectedDepartments: ['General Medicine', 'Hematology', 'Emergency']
    },
    NORMAL: {
        id: 'normal-ops',
        type: 'NORMAL',
        name: 'Standard Operations',
        severity: 'LOW',
        description: 'Business as usual. Routine monitoring active.',
        affectedDepartments: []
    }
};

export const runSimulation = async (eventType: EventType) => {
    const store = useSimulationStore.getState();
    const event = SCENARIOS[eventType];

    // 1. Set Event
    store.setEvent(event);
    store.clearRecommendations();

    // 2. Activate Agents (UI display)
    store.updateAgentStatus('festival-watcher', 'ANALYZING');
    store.updateAgentStatus('bio-hazard', 'ANALYZING');
    store.updateAgentStatus('resource-opt', 'ANALYZING');
    store.updateAgentStatus('patient-flow', 'ANALYZING');

    // 3. Run Agent-Driven Simulation
    if (eventType !== 'NORMAL') {
        await runAgentSimulation(event);
        store.agents.forEach(a => store.updateAgentStatus(a.id, 'IDLE'));
        return;
    }

    // 4. NORMAL scenario - fallback to simple simulation
    await simulateAgentThought('festival-watcher', 'No major cultural events detected.');
    await simulateAgentThought('bio-hazard', 'Epidemiological markers within baseline.');
    store.updateStats({ occupancy: 45, waitingTime: 15, supplies: 95, staffingLevel: 90 });

    // Reset Agents to IDLE
    store.agents.forEach(a => store.updateAgentStatus(a.id, 'IDLE'));
};

/**
 * Agent-driven simulation using agentic architecture
 */
const runAgentSimulation = async (event: SimulationEvent) => {
    const store = useSimulationStore.getState();

    // Initialize agent orchestrator
    const toolkit = createAgentToolkit();
    const orchestrator = new AgentOrchestrator();

    // Register all agents
    orchestrator.registerAgent(new EnvironmentMonitorAgent(toolkit));
    orchestrator.registerAgent(new FestivalDetectorAgent(toolkit));
    orchestrator.registerAgent(new SeasonTrackerAgent(toolkit));
    orchestrator.registerAgent(new ForecasterAgent(toolkit));
    orchestrator.registerAgent(new CapacityCalculatorAgent(toolkit));
    orchestrator.registerAgent(new ResourcePlannerAgent(toolkit));

    // Execute agent pipeline
    const scenario = {
        eventType: event.type,
        hospitalConfig: toolkit.getHospitalConfig(),
        currentDate: new Date()
    };

    const agentOutputs = await orchestrator.executeAgents(scenario);

    // DYNAMIC UPDATE: Update active event with live agent findings
    // This ensures the "Current Scenario" box shows real-time data
    const envAction = agentOutputs.actions.find(a => a.type === 'ENVIRONMENTAL_ASSESSMENT');
    const festivalAction = agentOutputs.actions.find(a => a.type === 'FESTIVAL_ALERT');

    let dynamicDescription = event.description;
    let dynamicSeverity = event.severity;

    if (envAction && envAction.data) {
        const risks = envAction.data.environmentalRisks as string[];
        if (risks && risks.length > 0) {
            dynamicDescription = `Live Analysis: ${risks.join('. ')}.`;
        }
        if (envAction.data.severity === 'CRITICAL') dynamicSeverity = 'CRITICAL';
    }

    if (festivalAction && festivalAction.data) {
        dynamicDescription += ` ${festivalAction.data.festivalName} detected in ${festivalAction.data.daysUntil} days.`;
    }

    // Update the store with the DYNAMIC event data
    store.setEvent({
        ...event,
        description: dynamicDescription,
        severity: dynamicSeverity
    });

    // Display agent reasoning traces
    for (const trace of agentOutputs.reasoningTraces) {
        // Map new agent IDs to existing UI agent IDs for display
        const uiAgentId = mapAgentIdToUI(trace.agentId);
        await simulateAgentThought(uiAgentId, trace.thought);
    }

    // Convert agent actions to recommendations
    console.log('[Simulation] Processing agent actions:', agentOutputs.actions.length);

    for (const action of agentOutputs.actions) {
        if (action.type === 'CAPACITY_CALCULATION') {
            const capacity = action.data;
            console.log('[Simulation] Capacity calculation result:', capacity);

            // Bed recommendation
            if (capacity.extraBeds > 0) {
                console.log('[Simulation] Adding bed recommendation:', capacity.extraBeds);
                store.addRecommendation({
                    id: `rec-beds-${Date.now()}`,
                    title: 'Expand Bed Capacity',
                    description: `Add ${capacity.extraBeds} beds. ${capacity.bedExplanation.reasoning}`,
                    priority: capacity.overallSeverity,
                    category: 'STAFFING',
                    actionLabel: 'Deploy Beds'
                });
            } else {
                console.log('[Simulation] No extra beds needed (extraBeds <= 0)');
            }

            // Staff recommendation
            if (capacity.extraDoctors > 0 || capacity.extraNurses > 0) {
                console.log('[Simulation] Adding staff recommendation');
                store.addRecommendation({
                    id: `rec-staff-${Date.now()}`,
                    title: 'Deploy Additional Staff',
                    description: `Deploy ${capacity.extraDoctors} doctors and ${capacity.extraNurses} nurses. ${capacity.staffExplanation.reasoning}`,
                    priority: 'HIGH',
                    category: 'STAFFING',
                    actionLabel: 'Deploy Staff'
                });
            }

            // Supply recommendations
            if (capacity.supplies && capacity.supplies.length > 0) {
                console.log('[Simulation] Adding supply recommendations:', capacity.supplies.length);
                for (const supply of capacity.supplies) {
                    store.addRecommendation({
                        id: `rec-supply-${supply.item}-${Date.now()}`,
                        title: `Order ${supply.item}`,
                        description: `Order ${supply.quantity} ${supply.unit}. ${supply.explanation.reasoning}`,
                        priority: supply.urgency,
                        category: 'SUPPLIES',
                        actionLabel: 'Order Now'
                    });
                }
            }

            // Update stats based on calculations
            const predictedOccupancy = Math.min(95, 65 + (capacity.extraBeds / 5));
            store.updateStats({
                occupancy: Math.round(predictedOccupancy),
                staffingLevel: Math.max(60, 95 - (capacity.extraDoctors + capacity.extraNurses)),
                supplies: Math.max(40, 90 - (capacity.supplies.length * 10)),
                waitingTime: Math.round(15 + (capacity.extraBeds / 10))
            });
        }
    }
};

/**
 * Map new agent IDs to existing UI agent IDs for display continuity
 */
function mapAgentIdToUI(agentId: string): string {
    const mapping: Record<string, string> = {
        'environment-monitor': 'bio-hazard',
        'festival-detector': 'festival-watcher',
        'season-tracker': 'festival-watcher',
        'forecaster': 'patient-flow',
        'capacity-calculator': 'resource-opt',
        'resource-planner': 'resource-opt'
    };
    return mapping[agentId] || 'resource-opt';
}

const simulateAgentThought = async (agentId: string, message: string) => {
    const store = useSimulationStore.getState();
    const agent = store.agents.find(a => a.id === agentId);

    store.updateAgentStatus(agentId, 'ACTING');
    store.addLog({
        agentName: agent?.name || 'System',
        message,
        type: 'INFO'
    });

    await new Promise(resolve => setTimeout(resolve, THOUGHT_DELAY));
};
