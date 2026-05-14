// src/features/projects/pages/Productionteam.jsx
import React, { useState } from "react";
import { ShieldCheck, UserCheck, DollarSign, Users, X, Plus, Info } from "lucide-react";

import CardWrapper from "../../../shared/components/wrappers/CardWrapper";
import EditableTextDataField from "../../../shared/components/wrappers/EditableTextDataField";

const CORE_ROLES = [
  {
    id: "production_supervisor",
    label: "Production Supervisor",
    icon: ShieldCheck,
    iconColor: "text-purple-500",
  },
  {
    id: "production_admin",
    label: "Production Admin",
    icon: UserCheck,
    iconColor: "text-blue-500",
  },
  {
    id: "financial_controller",
    label: "Financial Controller",
    icon: DollarSign,
    iconColor: "text-green-500",
  },
];

const DEFAULT_CORE_TEAM = {
  production_supervisor: { fullName: "", email: "" },
  production_admin:      { fullName: "", email: "" },
  financial_controller:  { fullName: "", email: "" },
};

// ─── CoreContactCard ──────────────────────────────────────────────────────────

const CoreContactCard = ({ role, value, onChange }) => {
  const isFilled = value?.fullName?.trim() && value?.email?.trim();

  return (
    <CardWrapper
      title={role.label}
      icon={role.icon}
      iconColor={role.iconColor}
      description={role.description}
      showLabel={true}
      actions={
        isFilled && (
          <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
            Added
          </span>
        )
      }
      className="border-2 transition-all duration-200"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <EditableTextDataField
          label="Full Name"
          value={value?.fullName ?? ""}
          isEditing={true}
          isRequired={false}
          placeholder="e.g. Jane Smith"
          onChange={(val) => onChange({ ...value, fullName: val })}
        />
        <EditableTextDataField
          label="Email Address"
          value={value?.email ?? ""}
          isEditing={true}
          isRequired={false}
          placeholder="jane@studio.com"
          type="email"
          onChange={(val) => onChange({ ...value, email: val })}
        />
      </div>
    </CardWrapper>
  );
};

// ─── AdditionalMemberCard ─────────────────────────────────────────────────────

const AdditionalMemberCard = ({ member, index, onChange, onRemove }) => {
  const isFilled = member.role?.trim() && member.fullName?.trim() && member.email?.trim();

  return (
    <div className={`bg-background p-6 rounded-3xl border-2 space-y-2 transition-all duration-200 ${isFilled ? "border-purple-300" : ""}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
            <Users className="w-5 h-5 text-purple-500 flex-shrink-0" strokeWidth={1.75} />
            <input
              type="text"
              value={member.role}
              onChange={(e) => onChange({ ...member, role: e.target.value })}
              placeholder={`Team Member ${index + 1}`}
              className="flex-1 bg-transparent border-none outline-none text-base font-semibold
                text-muted-foreground placeholder-muted-foreground/40
                focus:ring-0 focus:text-foreground transition-colors min-w-0"
            />
          </div>
          <p className="text-xs text-muted-foreground pl-7">
            Additional team member — type a role name above
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isFilled && (
            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
              Added
            </span>
          )}
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <EditableTextDataField
          label="Full Name"
          value={member.fullName}
          isEditing={true}
          isRequired={false}
          placeholder="e.g. Jane Smith"
          onChange={(val) => onChange({ ...member, fullName: val })}
        />
        <EditableTextDataField
          label="Email Address"
          value={member.email}
          isEditing={true}
          isRequired={false}
          placeholder="jane@studio.com"
          type="email"
          onChange={(val) => onChange({ ...member, email: val })}
        />
      </div>
    </div>
  );
};

// ─── ProductionTeam ───────────────────────────────────────────────────────────

export const ProductionTeam = ({
  // teamData: the coreTeam object from parent formData.productionTeam
  // onChange: fires parent's updateTeamMember(roleId, value)
  teamData,
  onChange,
  onAdditionalChange,
}) => {
  // Seed local state from parent-provided teamData; fall back to empty defaults
  const [coreTeam, setCoreTeam] = useState(
    teamData ?? { ...DEFAULT_CORE_TEAM }
  );

  const [additionalMembers, setAdditionalMembers] = useState([]);

  // Sync coreTeam from parent if teamData reference changes (e.g. form reset)
  // Use a ref-based approach to avoid re-render loops
  const handleCoreChange = (roleId, val) => {
    const updated = { ...coreTeam, [roleId]: val };
    setCoreTeam(updated);
    // Notify parent so formData.productionTeam stays in sync
    onChange?.(roleId, val);
  };

  const handleAddMember = () => {
    const updated = [
      ...additionalMembers,
      { id: Date.now(), role: "", fullName: "", email: "" },
    ];
    setAdditionalMembers(updated);
    onAdditionalChange?.(updated);
  };

  const handleMemberChange = (id, updated) => {
    const next = additionalMembers.map((m) => (m.id === id ? updated : m));
    setAdditionalMembers(next);
    onAdditionalChange?.(next);
  };

  const handleRemoveMember = (id) => {
    const next = additionalMembers.filter((m) => m.id !== id);
    setAdditionalMembers(next);
    onAdditionalChange?.(next);
  };

  const coreFilledCount = CORE_ROLES.filter(
    (r) => coreTeam[r.id]?.fullName?.trim() && coreTeam[r.id]?.email?.trim()
  ).length;

  const totalCount = coreFilledCount + additionalMembers.length;

  return (
    <CardWrapper
      title="Production Team"
      icon={Users}
      iconColor="text-primary"
      description="These people will receive invitations once the project is approved. They don't need an account yet."
      actions={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-muted text-muted-foreground text-xs
            font-medium px-3 py-1.5 rounded-full whitespace-nowrap">
            <Users className="w-3.5 h-3.5" strokeWidth={2} />
            {totalCount} {totalCount === 1 ? "member" : "members"}
          </div>

          <button
            type="button"
            onClick={handleAddMember}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg
              bg-primary text-primary-foreground text-xs font-medium
              hover:bg-primary/90 active:scale-[0.97]
              transition-all duration-150 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
            Add Member
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        {CORE_ROLES.map((role) => (
          <CoreContactCard
            key={role.id}
            role={role}
            value={coreTeam[role.id]}
            onChange={(val) => handleCoreChange(role.id, val)}
          />
        ))}

        {additionalMembers.map((member, index) => (
          <AdditionalMemberCard
            key={member.id}
            index={index}
            member={member}
            onChange={(updated) => handleMemberChange(member.id, updated)}
            onRemove={() => handleRemoveMember(member.id)}
          />
        ))}
      </div>

      <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl mt-2">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
        <p className="text-xs text-amber-800 leading-relaxed">
          All contacts are optional at this stage. Invitation emails will only be sent after
          admin approval. You can add or update contacts later from production settings.
        </p>
      </div>
    </CardWrapper>
  );
};