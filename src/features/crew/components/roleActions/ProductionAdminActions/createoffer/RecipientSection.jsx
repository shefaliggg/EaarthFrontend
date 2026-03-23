import { SectionHeader } from "../shared/SectionHeader";
import { Field } from "../shared/Field";
import { HighlightField } from "../shared/HighlightField";

export function RecipientSection({ data, activeField, onFieldClick }) {
  // ── FIX: recipient fields are nested under data.recipient.*
  // ContractForm writes: data.recipient.fullName, data.recipient.email, etc.
  // But representation (isViaAgent, agentEmail) lives under data.representation.*
  const recipient       = data.recipient       || {};
  const representation  = data.representation  || {};

  const fullName    = recipient.fullName    || data.fullName    || "—";
  const email       = recipient.email       || data.email       || "—";
  const mobileNumber = recipient.mobileNumber || data.mobileNumber || "—";
  const isViaAgent  = representation.isViaAgent ?? data.isViaAgent ?? false;
  const agentEmail  = representation.agentEmail  || data.agentEmail  || "";

  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <SectionHeader title="Recipient" />
      <div className="space-y-1">

        {/* Full name */}
        <Field label="Full name">
          <HighlightField
            fieldName="recipient.fullName"
            active={
              activeField === "recipient.fullName" ||
              activeField === "fullName"
            }
            onClick={onFieldClick}
          >
            <span className="font-semibold text-[12px]">{fullName}</span>
          </HighlightField>
        </Field>

        {/* Email + Phone side by side */}
        <div className="grid grid-cols-2 gap-x-2">
          <Field label="Email">
            <HighlightField
              fieldName="recipient.email"
              active={
                activeField === "recipient.email" ||
                activeField === "email"
              }
              onClick={onFieldClick}
            >
              <span>{email}</span>
            </HighlightField>
          </Field>
          <Field label="Phone number">
            <HighlightField
              fieldName="recipient.mobileNumber"
              active={
                activeField === "recipient.mobileNumber" ||
                activeField === "mobileNumber"
              }
              onClick={onFieldClick}
            >
              <span>{mobileNumber}</span>
            </HighlightField>
          </Field>
        </div>

        {/* Agent email — only shown when via agent */}
        {isViaAgent && agentEmail && (
          <Field label="Agent email">
            <HighlightField
              fieldName="representation.agentEmail"
              active={
                activeField === "representation.agentEmail" ||
                activeField === "agentEmail"
              }
              onClick={onFieldClick}
            >
              <span>{agentEmail}</span>
            </HighlightField>
          </Field>
        )}

      </div>
    </div>
  );
}