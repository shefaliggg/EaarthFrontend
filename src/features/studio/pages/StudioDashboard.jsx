import { 
  Users, Building2, FolderOpen, Settings, Shield, 
  FileText, CheckCircle, Clock, TrendingUp, 
  Film, Calendar, Star, Plus, Search, 
  UserPlus, Mail, AlertCircle, ArrowRight, QrCode, BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import QRCode from 'react-qr-code';

export default function StudioDashboard({ isDarkMode, onNavigate }) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showQRCode, setShowQRCode] = useState(false);

  // Sample studio data
  const studioData = {
    name: 'EAARTH STUDIOS',
    projects: {
      total: 12,
      active: 8,
      prep: 3,
      shooting: 4,
      wrap: 1,
      completed: 4
    },
    crew: {
      total: 156,
      active: 142,
      pending: 14,
      contractsPending: 8
    },
    departments: {
      total: 15,
      active: 12
    },
    budget: {
      allocated: 12500000,
      spent: 8750000,
      remaining: 3750000
    }
  };

  // Recent projects
  const recentProjects = [
    {
      id: 'project-avatar1',
      title: 'AVATAR 1',
      type: 'Feature Film',
      status: 'shooting',
      progress: 60,
      crew: 45,
      deadline: '30 DEC 2024',
      image: '🎬'
    },
    {
      id: 'project-avatar2',
      title: 'AVATAR 2',
      type: 'Feature Film',
      status: 'prep',
      progress: 45,
      crew: 32,
      deadline: '15 JAN 2025',
      image: '🎥'
    },
    {
      id: 'project-mumbai',
      title: 'MUMBAI CHRONICLES',
      type: 'Television',
      status: 'wrap',
      progress: 85,
      crew: 28,
      deadline: '20 OCT 2024',
      image: '🎭'
    },
  ];

  // Quick actions
  const quickActions = [
    {
      id: 'create-project',
      label: 'CREATE NEW PROJECT',
      description: 'Start a new production',
      icon: Plus,
      color: 'from-purple-500 to-purple-600',
      action: () => onNavigate('projects')
    },
    {
      id: 'invite-crew',
      label: 'INVITE CREW',
      description: 'Add new team members',
      icon: UserPlus,
      color: 'from-blue-500 to-blue-600',
      action: () => onNavigate('studio-dashboard')
    },
    {
      id: 'manage-departments',
      label: 'MANAGE DEPARTMENTS',
      description: 'Organize your teams',
      icon: Building2,
      color: 'from-green-500 to-green-600',
      action: () => onNavigate('studio-settings')
    },
    {
      id: 'view-reports',
      label: 'VIEW REPORTS',
      description: 'Analytics and insights',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      action: () => onNavigate('studio-reports')
    },
  ];

  // Pending tasks
  const pendingTasks = [
    {
      id: 1,
      type: 'contract',
      title: 'CONTRACT APPROVAL NEEDED',
      description: '8 crew members waiting for contract assignment',
      count: 8,
      priority: 'high'
    },
    {
      id: 2,
      type: 'project',
      title: 'PROJECT SETUP INCOMPLETE',
      description: '2 projects need settings configuration',
      count: 2,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'crew',
      title: 'PENDING INVITATIONS',
      description: '14 crew invitations pending acceptance',
      count: 14,
      priority: 'low'
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'prep':
        return { color: 'bg-blue-100 text-blue-700 border-blue-300', label: 'PREP' };
      case 'shooting':
        return { color: 'bg-green-100 text-green-700 border-green-300', label: 'SHOOTING' };
      case 'wrap':
        return { color: 'bg-purple-100 text-purple-700 border-purple-300', label: 'WRAP' };
      default:
        return { color: 'bg-gray-100 text-gray-700 border-gray-300', label: status.toUpperCase() };
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className={`min-h-screen transition-colors`}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className={`rounded-xl border p-6 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {studioData.name}
              </h1>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                STUDIO ADMIN DASHBOARD
              </p>
            </div>
            
            {/* Quick Stats Button */}
            <button
              onClick={() => setShowQRCode(!showQRCode)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all border-2 border-purple-700 flex items-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              {showQRCode ? 'HIDE STATS' : 'SHOW QUICK STATS'}
            </button>
          </div>
          
          {/* Quick Stats Widget */}
          {showQRCode && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-6 rounded-xl border-2 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  STUDIO OVERVIEW
                </h3>
                <div className={`text-xs px-3 py-1 rounded-full ${
                  isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
                }`}>
                  ● ALL SYSTEMS OPERATIONAL
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Stat 1 */}
                <div className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-purple-50'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                      <FolderOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        ACTIVE PROJECTS
                      </p>
                      <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        12
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-green-600">
                    ↑ 3 NEW THIS MONTH
                  </p>
                </div>

                {/* Stat 2 */}
                <div className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-purple-50'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        TOTAL CREW
                      </p>
                      <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        245
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-green-600">
                    ↑ 18 NEW HIRES
                  </p>
                </div>

                {/* Stat 3 */}
                <div className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-purple-50'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        PROJECT SUCCESS RATE
                      </p>
                      <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        97.5%
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-green-600">
                    ↑ 2.3% IMPROVEMENT
                  </p>
                </div>
              </div>

              {/* Additional Quick Info */}
              <div className={`mt-4 p-3 rounded-lg ${
                isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
              }`}>
                <div className="grid grid-cols-3 gap-4 text-center text-xs">
                  <div>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>PENDING APPROVALS</p>
                    <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>5</p>
                  </div>
                  <div>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>UPCOMING SHOOTS</p>
                    <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>8</p>
                  </div>
                  <div>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>BUDGET UTILIZATION</p>
                    <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>78%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-2xl p-6 shadow-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-300 flex items-center justify-center">
                <Film className="w-6 h-6 text-purple-700" />
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                {studioData.projects.active} ACTIVE
              </span>
            </div>
            <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {studioData.projects.total}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              TOTAL PROJECTS
            </div>
            <div className="flex gap-2 mt-3">
              <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                {studioData.projects.prep} PREP
              </span>
              <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                {studioData.projects.shooting} SHOOTING
              </span>
              <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700">
                {studioData.projects.wrap} WRAP
              </span>
            </div>
          </motion.div>

          {/* Crew Members */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl p-6 shadow-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-300 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-700" />
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                {studioData.crew.active} ACTIVE
              </span>
            </div>
            <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {studioData.crew.total}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              CREW MEMBERS
            </div>
            <div className="flex gap-2 mt-3">
              <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-700">
                {studioData.crew.pending} PENDING
              </span>
              <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">
                {studioData.crew.contractsPending} CONTRACTS
              </span>
            </div>
          </motion.div>

          {/* Departments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-2xl p-6 shadow-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-300 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-purple-700" />
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                {studioData.departments.active} ACTIVE
              </span>
            </div>
            <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {studioData.departments.total}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              DEPARTMENTS
            </div>
          </motion.div>

          {/* Budget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-2xl p-6 shadow-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-300 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-700" />
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                70% SPENT
              </span>
            </div>
            <div className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {formatCurrency(studioData.budget.allocated)}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              TOTAL BUDGET
            </div>
            <div className="mt-3">
              <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                  style={{ width: `${(studioData.budget.spent / studioData.budget.allocated) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className={`rounded-2xl p-6 shadow-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            QUICK ACTIONS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={action.action}
                  className={`p-4 rounded-xl border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all text-left group ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-purple-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <ArrowRight className={`w-5 h-5 text-purple-700 group-hover:translate-x-1 transition-transform`} />
                  </div>
                  <div className="font-bold text-sm mb-1 text-purple-900">{action.label}</div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-600' : 'text-purple-600'}`}>
                    {action.description}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Projects - Takes 2 columns */}
          <div className={`lg:col-span-2 rounded-2xl p-6 shadow-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                RECENT PROJECTS
              </h2>
              <button
                onClick={() => onNavigate('projects')}
                className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:shadow-lg transition-all"
              >
                VIEW ALL
              </button>
            </div>
            <div className="space-y-3">
              {recentProjects.map((project, idx) => {
                const statusBadge = getStatusBadge(project.status);
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => onNavigate(project.id)}
                    className={`p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-300 flex items-center justify-center text-2xl">
                        {project.image}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {project.title}
                          </h3>
                          <span className={`px-2 py-1 ${statusBadge.color} border rounded-full text-xs font-bold`}>
                            {statusBadge.label}
                          </span>
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {project.type} • {project.crew} crew members
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {project.progress}%
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {project.deadline}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Pending Tasks - Takes 1 column */}
          <div className={`rounded-2xl p-6 shadow-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              PENDING TASKS
            </h2>
            <div className="space-y-3">
              {pendingTasks.map((task, idx) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-4 rounded-xl border ${
                    task.priority === 'high'
                      ? 'bg-red-50 border-red-300'
                      : task.priority === 'medium'
                      ? 'bg-orange-50 border-orange-300'
                      : 'bg-blue-50 border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      task.priority === 'high'
                        ? 'bg-red-500'
                        : task.priority === 'medium'
                        ? 'bg-orange-500'
                        : 'bg-blue-500'
                    }`}>
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      task.priority === 'high'
                        ? 'bg-red-200 text-red-800'
                        : task.priority === 'medium'
                        ? 'bg-orange-200 text-orange-800'
                        : 'bg-blue-200 text-blue-800'
                    }`}>
                      {task.count}
                    </span>
                  </div>
                  <div className={`font-bold text-sm mb-1 ${
                    task.priority === 'high'
                      ? 'text-red-900'
                      : task.priority === 'medium'
                      ? 'text-orange-900'
                      : 'text-blue-900'
                  }`}>
                    {task.title}
                  </div>
                  <div className={`text-xs ${
                    task.priority === 'high'
                      ? 'text-red-700'
                      : task.priority === 'medium'
                      ? 'text-orange-700'
                      : 'text-blue-700'
                  }`}>
                    {task.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Studio Features Access */}
        <div className={`rounded-2xl p-6 shadow-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            STUDIO MANAGEMENT
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate('studio-dashboard')}
              className={`p-4 rounded-xl border-2 text-left hover:shadow-lg transition-all ${
                isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-purple-50 border-purple-300 hover:bg-purple-100'
              }`}
            >
              <Users className="w-8 h-8 text-purple-700 mb-3" />
              <div className="font-bold text-purple-900">CREW & ADMINS</div>
              <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-purple-600'}`}>
                Manage team members and administrators
              </div>
            </button>

            <button
              onClick={() => onNavigate('studio-settings')}
              className={`p-4 rounded-xl border-2 text-left hover:shadow-lg transition-all ${
                isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-purple-50 border-purple-300 hover:bg-purple-100'
              }`}
            >
              <Settings className="w-8 h-8 text-purple-700 mb-3" />
              <div className="font-bold text-purple-900">STUDIO SETTINGS</div>
              <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-purple-600'}`}>
                Configure studio preferences and defaults
              </div>
            </button>

            <button
              onClick={() => onNavigate('studio-reports')}
              className={`p-4 rounded-xl border-2 text-left hover:shadow-lg transition-all ${
                isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-purple-50 border-purple-300 hover:bg-purple-100'
              }`}
            >
              <FileText className="w-8 h-8 text-purple-700 mb-3" />
              <div className="font-bold text-purple-900">REPORTS & ANALYTICS</div>
              <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-purple-600'}`}>
                View studio performance and insights
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}