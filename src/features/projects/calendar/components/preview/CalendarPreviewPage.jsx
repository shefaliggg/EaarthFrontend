import { useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { X, Download } from "lucide-react";
import CalendarPDFTemplate from "./CalendarPDFTemplate";
import { exportCalendarPdf } from "./useCalendarPdfExport";

export default function CalendarPreviewPage({ onClose, currentDate, events }) {
  const printRef = useRef(null);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-200 px-64">
      <div className="rounded-xl w-full  max-h-[95vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}

        <div className="flex items-center justify-between px-6 py-4 border-b border-primary/20 bg-card">
          <h3 className="text-lg font-bold text-foreground">PDF Preview</h3>
          <div className="flex items-center gap-3">
            <Button
              onClick={() =>
                exportCalendarPdf({
                  ref: printRef,
                  fileName: "Production_Calendar.pdf",
                  orientation: "landscape", 
                })
              }
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-all"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
            <Button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg  hover:text-gray-700 bg-primary text-foreground transition-all"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        {/* Preview Container */}
        <div className="flex-1 overflow-auto bg-card p-8 flex items-start justify-center">
          <div
            style={{
              
            }}
          >
           pdf
          </div>
        </div>
      </div>
    </div>
  );
}
