import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { InfoTooltip } from "../../../../shared/components/InfoTooltip";
import { format } from "date-fns";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Printer,
  Download,
} from "lucide-react";

import SearchBar from "@/shared/components/SearchBar";
import FilterPillTabs from "@/shared/components/FilterPillTabs";
import getApiUrl from "../../../../shared/config/enviroment";

function CalendarToolbar({
  currentDate,
  eventsCount,
  search,
  setSearch,
  period,
  setPeriod,
  view,
  setView,
  onPrev,
  onNext,
  onToday,
}) {
  // Helper to get the display title based on current view
  const getTitle = () => {
    switch (view) {
      case "year":
      case "gantt":
        return format(currentDate, "yyyy");
      case "month":
      case "timeline":
      case "conflicts":
        return format(currentDate, "MMMM yyyy");
      default:
        return format(currentDate, "dd EEE MMM yyyy");
    }
  };

  // Helper to get the subtitle label
  const getSubtitle = () => {
    switch (view) {
      case "year":
        return `${eventsCount} events scheduled`;
      case "gantt":
        return `${eventsCount} events scheduled`;
      case "month":
      case "timeline":
        return `${eventsCount} events scheduled`;
      case "conflicts":
        return `${eventsCount} events scheduled`;
      case "week":
        return `${eventsCount} events scheduled`;
      case "day":
        return `${eventsCount} events scheduled`;
      default:
        return `${eventsCount} events scheduled`;
    }
  };

  return (
    <>
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="icon" onClick={onPrev}>
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>

            <div>
              <h3 className="font-bold text-lg">{getTitle()}</h3>
              <p className="text-xs text-muted-foreground">{getSubtitle()}</p>
            </div>
          </div>

          <Button variant="outline" size="icon" onClick={onNext}>
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Button variant="default" size="sm" onClick={onToday}>
            Today
          </Button>

          <SearchBar
            placeholder="Search events..."
            value={search}
            onValueChange={(e) => setSearch(e.target.value)}
          />
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
          <div className="">
            <FilterPillTabs
              options={[
                { value: "day", label: "Day" },
                { value: "week", label: "Week" },
                { value: "month", label: "Month" },
                { value: "year", label: "Year" },
                { value: "gantt", label: "Gantt" },
                { value: "timeline", label: "Timeline" },
                { value: "anaytics", label: "Analytics" },
                { value: "conflicts", label: "", icon: "AlertTriangle" },
              ]}
              value={view}
              onChange={setView}
            />
          </div>
          {/* <InfoTooltip content="Print Calendar">
            <Button
              variant="default"
              size="icon"
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4" />
            </Button>
          </InfoTooltip>

          <InfoTooltip content="Download Calendar">
            <Button
              variant="default"
              size="icon"
              onClick={() => {
                const apiBase = getApiUrl();
                const projectName = window.location.pathname.split("/")[2];

                const url = `${apiBase}/calendar/export-pdf?view=${view}&date=${currentDate.toISOString()}&projectName=${projectName}`;

                window.open(url, "_blank");
              }}
            >
              <Download className="w-4 h-4" />
            </Button>
          </InfoTooltip> */}
        </div>
      </Card>
    </>
  );
}

export default CalendarToolbar;
