import React from 'react';
import { Languages, Globe, Calendar, Clock, DollarSign } from 'lucide-react';

export default function RegionalSettings({ profile, setProfile, isEditing, isDarkMode }) {
  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* Language & Locale */}
      <div className="rounded-3xl border border-border bg-card p-6 transition-colors duration-400">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Languages className="w-5 h-5 text-primary-foreground" />
              </div>
              <label className="font-bold text-foreground">
                LANGUAGE
              </label>
            </div>
            <select
              value={profile.language || 'en-GB'}
              onChange={(e) => handleChange('language', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-3xl border-2 border-input bg-input text-foreground font-bold transition-all disabled:opacity-50 focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none"
            >
              <option value="en-GB">ENGLISH (UK)</option>
              <option value="en-US">ENGLISH (US)</option>
              <option value="hi">HINDI</option>
              <option value="es">SPANISH</option>
              <option value="fr">FRENCH</option>
            </select>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary-foreground" />
              </div>
              <label className="font-bold text-foreground">
                TIMEZONE
              </label>
            </div>
            <select
              value={profile.timezone || 'UTC+0'}
              onChange={(e) => handleChange('timezone', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-3xl border-2 border-input bg-input text-foreground font-bold transition-all disabled:opacity-50 focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none"
            >
              <option value="UTC+0">UTC+0 (LONDON, GMT)</option>
              <option value="UTC+5:30">UTC+5:30 (INDIA, IST)</option>
              <option value="UTC-5">UTC-5 (NEW YORK, EST)</option>
              <option value="UTC-8">UTC-8 (LOS ANGELES, PST)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Date & Time Formats */}
      <div className="rounded-3xl border border-border bg-card p-6 transition-colors duration-400">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-foreground" />
              </div>
              <label className="font-bold text-foreground">
                DATE FORMAT
              </label>
            </div>
            <select
              value={profile.dateFormat || 'DD/MM/YYYY'}
              onChange={(e) => handleChange('dateFormat', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-3xl border-2 border-input bg-input text-foreground font-bold transition-all disabled:opacity-50 focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
            </select>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary-foreground" />
              </div>
              <label className="font-bold text-foreground">
                TIME FORMAT
              </label>
            </div>
            <select
              value={profile.timeFormat || '24h'}
              onChange={(e) => handleChange('timeFormat', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-3xl border-2 border-input bg-input text-foreground font-bold transition-all disabled:opacity-50 focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none"
            >
              <option value="24h">24 HOUR (14:30)</option>
              <option value="12h">12 HOUR (2:30 PM)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Currency & Calendar */}
      <div className="rounded-3xl border border-border bg-card p-6 transition-colors duration-400">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary-foreground" />
              </div>
              <label className="font-bold text-foreground">
                CURRENCY
              </label>
            </div>
            <select
              value={profile.currency || 'GBP'}
              onChange={(e) => handleChange('currency', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-3xl border-2 border-input bg-input text-foreground font-bold transition-all disabled:opacity-50 focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none"
            >
              <option value="GBP">GBP (£) - BRITISH POUND</option>
              <option value="USD">USD ($) - US DOLLAR</option>
              <option value="EUR">EUR (€) - EURO</option>
              <option value="INR">INR (₹) - INDIAN RUPEE</option>
            </select>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-foreground" />
              </div>
              <label className="font-bold text-foreground">
                FIRST DAY OF WEEK
              </label>
            </div>
            <select
              value={profile.firstDayOfWeek || 'monday'}
              onChange={(e) => handleChange('firstDayOfWeek', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-3xl border-2 border-input bg-input text-foreground font-bold transition-all disabled:opacity-50 focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none"
            >
              <option value="monday">MONDAY</option>
              <option value="sunday">SUNDAY</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}