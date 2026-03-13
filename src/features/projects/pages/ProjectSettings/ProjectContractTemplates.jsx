/**
 * ProjectSettingsPage.jsx
 * src/features/contracts/pages/ProjectSettingsPage.jsx
 *
 * Admin panel for configuring contract bundles per project.
 *
 * Three tabs:
 *   1. Contract Categories   — POST /contract/categories
 *   2. Contract Form Groups  — POST /contract/form-groups (seeder + template upload)
 *   3. Contract Bundles      — POST /contract/bundles (assign forms to bundles)
 *
 * All data fetched from:
 *   GET /project-settings/:projectId  (returns { categories, formGroups, bundles })
 *
 * Static bundle shape for display comes from bundleResolver.js (preview only).
 * Real ContractInstances are generated backend-side in moveToPendingCrewSignature().
 */

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Settings2, Plus, Trash2, Upload, RefreshCw, Eye, Star, StarOff,
  ChevronRight, ChevronDown, FileText, Layers, Package, Grid3x3,
  CheckCircle2, AlertCircle, Loader2, X, Save, Pencil, Check,
  Tag, ArrowRight, Boxes, FolderOpen, LayoutTemplate,
} from "lucide-react";

import { cn } from "../../../../shared/config/utils";
import { Button }   from "../../../../shared/components/ui/button";
import { Input }    from "../../../../shared/components/ui/input";
import { Label }    from "../../../../shared/components/ui/label";
import { Badge }    from "../../../../shared/components/ui/badge";
import { Checkbox } from "../../../../shared/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../../../shared/components/ui/select";

import {
  CATEGORIES as DEFAULT_CATEGORIES,
  CATEGORY_IDS,
  BUNDLE_FORMS_MAP,
  SHARED_ALLOWANCE_FORMS,
  ENGAGEMENT_LABELS,
} from "../../../crew/utils/bundleResolver";

// ─── Config ──────────────────────────────────────────────────────────────────
// TODO: move to src/config/appConfig.js or import from env
const STUDIO_ID  = import.meta.env?.VITE_STUDIO_ID  ?? "69494aa6df29472c2c6b5d8f";
const PROJECT_ID = import.meta.env?.VITE_PROJECT_ID ?? "697c899668977a7ca2b27462";

const API = {
  getSettings:      () => `/api/project-settings/${PROJECT_ID}`,
  createCategory:   () => `/api/studio/${STUDIO_ID}/form-groups`,   // seeder endpoint
  seedFormGroups:   () => `/api/studio/${STUDIO_ID}/seed-form-groups`,
  uploadTemplate:   (groupId, formKey) => `/api/form-groups/${groupId}/forms/${formKey}/template`,
  replaceTemplate:  (groupId, formKey) => `/api/form-groups/${groupId}/forms/${formKey}/template`,
  deleteTemplate:   (groupId, formKey) => `/api/form-groups/${groupId}/forms/${formKey}/template`,
  toggleDefault:    (groupId, formKey) => `/api/form-groups/${groupId}/forms/${formKey}/default`,
  previewTemplate:  (groupId, formKey) => `/api/form-groups/${groupId}/forms/${formKey}/preview`,
};

// ─── Pay combos (display metadata) ───────────────────────────────────────────
const PAY_COMBOS = [
  { freq: "daily",  type: "paye",      label: "Daily PAYE",          color: "violet" },
  { freq: "daily",  type: "schd",      label: "Daily Schedule D",    color: "sky"    },
  { freq: "daily",  type: "loan_out",  label: "Daily Loan Out",      color: "amber"  },
  { freq: "daily",  type: "long_form", label: "Daily Direct Hire",   color: "emerald"},
  { freq: "weekly", type: "paye",      label: "Weekly PAYE",         color: "violet" },
  { freq: "weekly", type: "schd",      label: "Weekly Schedule D",   color: "sky"    },
  { freq: "weekly", type: "loan_out",  label: "Weekly Loan Out",     color: "amber"  },
  { freq: "weekly", type: "long_form", label: "Weekly Direct Hire",  color: "emerald"},
];

