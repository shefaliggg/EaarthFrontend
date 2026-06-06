import { useState } from "react";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import DataTable from "@/shared/components/tables/DataTable/DataTable";
import { DepartmentColumns } from "@/features/projects/settings/components/departments/DepartmentColumns";
import { Plus } from "lucide-react";

const emptyDepartment = () => ({
  id: Date.now() + Math.random(),
  department: "",
  site: "On Set",
  cameraOT: false,
  otherOT: false,
  minutesAcross: 0,
  minutesBefore: 0,
  minutesAfter: 0,
});

const INITIAL_DEPARTMENTS = [
  {
    id: 1,
    department: "All Depts",
    site: "Off Set",
    cameraOT: true,
    otherOT: true,
    minutesAcross: 0,
    minutesBefore: 0,
    minutesAfter: "",
  },

  {
    id: 2,
    department: "All Depts",
    site: "On Set",
    cameraOT: true,
    otherOT: true,
    minutesAcross: 0,
    minutesBefore: "",
    minutesAfter: "",
  },

  {
    id: 3,
    department: "Assistant Directors",
    site: "On Set",
    cameraOT: true,
    otherOT: true,
    minutesAcross: "",
    minutesBefore: 30,
    minutesAfter: 32,
  },

  {
    id: 4,
    department: "Assistant Directors",
    site: "Off Set",
    cameraOT: false,
    otherOT: true,
    minutesAcross: "",
    minutesBefore: 30,
    minutesAfter: 30,
  },

  {
    id: 5,
    department: "Continuity",
    site: "Off Set",
    cameraOT: false,
    otherOT: true,
    minutesAcross: "",
    minutesBefore: 30,
    minutesAfter: 30,
  },

  {
    id: 6,
    department: "Continuity",
    site: "On Set",
    cameraOT: true,
    otherOT: true,
    minutesAcross: "",
    minutesBefore: 30,
    minutesAfter: 30,
  },

  {
    id: 7,
    department: "Costume",
    site: "On Set",
    cameraOT: true,
    otherOT: true,
    minutesAcross: "",
    minutesBefore: 0,
    minutesAfter: 0,
  },

  {
    id: 8,
    department: "Costume",
    site: "Off Set",
    cameraOT: false,
    otherOT: true,
    minutesAcross: "",
    minutesBefore: 0,
    minutesAfter: 0,
  },

  {
    id: 9,
    department: "Grip",
    site: "On Set",
    cameraOT: true,
    otherOT: true,
    minutesAcross: 0,
    minutesBefore: "",
    minutesAfter: "",
  },

  {
    id: 10,
    department: "Hair and Makeup",
    site: "Off Set",
    cameraOT: false,
    otherOT: true,
    minutesAcross: "",
    minutesBefore: 30,
    minutesAfter: 30,
  },

  {
    id: 11,
    department: "Hair and Makeup",
    site: "On Set",
    cameraOT: true,
    otherOT: true,
    minutesAcross: "",
    minutesBefore: 30,
    minutesAfter: 30,
  },

  {
    id: 12,
    department: "Locations",
    site: "On Set",
    cameraOT: true,
    otherOT: true,
    minutesAcross: "",
    minutesBefore: 30,
    minutesAfter: 30,
  },

  {
    id: 12,
    department: "Locations",
    site: "Off Set",
    cameraOT: false,
    otherOT: true,
    minutesAcross: "",
    minutesBefore: 30,
    minutesAfter: 30,
  },

  {
    id: 13,
    department: "Script",
    site: "Off Set",
    cameraOT: false,
    otherOT: true,
    minutesAcross: "",
    minutesBefore: 30,
    minutesAfter: 30,
  },

  {
    id: 14,
    department: "Script",
    site: "On Set",
    cameraOT: true,
    otherOT: true,
    minutesAcross: "",
    minutesBefore: 30,
    minutesAfter: 30,
  },

  {
    id: 15,
    department: "VFX",
    site: "On Set",
    cameraOT: true,
    otherOT: true,
    minutesAcross: "",
    minutesBefore: 30,
    minutesAfter: 30,
  },

  {
    id: 16,
    department: "VFX",
    site: "Off Set",
    cameraOT: false,
    otherOT: true,
    minutesAcross: "",
    minutesBefore: 30,
    minutesAfter: 30,
  },
];

function DepartmentSettings() {
  const [isEditing, setIsEditing] = useState(false);

  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);

  const handleDeleteDepartment = (id) => {
    setDepartments((prev) => prev.filter((department) => department.id !== id));
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
                  Department Overtime & Wrap Time
                </h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Configure camera/other overtime and reasonable prep & wrap
                  minutes per department and site
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <EditToggleButtons
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={() => setIsEditing(false)}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          </div>
          <DataTable
            data={departments}
            columns={DepartmentColumns({
              departments,
              setDepartments,
              isEditing,
              onDelete: handleDeleteDepartment,
            })}
            currentPage={1}
            ItemsPerPage={50}
            totalItemsSize={departments.length}
            onPageChange={() => {}}
            setItemsPerPage={() => {}}
            hidePagination
            hideExport
          />
          {isEditing && (
            <button
              onClick={() =>
                setDepartments((prev) => [...prev, emptyDepartment()])
              }
              className="w-full border-2 border-dashed border-border text-primary mt-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-muted/20"
            >
              <Plus size={16} />
              Add Department Row
            </button>
          )}
        </CardWrapper>
      </div>
    </>
  );
}

export default DepartmentSettings;
