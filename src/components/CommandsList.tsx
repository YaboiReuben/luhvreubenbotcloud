import React, { useState } from 'react';
import {
  Terminal,
  Search,
  Plus,
  SlidersHorizontal,
  Check,
  X,
  Shield,
  Zap,
  Info,
  Edit2,
  Trash2,
  Lock,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { CommandItem, CommandCategory } from '../types';

interface CommandsListProps {
  commands: CommandItem[];
  onToggleCommand: (id: string) => void;
  onAddCommand: (newCmd: CommandItem) => void;
  onDeleteCommand: (id: string) => void;
}

export const CommandsList: React.FC<CommandsListProps> = ({
  commands,
  onToggleCommand,
  onAddCommand,
  onDeleteCommand,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCmd, setSelectedCmd] = useState<CommandItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Command Form State
  const [newCmdName, setNewCmdName] = useState('');
  const [newCmdDesc, setNewCmdDesc] = useState('');
  const [newCmdCat, setNewCmdCat] = useState<CommandCategory>('Utility');
  const [newCmdCooldown, setNewCmdCooldown] = useState(3);
  const [newCmdPerms, setNewCmdPerms] = useState('');
  const [formError, setFormError] = useState('');

  const categories = ['All', 'Moderation', 'Music', 'Utility', 'Economy', 'Fun', 'Admin'];

  const filteredCommands = commands.filter((cmd) => {
    const matchesCategory = selectedCategory === 'All' || cmd.category === selectedCategory;
    const matchesSearch =
      cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCmdName.trim() || !newCmdDesc.trim()) {
      setFormError('Command trigger name and description are required.');
      return;
    }

    const formattedName = newCmdName.startsWith('/') ? newCmdName.trim() : `/${newCmdName.trim()}`;

    const created: CommandItem = {
      id: `cmd-custom-${Date.now()}`,
      name: formattedName,
      description: newCmdDesc.trim(),
      category: newCmdCat,
      enabled: true,
      cooldownSec: Number(newCmdCooldown) || 3,
      permissionsRequired: newCmdPerms
        ? newCmdPerms.split(',').map((p) => p.trim().toUpperCase()).filter(Boolean)
        : [],
      usageCount: 0,
      custom: true,
    };

    onAddCommand(created);
    setShowAddModal(false);
    setNewCmdName('');
    setNewCmdDesc('');
    setNewCmdCooldown(3);
    setNewCmdPerms('');
    setFormError('');
  };

  const getCategoryBadgeColor = (cat: CommandCategory) => {
    switch (cat) {
      case 'Moderation':
        return 'bg-rose-950/60 text-rose-300 border-rose-800/40';
      case 'Music':
        return 'bg-purple-950/60 text-purple-300 border-purple-800/40';
      case 'Utility':
        return 'bg-indigo-950/60 text-indigo-300 border-indigo-800/40';
      case 'Economy':
        return 'bg-amber-950/60 text-amber-300 border-amber-800/40';
      case 'Fun':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40';
      case 'Admin':
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#fafafa] flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#5865f2]" />
            Discord Bot Commands Library
          </h2>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Manage slash commands, permissions, cooldowns, and toggle active state.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5865f2] hover:bg-[#5865f2]/90 active:scale-95 text-white font-semibold text-xs shadow-md shadow-[#5865f2]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Command</span>
        </button>
      </div>

      {/* Filters & Search Row Bento Container */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#18181b] border border-[#27272a] p-4 rounded-2xl shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#5865f2] text-white shadow-sm'
                  : 'bg-[#09090b] hover:bg-[#27272a] text-[#a1a1aa] border border-[#27272a]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search command trigger or info..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-xs text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#5865f2]"
          />
        </div>
      </div>

      {/* Bento Grid Commands */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCommands.map((cmd) => (
          <div
            key={cmd.id}
            className={`group relative bg-[#18181b] border transition-all duration-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm ${
              cmd.enabled ? 'border-[#27272a] hover:border-[#5865f2]/40' : 'border-[#27272a]/50 opacity-60 bg-[#09090b]'
            }`}
          >
            <div>
              {/* Header: Name, Category Badge, Toggle Switch */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#5865f2] bg-[#5865f2]/10 border border-[#5865f2]/30 px-2.5 py-0.5 rounded-lg">
                    {cmd.name}
                  </span>
                  {cmd.custom && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/40">
                      CUSTOM
                    </span>
                  )}
                </div>

                {/* Enable / Disable Switch */}
                <button
                  onClick={() => onToggleCommand(cmd.id)}
                  title={cmd.enabled ? 'Click to disable command' : 'Click to enable command'}
                  className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                    cmd.enabled ? 'bg-emerald-500' : 'bg-[#27272a]'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      cmd.enabled ? 'translate-x-4' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-[#a1a1aa] line-clamp-2 mb-3 leading-relaxed">
                {cmd.description}
              </p>
            </div>

            {/* Footer Metadata */}
            <div className="pt-3 border-t border-[#27272a] flex items-center justify-between text-[11px] text-[#71717a]">
              <span className={`px-2 py-0.5 rounded-md border font-semibold ${getCategoryBadgeColor(cmd.category)}`}>
                {cmd.category}
              </span>

              <div className="flex items-center gap-3">
                <span title="Cooldown">{cmd.cooldownSec}s cooldown</span>
                <button
                  onClick={() => setSelectedCmd(cmd)}
                  className="hover:text-[#5865f2] transition-colors flex items-center gap-0.5 font-medium text-[#a1a1aa]"
                >
                  Details <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCommands.length === 0 && (
        <div className="p-12 text-center bg-[#18181b] border border-[#27272a] rounded-2xl">
          <HelpCircle className="w-8 h-8 text-[#71717a] mx-auto mb-2" />
          <p className="text-[#fafafa] font-semibold text-sm">No commands found</p>
          <p className="text-xs text-[#a1a1aa] mt-1">Try resetting search filters or create a custom command.</p>
        </div>
      )}

      {/* Command Details Modal */}
      {selectedCmd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#09090b]/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#18181b] border border-[#27272a] rounded-2xl p-6 shadow-2xl relative text-[#fafafa]">
            <button
              onClick={() => setSelectedCmd(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#09090b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#fafafa]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#5865f2]/10 border border-[#5865f2]/30 rounded-xl text-[#5865f2]">
                <Terminal className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-mono text-[#5865f2]">{selectedCmd.name}</h3>
                <p className="text-xs text-[#a1a1aa]">Category: {selectedCmd.category}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#09090b] p-3 rounded-xl border border-[#27272a]">
                <p className="font-bold text-[#a1a1aa] uppercase text-[10px] tracking-wider mb-1">
                  Description
                </p>
                <p className="text-[#fafafa] leading-relaxed">{selectedCmd.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#09090b] p-3 rounded-xl border border-[#27272a]">
                  <p className="font-bold text-[#a1a1aa] uppercase text-[10px] tracking-wider mb-1">
                    Execution Usage
                  </p>
                  <p className="text-base font-bold text-[#5865f2]">
                    {selectedCmd.usageCount.toLocaleString()} times
                  </p>
                </div>

                <div className="bg-[#09090b] p-3 rounded-xl border border-[#27272a]">
                  <p className="font-bold text-[#a1a1aa] uppercase text-[10px] tracking-wider mb-1">
                    Cooldown Duration
                  </p>
                  <p className="text-base font-bold text-purple-400">{selectedCmd.cooldownSec} Seconds</p>
                </div>
              </div>

              <div className="bg-[#09090b] p-3 rounded-xl border border-[#27272a]">
                <p className="font-bold text-[#a1a1aa] uppercase text-[10px] tracking-wider mb-2">
                  Permissions Required
                </p>
                {selectedCmd.permissionsRequired.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCmd.permissionsRequired.map((perm) => (
                      <span
                        key={perm}
                        className="px-2 py-1 rounded bg-[#18181b] text-[#fafafa] font-mono text-[10px] border border-[#27272a]"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#71717a] italic">No special guild permissions required (Public command)</p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#27272a] flex items-center justify-between">
              {selectedCmd.custom && (
                <button
                  onClick={() => {
                    onDeleteCommand(selectedCmd.id);
                    setSelectedCmd(null);
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Custom Command</span>
                </button>
              )}

              <button
                onClick={() => setSelectedCmd(null)}
                className="ml-auto px-4 py-2 rounded-xl bg-[#5865f2] hover:bg-[#5865f2]/90 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Custom Command Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#09090b]/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#18181b] border border-[#27272a] rounded-2xl p-6 shadow-2xl relative text-[#fafafa]">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#09090b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#fafafa]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#5865f2]" />
              Create Custom Slash Command
            </h3>
            <p className="text-xs text-[#a1a1aa] mb-4">Add a custom slash trigger for NexusBot</p>

            {formError && (
              <div className="mb-4 p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCommand} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#fafafa] font-semibold mb-1">Trigger Name</label>
                <input
                  type="text"
                  placeholder="/mycommand"
                  value={newCmdName}
                  onChange={(e) => setNewCmdName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-[#fafafa] focus:outline-none focus:border-[#5865f2] font-mono"
                />
              </div>

              <div>
                <label className="block text-[#fafafa] font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="What does this command do?"
                  value={newCmdDesc}
                  onChange={(e) => setNewCmdDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-[#fafafa] focus:outline-none focus:border-[#5865f2] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#fafafa] font-semibold mb-1">Category</label>
                  <select
                    value={newCmdCat}
                    onChange={(e) => setNewCmdCat(e.target.value as CommandCategory)}
                    className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-[#fafafa] focus:outline-none focus:border-[#5865f2]"
                  >
                    {['Moderation', 'Music', 'Utility', 'Economy', 'Fun', 'Admin'].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#fafafa] font-semibold mb-1">Cooldown (Seconds)</label>
                  <input
                    type="number"
                    min={0}
                    max={3600}
                    value={newCmdCooldown}
                    onChange={(e) => setNewCmdCooldown(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-[#fafafa] focus:outline-none focus:border-[#5865f2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#fafafa] font-semibold mb-1">
                  Required Permissions (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="MANAGE_MESSAGES, KICK_MEMBERS"
                  value={newCmdPerms}
                  onChange={(e) => setNewCmdPerms(e.target.value)}
                  className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-[#fafafa] focus:outline-none focus:border-[#5865f2] font-mono"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#09090b] hover:bg-[#27272a] text-[#a1a1aa] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#5865f2] hover:bg-[#5865f2]/90 text-white font-semibold"
                >
                  Save Command
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
