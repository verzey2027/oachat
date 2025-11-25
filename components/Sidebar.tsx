
import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Send, 
  Bot, 
  Layers, 
  Inbox, 
  Menu,
  Settings
} from 'lucide-react';
import { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: Page.DASHBOARD, label: 'ภาพรวม (Dashboard)', icon: LayoutDashboard },
    { id: Page.INBOX, label: 'กล่องข้อความ', icon: Inbox },
    { id: Page.BROADCAST, label: 'บรอดแคสต์ (Broadcast)', icon: Send },
    { id: Page.AUTO_REPLY, label: 'ตอบกลับอัตโนมัติ', icon: MessageSquare },
    { id: Page.CHATBOT, label: 'AI Chatbot (Gemini)', icon: Bot },
    { id: Page.FLEX_BUILDER, label: 'Flex Message', icon: Layers },
    { id: Page.RICH_MENU, label: 'Rich Menu', icon: Menu },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#1e2330] text-white transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-center border-b border-gray-700 font-bold text-xl tracking-wider text-[#00b900]">
          LINE MANAGER
        </div>
        
        <nav className="mt-6 px-3 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setPage(item.id);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-[#00b900] text-white shadow-lg' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <button 
            onClick={() => {
                setPage(Page.SETTINGS);
                setIsOpen(false);
            }}
            className={`flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                currentPage === Page.SETTINGS
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Settings className="mr-3 h-5 w-5" />
            ตั้งค่าระบบ
          </button>
        </div>
      </div>
    </>
  );
};
