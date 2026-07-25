export type BotStatusState = 'online' | 'idle' | 'dnd' | 'offline';

export type CommandCategory = 'Admin' | 'Moderation' | 'Music' | 'Utility' | 'Fun' | 'Economy';

export interface CommandItem {
  id: string;
  name: string;
  description: string;
  category: CommandCategory;
  enabled: boolean;
  cooldownSec: number;
  permissionsRequired: string[];
  usageCount: number;
  custom?: boolean;
}

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'COMMAND' | 'SUCCESS';

export interface LogItem {
  id: string;
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
}

export interface ServerItem {
  id: string;
  name: string;
  icon: string;
  memberCount: number;
  channelsCount: number;
  owner: string;
  region: string;
  active: boolean;
  joinedAt: string;
}

export interface BotSettings {
  botName: string;
  botTag: string;
  statusText: string;
  statusType: 'PLAYING' | 'LISTENING' | 'WATCHING' | 'STREAMING';
  defaultPrefix: string;
  autoModEnabled: boolean;
  autoModSensitivity: 'Low' | 'Medium' | 'High' | 'Aggressive';
  currentPin: string;
  webhookUrl: string;
  maintenanceMode: boolean;
  botAvatar: string;
}

export interface SystemMetric {
  time: string;
  cpu: number;
  memory: number;
  ping: number;
}
