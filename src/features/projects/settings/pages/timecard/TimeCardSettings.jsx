/**
 * TimecardSettingsPage.jsx
 *
 * Path: src/features/projects/settings/timecard/TimecardSettingsPage.jsx
 *
 * Connected version of the Timecard Settings UI.
 *
 * How it works:
 *   1. Reads projectId from Outlet context (SettingsLayout) with URL param fallback.
 *   2. Dispatches fetchTimecardSettingsThunk on mount / projectId change.
 *   3. Seeds all local state from Redux once the fetch resolves.
 *   4. Every field change:
 *        a) updates local state immediately (optimistic UI — no lag)
 *        b) dispatches updateTimecardSettingsThunk with the changed key(s)
 *   5. Shows a full-page skeleton on first load and an inline error banner
 *      on update failure.
 */

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useOutletContext } from "react-router-dom";

import { useTimecardSettings } from "./useTimecardSettings";

// ─── Reusable components (same imports as before) ─────────────────────────────
import CardWrapper             from "../../../../../shared/components/wrappers/CardWrapper";
import EditableSelectField     from "../../../../../shared/components/wrappers/EditableSelectField";
import EditableTextDataField   from "../../../../../shared/components/wrappers/EditableTextDataField";
import EditableToggleGroupField from "../../../../../shared/components/wrappers/EditableToggleGroupField";

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS = [
  { value: "MONDAY",    label: "Monday"    },
  { value: "TUESDAY",   label: "Tuesday"   },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY",  label: "Thursday"  },
  { value: "FRIDAY",    label: "Friday"    },
  { value: "SATURDAY",  label: "Saturday"  },
  { value: "SUNDAY",    label: "Sunday"    },
];

const CAM_OVERTIME_OPTIONS = [
  { value: "only_contracted", label: "Only when contracted hours have been completed" },
  { value: "regardless",      label: "Regardless of contracted hours"                 },
];

const BROKER_TURNAROUND_OPTIONS = [
  { value: "consecutive", label: "Only between consecutive work days (next day always resets)" },
  { value: "weekly_crew", label: "As per weekly crew"                                          },
];

const FIRST_DAY_TURNAROUND_OPTIONS = [
  { value: "11",    label: "11 hours"      },
  { value: "24",    label: "24 hours"      },
  { value: "24_11", label: "24 + 11 hours" },
];

const SECOND_DAY_TURNAROUND_OPTIONS = [
  { value: "11",    label: "11 hours"      },
  { value: "48",    label: "48 hours"      },
  { value: "48_11", label: "48 + 11 hours" },
];

const SIXTH_SEVENTH_DAY_OPTIONS = [
  { value: "consecutive", label: "Any consecutive block"      },
  { value: "week_reset",  label: "Reset on first day of week" },
];

const TRAVEL_DAY_OPTIONS = [
  { value: "resets",            label: "Resets day count"         },
  { value: "dont_reset_count",  label: "Don't reset, don't count" },
  { value: "dont_reset_count2", label: "Don't reset, count"       },
];

const POST_WRAP_GRACE_OPTIONS = [
  { value: "expected_wrap",  label: "Expected wrap"       },
  { value: "unit_wrap",      label: "Unit wrap"           },
  { value: "after_15_grace", label: "After 15 mins Grace" },
];

const POST_WRAP_CAM_OVERTIME_OPTIONS = [
  { value: "inclusive",     label: "Uses inclusive minutes"                  },
  { value: "ignores_after", label: "Ignores inclusive minutes after"         },
  { value: "ignores",       label: "Ignores inclusive minutes"               },
];

const DAWN_CALL_OPTIONS = [
  { value: "dawn_until_5am", label: "Apply dawn call until 5am then pre-call"                                         },
  { value: "dawn_and_pre",   label: "Apply dawn call and pre-call from in time (i.e. pay both for hours prior to 5am)" },
];

const DAWN_INCLUSIVE_OPTIONS = [
  { value: "uses_inclusive", label: "Uses inclusive minutes"                           },
  { value: "pre_call_only",  label: "Uses inclusive minutes for pre-call only"         },
  { value: "does_not_use",   label: "Does not use inclusive minutes prior to start of day" },
];

