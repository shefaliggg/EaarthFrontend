import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Calendar } from "@/shared/components/ui/calendar";
import { CalendarIcon, Check, ChevronsUpDown, PlusCircle } from "lucide-react";
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
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { cn } from "@/shared/config/utils";

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

function CrewSelector({ value = [], onChange }) {
  const { crewMembers } = useSelector((state) => state.calendar);
  const handleToggle = (id) => {
    if (value.includes(id)) onChange(value.filter((item) => item !== id));
    else onChange([...value, id]);
  };
  return (
    <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto bg-card">
      {crewMembers && crewMembers.length > 0 ? (
        crewMembers.map((crew) => {
          const crewId = crew._id || crew.id;
          const isSelected = value.includes(crewId);
          return (
            <div key={crewId} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded">
              <Checkbox id={`crew-${crewId}`} checked={isSelected} onCheckedChange={() => handleToggle(crewId)} />
              <div className="grid gap-0.5 leading-none cursor-pointer flex-1" onClick={() => handleToggle(crewId)}>
                <label htmlFor={`crew-${crewId}`} className="text-sm font-medium leading-none cursor-pointer pointer-events-none">
                  {crew.displayName || crew.name || "Unknown"}
                </label>
                <span className="text-xs text-muted-foreground pointer-events-none">{crew.email}</span>
              </div>
            </div>
          );
        })
      ) : (<p className="text-xs text-muted-foreground text-center py-2">No crew members found.</p>)}
    </div>
  );
}

