import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { User, MapPin, DollarSign, CreditCard, Building, FileText, Calendar } from 'lucide-react';

// interface ProfileLayoutProps {
//   children: ReactNode;
//   currentTab: 'general' | 'contact' | 'allowances' | 'payment' | 'company' | 'documents' | 'calendar';
//   onTabChange: (tab: 'general' | 'contact' | 'allowances' | 'payment' | 'company' | 'documents' | 'calendar') => void;
//   isDarkMode?: boolean;
// }

export function ProfileLayout({ children, currentTab, onTabChange, isDarkMode = false }) {
  const tabs = [
    { id: 'general' , label: 'GENERAL', icon: User },
    { id: 'contact' , label: 'CONTACT', icon: MapPin },
    { id: 'allowances' , label: 'ALLOWANCES', icon: DollarSign },
    { id: 'payment' , label: 'PAYMENT', icon: CreditCard },
    { id: 'company' , label: 'COMPANY', icon: Building },
    { id: 'documents' , label: 'DOCUMENTS', icon: FileText },
    { id: 'calendar' , label: 'CALENDAR', icon: Calendar },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Profile Header */}
      <div className="px-4 md:px-6 pt-6 pb-4">
        {/* Centered Purple Pill Tabs */}
        <div className="flex justify-center">
          <div className={`inline-flex gap-2 p-1 rounded-full ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                    currentTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : isDarkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}