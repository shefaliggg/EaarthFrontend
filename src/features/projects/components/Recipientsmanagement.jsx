import { useState } from 'react';
import { Plus, Trash2, Edit, Mail, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import CardWrapper from '@/shared/components/wrappers/CardWrapper';
import EditableTextDataField from '@/shared/components/wrappers/EditableTextDataField';
import EditableSelectField from '@/shared/components/wrappers/EditableSelectField';
import EditableRadioField from '@/shared/components/wrappers/EditableRadioField';
import EditableCheckboxField from '@/shared/components/wrappers/EditableCheckboxField';
import { Button } from '@/shared/components/ui/button';
import { SmartIcon } from '@/shared/components/SmartIcon';

export default function RecipientsManagement() {
  const [editingRecipientId, setEditingRecipientId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [recipients, setRecipients] = useState([
    {
      id: 'REC-001',
      name: 'Production Filing',
      email: 'production@project.com',
      type: 'department',
      autoCC: true,
      department: 'PRODUCTION'
    },
    {
      id: 'REC-002',
      name: 'Box Filing',
      email: 'box.filing@u.box.com',
      type: 'external',
      autoCC: false
    },
    {
      id: 'REC-003',
      name: 'Accounts Team',
      email: 'accounts@project.com',
      type: 'department',
      autoCC: true,
      department: 'ACCOUNTS'
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

  const recipientTypes = [
    { label: 'Individual', value: 'individual' },
    { label: 'Department', value: 'department' },
    { label: 'External', value: 'external' },
  ];

  const handleEdit = (recipient) => {
    setEditingRecipientId(recipient.id);
  };

  const handleSave = (recipientId) => {
    setEditingRecipientId(null);
    // Save logic here
  };

  const handleDelete = (recipientId) => {
    if (confirm('Are you sure you want to delete this recipient?')) {
      setRecipients(recipients.filter(r => r.id !== recipientId));
    }
  };

  const handleFieldChange = (recipientId, field, value) => {
    setRecipients(recipients.map(r => 
      r.id === recipientId ? { ...r, [field]: value } : r
    ));
  };

  const getTypeBadgeColor = (type) => {
    switch(type) {
      case 'department':
        return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300';
      case 'external':
        return 'bg-peach-100 text-peach-700 dark:bg-peach-900/30 dark:text-peach-300';
      case 'individual':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <CardWrapper
      title="Document Recipients"
      icon="Mail"
      description="Manage who receives copies of signed documents"
      actions={
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-lavender-500 to-pastel-pink-500 hover:from-lavender-600 hover:to-pastel-pink-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Recipient
        </Button>
      }
    >
      {/* Recipients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recipients.map((recipient) => {
          const isEditing = editingRecipientId === recipient.id;
          
          return (
            <motion.div
              key={recipient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 border rounded-xl bg-card border-border space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-lavender-600 dark:text-lavender-400" />
                  <h4 className="font-bold text-card-foreground">{recipient.name}</h4>
                </div>
                
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingRecipientId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSave(recipient.id)}
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
                        onClick={() => handleEdit(recipient)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(recipient.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-4">
                <EditableTextDataField
                  label="Recipient Name"
                  icon="User"
                  value={recipient.name}
                  isEditing={isEditing}
                  onChange={(value) => handleFieldChange(recipient.id, 'name', value)}
                />

                <EditableTextDataField
                  label="Email Address"
                  icon="Mail"
                  value={recipient.email}
                  isEditing={isEditing}
                  onChange={(value) => handleFieldChange(recipient.id, 'email', value)}
                />

                <EditableRadioField
                  label="Recipient Type"
                  icon="Tag"
                  value={recipient.type}
                  options={recipientTypes}
                  isEditing={isEditing}
                  onChange={(value) => handleFieldChange(recipient.id, 'type', value)}
                />

                {recipient.type === 'department' && (
                  <EditableSelectField
                    label="Department"
                    icon="Building"
                    value={recipient.department}
                    items={departments}
                    isEditing={isEditing}
                    onChange={(value) => handleFieldChange(recipient.id, 'department', value)}
                  />
                )}

                <EditableCheckboxField
                  label="Automatically CC on all documents"
                  checked={recipient.autoCC}
                  isEditing={isEditing}
                  onChange={(checked) => handleFieldChange(recipient.id, 'autoCC', checked)}
                />
              </div>

              {/* Badges - View Only */}
              {!isEditing && (
                <div className="flex items-center gap-2 pt-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getTypeBadgeColor(recipient.type)}`}>
                    {recipient.type.toUpperCase()}
                  </span>
                  {recipient.autoCC && (
                    <span className="px-2 py-1 bg-mint-100 text-mint-700 dark:bg-mint-900/30 dark:text-mint-300 rounded text-xs font-semibold">
                      Auto CC
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </CardWrapper>
  );
}