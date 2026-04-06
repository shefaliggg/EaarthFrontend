/**
 * AllowancePanel.jsx
 *
 * Slide-in panel for editing per-row allowances in BulkOfferCreate.
 * All fields identical to ContractForm allowance section.
 * Default values pre-filled from defaultAllowances — users enable/edit/clear freely.
 * Reuses Checkbox, Button from shared UI (same as ContractForm).
 *
 * FIX: CAP_CALC_OPTIONS now uses value: "none" as the placeholder sentinel
 * instead of value: "" — Radix UI <SelectItem> forbids empty string values.
 * Reading/writing converts "none" ↔ "" at the boundary.
 */

import { useState } from "react";
import {
  Package, Monitor, Code, Wrench, Car, Smartphone, Home, UtensilsCrossed,
  ChevronDown, ChevronRight, X,
} from "lucide-react";
import { Checkbox } from "../../../../shared/components/ui/checkbox";
import { Button }   from "../../../../shared/components/ui/button";
import { Badge }    from "../../../../shared/components/ui/badge";
import { cn }       from "../../../../shared/config/utils";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../../../shared/components/ui/select";

// ── Allowance config — identical order/fields to ContractForm ────────────────
export const ALLOWANCE_CONFIG = [
  { key: "boxRental",  label: "BOX RENTAL",            Icon: Package,         type: "feeWeekWithCap", hasDescription: true  },
  { key: "computer",   label: "COMPUTER ALLOWANCE",    Icon: Monitor,         type: "feeWeekWithCap", hasDescription: false },
  { key: "software",   label: "SOFTWARE ALLOWANCE",    Icon: Code,            type: "feeWeek",        hasDescription: true  },
  { key: "equipment",  label: "EQUIPMENT RENTAL",      Icon: Wrench,          type: "feeWeek",        hasDescription: true  },
  { key: "vehicle",    label: "VEHICLE ALLOWANCE",     Icon: Car,             type: "feeWeek",        hasDescription: false },
  { key: "mobile",     label: "MOBILE PHONE ALLOWANCE",Icon: Smartphone,      type: "feeWeek",        hasDescription: false },
  { key: "living",     label: "LIVING ALLOWANCE",      Icon: Home,            type: "living",         hasDescription: false },
  { key: "perDiem1",   label: "PER DIEM 1",            Icon: UtensilsCrossed, type: "perDiem",        hasDescription: false },
  { key: "perDiem2",   label: "PER DIEM 2",            Icon: UtensilsCrossed, type: "perDiem",        hasDescription: false },
];

export const ALLOW_SHORT = {
  boxRental: "BOX", computer: "COMP", software: "SOFT", equipment: "EQUIP",
  vehicle: "VEH", mobile: "MOB", living: "LIV", perDiem1: "PD1", perDiem2: "PD2",
};

// FIX: "none" sentinel instead of "" — Radix SelectItem rejects empty string values
const CAP_CALC_OPTIONS = [
  { value: "none",        label: "— Select —" },
  { value: "flat_figure", label: "Flat Figure" },
  { value: "weekly",      label: "Weekly" },
  { value: "monthly",     label: "Monthly" },
];

const SI = "rounded-lg mx-1 my-px cursor-pointer hover:bg-accent/30 focus:bg-accent/30 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary data-[state=checked]:font-semibold";
const SC = "border-border rounded-xl shadow-lg shadow-primary/10 z-[200] bg-popover";

// ── Field components matching ContractForm style ─────────────────────────────
function FieldLabel({ children }) {
  return <label className="text-[10px] text-muted-foreground font-medium block mb-1">{children}</label>;
}

function TextInput({ value, onChange, placeholder = "", className = "", ...props }) {
  return (
    <input
      value={value ?? ""}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full border border-border rounded px-2 py-1 text-[11px] bg-input uppercase focus:outline-none focus:ring-1 focus:ring-primary/40",
        className
      )}
      {...props}
    />
  );
}

function NumberInput({ value, onChange, prefix = "£", className = "" }) {
  return (
    <div className="relative">
      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground select-none">{prefix}</span>
      <input
        type="number"
        step="0.01"
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
        className={cn(
          "w-full border border-border rounded pl-5 pr-2 py-1 text-[11px] bg-input focus:outline-none focus:ring-1 focus:ring-primary/40",
          className
        )}
      />
    </div>
  );
}

