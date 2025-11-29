import React, { useState } from 'react';
import { Settings, Save, RotateCcw, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getHospitalConfig, updateHospitalConfig, resetHospitalConfig } from '../forecasting/hospitalConfig';
import type { HospitalConfig } from '../forecasting/types';

export const HospitalConfigPanel: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState<HospitalConfig>(getHospitalConfig());
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        updateHospitalConfig(config);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleReset = () => {
        const defaultConfig = resetHospitalConfig();
        setConfig(defaultConfig);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const updateField = (field: keyof HospitalConfig, value: any) => {
        setConfig({ ...config, [field]: value });
    };

    const updateNestedField = (parent: keyof HospitalConfig, field: string, value: number) => {
        setConfig({
            ...config,
            [parent]: {
                ...(config[parent] as any),
                [field]: value
            }
        });
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => {
                    console.log('Settings button clicked! Current state:', isOpen);
                    setIsOpen(!isOpen);
                }}
                className="fixed top-4 right-4 z-[9999] p-3 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors shadow-lg cursor-pointer"
                title="Hospital Configuration"
                style={{ pointerEvents: 'auto' }}
            >
                <Settings className="w-5 h-5 text-cyan-400" />
            </button>

            {/* Configuration Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9990]"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-slate-900 border-l border-slate-800 z-[9995] overflow-y-auto"
                        >
                            <div className="p-6 space-y-6">
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                            <Settings className="w-6 h-6 text-cyan-400" />
                                            Hospital Configuration
                                        </h2>
                                        <p className="text-sm text-slate-400 mt-1">
                                            Customize capacity planning parameters
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-slate-400 hover:text-white"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Hospital Info */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white">Hospital Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Hospital ID
                                            </label>
                                            <input
                                                type="text"
                                                value={config.hospitalId}
                                                onChange={(e) => updateField('hospitalId', e.target.value)}
                                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Hospital Name
                                            </label>
                                            <input
                                                type="text"
                                                value={config.name}
                                                onChange={(e) => updateField('name', e.target.value)}
                                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Bed Capacity */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white">Bed Capacity</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Total Beds
                                            </label>
                                            <input
                                                type="number"
                                                value={config.totalBeds}
                                                onChange={(e) => updateField('totalBeds', parseInt(e.target.value))}
                                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Allocated Beds for Risk
                                            </label>
                                            <input
                                                type="number"
                                                value={config.allocatedBedsForRisk}
                                                onChange={(e) => updateField('allocatedBedsForRisk', parseInt(e.target.value))}
                                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Avg Length of Stay (days)
                                            </label>
                                            <input
                                                type="number"
                                                value={config.avgLengthOfStayDays}
                                                onChange={(e) => updateField('avgLengthOfStayDays', parseInt(e.target.value))}
                                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Target Occupancy (0-1)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.05"
                                                min="0"
                                                max="1"
                                                value={config.targetOccupancy}
                                                onChange={(e) => updateField('targetOccupancy', parseFloat(e.target.value))}
                                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Staff Capacity */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white">Staff Capacity</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Doctors per Shift
                                            </label>
                                            <input
                                                type="number"
                                                value={config.currentDoctorsPerShift}
                                                onChange={(e) => updateField('currentDoctorsPerShift', parseInt(e.target.value))}
                                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Nurses per Shift
                                            </label>
                                            <input
                                                type="number"
                                                value={config.currentNursesPerShift}
                                                onChange={(e) => updateField('currentNursesPerShift', parseInt(e.target.value))}
                                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Max Patients per Doctor
                                            </label>
                                            <input
                                                type="number"
                                                value={config.maxPatientsPerDoctorPerShift}
                                                onChange={(e) => updateField('maxPatientsPerDoctorPerShift', parseInt(e.target.value))}
                                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Max Patients per Nurse
                                            </label>
                                            <input
                                                type="number"
                                                value={config.maxPatientsPerNursePerShift}
                                                onChange={(e) => updateField('maxPatientsPerNursePerShift', parseInt(e.target.value))}
                                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Baseline Load */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white">Baseline Load</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Baseline Patients per Day
                                        </label>
                                        <input
                                            type="number"
                                            value={config.baselinePatientsPerDay}
                                            onChange={(e) => updateField('baselinePatientsPerDay', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Uplift Factors */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold text-white">Seasonal Uplift Factors</h3>
                                        <div className="group relative">
                                            <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
                                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-80 p-3 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10">
                                                <p className="text-xs text-slate-300 leading-relaxed">
                                                    <strong className="text-cyan-400">Uplift factors</strong> are multipliers that adjust predicted patient load based on seasonal patterns.
                                                    <br /><br />
                                                    <strong>Example:</strong> If baseline is 50 patients/day and Winter uplift is 1.4, the system predicts 50 × 1.4 = 70 patients/day during winter.
                                                    <br /><br />
                                                    Higher values = more patients expected. These are learned from historical data.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400">
                                        Multipliers for predicted patient load (e.g., 1.3 = 30% increase)
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Winter
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={config.upliftFactors.WINTER}
                                                onChange={(e) => updateNestedField('upliftFactors', 'WINTER', parseFloat(e.target.value))}
                                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Summer
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={config.upliftFactors.SUMMER}
                                                onChange={(e) => updateNestedField('upliftFactors', 'SUMMER', parseFloat(e.target.value))}
                                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Monsoon
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={config.upliftFactors.MONSOON}
                                                onChange={(e) => updateNestedField('upliftFactors', 'MONSOON', parseFloat(e.target.value))}
                                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Post-Monsoon
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={config.upliftFactors.POST_MONSOON}
                                                onChange={(e) => updateNestedField('upliftFactors', 'POST_MONSOON', parseFloat(e.target.value))}
                                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Festival
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={config.upliftFactors.FESTIVAL}
                                                onChange={(e) => updateNestedField('upliftFactors', 'FESTIVAL', parseFloat(e.target.value))}
                                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-4 border-t border-slate-800">
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        <Save className="w-5 h-5" />
                                        {isSaved ? 'Saved!' : 'Save Configuration'}
                                    </button>
                                    <button
                                        onClick={handleReset}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                                    >
                                        <RotateCcw className="w-5 h-5" />
                                        Reset to Default
                                    </button>
                                </div>

                                {isSaved && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-400 text-sm"
                                    >
                                        ✓ Configuration saved successfully! Re-run scenarios to see updated calculations.
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
