import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useSimulationStore } from '../store';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const AnalyticsDashboard: React.FC = () => {
    const { stats, activeEvent } = useSimulationStore();

    // Mock historical data for charts
    const data = [
        { name: '00:00', occupancy: 45, staffing: 80 },
        { name: '04:00', occupancy: 50, staffing: 80 },
        { name: '08:00', occupancy: 65, staffing: 85 },
        { name: '12:00', occupancy: 75, staffing: 90 },
        { name: '16:00', occupancy: 85, staffing: 90 },
        { name: '20:00', occupancy: stats.occupancy, staffing: stats.staffingLevel },
    ];

    const generateReport = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text("Monthly Safety & Operations Report", 14, 22);

        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

        // Executive Summary
        doc.setFontSize(14);
        doc.text("Executive Summary", 14, 45);
        doc.setFontSize(10);
        doc.text(`Current System Status: ${activeEvent ? activeEvent.severity : 'NORMAL'}`, 14, 55);
        doc.text(`Active Scenario: ${activeEvent ? activeEvent.name : 'Standard Operations'}`, 14, 60);
        doc.text(`Hospital Occupancy: ${stats.occupancy}%`, 14, 65);

        // Table
        autoTable(doc, {
            startY: 75,
            head: [['Metric', 'Current Value', 'Status']],
            body: [
                ['Occupancy', `${stats.occupancy}%`, stats.occupancy > 80 ? 'CRITICAL' : 'NORMAL'],
                ['Staffing Level', `${stats.staffingLevel}%`, stats.staffingLevel < 70 ? 'LOW' : 'ADEQUATE'],
                ['Supplies', `${stats.supplies}%`, stats.supplies < 50 ? 'LOW' : 'ADEQUATE'],
                ['Wait Time', `${stats.waitingTime} min`, stats.waitingTime > 45 ? 'HIGH' : 'NORMAL'],
            ],
            theme: 'grid',
            headStyles: { fillColor: [6, 182, 212] }
        });

        // Footer
        doc.setFontSize(8);
        doc.text("Predictive Hospital Management System // Confidential", 14, 280);

        doc.save("hospital_safety_report.pdf");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Occupancy Trend */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h3 className="text-slate-200 font-semibold mb-4">Occupancy Trends (24h)</h3>
                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                                itemStyle={{ color: '#e2e8f0' }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="occupancy" stroke="#06b6d4" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Staffing vs Demand */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-200 font-semibold">Staffing Efficiency</h3>
                    <button
                        onClick={generateReport}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700"
                    >
                        <Download className="w-3 h-3" />
                        Export PDF
                    </button>
                </div>
                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                                itemStyle={{ color: '#e2e8f0' }}
                            />
                            <Legend />
                            <Bar dataKey="staffing" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="occupancy" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