function DepartmentSelector({ value = [], onChange }) {
  const { departments } = useSelector((state) => state.calendar);
  const handleToggle = (id) => {
    if (value.includes(id)) onChange(value.filter((item) => item !== id));
    else onChange([...value, id]);
  };
  return (
    <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto bg-card">
      {departments && departments.length > 0 ? (
        departments.map((dept) => {
          const isSelected = value.includes(dept._id);
          return (
            <div key={dept._id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded">
              <Checkbox id={`dept-${dept._id}`} checked={isSelected} onCheckedChange={() => handleToggle(dept._id)} />
              <div className="grid gap-0.5 leading-none cursor-pointer flex-1" onClick={() => handleToggle(dept._id)}>
                <label htmlFor={`dept-${dept._id}`} className="text-sm font-medium leading-none cursor-pointer pointer-events-none">
                  {dept.name}
                </label>
              </div>
            </div>
          );
        })
      ) : (<p className="text-xs text-muted-foreground text-center py-2">No departments found.</p>)}
    </div>
  );
}

// 🚀 NEW COMPONENT: A beautiful dropdown that lets you type a custom value!
function CreatableSelect({ field, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  
  // Combine default items with the current value if it's a custom one
  const options = useMemo(() => {
    const defaultOptions = field.items.map(i => i.value.toLowerCase());
    const combined = [...field.items];
    
    if (value && value !== "general" && !defaultOptions.includes(value.toLowerCase())) {
      combined.push({ label: value, value: value });
    }
    return combined;
  }, [field.items, value]);

  const handleSelect = (currentValue) => {
    onChange(currentValue);
    setOpen(false);
    setInputValue("");
  };

  const handleCreateNew = () => {
    if (inputValue.trim()) {
      onChange(inputValue.trim());
      setOpen(false);
      setInputValue("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-background rounded-3xl capitalize font-normal"
        >
          {value ? value.replace("_", " ") : `Select ${field.label}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 border-primary/20 shadow-xl" align="start">
        <div className="flex flex-col">
          <div className="px-3 py-2 border-b border-primary/10">
            <input
              className="flex h-9 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Type to search or create new..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCreateNew();
                }
              }}
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto p-1">
            {options
              .filter(opt => opt.label.toLowerCase().includes(inputValue.toLowerCase()))
              .map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground capitalize",
                  value === option.value ? "bg-accent/50 font-bold text-primary" : ""
                )}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </div>
            ))}
            
            {/* Show "Create New" option if typing something unique */}
            {inputValue.trim() && !options.some(opt => opt.label.toLowerCase() === inputValue.toLowerCase()) && (
              <div
                onClick={handleCreateNew}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-primary/10 text-primary font-medium mt-1 border-t border-primary/10 pt-2"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create "{inputValue}"
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function CreateEventStepsRenderer({ sections, form }) {
  const TIME_OPTIONS = useMemo(() => generateTimeOptions(15), []);
  const isAllDay = form.watch("isAllDay");
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const audienceType = form.watch("audienceType");

  if (!endDate && startDate) {
    if (form.getValues("endDate") !== startDate) {
      form.setValue("endDate", startDate, { shouldValidate: true });
    }
  }

  if (!sections) return null;

  return (
    <div className="space-y-8">
      {sections.map((section) => {
        return (
          <div key={section.id} className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-lg font-medium">{section.title}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields.map((field) => {
                if ((field.name === "startTime" || field.name === "endTime") && isAllDay) return null;
                if (field.name === "selectedDepartments" && audienceType !== "DEPARTMENT") return null;
                if (field.name === "selectedUsers" && audienceType !== "USERS") return null;

                const isFullWidth = [
                  "title", "notes", "location", "audienceType", 
                  "selectedDepartments", "selectedUsers", "isAllDay", "isMeeting"
                ].includes(field.name);
                
                const containerClass = `flex flex-col gap-2 ${isFullWidth ? "md:col-span-2" : ""}`;

                // 🚀 CALLING THE NEW CREATABLE COMPONENT
                if (field.type === "creatable-select") {
                  return (
                    <div key={field.name} className={containerClass}>
                      <Label>{field.label}</Label>
                      <CreatableSelect 
                        field={field} 
                        value={form.watch(field.name)} 
                        onChange={(val) => form.setValue(field.name, val, { shouldDirty: true, shouldValidate: true })} 
                      />
                    </div>
                  );
                }

                if (field.name === "startTime" || field.name === "endTime") {
                  return (
                    <div key={field.name} className={containerClass}>
                      <Label>{field.label}</Label>
                      <Select value={form.watch(field.name)} onValueChange={(value) => form.setValue(field.name, value, { shouldDirty: true, shouldValidate: true })}>
                        <SelectTrigger className="w-full rounded-3xl bg-background"><SelectValue placeholder="Select time" /></SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          {TIME_OPTIONS.map((time) => (<SelectItem key={time} value={time}>{time}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                }

                if (field.isSelect) {
                  return (
                    <div key={field.name} className={containerClass}>
                      <Label>{field.label}</Label>
                      <Select value={form.watch(field.name)} onValueChange={(value) => form.setValue(field.name, value, { shouldDirty: true, shouldValidate: true })}>
                        <SelectTrigger className="w-full rounded-3xl bg-background"><SelectValue placeholder={`Select ${field.label}`} /></SelectTrigger>
                        <SelectContent>
                          {field.items.map((item) => (<SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                }

                if (field.type === "checkbox") {
                  return (
                    <div key={field.name} className={containerClass}>
                      <div className="flex items-center gap-2 mt-2">
                        <Checkbox
                          checked={form.watch(field.name)}
                          onCheckedChange={(checked) => {
                            const isChecked = Boolean(checked);
                            form.setValue(field.name, isChecked, { shouldValidate: true });
                            if (field.name === "isAllDay" && isChecked) {
                              form.setValue("startTime", "", { shouldValidate: true });
                              form.setValue("endTime", "", { shouldValidate: true });
                            }
                          }}
                        />
                        <Label className="mb-0 cursor-pointer">{field.label}</Label>
                      </div>
                    </div>
                  );
                }

                if (field.name === "startDate" || field.name === "endDate") {
                  return (
                    <div key={field.name} className={containerClass}>
                      <DateField
                        label={field.label}
                        value={field.name === "startDate" ? startDate : endDate}
                        minDate={field.name === "endDate" && startDate ? new Date(startDate) : undefined}
                        onChange={(val) => form.setValue(field.name, val, { shouldValidate: true })}
                      />
                    </div>
                  );
                }

                if (field.type === "audience-selector") {
                  return (
                    <div key={field.name} className={containerClass}>
                      <Label className="mb-2">{field.label}</Label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: "Everyone (All Crew)", value: "ALL" },
                          { label: "Specific Departments", value: "DEPARTMENT" },
                          { label: "Individual Users", value: "USERS" },
                        ].map((opt) => (
                          <Button key={opt.value} type="button" variant={audienceType === opt.value ? "default" : "outline"} className="rounded-full" onClick={() => form.setValue("audienceType", opt.value, { shouldValidate: true })}>
                            {opt.label}
                          </Button>
                        ))}
                      </div>
                      {form.formState.errors.audienceType && (<span className="text-destructive text-sm mt-1">{form.formState.errors.audienceType.message}</span>)}
                    </div>
                  );
                }

                if (field.type === "department-select") return (<div key={field.name} className={containerClass}><Label>{field.label}</Label><DepartmentSelector value={form.watch("selectedDepartments") || []} onChange={(newVal) => form.setValue("selectedDepartments", newVal, { shouldValidate: true })}/></div>);
                if (field.type === "crew-select") return (<div key={field.name} className={containerClass}><Label>{field.label}</Label><CrewSelector value={form.watch("selectedUsers") || []} onChange={(newVal) => form.setValue("selectedUsers", newVal, { shouldValidate: true })}/></div>);
                if (field.type === "textarea") return (<div key={field.name} className={containerClass}><Label>{field.label}</Label><Textarea {...form.register(field.name)} className="min-h-[100px]"/></div>);

                return (<div key={field.name} className={containerClass}><Label>{field.label}</Label><Input type={field.type || "text"} {...form.register(field.name)} /></div>);
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}