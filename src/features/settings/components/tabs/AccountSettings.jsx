import React, { useState } from 'react';
import { Mail, Phone, Lock, Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function AccountSettings({ profile, setProfile, isEditing, isDarkMode }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* Login Email */}
      <div className="rounded-lg border border-border bg-card p-6 transition-colors duration-400">
        <h3 className="font-bold mb-6 text-lg text-foreground">LOGIN EMAIL</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-2 text-muted-foreground">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleChange('email', e.target.value.toUpperCase())}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-2 rounded-3xl border-2 border-input bg-input border-gray-100  text-foreground font-bold transition-all disabled:opacity-50 focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-2 text-muted-foreground">
              PHONE NUMBER
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-2 rounded-3xl border-2 border-input bg-input border-gray-100 text-foreground font-bold transition-all disabled:opacity-50 focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-lg border border-border bg-card p-6 transition-colors duration-400">
        <h3 className="font-bold mb-6 text-lg text-foreground">CHANGE PASSWORD</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-2 text-muted-foreground">
              CURRENT PASSWORD
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={profile.currentPassword || ''}
                onChange={(e) => handleChange('currentPassword', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter current password"
                className="w-full pl-10 pr-12 py-2 rounded-3xl border-2 border-input border-gray-100 bg-input text-foreground placeholder-muted-foreground font-bold transition-all disabled:opacity-50 focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary disabled:opacity-50"
                disabled={!isEditing}
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-2 text-muted-foreground">
              NEW PASSWORD
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={profile.newPassword || ''}
                onChange={(e) => handleChange('newPassword', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter new password"
                className="w-full pl-10 pr-12 py-2 rounded-3xl border-2 border-input border-gray-100 bg-input text-foreground placeholder-muted-foreground font-bold transition-all disabled:opacity-50 focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary disabled:opacity-50"
                disabled={!isEditing}
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-2 text-muted-foreground">
              CONFIRM NEW PASSWORD
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={profile.confirmPassword || ''}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                disabled={!isEditing}
                placeholder="Confirm new password"
                className="w-full pl-10 pr-12 py-2 rounded-3xl border-2 border-input border-gray-100 bg-input text-foreground placeholder-muted-foreground font-bold transition-all disabled:opacity-50 focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary disabled:opacity-50"
                disabled={!isEditing}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="rounded-lg border border-border bg-card p-6 transition-colors duration-400">
        <h3 className="font-bold mb-6 text-lg text-foreground">SECURITY OPTIONS</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-bold text-foreground">TWO-FACTOR AUTHENTICATION</p>
                <p className="text-xs text-muted-foreground">Add extra security with 2FA</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profile.twoFactorEnabled || false}
                onChange={(e) => {
                  handleChange('twoFactorEnabled', e.target.checked);
                  toast.success(e.target.checked ? '2FA enabled!' : '2FA disabled!');
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 rounded-full peer peer-checked:bg-primary bg-muted peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:border after:border-muted after:rounded-full after:h-5 after:w-5 after:transition-all after:bg-card"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-foreground">BIOMETRIC LOGIN</p>
                <p className="text-xs text-muted-foreground">Use fingerprint or face ID</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profile.biometricEnabled || false}
                onChange={(e) => {
                  handleChange('biometricEnabled', e.target.checked);
                  toast.success(e.target.checked ? 'Biometric enabled!' : 'Biometric disabled!');
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 rounded-full peer peer-checked:bg-primary bg-muted peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:border after:border-muted after:rounded-full after:h-5 after:w-5 after:transition-all after:bg-card"></div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold mb-2 text-muted-foreground">
              SESSION TIMEOUT (MINUTES)
            </label>
            <select
              value={profile.sessionTimeout || '30'}
              onChange={(e) => handleChange('sessionTimeout', e.target.value)}
              className="w-full px-4 py-2 rounded-3xl border border-input bg-background text-foreground font-bold transition-all focus:ring-2 focus:ring-ring outline-none"
            >
              <option value="15">15 MINUTES</option>
              <option value="30">30 MINUTES</option>
              <option value="60">60 MINUTES</option>
              <option value="120">2 HOURS</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border-2 border-destructive bg-destructive/10 p-6 transition-colors duration-400">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-destructive" />
          <h3 className="font-bold text-destructive text-lg">DANGER ZONE</h3>
        </div>
        <p className="text-sm mb-4 text-muted-foreground">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="w-full px-6 py-3 bg-destructive text-destructive-foreground rounded-lg font-bold hover:opacity-90 transition-all duration-200">
          DELETE ACCOUNT
        </button>
      </div>
    </div>
  );
}



