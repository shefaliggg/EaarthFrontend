import { format } from "date-fns";
import { getProductionWeekLabel, getPhaseForDate } from "../productionPhases";

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

function getEventColor(productionPhase) {
  switch (productionPhase) {
    case "shoot": return colors.shoot;
    case "prep":  return colors.prep;
    case "wrap":  return colors.wrap;
    default:      return colors.total;
  }
}

function getPhaseColor(phaseName) {
  switch (phaseName) {
    case "Prep":  return colors.prep;
    case "Shoot": return colors.shoot;
    case "Wrap":  return colors.wrap;
    default:      return colors.total;
  }
}

/* Normalize timed events for the specific day */
function normalizeDayEvents(events, date) {
  const dateStr = format(date, "yyyy-MM-dd");
  const output = [];

  for (const e of events) {
    if (!e.startDateTime || e.allDay === true) continue;

    const start = new Date(e.startDateTime);
    const end   = new Date(e.endDateTime || e.startDateTime);

    const startDateStr = format(start, "yyyy-MM-dd");
    const endDateStr   = format(end,   "yyyy-MM-dd");

    const target = new Date(date); target.setHours(0, 0, 0, 0);
    const s      = new Date(start); s.setHours(0, 0, 0, 0);
    const en     = new Date(end);   en.setHours(0, 0, 0, 0);

    if (target < s || target > en) continue;

    const isFirst = dateStr === startDateStr;
    const isLast  = dateStr === endDateStr;

    let _start = 0, _end = DAY_MINUTES;
    if (isFirst) _start = timeToMinutes(format(start, "h:mm a")) ?? 0;
    if (isLast)  _end   = timeToMinutes(format(end,   "h:mm a")) ?? DAY_MINUTES;

    output.push({ ...e, _start, _end });
  }
  return output;
}

function getAllDayEvents(events, date) {
  return events.filter((e) => {
    if (!e.startDateTime || e.allDay !== true) return false;
    const start  = new Date(e.startDateTime);
    const end    = new Date(e.endDateTime || e.startDateTime);
    const target = new Date(date); target.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0); end.setHours(0, 0, 0, 0);
    return target >= start && target <= end;
  });
}

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
function CalendarDayPDF({ currentDate, events }) {
  const hours      = Array.from({ length: 24 }, (_, i) => i);
  const dayEvents  = normalizeDayEvents(events, currentDate);
  const allDayEvts = getAllDayEvents(events, currentDate);
  const columns    = layoutEvents(dayEvents);
  const totalH     = 24 * HOUR_HEIGHT;

  const dateStr    = format(currentDate, "yyyy-MM-dd");
  const weekLabel  = getProductionWeekLabel(dateStr) || "";
  const phase      = getPhaseForDate ? getPhaseForDate(dateStr) : null;
  const phaseColor = phase ? getPhaseColor(phase.name) : colors.total;

  const isToday = dateStr === format(new Date(), "yyyy-MM-dd");

  const totalEvents = events.length;
  const shootEvents = events.filter((e) => e.productionPhase === "shoot").length;
  const prepEvents  = events.filter((e) => e.productionPhase === "prep").length;
  const wrapEvents  = events.filter((e) => e.productionPhase === "wrap").length;

  const cellBorder   = `1px solid ${colors.purple200}`;
  const gridTemplate = `44px 1fr`;

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
              {format(currentDate, "EEEE, dd MMMM yyyy")}
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

      {/* ── DAY HEADER ROW ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: gridTemplate,
          borderTop: cellBorder,
          borderLeft: cellBorder,
        }}
      >
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
        <div
          style={{
            position: "relative",
            padding: "6px 4px",
            textAlign: "center",
            backgroundColor: isToday ? colors.purple100 : colors.purple50,
            borderRight: cellBorder,
            borderBottom: cellBorder,
          }}
        >
          {weekLabel ? (
            <div
              style={{
                position: "absolute",
                top: "6px",
                right: "8px",
                padding: "2px 8px",
                borderRadius: "999px",
                backgroundColor: phaseColor.bg,
                color: phaseColor.text,
                border: `1px solid ${phaseColor.border}`,
                fontSize: "9px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {weekLabel}
            </div>
          ) : null}

          <div style={{ fontSize: "9px", fontWeight: "900", color: colors.purple800, textTransform: "uppercase" }}>
            {format(currentDate, "EEEE")}
          </div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "900",
              color: colors.purple800,
              backgroundColor: isToday ? colors.purple200 : "transparent",
              borderRadius: "50%",
              width: "26px",
              height: "26px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "2px auto 0",
            }}
          >
            {format(currentDate, "d")}
          </div>
        </div>
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
        <div
          style={{
            padding: "3px 6px",
            borderRight: cellBorder,
            borderBottom: cellBorder,
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "4px",
            minHeight: "28px",
            alignItems: "flex-start",
          }}
        >
          {allDayEvts.length === 0 ? (
            <div style={{ fontSize: "7px", color: colors.textLight, fontStyle: "italic", padding: "2px 4px" }}>
              No all-day events
            </div>
          ) : (
            allDayEvts.map((e, i) => {
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
                    padding: "2px 6px",
                    borderRadius: "2px",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  {e.title}
                </div>
              );
            })
          )}
        </div>
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

        {/* Single day column */}
        <div
          style={{
            position: "relative",
            borderRight: cellBorder,
            height: `${totalH}px`,
          }}
        >
          {/* Hour grid lines */}
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
              }}
            />
          ))}

          {/* Events */}
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
                    padding: "2px 6px",
                    borderRadius: "2px",
                    overflow: "hidden",
                    boxSizing: "border-box",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: "2px",
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
                  {evtHeight > 20 && (
                    <div style={{ fontSize: "6px", fontWeight: "600", color: c.text, opacity: 0.8 }}>
                      {format(new Date(e.startDateTime), "h:mm a")}
                      {e.endDateTime && ` – ${format(new Date(e.endDateTime), "h:mm a")}`}
                    </div>
                  )}
                  {evtHeight > 32 && e.location && (
                    <div
                      style={{
                        fontSize: "6px",
                        fontWeight: "600",
                        color: colors.textMuted,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        borderTop: `1px solid ${c.border}40`,
                        paddingTop: "1px",
                        marginTop: "1px",
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

export default CalendarDayPDF;