import React from 'react';
import { Bell, Menu, UserCircle } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="hidden md:block">
            <h2 className="text-lg font-bold text-slate-700">My Coffee Shop OA</h2>
            <p className="text-xs text-slate-400">Premium ID: @mycoffeeshop</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="h-6 w-6" />
          <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-700">Admin User</p>
            <p className="text-xs text-gray-400">Super Administrator</p>
          </div>
          <UserCircle className="h-10 w-10 text-gray-300" />
        </div>
      </div>
    </header>
  );
};
