import React, { useState } from 'react';
import { Save, Database, HardDrive, Download, Clock, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function DataSettings({ profile, setProfile, isEditing, isDarkMode }) {
  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleClearCache = () => {
    toast.success('Cache cleared successfully!');
  };

  const handleExportData = () => {
    toast.success('Data export started!');
  };

  const Toggle = ({ label, checked, onChange, description, icon: Icon }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-primary-foreground" />
          </div>
        )}
        <div>
          <p className="font-bold text-foreground">
            {label}
          </p>
          {description && (
            <p className="text-xs mt-1 text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer ml-4">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={!isEditing}
          className="sr-only peer"
        />
        <div className={`w-11 h-6 rounded-full peer peer-checked:bg-primary bg-muted peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border after:border-muted after:rounded-full after:h-5 after:w-5 after:transition-all ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
      </label>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Auto-Save Settings */}
      <div className="rounded-lg border border-border bg-card p-6 transition-colors duration-400">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Database className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="font-bold text-lg text-foreground">
            AUTO-SAVE
          </h3>
        </div>
        
        <div className="space-y-4">
          <Toggle 
            label="ENABLE AUTO-SAVE" 
            checked={profile.autoSaveEnabled !== false} 
            onChange={(checked) => handleChange('autoSaveEnabled', checked)}
            description="Automatically save your work"
          />
          
          {profile.autoSaveEnabled !== false && (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-primary" />
                <label className="text-xs font-bold text-muted-foreground">
                  AUTO-SAVE INTERVAL (MINUTES)
                </label>
              </div>
              <select
                value={profile.autoSaveInterval || '5'}
                onChange={(e) => handleChange('autoSaveInterval', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-2 rounded-3xl border-2 border-input bg-input text-foreground font-bold transition-all disabled:opacity-50 focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none"
              >
                <option value="1">1 MINUTE</option>
                <option value="5">5 MINUTES</option>
                <option value="10">10 MINUTES</option>
                <option value="15">15 MINUTES</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Storage Options */}
      <div className="rounded-lg border border-border bg-card p-6 transition-colors duration-400">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="font-bold text-lg text-foreground">
            STORAGE OPTIONS
          </h3>
        </div>
        
        <div className="space-y-4">
          <Toggle 
            label="CLEAR CACHE ON EXIT" 
            checked={profile.clearCacheOnExit || false} 
            onChange={(checked) => handleChange('clearCacheOnExit', checked)}
            description="Remove cached data when closing the app"
          />
          <Toggle 
            label="OFFLINE MODE" 
            checked={profile.offlineMode || false} 
            onChange={(checked) => handleChange('offlineMode', checked)}
            description="Enable offline access to recent data"
          />
          
          <div className="pt-4">
            <button
              onClick={handleClearCache}
              className="w-full px-6 py-2 rounded-3xl font-bold transition-all duration-200 flex items-center justify-center gap-2 bg-muted text-foreground hover:opacity-80"
            >
              <Trash2 className="w-5 h-5" />
              CLEAR CACHE NOW
            </button>
          </div>
        </div>
      </div>

      {/* Export Settings */}
      <div className="rounded-lg border border-border bg-card p-6 transition-colors duration-400">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Download className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="font-bold text-lg text-foreground">
            EXPORT & BACKUP
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-primary" />
              <label className="text-xs font-bold text-muted-foreground">
                EXPORT FORMAT
              </label>
            </div>
            <select
              value={profile.exportFormat || 'PDF'}
              onChange={(e) => handleChange('exportFormat', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-3xl border-2 border-input bg-input text-foreground font-bold transition-all disabled:opacity-50 focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none"
            >
              <option value="PDF">PDF</option>
              <option value="EXCEL">EXCEL</option>
              <option value="CSV">CSV</option>
              <option value="JSON">JSON</option>
            </select>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-5 h-5 text-primary" />
              <label className="text-xs font-bold text-muted-foreground">
                BACKUP FREQUENCY
              </label>
            </div>
            <select
              value={profile.backupFrequency || 'weekly'}
              onChange={(e) => handleChange('backupFrequency', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-3xl border-2 border-input bg-input text-foreground font-bold transition-all disabled:opacity-50 focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none"
            >
              <option value="daily">DAILY</option>
              <option value="weekly">WEEKLY</option>
              <option value="monthly">MONTHLY</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              onClick={handleExportData}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              EXPORT ALL DATA NOW
            </button>
          </div>
        </div>
      </div>

      {/* Storage Usage */}
      <div className="rounded-lg border border-border bg-card p-6 transition-colors duration-400">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="font-bold text-lg text-foreground">
            STORAGE USAGE
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-bold text-foreground">
                DOCUMENTS
              </span>
              <span className="text-sm font-bold text-muted-foreground">
                2.4 GB
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted">
              <div className="w-[60%] h-full bg-primary rounded-full"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-bold text-foreground">
                MEDIA FILES
              </span>
              <span className="text-sm font-bold text-muted-foreground">
                1.8 GB
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted">
              <div className="w-[45%] h-full bg-primary rounded-full"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-bold text-foreground">
                CACHE
              </span>
              <span className="text-sm font-bold text-muted-foreground">
                324 MB
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted">
              <div className="w-[8%] h-full bg-primary rounded-full"></div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex justify-between">
              <span className="font-bold text-foreground">
                TOTAL USED
              </span>
              <span className="font-bold text-foreground">
                4.5 GB / 10 GB
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



