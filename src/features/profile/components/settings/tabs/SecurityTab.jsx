import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';

export function SecurityTab({ settings, setSettings, isEditing }) {
  return (
    <motion.div
      key="security"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg p-6 border border-border"
    >
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Security</h2>
      </div>
      
      <div className="space-y-4">
        <label className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors duration-200">
          <div>
            <div className="text-sm font-medium text-foreground">Two-Factor Authentication</div>
            <div className="text-xs text-muted-foreground">Add an extra layer of security to your account</div>
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
            className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary disabled:opacity-60"
          />
        </label>

        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-foreground">
            <strong>Note:</strong> For password changes, please use the "Change Password" option in Settings menu.
          </p>
        </div>
      </div>
    </motion.div>
  );
}







