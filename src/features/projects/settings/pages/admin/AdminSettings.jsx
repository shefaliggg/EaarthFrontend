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
    role: "Studio Supervisor",
    description: "Studio Oversight",

    settings: ["view"],
    calendar: ["view", "edit"],
    offers: ["view"],
    manageCrew: ["send notice"],
    generate: ["edit own"],
    approve: ["approve"],
  },

  {
    id: 2,
    role: "Studio Admin",
    description: "Studio Management",

    settings: ["view", "edit"],
    calendar: ["view", "edit"],
    offers: ["view", "edit", "send"],
    manageCrew: ["view overtime"],
    generate: ["none"],
    approve: ["approve", "export"],
  },

  {
    id: 3,
    role: "Agency Supervisor",
    description: "Agency Oversight",

    settings: ["view"],
    calendar: ["view"],
    offers: ["view", "approve"],
    manageCrew: ["view overtime"],
    generate: ["none"],
    approve: ["approve"],
  },

  {
    id: 4,
    role: "Agency Admin",
    description: "Agency Operations",

    settings: ["view", "edit"],
    calendar: ["view"],
    offers: ["view", "edit", "send"],
    manageCrew: ["edit overtime"],
    generate: ["edit"],
    approve: ["approve"],
  },

  {
    id: 5,
    role: "Vendor Supervisor",
    description: "Vendor Oversight",

    settings: ["view"],
    calendar: ["view"],
    offers: ["view", "approve"],
    manageCrew: ["send notice"],
    generate: ["edit"],
    approve: ["approve"],
  },

  {
    id: 6,
    role: "Vendor Admin",
    description: "Vendor Operations",

    settings: ["view", "edit"],
    calendar: ["view"],
    offers: ["view", "edit"],
    manageCrew: ["send notice"],
    generate: ["edit"],
    approve: ["approve"],
  },

  {
    id: 7,
    role: "Production Admin",
    description: "Production Operations",

    settings: ["view", "edit"],
    calendar: ["view", "edit"],
    offers: ["view", "edit", "send"],
    manageCrew: ["send notice"],
    generate: ["edit own"],
    approve: ["view"],
  },

  {
    id: 8,
    role: "Production Supervisor",
    description: "Production Oversight",

    settings: ["view"],
    calendar: ["view", "edit"],
    offers: ["view", "approve"],
    manageCrew: ["send notice"],
    generate: ["none"],
    approve: ["approve"],
  },

  {
    id: 9,
    role: "Finance Supervisor",
    description: "Finance Oversight",

    settings: ["view"],
    calendar: ["view"],
    offers: ["view"],
    manageCrew: ["view overtime"],
    generate: ["none"],
    approve: ["approve", "export"],
  },

  {
    id: 10,
    role: "Finance Admin",
    description: "Finance Operations",

    settings: ["view", "edit"],
    calendar: ["view"],
    offers: ["view"],
    manageCrew: ["none"],
    generate: ["none"],
    approve: ["view"],
  },

  {
    id: 11,
    role: "Department Supervisor",
    description: "Department Oversight",

    settings: ["view"],
    calendar: ["view"],
    offers: ["view", "approve"],
    manageCrew: ["edit overtime"],
    generate: ["none"],
    approve: ["approve"],
  },

  {
    id: 12,
    role: "Department Admin",
    description: "Department Operations",

    settings: ["view"],
    calendar: ["view"],
    offers: ["view", "edit"],
    manageCrew: ["view overtime"],
    generate: ["none"],
    approve: ["view"],
  },

  {
    id: 13,
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

function AdminSettings() {
  const [isEditing, setIsEditing] = useState({
    section: null,
  });

  const [search, setSearch] = useState("");

  const [preset, setPreset] = useState("default");

  const [rolePermissions, setRolePermissions] = useState(
    INITIAL_ROLE_PERMISSIONS,
  );

  const filteredRoles = rolePermissions.filter((role) =>
  role.role.toLowerCase().includes(search.toLowerCase())
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
              roles={filteredRoles}
              setRoles={setRolePermissions}
              isEditing={isEditing.section === "rolePermissions"}
            />
          </div>
        </CardWrapper>
      </div>
    </>
  );
}

export default AdminSettings;
