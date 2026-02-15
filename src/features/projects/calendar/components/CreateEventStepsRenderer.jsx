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
import { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCrewMembers } from "../../store/calendar.thunks";

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
          <Button variant="outline" className="justify-start gap-2 w-full">
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

// --- FIXED CREW SELECTOR ---
function CrewSelector({ value = [], onChange }) {
  const dispatch = useDispatch();
  const { crewMembers } = useSelector((state) => state.calendar);

  useEffect(() => {
    if (!crewMembers || crewMembers.length === 0) {
      dispatch(fetchCrewMembers());
    }
  }, [dispatch, crewMembers]);

  const handleToggle = (id) => {
    if (value.includes(id)) {
      onChange(value.filter((item) => item !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto bg-card">
      {crewMembers && crewMembers.length > 0 ? (
        crewMembers.map((crew) => {
          const crewId = crew._id || crew.id;
          const isSelected = value.includes(crewId);

          return (
            <div
              key={crewId}
              className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded"
            >
              {/* 
                 FIX: We control the checkbox completely. 
                 We do NOT use the parent div onClick anymore to avoid bubbling issues.
              */}
              <Checkbox
                id={`crew-${crewId}`}
                checked={isSelected}
                onCheckedChange={() => handleToggle(crewId)}
              />
              
              {/* Clicking the label wrapper also toggles it safely */}
              <div 
                className="grid gap-0.5 leading-none cursor-pointer flex-1"
                onClick={() => handleToggle(crewId)}
              >
                <label
                  htmlFor={`crew-${crewId}`}
                  className="text-sm font-medium leading-none cursor-pointer pointer-events-none" // prevent label from double firing
                >
                  {crew.displayName || crew.name || "Unknown"}
                </label>
                <span className="text-xs text-muted-foreground pointer-events-none">
                  {crew.email}
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-xs text-muted-foreground text-center py-2">
          No crew members found.
        </p>
      )}
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

        if (field.type === "crew-select") {
          return (
            <div key={field.name} className="flex flex-col gap-2">
              <Label>{field.label}</Label>
              <CrewSelector
                value={form.watch("attendees") || []}
                onChange={(newVal) => form.setValue("attendees", newVal)}
              />
            </div>
          );
        }

        if (field.type === "textarea") {
          return (
            <div key={field.name} className="flex flex-col gap-2">
              <Label>{field.label}</Label>
              <Textarea
                {...form.register(field.name)}
                className="min-h-[100px]"
              />
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