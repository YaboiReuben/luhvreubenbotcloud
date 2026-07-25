import React, { useState, useEffect } from 'react';
import { PinScreen } from './components/PinScreen';
import { Navbar } from './components/Navbar';
import { Sidebar, TabType } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { CommandsList } from './components/CommandsList';
import { LiveConsole } from './components/LiveConsole';
import { InviteAndSettings } from './components/InviteAndSettings';
import { BroadcastModal } from './components/BroadcastModal';

import {
  INITIAL_SETTINGS,
  INITIAL_COMMANDS,
  INITIAL_SERVERS,
  INITIAL_LOGS,
  INITIAL_METRICS,
} from './data/initialData';

import {
  BotStatusState,
  BotSettings,
  CommandItem,
  ServerItem,
  LogItem,
  SystemMetric,
} from './types';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('discord_bot_pin_authed') === 'true';
  });

  // Settings State (with custom PIN override)
  const [settings, setSettings] = useState<BotSettings>(() => {
    const saved = localStorage.getItem('discord_bot_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse settings from localStorage', e);
      }
    }
    return INITIAL_SETTINGS;
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Bot Status
  const [botStatus, setBotStatus] = useState<BotStatusState>('online');

  // Commands List State
  const [commands, setCommands] = useState<CommandItem[]>(() => {
    const saved = localStorage.getItem('discord_bot_commands');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse commands', e);
      }
    }
    return INITIAL_COMMANDS;
  });

  // Guild Servers State
  const [servers] = useState<ServerItem[]>(INITIAL_SERVERS);

  // Console Logs State
  const [logs, setLogs] = useState<LogItem[]>(INITIAL_LOGS);

  // Live Metrics Telemetry History
  const [metricsHistory, setMetricsHistory] = useState<SystemMetric[]>(INITIAL_METRICS);

  // Commands executed counter
  const [commandsExecutedCount, setCommandsExecutedCount] = useState<number>(14820);

  // Broadcast modal state
  const [showBroadcastModal, setShowBroadcastModal] = useState<boolean>(false);

  // Unread errors counter
  const unreadErrorsCount = logs.filter((l) => l.level === 'ERROR').length;

  // Persist settings
  useEffect(() => {
    localStorage.setItem('discord_bot_settings', JSON.stringify(settings));
  }, [settings]);

  // Persist commands
  useEffect(() => {
    localStorage.setItem('discord_bot_commands', JSON.stringify(commands));
  }, [commands]);

  // Live Heartbeat Simulation (updates metrics & periodic random logs)
  useEffect(() => {
    if (!isAuthenticated || botStatus === 'offline') return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      // Add metric point
      const newCpu = Math.max(8, Math.min(65, Math.floor(15 + Math.random() * 20)));
      const newMem = Math.max(160, Math.min(420, Math.floor(190 + Math.random() * 30)));
      const newPing = Math.max(12, Math.min(50, Math.floor(18 + Math.random() * 10)));

      setMetricsHistory((prev) => [
        ...prev.slice(1),
        { time: timeStr, cpu: newCpu, memory: newMem, ping: newPing },
      ]);

      // Random command execution event
      if (Math.random() > 0.4) {
        setCommandsExecutedCount((prev) => prev + 1);

        const sampleCommands = ['/play', '/rank', '/daily', '/userinfo', '/purge', '/skip'];
        const randomCmd = sampleCommands[Math.floor(Math.random() * sampleCommands.length)];
        const randomGuild = servers[Math.floor(Math.random() * servers.length)].name;

        const newLog: LogItem = {
          id: `log-auto-${Date.now()}`,
          timestamp: timeStr,
          level: 'COMMAND',
          category: 'GATEWAY',
          message: `Executed ${randomCmd} in "${randomGuild}"`,
        };

        setLogs((prev) => [...prev.slice(-99), newLog]);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isAuthenticated, botStatus, servers]);

  // Authentication Handlers
  const handlePinSuccess = () => {
    localStorage.setItem('discord_bot_pin_authed', 'true');
    setIsAuthenticated(true);
  };

  const handleLockSession = () => {
    localStorage.removeItem('discord_bot_pin_authed');
    setIsAuthenticated(false);
  };

  // Commands Handlers
  const handleToggleCommand = (id: string) => {
    setCommands((prev) =>
      prev.map((cmd) => (cmd.id === id ? { ...cmd, enabled: !cmd.enabled } : cmd))
    );
  };

  const handleAddCommand = (newCmd: CommandItem) => {
    setCommands((prev) => [newCmd, ...prev]);
  };

  const handleDeleteCommand = (id: string) => {
    setCommands((prev) => prev.filter((cmd) => cmd.id !== id));
  };

  // Settings Update
  const handleUpdateSettings = (updated: Partial<BotSettings>) => {
    setSettings((prev) => ({ ...prev, ...updated }));
  };

  // Log Handlers
  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleAddLog = (newLog: LogItem) => {
    setLogs((prev) => [...prev, newLog]);
  };

  // Restart Bot Handler
  const handleRestartBot = () => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    setLogs((prev) => [
      ...prev,
      {
        id: `log-restart-${Date.now()}`,
        timestamp: timeStr,
        level: 'WARN',
        category: 'SYSTEM',
        message: 'Bot instance restart signal received. Flushing memory buffers...',
      },
      {
        id: `log-restart-ok-${Date.now()}`,
        timestamp: timeStr,
        level: 'SUCCESS',
        category: 'GATEWAY',
        message: 'Re-connected to Discord Gateway shard #0. All 142 guilds ready.',
      },
    ]);
  };

  // Calculate overall metrics
  const totalUsersCount = servers.reduce((acc, s) => acc + s.memberCount, 0);
  const currentPing = metricsHistory[metricsHistory.length - 1]?.ping || 22;

  // Render PIN security screen if locked
  if (!isAuthenticated) {
    return <PinScreen correctPin={settings.currentPin} onSuccess={handlePinSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col font-sans selection:bg-[#5865f2] selection:text-white">
      {/* Top Navigation Header */}
      <Navbar
        settings={settings}
        botStatus={botStatus}
        onStatusChange={setBotStatus}
        onLock={handleLockSession}
        onRestartBot={handleRestartBot}
        serverCount={servers.length}
        totalUsersCount={totalUsersCount}
        pingMs={currentPing}
      />

      {/* Main Body with Sidebar + Tab View */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadErrorsCount={unreadErrorsCount}
          onOpenBroadcastModal={() => setShowBroadcastModal(true)}
        />

        {/* Tab Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          {activeTab === 'overview' && (
            <DashboardOverview
              servers={servers}
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              metricsHistory={metricsHistory}
              onTriggerPingTest={handleRestartBot}
              commandsExecutedCount={commandsExecutedCount}
            />
          )}

          {activeTab === 'commands' && (
            <CommandsList
              commands={commands}
              onToggleCommand={handleToggleCommand}
              onAddCommand={handleAddCommand}
              onDeleteCommand={handleDeleteCommand}
            />
          )}

          {activeTab === 'console' && (
            <LiveConsole logs={logs} onClearLogs={handleClearLogs} onAddLog={handleAddLog} />
          )}

          {activeTab === 'settings' && (
            <InviteAndSettings settings={settings} onSaveSettings={handleUpdateSettings} />
          )}
        </main>
      </div>

      {/* Global Broadcast Announcement Modal */}
      {showBroadcastModal && (
        <BroadcastModal
          serverCount={servers.length}
          onClose={() => setShowBroadcastModal(false)}
          onBroadcastSuccess={(msg) => {
            const timeStr = new Date().toTimeString().split(' ')[0];
            handleAddLog({
              id: `log-bcast-${Date.now()}`,
              timestamp: timeStr,
              level: 'SUCCESS',
              category: 'BROADCAST',
              message: msg,
            });
          }}
        />
      )}
    </div>
  );
}
