
import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area
} from 'recharts';
import { Users, MessageCircle, UserX, Activity } from 'lucide-react';
import { getInboxUsers } from '../services/storageService';

const chartData = [
  { name: 'จ.', users: 4000, msgs: 2400 },
  { name: 'อ.', users: 3000, msgs: 1398 },
  { name: 'พ.', users: 2000, msgs: 9800 },
  { name: 'พฤ.', users: 2780, msgs: 3908 },
  { name: 'ศ.', users: 1890, msgs: 4800 },
  { name: 'ส.', users: 2390, msgs: 3800 },
  { name: 'อา.', users: 3490, msgs: 4300 },
];

const StatCard = ({ title, value, subValue, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <p className={`text-xs mt-2 font-medium ${subValue.includes('+') ? 'text-green-600' : 'text-red-500'}`}>
        {subValue} จากสัปดาห์ที่แล้ว
      </p>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
      users: 0,
      messages: 0,
      active: 0
  });

  useEffect(() => {
      const users = getInboxUsers();
      let totalMessages = 0;
      users.forEach(u => {
          totalMessages += u.messages.length;
      });
      
      setStats({
          users: users.length,
          messages: totalMessages,
          active: Math.ceil(users.length * 0.8) // Simulated active count
      });
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">แดชบอร์ดภาพรวม</h1>
        <div className="text-sm text-slate-500">อัปเดตล่าสุด: วันนี้, {new Date().toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})} น.</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="เพื่อนทั้งหมด" value={stats.users.toLocaleString()} subValue="+12%" icon={Users} color="bg-blue-500" />
        <StatCard title="ข้อความทั้งหมด" value={stats.messages.toLocaleString()} subValue="+24%" icon={MessageCircle} color="bg-green-500" />
        <StatCard title="Block Rate" value="0.5%" subValue="-0.1%" icon={UserX} color="bg-red-400" />
        <StatCard title="Active Users" value={stats.active.toLocaleString()} subValue="+5%" icon={Activity} color="bg-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">สถิติเพื่อนใหม่</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">จำนวนข้อความที่ส่ง</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="msgs" fill="#00b900" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
