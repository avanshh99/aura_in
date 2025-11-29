import React, { useState, useEffect } from 'react';
import { Brain, Package, Users, Megaphone, TrendingUp, AlertTriangle } from 'lucide-react';
import { MOCK_HOSPITALS } from '../data/hospitals';
import { surgePredictor, resourceOptimizer, staffingCoordinator, advisoryGenerator } from '../engine/agents';
import type { SurgePrediction } from '../types';

interface AgentResultsProps {
    darkMode?: boolean;
}

export const AgentResults: React.FC<AgentResultsProps> = ({ darkMode = false }) => {
    const [surgePredictions, setSurgePredictions] = useState<SurgePrediction[]>([]);
    const [resourceRecs, setResourceRecs] = useState<any[]>([]);
    const [staffingRecs, setStaffingRecs] = useState<any[]>([]);
    const [advisories, setAdvisories] = useState<any[]>([]);

    useEffect(() => {
        // Run all agents
        const mockWeather = { aqi: 350, temp: 38 };

        // 1. Surge Predictor - Get predictions for all hospitals
        const allPredictions: SurgePrediction[] = [];
        MOCK_HOSPITALS.forEach(hospital => {
            const predictions = surgePredictor.predict(hospital, mockWeather);
            allPredictions.push(...predictions);
        });
        // Sort by expected increase and take top 5
        const top5 = allPredictions
            .sort((a, b) => b.expectedIncrease.admissions - a.expectedIncrease.admissions)
            .slice(0, 5);
        setSurgePredictions(top5);

        // 2. Resource Optimizer
        const resources = resourceOptimizer.optimizeResources(MOCK_HOSPITALS);
        setResourceRecs(resources.slice(0, 5));

        // 3. Staffing Coordinator
        const staffing = staffingCoordinator.optimizeStaffing(MOCK_HOSPITALS);
        setStaffingRecs(staffing.slice(0, 5));

        // 4. Public Advisory Generator
        const alerts = advisoryGenerator.generateAdvisories(mockWeather, top5);
        setAdvisories(alerts);

    }, []);

    const getHospitalName = (hospitalId: string) => {
        const hospital = MOCK_HOSPITALS.find(h => h.id === hospitalId);
        return hospital?.name || hospitalId;
    };

    const getDaysAway = (predictedDate: Date) => {
        const days = Math.ceil((predictedDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return days;
    };

    return (
        <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-xl p-6 mb-8`}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    AI Agent Results & Recommendations
                </h2>
            </div>

            {/* 1. SURGE PREDICTOR - Table Format (Top 5) */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 text-emerald-500" />
                    <h3 className={`text-md font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Surge Predictions (Top 5 Critical)
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className={`w-full ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                        <thead>
                            <tr className={`border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                                <th className={`text-left py-3 px-4 text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                    Hospital
                                </th>
                                <th className={`text-left py-3 px-4 text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                    Event
                                </th>
                                <th className={`text-left py-3 px-4 text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                    Days Away
                                </th>
                                <th className={`text-left py-3 px-4 text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                    Expected Surge
                                </th>
                                <th className={`text-left py-3 px-4 text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                    ICU Need
                                </th>
                                <th className={`text-left py-3 px-4 text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                    Top Recommendation
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {surgePredictions.map((pred, idx) => (
                                <tr key={idx} className={`border-b ${darkMode ? 'border-slate-800 hover:bg-slate-800/50' : 'border-gray-100 hover:bg-gray-50'}`}>
                                    <td className="py-3 px-4 text-sm font-medium">
                                        {getHospitalName(pred.hospitalId)}
                                    </td>
                                    <td className="py-3 px-4 text-sm">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${pred.eventType === 'EPIDEMIC' ? 'bg-red-100 text-red-700' :
                                            pred.eventType === 'POLLUTION' ? 'bg-orange-100 text-orange-700' :
                                                'bg-purple-100 text-purple-700'
                                            }`}>
                                            {pred.eventName}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm">
                                        {getDaysAway(pred.predictedDate)} days
                                    </td>
                                    <td className="py-3 px-4 text-sm font-bold text-red-500">
                                        +{pred.expectedIncrease.admissions}%
                                    </td>
                                    <td className="py-3 px-4 text-sm font-bold text-orange-500">
                                        +{pred.expectedIncrease.icuNeed}%
                                    </td>
                                    <td className="py-3 px-4 text-sm">
                                        {pred.recommendations[0]}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 2. RESOURCE OPTIMIZER */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-cyan-500" />
                    <h3 className={`text-md font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Resource Transfers & Orders
                    </h3>
                </div>
                <div className="space-y-3">
                    {resourceRecs.map((rec, idx) => (
                        <div key={idx} className={`p-4 rounded-lg border ${rec.priority === 'HIGH'
                            ? darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
                            : darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'
                            }`}>
                            <div className="flex items-start gap-3">
                                <div className={`px-2 py-1 rounded text-xs font-bold ${rec.priority === 'HIGH' ? 'bg-red-500 text-white' :
                                    rec.priority === 'MEDIUM' ? 'bg-yellow-500 text-white' :
                                        'bg-blue-500 text-white'
                                    }`}>
                                    {rec.priority}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${darkMode ? 'text-slate-200' : 'text-gray-900'}`}>
                                        {rec.recommendation}
                                    </p>
                                    <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                                        Action: {rec.action}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. STAFFING COORDINATOR */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-blue-500" />
                    <h3 className={`text-md font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Staffing Recommendations
                    </h3>
                </div>
                <div className="space-y-3">
                    {staffingRecs.map((rec, idx) => (
                        <div key={idx} className={`p-4 rounded-lg border ${rec.urgency === 'URGENT'
                            ? darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
                            : darkMode ? 'bg-slate-800 border-slate-700' : 'bg-blue-50 border-blue-200'
                            }`}>
                            <div className="flex items-start gap-3">
                                <div className={`px-2 py-1 rounded text-xs font-bold ${rec.urgency === 'URGENT' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                                    }`}>
                                    {rec.urgency}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${darkMode ? 'text-slate-200' : 'text-gray-900'}`}>
                                        {rec.recommendation}
                                    </p>
                                    <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                                        Type: {rec.type}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. PUBLIC ADVISORY GENERATOR */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Megaphone className="w-5 h-5 text-purple-500" />
                    <h3 className={`text-md font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Public Health Advisories
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {advisories.map((advisory, idx) => (
                        <div key={idx} className={`p-4 rounded-lg border ${advisory.severity === 'CRITICAL'
                            ? darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
                            : advisory.severity === 'WARNING'
                                ? darkMode ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'
                                : darkMode ? 'bg-slate-800 border-slate-700' : 'bg-blue-50 border-blue-200'
                            }`}>
                            <div className="flex items-start gap-2 mb-2">
                                <AlertTriangle className={`w-4 h-4 mt-0.5 ${advisory.severity === 'CRITICAL' ? 'text-red-500' :
                                    advisory.severity === 'WARNING' ? 'text-yellow-500' :
                                        'text-blue-500'
                                    }`} />
                                <div className="flex-1">
                                    <h4 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {advisory.title}
                                    </h4>
                                    <span className={`text-xs px-2 py-0.5 rounded ${advisory.channel === 'SMS' ? 'bg-green-100 text-green-700' :
                                        advisory.channel === 'SOCIAL_MEDIA' ? 'bg-purple-100 text-purple-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                        {advisory.channel}
                                    </span>
                                </div>
                            </div>
                            <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                {advisory.message}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
