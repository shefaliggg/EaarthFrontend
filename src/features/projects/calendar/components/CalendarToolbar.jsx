import { Button } from "@/shared/components/ui/button";
import { InfoTooltip } from "@/shared/components/InfoTooltip";
import { format } from "date-fns";
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
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plane,
  Clapperboard,
  Settings,
  Eye,
  Filter,
  X
} from "lucide-react";

import SearchBar from "@/shared/components/SearchBar";
import CalendarFilterTabs from "./CalendarFilterTabs";
import { useNavigate, useParams } from "react-router-dom";

function CalendarToolbar({
  currentDate,
  eventsCount,
  filters,
  updateFilter,
  resetFilters,
  departments,
  crewMembers,
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

  return (
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
          value={filters.search}
          onValueChange={(e) => updateFilter("search", e.target.value)}
        />

        <Popover>
          <PopoverTrigger asChild>
             <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/90">
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

        <div>
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
          <Button variant="default" size="icon" onClick={() => navigate(`/projects/${projectName}/calendar/shooting`)}>
            <Clapperboard className="w-4 h-4" />
          </Button>
        </InfoTooltip>

        <InfoTooltip content="TMO">
          <Button variant="default" size="icon" onClick={() => navigate(`/projects/${projectName}/calendar/tmo`)}>
            <Plane className="w-4 h-4" />
          </Button>
        </InfoTooltip>

        <InfoTooltip content="Settings">
          <Button variant="default" size="icon" onClick={() => navigate(`/projects/${projectName}/calendar/settings`)}>
            <Settings className="w-4 h-4" />
          </Button>
        </InfoTooltip>

        <InfoTooltip content="PDF Preview">
          <Button variant="default" size="icon" onClick={() => navigate(`/projects/${projectName}/calendar/preview`)}>
            <Eye className="w-4 h-4" />
          </Button>
        </InfoTooltip>
      </div>
    </div>
  );
}

export default CalendarToolbar;