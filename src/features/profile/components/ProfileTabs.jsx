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
    <div className="rounded-3xl border p-6 bg-card border-border">
      <div className="flex gap-2 flex-wrap">
        {tabs.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setActiveTab(value)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === value 
                ? isDarkMode
                  ? 'bg-lavender-400 text-black'
                  : 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-muted/80'
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



