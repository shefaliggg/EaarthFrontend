import React from "react";
import { format, startOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";

const colors = {
  white: "#ffffff",
  purple50: "#faf5ff",
  purple100: "#f3e8ff",
  purple200: "#e9d5ff",
  purple400: "#c084fc",
  purple600: "#9333ea",
  purple700: "#7e22ce",
  purple800: "#6b21a8",
  purple900: "#581c87",
  purple950: "#3b0764",
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray300: "#d1d5db",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  gray600: "#4b5563",
  gray700: "#374151",
  gray800: "#1f2937",
  gray900: "#111827",
  blue50: "#eff6ff",
  blue100: "#dbeafe",
  blue600: "#2563eb",
  green50: "#f0fdf4",
  green100: "#dcfce7",
  green200: "#bbf7d0",
  green600: "#16a34a",
  amber50: "#fffbeb",
  amber100: "#fef3c7",
  amber600: "#d97706",
  red50: "#fef2f2",
  red100: "#fee2e2",
  red600: "#dc2626",
};

export default function CalendarPDFTemplate({ currentDate, events = [] }) {
  // --- Helpers ---
  const getDaysInMonth = (date) => {
    const start = startOfWeek(new Date(date.getFullYear(), date.getMonth(), 1), {
      weekStartsOn: 1,
    });
    const days = [];
    for (let i = 0; i < 35; i++) {
      days.push(addDays(start, i));
    }
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const getEventsForDate = (date) => {
    return events.filter((e) => {
      if (!e.startDateTime) return false;
      return isSameDay(new Date(e.startDateTime), date);
    });
  };

  const shootDays = events.filter((e) => e.eventType === "shoot").length;
  const prepDays = events.filter((e) => e.eventType === "prep").length;
  const wrapDays = events.filter((e) => e.eventType === "wrap").length;
  const otherDays = events.length - shootDays - prepDays - wrapDays;

  const getEventStyle = (type) => {
    switch (type) {
      case "shoot":
        return { bg: colors.green50, border: colors.green200, text: colors.green600 };
      case "prep":
        return { bg: colors.blue50, border: colors.blue100, text: colors.blue600 };
      case "wrap":
        return { bg: colors.amber50, border: colors.amber100, text: colors.amber600 };
      default:
        return { bg: colors.gray50, border: colors.gray200, text: colors.gray600 };
    }
  };

  return (
    <div
      id="calendar-pdf-export"
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        width: "1122px", 
        height: "794px", 
        display: "flex",
        flexDirection: "column",
        position: "relative",
        margin: "0 auto",
        backgroundColor: colors.white,
        color: colors.gray900,
        boxSizing: "border-box",
        padding: "24px",
        fontSize: "10px",
        lineHeight: "1.4",
      }}
    >
      {/* --- HEADER --- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
          paddingBottom: "12px",
          borderBottom: `3px solid ${colors.purple600}`,
        }}
      >
        {/* Left: Company Info */}
        <div>
          <h1
            style={{
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: colors.purple900,
              fontSize: "24px",
              margin: "0 0 4px 0",
            }}
          >
            Project CALENDAR
          </h1>
          <div
            style={{
              fontSize: "11px",
              color: colors.gray700,
              fontWeight: "700",
              marginBottom: "2px",
            }}
          >
            MIRAGE PICTURES LIMITED
          </div>
          <div style={{ fontSize: "8px", color: colors.gray500 }}>
            Generated on {format(new Date(), "dd MMM yyyy")}
          </div>
        </div>

        {/* Right: Date Info */}
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
                color: colors.purple900,
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
                color: colors.purple900,
                fontSize: "12px",
              }}
            >
              AVATAR 1
            </span>
          </div>
        </div>
      </div>

      {/* --- SUMMARY BAR --- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        {[
          { label: "Shoot Days", value: shootDays, color: colors.green50, text: colors.green600 },
          { label: "Prep Days", value: prepDays, color: colors.blue50, text: colors.blue600 },
          { label: "Wrap Days", value: wrapDays, color: colors.amber50, text: colors.amber600 },
          { label: "Other Events", value: otherDays, color: colors.gray50, text: colors.gray600 },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              padding: "10px 12px",
              borderRadius: "6px",
              backgroundColor: stat.color,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontWeight: "700",
                textTransform: "uppercase",
                color: colors.gray600,
                fontSize: "9px",
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontWeight: "900",
                color: stat.text,
                fontSize: "14px",
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* --- CALENDAR GRID --- */}
      <div
        style={{
          borderRadius: "6px",
          overflow: "hidden",
          border: `2px solid ${colors.purple200}`,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Days Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            backgroundColor: colors.purple50,
            borderBottom: `1px solid ${colors.purple200}`,
          }}
        >
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div
              key={day}
              style={{
                padding: "8px",
                textAlign: "center",
                fontWeight: "900",
                textTransform: "uppercase",
                color: colors.purple800,
                fontSize: "10px",
                borderRight: `1px solid ${colors.purple100}`,
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Body */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {weeks.map((week, weekIdx) => (
            <div
              key={weekIdx}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                flex: 1,
                borderBottom: weekIdx < weeks.length - 1 ? `1px solid ${colors.gray200}` : "none",
              }}
            >
              {week.map((day, dayIdx) => {
                const isCurrentMonth = isSameMonth(day, currentDate);
                const dayEvents = getEventsForDate(day);
                const isWeekend = dayIdx >= 5;

                return (
                  <div
                    key={day.toISOString()}
                    style={{
                      borderRight: dayIdx < 6 ? `1px solid ${colors.gray100}` : "none",
                      backgroundColor: !isCurrentMonth
                        ? colors.gray50
                        : isWeekend
                        ? colors.gray50
                        : colors.white,
                      padding: "6px",
                      position: "relative",
                      opacity: !isCurrentMonth ? 0.6 : 1,
                    }}
                  >
                    {/* Date Number */}
                    <div
                      style={{
                        textAlign: "right",
                        fontWeight: "700",
                        fontSize: "10px",
                        color: isWeekend ? colors.gray400 : colors.gray700,
                        marginBottom: "4px",
                      }}
                    >
                      {format(day, "d")}
                    </div>

                    {/* Events List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      {dayEvents.slice(0, 4).map((event, i) => {
                        const style = getEventStyle(event.eventType);
                        return (
                          <div
                            key={i}
                            style={{
                              backgroundColor: style.bg,
                              borderLeft: `3px solid ${style.text}`,
                              padding: "2px 4px",
                              borderRadius: "2px",
                              fontSize: "8px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              fontWeight: "600",
                              color: colors.gray800,
                            }}
                          >
                            {event.time ? (
                              <span style={{ fontWeight: "700", marginRight: "3px", color: style.text }}>
                                {event.time}
                              </span>
                            ) : null}
                            {event.title}
                          </div>
                        );
                      })}
                      {dayEvents.length > 4 && (
                        <div
                          style={{
                            fontSize: "7px",
                            textAlign: "center",
                            color: colors.gray500,
                            fontStyle: "italic",
                          }}
                        >
                          + {dayEvents.length - 4} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* --- FOOTER --- */}
      <div
        style={{
          marginTop: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "8px",
          borderTop: `2px solid ${colors.gray100}`,
        }}
      >
        <div style={{ fontSize: "8px", color: colors.gray500 }}>
          Prepared by <strong>Production Office</strong>
        </div>
        <div style={{ fontSize: "8px", color: colors.gray400 }}>
          Internal Document • Confidential
        </div>
      </div>
    </div>
  );
}