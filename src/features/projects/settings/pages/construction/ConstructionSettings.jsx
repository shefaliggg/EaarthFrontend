/**
 * ConstructionSettings.jsx
 * Auto-save on change — no Save/Cancel buttons needed.
 */

import { useState, useCallback } from "react";
import { useOutletContext }       from "react-router-dom";
import { Loader2 }               from "lucide-react";

import CardWrapper         from "@/shared/components/wrappers/CardWrapper";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableSwitchField from "@/shared/components/wrappers/EditableSwitchField";

import { useConstructionSettings } from "./useConstructionSettings";

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULTS = {
  dailyRate:        { rateCardOption: "add_holiday_pay", standardWorkingHours: "12_continuous" },
  breaks:           { breakDuration: "1_5" },
  sixthDay:         { rateCalculation: "multiply_4_3", rateApply: "consecutive_days", ratePayment: "daily", holidayPayApplication: "pay_net_no_holiday" },
  seventhDay:       { rateCalculation: "multiply_1_5", ratePayment: "daily", payUnsocialHours: false, holidayPayApplication: "pay_net_no_holiday" },
  overtime:         { rateCalculation: "multiply_1_5", caps: "match_rate_card", holidayPayApplication: "pay_net_no_holiday", applyUnsocialHours: "pact_bectu" },
  travelTime:       { travelTimePaid: false },
  brokenTurnaround: { brokenTurnaroundPaid: false },
};

const hasPersistedData = (d) => !!d && Object.keys(d).length > 0;

// ─── SectionCard ──────────────────────────────────────────────────────────────

function SectionCard({ title, description, savingField, children }) {
  return (
    <CardWrapper showLabel={false}>
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
          <div>
            <h3 className="text-foreground text-sm font-medium">{title}</h3>
            <p className="text-muted-foreground text-[0.7rem] mt-0.5">{description}</p>
          </div>
        </div>
        {/* Subtle saving indicator */}
        {savingField && (
          <div className="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
            <Loader2 size={11} className="animate-spin" />
            Saving…
          </div>
        )}
      </div>
      {children}
    </CardWrapper>
  );
}

// ─── ConstructionSettings ─────────────────────────────────────────────────────

