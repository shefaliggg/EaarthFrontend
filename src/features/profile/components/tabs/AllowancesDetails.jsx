import React, { useState } from 'react';
import { Field, FileUpload } from '../common/UnifiedFields';
import { Car } from 'lucide-react';

export default function AllowanceDetails({ profile, setProfile, isEditing, isDarkMode, uploads, setUploads }) {
  const [useOwnVehicle, setUseOwnVehicle] = useState(true);

  return (
    <div className={`rounded-xl border shadow-md p-6 ${isDarkMode ? 'bg-card border-border' : 'bg-card border-border'}`}>
      <div className="space-y-6">
        {/* Vehicle Toggle */}
        <div>
          <label className="flex items-center justify-between cursor-pointer">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-foreground' : 'text-foreground'}`}>
              I USE MY OWN VEHICLE
            </span>
            <input
              type="checkbox"
              checked={useOwnVehicle}
              onChange={(e) => setUseOwnVehicle(e.target.checked)}
              disabled={!isEditing}
              className="w-4 h-4 text-primary accent-primary"
            />
          </label>
        </div>

        {/* Vehicle */}
        {useOwnVehicle && (
          <div className="pt-6 border-t border-border">
            <h4 className={`font-medium mb-4 flex items-center gap-2 ${isDarkMode ? 'text-foreground' : 'text-foreground'}`}>
              <Car className="w-5 h-5" /> PERSONAL VEHICLE
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field 
                label="VEHICLE MAKE" 
                value={profile.vehicleMake} 
                onChange={(e) => setProfile({ ...profile, vehicleMake: e.target.value.toUpperCase() })} 
                isEditing={isEditing} 
                isDarkMode={isDarkMode} 
              />
              
              <Field 
                label="VEHICLE MODEL" 
                value={profile.vehicleModel} 
                onChange={(e) => setProfile({ ...profile, vehicleModel: e.target.value.toUpperCase() })} 
                isEditing={isEditing} 
                isDarkMode={isDarkMode} 
              />
              
              <Field 
                label="VEHICLE COLOUR" 
                value={profile.vehicleColour} 
                onChange={(e) => setProfile({ ...profile, vehicleColour: e.target.value.toUpperCase() })} 
                isEditing={isEditing} 
                isDarkMode={isDarkMode} 
              />
              
              <Field 
                label="VEHICLE REGISTRATION" 
                value={profile.vehicleRegistration} 
                onChange={(e) => setProfile({ ...profile, vehicleRegistration: e.target.value.toUpperCase() })} 
                isEditing={isEditing} 
                isDarkMode={isDarkMode} 
              />
              
              <Field 
                label="INSURANCE EXPIRY DATE" 
                value={profile.vehicleInsuranceExpiryDate} 
                onChange={(e) => setProfile({ ...profile, vehicleInsuranceExpiryDate: e.target.value })} 
                type="date"
                isEditing={isEditing} 
                isDarkMode={isDarkMode} 
                cols={2}
              />
            </div>

            {/* Document Uploads for Vehicle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                  DRIVING LICENCE
                </label>
                <FileUpload
                  fieldLabel="Driving Licence"
                  fileName="Driving_Licence.pdf"
                  isUploaded={uploads?.drivingLicence}
                  isEditing={isEditing}
                  isDarkMode={isDarkMode}
                  onUpload={() => setUploads(prev => ({ ...prev, drivingLicence: true }))}
                  onDelete={() => setUploads(prev => ({ ...prev, drivingLicence: false }))}
                />
              </div>
              
              <div>
                <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                  VEHICLE INSURANCE
                </label>
                <FileUpload
                  fieldLabel="Vehicle Insurance"
                  fileName="Vehicle_Insurance.pdf"
                  isUploaded={uploads?.vehicleInsurance}
                  isEditing={isEditing}
                  isDarkMode={isDarkMode}
                  onUpload={() => setUploads(prev => ({ ...prev, vehicleInsurance: true }))}
                  onDelete={() => setUploads(prev => ({ ...prev, vehicleInsurance: false }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Computer */}
        <div className={useOwnVehicle ? 'pt-6 border-t border-border' : ''}>
          <h4 className={`font-medium mb-4 ${isDarkMode ? 'text-foreground' : 'text-foreground'}`}>
            💻 COMPUTER
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field 
              label="COMPUTER DESCRIPTION" 
              value={profile.computerDescription} 
              onChange={(e) => setProfile({ ...profile, computerDescription: e.target.value.toUpperCase() })} 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
            
            <Field 
              label="INSURANCE VALUE (£)" 
              value={profile.computerInsuranceValue} 
              onChange={(e) => setProfile({ ...profile, computerInsuranceValue: e.target.value })} 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
          </div>
        </div>

        {/* Software */}
        <div className="pt-6 border-t border-border">
          <h4 className={`font-medium mb-4 ${isDarkMode ? 'text-foreground' : 'text-foreground'}`}>
            ⚙️ SOFTWARE
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field 
              label="SOFTWARE DESCRIPTION" 
              value={profile.softwareDescription} 
              onChange={(e) => setProfile({ ...profile, softwareDescription: e.target.value.toUpperCase() })} 
              placeholder="E.G. ADOBE CREATIVE CLOUD"
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
            
            <Field 
              label="TOTAL ANNUAL COST (£)" 
              value={profile.softwareTotalAnnualCost} 
              onChange={(e) => setProfile({ ...profile, softwareTotalAnnualCost: e.target.value })} 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
          </div>
          
          <div className="mt-4">
            <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
              SOFTWARE LICENCE
            </label>
            <FileUpload
              fieldLabel="Software Licence"
              fileName="Software_Licence.pdf"
              isUploaded={uploads?.softwareLicence}
              isEditing={isEditing}
              isDarkMode={isDarkMode}
              onUpload={() => setUploads(prev => ({ ...prev, softwareLicence: true }))}
              onDelete={() => setUploads(prev => ({ ...prev, softwareLicence: false }))}
            />
          </div>
        </div>

        {/* Equipment */}
        <div className="pt-6 border-t border-border">
          <h4 className={`font-medium mb-4 ${isDarkMode ? 'text-foreground' : 'text-foreground'}`}>
            📦 EQUIPMENT
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field 
              label="EQUIPMENT INSURANCE VALUE (£)" 
              value={profile.equipmentInsuranceValue} 
              onChange={(e) => setProfile({ ...profile, equipmentInsuranceValue: e.target.value })} 
              placeholder="OPTIONAL"
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
          </div>
          
          <div className="mt-4">
            <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
              EQUIPMENT INVENTORY
            </label>
            <FileUpload
              fieldLabel="Equipment Inventory"
              fileName="Equipment_Inventory.pdf"
              isUploaded={uploads?.equipmentInventory}
              isEditing={isEditing}
              isDarkMode={isDarkMode}
              onUpload={() => setUploads(prev => ({ ...prev, equipmentInventory: true }))}
              onDelete={() => setUploads(prev => ({ ...prev, equipmentInventory: false }))}
            />
          </div>
        </div>

        {/* Mobile */}
        <div className="pt-6 border-t border-border">
          <h4 className={`font-medium mb-4 ${isDarkMode ? 'text-foreground' : 'text-foreground'}`}>
            📱 MOBILE
          </h4>
          <div>
            <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
              MOBILE PHONE BILL
            </label>
            <FileUpload
              fieldLabel="Mobile Phone Bill"
              fileName="Mobile_Bill.pdf"
              isUploaded={uploads?.mobileBill}
              isEditing={isEditing}
              isDarkMode={isDarkMode}
              onUpload={() => setUploads(prev => ({ ...prev, mobileBill: true }))}
              onDelete={() => setUploads(prev => ({ ...prev, mobileBill: false }))}
            />
          </div>
        </div>

        {/* Box Rental */}
        <div className="pt-6 border-t border-border">
          <h4 className={`font-medium mb-4 ${isDarkMode ? 'text-foreground' : 'text-foreground'}`}>
            📦 BOX RENTAL
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field 
              label="BOX INSURANCE VALUE (£)" 
              value={profile.boxInsuranceValue} 
              onChange={(e) => setProfile({ ...profile, boxInsuranceValue: e.target.value })} 
              isEditing={isEditing} 
              isDarkMode={isDarkMode} 
            />
          </div>
          
          <div className="mt-4">
            <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
              BOX INVENTORY
            </label>
            <FileUpload
              fieldLabel="Box Inventory"
              fileName="Box_Inventory.pdf"
              isUploaded={uploads?.boxInventory}
              isEditing={isEditing}
              isDarkMode={isDarkMode}
              onUpload={() => setUploads(prev => ({ ...prev, boxInventory: true }))}
              onDelete={() => setUploads(prev => ({ ...prev, boxInventory: false }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}







