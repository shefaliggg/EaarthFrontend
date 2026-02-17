import { useMemo, useState } from "react";
import useCalendar from "@/features/projects/calendar/hooks/useCalendar";
import { motion as Motion } from "framer-motion";
import { SelectMenu } from "@/shared/components/menus/SelectMenu";
import { WeekNavigator } from "@/shared/components/buttons/WeekNavigator";
import PrimaryStats from "@/shared/components/wrappers/PrimaryStats";
import { Card } from "@/shared/components/ui/card";
import { CardContent } from "@/shared/components/ui/card";
import {
  addDays,
  addHours,
  addMinutes,
  startOfWeek,
  format,
  isWeekend,
  differenceInMinutes,
} from "date-fns";
import { cn } from "@/shared/config/utils";
import { Badge } from "@/shared/components/ui/badge";
import { StatusBadge } from "@/shared/components/badges/StatusBadge";
import { Clock, MapPin, Zap } from "lucide-react";

function getWeekDays(date) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

function getEventsForDate(events, dateStr) {
  return events.filter((event) => {
    if (!event.startDateTime) return false;
    const start = new Date(event.startDateTime);
    const end = event.endDateTime ? new Date(event.endDateTime) : start;
    const current = new Date(dateStr + "T12:00:00");
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return current >= start && current <= end;
  });
}

function minutesToHours(min) {
  if (!min || min <= 0) return null;
  return (min / 60).toFixed(1);
}

function getTotalHoursForDay(dayEvents, dateStr) {
  if (!dayEvents.length) return null;

  const dayStart = new Date(dateStr + "T00:00:00");
  const dayEnd = new Date(dateStr + "T23:59:59");

  const intervals = dayEvents
    .map((event) => {
      const eventStart = new Date(event.startDateTime);
      const eventEnd = new Date(event.endDateTime || event.startDateTime);

      const start = eventStart < dayStart ? dayStart : eventStart;
      const end = eventEnd > dayEnd ? dayEnd : eventEnd;

      if (start >= end) return null;
      return { start, end };
    })
    .filter(Boolean)
    .sort((a, b) => a.start - b.start);

  if (!intervals.length) return null;

  const merged = [];
  for (const interval of intervals) {
    const last = merged[merged.length - 1];
    if (!last || interval.start > last.end) {
      merged.push({ ...interval });
    } else if (interval.end > last.end) {
      last.end = interval.end;
    }
  }

  const totalMinutes = merged.reduce(
    (acc, interval) => acc + differenceInMinutes(interval.end, interval.start),
    0,
  );

  return minutesToHours(totalMinutes);
}

function getUniqueLocations(dayEvents) {
  const set = new Set(dayEvents.map((e) => e.location).filter(Boolean));
  return Array.from(set);
}

function isPublicHoliday(date) {
  const holidays = [
    "2026-02-21", 
    "2026-02-22", 
  ];
  return holidays.includes(format(date, "yyyy-MM-dd"));
}


function buildShootDayNumbers(events) {
  const shootDays = [];
  events.forEach((event) => {
    if (event.eventType !== "shoot") return;
    let start = new Date(event.startDateTime);
    let end = new Date(event.endDateTime || event.startDateTime);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    while (start <= end) {
      shootDays.push(format(start, "yyyy-MM-dd"));
      start = addDays(start, 1);
    }
  });
  const uniqueDays = Array.from(new Set(shootDays)).sort();
  const map = {};
  uniqueDays.forEach((day, idx) => {
    map[day] = idx + 1;
  });
  return map;
}

function getDailyTimeWindow(dayEvents, dateStr) {
  if (!dayEvents.length) return null;

  const dayStart = new Date(dateStr + "T00:00:00");
  const dayEnd = new Date(dateStr + "T23:59:59");

  let earliest = null;
  let latest = null;

  dayEvents.forEach((event) => {
    const eventStart = new Date(event.startDateTime);
    const eventEnd = new Date(event.endDateTime || event.startDateTime);

    const start = eventStart < dayStart ? dayStart : eventStart;
    const end = eventEnd > dayEnd ? dayEnd : eventEnd;

    if (!earliest || start < earliest) earliest = start;
    if (!latest || end > latest) latest = end;
  });

  if (!earliest || !latest) return null;
  return { earliest, latest, dayStart };
}

