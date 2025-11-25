
import React, { useState } from 'react';
import { Grid, Image as ImageIcon, MousePointer, Layout, Save } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  areas: number;
}

const TEMPLATES: Template[] = [
  { id: 'compact-2', name: 'Compact (2 Areas)', areas: 2 },
  { id: 'large-6', name: 'Large (6 Areas)', areas: 6 },
  { id: 'large-4', name: 'Large (4 Areas)', areas: 4 },
  { id: 'large-1', name: 'Large (1 Area)', areas: 1 },
];

export const RichMenu: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('large-6');
  const [menuName, setMenuName] = useState('Menu A');
  const [chatBarText, setChatBarText] = useState('เมนูหลัก');

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-6rem)] flex flex-col animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Rich Menu Builder</h1>
        <button className="bg-[#00b900] text-white px-4 py-2 rounded-lg hover:bg-[#009900] shadow-sm font-medium flex items-center gap-2">
            <Save className="w-4 h-4" />
            บันทึกและเปิดใช้งาน
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        
        {/* Left: Configuration */}
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-y-auto pr-2">
            
            {/* Basic Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Layout className="w-5 h-5 text-blue-500" />
                    ตั้งค่าพื้นฐาน
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อเมนู (สำหรับแอดมิน)</label>
                        <input 
                            type="text" 
                            value={menuName}
                            onChange={(e) => setMenuName(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#00b900] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">ข้อความ Chat Bar</label>
                        <input 
                            type="text" 
                            value={chatBarText}
                            onChange={(e) => setChatBarText(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#00b900] focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Template Selection */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Grid className="w-5 h-5 text-purple-500" />
                    เลือกรูปแบบ (Template)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {TEMPLATES.map(t => (
                        <button 
                            key={t.id}
                            onClick={() => setSelectedTemplate(t.id)}
                            className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${
                                selectedTemplate === t.id 
                                ? 'border-[#00b900] bg-green-50 text-[#00b900]' 
                                : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                            }`}
                        >
                            <div className={`w-full bg-current opacity-20 rounded ${t.id.includes('large') ? 'aspect-[2/1]' : 'aspect-[3/1]'}`}></div>
                            <span className="text-xs font-medium">{t.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Configuration */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <MousePointer className="w-5 h-5 text-orange-500" />
                    กำหนดการทำงาน (Actions)
                </h3>
                <div className="space-y-4">
                    {/* Just visual simulation of action mapping */}
                    {[...Array(selectedTemplate.includes('6') ? 6 : selectedTemplate.includes('4') ? 4 : 2)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 border border-slate-100 rounded-lg bg-slate-50">
                            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500 text-sm">
                                {String.fromCharCode(65 + i)}
                            </div>
                            <div className="flex-1">
                                <select className="w-full p-2 border border-slate-300 rounded-md text-sm">
                                    <option>ข้อความ (Message)</option>
                                    <option>ลิ้งค์ (Link)</option>
                                    <option>คูปอง (Coupon)</option>
                                </select>
                            </div>
                            <div className="flex-[2]">
                                <input 
                                    type="text" 
                                    placeholder={i === 0 ? "โปรโมชั่น" : i === 1 ? "ติดต่อเรา" : "ใส่ข้อมูล..."}
                                    className="w-full p-2 border border-slate-300 rounded-md text-sm"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right: Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
             <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h3 className="font-bold text-slate-700 text-center">ตัวอย่างการแสดงผล</h3>
             </div>
             <div className="flex-1 bg-[#2b2e38] flex items-end justify-center pb-0 overflow-hidden relative">
                {/* Phone Simulator */}
                <div className="w-full max-w-[320px] h-full flex flex-col bg-[#8c94bd] relative">
                    <div className="flex-1 p-4 flex flex-col gap-2">
                         <div className="self-start bg-white p-3 rounded-xl rounded-tl-none text-sm max-w-[80%] shadow">
                            สวัสดีค่ะ มีโปรโมชั่นใหม่สนใจไหมคะ?
                         </div>
                    </div>
                    
                    {/* Rich Menu Area */}
                    <div className="bg-[#1e2330] w-full border-t border-slate-700 shadow-2xl z-10">
                        <div className="bg-[#2a2e38] px-3 py-2 flex justify-center text-slate-400 text-xs border-b border-slate-700">
                            <span>▼ {chatBarText}</span>
                        </div>
                        <div className={`w-full bg-slate-200 relative grid gap-px border-t border-slate-300 ${
                            selectedTemplate.includes('large') ? 'aspect-[2.5/1.68]' : 'aspect-[2.5/0.84]'
                        } ${
                            selectedTemplate === 'large-6' ? 'grid-cols-3 grid-rows-2' : 
                            selectedTemplate === 'large-4' ? 'grid-cols-2 grid-rows-2' : 
                            selectedTemplate === 'compact-2' ? 'grid-cols-2' : 'grid-cols-1'
                        }`}>
                            {selectedTemplate === 'large-6' && (
                                <>
                                    <div className="bg-white flex items-center justify-center border-b border-r text-slate-300 hover:bg-green-50 hover:text-green-600 cursor-pointer">A</div>
                                    <div className="bg-white flex items-center justify-center border-b border-r text-slate-300 hover:bg-green-50 hover:text-green-600 cursor-pointer">B</div>
                                    <div className="bg-white flex items-center justify-center border-b text-slate-300 hover:bg-green-50 hover:text-green-600 cursor-pointer">C</div>
                                    <div className="bg-white flex items-center justify-center border-r text-slate-300 hover:bg-green-50 hover:text-green-600 cursor-pointer">D</div>
                                    <div className="bg-white flex items-center justify-center border-r text-slate-300 hover:bg-green-50 hover:text-green-600 cursor-pointer">E</div>
                                    <div className="bg-white flex items-center justify-center text-slate-300 hover:bg-green-50 hover:text-green-600 cursor-pointer">F</div>
                                </>
                            )}
                            {selectedTemplate === 'large-4' && (
                                <>
                                    <div className="bg-white flex items-center justify-center border-b border-r text-slate-300">A</div>
                                    <div className="bg-white flex items-center justify-center border-b text-slate-300">B</div>
                                    <div className="bg-white flex items-center justify-center border-r text-slate-300">C</div>
                                    <div className="bg-white flex items-center justify-center text-slate-300">D</div>
                                </>
                            )}
                             {selectedTemplate === 'compact-2' && (
                                <>
                                    <div className="bg-white flex items-center justify-center border-r text-slate-300">A</div>
                                    <div className="bg-white flex items-center justify-center text-slate-300">B</div>
                                </>
                            )}
                            
                            {/* Upload Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-slate-400 bg-white/80 backdrop-blur-sm p-4 rounded-xl flex flex-col items-center gap-2 shadow-sm border border-slate-200">
                                    <ImageIcon className="w-8 h-8" />
                                    <span className="text-xs font-medium">ภาพพื้นหลัง</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
             <div className="p-4 bg-white text-xs text-slate-400 text-center">
                * ภาพพื้นหลังต้องมีขนาด 2500x1686px (Large) หรือ 2500x843px (Compact)
             </div>
        </div>
      </div>
    </div>
  );
};
