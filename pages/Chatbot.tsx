import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Settings2, RefreshCcw } from 'lucide-react';
import { generateAIResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'bot', text: 'สวัสดีครับ ผมคือ AI ผู้ช่วย มีอะไรให้รับใช้ครับ?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemInstruction, setSystemInstruction] = useState('คุณคือผู้ช่วยดูแลร้านค้า LINE OA ตอบคำถามอย่างสุภาพ เป็นกันเอง และให้ข้อมูลที่ถูกต้อง');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiResponseText = await generateAIResponse(input, systemInstruction);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: aiResponseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-6">
      
      {/* Config Panel (Mobile: Hidden unless toggled, Desktop: Always visible) */}
      <div className={`lg:w-1/3 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 ${isConfigOpen ? 'fixed inset-0 z-50 p-4 lg:relative lg:p-0 lg:z-auto' : 'hidden lg:flex'}`}>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-slate-500" />
            ตั้งค่า AI Persona
          </h2>
          {isConfigOpen && (
            <button onClick={() => setIsConfigOpen(false)} className="lg:hidden text-slate-500">
                ปิด
            </button>
          )}
        </div>
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Model</label>
                <div className="p-2 bg-slate-100 rounded text-sm text-slate-600 font-mono">
                    gemini-2.5-flash
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">System Instruction (บุคลิกของ AI)</label>
                <textarea 
                    className="w-full h-40 p-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    value={systemInstruction}
                    onChange={(e) => setSystemInstruction(e.target.value)}
                    placeholder="ระบุว่า AI คือใคร หน้าที่คืออะไร..."
                />
                <p className="text-xs text-slate-400 mt-2">
                    คำแนะนำ: ระบุชื่อร้าน, โทนเสียง (ทางการ/กันเอง), และข้อมูลสำคัญที่ AI ควรรู้
                </p>
            </div>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
            <button className="w-full py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors text-sm font-medium">
                บันทึกการตั้งค่า
            </button>
        </div>
      </div>

      {/* Chat Simulation */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white shadow-md">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="font-bold text-slate-800">AI Simulator</h2>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Online (Gemini 2.5)
                    </p>
                </div>
            </div>
            <button 
                className="lg:hidden p-2 text-slate-500"
                onClick={() => setIsConfigOpen(true)}
            >
                <Settings2 className="w-5 h-5" />
            </button>
             <button 
                onClick={() => setMessages([])}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="ล้างประวัติการแชท"
            >
                <RefreshCcw className="w-5 h-5" />
            </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100/50">
          {messages.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-50">
                <Bot className="w-16 h-16 mb-4" />
                <p>เริ่มสนทนาเพื่อทดสอบ AI</p>
             </div>
          )}
          {messages.map((msg) => (
            <div 
                key={msg.id} 
                className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-purple-100 text-purple-600'
                }`}>
                    {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm text-sm ${
                    msg.sender === 'user' 
                        ? 'bg-[#00b900] text-white rounded-tr-none' 
                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}>
                    {msg.text}
                </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
                 <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
                    <div className="flex gap-1">
                        <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-75"></span>
                        <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-150"></span>
                    </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2 relative">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="พิมพ์ข้อความทดสอบ..."
                    className="flex-1 pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all shadow-inner"
                    disabled={isLoading}
                />
                <button 
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className={`absolute right-2 top-1.5 p-1.5 rounded-full transition-all ${
                        input.trim() 
                        ? 'bg-[#00b900] text-white hover:bg-[#009900] shadow-md' 
                        : 'bg-slate-200 text-slate-400'
                    }`}
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-2">
                Gemini 2.5 Flash อาจให้ข้อมูลที่ไม่ถูกต้อง โปรดตรวจสอบก่อนใช้งานจริง
            </p>
        </div>
      </div>
    </div>
  );
};
