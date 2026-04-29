import { useState } from "react";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import EditableDateField from "@/shared/components/wrappers/EditableDateField";
import { Button } from "@/shared/components/ui/button";
import { Trash2 } from "lucide-react";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import HiatusList from "@/features/projects/settings/components/dates/HiatusList";
import BlockList from "../../components/dates/BlockList";

function DatesSettings() {
  const [isEditing, setIsEditing] = useState({ section: null });

  const [formState, setFormState] = useState({
    dates: null,
  });

  const defaultData = {
    prepStart: "2026-01-01",
    prepEnd: "2026-01-10",
    shootStart: "2025-02-01",
    shootEnd: "2026-02-20",
    postProdStart: "2026-03-15",
    postProdEnd: "2026-04-30",
    hiatus: [
      { id: 1, name: "Hiatus 1", start: "2026-03-01", end: "2026-03-10" },
    ],
    blocks: [
      { id: 1, name: "Block 1", start: "2026-05-01", end: "2026-05-10" },
    ],
  };

  const datesData = [
    "overallDates",
    "hiatus",
    "blocks",
    "postProduction",
  ].includes(isEditing.section)
    ? formState.dates
    : defaultData;

  const startEditing = (section) => {
    setFormState({
      dates: {
        ...datesData,
        hiatus: datesData.hiatus || [],
        blocks: datesData.blocks || [],
      },
    });

    setIsEditing({ section });
  };

  const cancelEditing = () => {
    setIsEditing({ section: null });
    setFormState({ dates: null });
  };

  return (
    <>
      <div className="space-y-4">
        <CardWrapper showLabel={false}>
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
              <div>
                <h3 className="text-foreground text-sm font-medium">
                  Overall Dates
                </h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Key production milestone dates for planning and crew
                  information
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 ">
              <EditToggleButtons
                isEditing={isEditing.section === "overallDates"}
                onEdit={() => startEditing("overallDates")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EditableDateField
              label="Prep Start"
              value={datesData.prepStart}
              isEditing={isEditing.section === "overallDates"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  dates: {
                    ...prev.dates,
                    prepStart: val,
                  },
                }))
              }
            />
            <EditableDateField
              label="Prep End"
              value={datesData.prepEnd}
              isEditing={isEditing.section === "overallDates"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  dates: {
                    ...prev.dates,
                    prepEnd: val,
                  },
                }))
              }
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <EditableDateField
              label="Shoot Start"
              value={datesData.shootStart}
              isEditing={isEditing.section === "overallDates"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  dates: {
                    ...prev.dates,
                    shootStart: val,
                  },
                }))
              }
            />

            <EditableDateField
              label="Shoot End"
              value={datesData.shootEnd}
              isEditing={isEditing.section === "overallDates"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  dates: {
                    ...prev.dates,
                    shootEnd: val,
                  },
                }))
              }
            />
          </div>
        </CardWrapper>
        <CardWrapper showLabel={false}>
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
              <div>
                <h3 className="text-foreground text-sm font-medium">Hiatus</h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Add any planned production breaks or hiatus periods
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 ">
              <EditToggleButtons
                isEditing={isEditing.section === "hiatus"}
                onEdit={() => startEditing("hiatus")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>

          <HiatusList
            items={datesData?.hiatus || []}
            isEditing={isEditing.section === "hiatus"}
            onChange={(updated) =>
              setFormState((prev) => ({
                ...prev,
                dates: {
                  ...prev.dates,
                  hiatus: updated,
                },
              }))
            }
          />
        </CardWrapper>
        <CardWrapper showLabel={false}>
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
              <div>
                <h3 className="text-foreground text-sm font-medium">
                  Post Production
                </h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Post-production phase start and end dates
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 ">
              <EditToggleButtons
                isEditing={isEditing.section === "postProduction"}
                onEdit={() => startEditing("postProduction")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <EditableDateField
              label="Post Production Start"
              value={datesData?.postProdStart}
              isEditing={isEditing.section === "postProduction"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  dates: {
                    ...prev.dates,
                    postProdStart: val,
                  },
                }))
              }
            />

            <EditableDateField
              label="Post Production End"
              value={datesData?.postProdEnd}
              isEditing={isEditing.section === "postProduction"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  dates: {
                    ...prev.dates,
                    postProdEnd: val,
                  },
                }))
              }
            />
          </div>
        </CardWrapper>
        <CardWrapper showLabel={false}>
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
              <div>
                <h3 className="text-foreground text-sm font-medium">Blocks</h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Add and manage production blocks for scheduling
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 ">
              <EditToggleButtons
                isEditing={isEditing.section === "blocks"}
                onEdit={() => startEditing("blocks")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>

          <BlockList
            items={datesData?.blocks || []}
            isEditing={isEditing.section === "blocks"}
            onChange={(updated) =>
              setFormState((prev) => ({
                ...prev,
                dates: {
                  ...prev.dates,
                  blocks: updated,
                },
              }))
            }
          />
        </CardWrapper>
      </div>
    </>
  );
}

export default DatesSettings;
