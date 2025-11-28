import React, { useEffect, useRef } from 'react';
import { useSimulationStore } from '../store';
import { Bot, BrainCircuit, Terminal, Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export const AgentMonitor: React.FC = () => {
    const { agents, logs } = useSimulationStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Active Agents Panel */}
            <div className="lg:col-span-1 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-slate-300 mb-2 px-2">
                    <BrainCircuit className="w-5 h-5 text-cyan-400" />
                    <h2 className="font-semibold tracking-wide uppercase text-sm">Neural Grid Status</h2>
                </div>

                <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    {agents.map((agent) => (
                        <motion.div
                            key={agent.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={clsx(
                                "relative overflow-hidden rounded-xl border p-4 transition-all duration-500 group",
                                agent.status === 'ACTING'
                                    ? "bg-slate-900/80 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)]"
                                    : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                            )}
                        >
                            {/* Background Splash Effect */}
                            {agent.status === 'ACTING' && (
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
                            )}

                            <div className="relative z-10 flex items-start gap-4">
                                <div className={clsx(
                                    "p-3 rounded-xl border transition-colors duration-300",
                                    agent.status === 'ACTING'
                                        ? "bg-cyan-950/50 border-cyan-500/30 text-cyan-400"
                                        : "bg-slate-800/50 border-slate-700 text-slate-500"
                                )}>
                                    <Bot className="w-6 h-6" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className={clsx(
                                            "font-bold text-sm tracking-wide",
                                            agent.status === 'ACTING' ? "text-white" : "text-slate-400"
                                        )}>
                                            {agent.name}
                                        </h3>
                                        {agent.status === 'ACTING' && (
                                            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium mb-3">{agent.role}</p>

                                    {/* Status Indicator */}
                                    <div className="flex items-center gap-2">
                                        <div className={clsx(
                                            "h-1.5 flex-1 rounded-full overflow-hidden bg-slate-800",
                                            agent.status === 'ACTING' ? "bg-slate-800" : "bg-slate-800"
                                        )}>
                                            <motion.div
                                                className={clsx(
                                                    "h-full rounded-full",
                                                    agent.status === 'ACTING' ? "bg-cyan-500" : "bg-slate-600"
                                                )}
                                                animate={{
                                                    width: agent.status === 'ACTING' ? "100%" : "30%",
                                                    opacity: agent.status === 'ACTING' ? 1 : 0.5
                                                }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        </div>
                                        <span className={clsx(
                                            "text-[10px] font-bold uppercase",
                                            agent.status === 'ACTING' ? "text-cyan-400" : "text-slate-600"
                                        )}>
                                            {agent.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Reasoning Terminal */}
            <div className="lg:col-span-2 bg-black/60 backdrop-blur-md border border-slate-800 rounded-xl flex flex-col font-mono text-sm relative overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/50">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Terminal className="w-4 h-4 text-cyan-500" />
                        <span className="text-xs font-bold tracking-widest text-slate-500">SYSTEM_CORTEX // LIVE_FEED</span>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500/20" />
                        <div className="w-2 h-2 rounded-full bg-amber-500/20" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
                    </div>
                </div>

                {/* Content */}
                <div className="relative flex-1 overflow-hidden">
                    {/* Scanline Effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_4px,3px_100%]" />

                    <div ref={scrollRef} className="absolute inset-0 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                        <AnimatePresence initial={false}>
                            {logs.map((log) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex gap-4 group"
                                >
                                    <span className="text-slate-600 text-xs whitespace-nowrap font-mono mt-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                        {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-cyan-500 font-bold text-xs tracking-wider uppercase">[{log.agentName}]</span>
                                            <div className="h-px flex-1 bg-slate-800/50" />
                                        </div>
                                        <p className="text-slate-300 leading-relaxed text-sm">
                                            {log.message}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {logs.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-700 gap-4">
                                <Zap className="w-8 h-8 opacity-20" />
                                <p className="text-xs uppercase tracking-widest">Awaiting Neural Input...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
