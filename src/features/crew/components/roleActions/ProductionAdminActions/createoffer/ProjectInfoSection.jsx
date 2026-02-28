import { SectionHeader } from "../shared/SectionHeader";
import { Field } from "../shared/Field";

function formatShortDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    weekday: "short", day: "2-digit", month: "short", year: "numeric",
  });
}

function getShootDuration(startDate, endDate) {
  if (!startDate || !endDate) return "—";
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return `${diff} days`;
}

export function ProjectInfoSection({ data, engineSettings }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <SectionHeader title="Project Information" />
      <div className="grid grid-cols-4 gap-x-3 gap-y-1 text-[11px]">
        <Field label="Project codename">
          <span className="font-semibold">Werwulf</span>
        </Field>
        <Field label="Type">
          <span className="font-medium">Feature Film</span>
        </Field>
        <Field label="Estimated shoot dates">
          <span className="font-medium text-[10px]">
            {data.startDate ? formatShortDate(data.startDate) : "Mon 29 Sep, 2025"}
            {" — "}
            {data.endDate ? formatShortDate(data.endDate) : "Thu 11 Dec, 2025"}
          </span>
        </Field>
        <Field label="Shoot duration">
          <span className="font-medium">{getShootDuration(data.startDate, data.endDate)}</span>
        </Field>
        <Field label="Studio / Production company">
          <span className="font-medium">Focus Features / Universal</span>
        </Field>
        <Field label="Holiday pay %">
          <span className="font-medium">{(engineSettings.holidayUplift * 100).toFixed(2)}%</span>
        </Field>
        <Field label="Company name" className="col-span-2">
          <span className="font-medium">Mirage Pictures Limited</span>
        </Field>
      </div>
      <div className="border-t border-neutral-100 mt-1.5 pt-1.5">
        <p className="text-neutral-400 text-[8px] uppercase tracking-wider font-semibold mb-1">Project Contacts</p>
        <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[11px]">
          <Field label="Production base address" className="col-span-3">
            <span>Sky Elstree Studios, Rowley Lane - Borehamwood, WD6 1FX, United Kingdom</span>
          </Field>
          <Field label="Project phone number">
            <span>020 3945 9013</span>
          </Field>
          <Field label="Project email address" className="col-span-2">
            <span>werwulfproduction@gmail.com</span>
          </Field>
        </div>
      </div>
    </div>
  );
}