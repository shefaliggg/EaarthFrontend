export const createEventFormConfig = {
  title: "Add New Event",
  subtitle: "Add a new event to the production schedule.",

  sections: [
    {
      id: "basic",
      title: "Basic Details",
      fields: [
        { name: "title", label: "Event Title", type: "text" },
        { name: "location", label: "Location", type: "text" },
        {
          name: "eventType",
          label: "Event Type",
          isSelect: true,
          items: [
            { label: "Prep", value: "prep" },
            { label: "Shoot", value: "shoot" },
            { label: "Wrap", value: "wrap" },
            { label: "Meeting", value: "meeting" },
          ],
        },
      ],
    },
    {
      id: "datetime",
      title: "Date & Time",
      fields: [
        { name: "startDate", label: "Start Date", type: "date" },
        { name: "endDate", label: "End Date", type: "date" },
        { name: "isAllDay", label: "All-Day Event", type: "checkbox" },
        { name: "startTime", label: "Start Time", type: "time" },
        { name: "endTime", label: "End Time", type: "time" },
      ],
    },
    {
      id: "notify", 
      title: "Notify",
      fields: [
        { name: "audienceType", label: "Who should be notified?", type: "audience-selector" },
        { name: "selectedDepartments", label: "Select Departments", type: "department-select" },
        { name: "selectedUsers", label: "Select Crew Members", type: "crew-select" },
      ],
    },
    {
      id: "details", 
      title: "Details",
      fields: [
        { name: "notes", label: "Description / Notes", type: "textarea" },
      ],
    },
  ],
};