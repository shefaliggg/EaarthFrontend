import { format, parseISO } from "date-fns";
import {
  Plane,
  User,
  Users,
  Building2,
  Calendar,
  Clock,
  AlertCircle,
  FileText,
  Car,
  Bed,
  Phone,
  Hash,
} from "lucide-react";
import { cn } from "@/shared/config/utils";

function SectionHeader({ icon: Icon, badge, label, accent }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-5 py-3 border-b border-border",
        accent ? "bg-primary/5" : "bg-muted/40",
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-6 h-6 rounded-lg flex items-center justify-center shrink-0",
          accent ? "bg-primary/15" : "bg-border",
        )}
      >
        <Icon
          className={cn(
            "w-3.5 h-3.5",
            accent ? "text-primary" : "text-muted-foreground",
          )}
          strokeWidth={1.75}
        />
      </div>

      <div className="flex items-center gap-2">
        {badge && (
          <span
            className={cn(
              "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border",
              accent
                ? "bg-primary/15 text-primary border-primary/20"
                : "bg-muted text-muted-foreground border-border",
            )}
          >
            {badge}
          </span>
        )}
        <span
          className={cn(
            "text-[11px] font-bold uppercase tracking-[0.1em]",
            accent ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function Field({ label, value, icon: Icon, wide, mono }) {
  return (
    <div className={cn("space-y-1", wide && "col-span-2")}>
      <div className="flex items-center gap-1.5">
        {Icon && (
          <Icon
            className="w-3 h-3 text-muted-foreground/60"
            strokeWidth={1.75}
          />
        )}
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
      </div>
      <p
        className={cn(
          "leading-snug",
          mono
            ? "text-[11px] font-mono tracking-tight"
            : "text-[12px] font-semibold text-foreground",
        )}
      >
        {value || (
          <span className="text-muted-foreground/30 italic font-normal text-[11px]">
            —
          </span>
        )}
      </p>
    </div>
  );
}

function Grid2({ children, className }) {
  return (
    <div className={cn("grid grid-cols-2 gap-x-6 gap-y-4 p-5", className)}>
      {children}
    </div>
  );
}

function Card({ children, className }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card overflow-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default function TmoDocument({ tmo }) {
  if (!tmo) return null;

  const isGroup =
    tmo.isGroup || /crew|team|unit|department/i.test(tmo.name || "");
  const NameIcon = isGroup ? Users : User;

  return (
    <article
      className="bg-background text-foreground h-full"
      style={{ fontFamily: '"Outfit", system-ui, sans-serif' }}
    >
      {/* HEADER */}
      <div className="bg-primary/5 dark:bg-primary/10 relative overflow-hidden border-b border-primary/10">
        <div className="relative flex items-center justify-between px-7 pt-6 pb-0">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 bg-background rounded-xl flex items-center justify-center border border-primary/20 shadow-sm">
              <Plane className="w-5 h-5 text-primary" />
            </div>
            <div className="w-px h-9 bg-primary/15" />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-primary leading-none">
                RAINBOW STUDIOS
              </p>
              <p className="text-[9px] text-muted-foreground mt-0.5 leading-none">
                Avatar 1
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground">
              TMO Reference
            </p>
            <p className="text-[11px] font-mono font-bold text-foreground mt-0.5">
              {tmo.tmoNumber || "TMO-XXXX"}
            </p>
            <p className="text-[9px] text-muted-foreground mt-0.5">
              {tmo.createdAt
                ? format(parseISO(tmo.createdAt), "dd MMM yyyy")
                : "Date N/A"}
            </p>
          </div>
        </div>

        {/* Title & Badges */}
        <div className="relative px-7 pt-5 pb-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
            Travel Movement Order
          </p>
          <h1 className="text-[22px] font-black text-foreground leading-tight tracking-tight">
            {tmo.name || "Unnamed Traveler"}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            <p className="text-[11px] font-medium text-muted-foreground truncate">
              {tmo.department || "Department N/A"}
            </p>
          </div>
        </div>
      </div>

      {/*BODY */}
      <div className="bg-background px-6 py-5 space-y-4">
        <Card>
          <SectionHeader
            icon={NameIcon}
            label={isGroup ? "Group Details" : "Traveler Details"}
          />
          <Grid2>
            <Field
              label={isGroup ? "Group" : "Full Name"}
              value={tmo.name}
              icon={NameIcon}
            />
            <Field label="Department" value={tmo.department} icon={Building2} />
          </Grid2>
        </Card>

        {tmo.sections?.map((section) => {
          if (section.type === "travel" && section.travelDetails) {
            const { travelDetails } = section;
            return (
              <Card key={section.id}>
                <SectionHeader
                  icon={Plane}
                  badge="Flight"
                  label={section.title || "Travel Details"}
                  accent
                />
                <div className="p-5 border-b border-border grid grid-cols-2 gap-x-6 gap-y-4">
                  <Field
                    label="Travel Date"
                    value={
                      travelDetails.date
                        ? format(
                            parseISO(travelDetails.date),
                            "EEEE, do MMMM yyyy",
                          )
                        : "TBD"
                    }
                    icon={Calendar}
                    wide
                  />
                  <Field
                    label="Airline"
                    value={travelDetails.airline}
                    icon={Plane}
                  />
                  <Field
                    label="Flight Number"
                    value={travelDetails.flightNumber}
                    icon={Hash}
                  />
                  <Field
                    label="Booking Ref"
                    value={travelDetails.bookingRef}
                    icon={FileText}
                    mono
                    wide
                  />
                </div>

                <div className="px-5 py-6 flex items-center justify-between bg-muted/20 border-b border-border">
                  <div className="flex-1">
                    <p className="text-[28px] font-bold text-foreground leading-none">
                      {travelDetails.departTime}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1.5">
                      {travelDetails.departLocation}
                    </p>
                  </div>
                  <div className="px-8 flex flex-col items-center">
                    <Plane className="w-5 h-5 text-primary/40 mb-2" />
                    <div className="w-24 h-px bg-border relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-border" />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-border" />
                    </div>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-[28px] font-bold text-foreground leading-none">
                      {travelDetails.arriveTime}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1.5">
                      {travelDetails.arriveLocation}
                    </p>
                  </div>
                </div>

                {(travelDetails.transportToAirport ||
                  travelDetails.transportOnArrival) && (
                  <div className="p-5 bg-muted/10 grid grid-cols-2 gap-6">
                    {travelDetails.transportToAirport && (
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <Car className="w-3 h-3 text-muted-foreground" />
                          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                            Airport Transfer
                          </p>
                        </div>
                        <p className="text-[12px] font-semibold text-foreground">
                          {travelDetails.transportToAirport}
                        </p>
                      </div>
                    )}
                    {travelDetails.transportOnArrival && (
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <Car className="w-3 h-3 text-muted-foreground" />
                          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                            Arrival Transfer
                          </p>
                        </div>
                        <p className="text-[12px] font-semibold text-foreground whitespace-pre-wrap">
                          {travelDetails.transportOnArrival}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          }

          /* --- ACCOMMODATION --- */
          if (
            section.type === "accommodation" &&
            section.accommodationDetails
          ) {
            const { accommodationDetails: acc } = section;
            return (
              <Card key={section.id}>
                <SectionHeader
                  icon={Building2}
                  badge="Hotel"
                  label={section.title || "Accommodation"}
                  accent
                />

                <Grid2 className="border-b border-border">
                  <Field
                    label="Check In"
                    value={
                      acc.startDate
                        ? format(parseISO(acc.startDate), "EEE, do MMM yyyy")
                        : "TBD"
                    }
                    icon={Calendar}
                  />
                  <Field
                    label="Check Out"
                    value={
                      acc.endDate
                        ? format(parseISO(acc.endDate), "EEE, do MMM yyyy")
                        : "TBD"
                    }
                    icon={Calendar}
                  />
                  <Field
                    label="Check In Time"
                    value={acc.checkIn}
                    icon={Clock}
                  />
                  <Field
                    label="Check Out Time"
                    value={acc.checkOut}
                    icon={Clock}
                  />
                </Grid2>

                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-foreground">
                        {acc.hotelName}
                      </p>
                      <p className="text-[12px] text-muted-foreground whitespace-pre-line mt-1">
                        {acc.address}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
                    <Bed className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-2">
                      Room Type
                    </p>
                    <p className="text-[12px] font-semibold text-foreground">
                      {acc.roomType}
                    </p>
                  </div>
                </div>

                {acc.notes && (
                  <div className="p-4 bg-amber-500/10 border-t border-amber-500/20">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 mb-1">
                          Accommodation Notes
                        </p>
                        <p className="text-[12px] text-amber-900/80 leading-relaxed whitespace-pre-line">
                          {acc.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          }
          return null;
        })}

        {/* 🚀 FIXED: Dynamic Contacts Array Rendering */}
        {tmo.contacts && tmo.contacts.length > 0 && (
          <Card>
            <SectionHeader icon={Phone} label="Travel Support Contacts" />
            <div className="p-5 grid grid-cols-2 gap-y-4 gap-x-6">
              {tmo.contacts.map((contact, i) => (
                <div key={contact.id || i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 border border-primary/20">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.14em] text-muted-foreground mb-0.5">
                      {contact.role}
                    </p>
                    <p className="text-[13px] font-bold text-foreground leading-tight">
                      {contact.name}
                    </p>
                    <p className="text-[11px] font-mono text-muted-foreground mt-0.5 font-medium">
                      {contact.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="text-center pt-2 pb-6">
          <p className="text-[8px] font-mono text-muted-foreground/40 uppercase tracking-widest">
            Confidential · Travel Movement Order · {tmo.tmoNumber} · RAINBOW STUDIOS
          </p>
        </div>
      </div>
    </article>
  );
}