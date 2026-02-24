import React from "react";
import { format, eachDayOfInterval, isSameDay } from "date-fns";
import { Clock, MapPin, Calendar as CalendarIcon } from "lucide-react";

/* ─── CONFIG & COLORS ─── */
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

  shoot: { bg: "#FFEDD5", text: "#9A3412", border: "#FB923C", accent: "#F97316" },
  prep: { bg: "#E0F2FE", text: "#075985", border: "#38BDF8", accent: "#0EA5E9" },
  wrap: { bg: "#A7F3D0", text: "#064E3B", border: "#34D399", accent: "#10B981" },
  total: { bg: "#f3e8ff", text: "#581c87", border: "#c084fc", accent: "#A855F7" },
};

/* ─── HELPERS ─── */
function getEventColor(eventType) {
  switch (eventType?.toLowerCase()) {
    case "shoot": return colors.shoot;
    case "prep": return colors.prep;
    case "wrap": return colors.wrap;
    default: return colors.total;
  }
}

function getAttendeesInitials(event) {
  if (!event.audience || event.audience.type === "ALL") return "";
  if (!event.attendees || event.attendees.length === 0) return "";

  const initials = event.attendees
    .map((att) => {
      const userObj = att.userId || att;
      const name = userObj.displayName || userObj.name || "";
      if (!name) return "";

      const parts = name.trim().split(/\s+/);
      if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    })
    .filter(Boolean);

  return [...new Set(initials)].join(", ");
}

/* Grouping Logic: Expands multi-day events and groups by Date */
function groupEventsByDate(events) {
  const map = {};

  events.forEach((e) => {
    if (!e.startDateTime) return;

    const start = new Date(e.startDateTime);
    const end = e.endDateTime ? new Date(e.endDateTime) : new Date(start);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const days = eachDayOfInterval({ start, end });

    days.forEach((day) => {
      const dateKey = format(day, "yyyy-MM-dd");
      if (!map[dateKey]) map[dateKey] = [];

      const id = e.id || e._id;
      const alreadyAdded = map[dateKey].some((evt) => (evt.id || evt._id) === id);
      if (!alreadyAdded) {
        map[dateKey].push(e);
      }
    });
  });

  return Object.entries(map).sort(([a], [b]) => new Date(a) - new Date(b));
}

