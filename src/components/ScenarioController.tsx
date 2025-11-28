import { runSimulation, SCENARIOS } from '../engine/simulation';
import type { EventType } from '../types';
import { Zap } from 'lucide-react';
import clsx from 'clsx';
import { useSimulationStore } from '../store';

export const ScenarioController: React.FC = () => {
    const { activeEvent } = useSimulationStore();

    const handleScenarioClick = (type: EventType) => {
        runSimulation(type);
    };

    return (
        <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 text-slate-400 mr-2">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">Inject Scenario:</span>
            </div>

            {(Object.keys(SCENARIOS) as EventType[]).map((type) => {
                const scenario = SCENARIOS[type];
                const isActive = activeEvent?.id === scenario.id;

                return (
                    <button
                        key={type}
                        onClick={() => handleScenarioClick(type)}
                        className={clsx(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border",
                            isActive
                                ? "bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                                : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                        )}
                    >
                        {scenario.name}
                    </button>
                );
            })}
        </div>
    );
};
