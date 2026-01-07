import React from 'react';
import { Download, FileText, DollarSign } from 'lucide-react';

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
        <button 
          onClick={onFinanceAction} 
          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all" 
          title="Accounts Only"
        >
          <DollarSign className="w-4 h-4" />
        </button>
      )}
      <button 
        onClick={onExportTimesheet} 
        className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all" 
        title="Download Timesheet"
      >
        <Download className="w-4 h-4" />
      </button>
      {canDownloadInvoice && (
        <button 
          onClick={onExportInvoice} 
          className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 transition-all" 
          title="Download Invoice"
        >
          <FileText className="w-4 h-4" />
        </button>
      )}
    </>
  );
}
