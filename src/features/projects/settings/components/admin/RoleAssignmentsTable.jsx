import { cn } from "@/shared/config/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import { StatusBadge } from "@/shared/components/badges/StatusBadge";
import { Trash2 } from "lucide-react";

const columns = [
  {
    key: "member",
    label: "Member",
    align: "left",
  },

  {
    key: "role",
    label: "Role",
    align: "center",
  },

  {
    key: "department",
    label: "Department",
    align: "center",
  },

  {
    key: "status",
    label: "Status",
    align: "center",
  },

  {
    key: "actions",
    label: "",
    align: "center",
  },
];

function RoleAssignmentsTable({
  isEditing,
  members,
  setMembers,
  roleOptions = [],
  departmentOptions = [],
}) {
  const totalMembers = members.length;

  const activeMembers = members.filter(
    (member) => member.status.toLowerCase() === "active",
  ).length;
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
              {members.map((member) => (
                <TableRow
                  key={member.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {/*✅ MEMBER */}
                  <TableCell className="first:pl-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center">
                        <span className="text-[0.7rem] font-semibold text-primary-foreground">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground leading-none truncate pb-0.5">
                          {member.name}
                        </span>

                        <span className="text-xs text-muted-foreground mt-0.5">
                          {member.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/*✅ Role */}
                  <TableCell className="text-center">
                    <EditableSelectField
                      isRequired={false}
                      value={member.role}
                      isEditing={isEditing}
                      items={roleOptions.map((role) => ({
                        label: role.role,
                        value: role.role,
                      }))}
                      onChange={(value) => {
                        setMembers((prev) =>
                          prev.map((m) =>
                            m.id === member.id ? { ...m, role: value } : m,
                          ),
                        );
                      }}
                    />
                  </TableCell>

                  {/*✅ Department */}
                  <TableCell className="text-center">
                    <EditableSelectField
                      isRequired={false}
                      value={member.department}
                      isEditing={isEditing}
                      items={departmentOptions.map((department) => ({
                        label: department,
                        value: department,
                      }))}
                      onChange={(value) => {
                        setMembers((prev) =>
                          prev.map((m) =>
                            m.id === member.id
                              ? { ...m, department: value }
                              : m,
                          ),
                        );
                      }}
                    />
                  </TableCell>

                  {/*✅ Status */}
                  <TableCell className="text-center">
                    <StatusBadge
                      status={member.status.toLowerCase()}
                      size="xs"
                    />
                  </TableCell>

                  {/*✅ Actions */}
                  <TableCell className="text-center">
                    <Button
                      variant="outline_destructive"
                      size="icon"
                      disabled={!isEditing}
                      onClick={() => {
                        setMembers((prev) =>
                          prev.filter((m) => m.id !== member.id),
                        );
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-3 px-1">
          <p className="text-[10px] text-muted-foreground">
            {totalMembers} members assigned · {activeMembers} active
          </p>

          <p className="text-[10px] text-muted-foreground">
            Invited members will receive an email to join this project
          </p>
        </div>
      </div>
    </>
  );
}

export default RoleAssignmentsTable;
