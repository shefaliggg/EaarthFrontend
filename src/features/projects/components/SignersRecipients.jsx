import { useState } from 'react';
import { PenTool, UserCheck, Mail, FileSignature } from 'lucide-react';
import MySignatures from '../components/MySignatures';
import SignersManagement from '../components/Signersmanagement';
import RecipientsManagement from '../components/Recipientsmanagement';
import ApprovalWorkflowsManagement from '../components/ApprovalWorkflows';

export default function ProjectSettingsPage({ projectName = "EAARTH" }) {
  const [activeTab, setActiveTab] = useState('signatures');

  const tabs = [
    { id: 'signatures', label: 'My Signatures', icon: PenTool },
    { id: 'signers', label: 'Authorized Signers', icon: UserCheck },
    { id: 'recipients', label: 'Recipients', icon: Mail },
    { id: 'workflows', label: 'Approval Workflows', icon: FileSignature },
  ];

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Signers & Recipients - {projectName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage signatures, approvals, and document workflows
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="flex border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-lavender-500 to-pastel-pink-500 text-white'
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'signatures' && <MySignatures />}
            {activeTab === 'signers' && <SignersManagement />}
            {activeTab === 'recipients' && <RecipientsManagement />}
            {activeTab === 'workflows' && <ApprovalWorkflowsManagement />}
          </div>
        </div>
      </div>
    </div>
  );
}