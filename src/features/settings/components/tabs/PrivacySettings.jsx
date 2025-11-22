import React from 'react';
import { Shield, Users, Eye, Mail, Phone, Lock } from 'lucide-react';

export default function PrivacySettings({ profile, setProfile, isEditing, isDarkMode }) {
  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const Toggle = ({ label, checked, onChange, description, icon: Icon }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
        <div>
          <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {label}
          </p>
          {description && (
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {description}
            </p>
          )}
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer ml-4">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={!isEditing}
          className="sr-only peer"
        />
        <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
          checked ? 'bg-purple-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
        } ${!isEditing ? 'opacity-50' : ''}`}></div>
      </label>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Profile Visibility */}
      <div className={`rounded-3xl border p-6 transition-colors ${
        isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-purple-200'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            PROFILE VISIBILITY
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className={`block text-xs font-bold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              WHO CAN SEE YOUR PROFILE
            </label>
            <select
              value={profile.profileVisibility || 'team'}
              onChange={(e) => handleChange('profileVisibility', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-lg border-2 font-bold transition-all ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-purple-200 text-gray-900'
              } ${!isEditing ? 'opacity-50' : ''} focus:ring-2 focus:ring-purple-500 outline-none`}
            >
              <option value="public">PUBLIC - EVERYONE</option>
              <option value="team">TEAM ONLY - MY ORGANIZATION</option>
              <option value="private">PRIVATE - ONLY ME</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className={`rounded-3xl border p-6 transition-colors ${
        isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-purple-200'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            CONTACT INFORMATION
          </h3>
        </div>
        
        <div className="space-y-4">
          <Toggle 
            label="SHOW EMAIL ADDRESS" 
            checked={profile.showEmail !== false} 
            onChange={(checked) => handleChange('showEmail', checked)}
            description="Display your email on your profile"
            icon={Mail}
          />
          <Toggle 
            label="SHOW PHONE NUMBER" 
            checked={profile.showPhone || false} 
            onChange={(checked) => handleChange('showPhone', checked)}
            description="Display your phone number on your profile"
            icon={Phone}
          />
        </div>
      </div>

      {/* Profile Discoverability */}
      <div className={`rounded-3xl border p-6 transition-colors ${
        isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-purple-200'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            PROFILE DISCOVERABILITY
          </h3>
        </div>
        
        <div className="space-y-4">
          <Toggle 
            label="SEARCHABLE PROFILE" 
            checked={profile.searchableProfile !== false} 
            onChange={(checked) => handleChange('searchableProfile', checked)}
            description="Allow others to find you in search"
          />
          <Toggle 
            label="SHOW ONLINE STATUS" 
            checked={profile.showOnlineStatus !== false} 
            onChange={(checked) => handleChange('showOnlineStatus', checked)}
            description="Display when you're online"
          />
        </div>
      </div>

      {/* Data Sharing */}
      <div className={`rounded-3xl border p-6 transition-colors ${
        isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-purple-200'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            DATA SHARING
          </h3>
        </div>
        
        <div className="space-y-4">
          <Toggle 
            label="ALLOW DATA SHARING WITH PARTNERS" 
            checked={profile.allowDataSharing || false} 
            onChange={(checked) => handleChange('allowDataSharing', checked)}
            description="Share anonymized data for service improvement"
          />
        </div>
      </div>
    </div>
  );
}