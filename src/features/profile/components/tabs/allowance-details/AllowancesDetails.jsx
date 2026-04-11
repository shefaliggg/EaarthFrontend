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
import EditableSwitchField from "../../../../../shared/components/wrappers/EditableSwitchField";

export default function AllowanceDetails({
  profile,
  setProfile,
  isEditing,
  setIsEditing,
  uploads,
  setUploads,
}) {
  const [useOwnVehicle, setUseOwnVehicle] = useState(true);
  const [allowanceTotal, setAllowanceTotal] = useState({
    computer: 0,
    mobile: 0,
    equipment: 0,
    box_rentals: 0,
    software: 0,
  });

  return (
    <>
      <CardWrapper
        title={"Personal Vehicle"}
        subtitle={
          "Your vehivle details for site access and parking arrangements."
        }
        icon={"Car"}
        actions={
          <EditToggleButtons
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onSave={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        }
      >
        <EditableSwitchField
          label="I will use my own vehicle"
          checked={useOwnVehicle}
          isEditing={isEditing}
          onChange={setUseOwnVehicle}
        />

        {useOwnVehicle && (
          <div className="mt-6">
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
                label="VEHICLEINSURANCE EXPIRY DATE"
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
            <div className="grid grid-cols-1 gap-3 mt-4">
              <FileUpload
                label="UPLOAD DRIVING LICENCE"
                infoPillDescription="Upload a valid government-issued driving licence as proof of your legal authorization to operate a motor vehicle."
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

              <FileUpload
                label="VEHICLE INSURANCE CERTIFICATE"
                infoPillDescription="Upload a valid vehicle insurance certificate as proof of active insurance coverage for the registered vehicle."
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
        )}
      </CardWrapper>

      <CardWrapper
        title={"Computer"}
        icon={"Laptop"}
        actions={
          <>
            {(allowanceTotal?.computer || 0) > 0 && (
              <div className="flex justify-end">
                <div className="w-full px-3">
                  <div className="flex justify-between gap-3 items-center text-sm text-muted-foreground">
                    <span>Gross Total</span>
                    <span className="text-[16px] font-semibold text-primary">
                      {allowanceTotal?.computer.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <EditToggleButtons
              isEditing={isEditing}
              onEdit={() => setIsEditing(true)}
              onSave={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          </>
        }
      >
        <AllowanceItemsList
          allowanceType="computer"
          isEditing={isEditing}
          setAllowanceTotal={setAllowanceTotal}
        />
      </CardWrapper>
      <CardWrapper
        title={"Mobile Phone"}
        icon={"Smartphone"}
        actions={
          <>
            {(allowanceTotal?.mobile || 0) > 0 && (
              <div className="flex justify-end">
                <div className="w-full px-3">
                  <div className="flex justify-between gap-3 items-center text-sm text-muted-foreground">
                    <span>Gross Total</span>
                    <span className="text-[16px] font-semibold text-primary">
                      {allowanceTotal?.mobile.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <EditToggleButtons
              isEditing={isEditing}
              onEdit={() => setIsEditing(true)}
              onSave={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          </>
        }
      >
        <AllowanceItemsList
          allowanceType="mobile"
          isEditing={isEditing}
          setAllowanceTotal={setAllowanceTotal}
        />
      </CardWrapper>
      <CardWrapper
        title={"Software"}
        icon={"AppWindow"}
        actions={
          <>
            {(allowanceTotal?.software || 0) > 0 && (
              <div className="flex justify-end">
                <div className="w-full px-3">
                  <div className="flex justify-between gap-3 items-center text-sm text-muted-foreground">
                    <span>Gross Total</span>
                    <span className="text-[16px] font-semibold text-primary">
                      {allowanceTotal?.software.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <EditToggleButtons
              isEditing={isEditing}
              onEdit={() => setIsEditing(true)}
              onSave={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          </>
        }
      >
        <AllowanceItemsList
          allowanceType="software"
          isEditing={isEditing}
          setAllowanceTotal={setAllowanceTotal}
        />
      </CardWrapper>
      <CardWrapper
        title={"Equipment"}
        icon={"Camera"}
        actions={
          <>
            {(allowanceTotal?.equipment || 0) > 0 && (
              <div className="flex justify-end">
                <div className="w-full px-3">
                  <div className="flex justify-between gap-3 items-center text-sm text-muted-foreground">
                    <span>Gross Total</span>
                    <span className="text-[16px] font-semibold text-primary">
                      {allowanceTotal?.equipment.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <EditToggleButtons
              isEditing={isEditing}
              onEdit={() => setIsEditing(true)}
              onSave={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          </>
        }
      >
        <AllowanceItemsList
          allowanceType="equipment"
          isEditing={isEditing}
          setAllowanceTotal={setAllowanceTotal}
        />
      </CardWrapper>
      <CardWrapper
        title={"Box Rental"}
        icon={"Package"}
        actions={
          <>
            {(allowanceTotal?.box_rentals || 0) > 0 && (
              <div className="flex justify-end">
                <div className="w-full px-3">
                  <div className="flex justify-between gap-3 items-center text-sm text-muted-foreground">
                    <span>Gross Total</span>
                    <span className="text-[16px] font-semibold text-primary">
                      {allowanceTotal?.box_rentals.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <EditToggleButtons
              isEditing={isEditing}
              onEdit={() => setIsEditing(true)}
              onSave={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          </>
        }
      >
        <AllowanceItemsList
          allowanceType="box_rentals"
          isEditing={isEditing}
          setAllowanceTotal={setAllowanceTotal}
        />
      </CardWrapper>
    </>
  );
}
