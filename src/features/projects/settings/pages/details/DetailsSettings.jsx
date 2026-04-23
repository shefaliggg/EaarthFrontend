import { useState } from "react";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";

function DetailsSettings() {
  const [isEditing, setIsEditing] = useState({ section: null });
  const [formState, setFormState] = useState({
    details: null,
    projectSettings: null,
  });

  const detailsData =
    isEditing.section === "details"
      ? formState.details
      : {
          projectName: "AVATAR 1",
          codeName: "AVATAR 1",
          description: "",
          locations: "",
          additionalNotes: "",
        };

  const projectSettingsData =
    isEditing.section === "projectSettings"
      ? formState.projectSettings
      : {
          projectType: "FEATURE FILM",
        };

  const startEditing = (section) => {
    if (section === "details") {
      setFormState((prev) => ({
        ...prev,
        details: {
          projectName: detailsData.projectName,
          codeName: detailsData.codeName,
          description: detailsData.description || "",
          locations: detailsData.locations || "",
          additionalNotes: detailsData.additionalNotes || "",
        },
      }));
    }

    if (section === "projectSettings") {
      setFormState((prev) => ({
        ...prev,
        projectSettings: {
          projectType: projectSettingsData.projectType,
        },
      }));
    }

    setIsEditing({ section });
  };

  const cancelEditing = () => {
    setIsEditing({ section: null });
    setFormState({ details: null, projectSettings: null });
  };

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
                Helpful information shown to crew
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 ">
            <EditToggleButtons
              isEditing={isEditing.section === "details"}
              onEdit={() => startEditing("details")}
              onSave={() => setIsEditing({ section: null })}
              onCancel={cancelEditing}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EditableTextDataField
            label="Project Name"
            value={detailsData?.projectName}
            isEditing={isEditing.section === "details"}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                details: {
                  ...prev.details,
                  projectName: val,
                },
              }))
            }
          />

          <div className="flex flex-col gap-1">
            <EditableTextDataField
              label="Code Name"
              value={detailsData?.codeName}
              isEditing={isEditing.section === "details"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  details: {
                    ...prev.details,
                    codeName: val,
                  },
                }))
              }
            />

            <p className="text-[0.6rem] leading-relaxed text-muted-foreground/80">
              If your project has an alternative name for secrecy, enter that.
              Otherwise enter the Project name. The Code name will be used in
              all emails and pages.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-5">
          <EditableTextDataField
            label="Description"
            value={detailsData?.description}
            isEditing={isEditing.section === "details"}
            isRequired={false}
            multiline={true}
            placeholder="Enter description"
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                details: {
                  ...prev.details,
                  description: val,
                },
              }))
            }
          />
          <p className="text-[0.6rem] leading-relaxed text-muted-foreground/80">
            A brief synopsis of the project which is helpful for crew joining
            the production.
          </p>
        </div>
        <div className="flex flex-col gap-1 mt-5">
          <EditableTextDataField
            label="Locations"
            value={detailsData?.locations}
            isEditing={isEditing.section === "details"}
            isRequired={false}
            multiline={true}
            placeholder="Enter locations"
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                details: {
                  ...prev.details,
                  locations: val,
                },
              }))
            }
          />

          <p className="text-[0.6rem] leading-relaxed text-foreground/60">
            Useful information, if known, which might help crew decide if they
            can accept the job.
          </p>
        </div>
        <div className="flex flex-col gap-1 mt-5">
          <EditableTextDataField
            label="Additional Notes"
            value={detailsData?.additionalNotes}
            isEditing={isEditing.section === "details"}
            isRequired={false}
            multiline={true}
            placeholder="Enter additional notes"
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                details: {
                  ...prev.details,
                  additionalNotes: val,
                },
              }))
            }
          />

          <p className="text-[0.6rem] leading-relaxed text-foreground/60">
            Use this to convey general project-wide information to crew.
          </p>
        </div>
      </CardWrapper>
      <CardWrapper showLabel={false}>
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
            <div>
              <h3 className="text-foreground text-sm font-medium">
                Project Settings
              </h3>
              <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                Essential settings which will govern how rates are calculated.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 ">
            <EditToggleButtons
              isEditing={isEditing.section === "projectSettings"}
              onEdit={() => startEditing("projectSettings")}
              onSave={() => setIsEditing({ section: null })}
              onCancel={cancelEditing}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EditableSelectField
            label="Project Type"
            value={projectSettingsData?.projectType}
            items={[
              { label: "FEATURE FILM", value: "FEATURE FILM" },
              { label: "TELEVISION", value: "TELEVISION" },
            ]}
            isEditing={isEditing.section === "projectSettings"}
            isRequired={false}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                projectSettings: {
                  ...(prev.projectSettings || {}),
                  projectType: val,
                },
              }))
            }
          />
        </div>
      </CardWrapper>
    </div>
  );
}

export default DetailsSettings;