function ConstructionSettings() {
  const { projectId } = useOutletContext();

  const {
    settings,
    isFetching,
    error: globalError,
    updateSection,
  } = useConstructionSettings(projectId);

  // Track which field is currently saving: "section.field" or null
  const [savingField, setSavingField] = useState(null);
  const [saveError,   setSaveError]   = useState(null);

  // ── Auto-save on change ───────────────────────────────────────────────────
  //
  // When a field changes we immediately PATCH the whole section with the
  // merged update.  The section data in Redux updates on fulfilled so the
  // UI reflects the new value without any local state needed.

  const handleChange = useCallback(
    async (section, field, value) => {
      const key = `${section}.${field}`;
      setSavingField(key);
      setSaveError(null);

      const current = hasPersistedData(settings?.[section])
        ? settings[section]
        : DEFAULTS[section];

      const updated = { ...current, [field]: value };

      try {
        await updateSection(section, updated).unwrap();
      } catch (err) {
        setSaveError(err?.message ?? "Save failed. Please try again.");
      } finally {
        setSavingField(null);
      }
    },
    [settings, updateSection]
  );

  // ── Value helper ──────────────────────────────────────────────────────────

  const val = useCallback(
    (section) =>
      hasPersistedData(settings?.[section])
        ? settings[section]
        : DEFAULTS[section],
    [settings]
  );

  // ── Loading ───────────────────────────────────────────────────────────────

  if (isFetching && !settings) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm gap-2">
        <Loader2 size={16} className="animate-spin" />
        Loading construction settings…
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">

      {globalError && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-xs text-destructive">
          {globalError?.message ?? "Something went wrong. Please try again."}
        </div>
      )}
      {saveError && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-xs text-destructive">
          {saveError}
        </div>
      )}

      {/* ── Daily Rate & Hours ── */}
      <SectionCard
        title="Daily Rate & Hours"
        description="PACT/BECTU rate card and standard working hours for construction crew"
        savingField={savingField?.startsWith("dailyRate")}
      >
        <EditableSelectField
          label="Use PACT/BECTU Rate card for Daily rate?"
          value={val("dailyRate").rateCardOption}
          isEditing={true}
          items={[
            { label: "Add holiday pay to net rate on Rate card",        value: "add_holiday_pay"     },
            { label: "Extract holiday pay from gross rate on Rate card", value: "extract_holiday_pay" },
            { label: "Don't use Rate card",                              value: "dont_use"            },
          ]}
          onChange={(v) => handleChange("dailyRate", "rateCardOption", v)}
        />
        <div className="mt-4">
          <EditableSelectField
            label="Default standard working hours"
            value={val("dailyRate").standardWorkingHours}
            isEditing={true}
            items={[
              { label: "12 hours (continuous)", value: "12_continuous" },
              { label: "12 hours",   value: "12"   }, { label: "11 hours",   value: "11"   },
              { label: "10.5 hours", value: "10_5" }, { label: "10 hours",   value: "10"   },
              { label: "9 hours",    value: "9"    }, { label: "8 hours",    value: "8"    },
              { label: "7.5 hours",  value: "7_5"  }, { label: "7 hours",    value: "7"    },
              { label: "6 hours",    value: "6"    }, { label: "5 hours",    value: "5"    },
              { label: "4 hours",    value: "4"    }, { label: "3 hours",    value: "3"    },
              { label: "2 hours",    value: "2"    }, { label: "1 hour",     value: "1"    },
            ]}
            onChange={(v) => handleChange("dailyRate", "standardWorkingHours", v)}
            infoPillDescription="Excluding breaks"
          />
        </div>
      </SectionCard>

      {/* ── Breaks ── */}
      <SectionCard
        title="Breaks"
        description="Duration of unpaid break periods"
        savingField={savingField?.startsWith("breaks")}
      >
        <EditableSelectField
          label="Break Duration"
          value={val("breaks").breakDuration}
          isEditing={true}
          items={[
            { label: "1.5 Hours", value: "1_5" },
            { label: "1 Hour",    value: "1"   },
            { label: "0.5 Hour",  value: "0_5" },
          ]}
          onChange={(v) => handleChange("breaks", "breakDuration", v)}
          infoPillDescription="The PACT/BECTU Agreement specifies a 30 minute unpaid morning break and unpaid lunch of 1 hour."
        />
      </SectionCard>

      {/* ── 6th Day ── */}
      <SectionCard
        title="6th Day"
        description="Rate calculation, applicability, and payment rules for 6th consecutive day"
        savingField={savingField?.startsWith("sixthDay")}
      >
        <EditableSelectField
          label="6th day rate calculation"
          value={val("sixthDay").rateCalculation}
          isEditing={true}
          items={[
            { label: "Multiply net daily by 4/3",  value: "multiply_4_3"         },
            { label: "Match PACT/BECTU Rate card",  value: "match_rate_card"      },
            { label: "Use different multiplier",    value: "different_multiplier" },
            { label: "Enter own rate in offer",     value: "own_rate"             },
          ]}
          onChange={(v) => handleChange("sixthDay", "rateCalculation", v)}
        />
        <div className="mt-4">
          <EditableSelectField
            label="When does 6th day rate apply?"
            value={val("sixthDay").rateApply}
            isEditing={true}
            items={[
              { label: "Consecutive working days",              value: "consecutive_days" },
              { label: "The 6th day worked in a timecard week", value: "timecard_week"    },
              { label: "Weekend days",                          value: "weekend_days"     },
            ]}
            onChange={(v) => handleChange("sixthDay", "rateApply", v)}
          />
        </div>
        <div className="mt-4">
          <EditableSelectField
            label="6th day rate payment"
            value={val("sixthDay").ratePayment}
            isEditing={true}
            items={[
              { label: "Daily",  value: "daily"  },
              { label: "Hourly", value: "hourly" },
            ]}
            onChange={(v) => handleChange("sixthDay", "ratePayment", v)}
          />
        </div>
        <div className="mt-4">
          <EditableSelectField
            label="Holiday pay application"
            value={val("sixthDay").holidayPayApplication}
            isEditing={true}
            items={[
              { label: "Pay net, don't calculate holiday pay (per PACT/BECTU)", value: "pay_net_no_holiday"   },
              { label: "Pay net, calculate holiday pay",                        value: "pay_net_with_holiday" },
              { label: "Pay gross",                                             value: "pay_gross"            },
            ]}
            onChange={(v) => handleChange("sixthDay", "holidayPayApplication", v)}
          />
        </div>
      </SectionCard>

      {/* ── 7th Day ── */}
      <SectionCard
        title="7th Day"
        description="Rate calculation, payment, and unsocial hours for 7th consecutive day"
        savingField={savingField?.startsWith("seventhDay")}
      >
        <EditableSelectField
          label="7th day rate calculation"
          value={val("seventhDay").rateCalculation}
          isEditing={true}
          items={[
            { label: "Multiply net daily by 1.5", value: "multiply_1_5"         },
            { label: "Match PACT/BECTU Rate card", value: "match_rate_card"      },
            { label: "Use different multiplier",   value: "different_multiplier" },
            { label: "Enter own rate in offer",    value: "own_rate"             },
          ]}
          onChange={(v) => handleChange("seventhDay", "rateCalculation", v)}
        />
        <div className="mt-4">
          <EditableSelectField
            label="7th day rate payment"
            value={val("seventhDay").ratePayment}
            isEditing={true}
            items={[
              { label: "Daily",  value: "daily"  },
              { label: "Hourly", value: "hourly" },
            ]}
            onChange={(v) => handleChange("seventhDay", "ratePayment", v)}
          />
        </div>
        <div className="mt-4">
          <EditableSwitchField
            label="Pay Unsocial Hours 2 for all hours worked on 7th day?"
            checked={val("seventhDay").payUnsocialHours}
            isEditing={true}
            onChange={(v) => handleChange("seventhDay", "payUnsocialHours", v)}
          />
        </div>
        <div className="mt-4">
          <EditableSelectField
            label="Holiday pay application"
            value={val("seventhDay").holidayPayApplication}
            isEditing={true}
            items={[
              { label: "Pay net, don't calculate holiday pay (per PACT/BECTU)", value: "pay_net_no_holiday"   },
              { label: "Pay net, calculate holiday pay",                        value: "pay_net_with_holiday" },
              { label: "Pay gross",                                             value: "pay_gross"            },
            ]}
            onChange={(v) => handleChange("seventhDay", "holidayPayApplication", v)}
          />
        </div>
      </SectionCard>

      {/* ── Overtime ── */}
      <SectionCard
        title="Overtime"
        description="Overtime rate calculation, caps, holiday pay, and unsocial hours"
        savingField={savingField?.startsWith("overtime")}
      >
        <EditableSelectField
          label="O/T rate calculation"
          value={val("overtime").rateCalculation}
          isEditing={true}
          items={[
            { label: "Multiply net hourly by 1.5",                     value: "multiply_1_5"          },
            { label: "1.5x gross hourly rate then extract holiday pay", value: "gross_extract_holiday" },
            { label: "Match PACT/BECTU Rate card",                      value: "match_rate_card"       },
            { label: "Use different multiplier",                        value: "different_multiplier"  },
            { label: "Enter own rate in offer",                         value: "own_rate"              },
          ]}
          onChange={(v) => handleChange("overtime", "rateCalculation", v)}
        />
        <div className="mt-4">
          <EditableSelectField
            label="O/T caps"
            value={val("overtime").caps}
            isEditing={true}
            items={[
              { label: "Match PACT/BECTU Rate card", value: "match_rate_card" },
              { label: "Other cap",                  value: "other_cap"       },
              { label: "No cap",                     value: "no_cap"          },
            ]}
            onChange={(v) => handleChange("overtime", "caps", v)}
          />
        </div>
        <div className="mt-4">
          <EditableSelectField
            label="Holiday pay application"
            value={val("overtime").holidayPayApplication}
            isEditing={true}
            items={[
              { label: "Pay net, don't calculate holiday pay (per PACT/BECTU)", value: "pay_net_no_holiday"   },
              { label: "Pay net, calculate holiday pay",                        value: "pay_net_with_holiday" },
              { label: "Pay gross",                                             value: "pay_gross"            },
            ]}
            onChange={(v) => handleChange("overtime", "holidayPayApplication", v)}
          />
        </div>
        <div className="mt-4">
          <EditableSelectField
            label="Apply unsocial hours"
            value={val("overtime").applyUnsocialHours}
            isEditing={true}
            items={[
              { label: "Per PACT/BECTU Agreement", value: "pact_bectu" },
              { label: "Custom unsocial hours",    value: "custom"     },
              { label: "Don't apply",              value: "dont_apply" },
            ]}
            onChange={(v) => handleChange("overtime", "applyUnsocialHours", v)}
          />
        </div>
      </SectionCard>

      {/* ── Travel Time ── */}
      <SectionCard
        title="Travel Time"
        description="Whether travel time is paid for construction crew"
        savingField={savingField?.startsWith("travelTime")}
      >
        <EditableSwitchField
          label="Travel time paid?"
          checked={val("travelTime").travelTimePaid}
          isEditing={true}
          onChange={(v) => handleChange("travelTime", "travelTimePaid", v)}
        />
      </SectionCard>

      {/* ── Broken Turnaround ── */}
      <SectionCard
        title="Broken Turnaround"
        description="Whether broken turnaround time is compensated"
        savingField={savingField?.startsWith("brokenTurnaround")}
      >
        <EditableSwitchField
          label="Broken turnaround paid?"
          checked={val("brokenTurnaround").brokenTurnaroundPaid}
          isEditing={true}
          onChange={(v) => handleChange("brokenTurnaround", "brokenTurnaroundPaid", v)}
        />
      </SectionCard>

    </div>
  );
}

export default ConstructionSettings;