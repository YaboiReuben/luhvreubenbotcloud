import React from 'react';
import { LayoutDashboard, Terminal, Sliders, Link, Radio, Shield, Sparkles, Send } from 'lucide-react';

export type TabType = 'overview' | 'commands' | 'console' | 'settings';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  unreadErrorsCount?: number;
  onOpenBroadcastModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  unreadErrorsCount = 0,
  onOpenBroadcastModal,
}) => {
  const navItems = [
    {
      id: 'overview' as TabType,
      label: 'Overview',
      icon: LayoutDashboard,
      description: 'Bot statistics & quick controls',
    },
    {
      id: 'commands' as TabType,
      label: 'Commands List',
      icon: Terminal,
      description: 'Categorized bot commands & triggers',
    },
    {
      id: 'console' as TabType,
      label: 'Live Console & Logs',
      icon: Radio,
      description: 'Real-time event streaming logs',
      badge: unreadErrorsCount > 0 ? `${unreadErrorsCount} ERR` : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'settings' as TabType,
      label: 'Settings & Bot Link',
      icon: Sliders,
      description: 'Invite link generator & config',
    },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 bg-[#18181b]/60 border-b md:border-b-0 md:border-r border-[#27272a] p-3 sm:p-4 flex flex-col justify-between">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#a1a1aa]">
          Navigation
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-150 ${
                  isActive
                    ? 'bg-[#5865f2]/15 border border-[#5865f2]/40 text-white shadow-sm font-medium'
                    : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a]/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-lg ${
                      isActive ? 'bg-[#5865f2] text-white' : 'bg-[#09090b] text-[#a1a1aa] border border-[#27272a]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold leading-tight truncate">{item.label}</div>
                    <div className="text-[10px] text-[#71717a] truncate mt-0.5">{item.description}</div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ml-2 ${
                      item.badgeColor || 'bg-[#5865f2] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Action Drawer Widget */}
      <div className="mt-6 p-3.5 rounded-xl bg-[#09090b] border border-[#27272a] text-xs">
        <div className="flex items-center gap-2 text-[#5865f2] font-semibold mb-1">
          <Sparkles className="w-4 h-4 text-[#5865f2]" />
          <span>Global Announcement</span>
        </div>
        <p className="text-[11px] text-[#a1a1aa] mb-3 leading-relaxed">
          Broadcast a notification message directly across connected Discord servers.
        </p>
        <button
          onClick={onOpenBroadcastModal}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#5865f2] hover:bg-[#5865f2]/90 active:scale-95 text-white font-semibold shadow-md shadow-[#5865f2]/20 transition-all text-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send Broadcast</span>
        </button>
      </div>
    </aside>
  );
};
