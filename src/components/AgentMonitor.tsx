import React, { useState, useEffect } from 'react';
import { Brain, Activity, Package, Users, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

interface AgentMonitorProps {
    darkMode?: boolean;
}

interface Agent {
    id: string;
    name: string;
    icon: any;
    color: string;
    status: 'IDLE' | 'ANALYZING' | 'ACTING';
    message: string;
}

const agentStates = {
    surgePreditor: [
        { status: 'IDLE' as const, message: 'Monitoring weather patterns and event calendar' },
        { status: 'ANALYZING' as const, message: 'Analyzing festival calendar and weather patterns...' },
        { status: 'ACTING' as const, message: 'Recommendation: Prepare for Diwali surge (+60% ER)' },
    ],
    resourceOptimizer: [
        { status: 'IDLE' as const, message: 'All facilities adequately stocked' },
        { status: 'ANALYZING' as const, message: 'Calculating optimal inventory distribution...' },
        { status: 'ACTING' as const, message: 'Action: Transfer 100 O₂ cylinders AIIMS→Fortis' },
    ],
    staffingCoordinator: [
        { status: 'IDLE' as const, message: 'Staff allocation within normal parameters' },
        { status: 'ANALYZING' as const, message: 'Analyzing shift patterns for efficiency...' },
        { status: 'ACTING' as const, message: 'Action: Activate on-call pool (12 doctors ready)' },
    ],
    publicAdvisory: [
        { status: 'IDLE' as const, message: 'No critical alerts at this time' },
        { status: 'ANALYZING' as const, message: 'Drafting pollution advisory for Delhi NCR...' },
        { status: 'ACTING' as const, message: 'Alert sent: AQI Critical - Stay indoors' },
    ],
};

export const AgentMonitor: React.FC<AgentMonitorProps> = ({ darkMode = false }) => {
    const [agents, setAgents] = useState<Agent[]>([
        {
            id: 'surge',
            name: 'Surge Predictor',
            icon: Brain,
            color: 'emerald',
            status: 'IDLE',
            message: agentStates.surgePreditor[0].message,
        },
        {
            id: 'resource',
            name: 'Resource Optimizer',
            icon: Package,
            color: 'cyan',
            status: 'IDLE',
            message: agentStates.resourceOptimizer[0].message,
        },
        {
            id: 'staffing',
            name: 'Staffing Coordinator',
            icon: Users,
            color: 'blue',
            status: 'IDLE',
            message: agentStates.staffingCoordinator[0].message,
        },
        {
            id: 'advisory',
            name: 'Public Advisory',
            icon: Megaphone,
            color: 'purple',
            status: 'IDLE',
            message: agentStates.publicAdvisory[0].message,
        },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setAgents((prev) =>
                prev.map((agent) => {
                    const stateKey = agent.id === 'surge' ? 'surgePreditor' :
                        agent.id === 'resource' ? 'resourceOptimizer' :
                            agent.id === 'staffing' ? 'staffingCoordinator' : 'publicAdvisory';

                    const states = agentStates[stateKey];
                    const randomState = states[Math.floor(Math.random() * states.length)];

                    return {
                        ...agent,
                        status: randomState.status,
                        message: randomState.message,
                    };
                })
            );
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-xl p-6 mb-8`}>
            <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-emerald-500" />
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    AI Agent Monitor
                </h2>
                <div className="ml-auto flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                        System Active
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {agents.map((agent) => {
                    const Icon = agent.icon;
                    const isActive = agent.status === 'ACTING' || agent.status === 'ANALYZING';

                    return (
                        <motion.div
                            key={agent.id}
                            layout
                            className={`p-4 rounded-lg border ${isActive
                                    ? darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-300'
                                    : darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
                                } transition-all`}
                        >
                            <div className="flex items-start gap-3 mb-3">
                                <div className={`p-2 rounded-lg bg-${agent.color}-500/10`}>
                                    <Icon className={`w-5 h-5 text-${agent.color}-500`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {agent.name}
                                    </h3>
                                    <span className={`text-xs ${agent.status === 'ACTING' ? `text-${agent.color}-500` :
                                            agent.status === 'ANALYZING' ? 'text-yellow-500' :
                                                darkMode ? 'text-slate-500' : 'text-gray-400'
                                        }`}>
                                        {agent.status}
                                    </span>
                                </div>
                            </div>
                            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'} line-clamp-2`}>
                                {agent.message}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
