import { RotateCcw, Send, UserPlus, X } from "lucide-react";
import * as FramerMotion from "framer-motion";
import { useState } from "react";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import SearchBar from "@/shared/components/SearchBar";
import { Button } from "@/shared/components/ui/button";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import { AutoHeight } from "@/shared/components/wrappers/AutoHeight";
import RolePermissionsTable from "@/features/projects/settings/components/admin/RolePermissionsTable";
import RoleAssignmentsTable from "@/features/projects/settings/components/admin/RoleAssignmentsTable";



const INITIAL_ROLE_PERMISSIONS = [
  {
    id: 1,
    role: "Studio Executive",
    description: "Studio owner, executive producer",

    settings: ["view", "edit"],
    calendar: ["view", "edit"],
    offers: ["view", "edit", "send"],
    manageCrew: ["view overtime", "edit overtime", "send notice"],
    generate: ["edit"],
    approve: ["view", "approve", "export"],
  },

  {
    id: 2,
    role: "Producer",
    description: "Lead producer, production owner",

    settings: ["view", "edit"],
    calendar: ["view", "edit"],
    offers: ["view", "edit", "send"],
    manageCrew: ["view overtime", "edit overtime"],
    generate: ["edit"],
    approve: ["view", "approve"],
  },

  {
    id: 3,
    role: "Line Producer",
    description: "Production manager, budgeting lead",

    settings: ["view", "edit"],
    calendar: ["view", "edit"],
    offers: ["view", "edit"],
    manageCrew: ["view overtime", "send notice"],
    generate: ["edit own"],
    approve: ["approve", "export"],
  },

  {
    id: 4,
    role: "UPM",
    description: "Unit Production Manager",

    settings: ["view"],
    calendar: ["view", "edit"],
    offers: ["view", "edit"],
    manageCrew: ["view overtime", "edit overtime"],
    generate: ["edit own"],
    approve: ["approve"],
  },

  {
    id: 5,
    role: "Production Supervisor",
    description: "Production supervisor, production office",

    settings: ["view", "edit"],
    calendar: ["view", "edit"],
    offers: ["view", "edit"],
    manageCrew: ["send notice"],
    generate: ["edit own"],
    approve: ["view"],
  },

  {
    id: 6,
    role: "Production Coordinator",
    description: "Production coordinator, office admin",

    settings: ["view"],
    calendar: ["view", "edit"],
    offers: ["view", "send"],
    manageCrew: ["send notice"],
    generate: ["edit own"],
    approve: ["view"],
  },

  {
    id: 7,
    role: "Accounts Supervisor",
    description: "Financial controller, accounts lead",

    settings: ["view", "edit"],
    calendar: ["view"],
    offers: ["view"],
    manageCrew: ["view overtime", "edit overtime"],
    generate: ["edit own"],
    approve: ["approve", "export"],
  },

  {
    id: 8,
    role: "Payroll Accountant",
    description: "Payroll and crew payments",

    settings: ["view"],
    calendar: ["view"],
    offers: ["view"],
    manageCrew: ["view overtime"],
    generate: ["edit own"],
    approve: ["export"],
  },

  {
    id: 9,
    role: "Department Supervisor",
    description: "HOD, department lead",

    settings: ["none"],
    calendar: ["view"],
    offers: ["view own"],
    manageCrew: ["view overtime"],
    generate: ["edit own"],
    approve: ["view"],
  },

  {
    id: 10,
    role: "Department Coordinator",
    description: "Department coordinator, assistant",

    settings: ["none"],
    calendar: ["view"],
    offers: ["view own"],
    manageCrew: ["none"],
    generate: ["none"],
    approve: ["none"],
  },

  {
    id: 11,
    role: "Crew Member",
    description: "General crew",

    settings: ["none"],
    calendar: ["none"],
    offers: ["none"],
    manageCrew: ["none"],
    generate: ["none"],
    approve: ["none"],
  },
];

const DEPARTMENTS = [
  "Production",
  "Accounts",
  "Camera",
  "Lighting",
  "Grip",
  "Electric",
  "Sound",
  "Art",
  "Construction",
  "Props",
  "Set Decoration",
  "Wardrobe",
  "Costume",
  "Hair & Makeup",
  "Locations",
  "Transport",
  "Post Production",
  "Editorial",
  "VFX",
  "Casting",
  "Stunts",
  "Special Effects",
  "Unit",
  "Studio",
];

