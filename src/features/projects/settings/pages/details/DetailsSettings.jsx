import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import { toast } from "sonner";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableSwitchField from "@/shared/components/wrappers/EditableSwitchField";
import SettingsCardLoadingSkelton from "../../components/skeltons/SettingsCardLoadingSkelton";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectSettingsThunk } from "@/features/projects/settings/store/projectSettings.thunks.js";
import { projectDetailsSchema } from "../../config/settingsValidationSchemas";
import { updateProjectDetailsThunk } from "../../store/projectSettings.thunks";
import SettingsCardErrorSkelton from "../../components/skeltons/SettingsCardErrorSkelton";

// ─── Slug helper — must mirror DashboardLayout ────────────────────────────────
const toSlug = (name = "") => name.toLowerCase().replace(/\s+/g, "-");
const isObjectId = (str) => /^[a-f\d]{24}$/i.test(String(str ?? ""));

function DetailsSettings() {
  const { projectName } = useParams();
  const dispatch = useDispatch();
  // ── Resolve real project _id from Redux ───────────────────────────────────
  const currentProject = useSelector((s) => s.project?.currentProject ?? null);
  const allProjects = useSelector((s) => s.project?.projects ?? []);

  const resolvedProjectId = useMemo(() => {
    // 1. currentProject already loaded in Redux
    if (isObjectId(currentProject?._id)) return String(currentProject._id);

    // 2. Match by :projectName slug against full projects list
    if (projectName) {
      const slug = projectName.toLowerCase();
      const match = allProjects.find(
        (p) => toSlug(p.productionName ?? "") === slug,
      );
      if (isObjectId(match?._id)) return String(match._id);
    }
    return null;
  }, [currentProject, allProjects, projectName]);

  const projectId = resolvedProjectId;

  const { projectSettings, isFetching, isUpdating, error } = useSelector(
    (state) => state.projectSettings,
  );
  console.log("projectId", projectId);
  console.log("projectSettings", projectSettings);
  console.log(currentProject);
  const [isEditing, setIsEditing] = useState({ section: null });
  const [formState, setFormState] = useState({
    details: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectSettingsThunk(projectId));
    }
  }, [dispatch, projectId]);

  // ── Derived flags ──────────────────────────────────────────────────────────
  const isEditingDetails = isEditing.section === "details";
  const isSavingDetails = isUpdating && isEditing.section === "details";

  // ── Display data (read-mode fallback) ──────────────────────────────────────
  const details = isEditingDetails
    ? formState.details
    : {
        productionName: projectSettings?.productionName ?? "",
        country: projectSettings?.country ?? "",
        codeName: projectSettings?.codeName ?? "",
        description: projectSettings?.description ?? "",
        additionalNotes: projectSettings?.additionalNotes ?? "",
      };

  // ── Section editing ────────────────────────────────────────────────────────
  const startEditing = (section) => {
    setErrors({});
    if (section === "details") {
      setFormState((prev) => ({
        ...prev,
        details: {
          productionName: projectSettings?.productionName ?? "",
          country: projectSettings?.country ?? "",
          codeName: projectSettings?.codeName ?? "",
          description: projectSettings?.description ?? "",
          additionalNotes: projectSettings?.additionalNotes ?? "",
        },
      }));
    }

    setIsEditing({ section });
  };

  const cancelEditing = () => {
    setIsEditing({ section: null });

    setFormState({
      details: null,
    });
    setErrors({});
  };

  // ── Save handlers ──────────────────────────────────────────────────────────
  const handleSaveDetails = async () => {
    setErrors({});
    const result = projectDetailsSchema.safeParse(formState.details);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }
    try {
      await dispatch(
        updateProjectDetailsThunk({
          projectId,
          payload: result.data,
        }),
      ).unwrap();
      toast.success("Project details updated successfully");
      cancelEditing();
    } catch (err) {
      toast.error(err?.message || "Failed to update project details");
    }
  };

  // ── Loading / error states ─────────────────────────────────────────────────

  if (!projectSettings || isFetching) {
    return (
      <>
        <SettingsCardLoadingSkelton fields={5} columns={2} />
      </>
    );
  }

  if (error) {
    return (
      <>
        <SettingsCardErrorSkelton
          message={
            typeof error === "string"
              ? error
              : error?.message || "Something went wrong"
          }
          onRetry={() => dispatch(fetchProjectSettingsThunk(projectId))}
        />
      </>
    );
  }

  return (
    <>
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
              {!projectSettings?.sections?.details?.locked && (
                <EditToggleButtons
                  isEditing={isEditingDetails}
                  isLoading={isSavingDetails}
                  onEdit={() => startEditing("details")}
                  onSave={handleSaveDetails}
                  onCancel={cancelEditing}
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EditableTextDataField
              label="Project Name"
              value={details?.productionName}
              isEditing={isEditingDetails}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  details: {
                    ...prev.details,
                    productionName: val,
                  },
                }))
              }
              error={errors?.productionName?.[0]}
              disabled={isSavingDetails}
            />

            <div className="flex flex-col gap-1">
              <EditableTextDataField
                label="Code Name"
                value={details?.codeName}
                isEditing={isEditingDetails}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    details: {
                      ...prev.details,
                      codeName: val,
                    },
                  }))
                }
                error={errors?.codeName?.[0]}
                disabled={isSavingDetails}
                infoPillDescription="If your project has an alternative name for secrecy, enter that. Otherwise enter the Project title. The Codename will be used in all emails and pages"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-4">
            <EditableTextDataField
              label="Description"
              multiline
              value={details?.description}
              isEditing={isEditingDetails}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  details: {
                    ...prev.details,
                    description: val,
                  },
                }))
              }
              error={errors?.description?.[0]}
              disabled={isSavingDetails}
              infoPillDescription="A brief synopsis of the project which is helpful for crew joining the production"
            />
          </div>
          <div className="flex flex-col gap-1 mt-4">
            <EditableTextDataField
              label="Locations"
              value={details?.country}
              isEditing={isEditingDetails}
              infoPillDescription="Useful information, if known, which might help crew decide if they can accept the job"
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  details: {
                    ...prev.details,
                    country: val,
                  },
                }))
              }
              error={errors?.country?.[0]}
              disabled={isSavingDetails}
            />
          </div>
          <div className="flex flex-col gap-1 mt-4">
            <EditableTextDataField
              label="Additional Notes"
              multiline
              isRequired={false}
              value={details?.additionalNotes}
              isEditing={isEditingDetails}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  details: {
                    ...prev.details,
                    additionalNotes: val,
                  },
                }))
              }
              error={errors?.additionalNotes?.[0]}
              disabled={isSavingDetails}
              infoPillDescription="Use this to convey general project-wide information to crew."
              placeholder="Enter additional notes"
            />
          </div>
        </CardWrapper>
      </div>
    </>
  );
}

export default DetailsSettings;
