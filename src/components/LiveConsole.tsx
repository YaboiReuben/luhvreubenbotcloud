import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Search,
  Trash2,
  Download,
  Play,
  Copy,
  Check,
  Radio,
  ArrowDownCircle,
  AlertTriangle,
  Info,
  Zap,
  CheckCircle2,
  Bug,
} from 'lucide-react';
import { LogItem, LogLevel } from '../types';

interface LiveConsoleProps {
  logs: LogItem[];
  onClearLogs: () => void;
  onAddLog: (newLog: LogItem) => void;
}

export const LiveConsole: React.FC<LiveConsoleProps> = ({ logs, onClearLogs, onAddLog }) => {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive if enabled
  useEffect(() => {
    if (autoScroll && consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel;
    const matchesQuery =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesQuery;
  });

  const getLevelBadgeStyle = (level: LogLevel) => {
    switch (level) {
      case 'INFO':
        return 'bg-blue-950 text-blue-300 border-blue-800/50';
      case 'WARN':
        return 'bg-amber-950 text-amber-300 border-amber-800/50';
      case 'ERROR':
        return 'bg-rose-950 text-rose-300 border-rose-800/50 animate-pulse';
      case 'COMMAND':
        return 'bg-purple-950 text-purple-300 border-purple-800/50';
      case 'SUCCESS':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800/50';
    }
  };

  const handleSimulateLog = (type: 'cmd' | 'warn' | 'error' | 'heartbeat') => {
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0];

    let log: LogItem;
    if (type === 'cmd') {
      const cmds = ['/play', '/ban', '/purge', '/daily', '/userinfo'];
      const cmd = cmds[Math.floor(Math.random() * cmds.length)];
      log = {
        id: `log-${Date.now()}`,
        timestamp,
        level: 'COMMAND',
        category: 'GATEWAY',
        message: `Guild "Cyberpunk Syndicate" user @Gamer${Math.floor(Math.random() * 999)} triggered ${cmd}`,
      };
    } else if (type === 'warn') {
      log = {
        id: `log-${Date.now()}`,
        timestamp,
        level: 'WARN',
        category: 'RATE_LIMIT',
        message: `Discord Gateway API bucket rate limit threshold reached (48/50 requests in 10s)`,
      };
    } else if (type === 'error') {
      log = {
        id: `log-${Date.now()}`,
        timestamp,
        level: 'ERROR',
        category: 'AUDIO_STREAM',
        message: `FFmpeg process exited with status 1: Voice socket connection timeout in voice channel #402`,
      };
    } else {
      log = {
        id: `log-${Date.now()}`,
        timestamp,
        level: 'INFO',
        category: 'HEARTBEAT',
        message: `WebSocket Heartbeat ACK received (latency: ${Math.floor(18 + Math.random() * 10)}ms)`,
      };
    }

    onAddLog(log);
  };

  const handleCopyLogs = () => {
    const logText = logs
      .map((l) => `[${l.timestamp}] [${l.level}] [${l.category}] ${l.message}`)
      .join('\n');
    navigator.clipboard.writeText(logText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadLogs = () => {
    const logText = logs
      .map((l) => `[${l.timestamp}] [${l.level}] [${l.category}] ${l.message}`)
      .join('\n');
    const blob = new Blob([logText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexusbot-console-${Date.now()}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#fafafa] flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#5865f2]" />
            Live Bot Event Console Logs
          </h2>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Streaming real-time execution logs, Gateway heartbeats, and exception traces.
          </p>
        </div>

        {/* Quick Simulator Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[10px] text-[#71717a] uppercase font-bold mr-1">Simulate Log:</span>
          <button
            onClick={() => handleSimulateLog('cmd')}
            className="px-2.5 py-1 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-purple-300 border border-purple-800/40 text-[11px] font-medium"
          >
            + Command
          </button>
          <button
            onClick={() => handleSimulateLog('warn')}
            className="px-2.5 py-1 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-amber-300 border border-amber-800/40 text-[11px] font-medium"
          >
            + Warning
          </button>
          <button
            onClick={() => handleSimulateLog('error')}
            className="px-2.5 py-1 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-rose-300 border border-rose-800/40 text-[11px] font-medium"
          >
            + Error
          </button>
          <button
            onClick={() => handleSimulateLog('heartbeat')}
            className="px-2.5 py-1 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-[#5865f2] border border-[#5865f2]/40 text-[11px] font-medium"
          >
            + Heartbeat
          </button>
        </div>
      </div>

      {/* Terminal Filter Toolbar Bento Box */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#18181b] border border-[#27272a] p-3 rounded-2xl shadow-sm">
        {/* Level Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {['ALL', 'INFO', 'COMMAND', 'WARN', 'ERROR', 'SUCCESS'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                filterLevel === lvl
                  ? 'bg-[#5865f2] text-white shadow-sm'
                  : 'bg-[#09090b] hover:bg-[#27272a] text-[#a1a1aa] border border-[#27272a]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-[#71717a] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2 py-1 bg-[#09090b] border border-[#27272a] rounded-lg text-xs text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#5865f2] font-mono"
            />
          </div>

          <label className="flex items-center gap-1.5 text-xs text-[#a1a1aa] cursor-pointer select-none px-2 py-1 bg-[#09090b] border border-[#27272a] rounded-lg">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded bg-[#18181b] border-[#27272a] text-[#5865f2] focus:ring-0"
            />
            <span className="text-[11px]">Auto-scroll</span>
          </label>

          <button
            onClick={handleCopyLogs}
            className="p-1.5 rounded-lg bg-[#09090b] hover:bg-[#27272a] text-[#fafafa] border border-[#27272a] transition-colors"
            title="Copy Logs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleDownloadLogs}
            className="p-1.5 rounded-lg bg-[#09090b] hover:bg-[#27272a] text-[#fafafa] border border-[#27272a] transition-colors"
            title="Download .log File"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClearLogs}
            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition-colors"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dark Console Terminal Box */}
      <div className="bg-[#09090b] border border-[#27272a] rounded-2xl shadow-xl p-4 font-mono text-xs h-[450px] overflow-y-auto relative flex flex-col justify-between">
        {/* Terminal Header Bar */}
        <div className="sticky top-0 -mt-4 -mx-4 mb-3 px-4 py-2 bg-[#18181b] border-b border-[#27272a] flex items-center justify-between text-[11px] text-[#a1a1aa] z-10">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="font-semibold text-[#fafafa] ml-2">stdout / nexusbot.log</span>
          </div>
          <span className="text-[10px] text-[#71717a]">{filteredLogs.length} entries displayed</span>
        </div>

        {/* Log Entries */}
        <div className="space-y-1.5 flex-1">
          {filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 hover:bg-[#18181b] p-1 rounded transition-colors group">
              <span className="text-[#71717a] shrink-0 select-none text-[11px]">{log.timestamp}</span>
              
              <span
                className={`px-1.5 py-0.2 rounded border text-[10px] font-bold shrink-0 ${getLevelBadgeStyle(
                  log.level
                )}`}
              >
                {log.level}
              </span>

              <span className="text-[#5865f2] font-bold shrink-0 text-[11px]">[{log.category}]</span>

              <span className="text-[#fafafa] leading-relaxed break-all flex-1">{log.message}</span>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="h-full flex items-center justify-center text-[#71717a] italic py-20">
              No console logs match the selected filter query.
            </div>
          )}

          <div ref={consoleEndRef} />
        </div>
      </div>
    </div>
  );
};
