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
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-primary-foreground" />
          </div>
        )}
        <div>
          <p className="font-bold text-foreground">
            {label}
          </p>
          {description && (
            <p className="text-xs mt-1 text-muted-foreground">
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
        <div className={`w-11 h-6 rounded-full peer peer-checked:bg-primary bg-muted peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border after:border-muted after:rounded-full after:h-5 after:w-5 after:transition-all ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
      </label>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Profile Visibility */}
      <div className="rounded-lg border border-border bg-card p-6 transition-colors duration-400">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Users className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="font-bold text-lg text-foreground">
            PROFILE VISIBILITY
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-2 text-muted-foreground">
              WHO CAN SEE YOUR PROFILE
            </label>
            <select
              value={profile.profileVisibility || 'team'}
              onChange={(e) => handleChange('profileVisibility', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 rounded-lg border-2 border-input bg-input text-foreground font-bold transition-all disabled:opacity-50 focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none"
            >
              <option value="public">PUBLIC - EVERYONE</option>
              <option value="team">TEAM ONLY - MY ORGANIZATION</option>
              <option value="private">PRIVATE - ONLY ME</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="rounded-lg border border-border bg-card p-6 transition-colors duration-400">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="font-bold text-lg text-foreground">
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
      <div className="rounded-lg border border-border bg-card p-6 transition-colors duration-400">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Eye className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="font-bold text-lg text-foreground">
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
      <div className="rounded-lg border border-border bg-card p-6 transition-colors duration-400">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="font-bold text-lg text-foreground">
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



