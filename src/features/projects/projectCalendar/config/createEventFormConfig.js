export const createEventFormConfig = {
  title: "Add New Event",
  subtitle: "Add a new event to the production schedule.",

  steps: [
    {
      id: "basic",
      value: "basic",
      label: "Basic",
      fields: [
        { name: "title", label: "Event Title" },
        { name: "location", label: "Location" },
        { name: "eventType", label: "Event Type", isSelect: true, items: [
          { label: "Prep", value: "prep" },
          { label: "Scout", value: "scout" },
          { label: "Tech", value: "tech" },
          { label: "Stunt", value: "stunt" },
          { label: "Cast", value: "cast" },
          { label: "Shoot", value: "shoot" },
          { label: "Travel", value: "travel" },
          { label: "Meeting", value: "meeting" },
          { label: "Other", value: "other" },
        ]},
      ],
    },

    {
      id: "date",
      value: "date",
      label: "Date",
      fields: [
        { name: "startDate", label: "Start Date", type: "date" },
        { name: "endDate", label: "End Date (Optional)", type: "date" },
        { name: "isMultiDay", label: "Multi-day Event", type: "checkbox" },
      ],
    },

    {
      id: "time",
      value: "time",
      label: "Time",
      fields: [
        { name: "startTime", label: "Start Time", type: "time" },
        { name: "endTime", label: "End Time", type: "time" },
        { name: "isAllDay", label: "All Day Event", type: "checkbox" },
      ],
    },

    {
      id: "details",
      value: "details",
      label: "Details",
      fields: [
        { name: "color", label: "Color (Hex)" },
        { name: "notes", label: "Notes / Details", type: "textarea" },
      ],
    },
  ],
};
