import { AlertTriangle, Edit3, MapPin } from "lucide-react";
import { cn } from "@/shared/config/utils";
import { Button } from "@/shared/components/ui/button";

function CalendarConflictsView({ conflicts, onEditEvent }) {
  if (!conflicts || conflicts.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-green-500 opacity-20" />
        <p className="text-muted-foreground">No scheduling conflicts detected!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-6 h-6 text-red-500" />
        <div>
          <h3 className="font-bold">Schedule Conflicts</h3>
          <p className="text-sm text-muted-foreground">
            {conflicts.length} conflict{conflicts.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {conflicts.map((conflict, idx) => (
        <div
          key={idx}
          className="p-4 rounded-xl border border-red-400/40 bg-red-50 dark:bg-red-950/20"
        >
          <h4 className="font-bold text-red-600 mb-3">
            Schedule Overlap Detected
          </h4>

          {/* Event 1 */}
          <div className="p-3 rounded-lg bg-card mb-2 border">
            <div className="flex justify-between items-start gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className={cn("w-3 h-3 rounded", conflict.event1.color)} />
                  <p className="font-bold">{conflict.event1.title}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {conflict.event1.date} • {conflict.event1.startTime} - {conflict.event1.endTime}
                </p>
                {conflict.event1.location && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {conflict.event1.location}
                  </p>
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => onEditEvent(conflict.event1)}
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Event 2 */}
          <div className="p-3 rounded-lg bg-card border">
            <div className="flex justify-between items-start gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className={cn("w-3 h-3 rounded", conflict.event2.color)} />
                  <p className="font-bold">{conflict.event2.title}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {conflict.event2.date} • {conflict.event2.startTime} - {conflict.event2.endTime}
                </p>
                {conflict.event2.location && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {conflict.event2.location}
                  </p>
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => onEditEvent(conflict.event2)}
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Attendees */}
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs font-bold mb-2">Conflicting Attendees:</p>
            <div className="flex flex-wrap gap-2">
              {conflict.attendees.map((attendee, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs rounded-full bg-muted text-foreground"
                >
                  {attendee}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CalendarConflictsView;
