import { useEffect, useState } from "react";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableSwitchField from "@/shared/components/wrappers/EditableSwitchField";
import SettingsCardLoadingSkelton from "../../components/skeltons/SettingsCardLoadingSkelton";

function DetailsSettings() {
  const [isEditing, setIsEditing] = useState({ section: null });
  const [isLoading, setIsLoading] = useState(true);
  const [formState, setFormState] = useState({
    details: null,
    projectSettings: null,
    offerHandling: null,
  });

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 3000);
  }, []);

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

    setIsEditing({ section });
  };

  const cancelEditing = () => {
    setIsEditing({ section: null });
    setFormState({ details: null });
  };

  //   if (isLoading) {
  //   return (
  //     <>
  //       <SettingsCardLoadingSkelton fields={6} columns={2} />
  //       <SettingsCardLoadingSkelton fields={12} columns={2} />
  //       <SettingsCardLoadingSkelton fields={6} columns={2} />
  //     </>
  //   );
  // }

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
                infoPillDescription="If your project has an alternative name for secrecy, enter that. Otherwise enter the Project name. The Code name will be used in all emails and pages."
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
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-4">
            <EditableTextDataField
              label="Description"
              value={detailsData?.description}
              isEditing={isEditing.section === "details"}
              isRequired={false}
              multiline={true}
              infoPillDescription="A brief synopsis of the project which is helpful for crew joining the production."
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
          </div>
          <div className="flex flex-col gap-1 mt-4">
            <EditableTextDataField
              label="Locations"
              value={detailsData?.locations}
              isEditing={isEditing.section === "details"}
              isRequired={false}
              multiline={true}
              infoPillDescription="Useful information, if known, which might help crew decide if they
            can accept the job."
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
          </div>
          <div className="flex flex-col gap-1 mt-4">
            <EditableTextDataField
              label="Additional Notes"
              value={detailsData?.additionalNotes}
              isEditing={isEditing.section === "details"}
              isRequired={false}
              multiline={true}
              infoPillDescription="Use this to convey general project-wide information to crew."
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
          </div>
        </CardWrapper>
      </div>
    </>
  );
}

export default DetailsSettings;