const COLOR_MAP = {
  violet:  { pill: "bg-violet-500/15 text-violet-300 border-violet-500/25",  dot: "bg-violet-400" },
  sky:     { pill: "bg-sky-500/15 text-sky-300 border-sky-500/25",           dot: "bg-sky-400"    },
  amber:   { pill: "bg-amber-500/15 text-amber-300 border-amber-500/25",     dot: "bg-amber-400"  },
  emerald: { pill: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",dot: "bg-emerald-400"},
};

// ─── Tiny helpers ─────────────────────────────────────────────────────────────

function Pill({ label, color = "violet" }) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.violet;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border", c.pill)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", c.dot)} />
      {label}
    </span>
  );
}

function SectionHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-zinc-300" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white tracking-tight">{title}</h2>
          {subtitle && <p className="text-[11px] text-zinc-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-zinc-600" />
      </div>
      <p className="text-xs text-zinc-600">{text}</p>
    </div>
  );
}

function StatusDot({ ok }) {
  return (
    <span className={cn(
      "inline-block w-1.5 h-1.5 rounded-full",
      ok ? "bg-emerald-400" : "bg-zinc-600"
    )} />
  );
}

// ─── Inline editable text ─────────────────────────────────────────────────────

function InlineEdit({ value, onSave, className }) {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft  ] = useState(value);
  const ref                   = useRef(null);

  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);

  const commit = () => {
    if (draft.trim() && draft !== value) onSave(draft.trim());
    setEditing(false);
  };

  if (!editing) {
    return (
      <button
        onClick={() => { setDraft(value); setEditing(true); }}
        className={cn("group flex items-center gap-1.5 text-left", className)}>
        {value}
        <Pencil className="w-3 h-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <input
        ref={ref}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
        className="bg-white/10 border border-white/20 rounded px-2 py-0.5 text-xs text-white outline-none focus:border-white/40 w-40"
      />
      <button onClick={commit} className="p-1 rounded hover:bg-white/10 text-emerald-400">
        <Check className="w-3 h-3" />
      </button>
    </div>
  );
}

// ─── TAB 1: Categories ────────────────────────────────────────────────────────

