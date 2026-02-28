import { SectionHeader } from "../shared/SectionHeader";
import { Field } from "../shared/Field";
import { HighlightField } from "../shared/HighlightField";

function formatShortDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    weekday: "short", day: "2-digit", month: "short", year: "numeric",
  });
}

function getUnitLabel(val) {
  switch (val) {
    case "main": return "Main";
    case "splinter_camera": return "Splinter Camera";
    case "vfx_elements": return "VFX Elements";
    default: return val || "—";
  }
}

function getDepartmentLabel(val) {
  if (!val) return "—";
  return val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getSiteOfWorkLabel(val) {
  switch (val) {
    case "on_set": return "On set";
    case "off_set": return "Off set";
    default: return val || "—";
  }
}

function getShootDuration(startDate, endDate) {
  if (!startDate || !endDate) return "—";
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return `${diff} days`;
}

export function OfferDetailsSection({ data, activeField, onFieldClick }) {
  const getDisplayJobTitle = () => {
    if (data.createOwnJobTitle && data.newJobTitle) return data.newJobTitle;
    return data.jobTitle || "—";
  };

  // jobTitle field is active if any of these are focused
  const jobTitleActive =
    activeField === "jobTitle" ||
    activeField === "newJobTitle" ||
    activeField === "jobTitleSuffix";

  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <SectionHeader title="Offer Details" />
      <div className="space-y-1">

        {/* Unit + Department */}
        <div className="grid grid-cols-2 gap-x-2">
          <Field label="Unit">
            <HighlightField
              fieldName="unit"
              active={activeField === "unit"}
              onClick={onFieldClick}
            >
              <span className="font-medium">{getUnitLabel(data.unit)}</span>
            </HighlightField>
          </Field>
          <Field label="Department">
            <HighlightField
              fieldName="department"
              active={activeField === "department"}
              onClick={onFieldClick}
            >
              <span className="font-medium">{getDepartmentLabel(data.department)}</span>
            </HighlightField>
          </Field>
        </div>

        {/* Job title */}
        <Field label="Job title">
          <HighlightField
            fieldName="jobTitle"
            active={jobTitleActive}
            onClick={onFieldClick}
          >
            <span className="font-semibold text-[12px]">
              {getDisplayJobTitle()}
              {data.jobTitleSuffix ? ` ${data.jobTitleSuffix}` : ""}
            </span>
          </HighlightField>
        </Field>

        {/* Workplace / Duration / Start / End */}
        <div className="grid grid-cols-4 gap-x-2">
          <Field label="Workplace">
            <HighlightField
              fieldName="regularSiteOfWork"
              active={activeField === "regularSiteOfWork"}
              onClick={onFieldClick}
            >
              <span className="font-medium">{getSiteOfWorkLabel(data.regularSiteOfWork)}</span>
            </HighlightField>
          </Field>
          <Field label="Duration">
            {/* Duration is derived — highlight when either date is focused */}
            <HighlightField
              fieldName="startDate"
              active={activeField === "startDate" || activeField === "endDate"}
              onClick={onFieldClick}
            >
              <span className="font-medium">{getShootDuration(data.startDate, data.endDate)}</span>
            </HighlightField>
          </Field>
          <Field label="Start date">
            <HighlightField
              fieldName="startDate"
              active={activeField === "startDate"}
              onClick={onFieldClick}
            >
              <span className="font-medium text-[10px]">
                {data.startDate ? formatShortDate(data.startDate) : "—"}
              </span>
            </HighlightField>
          </Field>
          <Field label="End date">
            <HighlightField
              fieldName="endDate"
              active={activeField === "endDate"}
              onClick={onFieldClick}
            >
              <span className="font-medium text-[10px]">
                {data.endDate ? formatShortDate(data.endDate) : "—"}
              </span>
            </HighlightField>
          </Field>
        </div>

      </div>
    </div>
  );
}