function AdminSettings() {
  const [isEditing, setIsEditing] = useState({
    section: null,
  });

  const [show, setShow] = useState(false);
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@studio.com",
      role: "Studio Executive",
      department: "Production",
      status: "Active",
    },

    {
      id: 2,
      name: "Michael Chen",
      email: "michael@studio.com",
      role: "Production Supervisor",
      department: "Production",
      status: "Invited",
    },

    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily@studio.com",
      role: "Accounts Supervisor",
      department: "Accounts",
      status: "Pending",
    },
  ]);
  const [newMember, setNewMember] = useState({
    fullName: "",
    email: "",
    role: "",
    department: "",
  });

  const [search, setSearch] = useState("");

  const [preset, setPreset] = useState("default");

  const [rolePermissions, setRolePermissions] = useState(
    INITIAL_ROLE_PERMISSIONS,
  );

  const startEditing = (section) => {
    setIsEditing({ section });
  };

  const cancelEditing = () => {
    setIsEditing({ section: null });
  };

  return (
    <>
      <div className="space-y-4">
        <CardWrapper showLabel={false}>
          {/*✅ HEADER */}
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />

              <div>
                <h3 className="text-foreground text-sm font-medium">
                  Role Permissions
                </h3>

                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Configure what each role can access and do
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <EditToggleButtons
                isEditing={isEditing.section === "rolePermissions"}
                onEdit={() => startEditing("rolePermissions")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>

          {/*✅ TOOLBAR */}
          <div className="flex items-end justify-between gap-3 flex-wrap">
            <SearchBar
              placeholder="Search roles…"
              value={search}
              onValueChange={setSearch}
            />

            <div className="flex items-end gap-3 flex-wrap">
              <EditableSelectField
                label="Preset"
                value={preset}
                isEditing={isEditing.section === "rolePermissions"}
                items={[
                  {
                    label: "DEFAULT",
                    value: "default",
                  },
                  {
                    label: "TV",
                    value: "tv",
                  },
                  {
                    label: "COMMERCIAL",
                    value: "commercial",
                  },
                ]}
                onChange={setPreset}
              />

              <Button size="sm" variant="outline">
                <RotateCcw className="size-3.5" />

                <span className="text-[11px]">Restore Defaults</span>
              </Button>
            </div>
          </div>

          {/*✅ TABLE */}
          <div className="mt-4">
            <RolePermissionsTable
              roles={rolePermissions}
              setRoles={setRolePermissions}
              isEditing={isEditing.section === "rolePermissions"}
            />
          </div>
        </CardWrapper>

        <CardWrapper showLabel={false}>
          {/*✅ HEADER */}
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />

              <div>
                <h3 className="text-foreground text-sm font-medium">
                  Role Assignments
                </h3>

                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Assign team members to roles and departments. Users will
                  receive invitations to join the project
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <EditToggleButtons
                isEditing={isEditing.section === "roleAssignments"}
                onEdit={() => startEditing("roleAssignments")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={() => {
                  setIsEditing({ section: null });
                  setShow(false);
                }}
              />
            </div>
          </div>
          <div className="flex items-end justify-between gap-3 flex-wrap">
            <SearchBar placeholder="Search members…" />

            {isEditing.section === "roleAssignments" && (
              <Button onClick={() => setShow(!show)} variant="default">
                <UserPlus className="size-4" />
                <span>Add Member</span>
              </Button>
            )}
          </div>

          <AutoHeight>
            {show && (
              <div className="border-2 border-dashed border-border bg-primary/2 rounded-lg gap-2 p-3">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-muted-foreground text-sm font-medium">
                      New Member
                    </h3>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShow(false)}
                    className="size-8 rounded-xl hover:bg-muted"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                  <EditableTextDataField
                    label="Full Name"
                    value={newMember.fullName}
                    isEditing={isEditing.section === "roleAssignments"}
                    placeholder="Enter full name"
                    onChange={(val) =>
                      setNewMember((prev) => ({
                        ...prev,
                        fullName: val,
                      }))
                    }
                  />
                  <EditableTextDataField
                    label="Email Address"
                    value={newMember.email}
                    isEditing={isEditing.section === "roleAssignments"}
                    placeholder="Enter email address"
                    onChange={(val) =>
                      setNewMember((prev) => ({
                        ...prev,
                        email: val,
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                  <EditableSelectField
                    label="Role"
                    value={newMember.role}
                    isEditing={isEditing.section === "roleAssignments"}
                    items={INITIAL_ROLE_PERMISSIONS.map((role) => ({
                      label: role.role.toUpperCase(),
                      value: role.role,
                    }))}
                    onChange={(val) =>
                      setNewMember((prev) => ({
                        ...prev,
                        role: val,
                      }))
                    }
                  />
                  <EditableSelectField
                    label="Department"
                    value={newMember.department}
                    isEditing={isEditing.section === "roleAssignments"}
                    items={DEPARTMENTS.map((department) => ({
                      label: department.toUpperCase(),
                      value: department,
                    }))}
                    onChange={(val) =>
                      setNewMember((prev) => ({
                        ...prev,
                        department: val,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-end gap-3 mt-6">
                  <FramerMotion.motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[0.7rem] font-medium bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Send className="size-4" />
                    <span>Send Invitation</span>
                  </FramerMotion.motion.button>
                </div>
              </div>
            )}
          </AutoHeight>

          {/*✅ TABLE */}
          <div className="mt-4">
            <RoleAssignmentsTable
              members={members}
              setMembers={setMembers}
              isEditing={isEditing.section === "roleAssignments"}
              roleOptions={INITIAL_ROLE_PERMISSIONS}
              departmentOptions={DEPARTMENTS}
            />
          </div>
        </CardWrapper>
      </div>
    </>
  );
}

export default AdminSettings;
