import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Send, CheckCircle, Users, Bell, X } from 'lucide-react';
import type { Recommendation } from '../types';

interface AdvisoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    recommendation: Recommendation | null;
}

export const AdvisoryModal: React.FC<AdvisoryModalProps> = ({ isOpen, onClose, recommendation }) => {
    const [step, setStep] = useState<'IDLE' | 'BROADCASTING' | 'SENT'>('IDLE');
    const [progress, setProgress] = useState(0);
    const [stats, setStats] = useState({ reached: 0, engagement: 0 });

    useEffect(() => {
        if (isOpen && step === 'IDLE') {
            // Reset state on open
            setStep('IDLE');
            setProgress(0);
            setStats({ reached: 0, engagement: 0 });
        }
    }, [isOpen]);

    const handleBroadcast = () => {
        setStep('BROADCASTING');

        // Simulate broadcast progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setStep('SENT');
                    setStats({
                        reached: Math.floor(Math.random() * 50000) + 20000,
                        engagement: Math.floor(Math.random() * 80) + 10
                    });
                    return 100;
                }
                return prev + 2;
            });
        }, 50);
    };

    if (!isOpen || !recommendation) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <Radio className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Emergency Broadcast System</h2>
                                <p className="text-xs text-slate-400">Public Advisory Network</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Alert Preview */}
                        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                            <div className="flex items-start gap-3">
                                <Bell className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                                <div>
                                    <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-1">
                                        {recommendation.title}
                                    </h3>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        {recommendation.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Simulation View */}
                        <div className="h-48 bg-slate-950/50 rounded-xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
                            {step === 'IDLE' && (
                                <div className="text-center space-y-2">
                                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                        <Radio className="w-8 h-8 text-slate-500" />
                                    </div>
                                    <p className="text-slate-400 text-sm">Ready to broadcast to telecom grid</p>
                                </div>
                            )}

                            {step === 'BROADCASTING' && (
                                <div className="w-full h-full flex flex-col items-center justify-center relative">
                                    {/* Radar Animation */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-64 h-64 border border-red-500/20 rounded-full animate-[ping_3s_linear_infinite]" />
                                        <div className="w-48 h-48 border border-red-500/30 rounded-full animate-[ping_3s_linear_infinite_0.5s] absolute" />
                                        <div className="w-32 h-32 border border-red-500/40 rounded-full animate-[ping_3s_linear_infinite_1s] absolute" />
                                    </div>

                                    <div className="z-10 text-center">
                                        <div className="text-2xl font-bold text-red-500 mb-2">{progress}%</div>
                                        <p className="text-xs text-red-400 uppercase tracking-widest animate-pulse">Broadcasting...</p>
                                    </div>
                                </div>
                            )}

                            {step === 'SENT' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center"
                                >
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4 border border-emerald-500/50">
                                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                                    </div>
                                    <h3 className="text-white font-bold mb-1">Broadcast Complete</h3>
                                    <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                                        <div className="flex items-center gap-1.5 text-slate-300">
                                            <Users className="w-4 h-4 text-blue-400" />
                                            <span>{stats.reached.toLocaleString()} Reached</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-300">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span>{stats.engagement}% Engagement</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
                        >
                            Close
                        </button>

                        {step === 'IDLE' && (
                            <button
                                onClick={handleBroadcast}
                                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]"
                            >
                                <Send className="w-4 h-4" />
                                Broadcast Alert
                            </button>
                        )}

                        {step === 'SENT' && (
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Done
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
