import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import FilterPillTabs from "@/shared/components/FilterPillTabs";
import CreateEventStepsRenderer from "./CreateEventStepsRenderer";
import { createEventFormConfig } from "../config/createEventFormConfig";
import { createEventSchema } from "../config/createEventSchema";

export default function CreateEventModal({ open, onClose, selectedDate }) {
  const form = useForm({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      startDate: selectedDate?.toISOString().split("T")[0],
      endDate: "",
      isMultiDay: false,
      eventType: "other",
      location: "",
      color: "#000000",
      notes: "",
    },
    mode: "onChange",
  });

  const [step, setStep] = useState(createEventFormConfig.steps[0].value);

  const activeStep = createEventFormConfig.steps.find(
    (s) => s.value === step
  );

  const handleSubmit = (data) => {
    console.log("Create Event:", data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col gap-8">
        <DialogHeader>
          <DialogTitle>{createEventFormConfig.title}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {createEventFormConfig.subtitle}
          </DialogDescription>
        </DialogHeader>

        <FilterPillTabs
          options={createEventFormConfig.steps}
          value={step}
          onChange={setStep}
        />

        <div className="flex-1 overflow-y-auto pr-1">
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <CreateEventStepsRenderer
              step={activeStep}
              form={form}
            />

            <div className="pt-4 flex justify-end gap-3 bg-background sticky bottom-0">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>

              <Button type="submit">
                Save Event
              </Button>
            </div>
          </form>
        </div>

      </DialogContent>
    </Dialog>
  );
}
