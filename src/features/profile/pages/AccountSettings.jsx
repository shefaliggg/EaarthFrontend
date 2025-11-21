import { motion, AnimatePresence } from "framer-motion";

import { Save, Mail, Phone, Globe, Bell, Shield, Eye, UserPlus, Users, Trash2, Check, User, Moon, Sun, Upload } from 'lucide-react';
import { useState } from 'react';

// Toast notification function (simplified)
const toast = {
  success: (message) => console.log('Success:', message),
  error: (message) => console.log('Error:', message),
  info: (message) => console.log('Info:', message),
};

// AppearanceSettings Component
function AppearanceSettings() {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');
  const [compactMode, setCompactMode] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-bold text-purple-600">Appearance Settings</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
          <span className="text-sm font-medium text-gray-700">Compact Mode</span>
          <input
            type="checkbox"
            checked={compactMode}
            onChange={(e) => setCompactMode(e.target.checked)}
            className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
          />
        </label>
      </div>
    </div>
  );
}

// Main AccountSettings Component
export default function AccountSettings() {
  const isDarkMode = false;
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
      name: 'RAJESH KUMAR',
      role: 'TALENT AGENT',
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

  const handleGiveAccess = () => {
    if (!agentEmail) {
      toast.error('Please enter agent email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(agentEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const newAgent = {
      id: agentAccesses.length + 1,
      email: agentEmail.toLowerCase(),
      name: 'NEW AGENT',
      role: 'AGENT',
      permissions: selectedPermissions,
      grantedDate: new Date().toLocaleDateString('en-GB'),
      status: 'pending',
    };

    setAgentAccesses([...agentAccesses, newAgent]);
    setAgentEmail('');
    setSelectedPermissions({
      viewProfile: true,
      editProfile: false,
      manageDocuments: false,
      manageProjects: false,
    });
    toast.success('Access invitation sent to agent!');
  };

  const handleRevokeAccess = (id) => {
    setAgentAccesses(agentAccesses.filter(agent => agent.id !== id));
    toast.success('Agent access revoked successfully');
  };

  const tabs = [
    { id: 'account', label: 'ACCOUNT', icon: User },
    { id: 'notifications', label: 'NOTIFICATIONS', icon: Bell },
    { id: 'privacy', label: 'PRIVACY', icon: Eye },
    { id: 'security', label: 'SECURITY', icon: Shield },
    { id: 'access', label: 'ACCESS', icon: Users },
    { id: 'appearance', label: 'APPEARANCE', icon: Globe },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <div className="flex justify-center lg:justify-start flex-1">
            <div className={`inline-flex gap-2 p-1 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-bold ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : isDarkMode
                          ? 'text-gray-300 hover:bg-gray-600'
                          : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {activeTab !== 'access' && (
            isEditing ? (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>SAVE</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all font-bold"
              >
                EDIT
              </button>
            )
          )}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'account' && (
            <motion.div
              key="account"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-lg font-bold text-purple-600 mb-4">Account Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                    >
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                    >
                      <option>Asia/Kolkata (IST)</option>
                      <option>America/New_York (EST)</option>
                      <option>America/Los_Angeles (PST)</option>
                      <option>Europe/London (GMT)</option>
                      <option>Australia/Sydney (AEDT)</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold text-purple-600">Notification Preferences</h2>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, email: e.target.checked }
                    })}
                    disabled={!isEditing}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-medium text-gray-700">SMS Notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications.sms}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, sms: e.target.checked }
                    })}
                    disabled={!isEditing}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-medium text-gray-700">Push Notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, push: e.target.checked }
                    })}
                    disabled={!isEditing}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                  />
                </label>
              </div>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold text-purple-600">Privacy Settings</h2>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-medium text-gray-700">Profile Visible to Productions</span>
                  <input
                    type="checkbox"
                    checked={settings.privacy.profileVisible}
                    onChange={(e) => setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, profileVisible: e.target.checked }
                    })}
                    disabled={!isEditing}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-medium text-gray-700">Show Email Address</span>
                  <input
                    type="checkbox"
                    checked={settings.privacy.showEmail}
                    onChange={(e) => setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, showEmail: e.target.checked }
                    })}
                    disabled={!isEditing}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-medium text-gray-700">Show Phone Number</span>
                  <input
                    type="checkbox"
                    checked={settings.privacy.showPhone}
                    onChange={(e) => setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, showPhone: e.target.checked }
                    })}
                    disabled={!isEditing}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                  />
                </label>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold text-purple-600">Security</h2>
              </div>
              
              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Two-Factor Authentication</div>
                    <div className="text-xs text-gray-500">Add an extra layer of security to your account</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.twoFactor}
                    onChange={(e) => {
                      setSettings({ ...settings, twoFactor: e.target.checked });
                      if (e.target.checked) {
                        toast.success('Two-factor authentication enabled');
                      } else {
                        toast.info('Two-factor authentication disabled');
                      }
                    }}
                    disabled={!isEditing}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                  />
                </label>

                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <strong>Note:</strong> For password changes, please use the "Change Password" option in Settings menu.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'access' && (
            <motion.div
              key="access"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-1 h-16 bg-purple-600 rounded-full"></div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Your Account</h2>
                    <p className="text-gray-500">Give another person access to your account</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipient's Email Address</label>
                    <input
                      type="email"
                      value={agentEmail}
                      onChange={(e) => setAgentEmail(e.target.value)}
                      placeholder="agent@example.com"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
                    <div className="space-y-2">
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <span className="text-sm font-medium text-gray-700">View Profile</span>
                        <input
                          type="checkbox"
                          checked={selectedPermissions.viewProfile}
                          onChange={(e) => setSelectedPermissions({ ...selectedPermissions, viewProfile: e.target.checked })}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <span className="text-sm font-medium text-gray-700">Edit Profile</span>
                        <input
                          type="checkbox"
                          checked={selectedPermissions.editProfile}
                          onChange={(e) => setSelectedPermissions({ ...selectedPermissions, editProfile: e.target.checked })}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <span className="text-sm font-medium text-gray-700">Manage Documents</span>
                        <input
                          type="checkbox"
                          checked={selectedPermissions.manageDocuments}
                          onChange={(e) => setSelectedPermissions({ ...selectedPermissions, manageDocuments: e.target.checked })}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <span className="text-sm font-medium text-gray-700">Manage Projects</span>
                        <input
                          type="checkbox"
                          checked={selectedPermissions.manageProjects}
                          onChange={(e) => setSelectedPermissions({ ...selectedPermissions, manageProjects: e.target.checked })}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                        />
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleGiveAccess}
                    className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Give Access</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg font-bold text-purple-600">People with Access</h2>
                </div>

                {agentAccesses.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No agents have access to your account</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {agentAccesses.map((agent) => (
                      <div
                        key={agent.id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900">{agent.name}</h3>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                agent.status === 'active' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {agent.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{agent.email}</p>
                            <p className="text-xs text-gray-500">Role: {agent.role} • Granted: {agent.grantedDate}</p>
                            
                            <div className="flex flex-wrap gap-2 mt-3">
                              {agent.permissions.viewProfile && (
                                <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full flex items-center gap-1">
                                  <Check className="w-3 h-3" /> View
                                </span>
                              )}
                              {agent.permissions.editProfile && (
                                <span className="px-2 py-1 text-xs bg-purple-50 text-purple-700 rounded-full flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Edit
                                </span>
                              )}
                              {agent.permissions.manageDocuments && (
                                <span className="px-2 py-1 text-xs bg-orange-50 text-orange-700 rounded-full flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Documents
                                </span>
                              )}
                              {agent.permissions.manageProjects && (
                                <span className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded-full flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Projects
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleRevokeAccess(agent.id)}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Revoke Access</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'appearance' && (
            <motion.div
              key="appearance"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <AppearanceSettings />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}