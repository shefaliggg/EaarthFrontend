import { useState } from "react";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import UnitList from "@/features/projects/settings/components/places/UnitList";
import WorkplaceList from "../../components/places/WorkplaceList";

const emptyUnit = () => ({
  id: Date.now() + Math.random(),
  name: "",
  startDate: null,
  endDate: null,
  isPrimary: false,
});

const emptyWorkplace = () => ({
  id: Date.now() + Math.random(),
  name: "",
});

function PlacesSettings() {
  const [editingSection, setEditingSection] = useState(null);

  const [formState, setFormState] = useState({
    units: [],
    workplaces: [],
  });

  const unitsData =
    editingSection === "units"
      ? formState.units
      : [
          {
            id: 1,
            name: "Main",
            startDate: "2026-06-01",
            endDate: "2026-08-15",
            isPrimary: true,
          },
          {
            id: 2,
            name: "Splinter Camera",
            startDate: "2026-07-01",
            endDate: "2026-09-15",
            isPrimary: false,
          },
          {
            id: 3,
            name: "VFX Elements",
            startDate: "2026-08-01",
            endDate: "2026-10-15",
            isPrimary: false,
          },
        ];

  const workplacesData =
    editingSection === "workplaces"
      ? formState.workplaces
      : [
          {
            id: 1,
            name: "Bourne Wood",
          },
          {
            id: 2,
            name: "Brecon Beacons",
          },
          {
            id: 3,
            name: "Crychan Forest",
          },
          {
            id: 4,
            name: "Dartmoor",
          },
          {
            id: 5,
            name: "Forest of Dean",
          },
          {
            id: 6,
            name: "Redlands Wood",
          },
          {
            id: 7,
            name: "Shepperton",
          },
          {
            id: 8,
            name: "Sky Studios Elstree",
          },
          {
            id: 9,
            name: "Stockers Farm",
          },
        ];

  const startEditing = (section) => {
    if (section === "units") {
      setFormState((prev) => ({
        ...prev,
        units: [...unitsData],
      }));
    }

    if (section === "workplaces") {
      setFormState((prev) => ({
        ...prev,
        workplaces: [...workplacesData],
      }));
    }

    setEditingSection(section);
  };

  const cancelEditing = () => {
    setEditingSection(null);

    setFormState({
      units: [],
      workplaces: [],
    });
  };

  return (
    <>
      <div className="space-y-4">
        <CardWrapper showLabel={false}>
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
              <div>
                <h3 className="text-foreground text-sm font-medium">Units</h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Configure shooting units with their schedule dates
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <EditToggleButtons
                isEditing={editingSection === "units"}
                onEdit={() => startEditing("units")}
                onSave={() => {
                  setEditingSection(null);
                }}
                onCancel={cancelEditing}
              />
            </div>
          </div>
          <UnitList
            units={unitsData}
            isEditing={editingSection === "units"}
            onChange={(updatedUnits) =>
              setFormState((prev) => ({
                ...prev,
                units: updatedUnits,
              }))
            }
            emptyUnit={emptyUnit}
          />
        </CardWrapper>
        <CardWrapper showLabel={false}>
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
              <div>
                <h3 className="text-foreground text-sm font-medium">
                  Workplaces
                </h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Locations where production takes place
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <EditToggleButtons
                isEditing={editingSection === "workplaces"}
                onEdit={() => startEditing("workplaces")}
                onSave={() => {
                  console.log(formState.workplaces);
                  setEditingSection(null);
                }}
                onCancel={cancelEditing}
              />
            </div>
          </div>
          <WorkplaceList
            workplaces={workplacesData}
            isEditing={editingSection === "workplaces"}
            onChange={(updatedWorkplaces) =>
              setFormState((prev) => ({
                ...prev,
                workplaces: updatedWorkplaces,
              }))
            }
            emptyWorkplace={emptyWorkplace}
          />
        </CardWrapper>
        <CardWrapper showLabel={false}>
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
              <div>
                <h3 className="text-foreground text-sm font-medium">Sites</h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Work site classifications for department settings
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1 rounded-xl text-[0.7rem] font-medium bg-white border border-border text-foreground shadow-sm">
              OFF SET
            </button>

            <button className="flex items-center gap-2 px-3 py-1 rounded-xl text-[0.7rem] font-medium bg-white border border-border text-foreground shadow-sm">
              ON SET
            </button>
          </div>
        </CardWrapper>
      </div>
    </>
  );
}

export default PlacesSettings;
