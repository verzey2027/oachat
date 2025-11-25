
import { InboxUser, ChatMessage, AutoReplyRule, SystemSettings } from '../types';

const KEYS = {
  INBOX: 'line_oa_inbox_data',
  RULES: 'line_oa_autoreply_rules',
  SETTINGS: 'line_oa_settings'
};

const INITIAL_USERS: InboxUser[] = [
  {
    id: '1',
    userId: 'U123456789',
    displayName: 'Somchai Jaidee',
    pictureUrl: 'https://picsum.photos/seed/1/200',
    unreadCount: 0,
    lastActive: new Date(Date.now() - 1000000).toISOString(),
    messages: [
      { id: 'm1', sender: 'user', text: 'สวัสดีครับ', timestamp: new Date(Date.now() - 1000000) },
      { id: 'm2', sender: 'bot', text: 'สวัสดีครับ มีอะไรให้ช่วยไหมครับ', timestamp: new Date(Date.now() - 900000) },
    ]
  },
  {
    id: '2',
    userId: 'U987654321',
    displayName: 'Jane Doe',
    pictureUrl: 'https://picsum.photos/seed/2/200',
    unreadCount: 1,
    lastActive: new Date(Date.now() - 50000).toISOString(),
    messages: [
      { id: 'm4', sender: 'user', text: 'ขอเลขพัสดุหน่อยค่ะ', timestamp: new Date(Date.now() - 50000) }
    ]
  }
];

const INITIAL_RULES: AutoReplyRule[] = [
  { id: '1', keywords: ['ราคา', 'price', 'เท่าไหร่'], response: 'สินค้าเริ่มต้นที่ 500 บาทค่ะ สนใจดูแคตตาล็อกไหมคะ?', isActive: true },
  { id: '2', keywords: ['ติดต่อ', 'โทร', 'เบอร์'], response: 'ติดต่อเราได้ที่ 02-123-4567 หรือกดปุ่ม Call Center ในเมนูได้เลยค่ะ', isActive: true },
  { id: '3', keywords: ['ที่อยู่', 'location', 'แผนที่'], response: 'ร้านตั้งอยู่ที่ชั้น 1 ห้าง Siam Paragon ค่ะ', isActive: true },
];

const INITIAL_SETTINGS: SystemSettings = {
  channelToken: '',
  channelSecret: '',
  isAiEnabled: true,
  aiSystemInstruction: 'คุณคือแอดมินร้านค้า LINE OA ที่เป็นมิตรและช่วยเหลือลูกค้าอย่างเต็มที่',
  saveLogs: true
};

// --- Inbox Users ---
export const getInboxUsers = (): InboxUser[] => {
  const stored = localStorage.getItem(KEYS.INBOX);
  if (!stored) {
    localStorage.setItem(KEYS.INBOX, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  try {
    const parsed = JSON.parse(stored);
    return parsed.map((u: any) => ({
      ...u,
      messages: u.messages.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      }))
    })).sort((a: InboxUser, b: InboxUser) => 
      new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
    );
  } catch (e) {
    return INITIAL_USERS;
  }
};

export const saveInboxUsers = (users: InboxUser[]) => {
  localStorage.setItem(KEYS.INBOX, JSON.stringify(users));
  window.dispatchEvent(new Event('inbox-update'));
};

// --- Auto Reply Rules ---
export const getAutoReplyRules = (): AutoReplyRule[] => {
  const stored = localStorage.getItem(KEYS.RULES);
  if (!stored) {
    localStorage.setItem(KEYS.RULES, JSON.stringify(INITIAL_RULES));
    return INITIAL_RULES;
  }
  return JSON.parse(stored);
};

export const saveAutoReplyRules = (rules: AutoReplyRule[]) => {
  localStorage.setItem(KEYS.RULES, JSON.stringify(rules));
};

// --- System Settings ---
export const getSystemSettings = (): SystemSettings => {
  const stored = localStorage.getItem(KEYS.SETTINGS);
  if (!stored) {
    return INITIAL_SETTINGS;
  }
  return JSON.parse(stored);
};

export const saveSystemSettings = (settings: SystemSettings) => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};
