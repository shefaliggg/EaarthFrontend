// ProjectCrewOnboardingSteps.jsx
import { useState } from 'react';
import { Info, Plus, Trash2, Send } from 'lucide-react';
import EditableTextDataField from "../../../shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "../../../shared/components/wrappers/EditableSelectField";
import CardWrapper from "../../../shared/components/wrappers/CardWrapper";

const ProjectCrewOnboardingSteps = () => {
  const [fcInvites, setFcInvites] = useState([
    { 
      id: 1, 
      firstName: '', 
      lastName: '', 
      email: '', 
      address: '', 
      role: 'Financial Controller',
      department: 'Finance'
    }
  ]);

  const [upmInvites, setUpmInvites] = useState([
    { 
      id: 1, 
      firstName: '', 
      lastName: '', 
      email: '', 
      address: '', 
      role: 'Unit Production Manager',
      department: 'Production'
    }
  ]);

  const addFcInvite = () => {
    setFcInvites([...fcInvites, {
      id: fcInvites.length + 1,
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      role: 'Financial Controller',
      department: 'Finance'
    }]);
  };

  const addUpmInvite = () => {
    setUpmInvites([...upmInvites, {
      id: upmInvites.length + 1,
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      role: 'Unit Production Manager',
      department: 'Production'
    }]);
  };

  const deleteFcInvite = (id) => {
    setFcInvites(fcInvites.filter(invite => invite.id !== id));
  };

  const deleteUpmInvite = (id) => {
    setUpmInvites(upmInvites.filter(invite => invite.id !== id));
  };

  const updateFcInvite = (id, field, value) => {
    setFcInvites(fcInvites.map(invite => 
      invite.id === id ? { ...invite, [field]: value } : invite
    ));
  };

  const updateUpmInvite = (id, field, value) => {
    setUpmInvites(upmInvites.map(invite => 
      invite.id === id ? { ...invite, [field]: value } : invite
    ));
  };

  const sendInvite = (type, id) => {
    alert(`Sending invite for ${type} with ID: ${id}`);
  };

  const roleOptions = [
    { value: 'Financial Controller', label: 'Financial Controller' },
    { value: 'Accountant', label: 'Accountant' },
    { value: 'Finance Manager', label: 'Finance Manager' }
  ];

  const upmRoleOptions = [
    { value: 'Unit Production Manager', label: 'Unit Production Manager' },
    { value: 'Production Manager', label: 'Production Manager' },
    { value: 'Line Producer', label: 'Line Producer' }
  ];

  const departmentOptions = [
    { value: 'Finance', label: 'Finance' },
    { value: 'Production', label: 'Production' },
    { value: 'Accounts', label: 'Accounts' }
  ];

  return (
    <div className="space-y-6">
      {/* Financial Controller (FC) Invites */}
      <CardWrapper
        title="Financial Controller (FC) - Invite Team"
        variant="default"
        showLabel={true}
        description="Invite Financial Controllers to join the project"
        actions={
          <button
            onClick={addFcInvite}
            className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add FC Invite
          </button>
        }
      >
        <div className="space-y-6">
          {fcInvites.map((invite, index) => (
            <div key={invite.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-semibold text-gray-900">FC Invite #{index + 1}</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => sendInvite('FC', invite.id)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Invite
                  </button>
                  {fcInvites.length > 1 && (
                    <button
                      onClick={() => deleteFcInvite(invite.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Row 1: First Name, Last Name */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <EditableTextDataField
                  label="First Name"
                  value={invite.firstName}
                  onChange={(val) => updateFcInvite(invite.id, 'firstName', val)}
                  isEditing={true}
                  placeholder="Enter first name"
                />
                <EditableTextDataField
                  label="Last Name"
                  value={invite.lastName}
                  onChange={(val) => updateFcInvite(invite.id, 'lastName', val)}
                  isEditing={true}
                  placeholder="Enter last name"
                />
              </div>

              {/* Row 2: Email, Address */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <EditableTextDataField
                  label="Email"
                  value={invite.email}
                  onChange={(val) => updateFcInvite(invite.id, 'email', val)}
                  isEditing={true}
                  placeholder="email@example.com"
                />
                <EditableTextDataField
                  label="Address"
                  value={invite.address}
                  onChange={(val) => updateFcInvite(invite.id, 'address', val)}
                  isEditing={true}
                  placeholder="Enter address"
                />
              </div>

              {/* Row 3: Role, Department */}
              <div className="grid grid-cols-2 gap-4">
                <EditableSelectField
                  label="Role"
                  value={invite.role}
                  items={roleOptions}
                  isEditing={true}
                  onChange={(val) => updateFcInvite(invite.id, 'role', val)}
                />
                <EditableSelectField
                  label="Department"
                  value={invite.department}
                  items={departmentOptions}
                  isEditing={true}
                  onChange={(val) => updateFcInvite(invite.id, 'department', val)}
                />
              </div>
            </div>
          ))}
        </div>
      </CardWrapper>

      {/* Unit Production Manager (UPM) Invites */}
      <CardWrapper
        title="Unit Production Manager (UPM) - Invite Team"
        variant="default"
        showLabel={true}
        description="Invite Unit Production Managers to join the project"
        actions={
          <button
            onClick={addUpmInvite}
            className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add UPM Invite
          </button>
        }
      >
        <div className="space-y-6">
          {upmInvites.map((invite, index) => (
            <div key={invite.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-semibold text-gray-900">UPM Invite #{index + 1}</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => sendInvite('UPM', invite.id)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Invite
                  </button>
                  {upmInvites.length > 1 && (
                    <button
                      onClick={() => deleteUpmInvite(invite.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Row 1: First Name, Last Name */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <EditableTextDataField
                  label="First Name"
                  value={invite.firstName}
                  onChange={(val) => updateUpmInvite(invite.id, 'firstName', val)}
                  isEditing={true}
                  placeholder="Enter first name"
                />
                <EditableTextDataField
                  label="Last Name"
                  value={invite.lastName}
                  onChange={(val) => updateUpmInvite(invite.id, 'lastName', val)}
                  isEditing={true}
                  placeholder="Enter last name"
                />
              </div>

              {/* Row 2: Email, Address */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <EditableTextDataField
                  label="Email"
                  value={invite.email}
                  onChange={(val) => updateUpmInvite(invite.id, 'email', val)}
                  isEditing={true}
                  placeholder="email@example.com"
                />
                <EditableTextDataField
                  label="Address"
                  value={invite.address}
                  onChange={(val) => updateUpmInvite(invite.id, 'address', val)}
                  isEditing={true}
                  placeholder="Enter address"
                />
              </div>

              {/* Row 3: Role, Department */}
              <div className="grid grid-cols-2 gap-4">
                <EditableSelectField
                  label="Role"
                  value={invite.role}
                  items={upmRoleOptions}
                  isEditing={true}
                  onChange={(val) => updateUpmInvite(invite.id, 'role', val)}
                />
                <EditableSelectField
                  label="Department"
                  value={invite.department}
                  items={departmentOptions}
                  isEditing={true}
                  onChange={(val) => updateUpmInvite(invite.id, 'department', val)}
                />
              </div>
            </div>
          ))}
        </div>
      </CardWrapper>

      {/* Invite Summary */}
      
    </div>
  );
};

export default ProjectCrewOnboardingSteps;