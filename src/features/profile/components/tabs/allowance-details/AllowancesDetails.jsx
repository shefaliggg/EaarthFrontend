import React, { useState } from "react";
import { Field, FileUpload } from "../../common/UnifiedFields";
import { Car, Check, Pen, X } from "lucide-react";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/config/utils";
import EditableCheckboxField from "../../../../../shared/components/wrappers/EditableCheckboxField";
import EditableDateField from "../../../../../shared/components/wrappers/EditableDateField";
import EditableTextDataField from "../../../../../shared/components/wrappers/EditableTextDataField";
import EditToggleButtons from "../../../../../shared/components/buttons/EditToggleButtons";
import AllowanceItemsList from "./components/AllowanceItemsList";

export default function AllowanceDetails({
  profile,
  setProfile,
  isEditing,
  setIsEditing,
  uploads,
  setUploads,
}) {
  const [useOwnVehicle, setUseOwnVehicle] = useState(true);

  return (
    <>
      <CardWrapper
        title={"Personal Vehicle"}
        icon={"Car"}
        actions={
           <EditToggleButtons
            isEditing={isEditing}
            onEdit={setIsEditing}
            onSave={setIsEditing}
            onCancel={setIsEditing}
          />
        }
      >
        <EditableCheckboxField
          label="I Use My own Vehicle"
          // description="Auto-generate meeting agendas."
          checked={useOwnVehicle}
          isEditing={isEditing}
          onChange={setUseOwnVehicle}
        />

        {useOwnVehicle && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableTextDataField
                label="VEHICLE MAKE"
                value={profile.vehicleMake}
                onChange={(val) =>
                  setProfile({ ...profile, vehicleMake: val.toUpperCase() })
                }
                isEditing={isEditing}
              />

              <EditableTextDataField
                label="VEHICLE MODEL"
                value={profile.vehicleModel}
                onChange={(val) =>
                  setProfile({ ...profile, vehicleModel: val.toUpperCase() })
                }
                isEditing={isEditing}
              />

              <EditableTextDataField
                label="VEHICLE COLOUR"
                value={profile.vehicleColour}
                onChange={(val) =>
                  setProfile({ ...profile, vehicleColour: val.toUpperCase() })
                }
                isEditing={isEditing}
              />

              <EditableTextDataField
                label="VEHICLE REGISTRATION"
                value={profile.vehicleRegistration}
                onChange={(val) =>
                  setProfile({
                    ...profile,
                    vehicleRegistration: val.toUpperCase(),
                  })
                }
                isEditing={isEditing}
              />

              <EditableDateField
                label="INSURANCE EXPIRY DATE"
                value={profile.vehicleInsuranceExpiryDate}
                onChange={(val) =>
                  setProfile({
                    ...profile,
                    vehicleInsuranceExpiryDate: val,
                  })
                }
                isEditing={isEditing}
              />
            </div>

            {/* Document Uploads for Vehicle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label
                  className={`block text-xs font-medium mb-2  text-muted-foreground`}
                >
                  DRIVING LICENCE
                </label>
                <FileUpload
                  fieldLabel="Driving Licence"
                  fileName="Driving_Licence.pdf"
                  isUploaded={uploads?.drivingLicence}
                  isEditing={isEditing}
                  onUpload={() =>
                    setUploads((prev) => ({ ...prev, drivingLicence: true }))
                  }
                  onDelete={() =>
                    setUploads((prev) => ({ ...prev, drivingLicence: false }))
                  }
                />
              </div>

              <div>
                <label
                  className={`block text-xs font-medium mb-2  text-muted-foreground`}
                >
                  VEHICLE INSURANCE
                </label>
                <FileUpload
                  fieldLabel="Vehicle Insurance"
                  fileName="Vehicle_Insurance.pdf"
                  isUploaded={uploads?.vehicleInsurance}
                  isEditing={isEditing}
                  onUpload={() =>
                    setUploads((prev) => ({
                      ...prev,
                      vehicleInsurance: true,
                    }))
                  }
                  onDelete={() =>
                    setUploads((prev) => ({
                      ...prev,
                      vehicleInsurance: false,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        )}
      </CardWrapper>

      <CardWrapper
        title={"Computer"}
        icon={"Laptop"}
        actions={
            <EditToggleButtons
            isEditing={isEditing}
            onEdit={setIsEditing}
            onSave={setIsEditing}
            onCancel={setIsEditing}
          />
        }
      >
        <AllowanceItemsList allowanceType="computer" isEditing={isEditing} />
      </CardWrapper>
      <CardWrapper
        title={"Mobile Phone"}
        icon={"Smartphone"}
        actions={
           <EditToggleButtons
            isEditing={isEditing}
            onEdit={setIsEditing}
            onSave={setIsEditing}
            onCancel={setIsEditing}
          />
        }
      >
        <AllowanceItemsList allowanceType="mobile" isEditing={isEditing}  />
      </CardWrapper>
      <CardWrapper
        title={"Software"}
        icon={"AppWindow"}
        actions={
  <EditToggleButtons
            isEditing={isEditing}
            onEdit={setIsEditing}
            onSave={setIsEditing}
            onCancel={setIsEditing}
          />
        }
      >
        <AllowanceItemsList allowanceType="software" isEditing={isEditing}  />
      </CardWrapper>
      <CardWrapper
        title={"Equipment"}
        icon={"Camera"}
        actions={
            <EditToggleButtons
            isEditing={isEditing}
            onEdit={setIsEditing}
            onSave={setIsEditing}
            onCancel={setIsEditing}
          />
        }
      >
        <AllowanceItemsList allowanceType="equipment" isEditing={isEditing}  />
      </CardWrapper>
      <CardWrapper
        title={"Box Rental"}
        icon={"Package"}
        actions={
           <EditToggleButtons
            isEditing={isEditing}
            onEdit={setIsEditing}
            onSave={setIsEditing}
            onCancel={setIsEditing}
          />
        }
      >
        <AllowanceItemsList allowanceType="box_rentals" isEditing={isEditing} />
      </CardWrapper>
    </>
  );
}
