import React, { useState } from 'react';
import { Bot, Lock, Server, Users, Activity, RefreshCw, Power, ShieldCheck, ChevronDown, Check } from 'lucide-react';
import { BotStatusState, BotSettings } from '../types';

interface NavbarProps {
  settings: BotSettings;
  botStatus: BotStatusState;
  onStatusChange: (status: BotStatusState) => void;
  onLock: () => void;
  onRestartBot: () => void;
  serverCount: number;
  totalUsersCount: number;
  pingMs: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  botStatus,
  onStatusChange,
  onLock,
  onRestartBot,
  serverCount,
  totalUsersCount,
  pingMs,
}) => {
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  const getStatusBadge = (status: BotStatusState) => {
    switch (status) {
      case 'online':
        return { color: 'bg-emerald-500', text: 'Online', border: 'border-emerald-500/30', bg: 'bg-emerald-950/40 text-emerald-300' };
      case 'idle':
        return { color: 'bg-amber-500', text: 'Idle', border: 'border-amber-500/30', bg: 'bg-amber-950/40 text-amber-300' };
      case 'dnd':
        return { color: 'bg-rose-500', text: 'Do Not Disturb', border: 'border-rose-500/30', bg: 'bg-rose-950/40 text-rose-300' };
      case 'offline':
        return { color: 'bg-slate-500', text: 'Offline', border: 'border-slate-500/30', bg: 'bg-slate-900 text-slate-400' };
    }
  };

  const statusConfig = getStatusBadge(botStatus);

  const handleRestart = () => {
    setIsRestarting(true);
    onRestartBot();
    setTimeout(() => {
      setIsRestarting(false);
    }, 1500);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#18181b]/90 backdrop-blur-md border-b border-[#27272a] px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Bot Logo, Name & Status Switcher */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <img
              src={settings.botAvatar}
              alt={settings.botName}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#5865f2]/40 group-hover:ring-[#5865f2] transition-all shadow-md"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-[#18181b] ${statusConfig.color}`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base text-[#fafafa] flex items-center gap-1.5">
                {settings.botName}
                <span className="text-xs font-semibold text-[#5865f2] bg-[#5865f2]/10 border border-[#5865f2]/30 px-2 py-0.5 rounded-md font-mono">
                  {settings.botTag}
                </span>
              </h1>
            </div>

            {/* Status Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusConfig.bg} ${statusConfig.border} hover:opacity-90 transition-opacity mt-0.5`}
              >
                <span className={`w-2 h-2 rounded-full ${statusConfig.color} animate-pulse`} />
                <span>Bot Status: {statusConfig.text}</span>
                <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
              </button>

              {statusDropdownOpen && (
                <div
                  className="absolute left-0 mt-1.5 w-44 bg-[#18181b] border border-[#27272a] rounded-xl shadow-2xl py-1 z-50 text-xs text-[#fafafa]"
                  onMouseLeave={() => setStatusDropdownOpen(false)}
                >
                  {(['online', 'idle', 'dnd', 'offline'] as BotStatusState[]).map((st) => {
                    const cfg = getStatusBadge(st);
                    return (
                      <button
                        key={st}
                        onClick={() => {
                          onStatusChange(st);
                          setStatusDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#27272a] transition-colors text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${cfg.color}`} />
                          <span className="capitalize">{cfg.text}</span>
                        </div>
                        {botStatus === st && <Check className="w-3.5 h-3.5 text-[#5865f2]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center: Live Stats Badges */}
        <div className="hidden lg:flex items-center gap-6 px-4 py-2 rounded-xl bg-[#09090b] border border-[#27272a] text-xs">
          <div className="flex items-center gap-2 text-[#fafafa]">
            <Server className="w-4 h-4 text-[#5865f2] shrink-0" />
            <div>
              <div className="font-bold">{serverCount}</div>
              <div className="text-[10px] text-[#a1a1aa] uppercase font-bold tracking-wider">Servers</div>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-[#27272a]" />

          <div className="flex items-center gap-2 text-[#fafafa]">
            <Users className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <div className="font-bold">{totalUsersCount.toLocaleString()}</div>
              <div className="text-[10px] text-[#a1a1aa] uppercase font-bold tracking-wider">Members</div>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-[#27272a]" />

          <div className="flex items-center gap-2 text-[#fafafa]">
            <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold">{pingMs} ms</div>
              <div className="text-[10px] text-[#a1a1aa] uppercase font-bold tracking-wider">Ping</div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Restart Bot */}
          <button
            onClick={handleRestart}
            disabled={isRestarting}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-[#09090b] hover:bg-[#27272a] text-[#fafafa] border border-[#27272a] transition-all active:scale-95 disabled:opacity-50"
            title="Restart Bot Instance"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#5865f2] ${isRestarting ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isRestarting ? 'Restarting...' : 'Restart'}</span>
          </button>

          {/* Lock / Sign Out */}
          <button
            onClick={onLock}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-rose-600/15 hover:bg-rose-600/25 text-rose-300 border border-rose-500/30 transition-all active:scale-95 shadow-sm"
            title="Lock Dashboard & Require PIN"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Session</span>
          </button>
        </div>

      </div>
    </header>
  );
};
