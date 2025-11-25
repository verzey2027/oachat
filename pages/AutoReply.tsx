
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Search, Power, Save, X } from 'lucide-react';
import { AutoReplyRule } from '../types';
import { getAutoReplyRules, saveAutoReplyRules } from '../services/storageService';

export const AutoReply: React.FC = () => {
  const [rules, setRules] = useState<AutoReplyRule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [keywordInput, setKeywordInput] = useState('');
  const [responseInput, setResponseInput] = useState('');

  useEffect(() => {
    setRules(getAutoReplyRules());
  }, []);

  const saveToStorage = (newRules: AutoReplyRule[]) => {
    setRules(newRules);
    saveAutoReplyRules(newRules);
  };

  const handleOpenModal = (rule?: AutoReplyRule) => {
    if (rule) {
        setEditingId(rule.id);
        setKeywordInput(rule.keywords.join(', '));
        setResponseInput(rule.response);
    } else {
        setEditingId(null);
        setKeywordInput('');
        setResponseInput('');
    }
    setIsModalOpen(true);
  };

  const handleSaveRule = () => {
    if (!keywordInput.trim() || !responseInput.trim()) return;
    
    const keywords = keywordInput.split(',').map(k => k.trim()).filter(k => k);
    
    let newRules = [...rules];
    
    if (editingId) {
        newRules = newRules.map(r => r.id === editingId ? {
            ...r,
            keywords,
            response: responseInput
        } : r);
    } else {
        const newRule: AutoReplyRule = {
            id: Date.now().toString(),
            keywords,
            response: responseInput,
            isActive: true
        };
        newRules.push(newRule);
    }
    
    saveToStorage(newRules);
    setIsModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    const newRules = rules.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r);
    saveToStorage(newRules);
  };

  const deleteRule = (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบกฎนี้?')) {
        const newRules = rules.filter(r => r.id !== id);
        saveToStorage(newRules);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">ตอบกลับอัตโนมัติ (Auto-Reply)</h1>
            <p className="text-slate-500 text-sm">ระบบจะตอบกลับทันทีเมื่อพบคำสำคัญที่ตรงกัน (ทำงานก่อน AI)</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#00b900] hover:bg-[#009900] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium"
        >
          <Plus className="w-5 h-5" />
          สร้างกฎใหม่
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex gap-4">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="ค้นหาคำสำคัญ..." 
                    className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b900]/20 focus:border-[#00b900]"
                />
            </div>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
              <tr className="text-slate-500 text-sm border-b border-slate-100">
                <th className="px-6 py-4 font-medium">คำสำคัญ (Keywords)</th>
                <th className="px-6 py-4 font-medium">ข้อความตอบกลับ</th>
                <th className="px-6 py-4 font-medium text-center">สถานะ</th>
                <th className="px-6 py-4 font-medium text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rules.length === 0 ? (
                  <tr>
                      <td colSpan={4} className="text-center py-10 text-slate-400">
                          ยังไม่มีกฎการตอบกลับ กดปุ่ม "สร้างกฎใหม่" เพื่อเริ่มต้น
                      </td>
                  </tr>
              ) : rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      {rule.keywords.map((k, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs border border-blue-100 font-medium">
                          {k}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700 max-w-md break-words align-top">
                    {rule.response}
                  </td>
                  <td className="px-6 py-4 text-center align-top">
                    <button 
                      onClick={() => toggleStatus(rule.id)}
                      className={`p-2 rounded-full transition-all ${rule.isActive ? 'text-[#00b900] bg-green-50 hover:bg-green-100' : 'text-slate-400 bg-slate-100 hover:bg-slate-200'}`}
                      title={rule.isActive ? "ปิดการใช้งาน" : "เปิดการใช้งาน"}
                    >
                      <Power className="w-5 h-5" />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right align-top">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(rule)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteRule(rule.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? 'แก้ไขกฎการตอบกลับ' : 'สร้างกฎการตอบกลับใหม่'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    คำสำคัญ <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="เช่น ราคา, โปรโมชั่น, สนใจ (คั่นด้วยจุลภาค)"
                  className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00b900] transition-shadow"
                />
                <p className="text-xs text-slate-400 mt-1">หากลูกค้าพิมพ์ข้อความที่มีคำเหล่านี้ ระบบจะตอบกลับอัตโนมัติ</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    ข้อความตอบกลับ <span className="text-red-500">*</span>
                </label>
                <textarea 
                  rows={5}
                  value={responseInput}
                  onChange={(e) => setResponseInput(e.target.value)}
                  placeholder="ใส่ข้อความที่ต้องการให้ระบบตอบกลับ..."
                  className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00b900] transition-shadow"
                />
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleSaveRule}
                disabled={!keywordInput.trim() || !responseInput.trim()}
                className="px-5 py-2.5 bg-[#00b900] text-white hover:bg-[#009900] rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                บันทึกข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
