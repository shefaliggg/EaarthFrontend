import {
  Users, Building2, FolderOpen, Settings, Shield,
  FileText, CheckCircle, Clock, TrendingUp,
  Film, Calendar, Star, Plus, Search,
  UserPlus, Mail, AlertCircle, ArrowRight, QrCode, BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Button } from '../../../shared/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function StudioDashboard({ onNavigate }) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showQRCode, setShowQRCode] = useState(false);
  const navigate = useNavigate();
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
    }
  ];

  const quickActions = [
    {
      id: 'create-project',
      label: 'CREATE NEW PROJECT',
      description: 'Start a new production',
      path: "/projects",
      icon: Plus,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'invite-crew',
      label: 'INVITE CREW',
      description: 'Add new team members',
      path: "/invite-crew",
      icon: UserPlus,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'manage-departments',
      label: 'MANAGE DEPARTMENTS',
      description: 'Organize your teams',
      path: "/studio-settings",
      icon: Building2,
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'view-reports',
      label: 'VIEW REPORTS',
      description: 'Analytics and insights',
      path: "/studio-reports",
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
    }
  ];

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
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'prep':
        return { color: 'bg-blue-100 text-blue-700 border-blue-300', label: 'PREP' };
      case 'shooting':
        return { color: 'bg-green-100 text-green-700 border-green-300', label: 'SHOOTING' };
      case 'wrap':
        return { color: 'bg-purple-100 text-purple-700 border-purple-200', label: 'WRAP' };
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
    <div className='min-h-screen'>
      <div className="min-h-screen transition-colors">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="rounded-xl border p-6 bg-background">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {studioData.name}
                </h1>
                <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                  STUDIO ADMIN DASHBOARD
                </p>
              </div>

              <Button
                size={"lg"}
                onClick={() => setShowQRCode(!showQRCode)}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all border-2 border-purple-700 flex items-center gap-2"
              >
                <BarChart3 className="w-5 h-5" />
                {showQRCode ? 'HIDE STATS' : 'SHOW QUICK STATS'}
              </Button>
            </div>

            {showQRCode && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 rounded-xl border-2 bg-background border-slate-800"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    STUDIO OVERVIEW
                  </h3>
                  <div className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    ● ALL SYSTEMS OPERATIONAL
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Stat 1 */}
                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                        <FolderOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          ACTIVE PROJECTS
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          12
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-green-600">
                      ↑ 3 NEW THIS MONTH
                    </p>
                  </div>

                  {/* Stat 2 */}
                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          TOTAL CREW
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          245
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-green-600">
                      ↑ 18 NEW HIRES
                    </p>
                  </div>

                  {/* Stat 3 */}
                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          PROJECT SUCCESS RATE
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          97.5%
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-green-600">
                      ↑ 2.3% IMPROVEMENT
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <div className="grid grid-cols-3 gap-4 text-center text-xs">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        PENDING APPROVALS
                      </p>
                      <p className="font-bold text-gray-900 dark:text-white">
                        5
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        UPCOMING SHOOTS
                      </p>
                      <p className="font-bold text-gray-900 dark:text-white">
                        8
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        BUDGET UTILIZATION
                      </p>
                      <p className="font-bold text-gray-900 dark:text-white">
                        78%
                      </p>
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
              className="rounded-2xl p-6 shadow-lg dark:shadow-shadow border bg-background border"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-950 dark:to-purple-900 border-2 border-purple-200 dark:border-purple-900 flex items-center justify-center">
                  <Film className="w-6 h-6 text-purple-700 dark:text-purple-100" />
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                  {studioData.projects.active} ACTIVE
                </span>
              </div>
              <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">
                {studioData.projects.total}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
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
              className="rounded-2xl p-6 shadow-lg dark:shadow-shadow border bg-background "
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-950 dark:to-purple-900 border-2 border-purple-200 dark:border-purple-900 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-700 dark:text-purple-100" />
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                  {studioData.crew.active} ACTIVE
                </span>
              </div>
              <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">
                {studioData.crew.total}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
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
              className="rounded-2xl p-6 shadow-lg dark:shadow-shadow border bg-background "
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-950 dark:to-purple-900 border-2 border-purple-200 dark:border-purple-900 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-purple-700 dark:text-purple-100" />
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                  {studioData.departments.active} ACTIVE
                </span>
              </div>
              <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">
                {studioData.departments.total}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                DEPARTMENTS
              </div>
            </motion.div>

            {/* Budget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl p-6 shadow-lg dark:shadow-shadow border bg-background"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-950 dark:to-purple-900 border-2 border-purple-200 dark:border-purple-900 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-700 dark:text-purple-100" />
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  70% SPENT
                </span>
              </div>
              <div className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
                {formatCurrency(studioData.budget.allocated)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                TOTAL BUDGET
              </div>
              <div className="mt-3">
                <div className="h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                    style={{ width: `${(studioData.budget.spent / studioData.budget.allocated) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl p-6 shadow-lg dark:shadow-shadow border bg-background">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
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
                    onClick={() => navigate(action.path)}
                    className="p-4 rounded-xl border-2 border-purple-200 dark:border-lavender-900 bg-gradient-to-br from-purple-50 to-purple-100  dark:from-lavender-900 dark:to-gray-900 hover:shadow-lg dark:shadow-shadow transition-all text-left group hover:bg-purple-100 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-purple-700 dark:text-lavender-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="font-bold text-sm mb-1 text-purple-900 dark:text-purple-200 dark:text-lavender-100">
                      {action.label}
                    </div>
                    <div className="text-xs text-purple-600 dark:text-gray-400">
                      {action.description}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Projects */}
            <div className="lg:col-span-2 rounded-2xl p-6 shadow-lg dark:shadow-shadow border bg-background  ">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  RECENT PROJECTS
                </h2>
                <button
                  onClick={() => onNavigate('projects')}
                  className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:shadow-lg dark:shadow-shadow transition-all"
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
                      className="p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-slate-900 dark:border-slate-600"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-200 flex items-center justify-center text-2xl">
                          {project.image}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 dark:text-white">
                              {project.title}
                            </h3>
                            <span className={`px-2 py-1 ${statusBadge.color} border rounded-full text-xs font-bold`}>
                              {statusBadge.label}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {project.type} • {project.crew} crew members
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-900 dark:text-white">
                            {project.progress}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {project.deadline}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Pending Tasks */}
            <div className="rounded-2xl p-6 shadow-lg dark:shadow-shadow border bg-background  ">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                PENDING TASKS
              </h2>
              <div className="space-y-3">
                {pendingTasks.map((task, idx) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={
                      task.priority === 'high'
                        ? 'p-4 rounded-xl border bg-red-50 dark:bg-red-950 border-red-300 dark:border-red-900'
                        : task.priority === 'medium'
                          ? 'p-4 rounded-xl border bg-orange-50 dark:bg-orange-800 border-orange-300 dark:border-orange-700'
                          : 'p-4 rounded-xl border bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-700'
                    }
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div
                        className={
                          task.priority === 'high'
                            ? 'w-8 h-8 rounded-lg flex items-center justify-center bg-red-500 dark:bg-red-300'
                            : task.priority === 'medium'
                              ? 'w-8 h-8 rounded-lg flex items-center justify-center bg-orange-500 dark:orange-300'
                              : 'w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500 dark:blue-300'
                        }
                      >
                        <AlertCircle className="w-5 h-5 text-white dark:text-black" />
                      </div>
                      <span
                        className={
                          task.priority === 'high'
                            ? 'px-2 py-1 rounded-full text-xs font-bold bg-red-200 text-red-800'
                            : task.priority === 'medium'
                              ? 'px-2 py-1 rounded-full text-xs font-bold bg-orange-200 text-orange-800'
                              : 'px-2 py-1 rounded-full text-xs font-bold bg-blue-200 text-blue-800'
                        }
                      >
                        {task.count}
                      </span>
                    </div>
                    <div
                      className={
                        task.priority === 'high'
                          ? 'font-bold text-sm mb-1 text-red-900 dark:text-red-100'
                          : task.priority === 'medium'
                            ? 'font-bold text-sm mb-1 text-orange-900 dark:text-orange-100'
                            : 'font-bold text-sm mb-1 text-blue-900 dark:text-blue-100'
                      }
                    >
                      {task.title}
                    </div>
                    <div
                      className={
                        task.priority === 'high'
                          ? 'text-xs text-red-700 dark:text-red-200'
                          : task.priority === 'medium'
                            ? 'text-xs text-orange-700 dark:text-orange-200'
                            : 'text-xs text-blue-700 dark:text-blue-300'
                      }
                    >
                      {task.description}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Studio Management */}
          <div className="rounded-2xl p-6 shadow-lg dark:shadow-shadow border bg-background  ">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              STUDIO MANAGEMENT
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => onNavigate('studio-dashboard')}
                className="p-4 rounded-xl border-2 text-left hover:shadow-lg dark:shadow-shadow transition-all bg-purple-50 border-purple-200 hover:bg-purple-100 dark:bg-lavender-900 dark:border-lavender-600"
              >
                <Users className="w-8 h-8 text-purple-700 dark:text-purple-300 mb-3" />
                <div className="font-bold text-purple-900 dark:text-lavender-200">
                  CREW & ADMINS
                </div>
                <div className="text-xs mt-1 text-purple-600 dark:text-gray-400">
                  Manage team members and administrators
                </div>
              </button>

              <button
                onClick={() => onNavigate('studio-settings')}
                className="p-4 rounded-xl border-2 text-left hover:shadow-lg dark:shadow-shadow transition-all bg-purple-50 border-purple-200 hover:bg-purple-100 dark:bg-lavender-900 dark:border-lavender-600"
              >
                <Settings className="w-8 h-8 text-purple-700 dark:text-purple-300 mb-3" />
                <div className="font-bold text-purple-900 dark:text-lavender-200">
                  STUDIO SETTINGS
                </div>
                <div className="text-xs mt-1 text-purple-600 dark:text-gray-400">
                  Configure studio preferences and defaults
                </div>
              </button>

              <button
                onClick={() => onNavigate('studio-reports')}
                className="p-4 rounded-xl border-2 text-left hover:shadow-lg dark:shadow-shadow transition-all bg-purple-50 border-purple-200 hover:bg-purple-100 dark:bg-lavender-900 dark:border-lavender-600"
              >
                <FileText className="w-8 h-8 text-purple-700 dark:text-purple-300 mb-3" />
                <div className="font-bold text-purple-900 dark:text-lavender-200">
                  REPORTS & ANALYTICS
                </div>
                <div className="text-xs mt-1 text-purple-600 dark:text-gray-400">
                  View studio performance and insights
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
