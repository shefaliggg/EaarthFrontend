import { format, addDays, startOfWeek, endOfWeek } from "date-fns";

// ─── Helpers ───────────────────────────────────────────────────
function calculateProgress(startDateTime, endDateTime) {
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  today.setHours(12, 0, 0, 0);
  if (today <= start) return 0;
  if (today >= end) return 100;
  return Math.round(((today - start) / (end - start)) * 100);
}

function getCurrentWeekDays(referenceDate) {
  const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

function filterEventsByWeek(events, weekDays) {
  const weekStart = new Date(weekDays[0]); weekStart.setHours(0, 0, 0, 0);
  const weekEnd   = new Date(weekDays[6]); weekEnd.setHours(23, 59, 59, 999);
  return events.filter((e) => {
    if (!e.startDateTime || !e.endDateTime) return false;
    return new Date(e.startDateTime) <= weekEnd && new Date(e.endDateTime) >= weekStart;
  });
}

// ─── Constants ─────────────────────────────────────────────────
const colors = {
  white: "#ffffff",
  textMain: "#111827",
  textMuted: "#6b7280",
  textLight: "#9ca3af",
  purple50: "#faf5ff",
  purple100: "#f3e8ff",
  purple200: "#e9d5ff",
  purple600: "#9333ea",
  purple800: "#6b21a8",
  gridLine: "#e9d5ff",
  todayLine: "#ef4444",
  prep:  { bg: "#e0f2fe", text: "#075985", border: "#38bdf8", barFill: "#7dd3fc", barBg: "#bae6fd", label: "PREP" },
  shoot: { bg: "#ffedd5", text: "#9a3412", border: "#fb923c", barFill: "#fdba74", barBg: "#fed7aa", label: "SHOOT" },
  wrap:  { bg: "#d1fae5", text: "#064e3b", border: "#34d399", barFill: "#6ee7b7", barBg: "#a7f3d0", label: "WRAP" },
};

const PHASES = [
  { key: "prep",  name: "Prep Phase",  ...colors.prep  },
  { key: "shoot", name: "Shoot Phase", ...colors.shoot },
  { key: "wrap",  name: "Wrap Phase",  ...colors.wrap  },
];

const LEFT_COL_WIDTH     = 180;
const DATE_COL_WIDTH     = 60;
const PROGRESS_COL_WIDTH = 70;
const LEFT_PANEL_WIDTH   = LEFT_COL_WIDTH + DATE_COL_WIDTH * 2 + PROGRESS_COL_WIDTH;
const PAGE_WIDTH         = 1587;
const TIMELINE_WIDTH     = PAGE_WIDTH - LEFT_PANEL_WIDTH - 2;

const DAY_W        = TIMELINE_WIDTH / 7;   // 7 days only — no year bloat
const PHASE_ROW_H  = 32;
const EVENT_ROW_H  = 28;
const HEADER_H     = 56;
const FONT_XS      = 8;
const FONT_SM      = 10;
const border       = `1px solid ${colors.purple200}`;

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─── Main Component ────────────────────────────────────────────
function CalendarGanttPDF({ currentDate, events }) {
  const weekDays  = getCurrentWeekDays(currentDate);
  const weekStart = weekDays[0];
  const weekEnd   = weekDays[6];

  const todayStr      = format(new Date(), "yyyy-MM-dd");
  const todayDayIndex = weekDays.findIndex((d) => format(d, "yyyy-MM-dd") === todayStr);
  const todayOffset   = todayDayIndex > -1 ? todayDayIndex * DAY_W + DAY_W / 2 : -1;

  const weekEvents = filterEventsByWeek(events, weekDays);

  const ganttRows = PHASES.map((phase) => {
    const phaseEvents = weekEvents
      .filter((e) => e.eventType === phase.key)
      .map((e) => ({ ...e, progress: calculateProgress(e.startDateTime, e.endDateTime) }))
      .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
    return { ...phase, events: phaseEvents, hasEvents: phaseEvents.length > 0 };
  });

  const totalEvents = weekEvents.length;
  const prepCount   = weekEvents.filter((e) => e.eventType === "prep").length;
  const shootCount  = weekEvents.filter((e) => e.eventType === "shoot").length;
  const wrapCount   = weekEvents.filter((e) => e.eventType === "wrap").length;

  // Bar clamped to current week
  const getBarStyle = (startDateTime, endDateTime) => {
    const rangeStart = new Date(weekDays[0]); rangeStart.setHours(0, 0, 0, 0);
    let evStart = new Date(startDateTime);    evStart.setHours(0, 0, 0, 0);
    let evEnd   = new Date(endDateTime);      evEnd.setHours(0, 0, 0, 0);
    const clampedStart = evStart < rangeStart ? rangeStart : evStart;
    const startOffset  = Math.max(0, Math.round((clampedStart - rangeStart) / 86400000));
    const duration     = Math.max(1, Math.round((evEnd - clampedStart) / 86400000) + 1);
    const width        = Math.min(duration * DAY_W, TIMELINE_WIDTH - startOffset * DAY_W);
    return { left: startOffset * DAY_W, width };
  };

  const contentRows = ganttRows.reduce((t, row) =>
    t + PHASE_ROW_H + (row.hasEvents ? row.events.length * EVENT_ROW_H : EVENT_ROW_H), 0);
  const totalHeight = 80 + 46 + HEADER_H + contentRows + 32;

  return (
    <div style={{
      width: `${PAGE_WIDTH}px`,
      minHeight: `${totalHeight}px`,
      padding: "24px",
      backgroundColor: colors.white,
      boxSizing: "border-box",
      fontFamily: "'Segoe UI', Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* ─── HEADER ─── */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        marginBottom: "10px", paddingBottom: "8px", borderBottom: `3px solid ${colors.purple600}`,
      }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "900", textTransform: "uppercase",
            letterSpacing: "0.1em", color: colors.purple600, margin: "0 0 4px 0" }}>
            Gantt Chart
          </h1>
          <div style={{ fontSize: "10px", fontWeight: "700", color: colors.textMuted }}>
            RAINBOW STUDIOS &nbsp;·&nbsp;
            {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d, yyyy")}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", gap: "12px" }}>
            {PHASES.map((p) => (
              <div key={p.key} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "11px", height: "11px", borderRadius: "2px", backgroundColor: p.barFill }} />
                <span style={{ fontSize: "9px", fontWeight: "700", color: p.text }}>{p.label}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "6px 16px", borderRadius: "6px", backgroundColor: colors.purple100 }}>
            <span style={{ fontWeight: "900", color: colors.purple600, fontSize: "13px" }}>
              Week of {format(weekStart, "MMM d")}
            </span>
          </div>
        </div>
      </div>

      {/* ─── STATS ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px", marginBottom: "10px" }}>
        {[
          { label: "Total This Week", value: totalEvents, bg: colors.purple100, text: colors.purple800, bdr: colors.purple200 },
          { label: "Prep Events",     value: prepCount,   bg: colors.prep.bg,   text: colors.prep.text,   bdr: colors.prep.border },
          { label: "Shoot Events",    value: shootCount,  bg: colors.shoot.bg,  text: colors.shoot.text,  bdr: colors.shoot.border },
          { label: "Wrap Events",     value: wrapCount,   bg: colors.wrap.bg,   text: colors.wrap.text,   bdr: colors.wrap.border },
        ].map((s) => (
          <div key={s.label} style={{
            padding: "6px 12px", borderRadius: "4px", backgroundColor: s.bg,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            border: `1px solid ${s.bdr}`,
          }}>
            <div style={{ fontSize: "9px", fontWeight: "700", textTransform: "uppercase", color: colors.textMuted }}>{s.label}</div>
            <div style={{ fontSize: "14px", fontWeight: "900", color: s.text }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ─── MAIN GANTT ─── */}
      <div style={{ flex: 1, display: "flex", border, borderRadius: "4px", overflow: "hidden" }}>

        {/* LEFT PANEL */}
        <div style={{
          width: `${LEFT_PANEL_WIDTH}px`, minWidth: `${LEFT_PANEL_WIDTH}px`,
          flexShrink: 0, display: "flex", flexDirection: "column", borderRight: border,
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: `${LEFT_COL_WIDTH}px ${DATE_COL_WIDTH}px ${DATE_COL_WIDTH}px ${PROGRESS_COL_WIDTH}px`,
            height: HEADER_H, backgroundColor: colors.purple50, borderBottom: border,
          }}>
            {["Event", "Start", "End", "Progress"].map((h, i) => (
              <div key={h} style={{
                display: "flex", alignItems: "center",
                justifyContent: i === 0 ? "flex-start" : "center",
                paddingLeft: i === 0 ? "10px" : 0,
                fontSize: FONT_XS, fontWeight: "900", textTransform: "uppercase", color: colors.purple800,
                borderRight: i < 3 ? border : "none",
              }}>{h}</div>
            ))}
          </div>

          {ganttRows.map((row) => (
            <div key={row.key} style={{ borderBottom: border }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: `${LEFT_COL_WIDTH}px ${DATE_COL_WIDTH}px ${DATE_COL_WIDTH}px ${PROGRESS_COL_WIDTH}px`,
                height: PHASE_ROW_H, backgroundColor: row.bg,
              }}>
                <div style={{ display: "flex", alignItems: "center", paddingLeft: "10px",
                  fontSize: FONT_SM, fontWeight: "900", color: row.text, borderRight: border }}>
                  {row.name}
                  <span style={{ marginLeft: "6px", fontSize: "8px", fontWeight: "700",
                    padding: "1px 5px", borderRadius: "8px", backgroundColor: row.barBg, color: row.text }}>
                    {row.events.length}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: FONT_XS, color: row.text, fontWeight: "700", borderRight: border }}>
                  {row.events[0] ? format(new Date(row.events[0].startDateTime), "dd/MM") : "—"}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: FONT_XS, color: row.text, fontWeight: "700", borderRight: border }}>
                  {row.events[row.events.length - 1]
                    ? format(new Date(row.events[row.events.length - 1].endDateTime), "dd/MM") : "—"}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: FONT_XS, color: row.text, fontWeight: "700" }}>
                  {row.hasEvents
                    ? `${Math.round(row.events.reduce((s, e) => s + e.progress, 0) / row.events.length)}%`
                    : "—"}
                </div>
              </div>

              {!row.hasEvents ? (
                <div style={{ height: EVENT_ROW_H, display: "flex", alignItems: "center",
                  paddingLeft: "14px", fontSize: FONT_XS, color: colors.textLight,
                  fontStyle: "italic", borderTop: border }}>
                  No events this week
                </div>
              ) : (
                row.events.map((event) => (
                  <div key={event.id || event._id} style={{
                    display: "grid",
                    gridTemplateColumns: `${LEFT_COL_WIDTH}px ${DATE_COL_WIDTH}px ${DATE_COL_WIDTH}px ${PROGRESS_COL_WIDTH}px`,
                    height: EVENT_ROW_H, borderTop: border,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", paddingLeft: "14px",
                      fontSize: FONT_XS, fontWeight: "600", color: colors.textMain,
                      borderRight: border, overflow: "hidden", whiteSpace: "nowrap" }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{event.title}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: FONT_XS, color: colors.textMuted, borderRight: border }}>
                      {format(new Date(event.startDateTime), "dd/MM")}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: FONT_XS, color: colors.textMuted, borderRight: border }}>
                      {format(new Date(event.endDateTime), "dd/MM")}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
                      justifyContent: "center", gap: "3px", padding: "0 8px" }}>
                      <span style={{ fontSize: FONT_XS, fontWeight: "700", color: colors.textMain }}>
                        {event.progress}%
                      </span>
                      <div style={{ width: "100%", height: "5px", backgroundColor: row.barBg,
                        borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ width: `${event.progress}%`, height: "100%",
                          backgroundColor: row.barFill, borderRadius: "3px" }} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>

        {/* RIGHT TIMELINE — exactly 7 columns */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>

          {/* Header: 7 day columns */}
          <div style={{ height: HEADER_H, flexShrink: 0, backgroundColor: colors.purple50,
            borderBottom: border, display: "flex" }}>
            {weekDays.map((d, i) => {
              const isToday   = format(d, "yyyy-MM-dd") === todayStr;
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              return (
                <div key={i} style={{
                  width: `${DAY_W}px`, flexShrink: 0,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: "2px",
                  borderRight: i < 6 ? border : "none",
                  backgroundColor: isToday ? "#ddd6fe" : isWeekend ? "#faf5ff" : "transparent",
                }}>
                  <span style={{ fontSize: "9px", fontWeight: "700",
                    color: isToday ? colors.purple800 : colors.textMuted, textTransform: "uppercase" }}>
                    {DAY_LABELS[i]}
                  </span>
                  <span style={{ fontSize: "18px", fontWeight: "900",
                    color: isToday ? colors.purple800 : colors.textMain }}>
                    {format(d, "d")}
                  </span>
                  <span style={{ fontSize: "8px", color: colors.textLight }}>
                    {format(d, "MMM")}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Body */}
          <div style={{ flex: 1, position: "relative" }}>

            {/* Today line */}
            {todayOffset > 0 && (
              <div style={{
                position: "absolute", left: todayOffset, top: 0, bottom: 0,
                width: "2px", backgroundColor: colors.todayLine, zIndex: 20, opacity: 0.7,
              }} />
            )}

            {ganttRows.map((row) => (
              <div key={row.key} style={{ borderBottom: border }}>

                {/* Phase band */}
                <div style={{ height: PHASE_ROW_H, display: "flex", position: "relative",
                  backgroundColor: `${row.bg}80` }}>
                  {weekDays.map((d, i) => (
                    <div key={i} style={{
                      width: `${DAY_W}px`, height: "100%", flexShrink: 0,
                      borderRight: i < 6 ? `1px solid ${colors.gridLine}60` : "none",
                      backgroundColor: (d.getDay() === 0 || d.getDay() === 6) ? "rgba(0,0,0,0.03)" : "transparent",
                    }} />
                  ))}
                </div>

                {/* Event rows */}
                {!row.hasEvents ? (
                  <div style={{ height: EVENT_ROW_H, display: "flex" }}>
                    {weekDays.map((d, i) => (
                      <div key={i} style={{
                        width: `${DAY_W}px`, height: "100%", flexShrink: 0,
                        borderRight: i < 6 ? `1px solid ${colors.gridLine}40` : "none",
                        backgroundColor: (d.getDay() === 0 || d.getDay() === 6) ? "rgba(0,0,0,0.015)" : "transparent",
                      }} />
                    ))}
                  </div>
                ) : (
                  row.events.map((event) => {
                    const bar = getBarStyle(event.startDateTime, event.endDateTime);
                    return (
                      <div key={event.id || event._id} style={{
                        height: EVENT_ROW_H, position: "relative",
                        borderTop: `1px solid ${colors.gridLine}50`,
                        display: "flex",
                      }}>
                        {/* 7 column grid */}
                        {weekDays.map((d, i) => (
                          <div key={i} style={{
                            width: `${DAY_W}px`, height: "100%", flexShrink: 0,
                            borderRight: i < 6 ? `1px solid ${colors.gridLine}40` : "none",
                            backgroundColor: (d.getDay() === 0 || d.getDay() === 6) ? "rgba(0,0,0,0.015)" : "transparent",
                          }} />
                        ))}

                        {/* Gantt bar */}
                        <div style={{
                          position: "absolute", top: "5px",
                          left: `${bar.left}px`, width: `${bar.width}px`,
                          height: `${EVENT_ROW_H - 10}px`,
                          borderRadius: "4px", overflow: "hidden", zIndex: 10,
                        }}>
                          <div style={{ position: "absolute", inset: 0, backgroundColor: row.barBg }} />
                          <div style={{
                            position: "absolute", top: 0, left: 0, bottom: 0,
                            width: `${event.progress}%`, backgroundColor: row.barFill,
                          }} />
                          {bar.width > 60 && (
                            <div style={{
                              position: "absolute", inset: 0,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "9px", fontWeight: "700", color: row.text,
                              overflow: "hidden", whiteSpace: "nowrap", padding: "0 6px",
                            }}>
                              {event.title}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <div style={{ marginTop: "8px", display: "flex", justifyContent: "space-between",
        fontSize: "8px", color: colors.textLight }}>
        <div>Generated on {format(new Date(), "dd MMM yyyy HH:mm")}</div>
        <div>CONFIDENTIAL - PRODUCTION USE ONLY</div>
      </div>
    </div>
  );
}

export default CalendarGanttPDF;