/* ─── COMPONENT ─── */
function CalendarTimeLinePDF({ currentDate, events = [] }) {
  // Stats calculations
  const uniqueEventIds = new Set(events.map((e) => e.id || e._id));
  const prepCount = events.filter((e) => e.eventType === "prep").length;
  const shootCount = events.filter((e) => e.eventType === "shoot").length;
  const wrapCount = events.filter((e) => e.eventType === "wrap").length;

  const grouped = groupEventsByDate(events);
  const isToday = (dateStr) => isSameDay(new Date(dateStr + "T12:00:00"), new Date());

  return (
    <div
      style={{
        width: "1122px", // Matches PDF landscape width
        padding: "30px",
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
            Project Timeline
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
              {format(currentDate, "MMMM yyyy")}
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
          marginBottom: "16px",
        }}
      >
        {[
          { displayLabel: "Total Events", value: uniqueEventIds.size, ...colors.total },
          { displayLabel: "Prep Events", value: prepCount, ...colors.prep },
          { displayLabel: "Shoot Events", value: shootCount, ...colors.shoot },
          { displayLabel: "Wrap Events", value: wrapCount, ...colors.wrap },
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

      {/* ── TIMELINE SUB-HEADER ── */}
      <div style={{ 
          backgroundColor: colors.purple50, 
          borderBottom: `1px solid ${colors.purple200}`,
          borderTop: `1px solid ${colors.purple200}`,
          padding: "12px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          borderRadius: "8px"
      }}>
        <h3 style={{ fontWeight: "900", fontSize: "16px", color: colors.purple800, margin: 0 }}>
          Production Timeline
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <CalendarIcon size={18} color={colors.purple600} />
          <span style={{ fontSize: "13px", fontWeight: "800", color: colors.purple800 }}>
            {grouped.length} days with events
          </span>
        </div>
      </div>

      {/* ── TIMELINE CONTENT (Mimicking Web View) ── */}
      <div style={{ position: "relative", paddingLeft: "12px" }}>
        
        {/* Background Vertical Line */}
        {grouped.length > 0 && (
          <div style={{
            position: "absolute",
            left: "34px",
            top: "0",
            bottom: "0",
            width: "4px",
            backgroundColor: colors.purple200,
            borderRadius: "2px",
            zIndex: 0
          }} />
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {grouped.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: colors.textMuted, fontSize: "14px", fontStyle: "italic" }}>
              No events scheduled for {format(currentDate, "MMMM yyyy")}
            </div>
          ) : (
            grouped.map(([dateStr, dayEvents]) => {
              const todayFlag = isToday(dateStr);
              const dateObj = new Date(dateStr + "T12:00:00");

              return (
                <div key={dateStr} style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: "24px" }}>
                  
                  {/* DATE CIRCLE */}
                  <div style={{
                    position: "relative",
                    zIndex: 10,
                    width: "48px",
                    height: "48px",
                    flexShrink: 0,
                    borderRadius: "50%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: todayFlag ? colors.purple600 : colors.purple100,
                    color: todayFlag ? colors.white : colors.purple800,
                    border: `4px solid ${colors.white}`,
                    boxShadow: todayFlag ? `0 0 0 3px ${colors.purple200}` : "0 2px 4px rgba(0,0,0,0.1)",
                    transform: todayFlag ? "scale(1.1)" : "none"
                  }}>
                    <span style={{ fontSize: "10px", fontWeight: "900", lineHeight: "1", textTransform: "uppercase" }}>
                      {format(dateObj, "MMM")}
                    </span>
                    <span style={{ fontSize: "16px", fontWeight: "900", lineHeight: "1" }}>
                      {format(dateObj, "dd")}
                    </span>
                  </div>

                  {/* CONTENT AREA */}
                  <div style={{ flex: 1, paddingTop: "2px" }}>
                    
                    {/* Day Header Row */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                      <span style={{ fontWeight: "800", fontSize: "14px", color: colors.textMain }}>
                        {format(dateObj, "EEEE, MMMM d, yyyy")}
                      </span>
                      {todayFlag && (
                        <span style={{ fontSize: "9px", fontWeight: "900", padding: "2px 8px", borderRadius: "10px", backgroundColor: colors.purple600, color: colors.white, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Today
                        </span>
                      )}
                      <span style={{ fontSize: "9px", fontWeight: "800", padding: "2px 8px", borderRadius: "10px", backgroundColor: colors.purple100, color: colors.purple800 }}>
                        {dayEvents.length} {dayEvents.length === 1 ? "event" : "events"}
                      </span>
                    </div>

                    {/* EVENT CARDS */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {dayEvents.map((event, idx) => {
                        const eventColor = getEventColor(event.eventType);
                        const isAllDay = event.isAllDay || event.allDay;
                        const initials = getAttendeesInitials(event);

                        const eStart = new Date(event.startDateTime);
                        const eEnd = event.endDateTime ? new Date(event.endDateTime) : new Date(eStart);
                        const isMultiDay = eStart.toDateString() !== eEnd.toDateString();

                        let timeString = "";
                        if (isAllDay) {
                          timeString = "All Day Event";
                        } else if (isMultiDay) {
                          timeString = `${format(eStart, "MMM d")} - ${format(eEnd, "MMM d")}`;
                        } else {
                          timeString = `${format(eStart, "h:mm a")} - ${format(eEnd, "h:mm a")}`;
                        }

                        return (
                          <div key={event.id || event._id || idx} style={{
                            backgroundColor: eventColor.bg,
                            borderLeft: `4px solid ${eventColor.border}`,
                            borderRadius: "8px",
                            padding: "12px 16px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}>
                            
                            {/* Left Side: Title & Info */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                                <span style={{ fontWeight: "800", fontSize: "14px", color: eventColor.text }}>
                                  {event.title}
                                </span>
                                {initials && (
                                  <span style={{ fontSize: "12px", fontWeight: "600", color: eventColor.text, opacity: 0.8 }}>
                                    - {initials}
                                  </span>
                                )}
                              </div>
                              
                              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: colors.textMuted, fontSize: "11px" }}>
                                  <Clock size={12} />
                                  <span style={{ fontWeight: "600" }}>{timeString}</span>
                                </div>
                                {event.location && (
                                  <div style={{ display: "flex", alignItems: "center", gap: "4px", color: colors.textMuted, fontSize: "11px" }}>
                                    <MapPin size={12} />
                                    <span style={{ fontWeight: "600" }}>{event.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Right Side: Badge */}
                            {event.eventType && (
                              <div style={{
                                backgroundColor: eventColor.accent,
                                color: colors.white,
                                fontSize: "10px",
                                fontWeight: "900",
                                padding: "4px 10px",
                                borderRadius: "6px",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em"
                              }}>
                                {event.eventType}
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div
        style={{
          marginTop: "32px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "9px",
          fontWeight: "600",
          color: colors.textLight,
          borderTop: `1px solid ${colors.purple100}`,
          paddingTop: "12px"
        }}
      >
        <div>Generated on {format(new Date(), "dd MMM yyyy HH:mm")}</div>
        <div>CONFIDENTIAL – PRODUCTION USE ONLY</div>
      </div>
    </div>
  );
}

export default CalendarTimeLinePDF;