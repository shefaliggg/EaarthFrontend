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
        {
          name: "eventType",
          label: "Event Type",
          isSelect: true,
          items: [
            { label: "Prep", value: "prep" },
            { label: "Shoot", value: "shoot" },
            { label: "Wrap", value: "wrap" },
            { label: "Meeting", value: "meeting" },
            { label: "Travel", value: "travel" },
            { label: "Other", value: "other" },
          ],
        },
      ],
    },

    {
      id: "date",
      value: "date",
      label: "Date",
      fields: [
        { name: "startDate", label: "Start Date", type: "date" },
        { name: "endDate", label: "End Date", type: "date" },
      ],
    },

    {
      id: "time",
      value: "time",
      label: "Time",
      fields: [
        { name: "startTime", label: "Start Time", type: "time" },
        { name: "endTime", label: "End Time", type: "time" },
        { name: "isAllDay", label: "All-Day Event", type: "checkbox" },
      ],
    },

    {
      id: "details",
      value: "details",
      label: "Notify & Details",
      fields: [
        // Changed here: Removed Color, Added Crew Select
        { 
          name: "attendees", 
          label: "Notify Crew Members", 
          type: "crew-select" // Custom type we will handle in renderer
        },
        { name: "notes", label: "Description / Notes", type: "textarea" },
      ],
    },
  ],
};