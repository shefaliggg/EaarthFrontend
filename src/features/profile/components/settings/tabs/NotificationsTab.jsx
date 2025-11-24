import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

export function NotificationsTab({ settings, setSettings, isEditing }) {
  return (
    <motion.div
      key="notifications"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg p-6 shadow-md border border-border"
    >
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
      </div>
      
      <div className="space-y-3">
        <label className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors duration-200">
          <span className="text-sm font-medium text-foreground">Email Notifications</span>
          <input
            type="checkbox"
            checked={settings.notifications.email}
            onChange={(e) => setSettings({
              ...settings,
              notifications: { ...settings.notifications, email: e.target.checked }
            })}
            disabled={!isEditing}
            className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary disabled:opacity-60"
          />
        </label>

        <label className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors duration-200">
          <span className="text-sm font-medium text-foreground">SMS Notifications</span>
          <input
            type="checkbox"
            checked={settings.notifications.sms}
            onChange={(e) => setSettings({
              ...settings,
              notifications: { ...settings.notifications, sms: e.target.checked }
            })}
            disabled={!isEditing}
            className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary disabled:opacity-60"
          />
        </label>

        <label className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors duration-200">
          <span className="text-sm font-medium text-foreground">Push Notifications</span>
          <input
            type="checkbox"
            checked={settings.notifications.push}
            onChange={(e) => setSettings({
              ...settings,
              notifications: { ...settings.notifications, push: e.target.checked }
            })}
            disabled={!isEditing}
            className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary disabled:opacity-60"
          />
        </label>
      </div>
    </motion.div>
  );
}



