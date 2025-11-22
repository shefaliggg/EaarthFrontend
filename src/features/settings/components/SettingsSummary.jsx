import React from 'react';
import { Settings, Save, Edit3, Activity } from 'lucide-react';

export default function SettingsSummary({ 
  isDarkMode, 
  isEditing, 
  setIsEditing, 
  handleSave, 
  handleCancel 
}) {
  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className={` transition-colors duration-400`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary">
              <Settings className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">SETTINGS</h1>
              <p className="text-sm text-muted-foreground">Manage your account preferences and configurations</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-bold hover:opacity-90 transition-all duration-200"
                >
                  <Save className="w-4 h-4" />
                  SAVE CHANGES
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-muted text-foreground rounded-md font-bold hover:opacity-80 transition-all duration-200"
                >
                  CANCEL
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-bold hover:opacity-90 transition-all duration-200"
              >
                <Edit3 className="w-4 h-4" />
                EDIT SETTINGS
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Settings Summary Card */}
      <div className={`rounded-lg border border-border bg-card p-6 transition-colors duration-400`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Settings Icon */}
            <div className="w-20 h-20 rounded-lg bg-primary flex items-center justify-center">
              <Settings className="w-10 h-10 text-primary-foreground" />
            </div>

            {/* Settings Info */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">ACCOUNT SETTINGS</h2>
              <p className="text-sm text-muted-foreground mb-2">Configure your preferences and account options</p>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-primary/10 text-primary font-bold text-xs">
                <Activity className="w-3 h-3" />
                ALL SYSTEMS ACTIVE
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">8</div>
              <div className="text-xs text-muted-foreground">SECTIONS</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">24</div>
              <div className="text-xs text-muted-foreground">OPTIONS</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">100%</div>
              <div className="text-xs text-muted-foreground">CONFIGURED</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}