const TRAVEL_TIME_OPTIONS = [
  { value: "outside_all", label: "Travel time happens outside of all worked hours"     },
  { value: "reduces",     label: "Working hours are always reduced by the Travel time" },
];

const CAMERA_ROUNDING_OPTIONS = [
  { value: "every_15",             label: "Every 15 mins"                                              },
  { value: "every_15_then_hourly", label: "Every 15 mins until 2hrs, then hourly (per Film-PACT/BECTU)" },
  { value: "every_30",             label: "Every 30 mins"                                              },
  { value: "first_30_then_hourly", label: "First 30 mins then hourly (per TV PACT/BECTU)"              },
  { value: "hourly",               label: "Hourly"                                                     },
];

const OTHER_ROUNDING_OPTIONS = [
  { value: "every_15",              label: "Every 15 mins"                                                                                             },
  { value: "every_30",              label: "Every 30 mins"                                                                                             },
  { value: "hourly",                label: "Hourly"                                                                                                    },
  { value: "per_film_pact_2018",    label: "Per Film PACT/BECTU (2018)"                                                                                },
  { value: "cam_qt_hourly_2017",    label: "To Cam O/T, add each O/T element until >1 hour, then round further O/T elements in hours (Per TV PACT/BECTU (2017))" },
  { value: "cam_qt_pre_post_2019",  label: "To Cam O/T, add Pre then Post until >1 hour, then round Pre + Post in hours (Per TV PACT/BECTU guidance (2019))" },
  { value: "round_30_sum_2020a",    label: "Round to 30 mins, then sum Pre+Cam+Post), and round in hours (if >30 mins)"                                },
  { value: "dont_round_sum_2020",   label: "Don't round, sum all, then round to 0.5 (Per TV PACT/BECTU (2020))"                                        },
];

// ─── Default local state (mirrors model defaults) ─────────────────────────────

const DEFAULT_STATE = {
  // Section 1
  activeFrom:    "",
  weekEndingDay: "SUNDAY",

  // Section 2
  crewReminder:   { enabled: false, day: "MONDAY",    time: "09:00" },
  crewSubmission: { enabled: false, day: "WEDNESDAY", time: "17:00" },
  deptReminder:   { enabled: false, day: "THURSDAY",  time: "09:00" },
  deptApproval:   { enabled: false, day: "FRIDAY",    time: "17:00" },

  // Section 3
  stdHours:  { "10+1": false, "10.5+1": false, "11+1": false },
  semiHours: { "9+0.5": false, "9.5+0.5": false, "10+0.5": false, "10.5+0.5": false },
  contHours: { "9": false, "9.5": false, "10": false },
  cameraOvertimeSchedule: "only_contracted",

  // Section 4
  brokerTurnaround:         "consecutive",
  useOfficialRestDays:      false,
  firstRestDayTurnaround:   "24_11",
  secondRestDayTurnaround:  "48",
  sixthSeventhDayCount:     "consecutive",
  travelDay:                "resets",
  postWrapGracePeriodFrom:  "unit_wrap",
  postWrapCameraOvertime:   "inclusive",
  dawnCallPreCall:          "dawn_until_5am",
  dawnCallInclusiveMinutes: "pre_call_only",

  // Section 5
  crewApprovalPdfDisplay:  "auto",
  requireMealTimes:        false,
  onlyPrePostForTransport: false,
  travelTimeInclusion:     "outside_all",

  // Section 6
  cameraOvertimeRounding: "every_15",
  otherOvertimeRounding:  "every_15",

  // Section 7
  allowances: { BOX: false, COMPUTER: false, EQUIPMENT: false, MOBILE: false, SOFTWARE: false, VEHICLE: false },
};

// ─── Helpers: map Redux timecardSettings → local UI state ─────────────────────

/**
 * Maps the flat model fields that represent working-hours checkboxes
 * back to the grouped local state shape used by the UI.
 */
