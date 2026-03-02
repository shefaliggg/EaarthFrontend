import { useMemo } from "react";
import { useFieldArray } from "react-hook-form";
import { Plus, X, Trash2, FileText, Info, Phone } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { tmoFormConfig } from "../../config/tmoFormConfig";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

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

const ErrorMsg = ({ name, errors }) => {
  const error = name.split(".").reduce((acc, part) => acc?.[part], errors);
  return error ? (
    <span className="text-destructive text-[10px] mt-1 block font-medium">
      {error.message}
    </span>
  ) : null;
};

export default function TmoStepsRenderer({
  form,
  attachments,
  setAttachments,
}) {
  const TIME_OPTIONS = useMemo(() => generateTimeOptions(15), []);
  const formErrors = form.formState.errors;

  // Array for Flights & Hotels
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sections",
  });

  // Array for Contacts
  const { 
    fields: contactFields, 
    append: appendContact, 
    remove: removeContact 
  } = useFieldArray({
    control: form.control,
    name: "contacts",
  });

  const handleAddSection = (type) => {
    append({
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: "",
      travelDetails:
        type === "travel"
          ? {
              date: new Date().toISOString().split("T")[0],
              airline: "",
              flightNumber: "",
              departTime: "",
              arriveTime: "",
            }
          : undefined,
      accommodationDetails:
        type === "accommodation"
          ? {
              startDate: new Date().toISOString().split("T")[0],
              endDate: new Date().toISOString().split("T")[0],
              hotelName: "",
              address: "",
              checkIn: "",
              checkOut: "",
            }
          : undefined,
    });
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newAttachment = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type.includes("pdf") ? "pdf" : "other",
        size: `${(file.size / 1024).toFixed(1)} KB`,
      };
      setAttachments([...attachments, newAttachment]);
    }
  };

  return (
    <div className="space-y-6 py-4">
      {/* BASIC DETAILS */}
      <div className="grid grid-cols-2 gap-4 border-b border-primary/20 pb-6">
        <div className="space-y-2">
          <Label>
            TMO Number <span className="text-destructive">*</span>
          </Label>
          <Input {...form.register("tmoNumber")} placeholder="#001" />
          <ErrorMsg name="tmoNumber" errors={formErrors} />
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={form.watch("status")}
            onValueChange={(val) =>
              form.setValue("status", val, { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {tmoFormConfig.statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>
            Traveler / Group Name <span className="text-destructive">*</span>
          </Label>
          <Input {...form.register("name")} placeholder="e.g. Camera Unit A" />
          <ErrorMsg name="name" errors={formErrors} />
        </div>
        <div className="space-y-2">
          <Label>Department</Label>
          <Input {...form.register("department")} placeholder="e.g. Camera" />
        </div>

        <div className="space-y-2 col-span-2 md:col-span-1">
          <Label>Creation Date</Label>
          <Input type="date" {...form.register("createdAt")} />
          <ErrorMsg name="createdAt" errors={formErrors} />
        </div>
      </div>

      {/* ATTACHMENTS */}
      <div className="space-y-2 border-b border-primary/20 pb-6">
        <Label>Attachments (Tickets, Vouchers)</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="bg-muted border border-primary/20 rounded-md px-3 py-1 text-xs flex items-center gap-2"
            >
              <FileText size={12} className="text-primary" />
              <span className="truncate max-w-36">{att.name}</span>
              <button
                type="button"
                onClick={() =>
                  setAttachments(attachments.filter((a) => a.id !== att.id))
                }
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
        <div className="relative">
          <Input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Label
            htmlFor="file-upload"
            className="inline-flex items-center justify-center rounded-md text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 cursor-pointer"
          >
            <Plus size={14} className="mr-1.5" /> Attach File
          </Label>
        </div>
      </div>

      {/* ITINERARY BUILDER */}
      <div className="space-y-4 border-b border-primary/20 pb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3 bg-primary/5 p-4 rounded-xl border border-primary/10">
          <div>
            <Label className="text-sm font-black flex items-center gap-1.5 text-primary">
              <Info className="w-4 h-4" />
              Itinerary Builder
            </Label>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Build a complete travel itinerary by adding as many flights and
              hotels as needed for this movement order.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddSection("travel")}
              className="bg-background border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
            >
              <Plus className="w-3 h-3 mr-1.5" /> Add Flight
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddSection("accommodation")}
              className="bg-background border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
            >
              <Plus className="w-3 h-3 mr-1.5" /> Add Hotel
            </Button>
          </div>
        </div>

        <div className="space-y-4 mt-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border border-primary/20 rounded-xl p-5 bg-muted/20 relative group shadow-sm"
            >
              <div className="absolute right-3 top-3 flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  onClick={() => remove(index)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              <div className="mb-5 pr-12">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {field.type === "travel"
                    ? "Flight Route"
                    : "Accommodation Title"}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  {...form.register(`sections.${index}.title`)}
                  className="font-bold uppercase bg-background mt-1 text-primary"
                  placeholder={
                    field.type === "travel"
                      ? "e.g. LONDON LHR ➔ GENEVA GVA"
                      : "e.g. THE RITZ-CARLTON MUMBAI"
                  }
                />
                <ErrorMsg
                  name={`sections.${index}.title`}
                  errors={formErrors}
                />
              </div>

              {/* TRAVEL SECTION */}
              {field.type === "travel" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">
                        Travel Date <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="date"
                        {...form.register(
                          `sections.${index}.travelDetails.date`,
                        )}
                        className="bg-background"
                      />
                      <ErrorMsg
                        name={`sections.${index}.travelDetails.date`}
                        errors={formErrors}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">
                        Transport to Airport
                      </Label>
                      <Input
                        {...form.register(
                          `sections.${index}.travelDetails.transportToAirport`,
                        )}
                        placeholder="e.g. Taxi pick up at 06:00..."
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div className="border border-primary/10 p-4 rounded-xl bg-background space-y-4 shadow-sm">
                    <Label className="text-[10px] font-bold uppercase text-primary/70 tracking-wider">
                      Flight Details
                    </Label>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                          Airline <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          {...form.register(
                            `sections.${index}.travelDetails.airline`,
                          )}
                          placeholder="e.g. British Airways"
                        />
                        <ErrorMsg
                          name={`sections.${index}.travelDetails.airline`}
                          errors={formErrors}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                          Flight No. <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          {...form.register(
                            `sections.${index}.travelDetails.flightNumber`,
                          )}
                          placeholder="e.g. BA 728"
                        />
                        <ErrorMsg
                          name={`sections.${index}.travelDetails.flightNumber`}
                          errors={formErrors}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                          Booking Ref
                        </Label>
                        <Input
                          {...form.register(
                            `sections.${index}.travelDetails.bookingRef`,
                          )}
                          placeholder="e.g. XY72LM"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5">
                        <Label className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                          Depart Time{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={form.watch(
                            `sections.${index}.travelDetails.departTime`,
                          )}
                          onValueChange={(val) =>
                            form.setValue(
                              `sections.${index}.travelDetails.departTime`,
                              val,
                              { shouldValidate: true },
                            )
                          }
                        >
                          <SelectTrigger className="w-full bg-background">
                            <SelectValue placeholder="Select Time" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            {TIME_OPTIONS.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <ErrorMsg
                          name={`sections.${index}.travelDetails.departTime`}
                          errors={formErrors}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                          Depart Location{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          {...form.register(
                            `sections.${index}.travelDetails.departLocation`,
                          )}
                          placeholder="e.g. London Heathrow (LHR)"
                        />
                        <ErrorMsg
                          name={`sections.${index}.travelDetails.departLocation`}
                          errors={formErrors}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5">
                        <Label className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                          Arrive Time{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={form.watch(
                            `sections.${index}.travelDetails.arriveTime`,
                          )}
                          onValueChange={(val) =>
                            form.setValue(
                              `sections.${index}.travelDetails.arriveTime`,
                              val,
                              { shouldValidate: true },
                            )
                          }
                        >
                          <SelectTrigger className="w-full bg-background">
                            <SelectValue placeholder="Select Time" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            {TIME_OPTIONS.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <ErrorMsg
                          name={`sections.${index}.travelDetails.arriveTime`}
                          errors={formErrors}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                          Arrive Location{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          {...form.register(
                            `sections.${index}.travelDetails.arriveLocation`,
                          )}
                          placeholder="e.g. Geneva (GVA)"
                        />
                        <ErrorMsg
                          name={`sections.${index}.travelDetails.arriveLocation`}
                          errors={formErrors}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">
                      Transport on Arrival
                    </Label>
                    <Textarea
                      {...form.register(
                        `sections.${index}.travelDetails.transportOnArrival`,
                      )}
                      className="bg-background"
                      placeholder="e.g. Driver will meet at arrivals..."
                    />
                  </div>
                </div>
              )}

              {/* ACCOMMODATION SECTION */}
              {field.type === "accommodation" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">
                        Check In Date{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="date"
                        {...form.register(
                          `sections.${index}.accommodationDetails.startDate`,
                        )}
                        className="bg-background"
                      />
                      <ErrorMsg
                        name={`sections.${index}.accommodationDetails.startDate`}
                        errors={formErrors}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">
                        Check Out Date{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="date"
                        {...form.register(
                          `sections.${index}.accommodationDetails.endDate`,
                        )}
                        className="bg-background"
                      />
                      <ErrorMsg
                        name={`sections.${index}.accommodationDetails.endDate`}
                        errors={formErrors}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">
                      Hotel Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      {...form.register(
                        `sections.${index}.accommodationDetails.hotelName`,
                      )}
                      className="bg-background"
                      placeholder="e.g. The Ritz-Carlton"
                    />
                    <ErrorMsg
                      name={`sections.${index}.accommodationDetails.hotelName`}
                      errors={formErrors}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">
                      Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      {...form.register(
                        `sections.${index}.accommodationDetails.address`,
                      )}
                      className="bg-background"
                      placeholder="Full hotel address..."
                    />
                    <ErrorMsg
                      name={`sections.${index}.accommodationDetails.address`}
                      errors={formErrors}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">
                        Check In Time{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={form.watch(
                          `sections.${index}.accommodationDetails.checkIn`,
                        )}
                        onValueChange={(val) =>
                          form.setValue(
                            `sections.${index}.accommodationDetails.checkIn`,
                            val,
                            { shouldValidate: true },
                          )
                        }
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Select Time" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          {TIME_OPTIONS.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <ErrorMsg
                        name={`sections.${index}.accommodationDetails.checkIn`}
                        errors={formErrors}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">
                        Check Out Time{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={form.watch(
                          `sections.${index}.accommodationDetails.checkOut`,
                        )}
                        onValueChange={(val) =>
                          form.setValue(
                            `sections.${index}.accommodationDetails.checkOut`,
                            val,
                            { shouldValidate: true },
                          )
                        }
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Select Time" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          {TIME_OPTIONS.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <ErrorMsg
                        name={`sections.${index}.accommodationDetails.checkOut`}
                        errors={formErrors}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Room Type</Label>
                    <Input
                      {...form.register(
                        `sections.${index}.accommodationDetails.roomType`,
                      )}
                      className="bg-background"
                      placeholder="e.g. Lake View Suite"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Notes</Label>
                    <Textarea
                      {...form.register(
                        `sections.${index}.accommodationDetails.notes`,
                      )}
                      className="bg-background"
                      placeholder="e.g. Late checkout requested..."
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-end">
          <div>
            <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-primary" />
              Travel Support Contacts
            </Label>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Add key contacts to assist the traveler during their journey.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendContact({ id: Math.random().toString(36).substr(2, 9), role: '', name: '', phone: '' })}
            className="bg-background border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
          >
            <Plus className="w-3 h-3 mr-1.5" /> Add Contact
          </Button>
        </div>

        <div className="space-y-3">
          {contactFields.map((field, index) => (
            <div key={field.id} className="flex gap-3 items-start group">
              <div className="grid grid-cols-3 gap-3 flex-1">
                <div>
                  <Label className="text-[10px] uppercase text-muted-foreground hidden group-first:block mb-1">Role *</Label>
                  <Input {...form.register(`contacts.${index}.role`)} placeholder="e.g. Travel Coord" />
                  <ErrorMsg name={`contacts.${index}.role`} errors={formErrors} />
                </div>
                <div>
                  <Label className="text-[10px] uppercase text-muted-foreground hidden group-first:block mb-1">Name *</Label>
                  <Input {...form.register(`contacts.${index}.name`)} placeholder="e.g. Lexi Milligan" />
                  <ErrorMsg name={`contacts.${index}.name`} errors={formErrors} />
                </div>
                <div>
                  <Label className="text-[10px] uppercase text-muted-foreground hidden group-first:block mb-1">Phone Number *</Label>
                  <Input {...form.register(`contacts.${index}.phone`)} placeholder="e.g. +44 7527..." />
                  <ErrorMsg name={`contacts.${index}.phone`} errors={formErrors} />
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeContact(index)}
                className="mt-0 group-first:mt-5 text-muted-foreground hover:text-destructive shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {contactFields.length === 0 && (
             <div className="p-4 border border-dashed border-primary/30 rounded-xl text-center text-xs text-muted-foreground bg-primary/5">
                No support contacts added. Click the button above to add one.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}