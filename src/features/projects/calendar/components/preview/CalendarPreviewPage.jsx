import { useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { X, Download } from "lucide-react";
import { exportCalendarPdf } from "./useCalendarPdfExport";

import CalendarMonthPDF from "../pdf-templates/CalendarMonthPDF";
import CalendarWeekPDF from "../pdf-templates/CalendarWeekPDF";
import CalendarDayPDF from "../pdf-templates/CalendarDayPDF";
import CalendarGanttPDF from "../pdf-templates/CalendarGanttPDF";

function CalendarPreviewPage({ onClose, currentDate, events, view }) {
  const printRef = useRef(null);

  const renderTemplate = () => {
    switch (view) {
      case "week":
        return <CalendarWeekPDF currentDate={currentDate} events={events} />;

      case "day":
        return <CalendarDayPDF currentDate={currentDate} events={events} />;

      case "gantt":
        return <CalendarGanttPDF currentDate={currentDate} events={events} />;

      case "month":
      default:
        return <CalendarMonthPDF currentDate={currentDate} events={events} />;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] px-4 md:px-12 lg:px-64">
        <div className="bg-card rounded-xl w-full max-h-[95vh] flex flex-col shadow-2xl overflow-hidden border border-border">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h3 className="text-lg font-bold text-foreground">PDF Preview</h3>
            <div className="flex items-center gap-3">
              <Button
                onClick={() =>
                  exportCalendarPdf({
                    ref: printRef,
                    fileName: "calendar.pdf",
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
                variant="secondary"
                size="icon"
                className="bg-muted hover:bg-muted/80 text-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Preview Container */}
          <div className="flex-1 overflow-auto bg-muted/20 flex items-start justify-center p-8">
            <div
              style={{
                transform: "scale(0.85)",
                transformOrigin: "top center",
                marginBottom: "-10%",
              }}
            >
              <div className="shadow-2xl ring-1 ring-black/5 rounded-sm bg-white">
                <div ref={printRef}>{renderTemplate()}</div>
              </div>
            </div>
          </div>
          
        </div>
        
      </div>
    </>
  );
}

export default CalendarPreviewPage;
