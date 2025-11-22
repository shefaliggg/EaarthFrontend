import { motion, AnimatePresence } from 'framer-motion';
import { Save, Bell, Shield, Eye, Users, Globe, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// Import tab components
import { AccountInfoTab } from '../components/settings/tabs/AccountInfoTab';
import { NotificationsTab } from '../components/settings/tabs/NotificationsTab';
import { PrivacyTab } from '../components/settings/tabs/PrivacyTab';
import { SecurityTab } from '../components/settings/tabs/SecurityTab';
import { AccessTab } from '../components/settings/tabs/AccessTab';
import { AppearanceTab } from '../components/settings/tabs/AppearanceTab';

export default function AccountSettings({ isDarkMode }) {
  const [activeTab, setActiveTab] = useState('account');
  const [isEditing, setIsEditing] = useState(false);
  const [agentEmail, setAgentEmail] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState({
    viewProfile: true,
    editProfile: false,
    manageDocuments: false,
    manageProjects: false,
  });
  
  const [settings, setSettings] = useState({
    email: 'shefali.gajbhiye@eaarthstudios.com',
    phone: '+91 98765 43210',
    language: 'English',
    timezone: 'Asia/Kolkata (IST)',
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: false,
    },
    twoFactor: false,
  });

  const [agentAccesses, setAgentAccesses] = useState([
    {
      id: 1,
      email: 'agent@talentagency.com',
      name: 'Rajesh Kumar',
      role: 'Talent Agent',
      permissions: {
        viewProfile: true,
        editProfile: true,
        manageDocuments: true,
        manageProjects: true,
      },
      grantedDate: '15/01/2024',
      status: 'active',
    },
  ]);

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Settings updated successfully!');
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'access', label: 'Access', icon: Users },
    { id: 'appearance', label: 'Appearance', icon: Globe },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 md:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto"
      >
        {/* Tabs and Edit Button */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          {/* Centered Pill Tabs */}
          <div className="flex justify-center lg:justify-start flex-1">
            <div className="inline-flex gap-2 p-1 rounded-full bg-muted">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:bg-card hover:text-foreground'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {activeTab !== 'access' && activeTab !== 'appearance' && (
            isEditing ? (
              <motion.button
                onClick={handleSave}
                className="px-4 py-2 bg-accent text-accent-foreground rounded-lg flex items-center gap-2 hover:opacity-90 transition-all duration-300 font-medium shadow-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </motion.button>
            ) : (
              <motion.button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-300 font-medium shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Edit
              </motion.button>
            )
          )}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'account' && (
            <AccountInfoTab 
              settings={settings} 
              setSettings={setSettings} 
              isEditing={isEditing} 
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsTab 
              settings={settings} 
              setSettings={setSettings} 
              isEditing={isEditing} 
            />
          )}

          {activeTab === 'privacy' && (
            <PrivacyTab 
              settings={settings} 
              setSettings={setSettings} 
              isEditing={isEditing} 
            />
          )}

          {activeTab === 'security' && (
            <SecurityTab 
              settings={settings} 
              setSettings={setSettings} 
              isEditing={isEditing} 
            />
          )}

          {activeTab === 'access' && (
            <AccessTab
              agentAccesses={agentAccesses}
              setAgentAccesses={setAgentAccesses}
              agentEmail={agentEmail}
              setAgentEmail={setAgentEmail}
              selectedPermissions={selectedPermissions}
              setSelectedPermissions={setSelectedPermissions}
            />
          )}

          {activeTab === 'appearance' && (
            <AppearanceTab isDarkMode={isDarkMode} />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}