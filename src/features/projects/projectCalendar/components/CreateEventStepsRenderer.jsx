import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";

export default function CreateEventStepsRenderer({ step, form }) {
  if (!step) return null;

  return (
    <div className="space-y-4">
      {step.fields.map((field) => {
        if (field.isSelect) {
          return (
            <div key={field.name} className="flex flex-col gap-2">
              <Label>{field.label}</Label>

              <Select
                value={form.watch(field.name)}
                onValueChange={(value) =>
                  form.setValue(field.name, value, {
                    shouldValidate: true,
                    shouldDirty: true,
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

              {form.formState.errors[field.name] && (
                <p className="text-xs text-red-500">
                  {form.formState.errors[field.name].message}
                </p>
              )}
            </div>
          );
        }

        if (field.type === "checkbox") {
          return (
            <div key={field.name} className="flex items-center gap-2">
              <input
                type="checkbox"
                {...form.register(field.name)}
                className="accent-purple-600"
              />
              <Label>{field.label}</Label>
            </div>
          );
        }

        if (field.type === "textarea") {
          return (
            <div key={field.name} className="flex flex-col gap-2">
              <Label>{field.label}</Label>
              <textarea
                {...form.register(field.name)}
                className="w-full min-h-[80px] rounded-xl border bg-background p-3"
                placeholder="Additional information..."
              />
            </div>
          );
        }

        return (
          <div key={field.name} className="flex flex-col gap-2">
            <Label>{field.label}</Label>
            <Input
              type={field.type || "text"}
              {...form.register(field.name)}
            />

            {form.formState.errors[field.name] && (
              <p className="text-xs text-red-500">
                {form.formState.errors[field.name].message}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
