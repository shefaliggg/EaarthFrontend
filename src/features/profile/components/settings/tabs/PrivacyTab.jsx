import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

export function PrivacyTab({ settings, setSettings, isEditing }) {
  return (
    <motion.div
      key="privacy"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg p-6 shadow-md border border-border"
    >
      <div className="flex items-center gap-2 mb-4">
        <Eye className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Privacy Settings</h2>
      </div>
      
      <div className="space-y-3">
        <label className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors duration-200">
          <span className="text-sm font-medium text-foreground">Profile Visible to Productions</span>
          <input
            type="checkbox"
            checked={settings.privacy.profileVisible}
            onChange={(e) => setSettings({
              ...settings,
              privacy: { ...settings.privacy, profileVisible: e.target.checked }
            })}
            disabled={!isEditing}
            className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary disabled:opacity-60"
          />
        </label>

        <label className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors duration-200">
          <span className="text-sm font-medium text-foreground">Show Email Address</span>
          <input
            type="checkbox"
            checked={settings.privacy.showEmail}
            onChange={(e) => setSettings({
              ...settings,
              privacy: { ...settings.privacy, showEmail: e.target.checked }
            })}
            disabled={!isEditing}
            className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary disabled:opacity-60"
          />
        </label>

        <label className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors duration-200">
          <span className="text-sm font-medium text-foreground">Show Phone Number</span>
          <input
            type="checkbox"
            checked={settings.privacy.showPhone}
            onChange={(e) => setSettings({
              ...settings,
              privacy: { ...settings.privacy, showPhone: e.target.checked }
            })}
            disabled={!isEditing}
            className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary disabled:opacity-60"
          />
        </label>
      </div>
    </motion.div>
  );
}