function TabCategories({ categories, onAdd, onDelete, onRename, loading }) {
  const [name, setName]     = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await onAdd(name.trim());
    setName("");
    setSaving(false);
  };

  return (
    <div>
      <SectionHeader
        icon={Grid3x3}
        title="Contract Categories"
        subtitle="Each category maps to a contract bundle. Standard Crew, HOD, Electrical etc."
      />

      {/* Add form */}
      <div className="flex gap-2 mb-5 bg-white">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="e.g. Standard Crew"
          className="h-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 text-sm focus:border-white/20 focus:ring-0"
        />
        <Button
          onClick={handleAdd}
          disabled={!name.trim() || saving}
          className="h-9 px-4 bg-white text-black hover:bg-white/90 text-xs font-semibold shrink-0">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Plus className="w-3.5 h-3.5 mr-1.5" />Add</>}
        </Button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
        </div>
      ) : categories.length === 0 ? (
        <EmptyState icon={Grid3x3} text="No categories yet. Add one above." />
      ) : (
        <div className="space-y-1.5">
          {categories.map((cat, i) => (
            <div key={cat._id ?? i}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] group hover:bg-white/[0.06] transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-zinc-600 w-5">{String(i + 1).padStart(2, "0")}</span>
                <InlineEdit
                  value={cat.name}
                  onSave={(v) => onRename(cat._id, v)}
                  className="text-sm font-medium text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <code className="text-[9px] font-mono text-zinc-600 bg-white/5 px-2 py-0.5 rounded">
                  {CATEGORY_IDS[cat.name] ?? cat.name.toLowerCase().replace(/\s+/g, "_")}
                </code>
                <button
                  onClick={() => onDelete(cat._id)}
                  className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="mt-5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
        <p className="text-[11px] text-zinc-500 leading-relaxed">
          <span className="text-zinc-300 font-medium">How categories work: </span>
          Each category is combined with a pay frequency (daily/weekly) and engagement type (PAYE, Schedule D, Loan Out, Direct Hire)
          to form a contract bundle. 7 categories × 8 pay combos = 56 bundles total.
        </p>
      </div>
    </div>
  );
}

// ─── TAB 2: Form Groups ───────────────────────────────────────────────────────

function TabFormGroups({ formGroups, onSeed, onUpload, onDelete, onToggleDefault, loading }) {
  const [seeding,    setSeeding   ] = useState(false);
  const [previewing, setPreviewing] = useState(null);
  const fileInputRef                = useRef(null);
  const pendingRef                  = useRef(null);

  const totalForms    = formGroups.reduce((s, g) => s + (g.forms?.length ?? 0), 0);
  const uploadedForms = formGroups.reduce((s, g) => s + (g.forms?.filter((f) => f.hasTemplate)?.length ?? 0), 0);

  const triggerUpload = (groupId, formKey) => {
    pendingRef.current       = { groupId, formKey };
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !pendingRef.current) return;
    const { groupId, formKey } = pendingRef.current;
    await onUpload(groupId, formKey, file);
    pendingRef.current = null;
  };

  const handleSeed = async () => {
    setSeeding(true);
    await onSeed();
    setSeeding(false);
  };

  const TYPE_COLOR = {
    contract:  "text-amber-400 bg-amber-400/10",
    allowance: "text-sky-400 bg-sky-400/10",
    standard:  "text-emerald-400 bg-emerald-400/10",
    optional:  "text-violet-400 bg-violet-400/10",
    tax:       "text-pink-400 bg-pink-400/10",
  };

  return (
    <div>
      <input ref={fileInputRef} type="file" accept=".html,text/html" className="hidden" onChange={handleFileChange} />

      <SectionHeader
        icon={FolderOpen}
        title="Contract Form Groups"
        subtitle={`${formGroups.length} groups · ${uploadedForms}/${totalForms} templates uploaded`}
        action={
          formGroups.length === 0 ? (
            <Button onClick={handleSeed} disabled={seeding}
              className="h-8 px-3 bg-white text-black hover:bg-white/90 text-xs font-semibold">
              {seeding
                ? <><Loader2 className="w-3 h-3 mr-1.5 animate-spin" />Seeding...</>
                : <><Boxes className="w-3 h-3 mr-1.5" />Seed from templates</>}
            </Button>
          ) : null
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
        </div>
      ) : formGroups.length === 0 ? (
        <EmptyState icon={FolderOpen} text="No form groups yet. Seed from templates to get started." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {formGroups.map((group) => {
            const filled = group.forms?.filter((f) => f.hasTemplate)?.length ?? 0;
            const total  = group.forms?.length ?? 0;
            const pct    = total > 0 ? Math.round((filled / total) * 100) : 0;

            return (
              <div key={group._id}
                className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                {/* Group header */}
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                  <div>
                    <p className="text-[12px] font-semibold text-white">{group.name}</p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">{filled}/{total} uploaded</p>
                  </div>
                  {/* Progress bar */}
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-zinc-600 font-mono">{pct}%</span>
                  </div>
                </div>

                {/* Forms list */}
                <div className="px-2 py-1.5 space-y-px">
                  {group.forms?.map((form) => (
                    <div key={form.key}
                      className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/[0.04] group/form transition-colors">

                      <StatusDot ok={form.hasTemplate} />

                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] text-zinc-300 truncate block">{form.name}</span>
                      </div>

                      <span className={cn(
                        "text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0",
                        TYPE_COLOR[form.displayType] ?? TYPE_COLOR.standard
                      )}>
                        {form.displayType}
                      </span>

                      {form.isDefault && (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-teal-400/10 text-teal-400 uppercase shrink-0">
                          DEFAULT
                        </span>
                      )}

                      {/* Actions — visible on hover */}
                      <div className="flex items-center gap-0.5 opacity-0 group-hover/form:opacity-100 transition-opacity shrink-0">
                        {form.hasTemplate && (
                          <button
                            onClick={() => setPreviewing({ groupId: group._id, formKey: form.key, name: form.name })}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-sky-400 hover:bg-sky-400/10 transition-colors"
                            title="Preview">
                            <Eye className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => triggerUpload(group._id, form.key)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-violet-400 hover:bg-violet-400/10 transition-colors"
                          title={form.hasTemplate ? "Replace" : "Upload HTML"}>
                          {form.hasTemplate
                            ? <RefreshCw className="w-3 h-3" />
                            : <Upload className="w-3 h-3" />}
                        </button>
                        {form.hasTemplate && (
                          <button
                            onClick={() => onDelete(group._id, form.key)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                            title="Remove template">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => onToggleDefault(group._id, form.key)}
                          className={cn(
                            "p-1.5 rounded-lg transition-colors",
                            form.isDefault
                              ? "text-teal-400 hover:bg-teal-400/10"
                              : "text-zinc-600 hover:text-teal-400 hover:bg-teal-400/10"
                          )}
                          title={form.isDefault ? "Remove default" : "Set default"}>
                          {form.isDefault
                            ? <Star className="w-3 h-3 fill-teal-400" />
                            : <StarOff className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview modal */}
      {previewing && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={(e) => e.target === e.currentTarget && setPreviewing(null)}>
          <div className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-semibold text-white">{previewing.name}</span>
                <code className="text-[9px] bg-white/10 px-2 py-0.5 rounded font-mono text-zinc-400">
                  {previewing.formKey}
                </code>
              </div>
              <button onClick={() => setPreviewing(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-0 h-[500px]">
              <iframe
                src={API.previewTemplate(previewing.groupId, previewing.formKey)}
                className="w-full h-full"
                title={previewing.name}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TAB 3: Contract Bundles ──────────────────────────────────────────────────

function TabBundles({ categories, formGroups }) {
  const [filterCat, setFilterCat] = useState("All");

  // Build all bundles from categories × PAY_COMBOS
  // Shape matches what bundleResolver.js resolves on the frontend
  const allBundles = categories.flatMap((cat) =>
    PAY_COMBOS.map((combo) => {
      const payFamilyKey = {
        paye:      "PAYE",
        schd:      "Self Employed",
        loan_out:  "Loan Out",
        long_form: "PAYE", // Direct Hire uses PAYE forms
      }[combo.type] ?? "PAYE";

      const contractForms  = BUNDLE_FORMS_MAP[payFamilyKey] ?? BUNDLE_FORMS_MAP["PAYE"];
      const allowanceForms = SHARED_ALLOWANCE_FORMS;

      return {
        id:           `${cat.name}::${combo.label}`,
        name:         `${combo.label} — ${cat.name}`,
        category:     cat.name,
        freq:         combo.freq,
        engType:      combo.type,
        comboLabel:   combo.label,
        color:        combo.color,
        contractForms,
        allowanceForms,
      };
    })
  );

  const filterOpts = ["All", ...categories.map((c) => c.name)];
  const visible    = filterCat === "All"
    ? allBundles
    : allBundles.filter((b) => b.category === filterCat);

  if (categories.length === 0) {
    return (
      <div>
        <SectionHeader icon={Package} title="Contract Bundles" subtitle="Auto-generated from categories × pay combos" />
        <EmptyState icon={Package} text="Add contract categories first to generate bundles." />
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        icon={Package}
        title="Contract Bundles"
        subtitle={`${allBundles.length} bundles auto-generated · ${categories.length} categories × 8 pay combos`}
      />

      {/* Category filter */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {filterOpts.map((c) => (
          <button key={c} onClick={() => setFilterCat(c)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all",
              filterCat === c
                ? "bg-white text-black"
                : "bg-white/5 border border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
            )}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {visible.map((bundle) => (
          <BundleCard key={bundle.id} bundle={bundle} />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
        <p className="text-[11px] text-zinc-500 leading-relaxed">
          <span className="text-zinc-300 font-medium">Read-only preview. </span>
          Bundles are resolved at runtime when an offer reaches{" "}
          <code className="text-violet-400 text-[10px] bg-violet-400/10 px-1.5 py-px rounded">PENDING_CREW_SIGNATURE</code>.
          The backend calls <code className="text-zinc-400 text-[10px] bg-white/5 px-1.5 py-px rounded">generateContractInstances()</code> using
          the offer's <code className="text-zinc-400 text-[10px] bg-white/5 px-1.5 py-px rounded">categoryId</code>,{" "}
          <code className="text-zinc-400 text-[10px] bg-white/5 px-1.5 py-px rounded">engagementType</code>, and{" "}
          <code className="text-zinc-400 text-[10px] bg-white/5 px-1.5 py-px rounded">dailyOrWeekly</code>.
        </p>
      </div>
    </div>
  );
}

function BundleCard({ bundle }) {
  const [open, setOpen] = useState(false);
  const c = COLOR_MAP[bundle.color] ?? COLOR_MAP.violet;

  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between px-4 py-3 hover:bg-white/[0.03] transition-colors text-left">
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-[11px] font-semibold text-white leading-tight truncate">{bundle.name}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Pill label={bundle.comboLabel} color={bundle.color} />
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-0.5">
          <span className="text-[9px] text-zinc-600">
            {bundle.contractForms.length + bundle.allowanceForms.length} forms
          </span>
          {open
            ? <ChevronDown className="w-3.5 h-3.5 text-zinc-600" />
            : <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-white/[0.06] px-4 py-3 space-y-3">
          {/* Contract forms */}
          <div>
            <p className="text-[9px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
              Contract forms
            </p>
            <div className="space-y-1">
              {bundle.contractForms.map((f) => (
                <div key={f.key} className="flex items-center gap-2">
                  <FileText className="w-3 h-3 text-zinc-600 shrink-0" />
                  <span className="text-[11px] text-zinc-300">{f.label}</span>
                  {!f.required && (
                    <span className="ml-auto text-[8px] text-zinc-600">optional</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Allowance forms */}
          <div>
            <p className="text-[9px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
              Allowance forms
            </p>
            <div className="space-y-1">
              {bundle.allowanceForms.map((f) => (
                <div key={f.key} className="flex items-center gap-2">
                  <Tag className="w-3 h-3 text-zinc-600 shrink-0" />
                  <span className="text-[11px] text-zinc-300">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = [
  { key: "categories", label: "Categories",   Icon: Grid3x3,       count: (s) => s.categories.length },
  { key: "groups",     label: "Form Groups",  Icon: FolderOpen,    count: (s) => s.formGroups.length },
  { key: "bundles",    label: "Bundles",       Icon: Package,       count: (s) => s.categories.length * 8 },
];

export default function ProjectSettingsPage() {
  const [activeTab,  setActiveTab ] = useState("categories");
  const [loading,    setLoading   ] = useState(true);
  const [saving,     setSaving    ] = useState(false);
  const [toast,      setToast     ] = useState(null);   // { type: "ok"|"err", message }

  const [state, setState] = useState({
    categories: DEFAULT_CATEGORIES.map((name, i) => ({
      _id:  CATEGORY_IDS[name] ?? `cat_${i}`,
      name,
    })),
    formGroups: [],
  });

  // ── Toast helper ──────────────────────────────────────────────────────────
  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Fetch initial data ────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(API.getSettings());
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        if (!cancelled) {
          setState({
            categories: data.categories ?? state.categories,
            formGroups: data.formGroups ?? [],
          });
        }
      } catch {
        // Silently use defaults — backend may not have endpoint yet
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // ── Category handlers ─────────────────────────────────────────────────────
  const handleAddCategory = async (name) => {
    try {
      const res = await fetch(`/api/studio/${STUDIO_ID}/form-groups`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, projectId: PROJECT_ID }),
      });
      if (!res.ok) throw new Error();
      const cat = await res.json();
      setState((s) => ({ ...s, categories: [...s.categories, cat.data ?? { _id: cat._id, name }] }));
      showToast("ok", `Category "${name}" added`);
    } catch {
      showToast("err", "Failed to add category");
    }
  };

  const handleDeleteCategory = async (id) => {
    setState((s) => ({ ...s, categories: s.categories.filter((c) => c._id !== id) }));
    showToast("ok", "Category removed");
  };

  const handleRenameCategory = async (id, name) => {
    setState((s) => ({
      ...s,
      categories: s.categories.map((c) => c._id === id ? { ...c, name } : c),
    }));
  };

  // ── Form group handlers ───────────────────────────────────────────────────
  const handleSeed = async () => {
    try {
      const res = await fetch(API.seedFormGroups(), {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ studioId: STUDIO_ID }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setState((s) => ({ ...s, formGroups: data.formGroups ?? data.data ?? [] }));
      showToast("ok", "Form groups seeded from templates");
    } catch {
      showToast("err", "Failed to seed form groups");
    }
  };

  const handleUploadTemplate = async (groupId, formKey, file) => {
    try {
      const form = new FormData();
      form.append("template", file);
      const existing = state.formGroups
        .flatMap((g) => g.forms ?? [])
        .find((f) => f.key === formKey);
      const method = existing?.hasTemplate ? "PUT" : "POST";
      const url    = existing?.hasTemplate
        ? API.replaceTemplate(groupId, formKey)
        : API.uploadTemplate(groupId, formKey);
      const res = await fetch(url, { method, body: form });
      if (!res.ok) throw new Error();
      setState((s) => ({
        ...s,
        formGroups: s.formGroups.map((g) =>
          g._id !== groupId ? g : {
            ...g,
            forms: g.forms.map((f) =>
              f.key !== formKey ? f : { ...f, hasTemplate: true }
            ),
          }
        ),
      }));
      showToast("ok", "Template uploaded");
    } catch {
      showToast("err", "Upload failed");
    }
  };

  const handleDeleteTemplate = async (groupId, formKey) => {
    try {
      await fetch(API.deleteTemplate(groupId, formKey), { method: "DELETE" });
      setState((s) => ({
        ...s,
        formGroups: s.formGroups.map((g) =>
          g._id !== groupId ? g : {
            ...g,
            forms: g.forms.map((f) =>
              f.key !== formKey ? f : { ...f, hasTemplate: false }
            ),
          }
        ),
      }));
      showToast("ok", "Template removed");
    } catch {
      showToast("err", "Failed to remove template");
    }
  };

  const handleToggleDefault = async (groupId, formKey) => {
    try {
      await fetch(API.toggleDefault(groupId, formKey), { method: "PATCH" });
      setState((s) => ({
        ...s,
        formGroups: s.formGroups.map((g) =>
          g._id !== groupId ? g : {
            ...g,
            forms: g.forms.map((f) =>
              f.key !== formKey ? f : { ...f, isDefault: !f.isDefault }
            ),
          }
        ),
      }));
    } catch {
      showToast("err", "Failed to update default");
    }
  };

  const counts = {
    categories: state.categories.length,
    groups:     state.formGroups.length,
    bundles:    state.categories.length * 8,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b]">

      {/* ── Toast ── */}
      {toast && (
        <div className={cn(
          "fixed top-4 right-4 z-[999] flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium shadow-2xl transition-all",
          toast.type === "ok"
            ? "bg-emerald-950 border-emerald-800 text-emerald-300"
            : "bg-red-950 border-red-800 text-red-300"
        )}>
          {toast.type === "ok"
            ? <CheckCircle2 className="w-4 h-4" />
            : <AlertCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-6 py-8">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
              <Settings2 className="w-5 h-5 text-zinc-300" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-white tracking-tight">Contract Settings</h1>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Project ID:{" "}
                <code className="text-zinc-400 font-mono text-[10px]">{PROJECT_ID}</code>
              </p>
            </div>
          </div>

          {/* Pipeline flow indicator */}
          <div className="hidden lg:flex items-center gap-2 text-[10px] text-zinc-600">
            {["Categories", "Form Groups", "Bundles", "Offer Creation", "Contract Instances"].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-2">
                <span className={cn(
                  "px-2.5 py-1 rounded-lg font-medium",
                  i < 3 ? "text-zinc-300 bg-white/[0.04] border border-white/[0.08]" : "text-zinc-600"
                )}>
                  {step}
                </span>
                {i < arr.length - 1 && <ArrowRight className="w-3 h-3 text-zinc-700" />}
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-1 mb-6 p-1 bg-white/[0.02] border border-white/[0.06] rounded-xl w-fit">
          {TABS.map(({ key, label, Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-semibold transition-all",
                activeTab === key
                  ? "bg-white text-black"
                  : "text-zinc-500 hover:text-white hover:bg-white/[0.04]"
              )}>
              <Icon className="w-3.5 h-3.5" />
              {label}
              <span className={cn(
                "ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full font-mono",
                activeTab === key ? "bg-black/10 text-black" : "bg-white/5 text-zinc-600"
              )}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div>
          {activeTab === "categories" && (
            <TabCategories
              categories={state.categories}
              onAdd={handleAddCategory}
              onDelete={handleDeleteCategory}
              onRename={handleRenameCategory}
              loading={loading}
            />
          )}
          {activeTab === "groups" && (
            <TabFormGroups
              formGroups={state.formGroups}
              onSeed={handleSeed}
              onUpload={handleUploadTemplate}
              onDelete={handleDeleteTemplate}
              onToggleDefault={handleToggleDefault}
              loading={loading}
            />
          )}
          {activeTab === "bundles" && (
            <TabBundles
              categories={state.categories}
              formGroups={state.formGroups}
            />
          )}
        </div>

      </div>
    </div>
  );
}