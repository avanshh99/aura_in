import type { AgentContext } from './types';
import type { BaseAgent } from './BaseAgent';

/**
 * AgentOrchestrator manages the execution pipeline of PRA agents.
 * Executes agents in phases: Perception → Reasoning → Action
 */
export class AgentOrchestrator {
    private perceptionAgents: BaseAgent[] = [];
    private reasoningAgents: BaseAgent[] = [];
    private actionAgents: BaseAgent[] = [];

    /**
     * Register a perception agent
     */
    addPerceptionAgent(agent: BaseAgent): void {
        this.perceptionAgents.push(agent);
    }

    /**
     * Register a reasoning agent
     */
    addReasoningAgent(agent: BaseAgent): void {
        this.reasoningAgents.push(agent);
    }

    /**
     * Register an action agent
     */
    addActionAgent(agent: BaseAgent): void {
        this.actionAgents.push(agent);
    }

    /**
     * Execute the full agent pipeline.
     * Returns the enriched AgentContext with all perceptions, reasonings, and actions.
     */
    async execute(): Promise<AgentContext> {
        // Initialize empty context
        const context: AgentContext = {
            perceptions: [],
            reasonings: [],
            actions: []
        };

        console.log('🚀 [AgentOrchestrator] Starting execution pipeline...');

        // Phase 1: Perception - Run all perception agents
        console.log('👁️ [Phase 1] Running perception agents...');
        for (const agent of this.perceptionAgents) {
            await agent.run(context);
        }
        console.log(`✓ Perceptions gathered: ${context.perceptions.length}`);

        // Phase 2: Reasoning - Run all reasoning agents
        console.log('🧠 [Phase 2] Running reasoning agents...');
        for (const agent of this.reasoningAgents) {
            await agent.run(context);
        }
        console.log(`✓ Reasonings generated: ${context.reasonings.length}`);

        // Phase 3: Action - Run all action agents
        console.log('⚡ [Phase 3] Running action agents...');
        for (const agent of this.actionAgents) {
            await agent.run(context);
        }
        console.log(`✓ Actions generated: ${context.actions.length}`);

        console.log('✅ [AgentOrchestrator] Pipeline complete!');
        return context;
    }

    /**
     * Clear all registered agents
     */
    reset(): void {
        this.perceptionAgents = [];
        this.reasoningAgents = [];
        this.actionAgents = [];
    }
}
