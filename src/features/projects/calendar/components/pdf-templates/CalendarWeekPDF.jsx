import {
  format,
  startOfWeek,
  addDays,
} from "date-fns";
import { getProductionWeekLabel } from "../productionPhases";

/* ─── CONFIG ─── */
const HOUR_HEIGHT = 32;
const DAY_MINUTES = 1440;
const MIN_EVENT_HEIGHT = 14;

const colors = {
  white: "#ffffff",
  background: "#FAFAFA",
  textMain: "#111827",
  textMuted: "#6b7280",
  textLight: "#9ca3af",

  purple50: "#faf5ff",
  purple100: "#f3e8ff",
  purple200: "#e9d5ff",
  purple600: "#9333ea",
  purple800: "#6b21a8",
  purple900: "#581c87",

  shoot: { bg: "#FFEDD5", text: "#9A3412", border: "#FB923C", label: "SHOOT" },
  prep:  { bg: "#E0F2FE", text: "#075985", border: "#38BDF8", label: "PREP"  },
  wrap:  { bg: "#A7F3D0", text: "#064E3B", border: "#34D399", label: "WRAP"  },
  total: { bg: "#f3e8ff", text: "#581c87", border: "#c084fc", label: "TOTAL" },
};

/* ─── HELPERS ─── */
function timeToMinutes(time) {
  if (!time) return null;
  const [clock, period] = time.split(" ");
  let [h, m] = clock.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

const formatHour = (h) => `${h % 12 || 12}${h < 12 ? "am" : "pm"}`;

function getWeek(date) {
  return Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(date), i));
}

function getEventColor(productionPhase) {
  switch (productionPhase) {
    case "shoot": return colors.shoot;
    case "prep":  return colors.prep;
    case "wrap":  return colors.wrap;
    default:      return colors.total;
  }
}

/* Normalize multi-day events into per-day slices */
function normalizeWeekEvents(events) {
  const output = [];
  for (const e of events) {
    if (!e.startDateTime) continue;
    const start = new Date(e.startDateTime);
    const end   = new Date(e.endDateTime || e.startDateTime);
    let current = new Date(start); current.setHours(0,0,0,0);
    const endDate = new Date(end); endDate.setHours(0,0,0,0);

    while (current <= endDate) {
      const currentDateStr = format(current, "yyyy-MM-dd");
      const isFirst = currentDateStr === format(start, "yyyy-MM-dd");
      const isLast  = currentDateStr === format(end,   "yyyy-MM-dd");
      let _start = 0, _end = DAY_MINUTES;
      if (!e.allDay) {
        if (isFirst) _start = timeToMinutes(format(start, "h:mm a")) ?? 0;
        if (isLast)  _end   = timeToMinutes(format(end,   "h:mm a")) ?? DAY_MINUTES;
      }
      output.push({ ...e, _currentDate: currentDateStr, _start, _end });
      current = addDays(current, 1);
    }
  }
  return output;
}

/* Simple column-layout for overlapping events */
function layoutEvents(events) {
  const columns = [];
  for (const event of events) {
    let placed = false;
    for (const col of columns) {
      if (event._start >= col[col.length - 1]._end) { col.push(event); placed = true; break; }
    }
    if (!placed) columns.push([event]);
  }
  return columns;
}

