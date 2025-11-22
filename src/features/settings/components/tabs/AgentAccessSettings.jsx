import React, { useState } from 'react';
import { UserPlus, Users, Mail, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AgentAccessSettings({ isDarkMode }) {
  const [agentEmail, setAgentEmail] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState({
    viewProfile: true,
    editProfile: false,
    manageDocuments: false,
    manageProjects: false,
  });

  const [agentAccesses, setAgentAccesses] = useState([
    {
      id: 1,
      email: 'agent@talentagency.com',
      name: 'RAJESH KUMAR',
      role: 'TALENT AGENT',
      permissions: {
        viewProfile: true,
        editProfile: true,
        manageDocuments: true,
        manageProjects: true,
      },
      grantedDate: '15/01/2024',
      status: 'active',
    },
    {
      id: 2,
      email: 'manager@castingdirector.com',
      name: 'PRIYA SHARMA',
      role: 'CASTING DIRECTOR',
      permissions: {
        viewProfile: true,
        editProfile: false,
        manageDocuments: true,
        manageProjects: false,
      },
      grantedDate: '20/02/2024',
      status: 'active',
    },
  ]);

  const handleGiveAccess = () => {
    if (!agentEmail) {
      toast.error('Please enter agent email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(agentEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const newAgent = {
      id: agentAccesses.length + 1,
      email: agentEmail.toLowerCase(),
      name: 'NEW AGENT',
      role: 'AGENT',
      permissions: selectedPermissions,
      grantedDate: new Date().toLocaleDateString('en-GB'),
      status: 'pending',
    };

    setAgentAccesses([...agentAccesses, newAgent]);
    setAgentEmail('');
    setSelectedPermissions({
      viewProfile: true,
      editProfile: false,
      manageDocuments: false,
      manageProjects: false,
    });
    toast.success('Access invitation sent to agent!');
  };

  const handleRevokeAccess = (id) => {
    setAgentAccesses(agentAccesses.filter(agent => agent.id !== id));
    toast.success('Agent access revoked successfully');
  };

  return (
    <div className="space-y-4">
      {/* Add Agent */}
      <div className="rounded-lg border border-border bg-card p-6 transition-colors duration-400">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="font-bold text-lg text-foreground">
            GRANT ACCESS TO AGENT
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-2 text-muted-foreground">
              AGENT EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <input
                type="email"
                value={agentEmail}
                onChange={(e) => setAgentEmail(e.target.value)}
                placeholder="AGENT@EXAMPLE.COM"
                className="w-full pl-10 pr-4 py-2 rounded-3xl border-2 border-input bg-input text-foreground placeholder-muted-foreground font-bold transition-all focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-3 text-muted-foreground">
              PERMISSIONS
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              <label className={`flex items-center justify-between px-4 py-3 rounded-3xl cursor-pointer transition-all border-2 ${
                selectedPermissions.viewProfile 
                  ? 'bg-primary border-primary' 
                  : 'border-input bg-muted hover:border-primary'
              }`}>
                <span className={`font-bold ${selectedPermissions.viewProfile ? 'text-primary-foreground' : 'text-foreground'}`}>
                  VIEW PROFILE
                </span>
                <input
                  type="checkbox"
                  checked={selectedPermissions.viewProfile}
                  onChange={(e) => setSelectedPermissions({ ...selectedPermissions, viewProfile: e.target.checked })}
                  className="w-5 h-5 rounded focus:ring-2 focus:ring-primary"
                />
              </label>

              <label className={`flex items-center justify-between px-4 py-3 rounded-3xl cursor-pointer transition-all border-2 ${
                selectedPermissions.editProfile 
                  ? 'bg-primary border-primary' 
                  : 'border-input bg-muted hover:border-primary'
              }`}>
                <span className={`font-bold ${selectedPermissions.editProfile ? 'text-primary-foreground' : 'text-foreground'}`}>
                  EDIT PROFILE
                </span>
                <input
                  type="checkbox"
                  checked={selectedPermissions.editProfile}
                  onChange={(e) => setSelectedPermissions({ ...selectedPermissions, editProfile: e.target.checked })}
                  className="w-5 h-5 rounded focus:ring-2 focus:ring-primary"
                />
              </label>

              <label className={`flex items-center justify-between px-4 py-3 rounded-3xl cursor-pointer transition-all border-2 ${
                selectedPermissions.manageDocuments 
                  ? 'bg-primary border-primary' 
                  : 'border-input bg-muted hover:border-primary'
              }`}>
                <span className={`font-bold ${selectedPermissions.manageDocuments ? 'text-primary-foreground' : 'text-foreground'}`}>
                  MANAGE DOCUMENTS
                </span>
                <input
                  type="checkbox"
                  checked={selectedPermissions.manageDocuments}
                  onChange={(e) => setSelectedPermissions({ ...selectedPermissions, manageDocuments: e.target.checked })}
                  className="w-5 h-5 rounded focus:ring-2 focus:ring-primary"
                />
              </label>

              <label className={`flex items-center justify-between px-4 py-3 rounded-3xl cursor-pointer transition-all border-2 ${
                selectedPermissions.manageProjects 
                  ? 'bg-primary border-primary' 
                  : 'border-input bg-muted hover:border-primary'
              }`}>
                <span className={`font-bold ${selectedPermissions.manageProjects ? 'text-primary-foreground' : 'text-foreground'}`}>
                  MANAGE PROJECTS
                </span>
                <input
                  type="checkbox"
                  checked={selectedPermissions.manageProjects}
                  onChange={(e) => setSelectedPermissions({ ...selectedPermissions, manageProjects: e.target.checked })}
                  className="w-5 h-5 rounded focus:ring-2 focus:ring-primary"
                />
              </label>
            </div>
          </div>

          <button
            onClick={handleGiveAccess}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-3xl font-bold hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            GRANT ACCESS
          </button>
        </div>
      </div>

      {/* Current Agents with Access */}
      <div className="rounded-lg border border-border bg-card p-6 transition-colors duration-400">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Users className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="font-bold text-lg text-foreground">
            PEOPLE WITH ACCESS ({agentAccesses.length})
          </h3>
        </div>

        {agentAccesses.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">
              NO AGENTS HAVE ACCESS TO YOUR ACCOUNT
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {agentAccesses.map((agent) => (
              <div
                key={agent.id}
                className="p-4 border-2 border-border bg-muted rounded-lg transition-all hover:border-primary"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-foreground">
                        {agent.name}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                        agent.status === 'active' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-yellow-600 text-white'
                      }`}>
                        {agent.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm mb-2 text-muted-foreground">
                      {agent.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ROLE: {agent.role} • GRANTED: {agent.grantedDate}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {agent.permissions.viewProfile && (
                        <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full flex items-center gap-1 font-bold">
                          <Check className="w-3 h-3" /> VIEW
                        </span>
                      )}
                      {agent.permissions.editProfile && (
                        <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full flex items-center gap-1 font-bold">
                          <Check className="w-3 h-3" /> EDIT
                        </span>
                      )}
                      {agent.permissions.manageDocuments && (
                        <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full flex items-center gap-1 font-bold">
                          <Check className="w-3 h-3" /> DOCUMENTS
                        </span>
                      )}
                      {agent.permissions.manageProjects && (
                        <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full flex items-center gap-1 font-bold">
                          <Check className="w-3 h-3" /> PROJECTS
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleRevokeAccess(agent.id)}
                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-all duration-200 flex items-center gap-2 font-bold"
                  >
                    <Trash2 className="w-4 h-4" />
                    REVOKE ACCESS
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}