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
import { useEffect } from "react";
import { format, parse } from "date-fns";
import { useDispatch } from "react-redux";
import { fetchCrewMembers, fetchDepartments } from "../../store/calendar.thunks";
import CreateEventStepsRenderer from "./CreateEventStepsRenderer";
import { createEventFormConfig } from "../config/createEventFormConfig";
import { createEventSchema } from "../config/createEventSchema";

const generateRoomId = () => {
  return `ROOM-${Math.random().toString(36).substring(7).toUpperCase()}`;
};

export default function EditEventModal({
  open,
  onClose,
  eventToEdit,
  onSave,
  isSubmitting,
}) {
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      isAllDay: false,
      isMeeting: false,
      productionPhase: "prep", // UPDATED TO MATCH BACKEND
      eventCategory: "general", // UPDATED TO MATCH BACKEND
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

  useEffect(() => {
    if (open) {
      dispatch(fetchCrewMembers());
      dispatch(fetchDepartments());
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (open && eventToEdit) {
      const start = new Date(eventToEdit.startDateTime);
      const end = new Date(eventToEdit.endDateTime);

      form.reset({
        title: eventToEdit.title || "",
        startDate: format(start, "yyyy-MM-dd"),
        endDate: format(end, "yyyy-MM-dd"),
        startTime: eventToEdit.allDay ? "" : format(start, "h:mm a"),
        endTime: eventToEdit.allDay ? "" : format(end, "h:mm a"),
        isAllDay: eventToEdit.allDay || false,
        isMeeting: !!eventToEdit.meeting?.enabled,
        
        // NOW LOADS THE CORRECT PHASE & CATEGORY FROM DB
        productionPhase: eventToEdit.productionPhase || "prep",
        eventCategory: eventToEdit.eventCategory || "general",
        
        status: eventToEdit.status || "confirmed",
        location: eventToEdit.location || "",
        audienceType: eventToEdit.audience?.type || "ALL",
        selectedDepartments: eventToEdit.audience?.departments?.map(d => d._id || d) || [],
        selectedUsers: eventToEdit.audience?.users?.map(u => u._id || u) || [],
        notes: eventToEdit.description || "",
      });
    }
  }, [open, eventToEdit, form]);

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
        if (data.startTime) {
          finalStartDateTime = parse(data.startTime, "h:mm a", baseStart);
        } else {
          finalStartDateTime = new Date(baseStart);
          finalStartDateTime.setHours(0, 0, 0, 0);
        }

        const baseEnd = data.endDate
          ? new Date(data.endDate)
          : new Date(data.startDate);
        if (data.endTime) {
          finalEndDateTime = parse(data.endTime, "h:mm a", baseEnd);
        } else {
          finalEndDateTime = new Date(baseEnd);
          finalEndDateTime.setHours(23, 59, 59, 999);
        }
      }

      const payload = {
        projectId: eventToEdit.projectId || "697c899668977a7ca2b27462", 
        title: data.title,
        description: data.notes || "",
        
        // NOW SENDS CORRECT DATA TO BACKEND
        productionPhase: data.productionPhase, 
        eventCategory: data.eventCategory,
        
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
            roomId: eventToEdit.meeting?.roomId || generateRoomId(),
          })
        }
      };

      if (data.audienceType === "DEPARTMENT") {
        payload.audience.departments = data.selectedDepartments;
      } else if (data.audienceType === "USERS") {
        payload.audience.users = data.selectedUsers;
      }

      onSave(eventToEdit.eventCode, payload);
    } catch (error) {
      console.error("Date parsing error", error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col gap-4">
        <DialogHeader className="border-b pb-4">
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Update the details for this scheduled event.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 pb-8">
          <form id="edit-event-form" onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <CreateEventStepsRenderer sections={createEventFormConfig.sections} form={form} />
          </form>
        </div>

        <div className="pt-4 flex justify-end border-t bg-background">
          <Button
            type="submit"
            form="edit-event-form"
            disabled={!isValid || isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? "Updating Event..." : "Update Event"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}