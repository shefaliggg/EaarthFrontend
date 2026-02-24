import { useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Badge } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";

import {
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Eye,
  Filter,
  X
} from "lucide-react";
import { exportCalendarPdf } from "./useCalendarPdfExport";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/shared/config/utils";

import CalendarMonthPDF from "../pdf-templates/CalendarMonthPDF";
import CalendarWeekPDF from "../pdf-templates/CalendarWeekPDF";
import CalendarDayPDF from "../pdf-templates/CalendarDayPDF";

import useCalendar from "../../hooks/useCalendar";
import CalendarFilterTabs from "../CalendarFilterTabs";
import CalendarTimeLinePDF from "../pdf-templates/CalendarTimeLinePDF";

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

  const { 
    currentDate, 
    events, 
    view, 
    setView, 
    prev, 
    next, 
    today,
    filters,
    updateFilter,
    resetFilters,
    departments,
    crewMembers,
  } = useCalendar();

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

  const handleArrayFilter = (key, value) => {
    const currentList = filters[key] || [];
    if (currentList.includes(value)) {
      updateFilter(key, currentList.filter(item => item !== value));
    } else {
      updateFilter(key, [...currentList, value]);
    }
  };

  const activeFilterCount = 
    (filters.eventTypes?.length || 0) + 
    (filters.statuses?.length || 0) + 
    (filters.departments?.length || 0) + 
    (filters.crewMembers?.length || 0) + 
    (filters.location ? 1 : 0);

  const renderTemplate = () => {
    switch (safeView) {
      case "week":
        return <CalendarWeekPDF currentDate={currentDate} events={events} />;
      case "day":
        return <CalendarDayPDF currentDate={currentDate} events={events} />;
      case "timeline": 
        return <CalendarTimeLinePDF currentDate={currentDate} events={events} />;
      default:
        return <CalendarMonthPDF currentDate={currentDate} events={events} />;
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
          
          <Popover>
            <PopoverTrigger asChild>
               <Button variant="outline" className="gap-2 border-primary/20 hover:bg-muted/50">
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-1 bg-primary/20 text-primary">{activeFilterCount}</Badge>
                  )}
               </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 border-primary/20 shadow-xl" align="start">
              <div className="p-4 border-b border-primary/20 flex justify-between items-center bg-muted/30">
                 <h4 className="font-semibold text-sm">Filter Events</h4>
                 {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive">
                       <X className="w-3 h-3 mr-1" /> Clear All
                    </Button>
                 )}
              </div>

              <div className="p-4 space-y-6 max-h-[50vh] overflow-y-auto custom-scrollbar">
                 <div className="space-y-3">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Event Types</Label>
                    <div className="grid grid-cols-2 gap-3">
                       {["prep", "shoot", "wrap"].map(type => (
                          <div key={type} className="flex items-center space-x-2 bg-muted/30 p-2 rounded-md">
                             <Checkbox
                                id={`type-${type}`}
                                checked={filters.eventTypes?.includes(type)}
                                onCheckedChange={() => handleArrayFilter("eventTypes", type)}
                             />
                             <Label htmlFor={`type-${type}`} className="text-sm capitalize font-medium cursor-pointer">{type}</Label>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-3">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</Label>
                    <div className="grid grid-cols-2 gap-3">
                       {["confirmed", "tentative", "cancelled", "completed"].map(status => (
                          <div key={status} className="flex items-center space-x-2 bg-muted/30 p-2 rounded-md">
                             <Checkbox
                                id={`status-${status}`}
                                checked={filters.statuses?.includes(status)}
                                onCheckedChange={() => handleArrayFilter("statuses", status)}
                             />
                             <Label htmlFor={`status-${status}`} className="text-sm capitalize font-medium cursor-pointer">{status}</Label>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-3">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Location</Label>
                    <Input
                       placeholder="Filter by location name..."
                       value={filters.location}
                       onChange={(e) => updateFilter("location", e.target.value)}
                       className="h-9 text-sm"
                    />
                 </div>

                 {departments?.length > 0 && (
                     <div className="space-y-3">
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Departments</Label>
                        <div className="space-y-2 border rounded-md p-2 bg-card max-h-[150px] overflow-y-auto custom-scrollbar">
                           {departments.map(dept => (
                              <div key={dept._id} className="flex items-center space-x-2 p-1 hover:bg-muted/50 rounded">
                                 <Checkbox
                                    id={`dept-${dept._id}`}
                                    checked={filters.departments?.includes(dept._id)}
                                    onCheckedChange={() => handleArrayFilter("departments", dept._id)}
                                 />
                                 <Label htmlFor={`dept-${dept._id}`} className="text-sm font-medium leading-none cursor-pointer">
                                    {dept.name}
                                 </Label>
                              </div>
                           ))}
                        </div>
                     </div>
                 )}

                 {crewMembers?.length > 0 && (
                     <div className="space-y-3">
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Crew Members</Label>
                        <div className="space-y-2 border rounded-md p-2 bg-card max-h-[150px] overflow-y-auto custom-scrollbar">
                           {crewMembers.map(crew => {
                              const crewId = crew._id || crew.id;
                              return (
                              <div key={crewId} className="flex items-center space-x-2 p-1 hover:bg-muted/50 rounded">
                                 <Checkbox
                                    id={`crew-${crewId}`}
                                    checked={filters.crewMembers?.includes(crewId)}
                                    onCheckedChange={() => handleArrayFilter("crewMembers", crewId)}
                                 />
                                 <Label htmlFor={`crew-${crewId}`} className="text-sm font-medium leading-none cursor-pointer">
                                    {crew.displayName || crew.name || "Unknown"}
                                 </Label>
                              </div>
                           )})}
                        </div>
                     </div>
                 )}
              </div>
            </PopoverContent>
          </Popover>

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