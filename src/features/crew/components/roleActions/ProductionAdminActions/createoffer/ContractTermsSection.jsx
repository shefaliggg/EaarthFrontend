import { SectionHeader } from "../shared/SectionHeader";
import { Field } from "../shared/Field";
import { HighlightField } from "../shared/HighlightField";

function getEngagementType(data) {
  const typeMap = {
    loan_out: "LOAN OUT",
    paye: "PAYE",
    schd: "SCHD (DAILY/WEEKLY)",
    long_form: "LONG FORM",
  };
  if (data.engagementType && typeMap[data.engagementType]) return typeMap[data.engagementType];
  return data.allowSelfEmployed === "yes" ? "LOAN OUT" : data.allowSelfEmployed === "no" ? "PAYE" : "—";
}

function getStatusDeterminationReason(data) {
  const reasonMap = {
    hmrc_list: "Job title appears on HMRC list of 'Roles normally treated as self-employed'",
    cest: "Our CEST assessment has confirmed 'Off-payroll working rules (IR35) do not apply'",
    lorimer: "You have supplied a valid Lorimer letter",
    other: data.otherStatusDeterminationReason || "Other (not specified)",
  };
  if (data.statusDeterminationReason && reasonMap[data.statusDeterminationReason]) {
    return reasonMap[data.statusDeterminationReason];
  }
  if (data.allowSelfEmployed === "yes") return reasonMap.hmrc_list;
  return "—";
}

function getWorkingWeekLabel(val) {
  switch (val) {
    case "5": return "5 days";
    case "5.5": return "5.5 days";
    case "5_6": return "5/6 days";
    case "6": return "6 days";
    default: return val ? `${val} days` : "—";
  }
}

export function ContractTermsSection({ data, activeField, onFieldClick, engineSettings }) {
  const getCurrencySymbol = () => {
    switch (data.currency) {
      case "GBP": return "£";
      case "USD": return "$";
      case "EUR": return "€";
      default: return "£";
    }
  };
  const cs = getCurrencySymbol();

  // engagementType is active if allowSelfEmployed or engagementType is focused
  const engagementActive =
    activeField === "engagementType" || activeField === "allowSelfEmployed";

  const statusActive =
    activeField === "statusDeterminationReason" ||
    activeField === "otherStatusDeterminationReason";

  return (
    <div className="bg-white rounded-xl border border-purple-100/80 p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <SectionHeader title="Contract Terms" />
      <div className="grid grid-cols-6 gap-x-3 gap-y-1.5">

        <Field label="Engagement type">
          <HighlightField
            fieldName="engagementType"
            active={engagementActive}
            onClick={onFieldClick}
          >
            <span className="font-semibold">{getEngagementType(data)}</span>
          </HighlightField>
        </Field>

        <Field label="Frequency">
          <HighlightField
            fieldName="dailyOrWeekly"
            active={activeField === "dailyOrWeekly"}
            onClick={onFieldClick}
          >
            <span className="font-medium">
              {data.dailyOrWeekly
                ? data.dailyOrWeekly.charAt(0).toUpperCase() + data.dailyOrWeekly.slice(1)
                : "—"}
            </span>
          </HighlightField>
        </Field>

        <Field label="Working week">
          <HighlightField
            fieldName="workingWeek"
            active={activeField === "workingWeek"}
            onClick={onFieldClick}
          >
            <span className="font-medium">{getWorkingWeekLabel(data.workingWeek)}</span>
          </HighlightField>
        </Field>

        <Field label="Std hours / day">
          {/* Derived from engineSettings — no direct field focus */}
          <span className="font-medium">{engineSettings.standardHoursPerDay}h</span>
        </Field>

        <Field label="Fee per day (inc. hol)">
          <HighlightField
            fieldName="feePerDay"
            active={activeField === "feePerDay"}
            onClick={onFieldClick}
          >
            <span className="font-semibold text-[12px]">
              {data.feePerDay
                ? `${cs}${parseFloat(data.feePerDay).toLocaleString("en-GB", {
                    minimumFractionDigits: 2,
                  })}`
                : "—"}
            </span>
          </HighlightField>
        </Field>

        <Field label="Currency">
          <HighlightField
            fieldName="currency"
            active={activeField === "currency"}
            onClick={onFieldClick}
          >
            <span className="font-medium">{data.currency}</span>
          </HighlightField>
        </Field>

        <Field
          label="Status determination reason"
          className="col-span-6 pt-0.5 border-t border-purple-50"
        >
          <HighlightField
            fieldName="statusDeterminationReason"
            active={statusActive}
            onClick={onFieldClick}
          >
            <span className="text-[10px] text-neutral-500 italic">
              {getStatusDeterminationReason(data)}
            </span>
          </HighlightField>
        </Field>

      </div>
    </div>
  );
}