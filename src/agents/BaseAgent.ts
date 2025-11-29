import type {
    AgentId,
    AgentRole,
    AgentStatus,
    Perception,
    Reasoning,
    Action,
    ReasoningTrace,
    AgentMessage,
    AgentMemory,
    AgentToolkit,
    AgentConfig
} from './types';

/**
 * Abstract base class for all agents in the system.
 * Implements the Sense-Think-Act cycle.
 */
export abstract class BaseAgent {
    protected id: AgentId;
    protected name: string;
    protected role: AgentRole;
    protected status: AgentStatus;
    protected memory: AgentMemory;
    protected toolkit: AgentToolkit;
    protected reasoningTraces: ReasoningTrace[];

    constructor(config: AgentConfig, toolkit: AgentToolkit) {
        this.id = config.id;
        this.name = config.name;
        this.role = config.role;
        this.status = 'IDLE';
        this.toolkit = toolkit;
        this.reasoningTraces = [];

        // Initialize memory
        this.memory = {
            workingMemory: {
                currentPerceptions: [],
                activeGoals: [],
                recentActions: []
            },
            knowledgeBase: {
                historicalPatterns: [],
                learnedRules: [],
                pastDecisions: []
            },
            episodes: []
        };
    }

    /**
     * Core agent cycle: Sense → Think → Act
     */
    async run(): Promise<Action> {
        try {
            // SENSE: Gather information
            this.status = 'PERCEIVING';
            const perception = await this.perceive();
            this.memory.workingMemory.currentPerceptions.push(perception);
            this.logThought(`Perceived: ${JSON.stringify(perception.data)}`, 'PERCEIVE');

            // THINK: Reason about the situation
            this.status = 'REASONING';
            const reasoning = await this.reason(perception);
            this.logThought(`Reasoning: ${reasoning.reasoning}`, 'REASON');

            // ACT: Take action or generate output
            this.status = 'ACTING';
            const action = await this.act(reasoning);
            this.memory.workingMemory.recentActions.push(action);
            this.logThought(`Action: ${action.explanation}`, 'ACT');

            this.status = 'IDLE';
            return action;
        } catch (error) {
            this.status = 'IDLE';
            throw error;
        }
    }

    /**
     * SENSE: Gather information from the environment
     */
    abstract perceive(): Promise<Perception>;

    /**
     * THINK: Reason about the perceived information
     */
    abstract reason(perception: Perception): Promise<Reasoning>;

    /**
     * ACT: Take action based on reasoning
     */
    abstract act(reasoning: Reasoning): Promise<Action>;

    /**
     * Reset agent to initial state
     */
    async reset(): Promise<void> {
        this.status = 'IDLE';
        this.reasoningTraces = [];
        this.memory.workingMemory = {
            currentPerceptions: [],
            activeGoals: [],
            recentActions: []
        };
    }

    /**
     * Send message to another agent
     */
    sendMessage(to: AgentId, message: AgentMessage): void {
        this.toolkit.sendMessage(to, message);
    }

    /**
     * Receive message from another agent
     */
    receiveMessage(_message: AgentMessage): void {
        // Store in working memory for processing
        // Subclasses can override to handle specific messages
    }

    /**
     * Get all reasoning traces for this agent
     */
    getReasoningTraces(): ReasoningTrace[] {
        return this.reasoningTraces;
    }

    /**
     * Log a thought/reasoning step
     */
    protected logThought(thought: string, step: 'PERCEIVE' | 'REASON' | 'ACT'): void {
        const trace: ReasoningTrace = {
            agentId: this.id,
            agentName: this.name,
            timestamp: Date.now(),
            thought,
            step
        };
        this.reasoningTraces.push(trace);
    }

    /**
     * Get agent status
     */
    getStatus(): AgentStatus {
        return this.status;
    }

    /**
     * Get agent ID
     */
    getId(): AgentId {
        return this.id;
    }

    /**
     * Get agent name
     */
    getName(): string {
        return this.name;
    }

    /**
     * Get agent role
     */
    getRole(): AgentRole {
        return this.role;
    }
}
