import { useState } from "react";
import { PageHeader } from "@/shared/components/PageHeader";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditableCheckboxField from "@/shared/components/wrappers/EditableCheckboxField";

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
    <div className="space-y-3 pb-6">
      <PageHeader
        title="Billing"
        subtitle="Contact details for Team Engine to send invoices to"
        icon="Receipt"
        primaryAction={
          isEditing
            ? {
                label: "Save Changes",
                icon: "Save",
                clickAction: handleSave,
              }
            : {
                label: "Edit",
                icon: "Pencil",
                clickAction: () => setIsEditing(true),
              }
        }
        secondaryActions={
          isEditing
            ? [
                {
                  label: "Cancel",
                  icon: "X",
                  variant: "outline",
                  clickAction: handleCancel,
                },
              ]
            : []
        }
      />

      <CardWrapper
        title="Billing Information"
        icon="FileText"
        description="Manage billing contact details and address"
      >
        <div className="space-y-2">
          {/* Row 1: Contact Name, Email, VAT Number - 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                <span>Billing Contact Name</span>
              </div>
              {!isEditing ? (
                <div className="text-sm font-medium text-foreground bg-muted/30 px-3 py-1.5 rounded-md border h-8 flex items-center">
                  {billingContactName || <span className="italic text-muted-foreground text-xs">Not Available</span>}
                </div>
              ) : (
                <input
                  value={billingContactName}
                  onChange={(e) => setBillingContactName(e.target.value)}
                  placeholder="Enter contact name"
                  className="w-full px-3 py-1.5 h-8 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors text-sm bg-background"
                />
              )}
            </div>
            
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                <span>Billing Contact Email(s)</span>
              </div>
              {!isEditing ? (
                <div className="text-sm font-medium text-foreground bg-muted/30 px-3 py-1.5 rounded-md border h-8 flex items-center">
                  {billingContactEmails || <span className="italic text-muted-foreground text-xs">Not Available</span>}
                </div>
              ) : (
                <input
                  value={billingContactEmails}
                  onChange={(e) => setBillingContactEmails(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-3 py-1.5 h-8 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors text-sm bg-background"
                />
              )}
            </div>
            
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                <span>SPV Company VAT Number</span>
              </div>
              {!isEditing ? (
                <div className="text-sm font-medium text-foreground bg-muted/30 px-3 py-1.5 rounded-md border h-8 flex items-center">
                  {spvVatNumber || <span className="italic text-muted-foreground text-xs">Not Available</span>}
                </div>
              ) : (
                <input
                  value={spvVatNumber}
                  onChange={(e) => setSpvVatNumber(e.target.value)}
                  placeholder="Enter VAT number"
                  className="w-full px-3 py-1.5 h-8 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors text-sm bg-background"
                />
              )}
            </div>
          </div>

          {/* Row 2: Same as SPV Checkbox */}
          <div className="pt-0.5">
            <EditableCheckboxField
              label="Billing address is same as SPV company"
              checked={sameAsSpv}
              onChange={setSameAsSpv}
              isEditing={isEditing}
            />
          </div>

          {/* Billing Address Section */}
          <div className="pt-1 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <span>Billing Address</span>
              <span className="text-[10px] text-muted-foreground font-normal italic">(Optional)</span>
            </div>

            {/* Row 3: Address Line 1, Address Line 2, City - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                  <span>Address Line 1</span>
                </div>
                {!isEditing || sameAsSpv ? (
                  <div className={`text-sm font-medium text-foreground bg-muted/30 px-3 py-1.5 rounded-md border h-8 flex items-center ${sameAsSpv ? 'opacity-50' : ''}`}>
                    {addressLine1 || <span className="italic text-muted-foreground text-xs">Not Available</span>}
                  </div>
                ) : (
                  <input
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="Address line 1"
                    disabled={sameAsSpv}
                    className="w-full px-3 py-1.5 h-8 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors text-sm bg-background disabled:bg-muted/50 disabled:cursor-not-allowed"
                  />
                )}
              </div>
              
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                  <span>Address Line 2</span>
                </div>
                {!isEditing || sameAsSpv ? (
                  <div className={`text-sm font-medium text-foreground bg-muted/30 px-3 py-1.5 rounded-md border h-8 flex items-center ${sameAsSpv ? 'opacity-50' : ''}`}>
                    {addressLine2 || <span className="italic text-muted-foreground text-xs">Not Available</span>}
                  </div>
                ) : (
                  <input
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="Address line 2"
                    disabled={sameAsSpv}
                    className="w-full px-3 py-1.5 h-8 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors text-sm bg-background disabled:bg-muted/50 disabled:cursor-not-allowed"
                  />
                )}
              </div>
              
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                  <span>City</span>
                </div>
                {!isEditing || sameAsSpv ? (
                  <div className={`text-sm font-medium text-foreground bg-muted/30 px-3 py-1.5 rounded-md border h-8 flex items-center ${sameAsSpv ? 'opacity-50' : ''}`}>
                    {city || <span className="italic text-muted-foreground text-xs">Not Available</span>}
                  </div>
                ) : (
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    disabled={sameAsSpv}
                    className="w-full px-3 py-1.5 h-8 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors text-sm bg-background disabled:bg-muted/50 disabled:cursor-not-allowed"
                  />
                )}
              </div>
            </div>

            {/* Row 4: Postcode, Country - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                  <span>Postcode</span>
                </div>
                {!isEditing || sameAsSpv ? (
                  <div className={`text-sm font-medium text-foreground bg-muted/30 px-3 py-1.5 rounded-md border h-8 flex items-center ${sameAsSpv ? 'opacity-50' : ''}`}>
                    {postcode || <span className="italic text-muted-foreground text-xs">Not Available</span>}
                  </div>
                ) : (
                  <input
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="Postcode"
                    disabled={sameAsSpv}
                    className="w-full px-3 py-1.5 h-8 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors text-sm bg-background disabled:bg-muted/50 disabled:cursor-not-allowed"
                  />
                )}
              </div>
              
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                  <span>Country</span>
                </div>
                {!isEditing || sameAsSpv ? (
                  <div className={`text-sm font-medium text-foreground bg-muted/30 px-3 py-1.5 rounded-md border h-8 flex items-center ${sameAsSpv ? 'opacity-50' : ''}`}>
                    {countries.find(c => c.value === country)?.label || <span className="italic text-muted-foreground text-xs">Not set</span>}
                  </div>
                ) : (
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    disabled={sameAsSpv}
                    className="w-full px-3 py-1.5 h-8 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors text-sm bg-background disabled:bg-muted/50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Country...</option>
                    {countries.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardWrapper>
    </div>
  );
};

export default Billing;