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
import { format } from "date-fns";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/shared/components/ui/tooltip";
import FilterPillTabs from "@/shared/components/FilterPillTabs";
import CreateEventStepsRenderer from "./CreateEventStepsRenderer";
import { createEventFormConfig } from "../config/createEventFormConfig";
import { createEventSchema } from "../config/createEventSchema";

export default function CreateEventModal({
  open,
  onClose,
  selectedDate,
  onSave,
}) {
  const form = useForm({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      startDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
      endDate: "",
      startTime: "",
      endTime: "",
      isMultiDay: false,
      isAllDay: false,
      eventType: "other",
      location: "",
      color: "#000000",
      notes: "",
    },

    mode: "onTouched",
  });

  const [currentStepValue, setCurrentStepValue] = useState(
    createEventFormConfig.steps[0].value
  );

  const currentStep = createEventFormConfig.steps.find(
    (step) => step.value === currentStepValue
  );

  const currentStepIndex = createEventFormConfig.steps.findIndex(
    (step) => step.value === currentStepValue
  );

  const currentFields =
    createEventFormConfig.steps[currentStepIndex]?.fields?.map(
      (field) => field.name
    ) || [];

  const canProceed = currentFields.every((fieldName) => {
    const value = form.watch(fieldName);

    if (fieldName === "isAllDay") return true;

    if (
      form.watch("isAllDay") &&
      ["startTime", "endTime"].includes(fieldName)
    ) {
      return true;
    }

    return Boolean(value);
  });

  const goToNextStep = async () => {
    const fields =
      createEventFormConfig.steps[currentStepIndex]?.fields?.map(
        (field) => field.name
      ) || [];

    const isValid = await form.trigger(fields);

    if (isValid && currentStepIndex < createEventFormConfig.steps.length - 1) {
      const nextFields =
        createEventFormConfig.steps[currentStepIndex + 1]?.fields?.map(
          (field) => field.name
        ) || [];

      nextFields.forEach((name) => form.clearErrors(name));

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
  const finalEndTime = data.endTime || data.startTime;

  onSave({
    id: Date.now(),
    ...data,
    endTime: finalEndTime,
  });

  onClose();
};


useEffect(() => {
  if (open) {
    form.reset({
      title: "",
      startDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
      endDate: "",
      startTime: "",
      endTime: "",
      isMultiDay: false,
      isAllDay: false,
      eventType: "other",
      location: "",
      color: "#000000",
      notes: "",
    });

    setCurrentStepValue(createEventFormConfig.steps[0].value);
  }
}, [open, selectedDate]);

 
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col gap-8">
        <DialogHeader>
          <DialogTitle>{createEventFormConfig.title}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {createEventFormConfig.subtitle}
          </DialogDescription>
        </DialogHeader>

        <FilterPillTabs
          options={createEventFormConfig.steps}
          value={currentStepValue}
          onChange={setCurrentStepValue}
          readOnly
        />

        <div className="flex-1 overflow-y-auto pr-1">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="space-y-6"
          >
            <CreateEventStepsRenderer step={currentStep} form={form} />

            <div className="pt-4 flex justify-between bg-background sticky bottom-0">
              <div>
                {currentStepIndex > 0 && (
                  <Button variant="outline" onClick={goToPreviousStep}>
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex gap-3">
                {currentStepIndex < createEventFormConfig.steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={goToNextStep}
                    disabled={!canProceed}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={form.handleSubmit(handleFormSubmit)}
                    type="submit"
                  >
                    Save Event
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
