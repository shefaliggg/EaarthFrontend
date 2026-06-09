/**
 * DetailsSettings.jsx
 * Path: src/features/projects/settings/pages/DetailsSettings.jsx
 *
 * Merged: useDetailsIdentitySettings → useDetailsSettings (identity section)
 * Deleted: useDetailsIdentitySettings.js
 */

import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import SettingsCardLoadingSkelton from "../../components/skeltons/SettingsCardLoadingSkelton";
import SettingsCardErrorSkelton from "../../components/skeltons/SettingsCardErrorSkelton";

// Single hook — identity now lives at detailsSettings.identity
import { useDetailsSettings } from "../project/useDetailsSettings";

// ── Zod schema ────────────────────────────────────────────────────────────────
const identitySchema = z.object({
  productionName: z.string().min(1, "Project name is required").max(200),
  codeName: z.string().max(200).optional().or(z.literal("")),
  description: z.string().max(5000).optional().or(z.literal("")),
  country: z.string().max(500).optional().or(z.literal("")),
  additionalNotes: z.string().max(5000).optional().or(z.literal("")),
});

function DetailsSettings() {
  const { projectId } = useOutletContext();

  // Pull identity + updateIdentity from the unified hook
  const { settings, isFetching, isUpdating, error, updateIdentity } =
    useDetailsSettings(projectId);

  const identityData = settings.identity;

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [errors, setErrors] = useState({});

  // ── Helpers ───────────────────────────────────────────────────────────────
  const display = (key) =>
    (isEditing ? draft?.[key] : identityData?.[key]) ?? "";
  const patch = (key) => (val) => setDraft((prev) => ({ ...prev, [key]: val }));

  // ── Edit / Cancel ─────────────────────────────────────────────────────────
  const startEditing = () => {
    setErrors({});
    setDraft({ ...identityData });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setDraft(null);
    setErrors({});
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setErrors({});
    const result = identitySchema.safeParse(draft);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }
    try {
      await updateIdentity(result.data).unwrap();
      toast.success("Project details updated successfully");
      cancelEditing();
    } catch (err) {
      toast.error(err?.message || "Failed to update project details");
    }
  };

  // ── States ────────────────────────────────────────────────────────────────
  if (!identityData?.productionName && isFetching) {
    return <SettingsCardLoadingSkelton fields={5} columns={2} />;
  }

  if (error) {
    return (
      <SettingsCardErrorSkelton
        message={
          typeof error === "string"
            ? error
            : error?.message || "Something went wrong"
        }
      />
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <CardWrapper showLabel={false}>
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
            <div>
              <h3 className="text-foreground text-sm font-medium">
                Project Details
              </h3>
              <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                Helpful information which is shown to crew and can be updated
                any time
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 ">
            <EditToggleButtons
              isEditing={isEditing}
              isLoading={isUpdating}
              onEdit={startEditing}
              onSave={handleSave}
              onCancel={cancelEditing}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EditableTextDataField
            label="Project Name"
            value={display("productionName")}
            isEditing={isEditing}
            onChange={patch("productionName")}
            error={errors?.productionName?.[0]}
            disabled={isUpdating}
          />
          <EditableTextDataField
            label="Code Name"
            value={display("codeName")}
            isEditing={isEditing}
            onChange={patch("codeName")}
            error={errors?.codeName?.[0]}
            disabled={isUpdating}
            infoPillDescription="If your project has an alternative name for secrecy, enter that. Otherwise enter the Project title. The Codename will be used in all emails and pages"
          />
        </div>

        <div className="flex flex-col gap-1 mt-4">
          <EditableTextDataField
            label="Description"
            multiline
            value={display("description")}
            isEditing={isEditing}
            onChange={patch("description")}
            error={errors?.description?.[0]}
            disabled={isUpdating}
            infoPillDescription="A brief synopsis of the project which is helpful for crew joining the production"
          />
        </div>

        <div className="flex flex-col gap-1 mt-4">
          <EditableTextDataField
            label="Locations"
            value={display("country")}
            isEditing={isEditing}
            onChange={patch("country")}
            error={errors?.country?.[0]}
            disabled={isUpdating}
            infoPillDescription="Useful information, if known, which might help crew decide if they can accept the job"
          />
        </div>

        <div className="flex flex-col gap-1 mt-4">
          <EditableTextDataField
            label="Additional Notes"
            multiline
            isRequired={false}
            value={display("additionalNotes")}
            isEditing={isEditing}
            onChange={patch("additionalNotes")}
            error={errors?.additionalNotes?.[0]}
            disabled={isUpdating}
            infoPillDescription="Use this to convey general project-wide information to crew."
            placeholder="Enter additional notes"
          />
        </div>
      </CardWrapper>
    </div>
  );
}

export default DetailsSettings;