const mapWorkingHoursFromRedux = (wh = {}) => ({
  stdHours: {
    "10+1":   wh.std_10_1      ?? false,
    "10.5+1": wh.std_10_5_1   ?? false,
    "11+1":   wh.std_11_1     ?? false,
  },
  semiHours: {
    "9+0.5":   wh.semi_9_0_5    ?? false,
    "9.5+0.5": wh.semi_9_5_0_5 ?? false,
    "10+0.5":  wh.semi_10_0_5  ?? false,
    "10.5+0.5":wh.semi_10_5_0_5?? false,
  },
  contHours: {
    "9":   wh.cont_9   ?? false,
    "9.5": wh.cont_9_5 ?? false,
    "10":  wh.cont_10  ?? false,
  },
});

/**
 * Maps the full Redux timecardSettings object onto DEFAULT_STATE shape.
 * Falls back to defaults for any missing keys.
 */
const fromRedux = (ts) => {
  if (!ts) return DEFAULT_STATE;

  const st = ts.scheduledTasks ?? {};
  const wh = mapWorkingHoursFromRedux(ts.workingHours);

  return {
    activeFrom:    ts.activeFrom
      ? new Date(ts.activeFrom).toISOString().split("T")[0]
      : "",
    weekEndingDay: ts.weekEndingDay ?? "SUNDAY",

    crewReminder:   { ...DEFAULT_STATE.crewReminder,   ...(st.crewReminder   ?? {}) },
    crewSubmission: { ...DEFAULT_STATE.crewSubmission, ...(st.crewSubmission ?? {}) },
    deptReminder:   { ...DEFAULT_STATE.deptReminder,   ...(st.deptReminder   ?? {}) },
    deptApproval:   { ...DEFAULT_STATE.deptApproval,   ...(st.deptApproval   ?? {}) },

    stdHours:  wh.stdHours,
    semiHours: wh.semiHours,
    contHours: wh.contHours,
    cameraOvertimeSchedule: ts.cameraOvertimeSchedule ?? "only_contracted",

    brokerTurnaround:         ts.brokerTurnaround         ?? "consecutive",
    useOfficialRestDays:      ts.useOfficialRestDays       ?? false,
    firstRestDayTurnaround:   ts.firstRestDayTurnaround    ?? "24_11",
    secondRestDayTurnaround:  ts.secondRestDayTurnaround   ?? "48",
    sixthSeventhDayCount:     ts.sixthSeventhDayCount      ?? "consecutive",
    travelDay:                ts.travelDay                 ?? "resets",
    postWrapGracePeriodFrom:  ts.postWrapGracePeriodFrom   ?? "unit_wrap",
    postWrapCameraOvertime:   ts.postWrapCameraOvertime    ?? "inclusive",
    dawnCallPreCall:          ts.dawnCallPreCall            ?? "dawn_until_5am",
    dawnCallInclusiveMinutes: ts.dawnCallInclusiveMinutes  ?? "pre_call_only",

    crewApprovalPdfDisplay:  ts.crewApprovalPdfDisplay   ?? "auto",
    requireMealTimes:        ts.requireMealTimes          ?? false,
    onlyPrePostForTransport: ts.onlyPrePostForTransport   ?? false,
    travelTimeInclusion:     ts.travelTimeInclusion       ?? "outside_all",

    cameraOvertimeRounding: ts.cameraOvertimeRounding ?? "every_15",
    otherOvertimeRounding:  ts.otherOvertimeRounding  ?? "every_15",

    allowances: {
      BOX:       ts.publicHolidayAllowances?.BOX       ?? false,
      COMPUTER:  ts.publicHolidayAllowances?.COMPUTER  ?? false,
      EQUIPMENT: ts.publicHolidayAllowances?.EQUIPMENT ?? false,
      MOBILE:    ts.publicHolidayAllowances?.MOBILE    ?? false,
      SOFTWARE:  ts.publicHolidayAllowances?.SOFTWARE  ?? false,
      VEHICLE:   ts.publicHolidayAllowances?.VEHICLE   ?? false,
    },
  };
};

// ─── Local primitives (unchanged from original) ───────────────────────────────

function Section({ title, description, children }) {
  return (
    <CardWrapper title={title} description={description} showLabel className="mb-5">
      {children}
    </CardWrapper>
  );
}