// ── Main AllowancePanel ───────────────────────────────────────────────────────
export function AllowancePanel({ row, onClose, onUpdate }) {
  const allowances = row.allowances;
  const cs = { GBP: "£", USD: "$", EUR: "€", AUD: "A$", CAD: "C$", NZD: "NZ$", DKK: "kr", ISK: "kr" }[row.currency] || "£";

  // Track which enabled allowances have their detail section open
  const [openKeys, setOpenKeys] = useState(
    () => Object.keys(allowances).filter(k => allowances[k]?.enabled)
  );

  const toggleOpen = key =>
    setOpenKeys(prev => prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key]);

  // Update a single field on a single allowance key
  const setField = (key, field, value) => {
    const v = typeof value === "string" && field !== "currency" ? value.toUpperCase() : value;
    onUpdate(row.id, `allowances.${key}.${field}`, v);
  };

  // FIX helpers: convert "" ↔ "none" at the Radix Select boundary
  const capValue  = (al) => al.capCalculatedAs || "none";
  const capChange = (key, v) => setField(key, "capCalculatedAs", v === "none" ? "" : v);

  const enabledCount = Object.values(allowances).filter(a => a?.enabled).length;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-end z-50">
      <div className="h-full w-full max-w-[520px] bg-card border-l border-border shadow-2xl flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div>
            <h2 className="text-sm font-bold text-foreground">Allowances</h2>
            <p className="text-[10px] text-muted-foreground truncate max-w-[340px]">
              {row.recipient?.fullName || "New row"} · {enabledCount} enabled
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <p className="text-[10px] text-muted-foreground px-1">
            Enable allowances below. Default values are pre-filled from production standards — edit freely.
          </p>
          <p className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1.5">
            ⚠ Budget Code and Tag are hidden from printed contracts.
          </p>

          {ALLOWANCE_CONFIG.map(({ key, label, Icon, type, hasDescription }) => {
            const al   = allowances[key] || {};
            const open = openKeys.includes(key);

            return (
              <div key={key} className="border border-border rounded-lg overflow-hidden">

                {/* Toggle header — identical to ContractForm */}
                <div className={cn(
                  "flex items-center justify-between px-3 py-2 transition-colors",
                  al.enabled ? "bg-primary/5" : "bg-accent/10"
                )}>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`allow_${key}_${row.id}`}
                      checked={!!al.enabled}
                      onCheckedChange={v => {
                        setField(key, "enabled", v);
                        if (v && !openKeys.includes(key)) setOpenKeys(p => [...p, key]);
                      }}
                    />
                    <label htmlFor={`allow_${key}_${row.id}`} className="flex items-center gap-1.5 cursor-pointer">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-medium text-primary tracking-wide">{label}</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] px-2 py-0 h-5 rounded-full font-medium",
                        al.enabled
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "text-muted-foreground"
                      )}
                    >
                      {al.enabled ? "ENABLED" : "DISABLED"}
                    </Badge>
                    {al.enabled && (
                      <button
                        onClick={() => toggleOpen(key)}
                        className="text-muted-foreground hover:text-primary transition-colors p-0.5"
                      >
                        {open
                          ? <ChevronDown className="w-3.5 h-3.5" />
                          : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Detail fields — only shown when enabled + open */}
                {al.enabled && open && (
                  <div className="px-3 py-2.5 space-y-2 bg-background/60">

                    {/* Budget Code + Tag */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <FieldLabel>Budget Code</FieldLabel>
                        <TextInput
                          value={al.budgetCode}
                          onChange={v => setField(key, "budgetCode", v)}
                          className="font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <FieldLabel>Tag</FieldLabel>
                        <TextInput
                          value={al.tag}
                          onChange={v => setField(key, "tag", v)}
                          className="font-mono"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    {hasDescription && (
                      <div className="space-y-1">
                        <FieldLabel>Description</FieldLabel>
                        <TextInput
                          value={al.description}
                          onChange={v => setField(key, "description", v)}
                        />
                      </div>
                    )}

                    {/* feeWeek / feeWeekWithCap — Fee Per Week + Terms */}
                    {(type === "feeWeek" || type === "feeWeekWithCap") && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <FieldLabel>Fee Per Week</FieldLabel>
                          <NumberInput
                            value={al.feePerWeek}
                            onChange={v => setField(key, "feePerWeek", v)}
                            prefix={cs}
                          />
                        </div>
                        <div className="space-y-1">
                          <FieldLabel>Terms</FieldLabel>
                          <TextInput
                            value={al.terms}
                            onChange={v => setField(key, "terms", v)}
                          />
                        </div>
                      </div>
                    )}

                    {/* Cap fields — feeWeekWithCap only */}
                    {type === "feeWeekWithCap" && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <FieldLabel>Cap Calculated As</FieldLabel>
                          <Select
                            value={capValue(al)}
                            onValueChange={v => capChange(key, v)}
                          >
                            <SelectTrigger className="h-8 bg-input border-border text-xs [&>svg]:text-primary">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent className={SC}>
                              {CAP_CALC_OPTIONS.map(o => (
                                <SelectItem className={SI} key={o.value} value={o.value}>{o.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <FieldLabel>Cap Amount</FieldLabel>
                          <TextInput
                            value={(al.rateCap ?? "").replace(/^£/, "")}
                            onChange={v => setField(key, "rateCap", `£${v}`)}
                            placeholder="e.g. 250.00"
                          />
                        </div>
                      </div>
                    )}

                    {/* Per Diem */}
                    {type === "perDiem" && (
                      <>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <FieldLabel>Currency</FieldLabel>
                            <Select
                              value={al.currency ?? "GBP"}
                              onValueChange={v => setField(key, "currency", v)}
                            >
                              <SelectTrigger className="h-8 bg-input border-border text-xs [&>svg]:text-primary">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className={SC}>
                                {["GBP", "USD", "EUR"].map(c => (
                                  <SelectItem className={SI} key={c} value={c}>{c}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <FieldLabel>Shoot Day</FieldLabel>
                            <NumberInput
                              value={al.shootDayRate}
                              onChange={v => setField(key, "shootDayRate", v)}
                              prefix={al.currency === "USD" ? "$" : "£"}
                            />
                          </div>
                          <div className="space-y-1">
                            <FieldLabel>Non-Shoot</FieldLabel>
                            <NumberInput
                              value={al.nonShootDayRate}
                              onChange={v => setField(key, "nonShootDayRate", v)}
                              prefix={al.currency === "USD" ? "$" : "£"}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <FieldLabel>Terms</FieldLabel>
                          <TextInput
                            value={al.terms}
                            onChange={v => setField(key, "terms", v)}
                          />
                        </div>
                      </>
                    )}

                    {/* Living */}
                    {type === "living" && (
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <FieldLabel>Currency</FieldLabel>
                          <Select
                            value={al.currency ?? "GBP"}
                            onValueChange={v => setField(key, "currency", v)}
                          >
                            <SelectTrigger className="h-8 bg-input border-border text-xs [&>svg]:text-primary">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className={SC}>
                              {["GBP", "USD", "EUR"].map(c => (
                                <SelectItem className={SI} key={c} value={c}>{c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <FieldLabel>Weekly Rate</FieldLabel>
                          <NumberInput
                            value={al.weeklyRate}
                            onChange={v => setField(key, "weeklyRate", v)}
                            prefix="£"
                          />
                        </div>
                        <div className="space-y-1">
                          <FieldLabel>Terms</FieldLabel>
                          <TextInput
                            value={al.terms}
                            onChange={v => setField(key, "terms", v)}
                          />
                        </div>
                      </div>
                    )}

                    {/* Cap fields — feeWeek (not feeWeekWithCap) */}
                    {type === "feeWeek" && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <FieldLabel>Cap Calculated As</FieldLabel>
                          <Select
                            value={capValue(al)}
                            onValueChange={v => capChange(key, v)}
                          >
                            <SelectTrigger className="h-8 bg-input border-border text-xs [&>svg]:text-primary">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent className={SC}>
                              {CAP_CALC_OPTIONS.map(o => (
                                <SelectItem className={SI} key={o.value} value={o.value}>{o.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <FieldLabel>Cap Amount</FieldLabel>
                          <TextInput
                            value={(al.rateCap ?? "").replace(/^£/, "")}
                            onChange={v => setField(key, "rateCap", `£${v}`)}
                            placeholder="e.g. 100.00"
                          />
                        </div>
                      </div>
                    )}

                    {/* Payable In */}
                    <div className="space-y-1">
                      <FieldLabel>Payable In</FieldLabel>
                      <div className="flex items-center gap-4">
                        {[["payablePrep", "PREP"], ["payableShoot", "SHOOT"], ["payableWrap", "WRAP"]].map(([field, lbl]) => (
                          <label key={field} className="flex items-center gap-1.5 cursor-pointer">
                            <Checkbox
                              id={`${key}_${field}_${row.id}`}
                              checked={!!al[field]}
                              onCheckedChange={v => setField(key, field, v)}
                            />
                            <span className="text-xs font-normal">{lbl}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 px-4 py-3 border-t border-border bg-card">
          <Button onClick={onClose} className="w-full h-8 text-[12px]">Done</Button>
        </div>
      </div>
    </div>
  );
}