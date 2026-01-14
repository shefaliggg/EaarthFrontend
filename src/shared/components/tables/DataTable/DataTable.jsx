import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";

import { cn } from "@/shared/config/utils";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { exportToCSV } from "@/shared/config/export";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { SelectMenu } from "../../menus/SelectMenu";

export default function DataTable({
  data = [],
  columns = [],

  currentPage,
  ItemsPerPage,
  totalItemsSize,
  setItemsPerPage,
  onPageChange,

  loading = false,
  error = false,

  selectable = false,
  onBulkAction,
  bulkActionLabel = "Delete Selected",

  headerAction,
  exportFilename = "export.csv",
  hideExport = false,
  hidePagination = false,

  onRowClick,
  className,
}) {
  
  const [selectedRows, setSelectedRows] = useState(new Set());

  const totalPages = Math.ceil(totalItemsSize / ItemsPerPage);

  const itemsPerPageOptions = [
    { value: 10, label: '10 per page' },
    { value: 25, label: '25 per page' },
    { value: 50, label: '50 per page' },
    { value: 100, label: '100 per page' },
  ]

  const handleSelectAll = (checked) => {
    if (checked) {
      const all = new Set(data.map((_, i) => i));
      setSelectedRows(all);
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (index, checked) => {
    const newSelected = new Set(selectedRows);
    checked ? newSelected.add(index) : newSelected.delete(index);
    setSelectedRows(newSelected);
  };

  const isAllSelected = data.length > 0 && selectedRows.size === data.length;
  const selectedData = Array.from(selectedRows).map(i => data[i]);

  const handleExport = () => {
    const exportColumns = columns.map(col => ({
      key: col.key,
      label: col.label,
      format: col.exportFormat,
    }));

    exportToCSV(selectedData.length ? selectedData : data, exportColumns, exportFilename);
  };

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center text-destructive">
        Failed to load data.
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* ✅ HEADER */}
      <div className="flex items-center justify-between">
        <div>
          {selectable && selectedRows.size > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction?.(selectedData)}
            >
              {bulkActionLabel}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {headerAction}
          {!hideExport && (
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export to CSV
            </Button>
          )}
        </div>
      </div>

      {/* ✅ TABLE */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-10 h-10 text-center">
                  <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
                </TableHead>
              )}

              {columns.map(col => (
                <TableHead
                  key={col.key}
                  className={cn(
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right",
                    "h-15 last:pr-4 first:pl-4"
                  )}
                  style={{ width: col.width }}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading &&
              Array.from({ length: ItemsPerPage }).map((_, i) => (
                <TableRow key={i}>
                  {selectable && <TableCell><div className="h-4 w-4 bg-muted rounded" /></TableCell>}
                  {columns.map(col => (
                    <TableCell key={col.key}>
                      <Skeleton className="h-5 w-full rounded-full my-2" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!loading && data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="text-center py-20 text-muted-foreground"
                >
                  No Data records found
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              data.map((row, index) => (
                <TableRow
                  key={index}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "hover:bg-muted/50 transition-colors",
                    selectable && selectedRows.has(index) && "bg-primary/10",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {selectable && (
                    <TableCell className="w-10 text-center">
                      <Checkbox
                        checked={selectedRows.has(index)}
                        onCheckedChange={checked => handleSelectRow(index, checked)}
                        onClick={e => e.stopPropagation()}
                      />
                    </TableCell>
                  )}

                  {columns.map(col => (
                    <TableCell
                      key={col.key}
                      className={cn(
                        col.align === "center" && "text-center",
                        col.align === "right" && "text-right",
                        "last:px-2 first:pl-4"
                      )}
                    >
                      {col.render ? col.render(row) : (row)[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      {!hidePagination &&
        <div className="flex items-center justify-between">
          <SelectMenu
            label="Items Per Page"
            items={itemsPerPageOptions}
            selected={ItemsPerPage}
            onSelect={setItemsPerPage}
            className={"w-[180px]"}
          />

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="icon"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      }
    </div>
  );
}