function toTimeLabel(date, dayStart) {
  if (!date) return null;
  return {
    time: format(date, "h:mm a"),
    nextDay: date.getDate() !== dayStart.getDate(),
  };
}

function ShootingCalendar() {
  const { currentDate, prev, next, today, events } = useCalendar();
  const [selectedUnit, setSelectedUnit] = useState("main");
  
  const shootEvents = useMemo(() => {
    return events.filter(
      (e) => e.eventType === "shoot" && e.startDateTime && e.endDateTime,
    );
  }, [events]);

  const unitFilteredEvents = useMemo(() => {
    if (selectedUnit === "main") {
      return shootEvents.filter(
        (e) => e.unit !== "splinter" && e.unit !== "vfx",
      );
    }
    if (selectedUnit === "splinter") {
      return shootEvents.filter((e) => e.unit === "splinter");
    }
    if (selectedUnit === "vfx") {
      return shootEvents.filter((e) => e.unit === "vfx");
    }
    return shootEvents;
  }, [shootEvents, selectedUnit]);

  const shootDayNumbers = useMemo(
    () => buildShootDayNumbers(unitFilteredEvents),
    [unitFilteredEvents],
  );

  const daysToRender = useMemo(() => {
    return getWeekDays(currentDate).map((date) => {
      const key = format(date, "yyyy-MM-dd");
      const dayEvents = getEventsForDate(unitFilteredEvents, key);

      const dayType = dayEvents.some((e) => e.eventType === "shoot")
        ? "Shoot"
        : "Rest";

      // 1. Total Hours Logic: Keeps "Elapsed Time" (Door-to-Door)
      const workingHours = getTotalHoursForDay(dayEvents, key);
      
      const locations = getUniqueLocations(dayEvents);
      const timeWindow = getDailyTimeWindow(dayEvents, key);

      // Times
      const unitCall = timeWindow
        ? toTimeLabel(timeWindow.earliest, timeWindow.dayStart)
        : null;
      const unitWrap = timeWindow
        ? toTimeLabel(timeWindow.latest, timeWindow.dayStart)
        : null;

      const mealStartTime = timeWindow
        ? addHours(timeWindow.earliest, 6)
        : null;

      const mealEndTime = mealStartTime ? addMinutes(mealStartTime, 30) : null;

      // 2. Camera O/T Logic: Dynamic Calculation (Standard Day: 12 Hours)
      // If workingHours > 12, the remainder is OT.
      let cameraOvertime = null;
      if (workingHours) {
        const hoursNum = parseFloat(workingHours);
        const STANDARD_DAY = 12;
        if (hoursNum > STANDARD_DAY) {
            cameraOvertime = (hoursNum - STANDARD_DAY).toFixed(1);
        }
      }

      return {
        date,
        key,
        dayType,
        dayNumber: shootDayNumbers[key] ?? null,
        workplaces: locations,
        workingHours: workingHours ? `${workingHours}h` : null,

        travelTo: null,
        travelToPaid: null,
        travelFrom: null,
        travelFromPaid: null,

        unitCall: unitCall,
        mealStart: mealStartTime
          ? toTimeLabel(mealStartTime, timeWindow.dayStart)
          : null,
        mealEnd: mealEndTime
          ? toTimeLabel(mealEndTime, timeWindow.dayStart)
          : null,
        
        // Example logic for Late Meal penalty (simplified)
        lateMeal: workingHours ? { amount: 25, paid: true } : null,
        
        unitWrap: unitWrap,
        
        // Updated Camera OT value
        cameraOT: cameraOvertime,
        
        nightPenalty: !!workingHours,

        isPublicHoliday: isPublicHoliday(date),

        isWeekend: isWeekend(date),
      };
    });
  }, [currentDate, shootDayNumbers, unitFilteredEvents]);

  const summaryStats = useMemo(() => {
    const shootDays = daysToRender.filter((d) => d.dayType === "Shoot").length;
    const restDays = daysToRender.filter((d) => d.dayType === "Rest").length;
    
    const totalHours = daysToRender.reduce((acc, d) => {
      const h = d.workingHours ? parseFloat(d.workingHours) : 0;
      return acc + h;
    }, 0);
    
    const allLocations = new Set();
    daysToRender.forEach((d) =>
      d.workplaces.forEach((loc) => allLocations.add(loc)),
    );
    
    const totalCameraOT = daysToRender.reduce((acc, d) => {
      const ot = d.cameraOT ? parseFloat(d.cameraOT) : 0;
      return acc + ot;
    }, 0);

    return [
      {
        label: "Shoot Days",
        value: shootDays,
        icon: "Activity",
        iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
        iconColor: "text-emerald-600 dark:text-emerald-400",
      },
      {
        label: "Rest Days",
        value: restDays,
        icon: "Coffee",
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
      {
        label: "Total Hours",
        value: totalHours ? `${totalHours.toFixed(1)}h` : "—",
        icon: "Clock",
        iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
        iconColor: "text-yellow-600 dark:text-yellow-400",
      },
      {
        label: "Locations",
        value: allLocations.size || "—",
        icon: "MapPin",
        iconBg: "bg-violet-100 dark:bg-violet-900/30",
        iconColor: "text-violet-600 dark:text-violet-400",
      },
      {
        label: "Camera O/T",
        value: totalCameraOT ? `${totalCameraOT.toFixed(1)}h` : "—",
        icon: "Zap",
        iconBg: "bg-orange-100 dark:bg-orange-900/30",
        iconColor: "text-orange-600 dark:text-orange-400",
      },
    ];
  }, [daysToRender]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SelectMenu
          selected={selectedUnit}
          onSelect={setSelectedUnit}
          items={[
            { label: "Main", value: "main" },
            { label: "Splinter Camera", value: "splinter" },
            { label: "VFX Elements", value: "vfx" },
          ]}
          label="Select Unit"
        />

        <WeekNavigator
          currentDate={currentDate}
          onPreviousWeek={prev}
          onNextWeek={next}
          onGoToCurrentWeek={today}
        />
      </div>

      <PrimaryStats stats={summaryStats} gridColumns={5} />

      <Motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <Card className="py-0 border-primary">
          <CardContent className="p-0">
            <div className="overflow-x-auto rounded-3xl">
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-card/80 backdrop-blur border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground w-[150px] sticky left-0 bg-card border-r">
                      Date
                    </th>
                    {daysToRender.map((day) => {
                      const weekend = day.isWeekend;

                      return (
                        <th
                          key={day.key}
                          className={cn(
                            "px-3 py-3 text-center min-w-36 border-r last:border-r-0",
                            weekend && "bg-muted/40",
                          )}
                        >
                          <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            {format(day.date, "EEE")}
                          </div>
                          <div className="text-xl font-semibold">
                            {format(day.date, "d")}
                          </div>
                          {day.isPublicHoliday && (
                            <Badge
                              variant="destructive"
                              className="mt-2 text-[10px]"
                            >
                              Holiday
                            </Badge>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr className={`border-b `}>
                    <td className="px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r">
                      Day Type
                    </td>
                    {daysToRender.map((day, index) => {
                      const dayType = day.dayType;

                      return (
                        <td
                          key={index}
                          className={`px-3 py-3 text-center border-r last:border-r-0 ${
                            day.isWeekend
                              ? "bg-primary/10  dark:bg-primary/10"
                              : ""
                          }`}
                        >
                          <Badge
                            variant={
                              dayType === "Shoot"
                                ? "default"
                                : dayType === "Rest"
                                  ? "outline"
                                  : "secondary"
                            }
                          >
                            {dayType}
                          </Badge>
                        </td>
                      );
                    })}
                  </tr>

                  <tr className="border-b">
                    <td className="px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r">
                      Day #
                    </td>

                    {daysToRender.map((day) => (
                      <td
                        key={day.key}
                        className={cn(
                          "px-3 py-3 text-center font-bold border-r last:border-r-0",
                          day.isWeekend && "bg-primary/10 dark:bg-primary/10",
                        )}
                      >
                        {day.dayNumber ?? "—"}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b">
                    <td className="px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r">
                      Locations
                    </td>

                    {daysToRender.map((day) => (
                      <td
                        key={day.key}
                        className={cn(
                          "px-3 py-3 text-center border-r last:border-r-0",
                          day.isWeekend && "bg-primary/10 dark:bg-primary/10",
                        )}
                      >
                        {day.workplaces.length > 0 ? (
                          <div className="flex flex-col gap-1 items-center">
                            <StatusBadge
                              icon={MapPin}
                              className={"bg-primary/10 text-primary"}
                              size="sm"
                              label={day.workplaces.length}
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground opacity-30">
                            —
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  <tr className={`bg-card border-y `}>
                    <td colSpan={8} className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                          Schedule & Times
                        </span>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r">
                      Hours
                    </td>

                    {daysToRender.map((day) => (
                      <td
                        key={day.key}
                        className={cn(
                          "px-3 py-3 text-center font-bold border-r last:border-r-0",
                          day.isWeekend && "bg-primary/10 dark:bg-primary/10",
                        )}
                      >
                        {day.workingHours ?? (
                          <span className="text-xs text-muted-foreground opacity-30">
                            —
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b">
                    <td className="px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r">
                      Travel To
                    </td>

                    {daysToRender.map((day) => (
                      <td
                        key={day.key}
                        className={cn(
                          "px-3 py-3 text-center border-r last:border-r-0",
                          day.isWeekend && "bg-primary/10 dark:bg-primary/10",
                        )}
                      >
                        {day.travelTo ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="font-bold">{day.travelTo}h</span>
                            {day.travelToPaid && (
                              <span
                                className={cn(
                                  "text-[9px] font-bold uppercase px-1.5 py-0.5 rounded",
                                  day.travelToPaid === "Paid"
                                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                                    : "bg-gray-100 dark:bg-gray-800 text-muted-foreground",
                                )}
                              >
                                {day.travelToPaid === "Paid" ? "PD" : "INC"}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground opacity-30">
                            —
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b">
                    <td className="px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r">
                      Unit Call
                    </td>

                    {daysToRender.map((day) => (
                      <td
                        key={day.key}
                        className={cn(
                          "px-3 py-3 text-center border-r last:border-r-0",
                          day.isWeekend && "bg-primary/10 dark:bg-primary/10",
                        )}
                      >
                        {day.unitCall ? (
                          <div className="text-sm font-black text-purple-600 dark:text-purple-400">
                            {day.unitCall.time}
                            {day.unitCall.nextDay && (
                              <span className="ml-1 text-[9px] uppercase opacity-70">
                                +1
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground opacity-30">
                            —
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b">
                    <td className="px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r">
                      Meal Start
                    </td>

                    {daysToRender.map((day) => (
                      <td
                        key={day.key}
                        className={cn(
                          "px-3 py-3 text-center border-r last:border-r-0",
                          day.isWeekend && "bg-primary/10 dark:bg-primary/10",
                        )}
                      >
                        {day.mealStart ? (
                          <div className="text-sm font-medium">
                            {day.mealStart.time}
                            {day.mealStart.nextDay && (
                              <span className="ml-1 text-[9px] uppercase opacity-70">
                                +1
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground opacity-30">
                            —
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b">
                    <td className="px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r">
                      Meal End
                    </td>

                    {daysToRender.map((day) => (
                      <td
                        key={day.key}
                        className={cn(
                          "px-3 py-3 text-center border-r last:border-r-0",
                          day.isWeekend && "bg-primary/10 dark:bg-primary/10",
                        )}
                      >
                        {day.mealEnd ? (
                          <div className="text-sm font-medium">
                            {day.mealEnd.time}
                            {day.mealEnd.nextDay && (
                              <span className="ml-1 text-[9px] uppercase opacity-70">
                                +1
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground opacity-30">
                            —
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b">
                    <td className="px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r">
                      Unit Wrap
                    </td>

                    {daysToRender.map((day) => (
                      <td
                        key={day.key}
                        className={cn(
                          "px-3 py-3 text-center border-r last:border-r-0",
                          day.isWeekend && "bg-primary/10 dark:bg-primary/10",
                        )}
                      >
                        {day.unitWrap ? (
                          <div className="text-sm font-black text-purple-600 dark:text-purple-400">
                            {day.unitWrap.time}
                            {day.unitWrap.nextDay && (
                              <span className="ml-1 text-[9px] uppercase opacity-70">
                                +1
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground opacity-30">
                            —
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b">
                    <td className="px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r">
                      Travel From
                    </td>

                    {daysToRender.map((day) => (
                      <td
                        key={day.key}
                        className={cn(
                          "px-3 py-3 text-center border-r last:border-r-0",
                          day.isWeekend && "bg-primary/10 dark:bg-primary/10",
                        )}
                      >
                        {day.travelFrom ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="font-bold">{day.travelFrom}h</span>
                            {day.travelFromPaid && (
                              <span
                                className={cn(
                                  "text-[9px] font-bold uppercase px-1.5 py-0.5 rounded",
                                  day.travelFromPaid === "Paid"
                                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                                    : "bg-gray-100 dark:bg-gray-800 text-muted-foreground",
                                )}
                              >
                                {day.travelFromPaid === "Paid" ? "PD" : "INC"}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground opacity-30">
                            —
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  <tr className={`bg-card border-y `}>
                    <td colSpan={8} className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                          Penalties & Overtime
                        </span>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r">
                      Late Meal
                    </td>

                    {daysToRender.map((day) => (
                      <td
                        key={day.key}
                        className={cn(
                          "px-3 py-3 text-center border-r last:border-r-0",
                          day.isWeekend && "bg-primary/10 dark:bg-primary/10",
                        )}
                      >
                        {day.lateMeal ? (
                          <span
                            className={cn(
                              "font-bold",
                              day.lateMeal.paid
                                ? "text-red-600 dark:text-red-400"
                                : "text-muted-foreground",
                            )}
                          >
                            {day.lateMeal.amount}
                            {day.lateMeal.paid ? "" : " (Unpaid)"}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground opacity-30">
                            —
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b">
                    <td className="px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r">
                      Camera O/T
                    </td>

                    {daysToRender.map((day) => (
                      <td
                        key={day.key}
                        className={cn(
                          "px-3 py-3 text-center border-r last:border-r-0",
                          day.isWeekend && "bg-primary/10 dark:bg-primary/10",
                        )}
                      >
                        {day.cameraOT ? (
                          <span className="text-amber-600 dark:text-amber-400 font-bold">
                            {day.cameraOT}h
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground opacity-30">
                            —
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b">
                    <td className="px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r">
                      Night Penalty
                    </td>

                    {daysToRender.map((day) => (
                      <td
                        key={day.key}
                        className={cn(
                          "px-3 py-3 text-center border-r last:border-r-0",
                          day.isWeekend && "bg-primary/10 dark:bg-primary/10",
                        )}
                      >
                        {day.nightPenalty ? (
                          <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs uppercase px-2.5 py-1 rounded-lg font-black tracking-wider">
                            Paid
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground opacity-30">
                            —
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </Motion.div>
    </div>
  );
}

export default ShootingCalendar;