import { motion } from 'framer-motion';
import { EditableInput, EditableSelect } from '../../../../../shared/components/forms';

export function AccountInfoTab({ settings, setSettings, isEditing }) {
  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
  ];

  const timezoneOptions = [
    { value: 'asia/kolkata', label: 'Asia/Kolkata (IST)' },
    { value: 'america/newyork', label: 'America/New_York (EST)' },
    { value: 'america/losangeles', label: 'America/Los_Angeles (PST)' },
    { value: 'europe/london', label: 'Europe/London (GMT)' },
    { value: 'australia/sydney', label: 'Australia/Sydney (AEDT)' },
  ];

  return (
    <motion.div
      key="account"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg p-6 border border-border"
    >
      <h2 className="text-lg font-semibold text-foreground mb-6">Account Information</h2>
      
      <div className="space-y-6">
        <EditableInput
          isEditing={isEditing}
          label="Email Address"
          type="email"
          value={settings.email}
          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
          placeholder="Enter email address"
          required
        />

        <EditableInput
          isEditing={isEditing}
          label="Phone Number"
          type="tel"
          value={settings.phone}
          onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
          placeholder="Enter phone number"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <EditableSelect
            isEditing={isEditing}
            label="Language"
            value={settings.language}
            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
            options={languageOptions}
            placeholder="Select language"
          />

          <EditableSelect
            isEditing={isEditing}
            label="Timezone"
            value={settings.timezone}
            onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
            options={timezoneOptions}
            placeholder="Select timezone"
          />
        </div>
      </div>
    </motion.div>
  );
}







