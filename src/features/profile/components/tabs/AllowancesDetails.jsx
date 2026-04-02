import React, { useState } from "react";
import { Field, FileUpload } from "../common/UnifiedFields";
import { Car, Check, Pen, X } from "lucide-react";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/config/utils";
import EditableCheckboxField from "../../../../shared/components/wrappers/EditableCheckboxField";
import EditableDateField from "../../../../shared/components/wrappers/EditableDateField";
import EditableTextDataField from "../../../../shared/components/wrappers/EditableTextDataField";

export default function AllowanceDetails({
  profile,
  setProfile,
  isEditing,
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
          <>
            {isEditing && (
              <Button
                size="icon"
                variant={"outline"}
                onClick={() => setIsEditing((prev) => !prev)}
                className={"hover:bg-red-200 dark:hover:bg-red-800"}
              >
                <X className="text-red-500" />
              </Button>
            )}
            <Button
              size="icon"
              variant={"outline"}
              onClick={() => setIsEditing((prev) => !prev)}
              className={cn(
                isEditing
                  ? "hover:bg-green-200 dark:hover:bg-green-800"
                  : "hover:bg-purple-200 dark:hover:bg-purple-800",
              )}
            >
              {isEditing ? (
                <Check className="text-green-500" />
              ) : (
                <Pen className="text-primary" />
              )}
            </Button>
          </>
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
      <div className={`rounded-xl border shadow-md p-6 bg-card border-border`}>
        <div className="space-y-6">
          {/* Computer */}
          <div className={useOwnVehicle ? "pt-6 border-t border-border" : ""}>
            <h4 className={`font-medium mb-4 text-foreground`}>💻 COMPUTER</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="COMPUTER DESCRIPTION"
                value={profile.computerDescription}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    computerDescription: e.target.value.toUpperCase(),
                  })
                }
                isEditing={isEditing}
              />

              <Field
                label="INSURANCE VALUE (£)"
                value={profile.computerInsuranceValue}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    computerInsuranceValue: e.target.value,
                  })
                }
                isEditing={isEditing}
              />
            </div>
          </div>

          {/* Software */}
          <div className="pt-6 border-t border-border">
            <h4 className={`font-medium mb-4 text-foreground`}>⚙️ SOFTWARE</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="SOFTWARE DESCRIPTION"
                value={profile.softwareDescription}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    softwareDescription: e.target.value.toUpperCase(),
                  })
                }
                placeholder="E.G. ADOBE CREATIVE CLOUD"
                isEditing={isEditing}
              />

              <Field
                label="TOTAL ANNUAL COST (£)"
                value={profile.softwareTotalAnnualCost}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    softwareTotalAnnualCost: e.target.value,
                  })
                }
                isEditing={isEditing}
              />
            </div>

            <div className="mt-4">
              <label
                className={`block text-xs font-medium mb-2  text-muted-foreground`}
              >
                SOFTWARE LICENCE
              </label>
              <FileUpload
                fieldLabel="Software Licence"
                fileName="Software_Licence.pdf"
                isUploaded={uploads?.softwareLicence}
                isEditing={isEditing}
                onUpload={() =>
                  setUploads((prev) => ({ ...prev, softwareLicence: true }))
                }
                onDelete={() =>
                  setUploads((prev) => ({ ...prev, softwareLicence: false }))
                }
              />
            </div>
          </div>

          {/* Equipment */}
          <div className="pt-6 border-t border-border">
            <h4 className={`font-medium mb-4 text-foreground`}>📦 EQUIPMENT</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="EQUIPMENT INSURANCE VALUE (£)"
                value={profile.equipmentInsuranceValue}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    equipmentInsuranceValue: e.target.value,
                  })
                }
                placeholder="OPTIONAL"
                isEditing={isEditing}
              />
            </div>

            <div className="mt-4">
              <label
                className={`block text-xs font-medium mb-2  text-muted-foreground`}
              >
                EQUIPMENT INVENTORY
              </label>
              <FileUpload
                fieldLabel="Equipment Inventory"
                fileName="Equipment_Inventory.pdf"
                isUploaded={uploads?.equipmentInventory}
                isEditing={isEditing}
                onUpload={() =>
                  setUploads((prev) => ({ ...prev, equipmentInventory: true }))
                }
                onDelete={() =>
                  setUploads((prev) => ({ ...prev, equipmentInventory: false }))
                }
              />
            </div>
          </div>

          {/* Mobile */}
          <div className="pt-6 border-t border-border">
            <h4 className={`font-medium mb-4 text-foreground`}>📱 MOBILE</h4>
            <div>
              <label
                className={`block text-xs font-medium mb-2  text-muted-foreground`}
              >
                MOBILE PHONE BILL
              </label>
              <FileUpload
                fieldLabel="Mobile Phone Bill"
                fileName="Mobile_Bill.pdf"
                isUploaded={uploads?.mobileBill}
                isEditing={isEditing}
                onUpload={() =>
                  setUploads((prev) => ({ ...prev, mobileBill: true }))
                }
                onDelete={() =>
                  setUploads((prev) => ({ ...prev, mobileBill: false }))
                }
              />
            </div>
          </div>

          {/* Box Rental */}
          <div className="pt-6 border-t border-border">
            <h4
              className={`font-medium mb-4 text-foreground`}
            >
              📦 BOX RENTAL
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="BOX INSURANCE VALUE (£)"
                value={profile.boxInsuranceValue}
                onChange={(e) =>
                  setProfile({ ...profile, boxInsuranceValue: e.target.value })
                }
                isEditing={isEditing}
              />
            </div>

            <div className="mt-4">
              <label
                className={`block text-xs font-medium mb-2  text-muted-foreground`}
              >
                BOX INVENTORY
              </label>
              <FileUpload
                fieldLabel="Box Inventory"
                fileName="Box_Inventory.pdf"
                isUploaded={uploads?.boxInventory}
                isEditing={isEditing}
                onUpload={() =>
                  setUploads((prev) => ({ ...prev, boxInventory: true }))
                }
                onDelete={() =>
                  setUploads((prev) => ({ ...prev, boxInventory: false }))
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
