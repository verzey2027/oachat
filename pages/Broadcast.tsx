
import React, { useState } from 'react';
import { Send, Users, Clock, Image as ImageIcon, Smile, CheckCircle, AlertCircle } from 'lucide-react';
import { getInboxUsers, saveInboxUsers } from '../services/storageService';
import { ChatMessage } from '../types';

export const Broadcast: React.FC = () => {
  const [target, setTarget] = useState<'all' | 'tags'>('all');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [inboxCount, setInboxCount] = useState(getInboxUsers().length);

  const handleSendBroadcast = () => {
      if (!message.trim()) return;
      
      setStatus('sending');
      
      setTimeout(() => {
          try {
              const users = getInboxUsers();
              const newBroadcastMsg: ChatMessage = {
                  id: 'bc_' + Date.now(),
                  sender: 'bot',
                  text: message,
                  timestamp: new Date()
              };

              // Add message to all users
              const updatedUsers = users.map(user => ({
                  ...user,
                  messages: [...user.messages, newBroadcastMsg],
                  lastActive: new Date().toISOString() // Bump activity
              }));

              saveInboxUsers(updatedUsers);
              setStatus('success');
              setMessage('');
              setTimeout(() => setStatus('idle'), 3000);
          } catch (e) {
              setStatus('error');
          }
      }, 1500);
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">สร้างบรอดแคสต์ใหม่</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Form */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Target Audience */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              ผู้รับข้อความ
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <input 
                  type="radio" 
                  name="target" 
                  checked={target === 'all'} 
                  onChange={() => setTarget('all')}
                  className="w-4 h-4 text-[#00b900] focus:ring-[#00b900]"
                />
                <span className="text-slate-700">เพื่อนในระบบทั้งหมด ({inboxCount} คน)</span>
              </label>
              
              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <input 
                  type="radio" 
                  name="target" 
                  checked={target === 'tags'} 
                  onChange={() => setTarget('tags')}
                  className="w-4 h-4 text-[#00b900] focus:ring-[#00b900]"
                />
                <span className="text-slate-700">ระบุตามแท็ก (Tags)</span>
              </label>
              
              {target === 'tags' && (
                <div className="ml-7 p-3 bg-slate-50 rounded-lg border border-slate-200 animate-in slide-in-from-top-2 duration-200">
                  <p className="text-xs text-slate-500 mb-2">เลือกแท็กที่ต้องการ:</p>
                  <div className="flex flex-wrap gap-2">
                    {['VIP', 'ลูกค้าเก่า', 'โปรโมชั่น 11.11', 'รอจ่ายเงิน'].map(tag => (
                      <button key={tag} className="px-3 py-1 bg-white border border-slate-300 rounded-full text-sm text-slate-600 hover:border-[#00b900] hover:text-[#00b900]">
                        # {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Message Content */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-green-500" />
              เนื้อหาข้อความ
            </h3>
            
            <div className="relative">
              <textarea 
                className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b900] resize-none text-slate-700"
                placeholder="พิมพ์ข้อความที่ต้องการส่งถึงลูกค้า..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={status === 'sending'}
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded transition-colors" title="เพิ่มรูปภาพ">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded transition-colors" title="เพิ่มอีโมจิ">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-right text-xs text-slate-400 mt-2">
              {message.length}/1000 ตัวอักษร
            </p>
          </div>

          {/* Schedule */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              เวลาในการส่ง
            </h3>
             <div className="flex gap-4">
                <button className="flex-1 py-2 border-2 border-[#00b900] text-[#00b900] bg-green-50 rounded-lg font-medium">
                  ส่งทันที
                </button>
                <button className="flex-1 py-2 border border-slate-300 text-slate-600 bg-white hover:bg-slate-50 rounded-lg font-medium transition-colors">
                  ตั้งเวลาล่วงหน้า
                </button>
             </div>
          </div>
          
           <button 
            onClick={handleSendBroadcast}
            disabled={status === 'sending' || !message.trim()}
            className={`w-full py-3 text-white rounded-xl shadow-lg transition-all font-bold text-lg flex items-center justify-center gap-2 ${
                status === 'sending' ? 'bg-slate-400 cursor-not-allowed' :
                status === 'success' ? 'bg-green-600 hover:bg-green-700' :
                'bg-[#00b900] hover:bg-[#009900] hover:shadow-xl'
            }`}
          >
            {status === 'sending' ? (
                <>กำลังส่งข้อความ...</>
            ) : status === 'success' ? (
                <><CheckCircle className="w-5 h-5" /> ส่งข้อความสำเร็จ</>
            ) : (
                <><Send className="w-5 h-5" /> ยืนยันการส่งข้อความ</>
            )}
          </button>
        </div>

        {/* Right Column: Preview */}
        <div className="hidden md:block">
          <div className="sticky top-6">
            <h3 className="text-sm font-medium text-slate-500 mb-3 text-center">ตัวอย่างข้อความ</h3>
            <div className="w-[300px] mx-auto bg-[#8c94bd] rounded-[3rem] p-4 border-[8px] border-slate-800 shadow-2xl relative overflow-hidden h-[600px]">
                {/* Phone Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-10"></div>
                
                {/* Chat Header */}
                <div className="bg-[#2a2e38] text-white p-3 pt-8 -mx-4 -mt-4 mb-4 flex items-center shadow-md relative z-0">
                    <div className="w-3 h-3 border-l-2 border-t-2 border-white -rotate-45 ml-2"></div>
                    <span className="ml-4 font-bold">My Shop</span>
                </div>

                {/* Chat Area */}
                <div className="space-y-4 h-full pb-20 overflow-y-auto">
                    {/* Bot Message Bubble */}
                    {message ? (
                        <div className="flex gap-2">
                             <div className="w-8 h-8 bg-white rounded-full flex-shrink-0 border border-slate-200 overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=Admin&background=00b900&color=fff" alt="" />
                             </div>
                             <div className="bg-white p-3 rounded-xl rounded-tl-none text-sm text-slate-800 shadow-sm break-words max-w-[200px]">
                                {message}
                                <div className="text-[9px] text-slate-400 text-right mt-1">10:42 น.</div>
                             </div>
                        </div>
                    ) : (
                        <div className="text-center text-white/50 text-xs mt-10">
                            พิมพ์ข้อความเพื่อดูตัวอย่าง
                        </div>
                    )}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
