
import { Layout } from './components/Layout';
import { AgentMonitor } from './components/AgentMonitor';
import { RiskDashboard } from './components/RiskDashboard';
import { ScenarioController } from './components/ScenarioController';
import { ParticleBackground } from './components/ParticleBackground';
import { LiveMap } from './components/LiveMap';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';

function App() {
  return (
    <>
      <ParticleBackground />
      <Layout>
        <div className="space-y-6 relative z-10">
          {/* Top Section: Controls and Dashboard */}
          <section>
            <ScenarioController />
            <RiskDashboard />
          </section>

          {/* Middle Section: Live Map & Analytics */}
          <section className="grid grid-cols-1 gap-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live Satellite Feed
              </h2>
              <LiveMap />
            </div>

            <AnalyticsDashboard />
          </section>

          {/* Bottom Section: Agent Monitor */}
          <section>
            <AgentMonitor />
          </section>
        </div>
      </Layout>
    </>
  );
}

export default App;