/* ─── COMPONENT ─── */
function CalendarWeekPDF({ currentDate, events }) {
  const week       = getWeek(currentDate);
  const hours      = Array.from({ length: 24 }, (_, i) => i);
  const normalized = normalizeWeekEvents(events);
  const weekLabel  = getProductionWeekLabel(format(week[0], "yyyy-MM-dd")) || "";

  const isToday = (date) =>
    format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  const totalEvents = events.length;
  const shootEvents = events.filter((e) => e.productionPhase === "shoot").length;
  const prepEvents  = events.filter((e) => e.productionPhase === "prep").length;
  const wrapEvents  = events.filter((e) => e.productionPhase === "wrap").length;

  const allDayForDay = (date) =>
    normalized.filter(
      (e) => e._currentDate === format(date, "yyyy-MM-dd") && e.allDay,
    );

  const timedForDay = (date) =>
    normalized.filter(
      (e) => e._currentDate === format(date, "yyyy-MM-dd") && !e.allDay,
    );

  const cellBorder = `1px solid ${colors.purple200}`;
  const timeColW   = 44;
  const dayColW    = `${(100 - 0) / 7}%`;

  /* Grid template: time-col + 7 day cols */
  const gridTemplate = `${timeColW}px repeat(7, 1fr)`;

  return (
    <div
      style={{
        width: "1122px",
        padding: "20px",
        backgroundColor: colors.white,
        boxSizing: "border-box",
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "10px",
          paddingBottom: "8px",
          borderBottom: `3px solid ${colors.purple600}`,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: colors.purple600,
              margin: "0 0 4px 0",
            }}
          >
            Project Calendar
          </h1>
          <div style={{ fontSize: "11px", fontWeight: "700", color: colors.textMuted }}>
            RAINBOW STUDIOS
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              display: "inline-block",
              padding: "6px 14px",
              borderRadius: "6px",
              backgroundColor: colors.purple100,
              marginBottom: "6px",
            }}
          >
            <span style={{ fontWeight: "900", color: colors.purple600, fontSize: "13px" }}>
              {format(week[0], "dd MMM")} – {format(week[6], "dd MMM yyyy")}
            </span>
          </div>
          <div>
            <span style={{ fontSize: "8px", fontWeight: "700", color: colors.purple600, display: "block", textTransform: "uppercase" }}>
              PROJECT
            </span>
            <span style={{ fontSize: "11px", fontWeight: "900", color: colors.purple600 }}>
              AVATAR 1
            </span>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "8px",
          marginBottom: "10px",
        }}
      >
        {[
          { displayLabel: "Total Events", value: totalEvents, ...colors.total },
          { displayLabel: "Prep Events",  value: prepEvents,  ...colors.prep  },
          { displayLabel: "Shoot Events", value: shootEvents, ...colors.shoot },
          { displayLabel: "Wrap Events",  value: wrapEvents,  ...colors.wrap  },
        ].map((stat) => (
          <div
            key={stat.displayLabel}
            style={{
              padding: "5px 10px",
              borderRadius: "4px",
              backgroundColor: stat.bg,
              border: `1px solid ${stat.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "9px", fontWeight: "700", color: colors.textMuted, textTransform: "uppercase" }}>
              {stat.displayLabel}
            </span>
            <span style={{ fontSize: "12px", fontWeight: "900", color: stat.text }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* ── WEEK PHASE BANNER ── */}
      <div
        style={{
          textAlign: "center",
          padding: "5px",
          backgroundColor: colors.purple50,
          border: cellBorder,
          borderBottom: "none",
          fontSize: "10px",
          fontWeight: "900",
          color: colors.purple800,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
        }}
      >
        {weekLabel}
      </div>

      {/* ── DAY HEADER ROW ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: gridTemplate,
          borderTop: cellBorder,
          borderLeft: cellBorder,
        }}
      >
        {/* empty time col header */}
        <div
          style={{
            padding: "6px 4px",
            backgroundColor: colors.purple50,
            borderRight: cellBorder,
            borderBottom: cellBorder,
            fontSize: "8px",
            fontWeight: "900",
            color: colors.textMuted,
            textAlign: "center",
          }}
        >
          TIME
        </div>
        {week.map((date) => (
          <div
            key={date.toString()}
            style={{
              padding: "6px 4px",
              textAlign: "center",
              backgroundColor: isToday(date) ? colors.purple100 : colors.purple50,
              borderRight: cellBorder,
              borderBottom: cellBorder,
            }}
          >
            <div style={{ fontSize: "9px", fontWeight: "900", color: colors.purple800, textTransform: "uppercase" }}>
              {format(date, "EEE")}
            </div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: "900",
                color: isToday(date) ? colors.white : colors.purple800,
                backgroundColor: isToday(date) ? colors.purple600 : "transparent",
                borderRadius: "50%",
                width: "22px",
                height: "22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "2px auto 0",
              }}
            >
              {format(date, "d")}
            </div>
          </div>
        ))}
      </div>

      {/* ── ALL-DAY ROW ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: gridTemplate,
          borderLeft: cellBorder,
          minHeight: "28px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRight: cellBorder,
            borderBottom: cellBorder,
            fontSize: "8px",
            fontWeight: "900",
            color: colors.purple800,
            backgroundColor: "#f3f4f6",
            textTransform: "uppercase",
          }}
        >
          All Day
        </div>
        {week.map((date) => {
          const allDayEvts = allDayForDay(date);
          return (
            <div
              key={date.toString()}
              style={{
                padding: "2px 3px",
                borderRight: cellBorder,
                borderBottom: cellBorder,
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                minHeight: "28px",
              }}
            >
              {allDayEvts.map((e, i) => {
                const c = getEventColor(e.productionPhase);
                return (
                  <div
                    key={i}
                    style={{
                      backgroundColor: c.bg,
                      borderLeft: `2px solid ${c.border}`,
                      color: c.text,
                      fontSize: "7px",
                      fontWeight: "700",
                      padding: "1px 3px",
                      borderRadius: "2px",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {e.title}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* ── TIME GRID ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: gridTemplate,
          borderLeft: cellBorder,
          position: "relative",
        }}
      >
        {/* Time axis */}
        <div>
          {hours.map((h) => (
            <div
              key={h}
              style={{
                height: `${HOUR_HEIGHT}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRight: cellBorder,
                borderBottom: cellBorder,
                backgroundColor: "#f3f4f6",
                fontSize: "7px",
                fontWeight: "700",
                color: colors.purple800,
              }}
            >
              {formatHour(h)}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {week.map((date) => {
          const timed   = timedForDay(date);
          const columns = layoutEvents(timed);
          const totalH  = 24 * HOUR_HEIGHT;

          return (
            <div
              key={date.toString()}
              style={{
                position: "relative",
                borderRight: cellBorder,
                height: `${totalH}px`,
              }}
            >
              {/* hour grid lines */}
              {hours.map((h) => (
                <div
                  key={h}
                  style={{
                    position: "absolute",
                    top: `${h * HOUR_HEIGHT}px`,
                    left: 0,
                    right: 0,
                    height: `${HOUR_HEIGHT}px`,
                    borderBottom: cellBorder,
                    backgroundColor: isToday(date) ? "#faf5ff" : "transparent",
                  }}
                />
              ))}

              {/* events overlay */}
              {columns.map((col, colIndex) =>
                col.map((e, i) => {
                  const c         = getEventColor(e.productionPhase);
                  const rawH      = ((e._end - e._start) / 60) * HOUR_HEIGHT;
                  const evtHeight = Math.max(rawH, MIN_EVENT_HEIGHT);
                  const colW      = 100 / columns.length;

                  return (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        top: `${(e._start / 60) * HOUR_HEIGHT}px`,
                        height: `${evtHeight}px`,
                        left: `${colW * colIndex}%`,
                        width: `${colW}%`,
                        backgroundColor: c.bg,
                        borderLeft: `2px solid ${c.border}`,
                        color: c.text,
                        fontSize: "7px",
                        fontWeight: "700",
                        padding: "2px 3px",
                        borderRadius: "2px",
                        overflow: "hidden",
                        boxSizing: "border-box",
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: "1px",
                        zIndex: 1,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "800",
                          textTransform: "uppercase",
                          lineHeight: "1.1",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {e.title}
                      </div>
                      {evtHeight > 22 && e.location && (
                        <div
                          style={{
                            fontSize: "6px",
                            fontWeight: "600",
                            color: colors.textMuted,
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {e.location}
                        </div>
                      )}
                    </div>
                  );
                }),
              )}
            </div>
          );
        })}
      </div>

      {/* ── FOOTER ── */}
      <div
        style={{
          marginTop: "8px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "8px",
          color: colors.textLight,
        }}
      >
        <div>Generated on {format(new Date(), "dd MMM yyyy HH:mm")}</div>
        <div>CONFIDENTIAL – PRODUCTION USE ONLY</div>
      </div>
    </div>
  );
}

export default CalendarWeekPDF;