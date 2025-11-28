import React, { useState } from 'react';
import { useSimulationStore } from '../store';
import { AlertTriangle, Users, Package, Clock, ArrowRight, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { api } from '../services/api';
import { AdvisoryModal } from './AdvisoryModal';
import type { Recommendation } from '../types';

export const RiskDashboard: React.FC = () => {
  const { stats, recommendations, activeEvent } = useSimulationStore();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedAdvisory, setSelectedAdvisory] = useState<Recommendation | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = async (rec: Recommendation) => {
    if (!rec.actionLabel) return;

    if (rec.category === 'ADVISORY') {
      setSelectedAdvisory(rec);
      return;
    }

    setProcessingId(rec.id);

    try {
      let result;
      if (rec.category === 'STAFFING') {
        result = await api.deployStaff('Emergency', 5); // Mock params
      } else if (rec.category === 'SUPPLIES') {
        result = await api.orderSupplies('Burn Kits', 50, 'URGENT'); // Mock params
      } else {
        // Default action
        await new Promise(resolve => setTimeout(resolve, 1000));
        result = { success: true };
      }

      if (result.success) {
        showToast('Action executed successfully', 'success');
      } else {
        showToast(result.error || 'Action failed', 'error');
      }
    } catch (err) {
      showToast('System error occurred', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const metrics = [
    { label: 'Occupancy', value: `${stats.occupancy}%`, icon: Users, color: stats.occupancy > 80 ? 'text-red-400' : 'text-blue-400' },
    { label: 'Staffing', value: `${stats.staffingLevel}%`, icon: AlertTriangle, color: stats.staffingLevel < 75 ? 'text-amber-400' : 'text-emerald-400' },
    { label: 'Supplies', value: `${stats.supplies}%`, icon: Package, color: stats.supplies < 50 ? 'text-red-400' : 'text-blue-400' },
    { label: 'Wait Time', value: `${stats.waitingTime}m`, icon: Clock, color: stats.waitingTime > 45 ? 'text-red-400' : 'text-slate-400' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
      <AdvisoryModal
        isOpen={!!selectedAdvisory}
        onClose={() => setSelectedAdvisory(null)}
        recommendation={selectedAdvisory}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={clsx(
              "absolute top-0 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium",
              toast.type === 'success' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            )}
          >
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metrics Panel */}
      <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">{m.label}</p>
              <p className={clsx("text-2xl font-bold", m.color)}>{m.value}</p>
            </div>
            <div className={clsx("p-3 rounded-lg bg-slate-800/50", m.color)}>
              <m.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations Panel */}
      <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          AI Recommendations
        </h2>

        <div className="space-y-4">
          {recommendations.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              System monitoring normal. No active alerts.
            </div>
          ) : (
            recommendations.map((rec) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={clsx(
                  "p-4 rounded-lg border flex flex-col md:flex-row gap-4 items-start md:items-center justify-between",
                  rec.priority === 'CRITICAL' ? "bg-red-500/10 border-red-500/30" :
                    rec.priority === 'HIGH' ? "bg-amber-500/10 border-amber-500/30" :
                      "bg-blue-500/10 border-blue-500/30"
                )}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={clsx(
                      "text-xs font-bold px-2 py-0.5 rounded",
                      rec.priority === 'CRITICAL' ? "bg-red-500 text-white" :
                        rec.priority === 'HIGH' ? "bg-amber-500 text-black" :
                          "bg-blue-500 text-white"
                    )}>
                      {rec.priority}
                    </span>
                    <span className="text-xs text-slate-400 uppercase tracking-wider">{rec.category}</span>
                  </div>
                  <h3 className="font-medium text-slate-200">{rec.title}</h3>
                  <p className="text-sm text-slate-400">{rec.description}</p>
                </div>

                {rec.actionLabel && (
                  <button
                    onClick={() => handleAction(rec)}
                    disabled={processingId === rec.id}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingId === rec.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {rec.actionLabel}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Active Scenario Info */}
      <div className="lg:col-span-1 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <h2 className="text-lg font-semibold text-slate-200 mb-4">Current Scenario</h2>

        {activeEvent ? (
          <div className="space-y-4 relative z-10">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Event Name</div>
              <div className="text-xl font-bold text-white">{activeEvent.name}</div>
            </div>

            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Severity</div>
              <div className={clsx(
                "inline-block px-3 py-1 rounded-full text-sm font-bold",
                activeEvent.severity === 'CRITICAL' ? "bg-red-500/20 text-red-400" :
                  activeEvent.severity === 'HIGH' ? "bg-amber-500/20 text-amber-400" :
                    "bg-blue-500/20 text-blue-400"
              )}>
                {activeEvent.severity}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Impact Analysis</div>
              <p className="text-sm text-slate-400 leading-relaxed">
                {activeEvent.description}
              </p>
            </div>

            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Affected Departments</div>
              <div className="flex flex-wrap gap-2">
                {activeEvent.affectedDepartments.map(dept => (
                  <span key={dept} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <p>System Idle</p>
          </div>
        )}
      </div>
    </div>
  );
};
