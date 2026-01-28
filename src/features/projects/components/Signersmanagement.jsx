import { useState } from 'react';
import { Plus, Trash2, Edit, UserCheck, Mail, Check, Search, Clock, DollarSign, FileText, Briefcase, FileSignature, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import CardWrapper from '@/shared/components/wrappers/CardWrapper';
import EditableTextDataField from '@/shared/components/wrappers/EditableTextDataField';
import EditableSelectField from '@/shared/components/wrappers/EditableSelectField';
import EditableCheckboxField from '@/shared/components/wrappers/EditableCheckboxField';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { SmartIcon } from '@/shared/components/SmartIcon';

export default function SignersManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [editingSignerId, setEditingSignerId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [signers, setSigners] = useState([
    {
      id: 'SIGN-001',
      name: 'Sheerin Khosrowshahi',
      role: 'UPM - Unit Production Manager',
      email: 'sheerin@project.com',
      department: 'PRODUCTION',
      hasSignature: true,
      approvalTypes: ['Timesheets', 'Expenses', 'Call Sheets'],
      amountLimit: 5000,
      canApprove: {
        timesheets: true,
        expenses: true,
        invoices: false,
        purchaseOrders: false,
        contracts: false,
        callSheets: true,
        scheduleChanges: true
      },
      order: 1,
      requiresSecondApproval: false,
    },
    {
      id: 'SIGN-002',
      name: 'John Alfred',
      role: 'Focus Executive',
      email: 'john.alfred@focusfeatures.com',
      department: 'ACCOUNTS',
      hasSignature: true,
      approvalTypes: ['Invoices', 'Purchase Orders', 'Expenses'],
      amountLimit: 50000,
      canApprove: {
        timesheets: false,
        expenses: true,
        invoices: true,
        purchaseOrders: true,
        contracts: true,
        callSheets: false,
        scheduleChanges: false
      },
      order: 2,
      requiresSecondApproval: false,
    },
    {
      id: 'SIGN-003',
      name: 'Jason Leib',
      role: 'Focus Executive',
      email: 'jason.leib@focusfeatures.com',
      department: 'POST PRODUCTION',
      hasSignature: false,
      approvalTypes: ['Timesheets', 'Schedules'],
      amountLimit: 10000,
      canApprove: {
        timesheets: true,
        expenses: true,
        invoices: false,
        purchaseOrders: false,
        contracts: false,
        callSheets: false,
        scheduleChanges: true
      },
      order: 3,
      requiresSecondApproval: true,
    },
  ]);

  const departments = [
    { label: 'All Departments', value: 'all' },
    { label: 'Production', value: 'PRODUCTION' },
    { label: 'Accounts', value: 'ACCOUNTS' },
    { label: 'Post Production', value: 'POST PRODUCTION' },
    { label: 'Editorial', value: 'EDITORIAL' },
    { label: 'VFX', value: 'VFX' },
    { label: 'Music', value: 'MUSIC' },
  ];

  const getApprovalIcon = (key) => {
    switch (key) {
      case 'timesheets': return Clock;
      case 'expenses': return DollarSign;
      case 'invoices': return FileText;
      case 'purchaseOrders': return Briefcase;
      case 'contracts': return FileSignature;
      case 'callSheets': return FileText;
      case 'scheduleChanges': return Clock;
      default: return FileText;
    }
  };

  const filteredSigners = signers.filter(signer => {
    const matchesSearch = signer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         signer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         signer.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || signer.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleEdit = (signer) => {
    setEditingSignerId(signer.id);
  };

  const handleSave = (signerId) => {
    setEditingSignerId(null);
    // Save logic here
  };

  const handleDelete = (signerId) => {
    if (confirm('Are you sure you want to delete this signer?')) {
      setSigners(signers.filter(s => s.id !== signerId));
    }
  };

  const handleFieldChange = (signerId, field, value) => {
    setSigners(signers.map(s => 
      s.id === signerId ? { ...s, [field]: value } : s
    ));
  };

  return (
    <CardWrapper
      title="Authorized Signers"
      icon="UserCheck"
      description="Manage who can approve timesheets, expenses, and other documents"
      actions={
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-lavender-500 to-pastel-pink-500 hover:from-lavender-600 hover:to-pastel-pink-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Signer
        </Button>
      }
    >
      {/* Search and Filter */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search signers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <EditableSelectField
          label=""
          items={departments}
          value={selectedDepartment}
          onChange={setSelectedDepartment}
          isEditing={true}
        />
      </div>

      {/* Signers List */}
      <div className="space-y-4">
        {filteredSigners.map((signer) => {
          const isEditing = editingSignerId === signer.id;
          
          return (
            <motion.div
              key={signer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 border rounded-xl bg-card border-border space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-lavender-100 dark:bg-lavender-900/30">
                    <UserCheck className="w-5 h-5 text-lavender-600 dark:text-lavender-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-card-foreground">{signer.name}</h4>
                    <p className="text-sm text-muted-foreground">{signer.role}</p>
                  </div>
                  {signer.hasSignature && (
                    <span className="px-2 py-1 bg-mint-100 text-mint-700 dark:bg-mint-900/30 dark:text-mint-300 rounded text-xs font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Has Signature
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingSignerId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSave(signer.id)}
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
                        onClick={() => handleEdit(signer)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(signer.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableTextDataField
                  label="Full Name"
                  icon="User"
                  value={signer.name}
                  isEditing={isEditing}
                  onChange={(value) => handleFieldChange(signer.id, 'name', value)}
                />

                <EditableTextDataField
                  label="Role/Title"
                  icon="Briefcase"
                  value={signer.role}
                  isEditing={isEditing}
                  onChange={(value) => handleFieldChange(signer.id, 'role', value)}
                />

                <EditableTextDataField
                  label="Email Address"
                  icon="Mail"
                  value={signer.email}
                  isEditing={isEditing}
                  onChange={(value) => handleFieldChange(signer.id, 'email', value)}
                />

                <EditableSelectField
                  label="Department"
                  icon="Building"
                  value={signer.department}
                  items={departments.filter(d => d.value !== 'all')}
                  isEditing={isEditing}
                  onChange={(value) => handleFieldChange(signer.id, 'department', value)}
                />

                <EditableTextDataField
                  label="Approval Limit ($)"
                  icon="DollarSign"
                  value={signer.amountLimit?.toString()}
                  isEditing={isEditing}
                  onChange={(value) => handleFieldChange(signer.id, 'amountLimit', parseInt(value))}
                />

                <EditableTextDataField
                  label="Approval Order"
                  icon="Hash"
                  value={signer.order?.toString()}
                  isEditing={isEditing}
                  onChange={(value) => handleFieldChange(signer.id, 'order', parseInt(value))}
                />
              </div>

              {/* Approval Permissions */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Approval Permissions
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(signer.canApprove).map(([key, value]) => {
                    if (!value && !isEditing) return null;
                    const Icon = getApprovalIcon(key);
                    return (
                      <div key={key}>
                        {isEditing ? (
                          <EditableCheckboxField
                            label={
                              <div className="flex items-center gap-2">
                                <Icon className="w-3 h-3" />
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </div>
                            }
                            checked={value}
                            isEditing={isEditing}
                            onChange={(checked) => handleFieldChange(signer.id, 'canApprove', {
                              ...signer.canApprove,
                              [key]: checked
                            })}
                          />
                        ) : (
                          <div className="px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 bg-muted text-muted-foreground">
                            <Icon className="w-3 h-3" />
                            {key.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Additional Settings */}
              <EditableCheckboxField
                label="Requires second approval for high-value transactions"
                checked={signer.requiresSecondApproval}
                isEditing={isEditing}
                onChange={(checked) => handleFieldChange(signer.id, 'requiresSecondApproval', checked)}
              />
            </motion.div>
          );
        })}
      </div>
    </CardWrapper>
  );
}