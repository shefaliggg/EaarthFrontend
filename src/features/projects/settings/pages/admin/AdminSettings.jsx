import { useState, useCallback }  from "react";
import { useOutletContext }        from "react-router-dom";
import { toast }                  from "sonner";
import { RotateCcw, Loader2 }     from "lucide-react";

import CardWrapper           from "@/shared/components/wrappers/CardWrapper";
import EditToggleButtons     from "@/shared/components/buttons/EditToggleButtons";
import SearchBar             from "@/shared/components/SearchBar";
import EditableSelectField   from "@/shared/components/wrappers/EditableSelectField";
import { Button }            from "@/shared/components/ui/button";
import RolePermissionsTable  from "../../components/admin/RolePermissionsTable";

import { useAdminSettings } from "./useAdminSettings";

function AdminSettings() {
  const { projectId } = useOutletContext();

  const {
    settings,
    isFetching,
    isUpdating,
    isSubmitting,
    error,
    updatePreset,
    bulkUpdateRolePermissions,
    restoreDefaults,
  } = useAdminSettings(projectId);

  const [isEditing,      setIsEditing]      = useState(false);
  const [search,         setSearch]         = useState("");
  const [draftRoles,     setDraftRoles]     = useState([]);
  const [draftPreset,    setDraftPreset]    = useState("default");

  const startEditing = useCallback(() => {
    setDraftRoles([...settings.rolePermissions]);
    setDraftPreset(settings.preset);
    setIsEditing(true);
  }, [settings]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    setDraftRoles([]);
    setDraftPreset("default");
  }, []);

  const handleSave = useCallback(async () => {
    try {
      const changed = draftRoles.filter((dr) => {
        const orig = settings.rolePermissions.find((r) => r._id === dr._id);
        return orig && JSON.stringify(orig) !== JSON.stringify(dr);
      });
      if (changed.length > 0) {
        await bulkUpdateRolePermissions(changed).unwrap();
      }
      if (draftPreset !== settings.preset) {
        await updatePreset(draftPreset).unwrap();
      }
      toast.success("Admin settings updated successfully");
      cancelEditing();
    } catch (err) {
      toast.error(err?.message || "Failed to update admin settings");
    }
  }, [draftRoles, draftPreset, settings, bulkUpdateRolePermissions, updatePreset, cancelEditing]);

  const handleRestoreDefaults = useCallback(async () => {
    try {
      await restoreDefaults().unwrap();
      toast.success("Role permissions restored to defaults");
      cancelEditing();
    } catch (err) {
      toast.error(err?.message || "Failed to restore defaults");
    }
  }, [restoreDefaults, cancelEditing]);

  const rolesDisplay = isEditing ? draftRoles : settings.rolePermissions;

  const filteredRoles = rolesDisplay
    .filter((r) => r.isActive !== false)
    .filter((r) => !search || r.role.toLowerCase().includes(search.toLowerCase()));

  if (isFetching && !settings.rolePermissions.length) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm gap-2">
        <Loader2 size={16} className="animate-spin" />
        Loading admin settings…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-xs text-destructive">
        {error?.message ?? "Something went wrong. Please try again."}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CardWrapper showLabel={false}>
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
            <div>
              <h3 className="text-foreground text-sm font-medium">Role Permissions</h3>
              <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                Configure what each role can access and do
              </p>
            </div>
          </div>
          <EditToggleButtons
            isEditing={isEditing}
            isLoading={isUpdating || isSubmitting}
            onEdit={startEditing}
            onSave={handleSave}
            onCancel={cancelEditing}
          />
        </div>

        <div className="flex items-end justify-between gap-3 flex-wrap">
          <SearchBar
            placeholder="Search roles…"
            value={search}
            onValueChange={setSearch}
          />
          <div className="flex items-end gap-3 flex-wrap">
            <EditableSelectField
              label="Preset"
              value={isEditing ? draftPreset : settings.preset}
              isEditing={isEditing}
              items={[
                { label: "DEFAULT",    value: "default"    },
                { label: "TV",         value: "tv"         },
                { label: "COMMERCIAL", value: "commercial" },
              ]}
              onChange={(val) => setDraftPreset(val)}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleRestoreDefaults}
              disabled={isUpdating}
            >
              <RotateCcw className="size-3.5" />
              <span className="text-[11px]">Restore Defaults</span>
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <RolePermissionsTable
            roles={filteredRoles}
            setRoles={setDraftRoles}
            isEditing={isEditing}
          />
        </div>
      </CardWrapper>
    </div>
  );
}

export default AdminSettings;