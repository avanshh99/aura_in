import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { autoScenarioService } from '../services/autoScenario';
import { runSimulation } from '../engine/simulation';

export const AutoDetectButton: React.FC = () => {
    const [detecting, setDetecting] = useState(false);

    const handleAutoDetect = async () => {
        setDetecting(true);

        try {
            const scenario = await autoScenarioService.detectScenario();

            if (scenario) {
                // Trigger the detected scenario
                runSimulation(scenario.type);
            } else {
                // No critical scenario detected, run NORMAL
                runSimulation('NORMAL');
            }
        } catch (error) {
            console.error('Auto-detect error:', error);
        } finally {
            setDetecting(false);
        }
    };

    return (
        <button
            onClick={handleAutoDetect}
            disabled={detecting}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            title="Automatically detect scenario based on live data"
        >
            {detecting ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                </>
            ) : (
                <>
                    <Sparkles className="w-4 h-4" />
                    <span>Auto-Detect</span>
                </>
            )}
        </button>
    );
};
