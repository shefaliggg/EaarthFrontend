import { useState } from 'react';
import { Info, Plus, Download, Trash2 } from 'lucide-react';
import { Button } from "@/shared/components/ui/button";
import { PageHeader } from "@/shared/components/PageHeader";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

const ProjectRoles = () => {
  const [twoFactorAuth, setTwoFactorAuth] = useState("none");
  const [activeTab, setActiveTab] = useState("assignments");

  // Permission table data
  const rolesPermissions = [
    {
      id: 1,
      role: "Studio Supervisor",
      description: "Production company owner",
      settings: "Edit",
      calendar: "Edit",
      offers: ["Edit", "Send"],
      manageCrew: ["Edit overtime", "Send notice"],
      generate: "None",
      approve: "View"
    },
    {
      id: 2,
      role: "Production Supervisor",
      description: "PM, LP",
      settings: "Edit",
      calendar: "Edit",
      offers: ["Edit", "Send"],
      manageCrew: ["Edit overtime", "Send notice"],
      generate: "None",
      approve: ["Approve", "Export"]
    },
    {
      id: 3,
      role: "Production Admin",
      description: "APOC, Prod Sec.",
      settings: "Edit",
      calendar: "Edit",
      offers: "Edit",
      manageCrew: "Send notice",
      generate: "None",
      approve: ["View", "Export"]
    },
    {
      id: 4,
      role: "Accounts Supervisor",
      description: "FC, Prod Acc.",
      settings: "View",
      calendar: "View",
      offers: "Edit",
      manageCrew: "View overtime",
      generate: "None",
      approve: ["Approve", "Export"]
    },
    {
      id: 5,
      role: "Accounts Admin",
      description: "Payroll staff",
      settings: "View",
      calendar: "View",
      offers: "View",
      manageCrew: "View overtime",
      generate: "None",
      approve: ["View", "Export"]
    },
    {
      id: 6,
      role: "Department Supervisor *",
      description: "Gaffer, Art Dir.",
      settings: "None",
      calendar: "View",
      offers: "Edit",
      manageCrew: "View overtime",
      generate: "Edit",
      approve: ["Approve", "Export"]
    },
    {
      id: 7,
      role: "Dept. Sup. (Timecard) *",
      description: "POC, Costume Sup.",
      settings: "None",
      calendar: "View",
      offers: "None",
      manageCrew: "None",
      generate: "Edit",
      approve: ["Approve", "Export"]
    }
  ];

  // Project roles assignment data
  const [projectRolesData] = useState([
    {
      category: "PROJECT",
      items: []
    },
    {
      category: "PRODUCTION",
      items: [
        { id: "1", name: "Sheerin Khosrowshahi", email: "sheerin.khosrowshahi@gmail.com", role: "Production admin" },
        { id: "2", name: "Farrah Felihi", email: "farrah.felihi@gmail.com", role: "Production admin" },
        { id: "3", name: "Marija L", email: "marija.l@gmail.com", role: "Production admin" },
        { id: "4", name: "Sarris Sarris", email: "sarris.sarris@cloud.com", role: "Production admin" },
        { id: "5", name: "Sheerin Khosrowshahi-Miyazaki", email: "sheerin@gmail.com", role: "Production controller" },
      ]
    },
    {
      category: "ACCOUNTS",
      items: [
        { id: "6", name: "Charlie Edmiston", email: "charlie.edmiston@gmail.com", role: "Accounts admin" },
        { id: "7", name: "Edward Teller", email: "eteller@project.com", role: "Accounts admin" },
        { id: "8", name: "Georgette Lisp", email: "glisp@project.com", role: "Accounts admin" },
        { id: "9", name: "John Alfred", email: "john.alfred@focus.com", role: "Accounts admin", subRole: "(No offer)" },
        { id: "10", name: "Paul Abbott", email: "paul.abbott@broadcast.com", role: "Accounts admin", subRole: "(No offer)" },
        { id: "11", name: "Stephanie Rivera", email: "stephanie.rivera@broadcast.com", role: "Accounts admin", subRole: "(No offer)" },
        { id: "12", name: "Tygra Fritziata", email: "tygra.fritziata@gmail.com", role: "Accounts admin" },
        { id: "13", name: "Daniel Palmer", email: "dan.palmer@focus.com", role: "Accounts controller" },
        { id: "14", name: "Sarris Sarris", email: "sarris.sarris@cloud.com", role: "Accounts controller" },
      ]
    }
  ]);

  const [departmentRolesData] = useState([
    {
      category: "ACCOUNTS",
      items: [
        { id: "15", name: "Sarris Sarris", email: "sarris.sarris@cloud.com", role: "Department controller" },
      ]
    },
    {
      category: "ART",
      items: [
        { id: "16", name: "Artie Tray", email: "artie.tray@gmail.com", role: "Department admin / Timecard artist" },
      ]
    },
    {
      category: "ASSISTANT DIRECTORS",
      items: [
        { id: "17", name: "Jane Trevurela", email: "jane.trevurela@gmail.com", role: "Department admin / Timecard artist" },
        { id: "18", name: "Alistair Balder", email: "alistair.balder@outlook.com", role: "Department admin / Timecard artist" },
        { id: "19", name: "Boris Lock", email: "boris.lock@outlook.co.uk", role: "Department admin / Timecard artist" },
        { id: "20", name: "Arnie Rim-Lock", email: "arnie.rim-lock@gmail.com", role: "Department controller / Timecard artist" },
        { id: "21", name: "Alistair Balder", email: "alistair.balder@outlook.com", role: "Department controller" },
      ]
    }
  ]);

  const renderPermissionCell = (permission) => {
    if (Array.isArray(permission)) {
      return permission.map((item, idx) => (
        <span key={idx} className="text-primary text-xs mr-1">
          {item}
        </span>
      ));
    }
    return <span className={`text-xs ${permission === "None" ? "text-muted-foreground" : "text-primary"}`}>{permission}</span>;
  };

  return (
    <div className="space-y-4">
      {/* Heading with Tabs */}
      <div className="flex items-center justify-between bg-background border rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-base font-semibold">Roles</h2>
          <div className="flex items-center gap-2">
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 transition-all duration-300" style={{ width: '80%' }}></div>
            </div>
            <span className="text-sm font-medium text-gray-600">80%</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("assignments")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "assignments"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-purple-600 hover:bg-gray-200"
            }`}
          >
            Assignments
          </button>
          <button
            onClick={() => setActiveTab("permissions")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "permissions"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-purple-600 hover:bg-gray-200"
            }`}
          >
            Permissions
          </button>
        </div>
      </div>

      {/* Tab Content - Assignments */}
      {activeTab === "assignments" && (
      <div className="space-y-3 pb-6">
      {/* Project Roles Section */}
      <CardWrapper
        title="Project roles"
        icon="Users"
        iconColor="text-orange-500"
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="text-primary border-primary hover:bg-primary/10 h-7">
              <Plus className="w-3 h-3 mr-1" />
              Assign role
            </Button>
            <Button size="sm" variant="outline" className="h-7">
              <Download className="w-3 h-3 mr-1" />
              Export
            </Button>
          </div>
        }
      >
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-3.5 h-3.5 text-primary" />
          <button className="text-[10px] font-medium text-primary hover:underline">
            See more information.
          </button>
        </div>

        <div className="space-y-3">
          {projectRolesData.map((group) => (
            <div key={group.category}>
              <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                {group.category}
              </h3>
              {group.items.length === 0 ? (
                <div className="text-xs text-muted-foreground italic py-1">
                  None have been added yet.
                </div>
              ) : (
                <div className="space-y-0">
                  {group.items.map((user, index) => (
                    <div 
                      key={user.id} 
                      className={`flex items-center justify-between group hover:bg-muted/50 py-1 px-2 transition-colors ${
                        index !== group.items.length - 1 ? 'border-b border-border' : ''
                      }`}
                    >
                      <div className="space-y-0 flex-1">
                        <div className="text-xs font-medium">
                          {user.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-muted-foreground text-right min-w-[160px]">
                          {user.role} {user.subRole && <span className="text-muted-foreground/60">{user.subRole}</span>}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Department Section */}
        <div className="mt-3 pt-3 border-t border-border">
          <h3 className="text-sm font-semibold mb-2">Department</h3>
          <div className="space-y-3">
            {departmentRolesData.map((group) => (
              <div key={group.category}>
                <h3 className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-1">
                  {group.category}
                </h3>
                <div className="space-y-0">
                  {group.items.map((user, index) => (
                    <div 
                      key={user.id} 
                      className={`flex items-center justify-between group hover:bg-muted/50 py-1 px-2 transition-colors ${
                        index !== group.items.length - 1 ? 'border-b border-border' : ''
                      }`}
                    >
                      <div className="space-y-0 flex-1">
                        <div className="text-xs font-medium">
                          {user.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-muted-foreground text-right min-w-[160px]">
                          {user.role}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardWrapper>
      </div>
      )}

      {/* Tab Content - Permissions */}
      {activeTab === "permissions" && (
      <div className="space-y-3 pb-6">
      {/* Permissions Table */}
      <CardWrapper
        title="Role Permissions"
        icon="Shield"
        iconColor="text-orange-500"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {/* Group Headers */}
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="w-[180px] h-7 py-1"></TableHead>
                <TableHead colSpan={2} className="text-center text-[10px] font-semibold uppercase tracking-wider border-r border-border h-7 py-1">
                  System Access
                </TableHead>
                <TableHead colSpan={2} className="text-center text-[10px] font-semibold uppercase tracking-wider border-r border-border h-7 py-1">
                  Crew Management
                </TableHead>
                <TableHead colSpan={2} className="text-center text-[10px] font-semibold uppercase tracking-wider h-7 py-1">
                  Timecards
                </TableHead>
              </TableRow>
              {/* Column Headers */}
              <TableRow>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider h-7 py-1">Role</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider h-7 py-1">Settings</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider border-r border-border h-7 py-1">Calendar</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider h-7 py-1">Offers</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider border-r border-border h-7 py-1">Manage Crew</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider h-7 py-1">Generate</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider h-7 py-1">Approve</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rolesPermissions.map((role) => (
                <TableRow key={role.id} className="hover:bg-muted/50">
                  <TableCell className="py-1.5">
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs">{role.role}</span>
                      <span className="text-[10px] text-muted-foreground">{role.description}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-1.5">{renderPermissionCell(role.settings)}</TableCell>
                  <TableCell className="border-r border-border py-1.5">{renderPermissionCell(role.calendar)}</TableCell>
                  <TableCell className="py-1.5">{renderPermissionCell(role.offers)}</TableCell>
                  <TableCell className="border-r border-border py-1.5">{renderPermissionCell(role.manageCrew)}</TableCell>
                  <TableCell className="py-1.5">{renderPermissionCell(role.generate)}</TableCell>
                  <TableCell className="py-1.5">{renderPermissionCell(role.approve)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="bg-muted px-3 py-1.5 border-t border-border flex justify-between items-center mt-2">
          <span className="text-[10px] text-muted-foreground">* Permissions for these roles apply only to their assigned department.</span>
          <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 h-6 text-xs">
            Restore Defaults
          </Button>
        </div>
      </CardWrapper>
      </div>
      )}
    </div>
  );
};

export default ProjectRoles;