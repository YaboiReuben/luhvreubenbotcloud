import React, { useState } from 'react';
import { Send, X, Sparkles, CheckCircle2, AlertCircle, Server } from 'lucide-react';

interface BroadcastModalProps {
  serverCount: number;
  onClose: () => void;
  onBroadcastSuccess: (msg: string) => void;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  serverCount,
  onClose,
  onBroadcastSuccess,
}) => {
  const [title, setTitle] = useState('NexusBot v2.4.1 Major Update');
  const [message, setMessage] = useState(
    'We have deployed performance upgrades, music streaming enhancements, and brand new slash commands across all server shards! Type /help to explore.'
  );
  const [targetChannel, setTargetChannel] = useState('#announcements');
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSendResult(`Successfully delivered announcement to ${serverCount} servers in ${targetChannel}!`);
      setTimeout(() => {
        onBroadcastSuccess(`Broadcast delivered to ${serverCount} servers!`);
        onClose();
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#09090b]/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#18181b] border border-[#27272a] rounded-2xl p-6 shadow-2xl relative text-[#fafafa]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#09090b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#fafafa]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-[#5865f2]/10 border border-[#5865f2]/30 rounded-xl text-[#5865f2]">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold">Global Guild Broadcast</h3>
            <p className="text-xs text-[#a1a1aa]">Broadcast message across all {serverCount} connected servers</p>
          </div>
        </div>

        {sendResult ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <p className="text-sm font-bold text-[#fafafa]">{sendResult}</p>
          </div>
        ) : (
          <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#fafafa] mb-1">Target Channel Name</label>
              <input
                type="text"
                value={targetChannel}
                onChange={(e) => setTargetChannel(e.target.value)}
                placeholder="#announcements"
                className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-[#fafafa] focus:outline-none focus:border-[#5865f2] font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#fafafa] mb-1">Embed Announcement Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-[#fafafa] focus:outline-none focus:border-[#5865f2] font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#fafafa] mb-1">Message Body</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-xl text-[#fafafa] focus:outline-none focus:border-[#5865f2] resize-none leading-relaxed"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#09090b] border border-[#27272a] flex items-center justify-between text-[11px] text-[#a1a1aa]">
              <span className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-[#5865f2]" /> Target Guilds:
              </span>
              <span className="font-bold text-[#5865f2]">{serverCount} Discord Servers</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#09090b] hover:bg-[#27272a] text-[#a1a1aa] font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="px-4 py-2 rounded-xl bg-[#5865f2] hover:bg-[#5865f2]/90 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-[#5865f2]/20 disabled:opacity-50"
              >
                <Send className={`w-3.5 h-3.5 ${isSending ? 'animate-ping' : ''}`} />
                <span>{isSending ? 'Broadcasting...' : 'Send Broadcast'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
