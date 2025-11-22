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
          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
        <div>
          <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {label}
          </p>
          {description && (
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
        <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
          checked ? 'bg-purple-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
        } ${!isEditing ? 'opacity-50' : ''}`}></div>
      </label>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Auto-Save Settings */}
      <div className={`rounded-3xl border p-6 transition-colors ${
        isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-purple-200'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
          <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
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
                <Clock className="w-5 h-5 text-purple-500" />
                <label className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  AUTO-SAVE INTERVAL (MINUTES)
                </label>
              </div>
              <select
                value={profile.autoSaveInterval || '5'}
                onChange={(e) => handleChange('autoSaveInterval', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-lg border-2 font-bold ${
                  isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-purple-200 text-gray-900'
                } ${!isEditing ? 'opacity-50' : ''} focus:ring-2 focus:ring-purple-500 outline-none`}
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
      <div className={`rounded-3xl border p-6 transition-colors ${
        isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-purple-200'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-white" />
          </div>
          <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
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
              className={`w-full px-6 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 ${
                isDarkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              <Trash2 className="w-5 h-5" />
              CLEAR CACHE NOW
            </button>
          </div>
        </div>
      </div>

      {/* Export Settings */}
      <div className={`rounded-3xl border p-6 transition-colors ${
        isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-purple-200'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            EXPORT & BACKUP
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-purple-500" />
              <label className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                EXPORT FORMAT
              </label>
            </div>
            <select
              value={profile.exportFormat || 'PDF'}
              onChange={(e) => handleChange('exportFormat', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-lg border-2 font-bold ${
                isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-purple-200 text-gray-900'
              } ${!isEditing ? 'opacity-50' : ''} focus:ring-2 focus:ring-purple-500 outline-none`}
            >
              <option value="PDF">PDF</option>
              <option value="EXCEL">EXCEL</option>
              <option value="CSV">CSV</option>
              <option value="JSON">JSON</option>
            </select>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-5 h-5 text-purple-500" />
              <label className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                BACKUP FREQUENCY
              </label>
            </div>
            <select
              value={profile.backupFrequency || 'weekly'}
              onChange={(e) => handleChange('backupFrequency', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-lg border-2 font-bold ${
                isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-purple-200 text-gray-900'
              } ${!isEditing ? 'opacity-50' : ''} focus:ring-2 focus:ring-purple-500 outline-none`}
            >
              <option value="daily">DAILY</option>
              <option value="weekly">WEEKLY</option>
              <option value="monthly">MONTHLY</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              onClick={handleExportData}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              EXPORT ALL DATA NOW
            </button>
          </div>
        </div>
      </div>

      {/* Storage Usage (Optional - from original file) */}
      <div className={`rounded-3xl border p-6 transition-colors ${
        isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-purple-200'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-white" />
          </div>
          <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            STORAGE USAGE
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                DOCUMENTS
              </span>
              <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                2.4 GB
              </span>
            </div>
            <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <div className="w-[60%] h-full bg-purple-600 rounded-full"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                MEDIA FILES
              </span>
              <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                1.8 GB
              </span>
            </div>
            <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <div className="w-[45%] h-full bg-purple-600 rounded-full"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                CACHE
              </span>
              <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                324 MB
              </span>
            </div>
            <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <div className="w-[8%] h-full bg-purple-600 rounded-full"></div>
            </div>
          </div>

          <div className={`pt-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex justify-between">
              <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                TOTAL USED
              </span>
              <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                4.5 GB / 10 GB
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}