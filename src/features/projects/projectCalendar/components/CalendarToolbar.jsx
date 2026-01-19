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
import { addDays, addWeeks, addMonths, addYears } from "date-fns";

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Printer,
  Download,
} from "lucide-react";

import SearchBar from "@/shared/components/SearchBar";
import FilterPillTabs from "@/shared/components/FilterPillTabs";

export default function CalendarToolbar({
  currentDate,
  setCurrentDate,
  events = 0,
  search,
  setSearch,
  period,
  setPeriod,
  view,
  setView,
}) {
  const dayEvents = events.filter((e) => {
    if (!e.startDate) return false;

    const selected = format(currentDate, "yyyy-MM-dd");
    return e.startDate === selected;
  });

  const handlePrev = () => {
    if (view === "day") setCurrentDate(addDays(currentDate, -1));
    else if (view === "week") setCurrentDate(addWeeks(currentDate, -1));
    else if (view === "month") setCurrentDate(addMonths(currentDate, -1));
    else if (view === "year") setCurrentDate(addYears(currentDate, -1));
    else if (view === "gantt") setCurrentDate(addWeeks(currentDate, -1));
  };

  const handleNext = () => {
    if (view === "day") setCurrentDate(addDays(currentDate, 1));
    else if (view === "week") setCurrentDate(addWeeks(currentDate, 1));
    else if (view === "month") setCurrentDate(addMonths(currentDate, 1));
    else if (view === "year") setCurrentDate(addYears(currentDate, 1));
    else if (view === "gantt") setCurrentDate(addWeeks(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="icon" onClick={handlePrev}>
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary-foreground" />
          </div>

          <div>
            <h3 className="font-bold text-lg">
              {view === "month"
                ? format(currentDate, "MMMM yyyy")
                : format(currentDate, "dd EEE MMM yyyy")}
            </h3>

            <p className="text-xs text-muted-foreground">
              {dayEvents.length} events scheduled
            </p>
          </div>
        </div>

        <Button variant="outline" size="icon" onClick={handleNext}>
          <ChevronRight className="w-4 h-4" />
        </Button>

        <Button variant="default" size="sm" onClick={handleToday}>
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
              { value: "conflicts", label: "", icon: "AlertTriangle" },
            ]}
            value={view}
            onChange={setView}
          />
        </div>
        <InfoTooltip content="Print Calendar">
          <Button variant="default" size="icon" onClick={() => window.print()}>
            <Printer className="w-4 h-4" />
          </Button>
        </InfoTooltip>

        <InfoTooltip content="Download Calendar">
          <Button
            variant="default"
            size="icon"
            onClick={() => console.log("Download calendar")}
          >
            <Download className="w-4 h-4" />
          </Button>
        </InfoTooltip>
      </div>
    </Card>
  );
}
