import React from 'react';
import { 
  User, 
  MapPin, 
  Heart, 
  DollarSign, 
  Car
} from 'lucide-react';

// Define profile tab types
// export type ProfileTab = 
//   | 'identity'
//   | 'contact'
//   | 'financial'
//   | 'allowances'
//   | 'health';

export function ProfileTabsNav({ activeTab, onTabChange, isDarkMode }) {
  const tabs = [
    { id: 'identity', label: 'IDENTITY & PERSONAL', icon: User },
    { id: 'contact', label: 'CONTACT & ADDRESS', icon: MapPin },
    { id: 'financial', label: 'FINANCIAL & TAX', icon: DollarSign },
    { id: 'allowances', label: 'ALLOWANCES & CLAIMS', icon: Car },
    { id: 'health', label: 'HEALTH & DIETARY', icon: Heart },
  ];

  const TabButton = ({ tab }) => {
    const isActive = activeTab === tab.id;
    const Icon = tab.icon;
    
    return (
      <button
        // onClick={() => onTabChange(tab.id)}
        className={`
          px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 font-bold uppercase text-sm
          ${isActive 
            ? isDarkMode 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
            : isDarkMode 
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border-2 border-gray-700' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border-2 border-gray-300'
          }
        `}
      >
        <Icon className="w-4 h-4" />
        <span>{tab.label}</span>
      </button>
    );
  };

  return (
    <div className={`
      rounded-xl p-4 mb-6 border
      ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    `}>
      <div className="flex flex-wrap gap-3 justify-center">
        {tabs.map((tab) => (
          <TabButton key={tab.id} tab={tab} />
        ))}
      </div>
    </div>
  );
}

// Alternative pill-style tabs
export function ProfileTabsPill({ activeTab, onTabChange, isDarkMode }) {
  const tabs = [
    { id: 'identity', label: 'IDENTITY', icon: User },
    { id: 'contact', label: 'CONTACT', icon: MapPin },
    { id: 'financial', label: 'FINANCIAL', icon: DollarSign },
    { id: 'allowances', label: 'ALLOWANCES', icon: Car },
    { id: 'health', label: 'HEALTH', icon: Heart },
  ];

  return (
    <div className="flex justify-center mb-6">
      <div className={`inline-flex gap-2 p-1 rounded-full ${
        isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              // onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : isDarkMode
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}