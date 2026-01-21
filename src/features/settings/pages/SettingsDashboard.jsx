import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import SettingsSummary from '../components/SettingsSummary';
import SettingsTabs from '../components/SettingsTabs';
import AccountSettings from '../components/tabs/AccountSettings';
import DisplaySettings from '../components/tabs/DisplaySettings';
import NotificationsSettings from '../components/tabs/NotificationsSettings';
import PrivacySettings from '../components/tabs/PrivacySettings';
import RegionalSettings from '../components/tabs/RegionalSettings';
import DataSettings from '../components/tabs/DataSettings';
import AgentAccessSettings from '../components/tabs/AgentAccessSettings';
import ActivityLogsSettings from '../components/tabs/ActivityLogsSettings';
import { div } from 'framer-motion/client';

export default function SettingsDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Get active tab from URL or default to 'account'
  const getTabFromUrl = () => {
    const path = location.pathname.split('/').pop();
    const validTabs = ['account', 'display', 'notifications', 'privacy', 'regional', 'data', 'agent', 'activity'];
    return validTabs.includes(path) ? path : 'account';
  };

  const [activeTab, setActiveTab] = useState(getTabFromUrl());

  // Update URL when tab changes
  useEffect(() => {
    const currentTab = getTabFromUrl();
    if (currentTab !== activeTab) {
      navigate(`/settings/${activeTab}`, { replace: true });
    }
  }, [activeTab, navigate]);

  // Update tab when URL changes (browser back/forward)
  useEffect(() => {
    const tabFromUrl = getTabFromUrl();
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [location.pathname]);

  // Settings profile state
  const [profile, setProfile] = useState({
    // Account
    email: 'SHEFALI.GAJBHIYE@EAARTHSTUDIOS.COM',
    phone: '+91 98765 43210',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    biometricEnabled: false,
    sessionTimeout: '30',

    // Display
    theme: 'light',
    displayDensity: 'comfortable',
    fontSize: 'medium',
    reduceMotion: false,

    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    notifyDocumentExpiry: true,
    documentExpiryDays: '180',
    notifyContractStatus: true,
    notifyContractRenewal: true,
    notifyProjectUpdates: true,
    notifyProjectAssignment: true,
    notifyProjectMilestones: true,
    notifyTaskAssignment: true,
    notifyTaskDeadline: true,
    notifyTimesheetReminders: true,
    timesheetReminderDay: 'friday',
    notifyApprovals: true,
    notifyLeaveRequests: true,
    notifyExpenseClaims: true,
    notifyDirectMessages: true,
    notifyMentions: true,
    notifyProjectChat: false,

    // Privacy
    profileVisibility: 'team',
    showEmail: true,
    showPhone: false,
    allowDataSharing: false,
    searchableProfile: true,
    showOnlineStatus: true,

    // Regional
    language: 'en-GB',
    timezone: 'UTC+0',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'GBP',
    firstDayOfWeek: 'monday',

    // Data
    dataRetention: 'never',
    autoSaveEnabled: true,
    autoSaveInterval: '5',
    clearCacheOnExit: false,
    offlineMode: false,
    exportFormat: 'PDF',
    backupFrequency: 'weekly',
  });

  const handleSave = () => {
    if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }

    console.log('Saving settings...', profile);
    setIsEditing(false);

    // Clear password fields after save
    setProfile({
      ...profile,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    toast.success('✅ Settings saved successfully!');
  };

  const handleCancel = () => {
    console.log('Cancelled changes');
    setIsEditing(false);
    toast.info('Changes cancelled');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen transition-colors duration-400 ">
      <div className="container mx-auto  space-y-6">
        {/* HEADER + SUMMARY */}
        <SettingsSummary
          isDarkMode={isDarkMode}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleSave={handleSave}
          handleCancel={handleCancel}
        />

        {/* TABS */}
        <SettingsTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isDarkMode={isDarkMode}
        />

        {/* TAB CONTENTS */}
        <div className="rounded-lg border shadow-md border-border bg-card p-6 transition-colors duration-400">
          {activeTab === 'account' && (
            <AccountSettings
              profile={profile}
              setProfile={setProfile}
              isEditing={isEditing}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'display' && (
            <DisplaySettings
              profile={profile}
              setProfile={setProfile}
              isEditing={isEditing}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsSettings
              profile={profile}
              setProfile={setProfile}
              isEditing={isEditing}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'privacy' && (
            <PrivacySettings
              profile={profile}
              setProfile={setProfile}
              isEditing={isEditing}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'regional' && (
            <RegionalSettings
              profile={profile}
              setProfile={setProfile}
              isEditing={isEditing}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'data' && (
            <DataSettings
              profile={profile}
              setProfile={setProfile}
              isEditing={isEditing}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'agent' && (
            <AgentAccessSettings
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'activity' && (
            <ActivityLogsSettings
              isDarkMode={isDarkMode}
            />
          )}
        </div>
      </div>
    </div>
  );
}







