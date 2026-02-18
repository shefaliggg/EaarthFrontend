import {
  format,
  startOfWeek,
  addDays,
  isSameMonth,
  startOfMonth,
  differenceInCalendarDays,
  isAfter,
} from "date-fns";
import { getProductionWeekLabel } from "../productionPhases";

const SHOOT_START_DATE = new Date("2026-02-22");
const WRAP_END_DATE = new Date("2026-03-07");

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
  prep: { bg: "#E0F2FE", text: "#075985", border: "#38BDF8", label: "PREP" },
  wrap: { bg: "#A7F3D0", text: "#064E3B", border: "#34D399", label: "WRAP" },
  other: { bg: "#e9d5ff", text: "#581c87", border: "#c084fc", label: "OTHER" },
};

function CalendarMonthPDF({ currentDate, events }) {
  const calendarStartDate = startOfWeek(startOfMonth(currentDate));
  const calendarDays = Array.from({ length: 35 }, (_, i) =>
    addDays(calendarStartDate, i),
  );

  const calendarWeeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    calendarWeeks.push(calendarDays.slice(i, i + 7));
  }

  const shootDays = events.filter((e) => e.eventType === "shoot").length;
  const prepDays = events.filter((e) => e.eventType === "prep").length;
  const wrapDays = events.filter((e) => e.eventType === "wrap").length;
  const otherDays = events.length - shootDays - prepDays - wrapDays;

  const getEventsForDate = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return events.filter((event) => {
      if (!event.startDateTime) return false;
      const start = new Date(event.startDateTime);
      const end = event.endDateTime ? new Date(event.endDateTime) : start;
      const current = new Date(dateStr + "T12:00:00");
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return current >= start && current <= end;
    });
  };

  const getEventStyle = (eventType) => {
    switch (eventType) {
      case "shoot":
        return colors.shoot;
      case "prep":
        return colors.prep;
      case "wrap":
        return colors.wrap;
      default:
        return colors.other;
    }
  };

  const cellBorderStyle = `1px solid ${colors.purple200}`;

  return (
    <>
      <div
        style={{
          width: "1122px",
          padding: "24px",
          backgroundColor: colors.white,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* --- HEADER --- */}
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
                fontSize: "24px",
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: colors.purple600,
                margin: "0 0 4px 0",
              }}
            >
              Project Calendar
            </h1>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: colors.textMuted,
              }}
            >
              RAINBOW STUDIOS
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                display: "inline-block",
                padding: "8px 16px",
                borderRadius: "6px",
                backgroundColor: colors.purple100,
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: colors.purple600,
                  fontSize: "14px",
                }}
              >
                {format(currentDate, "MMMM yyyy")}
              </span>
            </div>
            <div style={{ fontSize: "10px" }}>
              <span
                style={{
                  fontWeight: "700",
                  textTransform: "uppercase",
                  color: colors.purple600,
                  fontSize: "8px",
                  display: "block",
                }}
              >
                PROJECT
              </span>
              <span
                style={{
                  fontWeight: "900",
                  color: colors.purple600,
                  fontSize: "12px",
                }}
              >
                AVATAR 1
              </span>
            </div>
          </div>
        </div>
        {/* --- STATS BAR --- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          {[
            { label: "Shoot Days", value: shootDays, ...colors.shoot },
            { label: "Prep Days", value: prepDays, ...colors.prep },
            { label: "Wrap Days", value: wrapDays, ...colors.wrap },
            { label: "Other Events", value: otherDays, ...colors.other },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: "6px 10px",
                borderRadius: "4px",
                backgroundColor: stat.bg,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: `1px solid ${stat.border}`,
              }}
            >
              <div
                style={{
                  fontWeight: "700",
                  textTransform: "uppercase",
                  color: colors.textMuted,
                  fontSize: "9px",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontWeight: "900",
                  color: stat.text,
                  fontSize: "12px",
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
        {/* --- CALENDAR GRID CONTAINER --- */}
        <div
          style={{
            flex: 1,
            borderTop: cellBorderStyle,
            borderLeft: cellBorderStyle,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* WEEKDAY HEADERS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "80px repeat(7, 1fr)",
            }}
          >
            <div
              style={{
                padding: "8px 0",
                textAlign: "center",
                fontSize: "10px",
                fontWeight: "900",
                color: colors.textMuted,
                backgroundColor: colors.purple50,
                borderRight: cellBorderStyle,
                borderBottom: cellBorderStyle,
              }}
            >
              WEEK
            </div>
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
              <div
                key={day}
                style={{
                  padding: "8px 0",
                  textAlign: "center",
                  fontSize: "10px",
                  fontWeight: "900",
                  color: colors.purple800,
                  backgroundColor: colors.purple50,
                  borderRight: cellBorderStyle,
                  borderBottom: cellBorderStyle,
                }}
              >
                {day}
              </div>
            ))}
          </div>
          {/* CALENDAR BODY */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {calendarWeeks.map((week, wIdx) => {
              const weekStartDate = format(week[0], "yyyy-MM-dd");
              const weekLabel = getProductionWeekLabel(weekStartDate) || "";

              return (
                <div
                  key={wIdx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px repeat(7, 1fr)",
                    minHeight: "100px",
                    flexGrow: 1,
                  }}
                >
                  {/* WEEK LABEL COLUMN */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f3f4f6",
                      borderRight: cellBorderStyle,
                      borderBottom: cellBorderStyle,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "9px",
                        fontWeight: "800",
                        color: colors.purple800,
                        transform: "rotate(-90deg)",
                        whiteSpace: "nowrap",
                        textTransform: "uppercase",
                      }}
                    >
                      {weekLabel}
                    </div>
                  </div>
                  {/* DAYS */}
                  {week.map((day, dIdx) => {
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const dayEvents = getEventsForDate(day);
                    const isToday =
                      format(day, "yyyy-MM-dd") ===
                      format(new Date(), "yyyy-MM-dd");

                    let productionDayNumber = null;
                    let dayNumColor = "transparent";

                    if (!isAfter(day, WRAP_END_DATE)) {
                      const rawDiff = differenceInCalendarDays(
                        day,
                        SHOOT_START_DATE,
                      );
                      productionDayNumber =
                        rawDiff >= 0 ? rawDiff + 1 : rawDiff;

                      if (rawDiff >= 0) {
                        const dateStr = format(day, "yyyy-MM-dd");
                        if (dateStr >= "2026-03-01") {
                          dayNumColor = colors.wrap.text;
                        } else {
                          dayNumColor = colors.shoot.text;
                        }
                      } else {
                        dayNumColor = colors.prep.text;
                      }
                    }

                    return (
                      <div
                        key={dIdx}
                        style={{
                          position: "relative",
                          backgroundColor: !isCurrentMonth
                            ? "#F9FAFB"
                            : colors.white,
                          padding: "4px",
                          opacity: !isCurrentMonth ? 0.6 : 1,
                          borderRight: cellBorderStyle,
                          borderBottom: cellBorderStyle,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                        }}
                      >
                        {/* Date & Day Number Header */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "4px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "9px",
                              fontWeight: "800",
                              color: dayNumColor,
                              visibility:
                                productionDayNumber !== null
                                  ? "visible"
                                  : "hidden",
                            }}
                          >
                            Day {productionDayNumber}
                          </div>

                          <div
                            style={{
                              width: "18px",
                              height: "18px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "50%",
                              fontSize: "10px",
                              fontWeight: "700",
                              backgroundColor: isToday
                                ? colors.purple200
                                : "transparent",
                              color: colors.purple800,
                            }}
                          >
                            {format(day, "d")}
                          </div>
                        </div>

                        {/* Events List - SHOW ALL (No Slice) */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "3px",
                          }}
                        >
                          {dayEvents.map((event, i) => {
                            const style = getEventStyle(event.eventType);
                            return (
                              <div
                                key={i}
                                style={{
                                  fontSize: "8px",
                                  backgroundColor: style.bg,
                                  borderLeft: `2px solid ${style.border}`,
                                  padding: "3px 4px",
                                  borderRadius: "2px",
                                  textAlign: "center",
                                  marginBottom: "1px",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "1px",
                                }}
                              >
                                <div
                                  style={{
                                    fontWeight: "700",
                                    color: style.text,
                                    textTransform: "uppercase",
                                    lineHeight: "1.1",
                                  }}
                                >
                                  {event.title}
                                </div>

                                {event.location && (
                                  <div
                                    style={{
                                      fontSize: "7px",
                                      fontWeight: "600",
                                      color: colors.textMuted,
                                      textTransform: "uppercase",
                                      borderTop: `1px solid ${style.border}40`,
                                      marginTop: "1px",
                                      paddingTop: "1px",
                                    }}
                                  >
                                    {event.location}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        {/* --- FOOTER --- */}
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
          <div>CONFIDENTIAL - PRODUCTION USE ONLY</div>
        </div>
      </div>
    </>
  );
}

export default CalendarMonthPDF;
