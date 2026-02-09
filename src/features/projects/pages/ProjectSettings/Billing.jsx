import { useState } from "react";
import { Edit, Save, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditableCheckboxField from "@/shared/components/wrappers/EditableCheckboxField";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";

const Billing = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  const [billingContactName, setBillingContactName] = useState("");
  const [billingContactEmails, setBillingContactEmails] = useState("");
  const [spvVatNumber, setSpvVatNumber] = useState("");
  const [sameAsSpv, setSameAsSpv] = useState(false);
  
  // Billing Address
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("");

  const countries = [
    { label: "United Kingdom", value: "UK" },
    { label: "United States", value: "US" },
    { label: "Canada", value: "CA" },
    { label: "Australia", value: "AU" },
    { label: "Germany", value: "DE" },
    { label: "France", value: "FR" },
    { label: "Spain", value: "ES" },
    { label: "Italy", value: "IT" },
    { label: "Ireland", value: "IE" },
    { label: "New Zealand", value: "NZ" },
    { label: "Other", value: "OTHER" }
  ];

  const handleSave = () => {
    console.log("Saving billing information...");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      {/* Title with Edit/Save/Cancel Buttons */}
      <div className="flex items-center justify-between bg-background border rounded-lg p-4 shadow-sm">
        <h2 className="text-base font-semibold">Billing</h2>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="default"
              size="sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                variant="default"
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Unified 3:6:3 Grid Layout for All Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN (3/12) */}
        <div className="lg:col-span-3 space-y-4">
        </div>

        {/* CENTER COLUMN (6/12) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Billing Information Section */}
          <CardWrapper
            title="Billing Information"
            icon="FileText"
          >
            <div className="space-y-2">
              {/* Row 1: Contact Name, Email - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <EditableTextDataField
                  label="Billing Contact Name"
                  value={billingContactName}
                  onChange={setBillingContactName}
                  isEditing={isEditing}
                  placeholder="Enter contact name"
                />
                <EditableTextDataField
                  label="Billing Contact Email(s)"
                  value={billingContactEmails}
                  onChange={setBillingContactEmails}
                  isEditing={isEditing}
                  placeholder="email@example.com"
                />
              </div>

              {/* Row 2: VAT Number - Full Width */}
              <EditableTextDataField
                label="SPV Company VAT Number"
                value={spvVatNumber}
                onChange={setSpvVatNumber}
                isEditing={isEditing}
                placeholder="Enter VAT number"
              />

              {/* Row 3: Same as SPV Checkbox */}
              <EditableCheckboxField
                label="Billing address is same as SPV company"
                checked={sameAsSpv}
                onChange={setSameAsSpv}
                isEditing={isEditing}
              />

              {/* Billing Address Section */}
              <div className="pt-3 space-y-2 border-t">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Billing Address <span className="font-normal italic">(Optional)</span>
                </div>

                {/* Address Line 1, 2, City - 3 columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <EditableTextDataField
                    label="Address Line 1"
                    value={addressLine1}
                    onChange={setAddressLine1}
                    isEditing={isEditing && !sameAsSpv}
                    placeholder="Address line 1"
                  />
                  <EditableTextDataField
                    label="Address Line 2"
                    value={addressLine2}
                    onChange={setAddressLine2}
                    isEditing={isEditing && !sameAsSpv}
                    placeholder="Address line 2"
                  />
                  <EditableTextDataField
                    label="City"
                    value={city}
                    onChange={setCity}
                    isEditing={isEditing && !sameAsSpv}
                    placeholder="City"
                  />
                </div>

                {/* Postcode, Country - 2 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <EditableTextDataField
                    label="Postcode"
                    value={postcode}
                    onChange={setPostcode}
                    isEditing={isEditing && !sameAsSpv}
                    placeholder="Postcode"
                  />
                  <EditableSelectField
                    label="Country"
                    value={country}
                    items={countries}
                    onChange={setCountry}
                    isEditing={isEditing && !sameAsSpv}
                  />
                </div>
              </div>
            </div>
          </CardWrapper>
        </div>

        {/* RIGHT COLUMN (3/12) */}
        <div className="lg:col-span-3 space-y-4">
        </div>
      </div>
    </div>
  );
};

export default Billing;