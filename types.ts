
export enum Page {
  DASHBOARD = 'DASHBOARD',
  AUTO_REPLY = 'AUTO_REPLY',
  BROADCAST = 'BROADCAST',
  CHATBOT = 'CHATBOT',
  FLEX_BUILDER = 'FLEX_BUILDER',
  INBOX = 'INBOX',
  RICH_MENU = 'RICH_MENU',
  SETTINGS = 'SETTINGS'
}

export interface AutoReplyRule {
  id: string;
  keywords: string[];
  response: string;
  isActive: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface BroadcastDraft {
  target: 'all' | 'tags';
  tags: string[];
  message: string;
  scheduledTime?: string;
}

export interface FlexTemplate {
  id: string;
  name: string;
  json: string;
}

export interface InboxUser {
  id: string;
  userId: string;
  displayName: string;
  pictureUrl: string;
  messages: ChatMessage[];
  unreadCount: number;
  lastActive: string;
}

export interface SystemSettings {
  channelToken: string;
  channelSecret: string;
  isAiEnabled: boolean;
  aiSystemInstruction: string;
  saveLogs: boolean;
}

export interface RichMenuTemplate {
  id: string;
  name: string;
  size: 'large' | 'compact';
  areas: number; // number of clickable areas
  image?: string;
}
