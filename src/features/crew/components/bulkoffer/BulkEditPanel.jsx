/**
 * BulkEditPanel.jsx
 *
 * Modal panel for applying shared field values to selected rows.
 * Leave a field blank to keep existing row values unchanged.
 */

import { X } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { Card }   from "../../../../shared/components/ui/card";

const ENGAGEMENT_TYPE_OPTIONS = [
  { value: "", label: "— Keep existing —" },
  { value: "loan_out",  label: "Loan Out" },
  { value: "paye",      label: "PAYE" },
  { value: "schd",      label: "SCHD" },
  { value: "long_form", label: "Long Form" },
];

const WORKING_WEEK_OPTIONS = [
  { value: "", label: "— Keep existing —" },
  { value: "5",   label: "5 days" },
  { value: "5.5", label: "5.5 days" },
  { value: "5_6", label: "5/6 days" },
  { value: "6",   label: "6 days" },
];

const CURRENCY_OPTIONS = ["GBP", "USD", "EUR", "AUD", "CAD", "NZD", "DKK", "ISK"];

const CATEGORY_OPTIONS = [
  { value: "", label: "— Keep existing —" },
  { value: "standard_crew", label: "Standard Crew" },
  { value: "senior_buyout", label: "Senior / Buyout" },
  { value: "construction",  label: "Construction" },
  { value: "electrical",    label: "Electrical" },
  { value: "hod",           label: "HOD" },
  { value: "rigging",       label: "Rigging" },
  { value: "transport",     label: "Transport" },
];

const DEPARTMENTS = [
  "", "Accounts", "Action Vehicles", "Aerial", "Animals", "Animation", "Armoury", "Art",
  "Assets", "Assistant Directors", "Camera", "Cast", "Chaperones", "Choreography",
  "Clearances", "Computer Graphics", "Construction", "Continuity", "Costume",
  "Costume FX", "Covid Safety", "Creature Effects", "DIT", "Digital Assets",
  "Digital Playback", "Director", "Documentary", "Drapes", "EPK", "Editorial",
  "Electrical", "Electrical Rigging", "Franchise", "Greens", "Greenscreens", "Grip",
  "Hair and Makeup", "Health and Safety", "IT", "Locations", "Marine", "Medical",
  "Military", "Music", "Photography", "Picture Vehicles", "Post Production",
  "Production", "Prop Making", "Props", "Prosthetics", "Publicity", "Puppeteer",
  "Rigging", "SFX", "Script", "Script Editing", "Security", "Set Dec", "Sound",
  "Standby", "Storyboard", "Studio Unit", "Stunts", "Supporting Artist",
  "Sustainability", "Transport", "Tutors", "Underwater", "VFX", "Video", "Voice",
];

const FIELD_CONFIG = [
  {
    label: "Department",
    key: "department",
    options: DEPARTMENTS.map(d => ({ value: d, label: d || "— Keep existing —" })),
  },
  {
    label: "Engagement Type",
    key: "engagementType",
    options: ENGAGEMENT_TYPE_OPTIONS,
  },
  {
    label: "Working Week",
    key: "workingWeek",
    options: WORKING_WEEK_OPTIONS,
  },
  {
    label: "Currency",
    key: "currency",
    options: [
      { value: "", label: "— Keep existing —" },
      ...CURRENCY_OPTIONS.map(c => ({ value: c, label: c })),
    ],
  },
  {
    label: "Daily or Weekly",
    key: "dailyOrWeekly",
    options: [
      { value: "",       label: "— Keep existing —" },
      { value: "daily",  label: "Daily" },
      { value: "weekly", label: "Weekly" },
    ],
  },
  {
    label: "Category",
    key: "categoryId",
    options: CATEGORY_OPTIONS,
  },
  {
    label: "Working in UK",
    key: "workingInUK",
    options: [
      { value: "",      label: "— Keep existing —" },
      { value: "yes",   label: "Yes" },
      { value: "never", label: "Never" },
    ],
  },
];

export function BulkEditPanel({ selectedCount, bulkEdit, setBulkEdit, onApply, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <Card className="w-[460px] p-5 max-h-[80vh] overflow-y-auto shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-foreground">Bulk Edit</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Applying to {selectedCount} selected row{selectedCount !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-muted-foreground mb-4">
          Leave blank to keep each row's existing value unchanged.
        </p>

        <div className="space-y-3">
          {FIELD_CONFIG.map(({ label, key, options }) => (
            <div key={key}>
              <label className="text-[11px] font-medium text-foreground/80 block mb-1">{label}</label>
              <select
                value={bulkEdit[key] ?? ""}
                onChange={e => setBulkEdit(prev => ({ ...prev, [key]: e.target.value }))}
                className="w-full border border-border rounded-md bg-background px-2 py-1.5 text-[12px] focus:outline-none focus:ring-1 focus:ring-primary/40"
              >
                {options.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-5">
          <Button onClick={onApply} className="flex-1 h-8 text-[12px]">
            Apply to {selectedCount} row{selectedCount !== 1 ? "s" : ""}
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1 h-8 text-[12px]">
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}