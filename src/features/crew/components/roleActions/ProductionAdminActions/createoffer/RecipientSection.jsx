import { SectionHeader } from "../shared/SectionHeader";
import { Field } from "../shared/Field";
import { HighlightField } from "../shared/HighlightField";

export function RecipientSection({ data, activeField, onFieldClick }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <SectionHeader title="Recipient" />
      <div className="space-y-1">

        {/* Full name */}
        <Field label="Full name">
          <HighlightField
            fieldName="fullName"
            active={activeField === "fullName"}
            onClick={onFieldClick}
          >
            <span className="font-semibold text-[12px]">{data.fullName || "—"}</span>
          </HighlightField>
        </Field>

        {/* Email + Phone side by side */}
        <div className="grid grid-cols-2 gap-x-2">
          <Field label="Email">
            <HighlightField
              fieldName="email"
              active={activeField === "email"}
              onClick={onFieldClick}
            >
              <span>{data.email || "—"}</span>
            </HighlightField>
          </Field>
          <Field label="Phone number">
            <HighlightField
              fieldName="mobileNumber"
              active={activeField === "mobileNumber"}
              onClick={onFieldClick}
            >
              <span>{data.mobileNumber || "—"}</span>
            </HighlightField>
          </Field>
        </div>

        {/* Agent email — only shown when via agent */}
        {data.isViaAgent && data.agentEmail && (
          <Field label="Agent email">
            <HighlightField
              fieldName="agentEmail"
              active={activeField === "agentEmail"}
              onClick={onFieldClick}
            >
              <span>{data.agentEmail}</span>
            </HighlightField>
          </Field>
        )}

      </div>
    </div>
  );
}