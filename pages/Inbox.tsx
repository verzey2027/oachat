
import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Paperclip, Smile, Send } from 'lucide-react';
import { InboxUser, ChatMessage } from '../types';
import { getInboxUsers, saveInboxUsers } from '../services/storageService';

export const Inbox: React.FC = () => {
    const [users, setUsers] = useState<InboxUser[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [inputText, setInputText] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const loadData = () => {
        const data = getInboxUsers();
        setUsers(data);
        if (!selectedUserId && data.length > 0) {
            setSelectedUserId(data[0].id);
        }
    };

    useEffect(() => {
        loadData();
        
        // Listen for simulator updates
        window.addEventListener('inbox-update', loadData);
        return () => window.removeEventListener('inbox-update', loadData);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [selectedUserId, users]);

    const selectedUser = users.find(u => u.id === selectedUserId);

    const handleSendMessage = () => {
        if (!inputText.trim() || !selectedUserId) return;

        const updatedUsers = users.map(user => {
            if (user.id === selectedUserId) {
                const newMessage: ChatMessage = {
                    id: Date.now().toString(),
                    sender: 'bot',
                    text: inputText,
                    timestamp: new Date()
                };
                return {
                    ...user,
                    messages: [...user.messages, newMessage],
                    lastActive: new Date().toISOString()
                };
            }
            return user;
        });

        setUsers(updatedUsers);
        saveInboxUsers(updatedUsers);
        setInputText('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    const handleSelectUser = (id: string) => {
        setSelectedUserId(id);
        // Clear unread count
        const updatedUsers = users.map(u => 
            u.id === id ? { ...u, unreadCount: 0 } : u
        );
        setUsers(updatedUsers);
        saveInboxUsers(updatedUsers);
    };

    const formatTime = (dateStr: string | Date) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="h-[calc(100vh-6rem)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex animate-in fade-in duration-300">
            {/* User List */}
            <div className="w-80 border-r border-slate-100 flex flex-col bg-white">
                <div className="p-4 border-b border-slate-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="ค้นหาลูกค้า..." 
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#00b900]"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {users.map(user => {
                        const lastMsg = user.messages[user.messages.length - 1];
                        return (
                            <div 
                                key={user.id} 
                                onClick={() => handleSelectUser(user.id)}
                                className={`p-4 flex gap-3 cursor-pointer transition-colors border-b border-slate-50 hover:bg-slate-50 ${selectedUserId === user.id ? 'bg-green-50/50' : ''}`}
                            >
                                <div className="w-12 h-12 bg-slate-200 rounded-full flex-shrink-0 overflow-hidden border border-slate-100">
                                    <img src={user.pictureUrl} alt="" className="w-full h-full object-cover"/>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`font-medium truncate ${selectedUserId === user.id ? 'text-[#00b900]' : 'text-slate-800'}`}>{user.displayName}</h4>
                                        <span className="text-xs text-slate-400 whitespace-nowrap">{lastMsg ? formatTime(lastMsg.timestamp) : ''}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 truncate">
                                        {lastMsg ? lastMsg.text : 'เริ่มการสนทนา'}
                                    </p>
                                </div>
                                {user.unreadCount > 0 && (
                                    <div className="flex flex-col justify-center ml-2">
                                        <span className="bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                                            {user.unreadCount}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Chat Area */}
            {selectedUser ? (
                <div className="flex-1 flex flex-col bg-slate-50/50">
                    {/* Header */}
                    <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm z-10">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden">
                                <img src={selectedUser.pictureUrl} alt="" className="w-full h-full object-cover"/>
                             </div>
                             <div>
                                 <h3 className="font-bold text-slate-800">{selectedUser.displayName}</h3>
                                 <p className="text-xs text-[#00b900] flex items-center gap-1">
                                    <span className="w-2 h-2 bg-[#00b900] rounded-full animate-pulse"></span>
                                    Active Now
                                 </p>
                             </div>
                        </div>
                        <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Message List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={scrollRef}>
                        {selectedUser.messages.map((msg, idx) => (
                            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'bot' ? 'flex-row-reverse' : ''}`}>
                                <div className="w-8 h-8 bg-slate-200 rounded-full flex-shrink-0 overflow-hidden">
                                    <img 
                                        src={msg.sender === 'bot' ? 'https://ui-avatars.com/api/?name=Admin&background=00b900&color=fff' : selectedUser.pictureUrl} 
                                        alt="" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className={`max-w-[70%] p-3 rounded-xl shadow-sm text-sm ${
                                    msg.sender === 'bot' 
                                    ? 'bg-[#00b900] text-white rounded-tr-none' 
                                    : 'bg-white text-slate-800 rounded-tl-none'
                                }`}>
                                    {msg.text}
                                    <div className={`text-[9px] text-right mt-1 ${msg.sender === 'bot' ? 'text-green-100' : 'text-slate-400'}`}>
                                        {formatTime(msg.timestamp)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-slate-200">
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <div className="flex-1 relative">
                                <input 
                                    type="text" 
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="พิมพ์ข้อความ..." 
                                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#00b900]"
                                />
                                <button className="absolute right-3 top-3 text-slate-400 hover:text-yellow-500 transition-colors">
                                    <Smile className="w-5 h-5" />
                                </button>
                            </div>
                            <button 
                                onClick={handleSendMessage}
                                disabled={!inputText.trim()}
                                className={`p-3 rounded-full shadow-md transition-all ${
                                    inputText.trim() 
                                    ? 'bg-[#00b900] text-white hover:bg-[#009900]' 
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                    <p>เลือกลูกค้าเพื่อเริ่มการสนทนา</p>
                </div>
            )}
        </div>
    );
};
