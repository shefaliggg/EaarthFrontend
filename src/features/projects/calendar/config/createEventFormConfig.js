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
          name: "productionPhase",
          label: "Production Phase",
          isSelect: true,
          items: [
            { label: "Prep", value: "prep" },
            { label: "Shoot", value: "shoot" },
            { label: "Wrap", value: "wrap" },
          ],
        },
        {
          name: "eventCategory",
          label: "Event Category",
          type: "creatable-select",
          items: [
            { label: "General", value: "General" },
            { label: "Travel", value: "Travel" },
            { label: "Meeting", value: "Meeting" },
            { label: "HOD Meeting", value: "HOD Meeting" },
            { label: "Rehearsal", value: "Rehearsal" },
          ],
        },
        {
          name: "status",
          label: "Status",
          isSelect: true,
          items: [
            { label: "Confirmed", value: "confirmed" },
            { label: "Tentative", value: "tentative" },
            { label: "Completed", value: "completed" },
            { label: "Cancelled", value: "cancelled" },
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
      id: "notify_and_details",
      title: "Notify and Details",
      fields: [
        {
          name: "audienceType",
          label: "Who should be involved?",
          type: "audience-selector",
        },
        {
          name: "selectedDepartments",
          label: "Select Departments",
          type: "department-select",
        },
        {
          name: "selectedUsers",
          label: "Select Crew Members",
          type: "crew-select",
        },
        {
          name: "isMeeting",
          label: "Generate an Online Video Call Link for this event",
          type: "checkbox",
        },
        { name: "notes", label: "Description / Notes", type: "textarea" },
      ],
    },
  ],
};