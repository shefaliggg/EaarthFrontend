import GeneralSection from "../../components/calendar-settings/sections/GeneralSection";
import TimezoneSection from "../../components/calendar-settings/sections/TimezoneSection";
import AISection from "../../components/calendar-settings/sections/AISection";
import NotificationSection from "../../components/calendar-settings/sections/NotificationSection";
import ViewSection from "../../components/calendar-settings/sections/ViewSection";
import EventSection from "../../components/calendar-settings/sections/EventSection";
import AddCalendarSection from "../../components/calendar-settings/sections/AddCalendarSection";
import { useState } from "react";

export default function CalendarSettings() {
  const [isEditMode, setIsEditMode] = useState(false);

  /* ---------- TIMEZONE STATE ---------- */
  const [timezoneSettings, setTimezoneSettings] = useState({
    timezone: "pst",
    autoUpdate: true,
    secondary: false,
    secondaryTimezone: "gmt",
    secondaryLabel: "",
  });

  const updateTimezone = (field, value) => {
    setTimezoneSettings((prev) => ({ ...prev, [field]: value }));
  };

  /* ---------- AI STATE ---------- */
  const [aiSettings, setAISettings] = useState({
    conflictResolution: false,
    agendaGenerator: true,
  });

  const updateAI = (field, value) => {
    setAISettings((prev) => ({ ...prev, [field]: value }));
  };

  /* ---------- EVENT STATE ---------- */
  const [eventSettings, setEventSettings] = useState({
    defaultDuration: "60",
    speedyMeetings: false,
  });

  const updateEvent = (field, value) => {
    setEventSettings((prev) => ({ ...prev, [field]: value }));
  };

  /* ---------- GENERAL STATE ---------- */
  const [generalSettings, setGeneralSettings] = useState({
    language: "en-US",
    country: "us",
    dateFormat: "mdy",
    use24Hour: false,
  });

  const updateGeneral = (field, value) => {
    setGeneralSettings((prev) => ({ ...prev, [field]: value }));
  };

  /* ---------- NOTIFICATION STATE ---------- */
  const [notificationSettings, setNotificationSettings] = useState({
    defaultNotification: "10",
    desktopNotifications: true,
    playSounds: true,
  });

  /* ---------- VIEW STATE ---------- */
  const [viewSettings, setViewSettings] = useState({
    startWeek: "sun",
    showWeekends: true,
    showDeclined: true,
    showWeekNumbers: false,
  });

  const updateView = (field, value) => {
    setViewSettings((prev) => ({ ...prev, [field]: value }));
  };

  const updateNotification = (field, value) => {
    setNotificationSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* ACTION BAR */}
      <div className="flex justify-end gap-2">
        {!isEditMode ? (
          <button
            onClick={() => setIsEditMode(true)}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={() => setIsEditMode(false)}
              className="px-4 py-2 rounded-lg border text-sm"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                // Later: API save call
                setIsEditMode(false);
              }}
              className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
            >
              Save
            </button>
          </>
        )}
      </div>

      {/* SECTIONS */}
      {/* SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GeneralSection
          isEditMode={isEditMode}
          settings={generalSettings}
          update={updateGeneral}
        />

        <TimezoneSection
          isEditMode={isEditMode}
          settings={timezoneSettings}
          update={updateTimezone}
        />

        <AISection
          isEditMode={isEditMode}
          settings={aiSettings}
          update={updateAI}
        />

        <ViewSection
          isEditMode={isEditMode}
          settings={viewSettings}
          update={updateView}
        />

        <NotificationSection
          isEditMode={isEditMode}
          settings={notificationSettings}
          update={updateNotification}
        />

        <EventSection
          isEditMode={isEditMode}
          settings={eventSettings}
          update={updateEvent}
        />
      </div>

      <AddCalendarSection />
    </div>
  );
}
