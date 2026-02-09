import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '@/shared/components/PageHeader'
import { 
  Settings, 
  FileText, 
  HardHat, 
  Clock, 
  Users, 
  Bell, 
  FileSignature, 
  Workflow, 
  CreditCard,
  UserCog,
  CheckCircle2
} from 'lucide-react'

// Import all settings components
import ProjectDetailsGeneral from './ProjectDetailsGeneral'
import ProjectOnboarding from './ProjectOnboarding'
import ProjectTimesheet from './ProjectTimesheet'
import ProjectRoles from './ProjectRoles'
import ProjectNotifications from './ProjectNotifications'
import SignersRecipients from './SignersRecipients'
import ApprovalWorkflows from './ApprovalWorkflows'
import Billing from './Billing'

const settingsMenuItems = [
  { id: 'details-general', label: 'Project Details', icon: FileText, component: ProjectDetailsGeneral, completed: true },
  { id: 'onboarding', label: 'Onboarding', icon: UserCog, component: ProjectOnboarding, completed: false },
  { id: 'timesheet', label: 'Timesheet', icon: Clock, component: ProjectTimesheet, completed: false },
  { id: 'roles', label: 'Roles', icon: Users, component: ProjectRoles, completed: true },
  { id: 'notifications', label: 'Notifications', icon: Bell, component: ProjectNotifications, completed: true },
  { id: 'signers-recipients', label: 'Signers & Recipients', icon: FileSignature, component: SignersRecipients, completed: false },
  { id: 'approval-workflows', label: 'Approval Workflows', icon: Workflow, component: ApprovalWorkflows, completed: true },
  { id: 'billing', label: 'Billing', icon: CreditCard, component: Billing, completed: false },
]

function ProjectSettings() {
  const { projectName } = useParams()
  const [activeTab, setActiveTab] = useState('details-general')

  const ActiveComponent = settingsMenuItems.find(item => item.id === activeTab)?.component || ProjectDetailsGeneral

  return (
    <div className="space-y-4">
      <PageHeader
        title="Project Settings"
        icon="Settings"
      />
      
      <div className="flex gap-6">
        {/* Vertical Tabs */}
        <div className="w-64 flex-shrink-0">
          <nav className="space-y-1">
            {settingsMenuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm flex-1">{item.label}</span>
                  <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${
                    item.completed ? 'text-green-500' : 'text-gray-300'
                  }`} />
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <ActiveComponent />
        </div>
      </div>
    </div>
  )
}

export default ProjectSettings







