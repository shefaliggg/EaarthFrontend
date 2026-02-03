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
  UserCog
} from 'lucide-react'

// Import all settings components
import ProjectDetail from './ProjectDetail'
import ProjectGeneral from './ProjectGeneral'
import ProjectConstruction from './ProjectConstruction'
import ProjectOnboarding from './ProjectOnboarding'
import ProjectTimesheet from './ProjectTimesheet'
import ProjectRoles from './ProjectRoles'
import ProjectNotifications from './ProjectNotifications'
import SignersRecipients from './SignersRecipients'
import ApprovalWorkflows from './ApprovalWorkflows'
import Billing from './Billing'

const settingsMenuItems = [
  { id: 'detail', label: 'Project Details', icon: FileText, component: ProjectDetail },
  { id: 'general', label: 'General', icon: Settings, component: ProjectGeneral },
  { id: 'construction', label: 'Construction', icon: HardHat, component: ProjectConstruction },
  { id: 'onboarding', label: 'Onboarding', icon: UserCog, component: ProjectOnboarding },
  { id: 'timesheet', label: 'Timesheet', icon: Clock, component: ProjectTimesheet },
  { id: 'roles', label: 'Roles', icon: Users, component: ProjectRoles },
  { id: 'notifications', label: 'Notifications', icon: Bell, component: ProjectNotifications },
  { id: 'signers-recipients', label: 'Signers & Recipients', icon: FileSignature, component: SignersRecipients },
  { id: 'approval-workflows', label: 'Approval Workflows', icon: Workflow, component: ApprovalWorkflows },
  { id: 'billing', label: 'Billing', icon: CreditCard, component: Billing },
]

function ProjectSettings() {
  const { projectName } = useParams()
  const [activeTab, setActiveTab] = useState('general')

  const ActiveComponent = settingsMenuItems.find(item => item.id === activeTab)?.component || ProjectGeneral

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
                  <span className="font-medium text-sm">{item.label}</span>
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







