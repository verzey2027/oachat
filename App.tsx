
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { AutoReply } from './pages/AutoReply';
import { Chatbot } from './pages/Chatbot';
import { Broadcast } from './pages/Broadcast';
import { FlexBuilder } from './pages/FlexBuilder';
import { Inbox } from './pages/Inbox';
import { Settings } from './pages/Settings';
import { RichMenu } from './pages/RichMenu';
import { Page } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (currentPage) {
      case Page.DASHBOARD:
        return <Dashboard />;
      case Page.AUTO_REPLY:
        return <AutoReply />;
      case Page.CHATBOT:
        return <Chatbot />;
      case Page.BROADCAST:
        return <Broadcast />;
      case Page.FLEX_BUILDER:
        return <FlexBuilder />;
      case Page.INBOX:
        return <Inbox />;
      case Page.SETTINGS:
        return <Settings />;
      case Page.RICH_MENU:
        return <RichMenu />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        currentPage={currentPage} 
        setPage={setCurrentPage}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
