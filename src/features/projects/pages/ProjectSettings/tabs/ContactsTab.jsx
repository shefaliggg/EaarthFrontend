import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Building2,
  ChevronDown,
  Check,
  X,
  CircleCheck,
  Shield,
  Sparkles,
  Lock,
  Unlock,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/config/utils";

/* ─────────────────────────────────────────────────────────
   STORAGE HELPERS
───────────────────────────────────────────────────────── */
function loadSettings(projectId, key, fallbackValue) {
  const stored = localStorage.getItem(`${key}-${projectId}`);
  return stored ? JSON.parse(stored) : fallbackValue;
}

function saveSettings(projectId, key, value) {
  localStorage.setItem(`${key}-${projectId}`, JSON.stringify(value));
}

/* ─────────────────────────────────────────────────────────
   TAB HEADER
───────────────────────────────────────────────────────── */
function TabHeader({ label, progressPercentage, color, locked }) {
  const strokeWidth = 3;
  const radius = (40 - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative flex items-center justify-between p-4 rounded-2xl overflow-hidden",
        locked && "bg-mint-100 dark:bg-mint-900/30",
      )}
      style={!locked ? { backgroundColor: `${color}15` } : undefined}
    >
      {locked && (
        <motion.div
          className="absolute h-full w-1/3 opacity-20"
          style={{
            background:
              "linear-gradient(90deg, transparent, #22c55e66, transparent)",
          }}
          animate={{ x: ["-100%", "300%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <div
          style={{ width: 40, height: 40 }}
          className="relative inline-flex items-center justify-center"
        >
          <svg width="40" height="40" className="-rotate-90">
            <circle
              cx="20"
              cy="20"
              r={radius}
              strokeWidth={strokeWidth}
              className="fill-none stroke-muted"
            />
            <motion.circle
              cx="20"
              cy="20"
              r={radius}
              fill="none"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              style={{ stroke: locked ? "#22c55e" : color }}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{
                strokeDashoffset:
                  circumference - (progressPercentage / 100) * circumference,
              }}
              transition={{ duration: 0.8 }}
            />
          </svg>
          <div className="absolute flex items-center justify-center">
            {locked ? (
              <CircleCheck className="w-5 h-5 text-emerald-500" />
            ) : (
              <span className="text-xs font-medium tabular-nums">
                {progressPercentage}%
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-foreground font-medium text-[0.95rem]">
            {label}
          </h2>
          {locked ? (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[0.56rem] rounded-full bg-emerald-50 dark:bg-emerald-900/30"
            >
              <Shield className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-600">Locked &amp; verified</span>
            </motion.span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[0.56rem] text-muted-foreground">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Auto-saving changes
            </span>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed"
        style={{
          borderColor: `${color}30`,
          backgroundColor: `${color}05`,
          fontSize: "0.56rem",
          color,
        }}
      >
        <Sparkles className="w-3.5 h-3.5" />
        Fill required fields to continue
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   ACTION FOOTER
───────────────────────────────────────────────────────── */
function ActionFooter({ locked, onLock, color, progressPercentage }) {
  const canLock = progressPercentage >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="mb-2 rounded-2xl overflow-hidden"
    >
      <div className="relative bg-card rounded-2xl border border-gray-100/80 dark:border-gray-800/60 px-5 py-3.5 flex items-center justify-between">

        {/* LEFT — status + progress bar */}
        <div className="flex items-center gap-3">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: locked ? "#22c55e" : "#a3e635" }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span
            className="text-gray-400 dark:text-gray-500"
            style={{ fontSize: "0.6rem" }}
          >
            {locked ? "This tab is locked" : "All changes auto-saved"}
          </span>

          {/* Mini progress bar — only when unlocked and incomplete */}
          {!locked && progressPercentage < 100 && (
            <div className="flex items-center gap-2 ml-2">
              <div className="w-16 h-1 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span
                className="text-gray-300 dark:text-gray-600"
                style={{ fontSize: "0.52rem" }}
              >
                {progressPercentage}%
              </span>
            </div>
          )}
        </div>

        {/* RIGHT — Lock / Unlock button */}
        <motion.button
          onClick={onLock}
          disabled={!canLock && !locked}
          whileHover={canLock || locked ? { scale: 1.02 } : undefined}
          whileTap={canLock || locked ? { scale: 0.98 } : undefined}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300",
            locked
              ? "text-emerald-600 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              : canLock
                ? "text-white shadow-lg hover:shadow-xl"
                : "bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed",
          )}
          style={
            !locked && canLock
              ? {
                  background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                  fontSize: "0.7rem",
                }
              : { fontSize: "0.7rem" }
          }
        >
          {locked ? (
            <>
              <Unlock className="w-3.5 h-3.5" /> Unlock Tab
            </>
          ) : canLock ? (
            <>
              <Lock className="w-3.5 h-3.5" /> Lock &amp; Continue{" "}
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5" /> Complete to Lock
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   SECTION CARD
───────────────────────────────────────────────────────── */
function SectionCard({ title, description, children, color, delay = 0.05 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative mb-4 rounded-2xl overflow-hidden group"
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${color}15, transparent 60%)`,
        }}
      />
      <div className="rounded-2xl bg-card border border-gray-100/80 dark:border-gray-800/50 shadow-sm transition-shadow duration-300">
        <div className="flex items-center p-4 gap-3 border-b border-gray-50/80 dark:border-gray-800/40">
          <div
            className="w-1.5 h-5 rounded-full origin-center transition-transform duration-300 ease-out group-hover:scale-y-125"
            style={{
              background: `linear-gradient(180deg, ${color}, ${color}60)`,
            }}
          />
          <div className="flex flex-col">
            <h3 className="text-gray-900 dark:text-gray-100 text-sm">
              {title}
            </h3>
            {description && (
              <p className="text-gray-400 dark:text-gray-500 text-[0.6rem] mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </motion.section>
  );
}

/* ─────────────────────────────────────────────────────────
   INPUT FIELD
───────────────────────────────────────────────────────── */
function InputField({
  label,
  value,
  onChange,
  placeholder,
  type,
  color,
  required,
  disabled,
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = String(value ?? "").length > 0;
  const shouldUppercase =
    !type || type === "text" || type === "tel" || type === "email";

  return (
    <div className="relative">
      <Input
        value={value}
        type={type || "text"}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={
          focused ? placeholder || label.replace(/\s*\*\s*$/, "") : ""
        }
        onChange={(e) => {
          const v =
            shouldUppercase && !["email", "tel"].includes(type)
              ? e.target.value.toUpperCase()
              : e.target.value;
          onChange(v);
        }}
        style={{
          ...(shouldUppercase && !["email", "tel"].includes(type)
            ? { textTransform: "uppercase" }
            : {}),
          ...(focused ? { borderColor: `${color}40` } : {}),
        }}
        className="pt-5 pb-2 px-3.5 rounded-xl focus:border-transparent text-[0.72rem]"
      />
      <motion.label
        className="absolute left-3.5 pointer-events-none origin-left flex items-center gap-1 text-[0.7rem]"
        animate={{
          top: focused || hasValue ? 6 : 14,
          scale: focused || hasValue ? 0.78 : 1,
          color: focused ? color : "#9ca3af",
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {label}
        {required && <span style={{ color }}> *</span>}
      </motion.label>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SELECT FIELD
───────────────────────────────────────────────────────── */
function SelectField({
  label,
  value,
  onChange,
  options,
  color,
  disabled,
  required,
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = !!value;

  return (
    <div className="relative">
      <select
        value={value}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        style={focused ? { borderColor: `${color}40` } : undefined}
        className="w-full pt-5 pb-2 px-3.5 rounded-xl border border-border bg-input text-[0.72rem] text-foreground appearance-none focus:outline-none focus:ring-0 transition-colors"
      >
        <option value="" disabled hidden />
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <motion.label
        className="absolute left-3.5 pointer-events-none origin-left flex items-center gap-1 text-[0.7rem]"
        animate={{
          top: focused || hasValue ? 6 : 14,
          scale: focused || hasValue ? 0.78 : 1,
          color: focused ? color : "#9ca3af",
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {label}
        {required && <span style={{ color }}> *</span>}
      </motion.label>
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PILL TOGGLE
───────────────────────────────────────────────────────── */
function PillToggle({ label, value, onChange, color, disabled }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-gray-500 dark:text-gray-400 text-[0.65rem]">
        {label}
      </span>
      <button
        disabled={disabled}
        onClick={() => onChange(!value)}
        className={cn(
          "relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0",
          disabled && "opacity-40 cursor-not-allowed",
        )}
        style={{ backgroundColor: value ? color : "#d1d5db" }}
      >
        <motion.span
          className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
          animate={{ x: value ? 16 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CURRENCY MULTI-SELECT
───────────────────────────────────────────────────────── */
const ALL_CURRENCIES = [
  "GBP — British Pound", "USD — US Dollar", "EUR — Euro", "CAD — Canadian Dollar",
  "AUD — Australian Dollar", "NZD — New Zealand Dollar", "DKK — Danish Krone",
  "ISK — Icelandic Króna", "SEK — Swedish Krona", "NOK — Norwegian Krone",
  "CHF — Swiss Franc", "JPY — Japanese Yen", "CNY — Chinese Yuan",
  "INR — Indian Rupee", "ZAR — South African Rand", "AED — UAE Dirham",
  "SGD — Singapore Dollar", "HKD — Hong Kong Dollar", "MXN — Mexican Peso",
  "BRL — Brazilian Real",
];

function CurrencyMultiSelect({ selected, onChange, color, disabled }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = search
    ? ALL_CURRENCIES.filter((c) => c.toLowerCase().includes(search.toLowerCase()))
    : ALL_CURRENCIES;

  const toggle = (code) =>
    onChange(
      selected.includes(code)
        ? selected.filter((c) => c !== code)
        : [...selected, code],
    );

  return (
    <div ref={ref} className="relative">
      <div
        className="text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1"
        style={{ fontSize: "0.46rem" }}
      >
        Currencies
      </div>
      <button
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className="w-full min-h-[2rem] flex flex-wrap items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/30 text-left transition-all hover:border-gray-300"
        style={{ fontSize: "0.52rem" }}
      >
        {selected.length === 0 ? (
          <span className="text-gray-400">Select currencies...</span>
        ) : (
          selected.map((code) => (
            <span
              key={code}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white"
              style={{ background: `${color}cc`, fontSize: "0.44rem" }}
            >
              {code}
              {!disabled && (
                <span
                  onClick={(e) => { e.stopPropagation(); toggle(code); }}
                  className="hover:text-red-200 transition-colors cursor-pointer"
                >
                  <X className="w-2 h-2" />
                </span>
              )}
            </span>
          ))
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-50 top-full mt-1 left-0 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-2 border-b border-gray-100 dark:border-gray-800">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search currencies..."
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 outline-none"
                style={{ fontSize: "0.5rem" }}
              />
            </div>
            <div className="max-h-40 overflow-y-auto p-1">
              {filtered.map((cur) => {
                const code = cur.split(" — ")[0];
                const isSel = selected.includes(code);
                return (
                  <button
                    key={code}
                    onClick={() => toggle(code)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors",
                      isSel
                        ? "bg-purple-50 dark:bg-purple-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/30",
                    )}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border transition-colors"
                      style={
                        isSel
                          ? { background: color, borderColor: color }
                          : { borderColor: "#d1d5db" }
                      }
                    >
                      {isSel && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span
                      className={isSel ? "text-gray-800 dark:text-gray-200" : "text-gray-600 dark:text-gray-400"}
                      style={{ fontSize: "0.5rem" }}
                    >
                      {cur}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   TAX ID LOOKUP
───────────────────────────────────────────────────────── */
const TAX_ID_BY_COUNTRY = {
  "United Kingdom": { label: "VAT Number", placeholder: "GB 123 4567 89", hint: "UK Value Added Tax registration number" },
  "Ireland": { label: "VAT Number", placeholder: "IE 1234567AB", hint: "Irish VAT registration number" },
  "United States": { label: "EIN (Employer Identification Number)", placeholder: "12-3456789", hint: "Federal tax identification number issued by the IRS" },
  "Canada": { label: "Business Number (BN)", placeholder: "123456789 RC0001", hint: "Canada Revenue Agency business number" },
  "Australia": { label: "ABN (Australian Business Number)", placeholder: "12 345 678 901", hint: "Australian Business Number for tax purposes" },
  "New Zealand": { label: "IRD Number", placeholder: "12-345-678", hint: "Inland Revenue Department number" },
  "India": { label: "GSTIN", placeholder: "22AAAAA0000A1Z5", hint: "Goods and Services Tax Identification Number" },
  "Germany": { label: "USt-IdNr (VAT ID)", placeholder: "DE 123456789", hint: "Umsatzsteuer-Identifikationsnummer" },
  "France": { label: "TVA Intracommunautaire", placeholder: "FR 12 345678901", hint: "French intra-community VAT number" },
  "Italy": { label: "Partita IVA", placeholder: "IT 12345678901", hint: "Italian VAT identification number" },
  "Spain": { label: "NIF / CIF", placeholder: "B12345678", hint: "Número de Identificación Fiscal" },
  "Netherlands": { label: "BTW Number", placeholder: "NL 123456789B01", hint: "Dutch VAT identification number" },
  "Belgium": { label: "BTW / TVA Number", placeholder: "BE 0123.456.789", hint: "Belgian VAT identification number" },
  "South Africa": { label: "VAT Number", placeholder: "4123456789", hint: "South African Revenue Service VAT number" },
  "Singapore": { label: "GST Registration Number", placeholder: "M12345678X", hint: "Goods & Services Tax registration" },
  "Hong Kong": { label: "Business Registration Number", placeholder: "12345678-000-00-00-0", hint: "Inland Revenue Department business registration" },
  "Japan": { label: "Corporate Number (法人番号)", placeholder: "T1234567890123", hint: "Japan National Tax Agency corporate number" },
  "United Arab Emirates": { label: "TRN (Tax Registration Number)", placeholder: "100123456789003", hint: "Federal Tax Authority registration number" },
  "Switzerland": { label: "UID / MWST Number", placeholder: "CHE-123.456.789 MWST", hint: "Swiss VAT identification number" },
  "Mexico": { label: "RFC (Registro Federal de Contribuyentes)", placeholder: "XAXX010101000", hint: "Mexican federal taxpayer registry number" },
  "Brazil": { label: "CNPJ", placeholder: "12.345.678/0001-90", hint: "Cadastro Nacional da Pessoa Jurídica" },
  "China": { label: "Tax Registration Number", placeholder: "91110000MA01ABCD12", hint: "Unified Social Credit Code used for tax" },
  "South Korea": { label: "Business Registration Number", placeholder: "123-45-67890", hint: "Korean National Tax Service registration" },
  "Sweden": { label: "Momsregistreringsnummer", placeholder: "SE 123456789001", hint: "Swedish VAT identification number" },
  "Norway": { label: "MVA Number", placeholder: "NO 123456789 MVA", hint: "Norwegian VAT registration number" },
  "Denmark": { label: "CVR / Momsnummer", placeholder: "DK 12345678", hint: "Danish VAT identification number" },
  "Poland": { label: "NIP (VAT ID)", placeholder: "PL 1234567890", hint: "Polish VAT identification number" },
  "Austria": { label: "UID-Nummer", placeholder: "ATU 12345678", hint: "Austrian VAT identification number" },
  "Portugal": { label: "NIF / NIPC", placeholder: "PT 123456789", hint: "Portuguese tax identification number" },
  "Czechia": { label: "DIČ (VAT ID)", placeholder: "CZ 12345678", hint: "Czech VAT identification number" },
  "Iceland": { label: "VSK Number", placeholder: "12345", hint: "Icelandic VAT registration number" },
};
const DEFAULT_TAX_ID = {
  label: "Tax Identification Number",
  placeholder: "",
  hint: "Tax or VAT registration number for this jurisdiction",
};
function getTaxIdInfo(country) {
  return TAX_ID_BY_COUNTRY[country] || DEFAULT_TAX_ID;
}

/* ─────────────────────────────────────────────────────────
   COUNTRIES LIST
───────────────────────────────────────────────────────── */
const COUNTRIES = [
  "United Kingdom","Ireland","Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Congo (Democratic Republic)","Costa Rica","Croatia","Cuba","Cyprus","Czechia","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Georgia","Germany","Ghana","Greece","Greenland","Grenada","Guatemala","Guernsey","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Isle of Man","Israel","Italy","Ivory Coast","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar (Burma)","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts and Nevis","St Lucia","St Vincent","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","The Bahamas","The Gambia","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe",
];

/* ─────────────────────────────────────────────────────────
   DEFAULT COMPANIES
───────────────────────────────────────────────────────── */
const DEFAULT_COMPANIES = [
  {
    id: "co1",
    name: "Mirage Pictures Limited",
    registrationNumber: "12345678",
    taxId: "GB 987 6543 21",
    addressLine1: "1 Central St Giles",
    addressLine2: "St Giles High Street",
    city: "London",
    postcode: "WC2H 8NU",
    country: "United Kingdom",
    telephone: "+44 20 7946 0958",
    email: "info@miragepictures.co.uk",
    currencies: ["GBP", "EUR"],
    isPrimary: true,
  },
];

/* ─────────────────────────────────────────────────────────
   CONTACTS TAB
───────────────────────────────────────────────────────── */
function ContactsTab({
  color,
  projectId,
  locked,
  tabId,
  setTabLockStatusById,
  setTabProgressById,
}) {
  const d = locked;

  /* ── Companies ── */
  const [companies, setCompanies] = useState(() => {
    const raw = loadSettings(projectId, "contacts-companies", DEFAULT_COMPANIES);
    return raw.map((c) => ({
      ...c,
      taxId: c.taxId ?? "",
      registrationNumber: c.registrationNumber ?? "",
      currencies: c.currencies ?? [],
    }));
  });

  const saveCompanies = (updated) => {
    setCompanies(updated);
    saveSettings(projectId, "contacts-companies", updated);
  };

  const addCompany = () => {
    saveCompanies([
      ...companies,
      {
        id: `co${Date.now()}`,
        name: "",
        registrationNumber: "",
        taxId: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        postcode: "",
        country: "United Kingdom",
        telephone: "",
        email: "",
        currencies: ["GBP"],
        isPrimary: false,
      },
    ]);
  };

  const updateCompany = (id, patch) => {
    saveCompanies(companies.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const deleteCompany = (id) => {
    if (companies.length <= 1) return;
    saveCompanies(companies.filter((c) => c.id !== id));
  };

  const setPrimary = (id) => {
    saveCompanies(companies.map((c) => ({ ...c, isPrimary: c.id === id })));
  };

  const [expandedCompany, setExpandedCompany] = useState(
    companies[0]?.id || null,
  );

  /* ── Production Base ── */
  const [base, setBase] = useState(() =>
    loadSettings(projectId, "contacts-base", {
      addr1: "", addr2: "", city: "", postcode: "",
      country: "United Kingdom", telephone: "", email: "",
    }),
  );

  /* ── Project Creator ── */
  const [creator, setCreator] = useState(() =>
    loadSettings(projectId, "contacts-creator", { name: "", email: "" }),
  );

  /* ── Billing ── */
  const [billing, setBilling] = useState(() =>
    loadSettings(projectId, "contacts-billing", {
      contactName: "", contactEmails: "", spvVatNumber: "",
      sameAsSpv: true,
      addr1: "", addr2: "", city: "", postcode: "",
      country: "United Kingdom",
    }),
  );

  const updateAndPersist = (storageKey, newValue, setState) => {
    setState(newValue);
    saveSettings(projectId, storageKey, newValue);
  };

  /* ── Lock handler ── */
  const handleLock = () => {
    setTabLockStatusById((prev) => ({
      ...prev,
      [tabId]: !prev[tabId],
    }));
  };

  /* ── Progress ── */
  const hasCompanyWithName = companies.some((c) => c.name.trim());
  const hasCompanyAddr = companies.some((c) => c.addressLine1.trim() && c.city.trim());
  const hasCompanyCurrency = companies.some((c) => c.currencies.length > 0);

  const requiredFields = [
    hasCompanyWithName ? "y" : "",
    hasCompanyAddr ? "y" : "",
    hasCompanyCurrency ? "y" : "",
    base.addr1,
    base.city,
    base.telephone,
    creator.name,
    creator.email,
    billing.contactName,
    billing.contactEmails,
  ];

  const progressPercentage = Math.round(
    (requiredFields.filter(Boolean).length / requiredFields.length) * 100,
  );

  useEffect(() => {
    setTabProgressById((prev) => ({ ...prev, [tabId]: progressPercentage }));
  }, [progressPercentage, tabId, setTabProgressById]);

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col gap-5"
    >
      <TabHeader
        label="Contacts"
        progressPercentage={progressPercentage}
        color={color}
        locked={locked}
      />

      <div className={cn(locked && "opacity-50 pointer-events-none select-none")}>

        {/* ── Section 1: Companies ── */}
        <SectionCard
          title="Companies"
          description="Add one or more companies operating on this project. Each can have its own address, contact details, and currencies."
          color={color}
          delay={0.05}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.48rem" }}>
                {companies.length} compan{companies.length !== 1 ? "ies" : "y"} registered
              </span>
              {!d && (
                <motion.button
                  onClick={addCompany}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                    fontSize: "0.52rem",
                  }}
                >
                  <Plus className="w-3 h-3" /> Add Company
                </motion.button>
              )}
            </div>

            {companies.map((co, coIdx) => {
              const isExpanded = expandedCompany === co.id;
              return (
                <motion.div
                  key={co.id}
                  layout
                  className="rounded-xl border overflow-hidden transition-colors"
                  style={{
                    borderColor: co.isPrimary
                      ? `${color}50`
                      : isExpanded
                        ? `${color}30`
                        : "#e5e7eb",
                  }}
                >
                  {/* Company header row */}
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer bg-gray-50/30 dark:bg-gray-800/20 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors"
                    onClick={() => setExpandedCompany(isExpanded ? null : co.id)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0"
                        style={{
                          background: co.isPrimary
                            ? `linear-gradient(135deg, ${color}, ${color}cc)`
                            : "#9ca3af",
                        }}
                      >
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-gray-800 dark:text-gray-200 uppercase truncate"
                            style={{ fontSize: "0.62rem" }}
                          >
                            {co.name || `Company ${coIdx + 1} (Unnamed)`}
                          </span>
                          {co.isPrimary && (
                            <span
                              className="shrink-0 px-1.5 py-0.5 rounded-full text-white uppercase tracking-wider"
                              style={{ fontSize: "0.36rem", background: color }}
                            >
                              Primary
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          {co.city && (
                            <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.46rem" }}>
                              {co.city}, {co.country}
                            </span>
                          )}
                          {co.taxId && (
                            <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.42rem" }}>
                              • {getTaxIdInfo(co.country).label}: {co.taxId}
                            </span>
                          )}
                          {co.currencies.length > 0 && (
                            <div className="flex gap-1">
                              {co.currencies.map((cur) => (
                                <span
                                  key={cur}
                                  className="px-1.5 py-px rounded-full text-white"
                                  style={{ fontSize: "0.36rem", background: `${color}88` }}
                                >
                                  {cur}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!co.isPrimary && !d && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setPrimary(co.id); }}
                          className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-purple-600 hover:border-purple-300 transition-colors"
                          style={{ fontSize: "0.44rem" }}
                          title="Set as primary"
                        >
                          Set Primary
                        </button>
                      )}
                      {companies.length > 1 && !d && (
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteCompany(co.id); }}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                          title="Remove company"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-gray-400 transition-transform",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </div>
                  </div>

                  {/* Expanded form */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 py-4 space-y-3 border-t border-gray-100 dark:border-gray-800">
                          {/* Name + Registration */}
                          <div className="grid grid-cols-2 gap-3">
                            <InputField
                              label="Company Name"
                              value={co.name}
                              onChange={(v) => updateCompany(co.id, { name: v })}
                              color={color}
                              disabled={d}
                              required
                            />
                            <InputField
                              label="Company Registration Number"
                              value={co.registrationNumber}
                              onChange={(v) => updateCompany(co.id, { registrationNumber: v })}
                              color={color}
                              disabled={d}
                            />
                          </div>

                          {/* Tax ID — adapts label to country */}
                          {(() => {
                            const taxInfo = getTaxIdInfo(co.country);
                            return (
                              <div>
                                <InputField
                                  label={taxInfo.label}
                                  value={co.taxId}
                                  onChange={(v) => updateCompany(co.id, { taxId: v })}
                                  placeholder={taxInfo.placeholder}
                                  color={color}
                                  disabled={d}
                                />
                                <p className="text-gray-400 dark:text-gray-500 mt-1 px-1" style={{ fontSize: "0.42rem" }}>
                                  {taxInfo.hint}
                                </p>
                              </div>
                            );
                          })()}

                          {/* Address */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <InputField
                                label="Address Line 1"
                                value={co.addressLine1}
                                onChange={(v) => updateCompany(co.id, { addressLine1: v })}
                                color={color}
                                disabled={d}
                                required
                              />
                              <p className="text-gray-400 dark:text-gray-500 mt-1 px-1" style={{ fontSize: "0.42rem" }}>
                                The address of the Production Base for this project (from which mileage might be charged).
                              </p>
                            </div>
                            <InputField
                              label="Address Line 2"
                              value={co.addressLine2}
                              onChange={(v) => updateCompany(co.id, { addressLine2: v })}
                              color={color}
                              disabled={d}
                            />
                          </div>

                          <div className="grid grid-cols-4 gap-3">
                            <InputField
                              label="City"
                              value={co.city}
                              onChange={(v) => updateCompany(co.id, { city: v })}
                              color={color}
                              disabled={d}
                              required
                            />
                            <InputField
                              label="Postcode"
                              value={co.postcode}
                              onChange={(v) => updateCompany(co.id, { postcode: v })}
                              color={color}
                              disabled={d}
                            />
                            <div className="col-span-2">
                              <SelectField
                                label="Country"
                                value={co.country}
                                onChange={(v) => updateCompany(co.id, { country: v })}
                                options={COUNTRIES}
                                color={color}
                                disabled={d}
                              />
                            </div>
                          </div>

                          {/* Contact */}
                          <div className="grid grid-cols-2 gap-3">
                            <InputField
                              label="Telephone Number"
                              value={co.telephone}
                              onChange={(v) => updateCompany(co.id, { telephone: v })}
                              type="tel"
                              color={color}
                              disabled={d}
                              required
                            />
                            <InputField
                              label="Email Address"
                              value={co.email}
                              onChange={(v) => updateCompany(co.id, { email: v })}
                              type="email"
                              color={color}
                              disabled={d}
                            />
                          </div>

                          {/* Currencies */}
                          <CurrencyMultiSelect
                            selected={co.currencies}
                            onChange={(v) => updateCompany(co.id, { currencies: v })}
                            color={color}
                            disabled={d}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </SectionCard>

        {/* ── Section 2: Production Base ── */}
        <SectionCard
          title="Production Base"
          description="Shown to crew in their offer so they can contact you for help, and possibly in documents regarding mileage."
          color={color}
          delay={0.1}
        >
          <div className="space-y-3">
            <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider block" style={{ fontSize: "0.5rem" }}>
              Production Base Address
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <InputField
                  label="Address Line 1"
                  value={base.addr1}
                  onChange={(v) => updateAndPersist("contacts-base", { ...base, addr1: v }, setBase)}
                  color={color}
                  disabled={d}
                  required
                />
                <p className="text-gray-400 dark:text-gray-500 mt-1 px-1" style={{ fontSize: "0.48rem" }}>
                  The address of the Production Base for this project (from which mileage might be charged).
                </p>
              </div>
              <InputField
                label="Address Line 2"
                value={base.addr2}
                onChange={(v) => updateAndPersist("contacts-base", { ...base, addr2: v }, setBase)}
                color={color}
                disabled={d}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <InputField
                label="City"
                value={base.city}
                onChange={(v) => updateAndPersist("contacts-base", { ...base, city: v }, setBase)}
                color={color}
                disabled={d}
                required
              />
              <InputField
                label="Postcode"
                value={base.postcode}
                onChange={(v) => updateAndPersist("contacts-base", { ...base, postcode: v }, setBase)}
                color={color}
                disabled={d}
              />
              <SelectField
                label="Country"
                value={base.country}
                onChange={(v) => updateAndPersist("contacts-base", { ...base, country: v }, setBase)}
                options={COUNTRIES}
                color={color}
                disabled={d}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <InputField
                  label="Telephone Number"
                  value={base.telephone}
                  onChange={(v) => updateAndPersist("contacts-base", { ...base, telephone: v }, setBase)}
                  type="tel"
                  color={color}
                  disabled={d}
                  required
                />
                <p className="text-gray-400 dark:text-gray-500 mt-1 px-1" style={{ fontSize: "0.48rem" }}>
                  Helpful information shown to crew in their offer, so they can contact you with any questions.
                </p>
              </div>
              <div>
                <InputField
                  label="Email Address"
                  value={base.email}
                  onChange={(v) => updateAndPersist("contacts-base", { ...base, email: v }, setBase)}
                  type="email"
                  color={color}
                  disabled={d}
                />
                <p className="text-gray-400 dark:text-gray-500 mt-1 px-1" style={{ fontSize: "0.48rem" }}>
                  Helpful information shown to crew in their offer, so they can contact you with any questions.
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── Section 3: Project Creator ── */}
        <SectionCard
          title="Project Creator"
          description="Contact details of who created this project."
          color={color}
          delay={0.15}
        >
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Project Creator Name"
              value={creator.name}
              onChange={(v) => updateAndPersist("contacts-creator", { ...creator, name: v }, setCreator)}
              color={color}
              disabled={d}
              required
            />
            <InputField
              label="Project Creator Email Address"
              value={creator.email}
              onChange={(v) => updateAndPersist("contacts-creator", { ...creator, email: v }, setCreator)}
              type="email"
              color={color}
              disabled={d}
              required
            />
          </div>
        </SectionCard>

        {/* ── Section 4: Billing ── */}
        <SectionCard
          title="Billing"
          description="Contact details for EAARTH to send invoices to."
          color={color}
          delay={0.2}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Billing Contact Name"
                value={billing.contactName}
                onChange={(v) => updateAndPersist("contacts-billing", { ...billing, contactName: v }, setBilling)}
                color={color}
                disabled={d}
                required
              />
              <div>
                <InputField
                  label="Billing Contact Email(s)"
                  value={billing.contactEmails}
                  onChange={(v) => updateAndPersist("contacts-billing", { ...billing, contactEmails: v }, setBilling)}
                  type="email"
                  color={color}
                  disabled={d}
                  required
                />
                <p className="text-gray-400 dark:text-gray-500 mt-1 px-1" style={{ fontSize: "0.48rem" }}>
                  Enter one or more email addresses, separated by commas.
                </p>
              </div>
            </div>

            <InputField
              label="SPV Company VAT Number"
              value={billing.spvVatNumber}
              onChange={(v) => updateAndPersist("contacts-billing", { ...billing, spvVatNumber: v }, setBilling)}
              color={color}
              disabled={d}
            />

            <PillToggle
              label="Billing address is same as SPV company?"
              value={billing.sameAsSpv}
              onChange={(v) => updateAndPersist("contacts-billing", { ...billing, sameAsSpv: v }, setBilling)}
              color={color}
              disabled={d}
            />

            <AnimatePresence>
              {!billing.sameAsSpv && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider block" style={{ fontSize: "0.5rem" }}>
                    Billing Address (Optional)
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <InputField
                      label="Billing Address Line 1"
                      value={billing.addr1}
                      onChange={(v) => updateAndPersist("contacts-billing", { ...billing, addr1: v }, setBilling)}
                      color={color}
                      disabled={d}
                    />
                    <InputField
                      label="Billing Address Line 2"
                      value={billing.addr2}
                      onChange={(v) => updateAndPersist("contacts-billing", { ...billing, addr2: v }, setBilling)}
                      color={color}
                      disabled={d}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <InputField
                      label="City"
                      value={billing.city}
                      onChange={(v) => updateAndPersist("contacts-billing", { ...billing, city: v }, setBilling)}
                      color={color}
                      disabled={d}
                    />
                    <InputField
                      label="Postcode"
                      value={billing.postcode}
                      onChange={(v) => updateAndPersist("contacts-billing", { ...billing, postcode: v }, setBilling)}
                      color={color}
                      disabled={d}
                    />
                    <SelectField
                      label="Country"
                      value={billing.country}
                      onChange={(v) => updateAndPersist("contacts-billing", { ...billing, country: v }, setBilling)}
                      options={COUNTRIES}
                      color={color}
                      disabled={d}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SectionCard>

      </div>

      {/* ── Action Footer ── */}
      <ActionFooter
        locked={locked}
        onLock={handleLock}
        color={color}
        progressPercentage={progressPercentage}
      />
    </motion.div>
  );
}

export default ContactsTab;