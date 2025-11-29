import { BaseAgent } from './BaseAgent';
import type {
    AgentId,
    AgentMessage,
    AgentOutputs,
    ReasoningTrace,
    Perception,
    Reasoning,
    Action
} from './types';

/**
 * Message Bus for inter-agent communication
 */
class MessageBus {
    private subscribers: Map<AgentId, BaseAgent>;
    private messageQueue: AgentMessage[];

    constructor() {
        this.subscribers = new Map();
        this.messageQueue = [];
    }

    subscribe(agentId: AgentId, agent: BaseAgent): void {
        this.subscribers.set(agentId, agent);
    }

    unsubscribe(agentId: AgentId): void {
        this.subscribers.delete(agentId);
    }

    send(message: AgentMessage): void {
        this.messageQueue.push(message);

        if (message.to === 'ALL') {
            // Broadcast to all agents except sender
            this.subscribers.forEach((agent, id) => {
                if (id !== message.from) {
                    agent.receiveMessage(message);
                }
            });
        } else {
            // Send to specific agent
            const recipient = this.subscribers.get(message.to);
            if (recipient) {
                recipient.receiveMessage(message);
            }
        }
    }

    getMessages(): AgentMessage[] {
        return [...this.messageQueue];
    }

    clearMessages(): void {
        this.messageQueue = [];
    }
}

/**
 * Scenario input for agent execution
 */
export interface Scenario {
    eventType: string;
    hospitalConfig: any;
    currentDate: Date;
    environmentalData?: any;
}

/**
 * Agent Orchestrator - Coordinates multi-agent execution
 */
export class AgentOrchestrator {
    private agents: Map<AgentId, BaseAgent>;
    private messageBus: MessageBus;
    private perceptionAgents: BaseAgent[];
    private reasoningAgents: BaseAgent[];
    private actionAgents: BaseAgent[];

    constructor() {
        this.agents = new Map();
        this.messageBus = new MessageBus();
        this.perceptionAgents = [];
        this.reasoningAgents = [];
        this.actionAgents = [];
    }

    /**
     * Register an agent with the orchestrator
     */
    registerAgent(agent: BaseAgent): void {
        const agentId = agent.getId();
        this.agents.set(agentId, agent);
        this.messageBus.subscribe(agentId, agent);

        // Categorize by role
        const role = agent.getRole();
        if (role === 'PERCEPTION') {
            this.perceptionAgents.push(agent);
        } else if (role === 'REASONING') {
            this.reasoningAgents.push(agent);
        } else if (role === 'ACTION') {
            this.actionAgents.push(agent);
        }
    }

    /**
     * Unregister an agent
     */
    unregisterAgent(agentId: AgentId): void {
        this.agents.delete(agentId);
        this.messageBus.unsubscribe(agentId);
    }

    /**
     * Execute all agents in pipeline: Perception → Reasoning → Action
     */
    async executeAgents(_scenario: Scenario): Promise<AgentOutputs> {
        const perceptions: Perception[] = [];
        const reasonings: Reasoning[] = [];
        const actions: Action[] = [];
        const reasoningTraces: ReasoningTrace[] = [];

        try {
            // Phase 1: Perception agents gather data
            for (const agent of this.perceptionAgents) {
                const action = await agent.run();
                perceptions.push(action.data as Perception);
                reasoningTraces.push(...agent.getReasoningTraces());
            }

            // Phase 2: Reasoning agents analyze and calculate
            for (const agent of this.reasoningAgents) {
                const action = await agent.run();
                reasonings.push(action.data as Reasoning);
                reasoningTraces.push(...agent.getReasoningTraces());
            }

            // Phase 3: Action agents generate plans
            for (const agent of this.actionAgents) {
                const action = await agent.run();
                actions.push(action);
                reasoningTraces.push(...agent.getReasoningTraces());
            }

            return {
                perceptions,
                reasonings,
                actions,
                reasoningTraces,
                recommendations: actions.map(a => ({
                    id: `rec-${a.agentId}-${a.timestamp}`,
                    title: a.type,
                    description: a.explanation,
                    data: a.data
                }))
            };
        } catch (error) {
            console.error('Agent execution error:', error);
            throw error;
        }
    }

    /**
     * Broadcast a message to all agents
     */
    broadcastMessage(message: AgentMessage): void {
        this.messageBus.send(message);
    }

    /**
     * Get status of a specific agent
     */
    getAgentStatus(agentId: AgentId): string {
        const agent = this.agents.get(agentId);
        return agent ? agent.getStatus() : 'UNKNOWN';
    }

    /**
     * Get all registered agents
     */
    getAgents(): BaseAgent[] {
        return Array.from(this.agents.values());
    }

    /**
     * Reset all agents
     */
    async resetAll(): Promise<void> {
        for (const agent of this.agents.values()) {
            await agent.reset();
        }
        this.messageBus.clearMessages();
    }
}
