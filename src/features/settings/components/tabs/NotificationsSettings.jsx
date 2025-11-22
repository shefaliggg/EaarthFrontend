import React from 'react';
import { Bell, FileText, Calendar, CheckSquare, Clock, MessageSquare } from 'lucide-react';

export default function NotificationsSettings({ profile, setProfile, isEditing, isDarkMode }) {
  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
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
      {/* Notification Channels */}
      <div className={`rounded-3xl border p-6 transition-colors ${
        isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-purple-200'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            NOTIFICATION CHANNELS
          </h3>
        </div>
        
        <div className="space-y-4">
          <Toggle 
            label="EMAIL NOTIFICATIONS" 
            checked={profile.emailNotifications !== false} 
            onChange={(checked) => handleChange('emailNotifications', checked)}
            description="Receive notifications via email"
          />
          <Toggle 
            label="PUSH NOTIFICATIONS" 
            checked={profile.pushNotifications !== false} 
            onChange={(checked) => handleChange('pushNotifications', checked)}
            description="Browser and mobile push notifications"
          />
          <Toggle 
            label="SMS NOTIFICATIONS" 
            checked={profile.smsNotifications || false} 
            onChange={(checked) => handleChange('smsNotifications', checked)}
            description="Receive critical alerts via SMS"
          />
        </div>
      </div>

      {/* Document & Contract Notifications */}
      <div className={`rounded-3xl border p-6 transition-colors ${
        isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-purple-200'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            DOCUMENTS & CONTRACTS
          </h3>
        </div>
        
        <div className="space-y-4">
          <Toggle 
            label="DOCUMENT EXPIRY ALERTS" 
            checked={profile.notifyDocumentExpiry !== false} 
            onChange={(checked) => handleChange('notifyDocumentExpiry', checked)}
            description="Get notified before documents expire"
          />
          
          {profile.notifyDocumentExpiry !== false && (
            <div>
              <label className={`block text-xs font-bold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                EXPIRY REMINDER PERIOD
              </label>
              <select
                value={profile.documentExpiryDays || '180'}
                onChange={(e) => handleChange('documentExpiryDays', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-lg border-2 font-bold ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-purple-200 text-gray-900'
                } ${!isEditing ? 'opacity-50' : ''} focus:ring-2 focus:ring-purple-500 outline-none`}
              >
                <option value="30">30 DAYS (1 MONTH)</option>
                <option value="90">90 DAYS (3 MONTHS)</option>
                <option value="180">180 DAYS (6 MONTHS) - RECOMMENDED</option>
                <option value="365">365 DAYS (1 YEAR)</option>
              </select>
            </div>
          )}
          
          <Toggle 
            label="CONTRACT STATUS UPDATES" 
            checked={profile.notifyContractStatus !== false} 
            onChange={(checked) => handleChange('notifyContractStatus', checked)}
            description="Changes to contract status"
          />
          <Toggle 
            label="CONTRACT RENEWAL REMINDERS" 
            checked={profile.notifyContractRenewal !== false} 
            onChange={(checked) => handleChange('notifyContractRenewal', checked)}
            description="Upcoming contract renewals"
          />
        </div>
      </div>

      {/* Project Notifications */}
      <div className={`rounded-3xl border p-6 transition-colors ${
        isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-purple-200'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            PROJECT UPDATES
          </h3>
        </div>
        
        <div className="space-y-4">
          <Toggle 
            label="PROJECT UPDATES" 
            checked={profile.notifyProjectUpdates !== false} 
            onChange={(checked) => handleChange('notifyProjectUpdates', checked)}
            description="General project updates and changes"
          />
          <Toggle 
            label="PROJECT ASSIGNMENT" 
            checked={profile.notifyProjectAssignment !== false} 
            onChange={(checked) => handleChange('notifyProjectAssignment', checked)}
            description="When assigned to new projects"
          />
          <Toggle 
            label="PROJECT MILESTONES" 
            checked={profile.notifyProjectMilestones !== false} 
            onChange={(checked) => handleChange('notifyProjectMilestones', checked)}
            description="Key milestone achievements"
          />
        </div>
      </div>

      {/* Tasks & Timesheets */}
      <div className={`rounded-3xl border p-6 transition-colors ${
        isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-purple-200'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            TASKS & TIMESHEETS
          </h3>
        </div>
        
        <div className="space-y-4">
          <Toggle 
            label="TASK ASSIGNMENTS" 
            checked={profile.notifyTaskAssignment !== false} 
            onChange={(checked) => handleChange('notifyTaskAssignment', checked)}
            description="When new tasks are assigned to you"
          />
          <Toggle 
            label="TASK DEADLINES" 
            checked={profile.notifyTaskDeadline !== false} 
            onChange={(checked) => handleChange('notifyTaskDeadline', checked)}
            description="Upcoming task deadlines"
          />
          <Toggle 
            label="TIMESHEET REMINDERS" 
            checked={profile.notifyTimesheetReminders !== false} 
            onChange={(checked) => handleChange('notifyTimesheetReminders', checked)}
            description="Weekly timesheet submission reminders"
          />
          
          {profile.notifyTimesheetReminders !== false && (
            <div>
              <label className={`block text-xs font-bold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                REMINDER DAY
              </label>
              <select
                value={profile.timesheetReminderDay || 'friday'}
                onChange={(e) => handleChange('timesheetReminderDay', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-lg border-2 font-bold ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-purple-200 text-gray-900'
                } ${!isEditing ? 'opacity-50' : ''} focus:ring-2 focus:ring-purple-500 outline-none`}
              >
                <option value="monday">MONDAY</option>
                <option value="thursday">THURSDAY</option>
                <option value="friday">FRIDAY</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Approvals & Requests */}
      <div className={`rounded-3xl border p-6 transition-colors ${
        isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-purple-200'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            APPROVALS & REQUESTS
          </h3>
        </div>
        
        <div className="space-y-4">
          <Toggle 
            label="APPROVAL REQUESTS" 
            checked={profile.notifyApprovals !== false} 
            onChange={(checked) => handleChange('notifyApprovals', checked)}
            description="Pending approval requests"
          />
          <Toggle 
            label="LEAVE REQUESTS" 
            checked={profile.notifyLeaveRequests !== false} 
            onChange={(checked) => handleChange('notifyLeaveRequests', checked)}
            description="Leave request updates"
          />
          <Toggle 
            label="EXPENSE CLAIMS" 
            checked={profile.notifyExpenseClaims !== false} 
            onChange={(checked) => handleChange('notifyExpenseClaims', checked)}
            description="Expense claim status"
          />
        </div>
      </div>

      {/* Chat & Messages */}
      <div className={`rounded-3xl border p-6 transition-colors ${
        isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-purple-200'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            CHAT & MESSAGES
          </h3>
        </div>
        
        <div className="space-y-4">
          <Toggle 
            label="DIRECT MESSAGES" 
            checked={profile.notifyDirectMessages !== false} 
            onChange={(checked) => handleChange('notifyDirectMessages', checked)}
            description="Personal direct messages"
          />
          <Toggle 
            label="MENTIONS" 
            checked={profile.notifyMentions !== false} 
            onChange={(checked) => handleChange('notifyMentions', checked)}
            description="When someone mentions you"
          />
          <Toggle 
            label="PROJECT CHAT" 
            checked={profile.notifyProjectChat || false} 
            onChange={(checked) => handleChange('notifyProjectChat', checked)}
            description="All project chat messages"
          />
        </div>
      </div>
    </div>
  );
}