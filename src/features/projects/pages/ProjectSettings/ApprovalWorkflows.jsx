import { useState } from 'react';
import { Plus, Trash2, Edit, ChevronRight, AlertCircle, Clock, DollarSign, FileText, Check, Briefcase, FileSignature } from 'lucide-react';
import { motion } from 'framer-motion';
import CardWrapper from '@/shared/components/wrappers/CardWrapper';
import EditableTextDataField from '@/shared/components/wrappers/EditableTextDataField';
import EditableSelectField from '@/shared/components/wrappers/EditableSelectField';
import EditableCheckboxField from '@/shared/components/wrappers/EditableCheckboxField';
import { Button } from '@/shared/components/ui/button';
import { SmartIcon } from '@/shared/components/SmartIcon';

export default function ApprovalWorkflowsManagement() {
  const [editingWorkflowId, setEditingWorkflowId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [workflows, setWorkflows] = useState([
    {
      id: 'WORK-001',
      name: 'Timesheet Approval - Production',
      type: 'timesheets',
      department: 'PRODUCTION',
      requiresAll: true,
      steps: [
        { order: 1, signerName: 'Dan Palmer', signerRole: 'First AD', required: true },
        { order: 2, signerName: 'Sheerin Khosrowshahi', signerRole: 'UPM', required: true },
        { order: 3, signerName: 'Payroll Review', signerRole: 'Payroll Review', required: true },
      ]
    },
    {
      id: 'WORK-002',
      name: 'Expense Approval - Accounts',
      type: 'expenses',
      department: 'ACCOUNTS',
      requiresAll: false,
      steps: [
        { order: 1, signerName: 'Sheerin Khosrowshahi', signerRole: 'UPM', required: true, amountThreshold: 5000 },
        { order: 2, signerName: 'John Alfred', signerRole: 'Focus Executive', required: true, amountThreshold: 50000 },
      ]
    },
    {
      id: 'WORK-003',
      name: 'Invoice Approval - Accounts',
      type: 'invoices',
      department: 'ACCOUNTS',
      requiresAll: true,
      steps: [
        { order: 1, signerName: 'John Alfred', signerRole: 'Focus Executive', required: true },
      ]
    },
  ]);

  const departments = [
    { label: 'Production', value: 'PRODUCTION' },
    { label: 'Accounts', value: 'ACCOUNTS' },
    { label: 'Post Production', value: 'POST PRODUCTION' },
    { label: 'Editorial', value: 'EDITORIAL' },
    { label: 'VFX', value: 'VFX' },
    { label: 'Music', value: 'MUSIC' },
  ];

  const workflowTypes = [
    { label: 'Timesheets', value: 'timesheets' },
    { label: 'Expenses', value: 'expenses' },
    { label: 'Invoices', value: 'invoices' },
    { label: 'Purchase Orders', value: 'purchaseOrders' },
    { label: 'Contracts', value: 'contracts' },
    { label: 'Call Sheets', value: 'callSheets' },
    { label: 'Schedule Changes', value: 'scheduleChanges' },
  ];

  const getWorkflowIcon = (type) => {
    switch (type) {
      case 'timesheets': return Clock;
      case 'expenses': return DollarSign;
      case 'invoices': return FileText;
      case 'purchaseOrders': return Briefcase;
      case 'contracts': return FileSignature;
      default: return FileText;
    }
  };

  const handleEdit = (workflow) => {
    setEditingWorkflowId(workflow.id);
  };

  const handleSave = (workflowId) => {
    setEditingWorkflowId(null);
    // Save logic here
  };

  const handleDelete = (workflowId) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      setWorkflows(workflows.filter(w => w.id !== workflowId));
    }
  };

  const handleFieldChange = (workflowId, field, value) => {
    setWorkflows(workflows.map(w => 
      w.id === workflowId ? { ...w, [field]: value } : w
    ));
  };

  return (
    <CardWrapper
      title="Approval Workflows"
      icon="FileSignature"
      description="Configure approval chains for timesheets, expenses, and more"
      actions={
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-lavender-500 to-pastel-pink-500 hover:from-lavender-600 hover:to-pastel-pink-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Workflow
        </Button>
      }
    >
      {/* Workflows List */}
      <div className="space-y-4">
        {workflows.map((workflow) => {
          const isEditing = editingWorkflowId === workflow.id;
          const Icon = getWorkflowIcon(workflow.type);
          
          return (
            <motion.div
              key={workflow.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 border rounded-xl bg-card border-border space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-lavender-100 dark:bg-lavender-900/30">
                    <Icon className="w-5 h-5 text-lavender-600 dark:text-lavender-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-card-foreground">{workflow.name}</h4>
                    {workflow.department && (
                      <p className="text-sm text-muted-foreground">
                        Department: {workflow.department}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingWorkflowId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSave(workflow.id)}
                        className="bg-gradient-to-r from-lavender-500 to-pastel-pink-500 hover:from-lavender-600 hover:to-pastel-pink-600"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(workflow)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(workflow.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Editable Fields */}
              {isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <EditableTextDataField
                    label="Workflow Name"
                    icon="FileSignature"
                    value={workflow.name}
                    isEditing={isEditing}
                    onChange={(value) => handleFieldChange(workflow.id, 'name', value)}
                  />

                  <EditableSelectField
                    label="Workflow Type"
                    icon="Tag"
                    value={workflow.type}
                    items={workflowTypes}
                    isEditing={isEditing}
                    onChange={(value) => handleFieldChange(workflow.id, 'type', value)}
                  />

                  <EditableSelectField
                    label="Department"
                    icon="Building"
                    value={workflow.department}
                    items={departments}
                    isEditing={isEditing}
                    onChange={(value) => handleFieldChange(workflow.id, 'department', value)}
                  />

                  <EditableCheckboxField
                    label="Require all approvals (if unchecked, any single approval is sufficient)"
                    checked={workflow.requiresAll}
                    isEditing={isEditing}
                    onChange={(checked) => handleFieldChange(workflow.id, 'requiresAll', checked)}
                  />
                </div>
              )}

              {/* Workflow Steps */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                  Approval Steps
                </p>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {workflow.steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="px-3 py-2 rounded-lg min-w-[200px] bg-muted border border-border">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-lavender-600 dark:text-lavender-400">
                            STEP {step.order}
                          </span>
                          {step.required && (
                            <span className="text-xs font-semibold text-destructive">REQUIRED</span>
                          )}
                        </div>
                        <div className="text-sm font-semibold text-card-foreground">
                          {step.signerName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {step.signerRole}
                        </div>
                        {step.amountThreshold && (
                          <div className="text-xs text-peach-500 dark:text-peach-400 mt-1">
                            Up to ${step.amountThreshold.toLocaleString()}
                          </div>
                        )}
                      </div>
                      {idx < workflow.steps.length - 1 && (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Workflow Info */}
              {workflow.requiresAll && !isEditing && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <AlertCircle className="w-3 h-3" />
                  All approvals required
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </CardWrapper>
  );
}