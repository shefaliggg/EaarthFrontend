/**
 * CustomSettingsPage.jsx
 *
 * Path: customSettings/pages/CustomSettingsPage.jsx
 *
 * Page root for the Custom Settings tab inside SettingsLayout.
 *
 * Responsibilities:
 *   1. Resolve projectId (from Outlet context first, URL param as fallback).
 *   2. Dispatch fetchCustomSettingsThunk on mount / projectId change.
 *   3. Show a full-page skeleton while the first fetch is in flight.
 *   4. Show a full-page error + retry button when the fetch fails and
 *      there is no cached data to display.
 *   5. Compose the four section components once data is available.
 */

import React, { useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";

import { useCustomSettings } from "./useCustomSettings";

import CustomDayTypes           from "./components/CustomDayTypes";
import UpgradeRoles             from "./components/UpgradeRoles";
import PennyContractSettings    from "./components/PennyContractSettings";
import DailyAllowancesOverrides from "./components/DailyAllowancesOverrides";

// ─── Local helpers ────────────────────────────────────────────────────────────

function FullPageSkeleton() {
  return (
    <div className="space-y-5">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-border p-5 animate-pulse"
        >
          <div className="h-4 w-1/4 rounded bg-muted mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-10 rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FullPageError({ message, onRetry }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">
      <span className="text-xs text-red-600">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-semibold text-red-600 hover:underline ml-4"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function CustomSettingsPage() {
  // ── 1. Resolve projectId ─────────────────────────────────────────────────
  const outletContext    = useOutletContext() ?? {};
  const contextProjectId = outletContext.projectId ?? null;
  const { projectId: paramProjectId } = useParams();

  // Prefer outlet context (set by SettingsLayout); fall back to URL param
  const projectId = contextProjectId ?? paramProjectId ?? null;

  // ── 2. Redux wiring ───────────────────────────────────────────────────────
  const {
    customSettings,
    isFetching,
    error,
    fetchCustomSettings,
  } = useCustomSettings();

  // ── 3. Fetch on mount / projectId change ──────────────────────────────────
  useEffect(() => {
    if (!projectId || projectId === "undefined") return;
    fetchCustomSettings(projectId);
  }, [fetchCustomSettings, projectId]);

  // ── Guard: missing / invalid projectId ───────────────────────────────────
  if (!projectId || projectId === "undefined") {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-muted-foreground">No project selected.</p>
      </div>
    );
  }

  // ── Full-page loading skeleton on first fetch ─────────────────────────────
  if (isFetching && !customSettings) {
    return <FullPageSkeleton />;
  }

  // ── Full-page error (no cached data at all) ───────────────────────────────
  if (error && !customSettings) {
    return (
      <FullPageError
        message={`Failed to load custom settings: ${error.message}`}
        onRetry={() => fetchCustomSettings(projectId)}
      />
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div>
      <CustomDayTypes           projectId={projectId} />
      <UpgradeRoles             projectId={projectId} />
      <PennyContractSettings    projectId={projectId} />
      <DailyAllowancesOverrides projectId={projectId} />
    </div>
  );
}