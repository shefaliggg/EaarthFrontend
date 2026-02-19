import { Button } from "@/shared/components/ui/button";
import { InfoTooltip } from "@/shared/components/InfoTooltip";
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
  Plane,
  Clapperboard,
  Settings,
  Eye,
} from "lucide-react";

import SearchBar from "@/shared/components/SearchBar";
import CalendarFilterTabs from "./CalendarFilterTabs";
import { useNavigate, useParams } from "react-router-dom";

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
  const navigate = useNavigate();
  const { projectName } = useParams();

  const getTitle = () => {
    switch (view) {
      case "year":
      case "gantt":
        return format(currentDate, "yyyy");
      case "month":
      case "timeline":
      case "conflicts":
      case "analytics":
        return format(currentDate, "MMMM yyyy");
      default:
        return format(currentDate, "dd EEE MMM yyyy");
    }
  };

  const getSubtitle = () => {
    return `${eventsCount} events scheduled`;
  };

  return (
    <>
      <div className="rounded-xl overflow-hidden border border-primary/20 shadow-lg bg-card p-4">
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
            <CalendarFilterTabs
              options={[
                { value: "day", label: "Day" },
                { value: "week", label: "Week" },
                { value: "month", label: "Month" },
                { value: "year", label: "Year" },
                { value: "gantt", label: "Gantt" },
                { value: "timeline", label: "Timeline" },
                { value: "analytics", label: "Analytics" },
                { value: "conflicts", label: "", icon: "AlertTriangle" },
              ]}
              value={view}
              onChange={setView}
            />
          </div>

          <InfoTooltip content="Shooting Calendar">
            <Button
              variant="default"
              size="icon"
              onClick={() =>
                navigate(`/projects/${projectName}/calendar/shooting`)
              }
            >
              <Clapperboard className="w-4 h-4" />
            </Button>
          </InfoTooltip>

          <InfoTooltip content="TMO">
            <Button
              variant="default"
              size="icon"
              onClick={() => navigate(`/projects/${projectName}/calendar/tmo`)}
            >
              <Plane className="w-4 h-4" />
            </Button>
          </InfoTooltip>

          <InfoTooltip content="Settings">
            <Button
              variant="default"
              size="icon"
              onClick={() =>
                navigate(`/projects/${projectName}/calendar/settings`)
              }
            >
              <Settings className="w-4 h-4" />
            </Button>
          </InfoTooltip>

          <InfoTooltip content="PDF Preview">
            <Button 
              variant="default" 
              size="icon" 
              onClick={() => navigate(`/projects/${projectName}/calendar/preview`)}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </InfoTooltip>
        </div>
      </div>
    </>
  );
}

export default CalendarToolbar;