function YesNo({ value, onChange, disabled }) {
  return (
    <div className={`inline-flex overflow-hidden rounded-lg border border-border ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`px-3 py-1 text-[10px] font-semibold tracking-widest transition-colors ${
          value ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"
        }`}
      >
        YES
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`px-3 py-1 text-[10px] font-semibold tracking-widest transition-colors ${
          !value ? "bg-red-50 text-red-600" : "bg-background text-muted-foreground"
        }`}
      >
        NO
      </button>
    </div>
  );
}

function CheckRow({ label, checked, onChange, disabled }) {
  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      className={`flex cursor-pointer select-none items-center gap-2 rounded-xl border px-3 py-2 mb-2 transition-colors ${
        checked ? "border-primary bg-primary/10" : "border-border bg-background"
      } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <div
        className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors ${
          checked ? "border-primary bg-primary" : "border-border bg-background"
        }`}
      >
        {checked && (
          <svg width="9" height="9" viewBox="0 0 9 9">
            <polyline
              points="1,4.5 3.5,7 8,2"
              fill="none"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span className={`text-xs font-medium ${checked ? "text-primary" : "text-muted-foreground"}`}>
        {label}
      </span>
    </div>
  );
}

function ScheduledRow({ label, enabled, onToggle, day, onDayChange, time, onTimeChange, disabled }) {
  return (
    <div className="border-b border-muted py-3 last:border-b-0 last:pb-0">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <YesNo value={enabled} onChange={onToggle} disabled={disabled} />
      </div>
      {enabled && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          <EditableSelectField
            label="Day"
            value={day}
            items={DAYS}
            isEditing
            onChange={onDayChange}
            isRequired={false}
          />
          <EditableTextDataField
            label="Time"
            value={time}
            isEditing
            onChange={onTimeChange}
            type="time"
            isRequired={false}
          />
        </div>
      )}
    </div>
  );
}

function SwitchRow({ label, value, onChange, disabled }) {
  return (
    <div className="flex items-center justify-between border-b border-muted py-3">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <YesNo value={value} onChange={onChange} disabled={disabled} />
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function FullPageSkeleton() {
  return (
    <div className="space-y-5">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div key={i} className="rounded-2xl border border-border p-5 animate-pulse">
          <div className="h-4 w-1/4 rounded bg-muted mb-4" />
          <div className="space-y-3">
            {[1, 2].map((j) => (
              <div key={j} className="h-10 rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TimecardSettingsPage() {

  // ── 1. Resolve projectId ──────────────────────────────────────────────────
  const outletContext     = useOutletContext() ?? {};
  const contextProjectId  = outletContext.projectId ?? null;
  const { projectId: paramProjectId } = useParams();
  const projectId = contextProjectId ?? paramProjectId ?? null;

  // ── 2. Redux wiring ───────────────────────────────────────────────────────
  const {
    timecardSettings,
    isFetching,
    isUpdating,
    error,
    fetchTimecardSettings,
    updateTimecardSettings,
    clearError,
  } = useTimecardSettings();

  // ── 3. Local UI state (seeded from Redux after fetch) ─────────────────────
  const [form, setForm]     = useState(DEFAULT_STATE);
  const seededRef           = useRef(false);   // prevent re-seeding on every render

  // Seed local state once Redux data arrives
  useEffect(() => {
    if (timecardSettings && !seededRef.current) {
      setForm(fromRedux(timecardSettings));
      seededRef.current = true;
    }
  }, [timecardSettings]);

  // Re-seed if projectId changes (user navigates to a different project)
  useEffect(() => {
    seededRef.current = false;
  }, [projectId]);

  // ── 4. Fetch on mount ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!projectId || projectId === "undefined") return;
    fetchTimecardSettings(projectId);
  }, [fetchTimecardSettings, projectId]);

  // ── 5. Generic field-change helper ───────────────────────────────────────
  /**
   * Updates local state immediately and fires a PATCH to the backend.
   *
   * @param {object} localPatch  — shape matching our local form state
   * @param {object} apiPayload  — shape matching the backend schema (may differ)
   *                               Defaults to localPatch when shapes are identical.
   */
  const handleChange = useCallback(
    (localPatch, apiPayload) => {
      setForm((prev) => ({ ...prev, ...localPatch }));
      if (!projectId) return;
      updateTimecardSettings(projectId, apiPayload ?? localPatch);
    },
    [projectId, updateTimecardSettings]
  );

  // ── Guards ────────────────────────────────────────────────────────────────
  if (!projectId || projectId === "undefined") {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-muted-foreground">No project selected.</p>
      </div>
    );
  }

  if (isFetching && !timecardSettings) {
    return <FullPageSkeleton />;
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto">

      {/* ── Top bar ── */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
          ✦ Filter Timecard Settings
        </button>
        <span className="text-xs text-muted-foreground">Based on Project Type: Feature Film</span>
        {isUpdating && (
          <span className="text-xs text-muted-foreground animate-pulse">Saving…</span>
        )}
      </div>

      {/* Inline update-error banner */}
      {error && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <span className="text-xs text-red-600">{error.message ?? "Update failed"}</span>
          <button onClick={clearError} className="text-xs font-semibold text-red-600 hover:underline ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* ── 1. Timecards ── */}
      <Section title="Timecards" description="Configure when timecards are active and the payroll week cycle.">
        <div className="grid grid-cols-2 gap-4">
          <EditableTextDataField
            label="Timecards active from"
            value={form.activeFrom}
            isEditing
            onChange={(v) =>
              handleChange(
                { activeFrom: v },
                { activeFrom: v || null }
              )
            }
            placeholder="dd-mm-yyyy"
            type="date"
            isRequired={false}
          />
          <EditableSelectField
            label="Week ending day"
            value={form.weekEndingDay}
            items={DAYS}
            isEditing
            onChange={(v) => handleChange({ weekEndingDay: v })}
            isRequired={false}
          />
        </div>
      </Section>

      {/* ── 2. Scheduled Tasks ── */}
      <Section title="Scheduled tasks" description="Reminder and deadline notifications sent to crew.">
        {[
          { label: "CREW REMINDER",               key: "crewReminder"   },
          { label: "CREW SUBMISSION DEADLINE",     key: "crewSubmission" },
          { label: "DEPARTMENT REMINDER",          key: "deptReminder"   },
          { label: "DEPARTMENT APPROVAL DEADLINE", key: "deptApproval"   },
        ].map(({ label, key }) => (
          <ScheduledRow
            key={key}
            label={label}
            enabled={form[key].enabled}
            onToggle={(v) => {
              const updated = { ...form[key], enabled: v };
              handleChange(
                { [key]: updated },
                { scheduledTasks: { [key]: updated } }
              );
            }}
            day={form[key].day}
            onDayChange={(v) => {
              const updated = { ...form[key], day: v };
              handleChange(
                { [key]: updated },
                { scheduledTasks: { [key]: updated } }
              );
            }}
            time={form[key].time}
            onTimeChange={(v) => {
              const updated = { ...form[key], time: v };
              handleChange(
                { [key]: updated },
                { scheduledTasks: { [key]: updated } }
              );
            }}
            disabled={isUpdating}
          />
        ))}
      </Section>

      {/* ── 3. Working Hours ── */}
      <Section
        title="Working hours"
        description="The variations of your standard working hours. Selections will be made available in the Calendar."
      >
        <div className="mb-5 grid grid-cols-3 gap-4">

          {/* Standard */}
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Standard working day
            </p>
            {[
              ["10+1",   "std_10_1",   "Standard working day: 10 + 1"  ],
              ["10.5+1", "std_10_5_1", "Standard working day: 10.5 + 1"],
              ["11+1",   "std_11_1",   "Standard working day: 11 + 1"  ],
            ].map(([uiKey, modelKey, lbl]) => (
              <CheckRow
                key={uiKey}
                label={lbl}
                checked={form.stdHours[uiKey]}
                onChange={(v) =>
                  handleChange(
                    { stdHours: { ...form.stdHours, [uiKey]: v } },
                    { workingHours: { [modelKey]: v } }
                  )
                }
                disabled={isUpdating}
              />
            ))}
          </div>

          {/* Semi-continuous */}
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Semi-continuous working day
            </p>
            {[
              ["9+0.5",    "semi_9_0_5",    "Semi-continuous working day: 9 + 0.5"  ],
              ["9.5+0.5",  "semi_9_5_0_5",  "Semi-continuous working day: 9.5 + 0.5"],
              ["10+0.5",   "semi_10_0_5",   "Semi-continuous working day: 10 + 0.5" ],
              ["10.5+0.5", "semi_10_5_0_5", "Semi-continuous working day: 10.5 + 0.5"],
            ].map(([uiKey, modelKey, lbl]) => (
              <CheckRow
                key={uiKey}
                label={lbl}
                checked={form.semiHours[uiKey]}
                onChange={(v) =>
                  handleChange(
                    { semiHours: { ...form.semiHours, [uiKey]: v } },
                    { workingHours: { [modelKey]: v } }
                  )
                }
                disabled={isUpdating}
              />
            ))}
          </div>

          {/* Continuous */}
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Continuous working day
            </p>
            {[
              ["9",   "cont_9",   "Continuous working day: 9"  ],
              ["9.5", "cont_9_5", "Continuous working day: 9.5"],
              ["10",  "cont_10",  "Continuous working day: 10" ],
            ].map(([uiKey, modelKey, lbl]) => (
              <CheckRow
                key={uiKey}
                label={lbl}
                checked={form.contHours[uiKey]}
                onChange={(v) =>
                  handleChange(
                    { contHours: { ...form.contHours, [uiKey]: v } },
                    { workingHours: { [modelKey]: v } }
                  )
                }
                disabled={isUpdating}
              />
            ))}
          </div>
        </div>

        <EditableSelectField
          label="On an Extended working day, pay the Scheduled camera overtime:"
          value={form.cameraOvertimeSchedule}
          items={CAM_OVERTIME_OPTIONS}
          isEditing
          onChange={(v) => handleChange({ cameraOvertimeSchedule: v })}
          isRequired={false}
        />
      </Section>

      {/* ── 4. Rules ── */}
      <Section title="Rules" description="Overtime, turnaround, and penalty calculation rules.">

        <div className="mb-4">
          <EditableSelectField
            label="Calculates broker turnaround for dailies"
            infoPillDescription="How consecutive working days are calculated for daily hires"
            value={form.brokerTurnaround}
            items={BROKER_TURNAROUND_OPTIONS}
            isEditing
            onChange={(v) => handleChange({ brokerTurnaround: v })}
            isRequired={false}
          />
        </div>

        <SwitchRow
          label='USE "OFFICIAL REST DAYS" IN CALENDAR'
          value={form.useOfficialRestDays}
          onChange={(v) => handleChange({ useOfficialRestDays: v })}
          disabled={isUpdating}
        />

        <div className="mt-4 grid grid-cols-2 gap-4">

          <EditableSelectField
            label="1st rest day turnaround period"
            infoPillDescription="Turnaround hours applied after first rest day"
            value={form.firstRestDayTurnaround}
            items={FIRST_DAY_TURNAROUND_OPTIONS}
            isEditing
            onChange={(v) => handleChange({ firstRestDayTurnaround: v })}
            isRequired={false}
          />

          <EditableSelectField
            label="2nd rest day turnaround period"
            infoPillDescription="Turnaround hours applied after second consecutive rest day"
            value={form.secondRestDayTurnaround}
            items={SECOND_DAY_TURNAROUND_OPTIONS}
            isEditing
            onChange={(v) => handleChange({ secondRestDayTurnaround: v })}
            isRequired={false}
          />

          <EditableSelectField
            label="6th & 7th day count"
            infoPillDescription="When the 6th and 7th day penalty is triggered"
            value={form.sixthSeventhDayCount}
            items={SIXTH_SEVENTH_DAY_OPTIONS}
            isEditing
            onChange={(v) => handleChange({ sixthSeventhDayCount: v })}
            isRequired={false}
          />

          <EditableSelectField
            label="Travel day"
            infoPillDescription="How travel days affect consecutive day count"
            value={form.travelDay}
            items={TRAVEL_DAY_OPTIONS}
            isEditing
            onChange={(v) => handleChange({ travelDay: v })}
            isRequired={false}
          />

          <EditableSelectField
            label="Post wrap overtime after Grace period applicable from"
            infoPillDescription="When the grace period starts for post-wrap overtime calculation"
            value={form.postWrapGracePeriodFrom}
            items={POST_WRAP_GRACE_OPTIONS}
            isEditing
            onChange={(v) => handleChange({ postWrapGracePeriodFrom: v })}
            isRequired={false}
          />

          <EditableSelectField
            label="Post wrap overtime after Camera overtime"
            infoPillDescription="How inclusive minutes are applied after camera overtime"
            value={form.postWrapCameraOvertime}
            items={POST_WRAP_CAM_OVERTIME_OPTIONS}
            isEditing
            onChange={(v) => handleChange({ postWrapCameraOvertime: v })}
            isRequired={false}
          />

          <EditableSelectField
            label="Dawn call and Pre-call"
            value={form.dawnCallPreCall}
            items={DAWN_CALL_OPTIONS}
            isEditing
            onChange={(v) => handleChange({ dawnCallPreCall: v })}
            isRequired={false}
          />

          <EditableSelectField
            label="Dawn call and Inclusive minutes"
            value={form.dawnCallInclusiveMinutes}
            items={DAWN_INCLUSIVE_OPTIONS}
            isEditing
            onChange={(v) => handleChange({ dawnCallInclusiveMinutes: v })}
            isRequired={false}
          />
        </div>
      </Section>

      {/* ── 5. Preferences ── */}
      <Section title="Preferences" description="Timecard display and behaviour preferences.">

        <div className="mb-4">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            If a timecard is automatically submitted, in the 'crew approval' on the PDF, show
          </p>
          <EditableToggleGroupField
            value={form.crewApprovalPdfDisplay}
            items={[
              { value: "auto",          label: "Auto"                   },
              { value: "dept_approver", label: "pp Department Approver" },
            ]}
            type="single"
            isEditing
            onChange={(v) => handleChange({ crewApprovalPdfDisplay: v })}
            isRequired={false}
          />
        </div>

        <SwitchRow
          label="REQUIRE MEAL START AND END TIMES TO BE ENTERED ON TIMECARDS?"
          value={form.requireMealTimes}
          onChange={(v) => handleChange({ requireMealTimes: v })}
          disabled={isUpdating}
        />

        <SwitchRow
          label="ONLY APPLY PRE AND POST OVERTIME FOR TRANSPORT DEPARTMENT SPECIFIC OFFERS"
          value={form.onlyPrePostForTransport}
          onChange={(v) => handleChange({ onlyPrePostForTransport: v })}
          disabled={isUpdating}
        />
        {form.onlyPrePostForTransport && (
          <p className="mb-3 text-[11px] text-muted-foreground">
            When inactive all overtime and penalties will apply.
          </p>
        )}

        <div className="mt-4">
          <EditableSelectField
            label="When including Travel time in your scheduled shooting day:"
            infoPillDescription="How travel time is positioned relative to your scheduled working hours"
            value={form.travelTimeInclusion}
            items={TRAVEL_TIME_OPTIONS}
            isEditing
            onChange={(v) => handleChange({ travelTimeInclusion: v })}
            isRequired={false}
          />
        </div>
      </Section>

      {/* ── 6. Roundings ── */}
      <Section title="Roundings" description="How overtime periods are rounded for calculation.">
        <div className="grid grid-cols-2 gap-4">

          <EditableSelectField
            label="Camera overtime rounding"
            value={form.cameraOvertimeRounding}
            items={CAMERA_ROUNDING_OPTIONS}
            isEditing
            onChange={(v) => handleChange({ cameraOvertimeRounding: v })}
            isRequired={false}
          />

          <EditableSelectField
            label="Other overtime rounding"
            value={form.otherOvertimeRounding}
            items={OTHER_ROUNDING_OPTIONS}
            isEditing
            onChange={(v) => handleChange({ otherOvertimeRounding: v })}
            isRequired={false}
          />
        </div>
      </Section>

      {/* ── 7. Allowances ── */}
      <Section title="Allowances" description="Allowances to be paid when Public Holiday is not worked.">
        <div className="grid grid-cols-3 gap-3">
          {Object.keys(form.allowances).map((key) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-xl border border-border bg-muted px-3 py-2"
            >
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {key}
              </span>
              <YesNo
                value={form.allowances[key]}
                onChange={(v) =>
                  handleChange(
                    { allowances: { ...form.allowances, [key]: v } },
                    { publicHolidayAllowances: { [key]: v } }
                  )
                }
                disabled={isUpdating}
              />
            </div>
          ))}
        </div>
      </Section>

    </div>
  );
}