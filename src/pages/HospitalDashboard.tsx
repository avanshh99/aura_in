import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Hospital,
    Activity,
    Users,
    Package,
    TrendingUp,
    AlertTriangle,
    Sun,
    Moon,
    LogOut,
    ArrowRight
} from 'lucide-react';
import { MOCK_HOSPITALS } from '../data/hospitals';
import type { Hospital as HospitalType } from '../types';
import { WhatIfChatbot } from '../components/WhatIfChatbot';
import { AgentMonitor } from '../components/AgentMonitor';

export const HospitalDashboard: React.FC = () => {
    const navigate = useNavigate();
    const hospitalId = sessionStorage.getItem('currentHospitalId');
    const [darkMode, setDarkMode] = useState(false);
    const [hospital, setHospital] = useState<HospitalType | null>(null);

    useEffect(() => {
        if (!hospitalId) {
            navigate('/');
            return;
        }

        const hospitalData = MOCK_HOSPITALS.find(h => h.id === hospitalId);
        if (!hospitalData) {
            navigate('/');
            return;
        }

        setHospital(hospitalData);
    }, [hospitalId, navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem('currentHospitalId');
        navigate('/');
    };

    if (!hospital) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p>Loading...</p>
        </div>;
    }

    const bedOccupancy = ((hospital.capacity.beds.total - hospital.capacity.beds.available) / hospital.capacity.beds.total) * 100;
    const icuOccupancy = ((hospital.capacity.icu.total - hospital.capacity.icu.available) / hospital.capacity.icu.total) * 100;
    const staffingLevel = ((hospital.staff.doctors.onDuty + hospital.staff.nurses.onDuty) / (hospital.staff.doctors.total + hospital.staff.nurses.total)) * 100;

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-gray-50'} transition-colors`}>
            {/* Header */}
            <header className={`border-b ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} sticky top-0 z-50 backdrop-blur-lg`}>
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500 rounded-lg">
                            <Hospital className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                                {hospital.name}
                            </h1>
                            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                                {hospital.location.city}, {hospital.location.state}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${hospital.currentOccupancy >= 85
                            ? 'bg-red-50 border-red-200'
                            : hospital.currentOccupancy >= 70
                                ? 'bg-yellow-50 border-yellow-200'
                                : 'bg-emerald-50 border-emerald-200'
                            } border`}>
                            <Activity className={`w-4 h-4 ${hospital.currentOccupancy >= 85 ? 'text-red-500' :
                                hospital.currentOccupancy >= 70 ? 'text-yellow-500' : 'text-emerald-500'
                                }`} />
                            <span className={`text-xs font-semibold ${hospital.currentOccupancy >= 85 ? 'text-red-700' :
                                hospital.currentOccupancy >= 70 ? 'text-yellow-700' : 'text-emerald-700'
                                }`}>
                                {hospital.currentOccupancy}% Occupied
                            </span>
                        </div>

                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                        >
                            {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
                        </button>

                        <button
                            onClick={handleLogout}
                            className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                        >
                            <LogOut className={`w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8 relative z-10">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                        <div className="flex items-center justify-between mb-2">
                            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Bed Occupancy</p>
                            <Activity className="w-5 h-5 text-emerald-500" />
                        </div>
                        <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {Math.round(bedOccupancy)}%
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-gray-500'} mt-1`}>
                            {hospital.capacity.beds.available} / {hospital.capacity.beds.total} available
                        </p>
                    </div>

                    <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                        <div className="flex items-center justify-between mb-2">
                            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>ICU Capacity</p>
                            <AlertTriangle className="w-5 h-5 text-cyan-500" />
                        </div>
                        <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {Math.round(icuOccupancy)}%
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-gray-500'} mt-1`}>
                            {hospital.capacity.icu.available} / {hospital.capacity.icu.total} available
                        </p>
                    </div>

                    <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                        <div className="flex items-center justify-between mb-2">
                            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Staff On Duty</p>
                            <Users className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {Math.round(staffingLevel)}%
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-gray-500'} mt-1`}>
                            {hospital.staff.doctors.onDuty}D + {hospital.staff.nurses.onDuty}N
                        </p>
                    </div>

                    <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                        <div className="flex items-center justify-between mb-2">
                            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>O₂ Supply</p>
                            <Package className="w-5 h-5 text-purple-500" />
                        </div>
                        <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {hospital.inventory.oxygenCylinders}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-gray-500'} mt-1`}>
                            Cylinders available
                        </p>
                    </div>
                </div>

                {/* Staffing & Inventory */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Staffing Module */}
                    <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Staffing Overview
                            </h2>
                            <Users className="w-5 h-5 text-emerald-500" />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                        Doctors
                                    </span>
                                    <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                        {hospital.staff.doctors.onDuty} / {hospital.staff.doctors.total}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-emerald-500 h-2 rounded-full transition-all"
                                        style={{ width: `${(hospital.staff.doctors.onDuty / hospital.staff.doctors.total) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                        Nurses
                                    </span>
                                    <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                        {hospital.staff.nurses.onDuty} / {hospital.staff.nurses.total}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-cyan-500 h-2 rounded-full transition-all"
                                        style={{ width: `${(hospital.staff.nurses.onDuty / hospital.staff.nurses.total) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-slate-800">
                                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'} mb-3`}>
                                    Quick Actions
                                </p>
                                <button className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                                    Request Additional Staff
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Inventory Module */}
                    <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Inventory Status
                            </h2>
                            <Package className="w-5 h-5 text-cyan-500" />
                        </div>

                        <div className="space-y-3">
                            {[
                                { label: 'Oxygen Cylinders', value: hospital.inventory.oxygenCylinders, max: 500, color: 'blue' },
                                { label: 'Ventilators', value: hospital.inventory.ventilators, max: 100, color: 'purple' },
                                { label: 'Blood Units', value: hospital.inventory.bloodUnits, max: 1000, color: 'red' },
                                { label: 'Burn Kits', value: hospital.inventory.burnKits, max: 100, color: 'orange' },
                            ].map((item, idx) => (
                                <div key={idx} className={`p-3 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                            {item.label}
                                        </span>
                                        <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {item.value}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-300 dark:bg-slate-700 rounded-full h-1.5">
                                        <div
                                            className={`bg-${item.color}-500 h-1.5 rounded-full transition-all`}
                                            style={{ width: `${(item.value / item.max) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}

                            <div className="pt-2">
                                <button className="w-full px-4 py-2 border-2 border-cyan-600 text-cyan-600 text-sm font-semibold rounded-lg hover:bg-cyan-50 transition-colors flex items-center justify-center gap-2">
                                    Order Supplies
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Agent Monitor */}
                <AgentMonitor darkMode={darkMode} />

                {/* Predictions Section */}
                <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                        <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            7-Day Forecast & Recommendations
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                                        Pollution Spike Expected
                                    </p>
                                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                                        AQI forecast: 350+ in 3 days. Expect +30% respiratory cases.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <div className="flex items-start gap-3">
                                <Package className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
                                        Increase O₂ Stock
                                    </p>
                                    <p className="text-xs text-blue-700 dark:text-blue-300">
                                        Recommended: Order +100 cylinders by tomorrow.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                            <div className="flex items-start gap-3">
                                <Users className="w-5 h-5 text-emerald-600 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200 mb-1">
                                        Schedule Extra Pulmonologists
                                    </p>
                                    <p className="text-xs text-emerald-700 dark:text-emerald-300">
                                        Activate on-call pool for weekend coverage.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* What-If Chatbot */}
            <WhatIfChatbot />
        </div>
    );
};
