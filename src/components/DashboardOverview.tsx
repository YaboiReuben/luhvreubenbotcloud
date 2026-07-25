import React, { useState, useEffect } from 'react';
import {
  Server,
  Users,
  Zap,
  Clock,
  Cpu,
  HardDrive,
  Activity,
  Shield,
  Sliders,
  RefreshCw,
  Search,
  ChevronRight,
  ExternalLink,
  Power,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Radio,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ServerItem, BotSettings, SystemMetric } from '../types';

interface DashboardOverviewProps {
  servers: ServerItem[];
  settings: BotSettings;
  onUpdateSettings: (newSettings: Partial<BotSettings>) => void;
  metricsHistory: SystemMetric[];
  onTriggerPingTest: () => void;
  commandsExecutedCount: number;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  servers,
  settings,
  onUpdateSettings,
  metricsHistory,
  onTriggerPingTest,
  commandsExecutedCount,
}) => {
  const [serverSearch, setServerSearch] = useState('');
  const [uptimeSeconds, setUptimeSeconds] = useState(1239740); // ~14 days
  const [pingResult, setPingResult] = useState<number | null>(null);
  const [pingTesting, setPingTesting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Live Uptime counter increment
  useEffect(() => {
    const timer = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (totalSec: number) => {
    const days = Math.floor(totalSec / (3600 * 24));
    const hours = Math.floor((totalSec % (3600 * 24)) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${days}d ${hours}h ${mins}m ${secs}s`;
  };

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handlePing = () => {
    setPingTesting(true);
    onTriggerPingTest();
    setTimeout(() => {
      const generatedPing = Math.floor(18 + Math.random() * 12);
      setPingResult(generatedPing);
      setPingTesting(false);
      showNotification(`Ping benchmark completed: ${generatedPing}ms (Gateway WebSocket)`);
    }, 800);
  };

  const filteredServers = servers.filter((s) =>
    s.name.toLowerCase().includes(serverSearch.toLowerCase()) ||
    s.owner.toLowerCase().includes(serverSearch.toLowerCase())
  );

  const totalMembers = servers.reduce((acc, s) => acc + s.memberCount, 0);

  const latestMetric = metricsHistory[metricsHistory.length - 1] || {
    cpu: 18,
    memory: 210,
    ping: 22,
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#5865f2] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Maintenance Alert Bar if enabled */}
      {settings.maintenanceMode && (
        <div className="flex items-center justify-between bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 text-amber-200 text-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">Maintenance Mode Active:</span> Command processing is paused for non-admin users across all guilds.
            </div>
          </div>
          <button
            onClick={() => {
              onUpdateSettings({ maintenanceMode: false });
              showNotification('Maintenance mode deactivated.');
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all text-[11px]"
          >
            Turn Off
          </button>
        </div>
      )}

      {/* Bento Grid Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Connected Servers */}
        <div className="bg-[#18181b] border border-[#27272a] hover:border-[#5865f2]/40 transition-colors rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#a1a1aa] uppercase tracking-wider">Connected Servers</p>
            <p className="text-2xl font-black text-[#fafafa] mt-1">{servers.length}</p>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <span>+3 new guilds this week</span>
            </p>
          </div>
          <div className="p-3 bg-[#5865f2]/10 border border-[#5865f2]/30 rounded-xl text-[#5865f2]">
            <Server className="w-6 h-6" />
          </div>
        </div>

        {/* Total Members */}
        <div className="bg-[#18181b] border border-[#27272a] hover:border-purple-500/40 transition-colors rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#a1a1aa] uppercase tracking-wider">Total Members</p>
            <p className="text-2xl font-black text-[#fafafa] mt-1">{totalMembers.toLocaleString()}</p>
            <p className="text-[11px] text-[#5865f2] flex items-center gap-1 mt-1 font-medium">
              <span>across all channels</span>
            </p>
          </div>
          <div className="p-3 bg-purple-950/40 border border-purple-800/40 rounded-xl text-purple-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Commands Today */}
        <div className="bg-[#18181b] border border-[#27272a] hover:border-emerald-500/40 transition-colors rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#a1a1aa] uppercase tracking-wider">Commands Today</p>
            <p className="text-2xl font-black text-[#fafafa] mt-1">{commandsExecutedCount.toLocaleString()}</p>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <span>99.8% execution success</span>
            </p>
          </div>
          <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-emerald-400">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        {/* System Uptime */}
        <div className="bg-[#18181b] border border-[#27272a] hover:border-amber-500/40 transition-colors rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#a1a1aa] uppercase tracking-wider">System Uptime</p>
            <p className="text-lg font-black text-[#fafafa] mt-1 tracking-tight font-mono">{formatUptime(uptimeSeconds)}</p>
            <p className="text-[11px] text-[#5865f2] flex items-center gap-1 mt-1 font-medium">
              <span>Shard #0 Active</span>
            </p>
          </div>
          <div className="p-3 bg-amber-950/40 border border-amber-800/40 rounded-xl text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Bento Row: Chart + Quick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-time System Metrics Chart */}
        <div className="lg:col-span-2 bg-[#18181b] border border-[#27272a] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#fafafa] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#5865f2]" />
                Live Resource & Telemetry Monitor
              </h3>
              <p className="text-xs text-[#a1a1aa] mt-0.5">CPU load %, RAM usage (MB), and WebSocket Ping history</p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-[#5865f2] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5865f2]" /> CPU: {latestMetric.cpu}%
              </span>
              <span className="flex items-center gap-1.5 text-purple-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> RAM: {latestMetric.memory} MB
              </span>
            </div>
          </div>

          {/* Recharts Area Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metricsHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5865f2" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#5865f2" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="time" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    borderColor: '#27272a',
                    borderRadius: '0.75rem',
                    color: '#fafafa',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cpu"
                  name="CPU Load (%)"
                  stroke="#5865f2"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#cpuGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="memory"
                  name="RAM Usage (MB)"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#memGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick System Controls Panel */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#fafafa] flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-purple-400" />
              Quick Bot Controls
            </h3>
            <p className="text-xs text-[#a1a1aa]">Toggle operational modes and triggers</p>
          </div>

          <div className="space-y-3 text-xs">
            {/* Maintenance Mode Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#09090b] border border-[#27272a]">
              <div>
                <p className="font-semibold text-[#fafafa]">Maintenance Mode</p>
                <p className="text-[11px] text-[#a1a1aa]">Pause response to non-admin commands</p>
              </div>
              <button
                onClick={() => {
                  const nextState = !settings.maintenanceMode;
                  onUpdateSettings({ maintenanceMode: nextState });
                  showNotification(`Maintenance mode ${nextState ? 'enabled' : 'disabled'}`);
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.maintenanceMode ? 'bg-amber-500' : 'bg-[#27272a]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* AutoMod Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#09090b] border border-[#27272a]">
              <div>
                <p className="font-semibold text-[#fafafa]">AutoMod Filter</p>
                <p className="text-[11px] text-[#a1a1aa]">Spam & phishing link protection</p>
              </div>
              <button
                onClick={() => {
                  const nextState = !settings.autoModEnabled;
                  onUpdateSettings({ autoModEnabled: nextState });
                  showNotification(`AutoMod protection ${nextState ? 'enabled' : 'disabled'}`);
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoModEnabled ? 'bg-[#5865f2]' : 'bg-[#27272a]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoModEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Ping Benchmark Button */}
            <div className="p-3 rounded-xl bg-[#09090b] border border-[#27272a] flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#fafafa]">Ping Test</p>
                <p className="text-[11px] text-[#a1a1aa]">
                  {pingResult !== null ? `Last result: ${pingResult} ms` : 'Measure API latency'}
                </p>
              </div>
              <button
                onClick={handlePing}
                disabled={pingTesting}
                className="px-3 py-1.5 rounded-lg bg-[#5865f2] hover:bg-[#5865f2]/90 text-white font-semibold text-[11px] flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${pingTesting ? 'animate-spin' : ''}`} />
                <span>{pingTesting ? 'Testing...' : 'Run Test'}</span>
              </button>
            </div>

            {/* Flush Cache Button */}
            <button
              onClick={() => showNotification('Guild memory cache flushed successfully (142 guilds re-indexed)')}
              className="w-full py-2.5 px-3 rounded-xl bg-[#09090b] hover:bg-[#27272a] text-[#fafafa] font-semibold text-xs border border-[#27272a] flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5 text-[#5865f2]" />
              <span>Flush Guild Cache</span>
            </button>
          </div>
        </div>
      </div>

      {/* Connected Servers / Guilds List Bento Panel */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#fafafa] flex items-center gap-2">
              <Server className="w-4 h-4 text-[#5865f2]" />
              Connected Discord Guilds ({filteredServers.length})
            </h3>
            <p className="text-xs text-[#a1a1aa] mt-0.5">Active servers running NexusBot</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by server or owner..."
              value={serverSearch}
              onChange={(e) => setServerSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#09090b] border border-[#27272a] rounded-xl text-xs text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#5865f2]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#fafafa]">
            <thead>
              <tr className="border-b border-[#27272a] text-[#a1a1aa] uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-bold">Server Name</th>
                <th className="py-3 px-4 font-bold">Members</th>
                <th className="py-3 px-4 font-bold">Channels</th>
                <th className="py-3 px-4 font-bold">Guild Owner</th>
                <th className="py-3 px-4 font-bold">Region</th>
                <th className="py-3 px-4 font-bold text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]/60">
              {filteredServers.map((srv) => (
                <tr key={srv.id} className="hover:bg-[#27272a]/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#fafafa] flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#09090b] border border-[#27272a] flex items-center justify-center text-base shadow-sm">
                      {srv.icon}
                    </span>
                    <div>
                      <div>{srv.name}</div>
                      <div className="text-[10px] text-[#71717a] font-normal">ID: {srv.id}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-[#fafafa]">
                    {srv.memberCount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-[#a1a1aa]">{srv.channelsCount} channels</td>
                  <td className="py-3 px-4 font-mono text-[#5865f2]">{srv.owner}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-[#09090b] text-[#a1a1aa] font-mono text-[10px] border border-[#27272a]">
                      {srv.region}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#71717a] text-right font-mono">{srv.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
