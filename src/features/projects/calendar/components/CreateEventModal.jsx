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
import { useDispatch } from "react-redux";
import { fetchCrewMembers, fetchDepartments } from "../../store/calendar.thunks";
import CreateEventStepsRenderer from "./CreateEventStepsRenderer";
import { createEventFormConfig } from "../config/createEventFormConfig";
import { createEventSchema } from "../config/createEventSchema";

const generateRoomId = () => {
  return `ROOM-${Math.random().toString(36).substring(7).toUpperCase()}`;
};

export default function CreateEventModal({
  open,
  onClose,
  selectedDate,
  onSave,
  isSubmitting: externalIsSubmitting, 
}) {
  const dispatch = useDispatch();
  
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      startDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
      endDate: "",
      startTime: "",
      endTime: "",
      isAllDay: false,
      isMeeting: false, 
      eventType: "prep",
      status: "confirmed",
      location: "",
      audienceType: "ALL",
      selectedDepartments: [],
      selectedUsers: [],
      notes: "",
    },
    mode: "onChange",
  });

  const { isValid } = form.formState;

  const handleFormSubmit = async (data) => {
    setIsSaving(true);
    try {
      let finalStartDateTime;
      let finalEndDateTime;

      if (data.isAllDay) {
        finalStartDateTime = new Date(data.startDate);
        finalStartDateTime.setHours(0, 0, 0, 0);

        finalEndDateTime = data.endDate ? new Date(data.endDate) : new Date(data.startDate);
        finalEndDateTime.setHours(23, 59, 59, 999);
      } else {
        const baseStart = new Date(data.startDate);
        if (data.startTime) {
          finalStartDateTime = parse(data.startTime, "h:mm a", baseStart);
        } else {
          finalStartDateTime = new Date(baseStart);
          finalStartDateTime.setHours(0, 0, 0, 0);
        }

        const baseEnd = data.endDate ? new Date(data.endDate) : new Date(data.startDate);
        if (data.endTime) {
          finalEndDateTime = parse(data.endTime, "h:mm a", baseEnd);
        } else {
          finalEndDateTime = new Date(baseEnd);
          finalEndDateTime.setHours(23, 59, 59, 999);
        }
      }


      const payload = {
        projectId: "697c899668977a7ca2b27462", 
        title: data.title,
        description: data.notes || "",
        eventType: data.eventType,
        status: data.status || "confirmed", 
        startDateTime: finalStartDateTime.toISOString(),
        endDateTime: finalEndDateTime.toISOString(),
        allDay: !!data.isAllDay,
        location: data.location || "",
        audience: {
          type: data.audienceType, 
        },
        meeting: {
          enabled: !!data.isMeeting,
          ...(data.isMeeting && {
            meetingType: "VIDEO",
            roomId: generateRoomId(),
          })
        }
      };

      if (data.audienceType === "DEPARTMENT") {
        payload.audience.departments = data.selectedDepartments;
      } else if (data.audienceType === "USERS") {
        payload.audience.users = data.selectedUsers;
      }

      await onSave(payload);
    } catch (error) {
      console.error("Date parsing error", error);
    } finally {
      setIsSaving(false); 
    }
  };

  useEffect(() => {
    if (open) {
      dispatch(fetchCrewMembers());
      dispatch(fetchDepartments());
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (open) {
      setIsSaving(false); 
      form.reset({
        title: "",
        startDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
        endDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
        startTime: "",
        endTime: "",
        isAllDay: false,
        isMeeting: false,
        eventType: "prep",
        status: "confirmed",
        location: "",
        audienceType: "ALL",
        selectedDepartments: [],
        selectedUsers: [],
        notes: "",
      });
    }
  }, [open, selectedDate, form]);

  const isSubmitting = externalIsSubmitting || isSaving;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col gap-4">
        <DialogHeader className="border-b pb-4">
          <DialogTitle>{createEventFormConfig.title}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {createEventFormConfig.subtitle}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <form id="create-event-form" onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <CreateEventStepsRenderer sections={createEventFormConfig.sections} form={form} />
          </form>
        </div>

        <div className="pt-4 flex justify-end border-t bg-background">
          <Button
            type="submit"
            form="create-event-form"
            disabled={!isValid || isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? "Saving Event..." : "Save Event"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}