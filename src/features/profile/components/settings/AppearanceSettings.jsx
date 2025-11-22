import { motion } from 'framer-motion';
import { Moon, Sun, Image, X, Palette } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { StyledPageWrapper, StyledCard } from '../settings/StyledPageWrapper';

export function AppearanceSettings({ onThemeChange, onBackgroundChange, isDarkMode = false }) {
  const [theme, setTheme] = useState(isDarkMode ? 'dark' : 'light');
  const [backgroundImage, setBackgroundImage] = useState(null);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    onThemeChange?.(newTheme);
    toast.success(`Theme changed to ${newTheme} mode`);
  };

  const handleBackgroundUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        setBackgroundImage(result);
        onBackgroundChange?.(result);
        toast.success('Dashboard background updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = () => {
    setBackgroundImage(null);
    onBackgroundChange?.(null);
    toast.success('Background removed');
  };

  return (
    <StyledPageWrapper
      title="Appearance Settings"
      subtitle="Customize your dashboard theme and appearance"
      icon={Palette}
    >
      {/* Theme Settings */}
      <StyledCard title="Theme">
        <p className="text-sm mb-6 text-muted-foreground">
          Choose your preferred theme for the dashboard
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Light Mode */}
          <motion.button
            onClick={() => handleThemeChange('light')}
            className={`relative p-6 rounded-lg border transition-all duration-300 ${
              theme === 'light'
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-primary/50 hover:bg-muted/30'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center shadow-sm">
                <Sun className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Light Mode
                </h3>
                <p className="text-xs text-muted-foreground">
                  Bright and clean
                </p>
              </div>
            </div>
            {theme === 'light' && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md"
              >
                <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </motion.button>

          {/* Dark Mode */}
          <motion.button
            onClick={() => handleThemeChange('dark')}
            className={`relative p-6 rounded-lg border transition-all duration-300 ${
              theme === 'dark'
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-primary/50 hover:bg-muted/30'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center shadow-sm">
                <Moon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Dark Mode
                </h3>
                <p className="text-xs text-muted-foreground">
                  Easy on the eyes
                </p>
              </div>
            </div>
            {theme === 'dark' && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md"
              >
                <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        </div>
      </StyledCard>

      {/* Background Customization */}
      <StyledCard title="Dashboard Background">
        <p className="text-sm mb-6 text-muted-foreground">
          Upload a custom background image for your dashboard (Max 5MB)
        </p>

        {backgroundImage ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="rounded-lg overflow-hidden border border-border shadow-md">
              <img
                src={backgroundImage}
                alt="Dashboard background"
                className="w-full h-48 object-cover"
              />
            </div>
            <motion.button
              onClick={handleRemoveBackground}
              className="absolute top-3 right-3 p-2 bg-destructive text-destructive-foreground rounded-full shadow-lg hover:opacity-90 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </motion.div>
        ) : (
          <label className="relative border-2 border-dashed rounded-lg p-8 flex flex-col items-center gap-4 cursor-pointer transition-all duration-300 hover:border-primary border-border bg-muted/20 hover:bg-muted/40">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Image className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-1 text-foreground">
                Upload Background Image
              </h3>
              <p className="text-xs text-muted-foreground">
                Click to browse or drag and drop
              </p>
              <p className="text-xs mt-1 text-muted-foreground">
                PNG, JPG up to 5MB
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleBackgroundUpload}
              className="hidden"
            />
          </label>
        )}
      </StyledCard>

      {/* Preview */}
      <StyledCard title="Preview">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg p-8 border border-border bg-background"
          style={backgroundImage ? { 
            backgroundImage: `url(${backgroundImage})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          } : {}}
        >
          <div className="p-6 rounded-lg bg-card/90 backdrop-blur border border-border shadow-sm">
            <h4 className="font-semibold mb-2 text-card-foreground">
              Sample Card
            </h4>
            <p className="text-sm text-muted-foreground">
              This is how your dashboard will look with the selected theme and background.
            </p>
            <motion.button 
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-all duration-300 shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sample Button
            </motion.button>
          </div>
        </motion.div>
      </StyledCard>

      {/* Info */}
      <StyledCard>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Palette className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-foreground">
              Appearance Tips
            </h3>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>Dark mode reduces eye strain in low-light environments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>Custom backgrounds are stored locally in your browser</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>Your theme preference will be saved automatically</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>Use high-quality images for the best visual experience</span>
              </li>
            </ul>
          </div>
        </div>
      </StyledCard>
    </StyledPageWrapper>
  );
}