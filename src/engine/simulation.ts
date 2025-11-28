import { useSimulationStore } from '../store';
import type { EventType, SimulationEvent } from '../types';

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

    // 2. Activate Agents
    store.updateAgentStatus('festival-watcher', 'ANALYZING');
    store.updateAgentStatus('bio-hazard', 'ANALYZING');
    store.updateAgentStatus('resource-opt', 'ANALYZING');
    store.updateAgentStatus('patient-flow', 'ANALYZING');

    // 3. Simulation Loop
    if (eventType === 'FESTIVAL') {
        await simulateAgentThought('festival-watcher', 'Detecting calendar event: Diwali (T-minus 2 days).');
        await simulateAgentThought('festival-watcher', 'Historical data indicates 300% surge in burn cases.');
        store.addRecommendation({
            id: 'rec-1',
            title: 'Activate Burn Ward Protocol',
            description: 'Expand burn unit capacity by 20 beds. Pre-alert plastic surgery team.',
            priority: 'HIGH',
            category: 'STAFFING',
            actionLabel: 'Deploy Staff'
        });

        await simulateAgentThought('resource-opt', 'Checking inventory for Silver Sulfadiazine and analgesics.');
        store.updateStats({ occupancy: 65, supplies: 85 });
        await simulateAgentThought('resource-opt', 'Stock levels adequate, but buffer recommended.');
        store.addRecommendation({
            id: 'rec-2',
            title: 'Restock Emergency Supplies',
            description: 'Order expedited delivery of burn dressing kits.',
            priority: 'MEDIUM',
            category: 'SUPPLIES',
            actionLabel: 'Order Now'
        });

        store.updateStats({ waitingTime: 45 });
        await simulateAgentThought('patient-flow', 'Predicted ER wait time rising to 45 mins.');
    }
    else if (eventType === 'POLLUTION_SPIKE') {
        await simulateAgentThought('bio-hazard', 'AQI sensors reporting critical levels (480+).');
        await simulateAgentThought('bio-hazard', 'Correlating with admission rates for respiratory distress.');
        store.updateStats({ occupancy: 78, waitingTime: 60 });

        store.addRecommendation({
            id: 'rec-3',
            title: 'Nebulizer Station Expansion',
            description: 'Set up 10 additional nebulizer points in triage area.',
            priority: 'CRITICAL',
            category: 'SUPPLIES',
            actionLabel: 'Setup Stations'
        });

        await simulateAgentThought('resource-opt', 'Oxygen demand projected to increase by 40%.');
        store.addRecommendation({
            id: 'rec-4',
            title: 'Oxygen Supply Check',
            description: 'Verify liquid oxygen tank levels and backup cylinders.',
            priority: 'HIGH',
            category: 'SUPPLIES'
        });
    }
    else if (eventType === 'EPIDEMIC') {
        await simulateAgentThought('bio-hazard', 'Vector surveillance indicates high mosquito density.');
        await simulateAgentThought('bio-hazard', 'Fever clinic footfall increasing by 15% daily.');
        store.updateStats({ occupancy: 85, staffingLevel: 70 });

        store.addRecommendation({
            id: 'rec-5',
            title: 'Open Fever Clinic B',
            description: 'Divert non-critical fever cases to OPD Block B to reduce ER load.',
            priority: 'HIGH',
            category: 'STAFFING',
            actionLabel: 'Open Clinic'
        });

        await simulateAgentThought('resource-opt', 'Platelet inventory critical.');
        store.addRecommendation({
            id: 'rec-6',
            title: 'Blood Bank Drive',
            description: 'Initiate emergency donor call for O+ and B+ blood groups.',
            priority: 'CRITICAL',
            category: 'ADVISORY',
            actionLabel: 'Send Alerts'
        });
    }
    else {
        await simulateAgentThought('festival-watcher', 'No major cultural events detected.');
        await simulateAgentThought('bio-hazard', 'Epidemiological markers within baseline.');
        store.updateStats({ occupancy: 45, waitingTime: 15, supplies: 95, staffingLevel: 90 });
    }

    // Reset Agents to IDLE
    store.agents.forEach(a => store.updateAgentStatus(a.id, 'IDLE'));
};

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
