import React, { useState } from 'react';
import { MOCK_HOSPITALS } from '../data/hospitals';
import { Hospital, Activity, Users, AlertTriangle, MapPin, Sun, Moon, LogOut } from 'lucide-react';
import { LiveMap } from '../components/LiveMap';
import { useNavigate } from 'react-router-dom';
import { WhatIfChatbot } from '../components/WhatIfChatbot';
import { AgentMonitor } from '../components/AgentMonitor';

export const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);

    const handleLogout = () => {
        sessionStorage.removeItem('userRole');
        navigate('/');
    };

    // Calculate statistics
    const totalCapacity = MOCK_HOSPITALS.reduce((sum, h) => sum + h.capacity.beds.total, 0);
    const totalOccupied = MOCK_HOSPITALS.reduce(
        (sum, h) => sum + (h.capacity.beds.total - h.capacity.beds.available),
        0
    );
    const avgOccupancy = Math.round((totalOccupied / totalCapacity) * 100);

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-gray-50'} transition-colors`}>
            {/* Header */}
            <header className={`border-b ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} sticky top-0 z-50 backdrop-blur-lg`}>
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-lg">
                            <Hospital className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                                Aura.in - Admin Dashboard
                            </h1>
                            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                                Multi-Hospital Command Center
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
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
            <main className="container mx-auto px-6 py-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Total Hospitals', value: MOCK_HOSPITALS.length, icon: Hospital, color: 'emerald' },
                        { label: 'Avg Occupancy', value: `${avgOccupancy}%`, icon: Activity, color: 'cyan' },
                        { label: 'Total Staff On Duty', value: MOCK_HOSPITALS.reduce((sum, h) => sum + h.staff.doctors.onDuty + h.staff.nurses.onDuty, 0), icon: Users, color: 'blue' },
                        { label: 'Critical Alerts', value: MOCK_HOSPITALS.filter(h => h.currentOccupancy >= 85).length, icon: AlertTriangle, color: 'red' },
                    ].map((stat, idx) => (
                        <div key={idx} className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                            <div className="flex items-center justify-between mb-2">
                                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{stat.label}</p>
                                <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                            </div>
                            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Agent Monitor */}
                <AgentMonitor darkMode={darkMode} />

                {/* Map Section */}
                <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-xl p-6 mb-8`}>
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5 text-emerald-500" />
                        <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Live Hospital Map
                        </h2>
                    </div>
                    <LiveMap hospitals={MOCK_HOSPITALS} darkMode={darkMode} />
                </div>

                {/* Hospital Registry Table */}
                <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                    <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Hospital Registry
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`border-b ${darkMode ? 'border-slate-800' : 'border-gray-200'}`}>
                                    <th className={`py-3 px-4 text-left text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Hospital</th>
                                    <th className={`py-3 px-4 text-left text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Location</th>
                                    <th className={`py-3 px-4 text-left text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Occupancy</th>
                                    <th className={`py-3 px-4 text-left text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Staff</th>
                                    <th className={`py-3 px-4 text-left text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>O₂ Supply</th>
                                    <th className={`py-3 px-4 text-left text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_HOSPITALS.map((hospital) => {
                                    const status = hospital.currentOccupancy >= 85
                                        ? { label: 'CRITICAL', color: 'red' }
                                        : hospital.currentOccupancy >= 70
                                            ? { label: 'MODERATE', color: 'yellow' }
                                            : { label: 'NORMAL', color: 'green' };

                                    return (
                                        <tr key={hospital.id} className={`border-b ${darkMode ? 'border-slate-800 hover:bg-slate-800/50' : 'border-gray-100 hover:bg-gray-50'}`}>
                                            <td className={`py-3 px-4 text-sm font-medium ${darkMode ? 'text-slate-200' : 'text-gray-900'}`}>
                                                {hospital.name}
                                            </td>
                                            <td className={`py-3 px-4 text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                                {hospital.location.city}, {hospital.location.state}
                                            </td>
                                            <td className={`py-3 px-4 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                                {hospital.currentOccupancy}%
                                            </td>
                                            <td className={`py-3 px-4 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                                {hospital.staff.doctors.onDuty}D / {hospital.staff.nurses.onDuty}N
                                            </td>
                                            <td className={`py-3 px-4 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                                {hospital.inventory.oxygenCylinders} units
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${status.color === 'red' ? 'bg-red-100 text-red-700' :
                                                        status.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-green-100 text-green-700'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${status.color === 'red' ? 'bg-red-500' :
                                                            status.color === 'yellow' ? 'bg-yellow-500' :
                                                                'bg-green-500'
                                                        }`} />
                                                    {status.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* What-If Chatbot */}
            <WhatIfChatbot />
        </div>
    );
};
