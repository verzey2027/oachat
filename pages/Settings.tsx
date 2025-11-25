
import React, { useState, useEffect } from 'react';
import { Save, Key, Globe, Copy, CheckCircle, ShieldCheck, AlertCircle, RefreshCw, Smartphone, Zap } from 'lucide-react';
import { getSystemSettings, saveSystemSettings } from '../services/storageService';
import { processIncomingMessage } from '../services/messageHandler';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState(getSystemSettings());
  const [isSaved, setIsSaved] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<'idle' | 'checking' | 'active' | 'error'>('idle');

  // Simulator state
  const [testMessage, setTestMessage] = useState('');
  const [simulationStatus, setSimulationStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSave = () => {
    saveSystemSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleChange = (field: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleCopyWebhook = () => {
    const url = `${window.location.origin}/api/webhook`;
    navigator.clipboard.writeText(url);
    alert('คัดลอก Webhook URL แล้ว');
  };

  const checkWebhook = () => {
    setWebhookStatus('checking');
    setTimeout(() => {
        setWebhookStatus('active');
    }, 1500);
  };

  const handleSimulateWebhook = async () => {
    if (!testMessage.trim()) return;
    setSimulationStatus('sending');
    
    // Call the centralized message handler which triggers Auto-Reply or AI
    // and saves to the Inbox
    await processIncomingMessage(testMessage);
    
    setSimulationStatus('success');
    setTestMessage('');
    setTimeout(() => setSimulationStatus('idle'), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">ตั้งค่าระบบ (Settings)</h1>
            <p className="text-slate-500">จัดการการเชื่อมต่อ LINE Messaging API และ Webhook</p>
        </div>
        <button 
          onClick={handleSave}
          className={`px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-sm font-medium ${
            isSaved 
              ? 'bg-green-100 text-green-700'
              : 'bg-[#00b900] hover:bg-[#009900] text-white'
          }`}
        >
          {isSaved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {isSaved ? 'บันทึกแล้ว' : 'บันทึกการตั้งค่า'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* LINE API Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
             <div className="p-2 bg-green-50 rounded-lg">
                <Key className="w-6 h-6 text-[#00b900]" />
             </div>
             <div>
                 <h2 className="text-lg font-bold text-slate-800">การเชื่อมต่อ LINE Official Account</h2>
                 <p className="text-sm text-slate-500">ใส่ข้อมูลจาก LINE Developers Console</p>
             </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Channel Access Token (Long-lived)
                </label>
                <div className="relative">
                    <input 
                        type="password" 
                        value={settings.channelToken}
                        onChange={(e) => handleChange('channelToken', e.target.value)}
                        placeholder="วาง Channel Access Token ที่นี่..."
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b900] font-mono text-sm"
                    />
                    <div className="absolute right-3 top-3 text-slate-400">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Channel Secret
                </label>
                <input 
                    type="password" 
                    value={settings.channelSecret}
                    onChange={(e) => handleChange('channelSecret', e.target.value)}
                    placeholder="วาง Channel Secret ที่นี่..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b900] font-mono text-sm"
                />
            </div>
          </div>
        </div>

        {/* Webhook Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
             <div className="p-2 bg-blue-50 rounded-lg">
                <Globe className="w-6 h-6 text-blue-500" />
             </div>
             <div>
                 <h2 className="text-lg font-bold text-slate-800">Webhook Configuration</h2>
                 <p className="text-sm text-slate-500">นำ URL นี้ไปใส่ใน LINE Developers Console</p>
             </div>
          </div>
          
          <div className="p-6 space-y-6">
             <div className="flex gap-4 items-start">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Webhook URL
                    </label>
                    <div className="flex gap-2">
                        <code className="flex-1 p-3 bg-slate-800 text-green-400 rounded-lg font-mono text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                            {window.location.origin}/api/webhook
                        </code>
                        <button 
                            onClick={handleCopyWebhook}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <Copy className="w-4 h-4" />
                            Copy
                        </button>
                    </div>
                </div>
             </div>

             <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${webhookStatus === 'active' ? 'bg-green-500' : webhookStatus === 'error' ? 'bg-red-500' : 'bg-slate-300'}`}></div>
                    <div>
                        <p className="text-sm font-medium text-slate-700">สถานะ Webhook</p>
                        <p className="text-xs text-slate-500">
                            {webhookStatus === 'active' ? 'เชื่อมต่อสำเร็จ (Simulated)' : webhookStatus === 'checking' ? 'กำลังตรวจสอบ...' : 'ยังไม่ได้ตรวจสอบ'}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={checkWebhook}
                    disabled={webhookStatus === 'checking'}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${webhookStatus === 'checking' ? 'animate-spin' : ''}`} />
                    ตรวจสอบสถานะ
                </button>
             </div>
             
             <div className="flex items-start gap-3 p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                    อย่าลืมเปิดใช้งาน <strong>"Use webhook"</strong> ใน LINE Developers Console หลังจากนำ URL ไปวางเรียบร้อยแล้ว
                </p>
             </div>
          </div>
        </div>

        {/* Webhook Simulator */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ring-4 ring-purple-50">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-purple-50/50">
                <div className="p-2 bg-purple-100 rounded-lg">
                    <Smartphone className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Webhook Simulator (ทดสอบระบบ)</h2>
                    <p className="text-sm text-slate-500">ส่งข้อความเข้า Inbox เพื่อทดสอบ Auto-Reply หรือ AI</p>
                </div>
            </div>
            <div className="p-6 flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">ข้อความทดสอบ</label>
                    <input 
                        type="text" 
                        value={testMessage}
                        onChange={(e) => setTestMessage(e.target.value)}
                        placeholder="พิมพ์ข้อความที่ต้องการให้ลูกค้าส่งเข้ามา... (เช่น 'ราคาเท่าไหร่')"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleSimulateWebhook()}
                    />
                </div>
                <button 
                    onClick={handleSimulateWebhook}
                    disabled={!testMessage.trim() || simulationStatus === 'sending'}
                    className={`px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-md ${
                        simulationStatus === 'success' 
                        ? 'bg-green-500 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                >
                    {simulationStatus === 'sending' ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : simulationStatus === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <Zap className="w-5 h-5" />
                    )}
                    {simulationStatus === 'success' ? 'ส่งสำเร็จ' : 'ทดสอบส่ง'}
                </button>
            </div>
            <div className="px-6 pb-6 text-xs text-slate-500">
                * ข้อความจะถูกส่งเข้าไปที่ Inbox ของ "New Customer" หรือผู้ใช้คนแรก และจะถูกประมวลผลโดย Auto-Reply/AI ทันที
            </div>
        </div>

        {/* Other System Settings */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="p-6">
                <h3 className="font-bold text-slate-800 mb-4">ตั้งค่าทั่วไป</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                        <div>
                            <div className="font-medium text-slate-700">เปิดใช้งาน AI Chatbot (Global)</div>
                            <div className="text-xs text-slate-500">หากเปิด ระบบจะใช้ AI ตอบเมื่อไม่มี Keyword ตรงกัน</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={settings.isAiEnabled}
                                onChange={(e) => handleChange('isAiEnabled', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00b900]"></div>
                        </label>
                    </div>
                     <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                        <div>
                            <div className="font-medium text-slate-700">บันทึก Log การสนทนา</div>
                            <div className="text-xs text-slate-500">เก็บประวัติการสนทนาทั้งหมดไว้ในระบบ</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={settings.saveLogs}
                                onChange={(e) => handleChange('saveLogs', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00b900]"></div>
                        </label>
                    </div>
                </div>
             </div>
         </div>

      </div>
    </div>
  );
};
