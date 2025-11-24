import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';

export function AccountInfoTab({ settings, setSettings, isEditing }) {
  return (
    <motion.div
      key="account"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg p-6 border border-border"
    >
      <h2 className="text-lg font-semibold text-foreground mb-4">Account Information</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              disabled={!isEditing}
              className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg outline-none focus:border-primary text-foreground disabled:opacity-60 transition-all duration-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              disabled={!isEditing}
              className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg outline-none focus:border-primary text-foreground disabled:opacity-60 transition-all duration-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2.5 bg-input border border-border rounded-lg outline-none focus:border-primary text-foreground disabled:opacity-60 transition-all duration-300"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2.5 bg-input border border-border rounded-lg outline-none focus:border-primary text-foreground disabled:opacity-60 transition-all duration-300"
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
  );
}







