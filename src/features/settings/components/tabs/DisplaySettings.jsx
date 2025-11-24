import { motion } from 'framer-motion';
import { AppearanceSettings } from '../../../profile/components/settings/AppearanceSettings';

export default function AppearanceTab({ isDarkMode }) {
  return (
    <motion.div
      key="appearance"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <AppearanceSettings isDarkMode={isDarkMode} />
    </motion.div>
  );
}







