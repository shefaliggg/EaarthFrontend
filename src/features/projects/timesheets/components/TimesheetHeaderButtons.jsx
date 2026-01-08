import React from 'react';
import { Download, FileText, DollarSign } from 'lucide-react';
import { Button } from '../../../../shared/components/ui/button';

export function TimesheetHeaderButtons({
  currentUserRole,
  contractCategory,
  onExportTimesheet,
  onExportInvoice,
  onFinanceAction
}) {
  const canDownloadInvoice = contractCategory === 'SCHD' || contractCategory === 'Loan Out';

  return (
    <>
      {currentUserRole === 'Finance' && (
        <Button size={"icon"} variant={"outline"}
          onClick={onFinanceAction}
          title="Accounts Only"
        >
          <DollarSign className="w-4 h-4" />
        </Button>
      )}
      <Button size={"icon"} variant={"outline"}
        onClick={onExportTimesheet}
        title="Download Timesheet"
      >
        <Download className="w-4 h-4" />
      </Button>
      {canDownloadInvoice && (
        <Button size={"icon"} variant={"outline"}
          onClick={onExportInvoice}
          title="Download Invoice"
        >
          <FileText className="w-4 h-4" />
        </Button>
      )}
    </>
  );
}
