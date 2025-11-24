import { motion } from 'framer-motion';
import { UserPlus, Users, Trash2, Check } from 'lucide-react';
import { toast } from 'sonner';

export function AccessTab({ 
  agentAccesses, 
  setAgentAccesses,
  agentEmail,
  setAgentEmail,
  selectedPermissions,
  setSelectedPermissions
}) {
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
      name: 'New Agent',
      role: 'Agent',
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
    <motion.div
      key="access"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Give Access Card */}
      <div className="bg-card rounded-lg p-6 shadow-md border border-border">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-1 h-16 bg-primary rounded-full"></div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Your Account</h2>
            <p className="text-muted-foreground">Give another person access to your account</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Recipient's Email Address</label>
            <input
              type="email"
              value={agentEmail}
              onChange={(e) => setAgentEmail(e.target.value)}
              placeholder="agent@example.com"
              className="w-full px-4 py-3 bg-input border border-border rounded-lg outline-none focus:border-primary text-foreground placeholder-muted-foreground transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Permissions</label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors duration-200">
                <span className="text-sm font-medium text-foreground">View Profile</span>
                <input
                  type="checkbox"
                  checked={selectedPermissions.viewProfile}
                  onChange={(e) => setSelectedPermissions({ ...selectedPermissions, viewProfile: e.target.checked })}
                  className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors duration-200">
                <span className="text-sm font-medium text-foreground">Edit Profile</span>
                <input
                  type="checkbox"
                  checked={selectedPermissions.editProfile}
                  onChange={(e) => setSelectedPermissions({ ...selectedPermissions, editProfile: e.target.checked })}
                  className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors duration-200">
                <span className="text-sm font-medium text-foreground">Manage Documents</span>
                <input
                  type="checkbox"
                  checked={selectedPermissions.manageDocuments}
                  onChange={(e) => setSelectedPermissions({ ...selectedPermissions, manageDocuments: e.target.checked })}
                  className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors duration-200">
                <span className="text-sm font-medium text-foreground">Manage Projects</span>
                <input
                  type="checkbox"
                  checked={selectedPermissions.manageProjects}
                  onChange={(e) => setSelectedPermissions({ ...selectedPermissions, manageProjects: e.target.checked })}
                  className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                />
              </label>
            </div>
          </div>

          <motion.button
            onClick={handleGiveAccess}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <UserPlus className="w-5 h-5" />
            <span>Give Access</span>
          </motion.button>
        </div>
      </div>

      {/* Current Agents with Access */}
      <div className="bg-card rounded-lg p-6 shadow-md border border-border">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">People with Access</h2>
        </div>

        {agentAccesses.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No agents have access to your account</p>
          </div>
        ) : (
          <div className="space-y-3">
            {agentAccesses.map((agent) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 border border-border rounded-lg hover:shadow-md transition-all duration-300 bg-muted/30"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{agent.name}</h3>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        agent.status === 'active' 
                          ? 'bg-accent/10 text-accent border border-accent/20' 
                          : 'bg-secondary/10 text-secondary border border-secondary/20'
                      }`}>
                        {agent.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{agent.email}</p>
                    <p className="text-xs text-muted-foreground">Role: {agent.role} • Granted: {agent.grantedDate}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {agent.permissions.viewProfile && (
                        <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full flex items-center gap-1 font-semibold border border-primary/20">
                          <Check className="w-3 h-3" /> View
                        </span>
                      )}
                      {agent.permissions.editProfile && (
                        <span className="px-2 py-1 text-xs bg-secondary/10 text-secondary rounded-full flex items-center gap-1 font-semibold border border-secondary/20">
                          <Check className="w-3 h-3" /> Edit
                        </span>
                      )}
                      {agent.permissions.manageDocuments && (
                        <span className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-full flex items-center gap-1 font-semibold border border-accent/20">
                          <Check className="w-3 h-3" /> Documents
                        </span>
                      )}
                      {agent.permissions.manageProjects && (
                        <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full flex items-center gap-1 font-semibold border border-primary/20">
                          <Check className="w-3 h-3" /> Projects
                        </span>
                      )}
                    </div>
                  </div>

                  <motion.button
                    onClick={() => handleRevokeAccess(agent.id)}
                    className="px-4 py-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg hover:bg-destructive/20 transition-colors duration-300 flex items-center gap-2 font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Revoke Access</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}



