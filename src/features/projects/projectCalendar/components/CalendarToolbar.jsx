import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
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

export default function CalendarToolbar({
  currentDate,
  events = 0,
  search,
  setSearch,
  period,
  setPeriod,
  view,
  setView,
}) {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background hover:bg-primary/10 hover:text-primary transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary-foreground" />
          </div>

          <div>
            <h3 className="font-bold text-lg">
              {currentDate.getDate()}{" "}
              {currentDate.toLocaleDateString("en-US", { month: "short" })}{" "}
              {currentDate.toLocaleDateString("en-US", { weekday: "long" })}{" "}
              {currentDate.getFullYear()}
            </h3>

            <p className="text-xs text-muted-foreground">
              {events.length} events scheduled
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background hover:bg-primary/10 hover:text-primary transition"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        <Button variant="default" size="sm" className="font-semibold">
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
        <Button
          variant="default"
          size="sm"
          className="font-semibold"
          onClick={() => window.print()}
        >
          <Printer />
          Print
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={() => console.log("Export clicked")}
          className="font-semibold"
        >
          <Download />
          Export to csv
        </Button>
      </div>
    </Card>
  );
}
