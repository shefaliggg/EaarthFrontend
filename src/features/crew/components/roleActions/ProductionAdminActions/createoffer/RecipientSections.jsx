// sections/RecipientSection.jsx
import EditableTextDataField from "../../../../../../shared/components/wrappers/EditableTextDataField";
import EditableCheckboxField from "../../../../../../shared/components/wrappers/EditableCheckboxField";

export function RecipientSection({ data, onChange }) {
  const representation = data.representation || {};

  const setRecipient = (field, value) => {
    const v = field !== "email" && typeof value === "string" ? value.toUpperCase() : value;
    onChange({ ...data, recipient: { ...data.recipient, [field]: v } });
  };

  const setRepresentation = (field, value) =>
    onChange({ ...data, representation: { ...data.representation, [field]: value } });

  return (
    <div className="space-y-3">
      <EditableTextDataField
        label="Full name"
        icon="User"
        value={data.recipient?.fullName ?? ""}
        isEditing
        onChange={(v) => setRecipient("fullName", v)}
        placeholder="Full name"
      />

      <EditableTextDataField
        label="Email"
        icon="Mail"
        type="email"
        value={data.recipient?.email ?? ""}
        isEditing
        onChange={(v) => setRecipient("email", v)}
        placeholder="email@example.com"
      />

      <EditableTextDataField
        label="Mobile number"
        icon="Phone"
        type="tel"
        value={data.recipient?.mobileNumber ?? ""}
        isEditing
        onChange={(v) => setRecipient("mobileNumber", v)}
        placeholder="Mobile number"
      />

      <EditableCheckboxField
        label="This deal is via an agent"
        checked={!!representation.isViaAgent}
        onChange={(v) => setRepresentation("isViaAgent", v)}
        isEditing
      />

      {representation.isViaAgent && (
        <EditableTextDataField
          label="Agent email"
          icon="UserCheck"
          type="email"
          value={representation.agentEmail ?? ""}
          isEditing
          onChange={(v) => setRepresentation("agentEmail", v)}
          placeholder="agent@example.com"
        />
      )}
    </div>
  );
}