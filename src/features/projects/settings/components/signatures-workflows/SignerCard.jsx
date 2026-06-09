import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableCheckboxField from "@/shared/components/wrappers/EditableCheckboxField";
import { StatusBadge } from "@/shared/components/badges/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import { Trash2 } from "lucide-react";
import EditablePermissionCheckboxField from "@/features/projects/settings/components/signatures-workflows/EditablePermissionCheckboxField";

function SignerCard({ data, isEditing, onChange, onDelete }) {
  const initials = data.name
    ?.split(" ")
    ?.map((word) => word[0])
    ?.join("")
    ?.slice(0, 2);

  return (
    <>
      <div className="p-3 border rounded-xl bg-card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3 flex-1">
            <div className="w-10 h-10 mt-1 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center">
              <span className="text-[0.7rem] font-semibold text-primary-foreground">
                {initials || "NA"}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <EditableTextDataField
                 placeholder="Enter signer name"
                  value={data.name}
                  isEditing={isEditing}
                  isRequired={false}
                  onChange={(value) =>
                    onChange({
                      ...data,
                      name: value,
                    })
                  }
                />
                {data.hasSignature && (
                  <StatusBadge
                    size="xs"
                    status="verified"
                    label="Has Signature"
                  />
                )}
                {data.requiresSecondApproval && (
                  <StatusBadge
                    size="xs"
                    status="warning"
                    label="Requires 2nd Approval"
                  />
                )}
              </div>
              <EditableTextDataField
               placeholder="Enter role"
                value={data.role}
                isEditing={isEditing}
                isRequired={false}
                onChange={(value) =>
                  onChange({
                    ...data,
                    role: value,
                  })
                }
              />

              <EditableTextDataField
                placeholder="Enter email address"
                type="email"
                value={data.email}
                isEditing={isEditing}
                isRequired={false}
                onChange={(value) =>
                  onChange({
                    ...data,
                    email: value,
                  })
                }
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {data.permissions?.map((permission) => (
                  <StatusBadge
                    key={permission}
                    size="xs"
                    showIcon={false}
                    status="highlight"
                    label={permission}
                  />
                ))}
              </div>
            </div>
          </div>
          {isEditing && (
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={onDelete}
              className="text-red-500 hover:text-red-700 hover:bg-red-100 border-transparent"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-border">
          <EditableSelectField
            label="Department"
            value={data.department}
            isEditing={isEditing}
            items={[
              {
                label: "PRODUCTION",
                value: "PRODUCTION",
              },
              {
                label: "ACCOUNTS",
                value: "ACCOUNTS",
              },
              {
                label: "POST PRODUCTION",
                value: "POST PRODUCTION",
              },
              {
                label: "CONSTRUCTION",
                value: "CONSTRUCTION",
              },
            ]}
            onChange={(value) =>
              onChange({
                ...data,
                department: value,
              })
            }
          />

          <EditableSelectField
            label="Signing Status"
            value={data.hasSignature ? "HAS_SIGNATURE" : "REQUIRES_APPROVAL"}
            isEditing={isEditing}
            items={[
              {
                label: "HAS SIGNATURE",
                value: "HAS_SIGNATURE",
              },
              {
                label: "REQUIRES 2ND APPROVAL",
                value: "REQUIRES_APPROVAL",
              },
            ]}
            onChange={(value) =>
              onChange({
                ...data,
                hasSignature: value === "HAS_SIGNATURE",
                requiresSecondApproval: value === "REQUIRES_APPROVAL",
              })
            }
          />
          <EditablePermissionCheckboxField
            label="Permissions"
            value={data.permissions}
            isEditing={isEditing}
            items={[
              {
                label: "TIMESHEETS",
                value: "Timesheets",
              },
              {
                label: "EXPENSES",
                value: "Expenses",
              },
              {
                label: "INVOICES",
                value: "Invoices",
              },
              {
                label: "PURCHASE ORDERS",
                value: "Purchase Orders",
              },
              {
                label: "CONTRACTS",
                value: "Contracts",
              },
            ]}
            onChange={(permissions) =>
              onChange({
                ...data,
                permissions,
              })
            }
          />

          <EditableTextDataField
            label="Limit"
            value={data.limit}
            isEditing={isEditing}
            isRequired={false}
            onChange={(value) =>
              onChange({
                ...data,
                limit: value,
              })
            }
          />
        </div>

        <div className="flex justify-end mt-3">
          <span className="text-[10px] text-muted-foreground uppercase">
            Order: {data.order}
          </span>
        </div>
      </div>
    </>
  );
}

export default SignerCard;
