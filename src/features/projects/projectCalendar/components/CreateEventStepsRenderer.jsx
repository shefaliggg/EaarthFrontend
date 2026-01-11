import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Calendar } from "@/shared/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import { format } from "date-fns";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Textarea } from "@/shared/components/ui/textarea";
import { useMemo } from "react";

function generateTimeOptions(step = 15) {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += step) {
      const hour12 = h % 12 || 12;
      const ampm = h < 12 ? "AM" : "PM";
      const minutes = m.toString().padStart(2, "0");
      times.push(`${hour12}:${minutes} ${ampm}`);
    }
  }
  return times;
}

function DateField({ label, value, onChange, minDate }) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start gap-2">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            {value ? format(new Date(value), "dd-MM-yyyy") : "Pick a date"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            fromDate={minDate}
            onSelect={(date) =>
              onChange(date ? format(date, "yyyy-MM-dd") : "")
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}


export default function CreateEventStepsRenderer({ step, form }) {
  const TIME_OPTIONS = useMemo(() => generateTimeOptions(15), []);
  const isAllDay = form.watch("isAllDay");
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  if (!endDate && startDate) {
    form.setValue("endDate", startDate);
  }

  if (!step) return null;

  return (
    <div className="space-y-4">
      {step.fields.map((field) => {
        if (
          (field.name === "startTime" || field.name === "endTime") &&
          isAllDay
        ) {
          return null;
        }

        if (field.name === "startTime" || field.name === "endTime") {
          return (
            <div key={field.name} className="flex flex-col gap-2">
              <Label>{field.label}</Label>

              <Select
                value={form.watch(field.name)}
                onValueChange={(value) =>
                  form.setValue(field.name, value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-full rounded-3xl bg-background">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>

                <SelectContent className="max-h-60 overflow-y-auto">
                  {TIME_OPTIONS.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }

        if (field.isSelect) {
          return (
            <div key={field.name} className="flex flex-col gap-2">
              <Label>{field.label}</Label>

              <Select
                defaultValue="other"
                value={form.watch(field.name) || "other"}
                onValueChange={(value) =>
                  form.setValue(field.name, value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-full rounded-3xl bg-background">
                  <SelectValue placeholder={`Select ${field.label}`} />
                </SelectTrigger>

                <SelectContent>
                  {field.items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }

        if (field.type === "checkbox") {
          return (
            <div key={field.name} className="flex items-center gap-2">
              <Checkbox
                checked={form.watch(field.name)}
                onCheckedChange={(checked) => {
                  const isChecked = Boolean(checked);
                  form.setValue(field.name, isChecked);

                  if (field.name === "isAllDay" && isChecked) {
                    form.setValue("startTime", "");
                    form.setValue("endTime", "");
                  }
                }}
              />
              <Label>{field.label}</Label>
            </div>
          );
        }

        if (field.name === "startDate") {
          return (
            <DateField
              key={field.name}
              label={field.label}
              value={startDate}
              onChange={(val) => form.setValue("startDate", val)}
            />
          );
        }

        if (field.name === "endDate") {
          return (
            <DateField
              key={field.name}
              label={field.label}
              value={endDate}
              minDate={startDate ? new Date(startDate) : undefined}
              onChange={(val) => form.setValue("endDate", val)}
            />
          );
        }

        if (field.name === "color") {
          return (
            <div key={field.name} className="flex flex-col gap-2">
              <Label>{field.label}</Label>

              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  className="w-12 h-10 p-1 cursor-pointer"
                  value={form.watch("color")}
                  onChange={(e) => form.setValue("color", e.target.value)}
                />

                <Input
                  type="text"
                  value={form.watch("color")}
                  onChange={(e) => form.setValue("color", e.target.value)}
                  placeholder="#000000"
                />
              </div>
            </div>
          );
        }

        return (
          <div key={field.name} className="flex flex-col gap-2">
            <Label>{field.label}</Label>
            <Input type={field.type || "text"} {...form.register(field.name)} />
          </div>
        );
      })}
    </div>
  );
}
