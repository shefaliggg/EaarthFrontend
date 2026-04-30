import { TableRow, TableCell } from "@/shared/components/ui/table";
import StateDisplay from "../StateDisplay";

export function TableStateRow({
  colSpan,
  type,
  title,
  description,
  icon,
  actionLabel,
  onAction,
}) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="p-0">
        <StateDisplay
          type={type}
          title={title}
          description={description}
          icon={icon}
          actionLabel={actionLabel}
          onAction={onAction}
        />
      </TableCell>
    </TableRow>
  );
}
