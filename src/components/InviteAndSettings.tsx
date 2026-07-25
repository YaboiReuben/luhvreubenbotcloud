import React, { useState } from 'react';
import {
  Sliders,
  Link as LinkIcon,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Key,
  Bot,
  Radio,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { BotSettings } from '../types';

interface InviteAndSettingsProps {
  settings: BotSettings;
  onSaveSettings: (updated: Partial<BotSettings>) => void;
}

interface PermissionOption {
  key: string;
  label: string;
  bit: number;
  category: 'General' | 'Text' | 'Voice';
}

const DISCORD_PERMISSIONS: PermissionOption[] = [
  { key: 'ADMINISTRATOR', label: 'Administrator (All Permissions)', bit: 8, category: 'General' },
  { key: 'MANAGE_GUILD', label: 'Manage Server', bit: 32, category: 'General' },
  { key: 'MANAGE_ROLES', label: 'Manage Roles', bit: 268435456, category: 'General' },
  { key: 'MANAGE_CHANNELS', label: 'Manage Channels', bit: 16, category: 'General' },
  { key: 'KICK_MEMBERS', label: 'Kick Members', bit: 2, category: 'General' },
  { key: 'BAN_MEMBERS', label: 'Ban Members', bit: 4, category: 'General' },
  { key: 'SEND_MESSAGES', label: 'Send Messages', bit: 2048, category: 'Text' },
  { key: 'EMBED_LINKS', label: 'Embed Links', bit: 16384, category: 'Text' },
  { key: 'ATTACH_FILES', label: 'Attach Files', bit: 32768, category: 'Text' },
  { key: 'READ_MESSAGE_HISTORY', label: 'Read Message History', bit: 65536, category: 'Text' },
  { key: 'USE_SLASH_COMMANDS', label: 'Use Application Slash Commands', bit: 2147483648, category: 'Text' },
  { key: 'CONNECT', label: 'Connect to Voice', bit: 1048576, category: 'Voice' },
  { key: 'SPEAK', label: 'Speak in Voice', bit: 2097152, category: 'Voice' },
  { key: 'MUTE_MEMBERS', label: 'Mute Members in Voice', bit: 4194304, category: 'Voice' },
];

export const InviteAndSettings: React.FC<InviteAndSettingsProps> = ({ settings, onSaveSettings }) => {
  // Invite Generator State
  const [selectedPerms, setSelectedPerms] = useState<string[]>(['SEND_MESSAGES', 'EMBED_LINKS', 'CONNECT', 'SPEAK', 'USE_SLASH_COMMANDS']);
  const [clientId, setClientId] = useState('123456789012345678');
  const [copiedLink, setCopiedLink] = useState(false);

  // Settings State
  const [botName, setBotName] = useState(settings.botName);
  const [botTag, setBotTag] = useState(settings.botTag);
  const [statusText, setStatusText] = useState(settings.statusText);
  const [statusType, setStatusType] = useState(settings.statusType);
  const [prefix, setPrefix] = useState(settings.defaultPrefix);
  const [webhookUrl, setWebhookUrl] = useState(settings.webhookUrl);
  
  // PIN change state
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMsg, setPinMsg] = useState<{ text: string; error: boolean } | null>(null);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState(false);

  // Calculate bitwise permissions integer
  const calculatePermissionsBit = () => {
    if (selectedPerms.includes('ADMINISTRATOR')) return 8;
    return selectedPerms.reduce((acc, permKey) => {
      const found = DISCORD_PERMISSIONS.find((p) => p.key === permKey);
      return acc + (found ? found.bit : 0);
    }, 0);
  };

  const currentBit = calculatePermissionsBit();
  const generatedInviteUrl = `https://discord.com/oauth2/authorize?client_id=${clientId.trim() || '123456789012345678'}&scope=bot%20applications.commands&permissions=${currentBit}`;

  const togglePermission = (key: string) => {
    if (key === 'ADMINISTRATOR') {
      if (selectedPerms.includes('ADMINISTRATOR')) {
        setSelectedPerms([]);
      } else {
        setSelectedPerms(['ADMINISTRATOR']);
      }
      return;
    }

    if (selectedPerms.includes('ADMINISTRATOR')) {
      setSelectedPerms([key]);
      return;
    }

    if (selectedPerms.includes(key)) {
      setSelectedPerms(selectedPerms.filter((k) => k !== key));
    } else {
      setSelectedPerms([...selectedPerms, key]);
    }
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(generatedInviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveBotConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      botName,
      botTag,
      statusText,
      statusType,
      defaultPrefix: prefix,
      webhookUrl,
    });
    setSavedSuccessMsg(true);
    setTimeout(() => setSavedSuccessMsg(false), 3000);
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinMsg(null);

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setPinMsg({ text: 'PIN must be exactly 4 digits (e.g. 1920)', error: true });
      return;
    }

    if (newPin !== confirmPin) {
      setPinMsg({ text: 'PINs do not match.', error: true });
      return;
    }

    onSaveSettings({ currentPin: newPin });
    setNewPin('');
    setConfirmPin('');
    setPinMsg({ text: `Access PIN updated to ${newPin} successfully!`, error: false });
  };

  return (
    <div className="space-y-8">
      {/* 1. Discord Bot Invite Link Generator Bento Card */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-base font-bold text-[#fafafa] flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-[#5865f2]" />
            Discord OAuth2 Bot Invite Link Generator
          </h2>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Configure permission bits and calculate official Discord bot authorization URL.
          </p>
        </div>

        {/* Client ID Input */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#fafafa] mb-1">Discord Application Client ID</label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="e.g. 123456789012345678"
              className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-xs text-[#fafafa] font-mono focus:outline-none focus:border-[#5865f2]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#fafafa] mb-1">Calculated Permissions Bit</label>
            <div className="px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-xs text-[#5865f2] font-mono font-bold flex items-center justify-between">
              <span>{currentBit}</span>
              <span className="text-[10px] text-[#71717a] uppercase font-normal">Bitfield</span>
            </div>
          </div>
        </div>

        {/* Permissions Checkboxes Grid */}
        <div>
          <label className="block text-xs font-semibold text-[#fafafa] mb-3">Bot Guild Permissions</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DISCORD_PERMISSIONS.map((perm) => {
              const isChecked = selectedPerms.includes(perm.key);
              const isAdminLocked = selectedPerms.includes('ADMINISTRATOR') && perm.key !== 'ADMINISTRATOR';

              return (
                <label
                  key={perm.key}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-[#5865f2]/15 border-[#5865f2]/50 text-[#fafafa]'
                      : 'bg-[#09090b] border-[#27272a] text-[#a1a1aa] hover:border-[#5865f2]/30'
                  } ${isAdminLocked ? 'opacity-40 pointer-events-none' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => togglePermission(perm.key)}
                    className="rounded bg-[#18181b] border-[#27272a] text-[#5865f2] focus:ring-0"
                  />
                  <div className="truncate">
                    <div className="font-semibold truncate">{perm.label}</div>
                    <div className="text-[10px] text-[#71717a] font-mono">Bit: {perm.bit}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Generated URL Result Box */}
        <div className="p-4 rounded-xl bg-[#09090b] border border-[#27272a] space-y-2">
          <label className="block text-xs font-semibold text-[#5865f2]">Generated OAuth2 Authorization Link</label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              readOnly
              value={generatedInviteUrl}
              className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-xl text-xs text-[#fafafa] font-mono select-all focus:outline-none"
            />
            <button
              onClick={handleCopyInvite}
              className="px-4 py-2 rounded-xl bg-[#5865f2] hover:bg-[#5865f2]/90 text-white font-semibold text-xs shrink-0 flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md shadow-[#5865f2]/20"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
            </button>
            <a
              href={generatedInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] text-[#fafafa] font-semibold text-xs shrink-0 flex items-center justify-center gap-1.5 transition-all border border-[#27272a]"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Bot Profile & Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Settings */}
        <form
          onSubmit={handleSaveBotConfig}
          className="lg:col-span-2 bg-[#18181b] border border-[#27272a] rounded-2xl p-6 shadow-sm space-y-4"
        >
          <div>
            <h2 className="text-base font-bold text-[#fafafa] flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#5865f2]" />
              Bot Profile & Discord Presence Settings
            </h2>
            <p className="text-xs text-[#a1a1aa] mt-0.5">Customize display name, rich presence status, and prefix.</p>
          </div>

          {savedSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Bot settings updated successfully!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#fafafa] mb-1">Bot Username</label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-[#fafafa] focus:outline-none focus:border-[#5865f2]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#fafafa] mb-1">Bot Discriminator / Tag</label>
              <input
                type="text"
                value={botTag}
                onChange={(e) => setBotTag(e.target.value)}
                className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-[#fafafa] focus:outline-none focus:border-[#5865f2] font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#fafafa] mb-1">Default Command Prefix</label>
              <input
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-[#fafafa] focus:outline-none focus:border-[#5865f2] font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#fafafa] mb-1">Presence Activity Type</label>
              <select
                value={statusType}
                onChange={(e) => setStatusType(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-[#fafafa] focus:outline-none focus:border-[#5865f2]"
              >
                <option value="PLAYING">Playing</option>
                <option value="LISTENING">Listening to</option>
                <option value="WATCHING">Watching</option>
                <option value="STREAMING">Streaming</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#fafafa] mb-1">Playing Status Text</label>
              <input
                type="text"
                value={statusText}
                onChange={(e) => setStatusText(e.target.value)}
                placeholder="e.g. /help | v2.4.1"
                className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-[#fafafa] focus:outline-none focus:border-[#5865f2]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#fafafa] mb-1">Audit Webhook Alerts URL</label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-[#fafafa] font-mono focus:outline-none focus:border-[#5865f2]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#5865f2] hover:bg-[#5865f2]/90 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-[#5865f2]/20 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Bot Configuration</span>
            </button>
          </div>
        </form>

        {/* Change Dashboard Access PIN Panel */}
        <form
          onSubmit={handleChangePin}
          className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4"
        >
          <div>
            <h2 className="text-base font-bold text-[#fafafa] flex items-center gap-2 mb-1">
              <Lock className="w-5 h-5 text-purple-400" />
              Dashboard Security PIN
            </h2>
            <p className="text-xs text-[#a1a1aa]">
              Update the 4-digit PIN required to unlock this dashboard (Current default: {settings.currentPin}).
            </p>
          </div>

          {pinMsg && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                pinMsg.error
                  ? 'bg-rose-950/60 border border-rose-800/50 text-rose-300'
                  : 'bg-emerald-950/60 border border-emerald-800/50 text-emerald-300'
              }`}
            >
              {pinMsg.error ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
              <span>{pinMsg.text}</span>
            </div>
          )}

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-[#fafafa] mb-1">New 4-Digit Security PIN</label>
              <input
                type="password"
                maxLength={4}
                placeholder="1920"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-[#fafafa] text-center font-mono font-bold text-base tracking-widest focus:outline-none focus:border-[#5865f2]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#fafafa] mb-1">Confirm New PIN</label>
              <input
                type="password"
                maxLength={4}
                placeholder="1920"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-[#fafafa] text-center font-mono font-bold text-base tracking-widest focus:outline-none focus:border-[#5865f2]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 transition-all active:scale-95"
          >
            <Key className="w-4 h-4" />
            <span>Update Access PIN</span>
          </button>
        </form>

      </div>
    </div>
  );
};
