/**
 * AppSettings.jsx
 * Path: src/features/projects/settings/pages/AppSettings.jsx
 */

import { useState, useCallback, useEffect } from "react";
import { useOutletContext }                 from "react-router-dom";
import { Loader2 }                          from "lucide-react";

import CardWrapper         from "@/shared/components/wrappers/CardWrapper";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import { Switch }          from "@/shared/components/ui/switch";
import { useAppSettings }  from "./useAppSettings";

// ── Constants ─────────────────────────────────────────────────────────────────
const APP_LABELS = {
  CALENDAR:           "Calendar",
  CALL_SHEETS:        "Call Sheets",
  SHOOTING_SCHEDULE:  "Shooting Schedule",
  ASSET:              "Asset",
  COSTUME:            "Costume",
  CATERING:           "Catering",
  ACCOUNTS:           "Accounts",
  SCRIPT:             "Script",
  MARKET:             "Market",
  TRANSPORT:          "Transport",
  E_PLAYER:           "E Player",
  FORMS:              "Forms",
  PROPS:              "Props",
  ANIMALS:            "Animals",
  VEHICLES:           "Vehicles",
  LOCATIONS:          "Locations",
  CLOUD:              "Cloud",
  TIMESHEETS:         "Timesheets",
  NOTICE_BOARD:       "Notice Board",
  PROJECT_CHAT:       "Project Chat",
  SCRIPT_BREAKDOWN:   "Script Breakdown",
  PRODUCTION_REPORTS: "Production Reports",
  CASTING_CALLS:      "Casting Calls",
  CREW:               "Crew",
  CAST:               "Cast",
  SCHEDULE:           "Schedule",
  BUDGET:             "Budget",
  DOCUMENTS:          "Documents",
  EAARTH_SIGN:        "Eaarth Sign",
};

const ACCESS_ITEMS = [
  { label: "ALL",    value: "ALL"    },
  { label: "ADMIN",  value: "ADMIN"  },
  { label: "CUSTOM", value: "CUSTOM" },
];

function AppSettings() {
  const { projectId } = useOutletContext();

  const { apps, isFetching, isUpdating, error, updateApp } =
    useAppSettings(projectId);

  // ── Optimistic local state ────────────────────────────────────────────────
  const [localApps, setLocalApps] = useState([]);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (apps?.length) setLocalApps(apps.map((a) => ({ ...a })));
  }, [apps]);

  // ── Auto-save with optimistic update ─────────────────────────────────────
  const autoSave = useCallback(async (appName, field, value) => {
    setSaveError(null);

    // 1. Optimistic update
    setLocalApps((prev) =>
      prev.map((a) =>
        a.appName === appName ? { ...a, [field]: value } : a
      )
    );

    // 2. Persist
    try {
      await updateApp(appName, field, value).unwrap();
    } catch (err) {
      setSaveError(err?.message ?? "Save failed. Please try again.");
      // 3. Rollback
      setLocalApps((prev) =>
        prev.map((a) =>
          a.appName === appName
            ? { ...a, [field]: apps.find((x) => x.appName === appName)?.[field] ?? a[field] }
            : a
        )
      );
    }
  }, [updateApp, apps]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isFetching && !localApps.length) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm gap-2">
        <Loader2 size={16} className="animate-spin" />
        Loading app settings…
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {(error || saveError) && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-xs text-destructive">
          {saveError ?? (typeof error === "string" ? error : error?.message) ?? "Something went wrong."}
        </div>
      )}

      <CardWrapper showLabel={false}>

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
            <div>
              <h3 className="text-foreground text-sm font-medium">
                App Visibility &amp; Notifications
              </h3>
              <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                Control access and notification settings per app
              </p>
            </div>
          </div>
          {isUpdating && (
            <div className="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
              <Loader2 size={11} className="animate-spin" /> Auto-saving changes
            </div>
          )}
        </div>

        {/* ── Table header ── */}
        <div className="grid grid-cols-[1fr_auto_auto_160px] items-center gap-6 px-2 pb-2 border-b border-border">
          <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
            App
          </span>
          <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground w-12 text-center">
            Enabled
          </span>
          <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground w-12 text-center">
            Notifs
          </span>
          <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground text-center">
            Access
          </span>
        </div>

        {/* ── Rows ── */}
        <div className="divide-y divide-border">
          {localApps.map((app) => (
            <div
              key={app.appName}
              className="grid grid-cols-[1fr_auto_auto_160px] items-center gap-6 px-2 py-3"
            >
              {/* App name */}
              <span className="text-[0.75rem] font-medium uppercase tracking-wider text-foreground">
                {APP_LABELS[app.appName] ?? app.appName}
              </span>

              {/* Enabled switch */}
              <div className="w-12 flex justify-center">
                <Switch
                  checked={app.enabled}
                  onCheckedChange={(val) => autoSave(app.appName, "enabled", val)}
                />
              </div>

              {/* Notifs switch */}
              <div className="w-12 flex justify-center">
                <Switch
                  checked={app.notifs}
                  onCheckedChange={(val) => autoSave(app.appName, "notifs", val)}
                />
              </div>

              {/* Access dropdown */}
              <EditableSelectField
                label=""
                value={app.access}
                items={ACCESS_ITEMS}
                isEditing={true}
                isRequired={false}
                textCase="upper"
                onChange={(val) => autoSave(app.appName, "access", val)}
              />
            </div>
          ))}
        </div>

      </CardWrapper>
    </div>
  );
}

export default AppSettings;