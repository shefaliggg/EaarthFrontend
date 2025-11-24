import React, { useState } from 'react';
import { Activity, LogIn, LogOut, Edit, FileText, User, MapPin, Monitor, Download, Filter } from 'lucide-react';
import { toast } from 'sonner';

export default function ActivityLogsSettings({ isDarkMode }) {
  const [filterType, setFilterType] = useState('all');
  
  const [activityLogs] = useState([
    {
      id: 1,
      type: 'login',
      action: 'LOGIN',
      description: 'Successful login to account',
      timestamp: '13/11/2024 14:30',
      device: 'Chrome on Windows',
      location: 'London, UK',
      ipAddress: '192.168.1.100',
    },
    {
      id: 2,
      type: 'edit',
      action: 'PROFILE UPDATE',
      description: 'Updated profile information',
      timestamp: '13/11/2024 12:15',
      device: 'Safari on iPhone',
      location: 'London, UK',
      ipAddress: '192.168.1.101',
    },
    {
      id: 3,
      type: 'document',
      action: 'DOCUMENT UPLOADED',
      description: 'Uploaded passport document',
      timestamp: '12/11/2024 16:45',
      device: 'Chrome on Windows',
      location: 'London, UK',
      ipAddress: '192.168.1.100',
    },
    {
      id: 4,
      type: 'login',
      action: 'LOGIN',
      description: 'Successful login to account',
      timestamp: '12/11/2024 09:20',
      device: 'Chrome on MacOS',
      location: 'London, UK',
      ipAddress: '192.168.1.102',
    },
    {
      id: 5,
      type: 'logout',
      action: 'LOGOUT',
      description: 'Logged out from account',
      timestamp: '11/11/2024 18:00',
      device: 'Chrome on Windows',
      location: 'London, UK',
      ipAddress: '192.168.1.100',
    },
    {
      id: 6,
      type: 'profile',
      action: 'PASSWORD CHANGED',
      description: 'Account password was updated',
      timestamp: '10/11/2024 11:30',
      device: 'Safari on iPad',
      location: 'London, UK',
      ipAddress: '192.168.1.103',
    },
    {
      id: 7,
      type: 'document',
      action: 'DOCUMENT DOWNLOADED',
      description: 'Downloaded contract PDF',
      timestamp: '09/11/2024 15:20',
      device: 'Chrome on Windows',
      location: 'London, UK',
      ipAddress: '192.168.1.100',
    },
    {
      id: 8,
      type: 'login',
      action: 'FAILED LOGIN ATTEMPT',
      description: 'Failed login - incorrect password',
      timestamp: '08/11/2024 22:10',
      device: 'Chrome on Windows',
      location: 'Unknown',
      ipAddress: '203.45.67.89',
    },
  ]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'login':
        return LogIn;
      case 'logout':
        return LogOut;
      case 'edit':
        return Edit;
      case 'document':
        return FileText;
      case 'profile':
        return User;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'login':
        return 'bg-green-600';
      case 'logout':
        return 'bg-gray-600';
      case 'edit':
        return 'bg-blue-600';
      case 'document':
        return 'bg-primary';
      case 'profile':
        return 'bg-orange-600';
      default:
        return 'bg-primary';
    }
  };

  const filteredLogs = filterType === 'all' 
    ? activityLogs 
    : activityLogs.filter(log => log.type === filterType);

  const handleExportLogs = () => {
    toast.success('Activity logs exported successfully!');
  };

  return (
    <div className="space-y-4">
      {/* Filter and Export */}
      <div className="rounded-lg border border-border bg-card p-4 transition-colors duration-400">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-input bg-input text-foreground font-bold transition-all focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none"
            >
              <option value="all">ALL ACTIVITY</option>
              <option value="login">LOGIN</option>
              <option value="logout">LOGOUT</option>
              <option value="edit">EDITS</option>
              <option value="document">DOCUMENTS</option>
              <option value="profile">PROFILE</option>
            </select>
          </div>
          <button
            onClick={handleExportLogs}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            EXPORT LOGS
          </button>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="rounded-lg border border-border bg-card p-6 transition-colors duration-400">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="font-bold text-lg text-foreground">
            RECENT ACTIVITY ({filteredLogs.length})
          </h3>
        </div>

        <div className="space-y-4">
          {filteredLogs.map((log) => {
            const Icon = getActivityIcon(log.type);
            const colorClass = getActivityColor(log.type);
            
            return (
              <div
                key={log.id}
                className="p-4 rounded-lg border-2 border-border bg-muted transition-all hover:border-primary"
              >
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                      <h4 className="font-bold text-foreground">
                        {log.action}
                      </h4>
                      <span className="text-xs font-bold text-muted-foreground">
                        {log.timestamp}
                      </span>
                    </div>
                    
                    <p className="text-sm mb-3 text-muted-foreground">
                      {log.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-bold text-muted-foreground">
                          {log.device}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-bold text-muted-foreground">
                          {log.location}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-bold text-muted-foreground">
                          {log.ipAddress}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}



