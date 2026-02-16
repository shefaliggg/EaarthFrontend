import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { format, parse } from "date-fns";
import FilterPillTabs from "@/shared/components/FilterPillTabs";
import CreateEventStepsRenderer from "./CreateEventStepsRenderer";
import { createEventFormConfig } from "../config/createEventFormConfig";
import { createEventSchema } from "../config/createEventSchema";

export default function EditEventModal({
  open,
  onClose,
  eventToEdit,
  onSave,
  isSubmitting,
}) {
  // Initialize form with safe defaults
  const form = useForm({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      isAllDay: false,
      eventType: "prep",
      location: "",
      attendees: [],
      notes: "",
    },
    mode: "onTouched",
  });

  const [currentStepValue, setCurrentStepValue] = useState(
    createEventFormConfig.steps[0].value
  );

  const currentStepIndex = createEventFormConfig.steps.findIndex(
    (step) => step.value === currentStepValue
  );
  const currentStep = createEventFormConfig.steps.find(
    (step) => step.value === currentStepValue
  );
  const currentFields =
    createEventFormConfig.steps[currentStepIndex]?.fields?.map(
      (field) => field.name
    ) || [];

  // Populate Form when Event Data changes
  useEffect(() => {
    if (open && eventToEdit) {
      const start = new Date(eventToEdit.startDateTime);
      const end = new Date(eventToEdit.endDateTime);

      form.reset({
        title: eventToEdit.title,
        startDate: format(start, "yyyy-MM-dd"),
        endDate: format(end, "yyyy-MM-dd"),
        startTime: eventToEdit.allDay ? "" : format(start, "h:mm a"),
        endTime: eventToEdit.allDay ? "" : format(end, "h:mm a"),
        isAllDay: eventToEdit.allDay || false,
        eventType: eventToEdit.eventType,
        location: eventToEdit.location || "",
        attendees: eventToEdit.attendees 
          ? eventToEdit.attendees.map(a => (typeof a === 'string' ? a : a._id || a.id)) 
          : [],
        notes: eventToEdit.description || "",
      });
      setCurrentStepValue(createEventFormConfig.steps[0].value);
    }
  }, [open, eventToEdit, form]);

  const canProceed = currentFields.every((fieldName) => {
    const value = form.watch(fieldName);
    if (fieldName === "isAllDay") return true;
    if (
      form.watch("isAllDay") &&
      ["startTime", "endTime"].includes(fieldName)
    ) {
      return true;
    }
    if (["attendees", "notes", "location"].includes(fieldName)) return true;
    return Boolean(value);
  });

  const goToNextStep = async () => {
    const isValid = await form.trigger(currentFields);
    if (isValid && currentStepIndex < createEventFormConfig.steps.length - 1) {
      setCurrentStepValue(
        createEventFormConfig.steps[currentStepIndex + 1].value
      );
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepValue(
        createEventFormConfig.steps[currentStepIndex - 1].value
      );
    }
  };

  const handleFormSubmit = (data) => {
    try {
      let finalStartDateTime;
      let finalEndDateTime;

      if (data.isAllDay) {
        finalStartDateTime = new Date(data.startDate);
        finalStartDateTime.setHours(0, 0, 0, 0);

        finalEndDateTime = data.endDate
          ? new Date(data.endDate)
          : new Date(data.startDate);
        finalEndDateTime.setHours(23, 59, 59, 999);
      } else {
        const baseStart = new Date(data.startDate);
        finalStartDateTime = parse(data.startTime, "h:mm a", baseStart);

        const baseEnd = data.endDate
          ? new Date(data.endDate)
          : new Date(data.startDate);
        finalEndDateTime = parse(data.endTime, "h:mm a", baseEnd);
      }

      const payload = {
        title: data.title,
        description: data.notes,
        eventType: data.eventType,
        location: data.location,
        startDateTime: finalStartDateTime.toISOString(),
        endDateTime: finalEndDateTime.toISOString(),
        allDay: data.isAllDay,
        visibility: "all",
        attendees: data.attendees || [],
      };

      onSave(eventToEdit.eventCode, payload);
    } catch (error) {
      console.error("Date parsing error", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col gap-8">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>Update the details for this event.</DialogDescription>
        </DialogHeader>

        <FilterPillTabs
          options={createEventFormConfig.steps}
          value={currentStepValue}
          onChange={setCurrentStepValue}
          readOnly
        />

        <div className="flex-1 overflow-y-auto pr-1">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <CreateEventStepsRenderer step={currentStep} form={form} />

            <div className="pt-4 flex justify-between bg-background sticky bottom-0">
              <div>
                {currentStepIndex > 0 && (
                  <Button variant="outline" onClick={goToPreviousStep} type="button">
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex gap-3">
                {currentStepIndex < createEventFormConfig.steps.length - 1 ? (
                  <Button type="button" onClick={goToNextStep} disabled={!canProceed}>
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={form.handleSubmit(handleFormSubmit)}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update Event"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}