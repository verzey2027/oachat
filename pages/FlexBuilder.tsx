import React, { useState } from 'react';
import { Code, Layout, Smartphone, Save } from 'lucide-react';

export const FlexBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');
  const [jsonCode, setJsonCode] = useState(`{
  "type": "bubble",
  "hero": {
    "type": "image",
    "url": "https://picsum.photos/700/400",
    "size": "full",
    "aspectRatio": "20:13",
    "aspectMode": "cover"
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "Brown Cafe",
        "weight": "bold",
        "size": "xl"
      },
      {
        "type": "box",
        "layout": "vertical",
        "margin": "lg",
        "spacing": "sm",
        "contents": [
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "Place",
                "color": "#aaaaaa",
                "size": "sm",
                "flex": 1
              },
              {
                "type": "text",
                "text": "Miraina Tower, 4-1-6 Shinjuku, Tokyo",
                "wrap": true,
                "color": "#666666",
                "size": "sm",
                "flex": 5
              }
            ]
          }
        ]
      }
    ]
  }
}`);

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Flex Message Builder</h1>
        <button className="flex items-center gap-2 bg-[#00b900] text-white px-4 py-2 rounded-lg hover:bg-[#009900] shadow-sm font-medium">
            <Save className="w-4 h-4" />
            บันทึกเทมเพลต
        </button>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row">
        
        {/* Editor Pane */}
        <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200">
             <div className="flex border-b border-slate-100">
                <button 
                    onClick={() => setActiveTab('visual')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'visual' ? 'text-[#00b900] border-b-2 border-[#00b900]' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <Layout className="w-4 h-4" /> Visual Editor
                </button>
                <button 
                    onClick={() => setActiveTab('json')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'json' ? 'text-[#00b900] border-b-2 border-[#00b900]' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <Code className="w-4 h-4" /> JSON Code
                </button>
             </div>

             <div className="flex-1 p-0 overflow-auto bg-slate-50">
                {activeTab === 'visual' ? (
                    <div className="p-8 flex items-center justify-center h-full text-slate-400 flex-col gap-4">
                        <Layout className="w-16 h-16 opacity-20" />
                        <p>Visual Editor อยู่ในระหว่างการพัฒนา</p>
                        <p className="text-sm">โปรดใช้ JSON Editor ในขณะนี้</p>
                    </div>
                ) : (
                    <textarea 
                        className="w-full h-full p-4 font-mono text-sm text-slate-700 focus:outline-none resize-none bg-[#f8fafc]"
                        value={jsonCode}
                        onChange={(e) => setJsonCode(e.target.value)}
                        spellCheck={false}
                    />
                )}
             </div>
        </div>

        {/* Preview Pane */}
        <div className="w-full lg:w-[400px] bg-slate-100 flex flex-col">
            <div className="p-3 border-b border-slate-200 bg-white flex items-center justify-between">
                <span className="font-semibold text-slate-700 flex items-center gap-2">
                    <Smartphone className="w-4 h-4" /> Preview
                </span>
            </div>
            <div className="flex-1 flex items-center justify-center p-6 bg-[#8c94bd]">
                 {/* Flex Bubble Simulation */}
                 <div className="w-full max-w-sm bg-white rounded-lg overflow-hidden shadow-lg">
                    {/* Parsing simplistic JSON for demo preview - In real app, use a real renderer */}
                    <div className="relative h-48 bg-slate-200">
                        <img 
                            src="https://picsum.photos/700/400" 
                            alt="Hero" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-4 space-y-2">
                        <h3 className="font-bold text-xl text-slate-800">Brown Cafe</h3>
                        <div className="flex items-start gap-4 text-sm">
                            <span className="text-slate-400 w-10 shrink-0">Place</span>
                            <span className="text-slate-600">Miraina Tower, 4-1-6 Shinjuku, Tokyo</span>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};
