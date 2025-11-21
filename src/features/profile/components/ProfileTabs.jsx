import React from 'react';
import { User, MapPin, DollarSign, Car, Heart } from 'lucide-react';

export default function ProfileTabs({ activeTab, setActiveTab, isDarkMode }) {
  const tabs = [
    { value: 'identity', label: 'IDENTITY', icon: User },
    { value: 'contact', label: 'CONTACT', icon: MapPin },
    { value: 'financial', label: 'FINANCIAL', icon: DollarSign },
    { value: 'allowances', label: 'ALLOWANCES', icon: Car },
    { value: 'health', label: 'HEALTH', icon: Heart }
  ];

  return (
    <div className={`rounded-xl border p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex gap-2 flex-wrap">
        {tabs.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setActiveTab(value)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === value 
                ? 'bg-[#7e57c2] text-white' 
                : isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}