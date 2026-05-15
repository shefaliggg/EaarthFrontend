import { cn } from "@/shared/config/utils";
import { SelectMenu } from "@/shared/components/menus/SelectMenu";
import PermissionCheckboxMenu from "./PermissionCheckboxMenu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import EditablePermissionCheckboxField from "./EditablePermissionCheckboxField";

const columns = [
  {
    key: "role",
    label: "Role",
    align: "left",
  },
  {
    key: "settings",
    label: "Settings",
    align: "center",
  },
  {
    key: "calendar",
    label: "Calendar",
    align: "center",
  },
  {
    key: "offers",
    label: "Offers",
    align: "center",
  },
  {
    key: "manageCrew",
    label: "Manage Crew",
    align: "center",
  },
  {
    key: "generate",
    label: "Generate",
    align: "center",
  },
  {
    key: "approve",
    label: "Approve",
    align: "center",
  },
];

function RolePermissionsTable({ roles, setRoles, isEditing }) {
  return (
    <>
      <div className={cn("space-y-4")}>
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className={cn(
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                      "h-13 last:pr-6 first:pl-4 text-muted-foreground",
                    )}
                    style={{ width: col.width }}
                  >
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role, index) => (
                <TableRow
                  key={role.id || index}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {/*✅ Roles  */}
                  <TableCell className="first:pl-4 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground leading-none truncate pb-0.5">
                        {role.role}
                      </span>

                      {role.description && (
                        <span className="text-xs text-muted-foreground mt-0.5">
                          {role.description}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/*✅ SETTINGS */}
                  <TableCell className="text-center">
                    <EditablePermissionCheckboxField
                      value={role.settings}
                      isEditing={isEditing}
                      isRequired={false}
                      items={[
                        { label: "None", value: "none" },
                        { label: "View", value: "view" },
                        { label: "Edit", value: "edit" },
                      ]}
                      onChange={(updated) => {
                        setRoles((prev) =>
                          prev.map((r) =>
                            r.id === role.id ? { ...r, settings: updated } : r,
                          ),
                        );
                      }}
                    />
                  </TableCell>

                  {/*✅ CALENDAR  */}
                  <TableCell className="text-center">
                    <EditablePermissionCheckboxField
                      value={role.calendar}
                      isEditing={isEditing}
                      isRequired={false}
                      items={[
                        { label: "None", value: "none" },
                        { label: "View", value: "view" },
                        { label: "Edit", value: "edit" },
                      ]}
                      onChange={(updated) => {
                        setRoles((prev) =>
                          prev.map((r) =>
                            r.id === role.id ? { ...r, calendar: updated } : r,
                          ),
                        );
                      }}
                    />
                  </TableCell>

                  {/*✅ OFFERS  */}
                  <TableCell className="text-center">
                    <EditablePermissionCheckboxField
                      value={role.offers}
                      isEditing={isEditing}
                      isRequired={false}
                      items={[
                        { label: "None", value: "none" },
                        { label: "View own", value: "view own" },
                        { label: "View", value: "view" },
                        { label: "Edit", value: "edit" },
                        { label: "Send", value: "send" },
                      ]}
                      onChange={(updated) => {
                        setRoles((prev) =>
                          prev.map((r) =>
                            r.id === role.id ? { ...r, offers: updated } : r,
                          ),
                        );
                      }}
                    />
                  </TableCell>

                  {/*✅ MANAGE CREW  */}
                  <TableCell className="text-center">
                    <EditablePermissionCheckboxField
                      value={role.manageCrew}
                      isEditing={isEditing}
                      isRequired={false}
                      items={[
                        { label: "None", value: "none" },
                        { label: "View overtime", value: "view overtime" },
                        { label: "Edit overtime", value: "edit overtime" },
                        { label: "Send notice", value: "send notice" },
                      ]}
                      onChange={(updated) => {
                        setRoles((prev) =>
                          prev.map((r) =>
                            r.id === role.id
                              ? { ...r, manageCrew: updated }
                              : r,
                          ),
                        );
                      }}
                    />
                  </TableCell>

                  {/*✅ GENERATE  */}
                  <TableCell className="text-center">
                    <EditablePermissionCheckboxField
                      value={role.generate}
                      isEditing={isEditing}
                      isRequired={false}
                      items={[
                        { label: "None", value: "none" },
                        { label: "Edit own", value: "edit own" },
                        { label: "Edit", value: "edit" },
                      ]}
                      onChange={(updated) => {
                        setRoles((prev) =>
                          prev.map((r) =>
                            r.id === role.id ? { ...r, generate: updated } : r,
                          ),
                        );
                      }}
                    />
                  </TableCell>

                  {/*✅ APPROVE  */}
                  <TableCell className="text-center">
                    <EditablePermissionCheckboxField
                      value={role.approve}
                      isEditing={isEditing}
                      isRequired={false}
                      items={[
                        { label: "None", value: "none" },
                        { label: "View", value: "view" },
                        { label: "Approve", value: "approve" },
                        { label: "Export", value: "export" },
                      ]}
                      onChange={(updated) => {
                        setRoles((prev) =>
                          prev.map((r) =>
                            r.id === role.id ? { ...r, approve: updated } : r,
                          ),
                        );
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-[10px] text-muted-foreground mt-3 pl-1">
          * Department-level roles. Permissions apply within their own
          department only.
        </p>
      </div>
    </>
  );
}

export default RolePermissionsTable;
