import React from 'react';
import { Download, FileText, DollarSign } from 'lucide-react';
import { Button } from '../../../../shared/components/ui/button';
import { InfoTooltip } from '../../../../shared/components/InfoTooltip';

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
      {currentUserRole === 'finance' && (
        <InfoTooltip
          content={"Accounts Only"}
        >
          <Button size={"icon"} variant={"outline"}
            onClick={onFinanceAction}
          >
            <DollarSign className="w-4 h-4" />
          </Button>
        </InfoTooltip>
      )}
      <InfoTooltip
        content={"Download Timesheet"}
      >
        <Button size={"icon"} variant={"outline"}
          onClick={onExportTimesheet}
        >
          <Download className="w-4 h-4" />
        </Button>
      </InfoTooltip>
      {canDownloadInvoice && (
        <InfoTooltip
          content={"Download Invoice"}
        >
          <Button size={"icon"} variant={"outline"}
            onClick={onExportInvoice}
          >
            <FileText className="w-4 h-4" />
          </Button>
        </InfoTooltip>
      )}
    </>
  );
}
