
import { getInboxUsers, saveInboxUsers, getAutoReplyRules, getSystemSettings } from './storageService';
import { generateAIResponse } from './geminiService';
import { ChatMessage, InboxUser } from '../types';

export const processIncomingMessage = async (text: string, userId?: string): Promise<boolean> => {
  const users = getInboxUsers();
  const rules = getAutoReplyRules();
  const settings = getSystemSettings();

  // 1. Identify or Create User
  // In a real webhook, we get the userId from the event. 
  // Here, we simulate by picking the first user if not provided, or creating a temp one.
  let targetUserIndex = users.findIndex(u => userId ? u.id === userId : true); // Default to first user for simulation
  
  if (targetUserIndex === -1) {
    // If no users exist, create one
    const newUser: InboxUser = {
      id: Date.now().toString(),
      userId: 'U' + Date.now(),
      displayName: 'New Customer',
      pictureUrl: 'https://ui-avatars.com/api/?name=New+User&background=random',
      messages: [],
      unreadCount: 0,
      lastActive: new Date().toISOString()
    };
    users.unshift(newUser);
    targetUserIndex = 0;
  }

  const targetUser = users[targetUserIndex];

  // 2. Add User Message
  const userMsg: ChatMessage = {
    id: Date.now().toString(),
    sender: 'user',
    text: text,
    timestamp: new Date()
  };
  
  targetUser.messages.push(userMsg);
  targetUser.unreadCount += 1;
  targetUser.lastActive = new Date().toISOString();
  
  // Save immediate state (User sent message)
  saveInboxUsers([...users]);

  // 3. Logic: Check Auto-Reply Rules
  const lowerText = text.toLowerCase();
  const matchedRule = rules.find(rule => 
    rule.isActive && rule.keywords.some(k => lowerText.includes(k.toLowerCase()))
  );

  let responseText = '';

  if (matchedRule) {
    responseText = matchedRule.response;
  } else if (settings.isAiEnabled) {
    // 4. Logic: Fallback to AI
    try {
      responseText = await generateAIResponse(text, settings.aiSystemInstruction);
    } catch (error) {
      responseText = "ขออภัย ระบบขัดข้องชั่วคราว";
    }
  }

  // 5. Send Response (if any)
  if (responseText) {
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, matchedRule ? 500 : 1500));

    const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: responseText,
        timestamp: new Date()
    };
    
    // Refresh users from storage to avoid race conditions if UI updated in between
    const currentUsers = getInboxUsers();
    const currentUserIndex = currentUsers.findIndex(u => u.id === targetUser.id);
    if (currentUserIndex !== -1) {
        currentUsers[currentUserIndex].messages.push(botMsg);
        saveInboxUsers(currentUsers);
    }
  }

  return true;
};
