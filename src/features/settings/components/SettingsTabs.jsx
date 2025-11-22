import React from 'react';
import { Lock, Sun, Bell, Shield, Globe, Database, Users, Activity } from 'lucide-react';

export default function SettingsTabs({ activeTab, setActiveTab, isDarkMode }) {
  const tabs = [
    { value: 'account', label: 'ACCOUNT', icon: Lock },
    { value: 'display', label: 'DISPLAY', icon: Sun },
    { value: 'notifications', label: 'NOTIFICATIONS', icon: Bell },
    { value: 'privacy', label: 'PRIVACY', icon: Shield },
    { value: 'regional', label: 'REGIONAL', icon: Globe },
    { value: 'data', label: 'DATA', icon: Database },
    { value: 'agent', label: 'AGENT ACCESS', icon: Users },
    { value: 'activity', label: 'ACTIVITY', icon: Activity },
  ];

  return (
    <div className="rounded-3xl border border-border bg-card p-4 transition-colors duration-400">
      <div className="flex flex-wrap gap-2">
        {tabs.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setActiveTab(value)}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm border ${
              activeTab === value
                ? isDarkMode
                  ? 'bg-lavender-400 text-black'
                  : 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}