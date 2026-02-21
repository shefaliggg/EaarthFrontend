import { useRef, useState, useMemo } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Eye,
} from "lucide-react";
import { exportCalendarPdf } from "./useCalendarPdfExport";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/shared/config/utils";

import CalendarMonthPDF from "../pdf-templates/CalendarMonthPDF";
import CalendarWeekPDF from "../pdf-templates/CalendarWeekPDF";
import CalendarDayPDF from "../pdf-templates/CalendarDayPDF";
import CalendarGanttPDF from "../pdf-templates/CalendarGanttPDF";

import useCalendar from "../../hooks/useCalendar";
import CalendarFilterTabs from "../CalendarFilterTabs";

const PREVIEW_VIEWS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "timeline", label: "Timeline" },
];

function Sep() {
  return <div className="w-px h-6 bg-border/60 shrink-0" />;
}

function CalendarPreviewPage() {
  const navigate = useNavigate();
  const { projectName } = useParams();
  const printRef = useRef(null);

  const { currentDate, events, view, setView, prev, next, today } =
    useCalendar();

  // Local state to manage the selected period
  const [period, setPeriod] = useState("all");

  // Filter events based on the selected period
  const filteredEvents = useMemo(() => {
    if (period === "all") return events;
    return events.filter((e) => e.eventType === period);
  }, [events, period]);

  const safeView = PREVIEW_VIEWS.some((v) => v.value === view) ? view : "month";

  const getHeaderTitle = () => {
    switch (safeView) {
      case "week":
      case "day":
        return format(currentDate, "dd EEE MMM yyyy");
      default:
        return format(currentDate, "MMMM yyyy");
    }
  };

  const renderTemplate = () => {
    switch (safeView) {
      case "week":
        return <CalendarWeekPDF currentDate={currentDate} events={filteredEvents} />;
      case "day":
        return <CalendarDayPDF currentDate={currentDate} events={filteredEvents} />;
      case "gantt":
        return <CalendarGanttPDF currentDate={currentDate} events={filteredEvents} />;
      default:
        return <CalendarMonthPDF currentDate={currentDate} events={filteredEvents} />;
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-350px)] rounded-xl border border-primary/20 bg-card shadow-lg shadow-primary/5 overflow-hidden">
      {/* HEADER TOOLBAR */}
      <div className="flex items-center justify-between gap-4 border-b border-primary/20 px-4 py-3 bg-card z-10 relative">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          {/* Back button */}
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 border-border hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-colors"
            onClick={() => navigate(`/projects/${projectName}/calendar`)}
            title="Back to calendar"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <Sep />

          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-[0_2px_12px_rgba(147,51,234,0.35)]">
              <Eye className="w-4 h-4 text-primary-foreground" />
            </div>

            <div className="flex flex-col leading-tight">
              <p className="font-bold text-[15px] text-foreground">
                {getHeaderTitle()}
              </p>
              <p className="mt-1 text-[9px] font-bold tracking-[0.2em] uppercase text-primary/60">
                PDF Preview
              </p>
            </div>
          </div>

          <Sep />

          {/* Date navigation */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 border-border hover:border-primary/90 hover:bg-primary/5 hover:text-primary"
              onClick={prev}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="border-primary/30 text-primary hover:bg-primary hover:border-primary/50 font-bold text-[10px] tracking-widest uppercase"
              onClick={today}
            >
              Today
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="shrink-0 border-border hover:border-primary/90 hover:bg-primary/5 hover:text-primary"
              onClick={next}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All Periods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Periods</SelectItem>
              <SelectItem value="prep">Prep</SelectItem>
              <SelectItem value="shoot">Shoot</SelectItem>
              <SelectItem value="wrap">Wrap</SelectItem>
            </SelectContent>
          </Select>

          <Sep />

          {/* View switcher */}
          <CalendarFilterTabs
            options={PREVIEW_VIEWS}
            value={safeView}
            onChange={setView}
            transparentBg
          />

          <Sep />

          {/* Export */}
          <Button
            onClick={() =>
              exportCalendarPdf({
                ref: printRef,
                fileName: `calendar-${format(currentDate, "yyyy-MM")}.pdf`,
                orientation: "landscape",
              })
            }
            className={cn(
              "flex items-center gap-2 px-5 font-bold text-[10px] tracking-widest uppercase",
              "bg-primary hover:bg-primary/90 text-primary-foreground",
              "shadow-[0_4px_16px_rgba(147,51,234,0.3)]",
              "hover:shadow-[0_6px_24px_rgba(147,51,234,0.45)]",
              "transition-all duration-200 hover:-translate-y-px active:translate-y-0",
            )}
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className=" dark:bg-neutral-900/50 overflow-auto flex items-center justify-center p-8">
        <div
          ref={printRef}
          className="bg-white shadow-xl transition-transform duration-200"
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}

export default CalendarPreviewPage;