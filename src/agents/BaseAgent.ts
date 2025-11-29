import type { AgentContext, Perception, Reasoning, Action } from './types';

/**
 * Abstract base class for all agents in the PRA system.
 * Implements the Sense-Think-Act cognitive cycle.
 */
export abstract class BaseAgent {
    protected agentId: string;

    constructor(agentId: string) {
        this.agentId = agentId;
    }

    /**
     * Main entry point for agent execution.
     * Orchestrates the perceive-reason-act cycle.
     */
    async run(context: AgentContext): Promise<AgentContext> {
        // Perceive: Gather data from environment or context
        const perception = await this.perceive(context);
        if (perception) {
            context.perceptions.push(perception);
        }

        // Reason: Analyze perceptions and draw conclusions
        const reasoning = await this.reason(context);
        if (reasoning) {
            context.reasonings.push(reasoning);
        }

        // Act: Generate actionable outputs
        const action = await this.act(context);
        if (action) {
            context.actions.push(action);
        }

        return context;
    }

    /**
     * Perception phase: Gather raw data from environment or shared context.
     * Override to implement perception logic.
     */
    protected abstract perceive(context: AgentContext): Promise<Perception | null>;

    /**
     * Reasoning phase: Process perceptions and generate insights.
     * Override to implement reasoning logic.
     */
    protected abstract reason(context: AgentContext): Promise<Reasoning | null>;

    /**
     * Action phase: Convert reasoning into concrete actions/recommendations.
     * Override to implement action logic.
     */
    protected abstract act(context: AgentContext): Promise<Action | null>;

    /**
     * Helper: Get perceptions from other agents
     */
    protected getPerceptions(context: AgentContext, agentId?: string): Perception[] {
        if (agentId) {
            return context.perceptions.filter(p => p.agentId === agentId);
        }
        return context.perceptions;
    }

    /**
     * Helper: Get reasonings from other agents
     */
    protected getReasonings(context: AgentContext, agentId?: string): Reasoning[] {
        if (agentId) {
            return context.reasonings.filter(r => r.agentId === agentId);
        }
        return context.reasonings;
    }

    /**
     * Helper: Get actions from other agents
     */
    protected getActions(context: AgentContext, agentId?: string): Action[] {
        if (agentId) {
            return context.actions.filter(a => a.type === agentId);
        }
        return context.actions;
    }
}
