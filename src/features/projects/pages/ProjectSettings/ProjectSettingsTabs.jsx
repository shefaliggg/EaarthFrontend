import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Shield, HelpCircle, Building2, ChevronDown, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  loadS, saveS,
  GlassSection, ModInput, ModSelect, PillToggle, TooltipIcon, ModTextarea, ModRadio,
  TabHeader, ActionFooter,
} from "./settings-shared";

/* ═══════════════════════════════════════════════════════
   TAB 1: DETAILS
   ═══════════════════════════════════════════════════════ */
export function DetailsTab({ color, projectName, projectId, studioId, locked, onLock, onProgress }) {
  const d = locked;

  const [details, setDetails] = useState(() => loadS(projectId, "proj-details", {
    title: projectName, codename: projectName, description: "", locations: "", additionalNotes: "",
  }, studioId));

  const [settings, setSettings] = useState(() => loadS(projectId, "proj-settings", {
    projectType: "Feature Film",
    showProjectTypeInOffers: true,
    legalTerritory: "United Kingdom",
    unionAgreement: "None",
    constructionUnionAgreement: "None",
    budget: "",
    showBudgetToCrew: false,
    holidayPayPct: "0%",
    differentHolidayForDailies: false,
    withholdHolidayOn6th7th: false,
    overtime: false,
    showWeeklyRateOfferView: false,
    showWeeklyRateDocuments: false,
    defaultWorkingHours: "",
    offerEndDate: "Optional",
    payrollCompany: "",
    crewDataCsvLayout: "",
    payrollCsvLayout: "",
  }, studioId));

  const [offer, setOffer] = useState(() => loadS(projectId, "offer-handling", {
    shareStatusDetermination: false,
    taxStatusHandling: "",
    taxStatusQueryEmail: "",
    offerApproval: "",
  }, studioId));

  const up = (key, val, setter) => { setter(val); saveS(projectId, key, val, studioId); };

  const reqFields = [details.title, details.codename, settings.projectType, settings.legalTerritory, settings.defaultWorkingHours, settings.payrollCompany, offer.taxStatusHandling, offer.offerApproval];
  const pct = Math.round((reqFields.filter(Boolean).length / reqFields.length) * 100);
  useEffect(() => { onProgress?.(pct); }, [pct]);

  return (
    <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}>
      <TabHeader label="Details" pct={pct} color={color} locked={locked} />
      <div className={d ? "opacity-50 pointer-events-none select-none" : ""}>

        <GlassSection title="Project Details" desc="Helpful information which is shown to crew and can be updated any time." color={color} delay={0.05}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <ModInput label="Title" value={details.title} onChange={v => up("proj-details", { ...details, title: v }, setDetails)} color={color} disabled={d} required />
            <div>
              <ModInput label="Codename" value={details.codename} onChange={v => up("proj-details", { ...details, codename: v }, setDetails)} color={color} disabled={d} required />
              <span className="text-gray-400 dark:text-gray-500 mt-1 block px-1" style={{ fontSize: "0.48rem" }}>If your project has an alternative name for secrecy, enter that. Otherwise enter the Project title. The Codename will be used in all emails and pages.</span>
            </div>
          </div>
          <div className="space-y-3">
            <ModTextarea label="Description (Optional)" value={details.description} onChange={v => up("proj-details", { ...details, description: v }, setDetails)} maxLength={300} color={color} disabled={d} helpText="A brief synopsis of the project which is helpful for crew joining the production." />
            <ModTextarea label="Locations (Optional)" value={details.locations} onChange={v => up("proj-details", { ...details, locations: v }, setDetails)} maxLength={300} color={color} disabled={d} helpText="Useful information, if known, which might help crew decide if they can accept the job." />
            <ModTextarea label="Additional Notes (Optional)" value={details.additionalNotes} onChange={v => up("proj-details", { ...details, additionalNotes: v }, setDetails)} maxLength={300} color={color} disabled={d} helpText="Use this to convey general project-wide information to crew." />
          </div>
        </GlassSection>

        <GlassSection title="Project Settings" desc="Essential settings which will govern how rates are calculated." color={color} delay={0.1}>
          <div className="space-y-4">
            <ModRadio label="Project Type" value={settings.projectType} onChange={v => up("proj-settings", { ...settings, projectType: v }, setSettings)} options={["Feature Film", "Television"]} color={color} disabled={d} tooltip="Select Television for SVOD 'streaming' projects." />
            <PillToggle label="Show project type in offers?" value={settings.showProjectTypeInOffers} onChange={v => up("proj-settings", { ...settings, showProjectTypeInOffers: v }, setSettings)} color={color} disabled={d} />
            <ModRadio label="Legal Territory" value={settings.legalTerritory} onChange={v => up("proj-settings", { ...settings, legalTerritory: v }, setSettings)} options={["United Kingdom", "Iceland", "Ireland", "Malta"]} color={color} disabled={d} />
            <ModRadio label="Union Agreement" value={settings.unionAgreement} onChange={v => up("proj-settings", { ...settings, unionAgreement: v }, setSettings)} options={["None", "PACT/BECTU Agreement (2021)"]} color={color} disabled={d} tooltip="Select 'None' if you will use terms which vary from the current Union Agreement." />
            <ModRadio label="Construction Union Agreement" value={settings.constructionUnionAgreement} onChange={v => up("proj-settings", { ...settings, constructionUnionAgreement: v }, setSettings)} options={["None", "PACT/BECTU Agreement", "Custom Agreement"]} color={color} disabled={d} />
            <div className="grid grid-cols-2 gap-3">
              <ModSelect label="Budget" value={settings.budget} onChange={v => up("proj-settings", { ...settings, budget: v }, setSettings)} options={["Low (under £10 million)", "Mid (between £10 - £30 million)", "Major (over £30 million)"]} color={color} disabled={d} />
              <div className="flex items-end pb-1">
                <PillToggle label="Show budget level to crew members?" value={settings.showBudgetToCrew} onChange={v => up("proj-settings", { ...settings, showBudgetToCrew: v }, setSettings)} color={color} disabled={d} />
              </div>
            </div>
            <ModRadio label="Holiday Pay Percentage" value={settings.holidayPayPct} onChange={v => up("proj-settings", { ...settings, holidayPayPct: v }, setSettings)} options={["0%", "10.77%", "12.07%"]} color={color} disabled={d} />
            <PillToggle label="Different holiday pay percentage for Dailies" value={settings.differentHolidayForDailies} onChange={v => up("proj-settings", { ...settings, differentHolidayForDailies: v }, setSettings)} color={color} disabled={d} />
            <PillToggle label="Withhold holiday pay on 6th and 7th days" value={settings.withholdHolidayOn6th7th} onChange={v => up("proj-settings", { ...settings, withholdHolidayOn6th7th: v }, setSettings)} color={color} disabled={d} />
            <PillToggle label="Overtime" value={settings.overtime} onChange={v => up("proj-settings", { ...settings, overtime: v }, setSettings)} color={color} disabled={d} />
            <div className="pt-1">
              <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-2" style={{ fontSize: "0.5rem" }}>Show Weekly rate for Daily crew in</span>
              <div className="space-y-1">
                <PillToggle label="Offer view" value={settings.showWeeklyRateOfferView} onChange={v => up("proj-settings", { ...settings, showWeeklyRateOfferView: v }, setSettings)} color={color} disabled={d} />
                <PillToggle label="Documents" value={settings.showWeeklyRateDocuments} onChange={v => up("proj-settings", { ...settings, showWeeklyRateDocuments: v }, setSettings)} color={color} disabled={d} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <ModSelect label="Default Standard Working Hours" value={settings.defaultWorkingHours} onChange={v => up("proj-settings", { ...settings, defaultWorkingHours: v }, setSettings)} options={["12 hours (continuous)", "12 hours", "11 hours", "10.5 hours", "10 hours", "9 hours", "8 hours", "7.5 hours", "7 hours", "6 hours", "5 hours", "4 hours", "3 hours", "2 hours", "1 hour"]} color={color} disabled={d} />
                <span className="text-gray-400 dark:text-gray-500 mt-1 block px-1" style={{ fontSize: "0.48rem" }}>Excluding lunch. This is for standard crew contracts. You can still specify different hours in each offer.</span>
              </div>
              <ModRadio label="Offer End Date" value={settings.offerEndDate} onChange={v => up("proj-settings", { ...settings, offerEndDate: v }, setSettings)} options={["Optional", "Mandatory"]} color={color} disabled={d} tooltip="Dictated by whether the Company wants end dates in crew contracts." />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <ModSelect label="Payroll Company" value={settings.payrollCompany} onChange={v => up("proj-settings", { ...settings, payrollCompany: v }, setSettings)} options={["Dataplan", "Entertainment Payroll Services", "Hargenant", "In-house", "Moneypenny", "Sargent Disc", "TPH"]} color={color} disabled={d} />
              <div>
                <ModSelect label="Crew Data CSV Export Layout" value={settings.crewDataCsvLayout} onChange={v => up("proj-settings", { ...settings, crewDataCsvLayout: v }, setSettings)} options={["EAARTH", "Moneypenny"]} color={color} disabled={d} />
                <span className="text-gray-400 dark:text-gray-500 mt-1 block px-1" style={{ fontSize: "0.48rem" }}>Start form data in CSV format for sharing with the payroll company.</span>
              </div>
              <div>
                <ModSelect label="Payroll CSV Export Layout" value={settings.payrollCsvLayout} onChange={v => up("proj-settings", { ...settings, payrollCsvLayout: v }, setSettings)} options={["Dataplan", "Entertainment Payroll Services", "Hargenant", "In-house", "Moneypenny", "Sargent Disc", "TPH"]} color={color} disabled={d} />
                <span className="text-gray-400 dark:text-gray-500 mt-1 block px-1" style={{ fontSize: "0.48rem" }}>Money calculation data in a layout similar to your payroll company's spreadsheet.</span>
              </div>
            </div>
          </div>
        </GlassSection>

        <GlassSection title="Offer Handling" desc="How you'd like offers to be reviewed prior to sending to crew." color={color} delay={0.15}>
          <div className="space-y-4">
            <PillToggle label="Share status determination with crew members?" value={offer.shareStatusDetermination} onChange={v => up("offer-handling", { ...offer, shareStatusDetermination: v }, setOffer)} color={color} disabled={d} />
            <span className="text-gray-400 dark:text-gray-500 block px-1 -mt-2" style={{ fontSize: "0.48rem" }}>Inform the crew member of your IR35 status determination within their offer.</span>
            <div>
              <ModSelect label="Tax Status Handling" value={offer.taxStatusHandling} onChange={v => up("offer-handling", { ...offer, taxStatusHandling: v }, setOffer)} options={["Do not allow loan outs", "Accounts approval required for self-employed or loan out", "Accounts approval required for loan out", "Allow loan out if grade is self-employed", "Allow all loan outs (not recommended after 5 Apr, 2021)"]} color={color} disabled={d} />
              <span className="text-gray-400 dark:text-gray-500 mt-1 block px-1" style={{ fontSize: "0.48rem" }}>Available options are based on your 'Share status determination with crew members?' selection.</span>
            </div>
            <ModInput label="Tax Status Query Email" value={offer.taxStatusQueryEmail} onChange={v => up("offer-handling", { ...offer, taxStatusQueryEmail: v }, setOffer)} type="email" color={color} disabled={d} />
            <span className="text-gray-400 dark:text-gray-500 block px-1 -mt-2" style={{ fontSize: "0.48rem" }}>The person to whom all tax status questions will be directed.</span>
            <div>
              <ModSelect label="Offer Approval" value={offer.offerApproval} onChange={v => up("offer-handling", { ...offer, offerApproval: v }, setOffer)} options={["Accounts", "Accounts > Production", "Production", "Production > Accounts"]} color={color} disabled={d} />
              <span className="text-gray-400 dark:text-gray-500 mt-1 block px-1" style={{ fontSize: "0.48rem" }}>Order of people who will approve offers before being sent to crew.</span>
            </div>
          </div>
        </GlassSection>

      </div>
      <ActionFooter locked={locked} onLock={onLock} color={color} pct={pct} />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   CURRENCY MULTI-SELECT (used in ContactsTab)
   ═══════════════════════════════════════════════════════ */
const ALL_CURRENCIES = [
  "GBP — British Pound", "USD — US Dollar", "EUR — Euro", "CAD — Canadian Dollar",
  "AUD — Australian Dollar", "NZD — New Zealand Dollar", "DKK — Danish Krone", "ISK — Icelandic Króna",
  "SEK — Swedish Krona", "NOK — Norwegian Krone", "CHF — Swiss Franc", "JPY — Japanese Yen",
  "CNY — Chinese Yuan", "INR — Indian Rupee", "ZAR — South African Rand", "AED — UAE Dirham",
  "SGD — Singapore Dollar", "HKD — Hong Kong Dollar", "MXN — Mexican Peso", "BRL — Brazilian Real",
];

const TAX_ID_BY_COUNTRY = {
  "United Kingdom": { label: "VAT Number", placeholder: "GB 123 4567 89", hint: "UK Value Added Tax registration number" },
  "Ireland": { label: "VAT Number", placeholder: "IE 1234567AB", hint: "Irish VAT registration number" },
  "United States": { label: "EIN (Employer Identification Number)", placeholder: "12-3456789", hint: "Federal tax identification number issued by the IRS" },
  "Iceland": { label: "VSK Number", placeholder: "12345", hint: "Icelandic VAT registration number" },
};
const DEFAULT_TAX_ID = { label: "Tax Identification Number", placeholder: "", hint: "Tax or VAT registration number for this jurisdiction" };
function getTaxIdInfo(country) { return TAX_ID_BY_COUNTRY[country] || DEFAULT_TAX_ID; }

const DEFAULT_COMPANIES = [
  { id: "co1", name: "Mirage Pictures Limited", registrationNumber: "12345678", taxId: "GB 987 6543 21", addressLine1: "1 Central St Giles", addressLine2: "St Giles High Street", city: "London", postcode: "WC2H 8NU", country: "United Kingdom", telephone: "+44 20 7946 0958", email: "info@miragepictures.co.uk", currencies: ["GBP", "EUR"], isPrimary: true },
];

function CurrencyMultiSelect({ selected, onChange, color, disabled }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const filtered = search ? ALL_CURRENCIES.filter(c => c.toLowerCase().includes(search.toLowerCase())) : ALL_CURRENCIES;
  const toggle = (code) => onChange(selected.includes(code) ? selected.filter(c => c !== code) : [...selected, code]);
  return (
    <div ref={ref} className="relative">
      <div className="text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1" style={{ fontSize: "0.46rem" }}>Currencies</div>
      <button onClick={() => !disabled && setOpen(!open)} disabled={disabled}
        className="w-full min-h-[2rem] flex flex-wrap items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/30 text-left transition-all hover:border-gray-300"
        style={{ fontSize: "0.52rem" }}>
        {selected.length === 0 ? (
          <span className="text-gray-400">Select currencies...</span>
        ) : (
          selected.map(code => (
            <span key={code} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white" style={{ background: `${color}cc`, fontSize: "0.44rem" }}>
              {code}
              {!disabled && (
                <button onClick={e => { e.stopPropagation(); toggle(code); }} className="hover:text-red-200 transition-colors"><X className="w-2 h-2" /></button>
              )}
            </span>
          ))
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="absolute z-50 top-full mt-1 left-0 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden">
            <div className="p-2 border-b border-gray-100 dark:border-gray-800">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search currencies..."
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 outline-none" style={{ fontSize: "0.5rem" }} />
            </div>
            <div className="max-h-40 overflow-y-auto p-1">
              {filtered.map(cur => {
                const code = cur.split(" — ")[0];
                const isSel = selected.includes(code);
                return (
                  <button key={code} onClick={() => toggle(code)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${isSel ? "bg-purple-50 dark:bg-purple-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800/30"}`}>
                    <div className="w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border transition-colors"
                      style={isSel ? { background: color, borderColor: color } : { borderColor: "#d1d5db" }}>
                      {isSel && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className={isSel ? "text-gray-800 dark:text-gray-200" : "text-gray-600 dark:text-gray-400"} style={{ fontSize: "0.5rem" }}>{cur}</span>
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

/* ═══════════════════════════════════════════════════════
   TAB 2: CONTACTS
   ═══════════════════════════════════════════════════════ */
export function ContactsTab({ color, projectId, studioId, locked, onLock, onProgress }) {
  const d = locked;
  const COUNTRIES = ["United Kingdom","Ireland","Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahrain","Bangladesh","Belarus","Belgium","Belize","Brazil","Bulgaria","Cambodia","Cameroon","Canada","Chile","China","Colombia","Croatia","Cuba","Cyprus","Czechia","Denmark","Egypt","Estonia","Ethiopia","Finland","France","Georgia","Germany","Ghana","Greece","Guatemala","Hungary","Iceland","India","Indonesia","Iran","Iraq","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Latvia","Lebanon","Lithuania","Luxembourg","Malaysia","Malta","Mexico","Moldova","Monaco","Mongolia","Montenegro","Morocco","Nepal","Netherlands","New Zealand","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saudi Arabia","Senegal","Serbia","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","Sweden","Switzerland","Syria","Taiwan","Thailand","Turkey","Uganda","Ukraine","United Arab Emirates","United States","Uruguay","Venezuela","Vietnam","Zimbabwe"];

  const [companies, setCompanies] = useState(() => {
    const raw = loadS(projectId, "contacts-companies", DEFAULT_COMPANIES, studioId);
    return raw.map(c => ({ ...c, taxId: c.taxId ?? "", registrationNumber: c.registrationNumber ?? "", currencies: c.currencies ?? [] }));
  });
  const saveCompanies = (c) => { setCompanies(c); saveS(projectId, "contacts-companies", c, studioId); };
  const addCompany = () => {
    saveCompanies([...companies, { id: `co${Date.now()}`, name: "", registrationNumber: "", taxId: "", addressLine1: "", addressLine2: "", city: "", postcode: "", country: "United Kingdom", telephone: "", email: "", currencies: ["GBP"], isPrimary: false }]);
  };
  const updateCompany = (id, patch) => saveCompanies(companies.map(c => c.id === id ? { ...c, ...patch } : c));
  const deleteCompany = (id) => { if (companies.length <= 1) return; saveCompanies(companies.filter(c => c.id !== id)); };
  const setPrimary = (id) => saveCompanies(companies.map(c => ({ ...c, isPrimary: c.id === id })));
  const [expandedCompany, setExpandedCompany] = useState(companies[0]?.id || null);

  const [base, setBase] = useState(() => loadS(projectId, "contacts-base", { addr1: "", addr2: "", city: "", postcode: "", country: "United Kingdom", telephone: "", email: "" }, studioId));
  const [creator, setCreator] = useState(() => loadS(projectId, "contacts-creator", { name: "", email: "" }, studioId));
  const [billing, setBilling] = useState(() => loadS(projectId, "contacts-billing", { contactName: "", contactEmails: "", spvVatNumber: "", sameAsSpv: true, addr1: "", addr2: "", city: "", postcode: "", country: "United Kingdom" }, studioId));

  const up = (key, val, setter) => { setter(val); saveS(projectId, key, val, studioId); };

  const hasCompanyWithName = companies.some(c => c.name.trim());
  const hasCompanyAddr = companies.some(c => c.addressLine1.trim() && c.city.trim());
  const hasCompanyCurrency = companies.some(c => c.currencies.length > 0);
  const reqFields = [hasCompanyWithName ? "y" : "", hasCompanyAddr ? "y" : "", hasCompanyCurrency ? "y" : "", base.addr1, base.city, base.telephone, creator.name, creator.email, billing.contactName, billing.contactEmails];
  const pct = Math.round((reqFields.filter(Boolean).length / reqFields.length) * 100);
  useEffect(() => { onProgress?.(pct); }, [pct]);

  return (
    <motion.div key="contacts" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>
      <TabHeader label="Contacts" pct={pct} color={color} locked={locked} />
      <div className={d ? "opacity-50 pointer-events-none select-none" : ""}>

        <GlassSection title="Companies" desc="Add one or more companies operating on this project." color={color} delay={0.05}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.48rem" }}>{companies.length} compan{companies.length !== 1 ? "ies" : "y"} registered</span>
              {!d && (
                <motion.button onClick={addCompany} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, fontSize: "0.52rem" }}>
                  <Plus className="w-3 h-3" /> Add Company
                </motion.button>
              )}
            </div>
            {companies.map((co, coIdx) => {
              const isExpanded = expandedCompany === co.id;
              return (
                <motion.div key={co.id} layout className="rounded-xl border overflow-hidden transition-colors"
                  style={{ borderColor: co.isPrimary ? `${color}50` : isExpanded ? `${color}30` : "#e5e7eb" }}>
                  <div className="flex items-center justify-between px-4 py-3 cursor-pointer bg-gray-50/30 dark:bg-gray-800/20 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors"
                    onClick={() => setExpandedCompany(isExpanded ? null : co.id)}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0"
                        style={{ background: co.isPrimary ? `linear-gradient(135deg, ${color}, ${color}cc)` : "#9ca3af" }}>
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-800 dark:text-gray-200 uppercase truncate" style={{ fontSize: "0.62rem" }}>
                            {co.name || `Company ${coIdx + 1} (Unnamed)`}
                          </span>
                          {co.isPrimary && (
                            <span className="shrink-0 px-1.5 py-0.5 rounded-full text-white uppercase tracking-wider" style={{ fontSize: "0.36rem", background: color }}>Primary</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          {co.city && <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.46rem" }}>{co.city}, {co.country}</span>}
                          {co.currencies.length > 0 && (
                            <div className="flex gap-1">
                              {co.currencies.map(cur => (
                                <span key={cur} className="px-1.5 py-px rounded-full text-white" style={{ fontSize: "0.36rem", background: `${color}88` }}>{cur}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!co.isPrimary && !d && (
                        <button onClick={e => { e.stopPropagation(); setPrimary(co.id); }}
                          className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-purple-600 hover:border-purple-300 transition-colors"
                          style={{ fontSize: "0.44rem" }}>
                          Set Primary
                        </button>
                      )}
                      {companies.length > 1 && !d && (
                        <button onClick={e => { e.stopPropagation(); deleteCompany(co.id); }}
                          className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="px-4 py-4 space-y-3 border-t border-gray-100 dark:border-gray-800">
                          <div className="grid grid-cols-2 gap-3">
                            <ModInput label="Company Name" value={co.name} onChange={v => updateCompany(co.id, { name: v })} color={color} disabled={d} required />
                            <ModInput label="Company Registration Number" value={co.registrationNumber} onChange={v => updateCompany(co.id, { registrationNumber: v })} color={color} disabled={d} />
                          </div>
                          {(() => {
                            const taxInfo = getTaxIdInfo(co.country);
                            return (
                              <div>
                                <ModInput label={taxInfo.label} value={co.taxId} onChange={v => updateCompany(co.id, { taxId: v })} color={color} disabled={d} placeholder={taxInfo.placeholder} />
                                <span className="text-gray-400 dark:text-gray-500 mt-1 block px-1" style={{ fontSize: "0.42rem" }}>{taxInfo.hint}</span>
                              </div>
                            );
                          })()}
                          <div className="grid grid-cols-2 gap-3">
                            <ModInput label="Address Line 1" value={co.addressLine1} onChange={v => updateCompany(co.id, { addressLine1: v })} color={color} disabled={d} required />
                            <ModInput label="Address Line 2" value={co.addressLine2} onChange={v => updateCompany(co.id, { addressLine2: v })} color={color} disabled={d} />
                          </div>
                          <div className="grid grid-cols-4 gap-3">
                            <ModInput label="City" value={co.city} onChange={v => updateCompany(co.id, { city: v })} color={color} disabled={d} required />
                            <ModInput label="Postcode" value={co.postcode} onChange={v => updateCompany(co.id, { postcode: v })} color={color} disabled={d} />
                            <div className="col-span-2">
                              <ModSelect label="Country" value={co.country} onChange={v => updateCompany(co.id, { country: v })} options={COUNTRIES} color={color} disabled={d} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <ModInput label="Telephone Number" value={co.telephone} onChange={v => updateCompany(co.id, { telephone: v })} type="tel" color={color} disabled={d} required />
                            <ModInput label="Email Address" value={co.email} onChange={v => updateCompany(co.id, { email: v })} type="email" color={color} disabled={d} />
                          </div>
                          <CurrencyMultiSelect selected={co.currencies} onChange={v => updateCompany(co.id, { currencies: v })} color={color} disabled={d} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </GlassSection>

        <GlassSection title="Production Base" desc="Shown to crew in their offer so they can contact you for help." color={color} delay={0.1}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <ModInput label="Address Line 1" value={base.addr1} onChange={v => up("contacts-base", { ...base, addr1: v }, setBase)} color={color} disabled={d} required />
              <ModInput label="Address Line 2" value={base.addr2} onChange={v => up("contacts-base", { ...base, addr2: v }, setBase)} color={color} disabled={d} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <ModInput label="City" value={base.city} onChange={v => up("contacts-base", { ...base, city: v }, setBase)} color={color} disabled={d} required />
              <ModInput label="Postcode" value={base.postcode} onChange={v => up("contacts-base", { ...base, postcode: v }, setBase)} color={color} disabled={d} />
              <ModSelect label="Country" value={base.country} onChange={v => up("contacts-base", { ...base, country: v }, setBase)} options={COUNTRIES} color={color} disabled={d} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ModInput label="Telephone Number" value={base.telephone} onChange={v => up("contacts-base", { ...base, telephone: v }, setBase)} type="tel" color={color} disabled={d} required />
              <ModInput label="Email Address" value={base.email} onChange={v => up("contacts-base", { ...base, email: v }, setBase)} type="email" color={color} disabled={d} />
            </div>
          </div>
        </GlassSection>

        <GlassSection title="Project Creator" desc="Contact details of who created this project." color={color} delay={0.15}>
          <div className="grid grid-cols-2 gap-3">
            <ModInput label="Project Creator Name" value={creator.name} onChange={v => up("contacts-creator", { ...creator, name: v }, setCreator)} color={color} disabled={d} required />
            <ModInput label="Project Creator Email Address" value={creator.email} onChange={v => up("contacts-creator", { ...creator, email: v }, setCreator)} type="email" color={color} disabled={d} required />
          </div>
        </GlassSection>

        <GlassSection title="Billing" desc="Contact details for EAARTH to send invoices to." color={color} delay={0.2}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <ModInput label="Billing Contact Name" value={billing.contactName} onChange={v => up("contacts-billing", { ...billing, contactName: v }, setBilling)} color={color} disabled={d} required />
              <div>
                <ModInput label="Billing Contact Email(s)" value={billing.contactEmails} onChange={v => up("contacts-billing", { ...billing, contactEmails: v }, setBilling)} type="email" color={color} disabled={d} required />
                <span className="text-gray-400 dark:text-gray-500 mt-1 block px-1" style={{ fontSize: "0.48rem" }}>Enter one or more email addresses, separated by commas.</span>
              </div>
            </div>
            <ModInput label="SPV Company VAT Number" value={billing.spvVatNumber} onChange={v => up("contacts-billing", { ...billing, spvVatNumber: v }, setBilling)} color={color} disabled={d} />
            <PillToggle label="Billing address is same as SPV company?" value={billing.sameAsSpv} onChange={v => up("contacts-billing", { ...billing, sameAsSpv: v }, setBilling)} color={color} disabled={d} />
            {!billing.sameAsSpv && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <ModInput label="Billing Address Line 1" value={billing.addr1} onChange={v => up("contacts-billing", { ...billing, addr1: v }, setBilling)} color={color} disabled={d} />
                  <ModInput label="Billing Address Line 2" value={billing.addr2} onChange={v => up("contacts-billing", { ...billing, addr2: v }, setBilling)} color={color} disabled={d} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <ModInput label="City" value={billing.city} onChange={v => up("contacts-billing", { ...billing, city: v }, setBilling)} color={color} disabled={d} />
                  <ModInput label="Postcode" value={billing.postcode} onChange={v => up("contacts-billing", { ...billing, postcode: v }, setBilling)} color={color} disabled={d} />
                  <ModSelect label="Country" value={billing.country} onChange={v => up("contacts-billing", { ...billing, country: v }, setBilling)} options={COUNTRIES} color={color} disabled={d} />
                </div>
              </motion.div>
            )}
          </div>
        </GlassSection>

      </div>
      <ActionFooter locked={locked} onLock={onLock} color={color} pct={pct} />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB 3: DATES
   ═══════════════════════════════════════════════════════ */
export function DatesTab({ color, projectId, studioId, locked, onLock, onProgress }) {
  const d = locked;

  const [dates, setDates] = useState(() => loadS(projectId, "dates-overall", {
    prepStart: "", prepEnd: "", shootStart: "", shootEnd: "", shootDurationDays: "",
  }, studioId));
  const [hiatuses, setHiatuses] = useState(() => loadS(projectId, "dates-hiatus", [], studioId));
  const [post, setPost] = useState(() => loadS(projectId, "dates-post", { postStart: "", postEnd: "" }, studioId));

  const up = (key, val, setter) => { setter(val); saveS(projectId, key, val, studioId); };

  const addHiatus = () => {
    const next = [...hiatuses, { id: Date.now().toString(), start: "", end: "", label: `Hiatus ${hiatuses.length + 1}` }];
    setHiatuses(next); saveS(projectId, "dates-hiatus", next, studioId);
  };
  const updateHiatus = (id, field, val) => {
    const next = hiatuses.map(h => h.id === id ? { ...h, [field]: val } : h);
    setHiatuses(next); saveS(projectId, "dates-hiatus", next, studioId);
  };
  const removeHiatus = (id) => {
    const next = hiatuses.filter(h => h.id !== id);
    setHiatuses(next); saveS(projectId, "dates-hiatus", next, studioId);
  };

  const reqFields = [dates.prepStart, dates.prepEnd, dates.shootStart, dates.shootEnd, dates.shootDurationDays, post.postStart, post.postEnd];
  const pct = Math.round((reqFields.filter(Boolean).length / reqFields.length) * 100);
  useEffect(() => { onProgress?.(pct); }, [pct]);

  return (
    <motion.div key="dates" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>
      <TabHeader label="Dates" pct={pct} color={color} locked={locked} />
      <div className={d ? "opacity-50 pointer-events-none select-none" : ""}>

        <GlassSection title="Overall Dates" desc="Key production milestone dates for planning and crew information." color={color} delay={0.05}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <ModInput label="Prep Start" value={dates.prepStart} onChange={v => up("dates-overall", { ...dates, prepStart: v }, setDates)} type="date" color={color} disabled={d} required />
              <ModInput label="Prep End" value={dates.prepEnd} onChange={v => up("dates-overall", { ...dates, prepEnd: v }, setDates)} type="date" color={color} disabled={d} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ModInput label="Shoot Start" value={dates.shootStart} onChange={v => up("dates-overall", { ...dates, shootStart: v }, setDates)} type="date" color={color} disabled={d} required />
              <ModInput label="Shoot End" value={dates.shootEnd} onChange={v => up("dates-overall", { ...dates, shootEnd: v }, setDates)} type="date" color={color} disabled={d} required />
            </div>
            <div>
              <ModInput label="Shoot Duration Days" value={dates.shootDurationDays} onChange={v => up("dates-overall", { ...dates, shootDurationDays: v }, setDates)} type="number" color={color} disabled={d} required />
              <span className="text-gray-400 dark:text-gray-500 mt-1 block px-1" style={{ fontSize: "0.48rem" }}>This is just guide information for crew and can be updated for everyone at any time.</span>
            </div>
          </div>
        </GlassSection>

        <GlassSection title="Hiatus" desc="Add any planned production breaks or hiatus periods." color={color} delay={0.1}>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {hiatuses.map((h, i) => (
                <motion.div key={h.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, height: 0 }} transition={{ duration: 0.25 }}
                  className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 dark:text-gray-400 uppercase" style={{ fontSize: "0.56rem" }}>Hiatus {i + 1}</span>
                    {!d && (
                      <button onClick={() => removeHiatus(h.id)} className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <ModInput label="Label" value={h.label} onChange={v => updateHiatus(h.id, "label", v)} color={color} disabled={d} />
                    <ModInput label="Start Date" value={h.start} onChange={v => updateHiatus(h.id, "start", v)} type="date" color={color} disabled={d} />
                    <ModInput label="End Date" value={h.end} onChange={v => updateHiatus(h.id, "end", v)} type="date" color={color} disabled={d} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {hiatuses.length === 0 && (
              <div className="text-center py-4">
                <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.58rem" }}>No hiatus periods added yet.</span>
              </div>
            )}
            {!d && (
              <motion.button onClick={addHiatus} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                style={{ fontSize: "0.62rem" }}>
                <Plus className="w-3.5 h-3.5" /><span className="uppercase">Add Hiatus</span>
              </motion.button>
            )}
          </div>
        </GlassSection>

        <GlassSection title="Post Production" desc="Post-production phase start and end dates." color={color} delay={0.15}>
          <div className="grid grid-cols-2 gap-3">
            <ModInput label="Post Production Start" value={post.postStart} onChange={v => up("dates-post", { ...post, postStart: v }, setPost)} type="date" color={color} disabled={d} required />
            <ModInput label="Post Production End" value={post.postEnd} onChange={v => up("dates-post", { ...post, postEnd: v }, setPost)} type="date" color={color} disabled={d} required />
          </div>
        </GlassSection>

      </div>
      <ActionFooter locked={locked} onLock={onLock} color={color} pct={pct} />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB 4: RATES-PROJECT
   ═══════════════════════════════════════════════════════ */
export function RatesProjectTab({ color, projectId, studioId, locked, onLock, onProgress }) {
  const d = locked;
  const CURRENCIES = ["AUD", "CAD", "DKK", "EUR", "GBP", "ISK", "NZD", "USD"];

  const [basic, setBasic] = useState(() => loadS(projectId, "proj-defaults-basic", { workingWeek: "", showPrepWrapMins: false }, studioId));
  const [allow, setAllow] = useState(() => loadS(projectId, "proj-defaults-allow", {
    box: false, computer: false, software: false, equipment: false,
    mobile: false, requireMobileBill: false, mobileBillTerms: "Reimbursement of mobile phone bill",
    vehicleAllowance: false, requireBusinessInsurance: false, requireDrivingLicence: false,
    vehicleHire: false, perDiem: false, perDiemCurrency: "", perDiemShootRate: "25.00", perDiemNonShootRate: "40.00", living: false,
  }, studioId));
  const [meals, setMeals] = useState(() => loadS(projectId, "proj-defaults-meals", { breakfastPenalty: "5.00", lunchPenalty: "5.00", dinnerPenalty: "10.00" }, studioId));
  const [notice, setNotice] = useState(() => loadS(projectId, "proj-defaults-notice", {
    noticePeriod: "",
    noticeWording: "Dear [Loan Out Company Name] / [Crew member name],\nOn behalf of Mirage Pictures Limited, I hereby confirm that your last day of engagement will be [finish date].\nMany thanks for your hard work on the production.",
  }, studioId));

  const up = (key, val, setter) => { setter(val); saveS(projectId, key, val, studioId); };

  const reqFields = [basic.workingWeek, notice.noticePeriod];
  const pct = Math.round((reqFields.filter(Boolean).length / reqFields.length) * 100);
  useEffect(() => { onProgress?.(pct); }, [pct]);

  return (
    <motion.div key="rates-project" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>
      <TabHeader label="Project" pct={pct} color={color} locked={locked} />
      <div className={d ? "opacity-50 pointer-events-none select-none" : ""}>

        <GlassSection title="Basic" desc="Core project working week configuration." color={color} delay={0.05}>
          <div className="space-y-3">
            <ModSelect label="Working Week" value={basic.workingWeek} onChange={v => up("proj-defaults-basic", { ...basic, workingWeek: v }, setBasic)} options={["5 days", "5.5 days", "5/6 days", "6 days"]} color={color} disabled={d} />
            <PillToggle label="Show prep/wrap mins in Offer view?" value={basic.showPrepWrapMins} onChange={v => up("proj-defaults-basic", { ...basic, showPrepWrapMins: v }, setBasic)} color={color} disabled={d} />
          </div>
        </GlassSection>

        <GlassSection title="Allowances" desc="Which of these allowances might you pay?" color={color} delay={0.1}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-x-6">
              <PillToggle label="Box" value={allow.box} onChange={v => up("proj-defaults-allow", { ...allow, box: v }, setAllow)} color={color} disabled={d} />
              <PillToggle label="Computer" value={allow.computer} onChange={v => up("proj-defaults-allow", { ...allow, computer: v }, setAllow)} color={color} disabled={d} />
              <PillToggle label="Software" value={allow.software} onChange={v => up("proj-defaults-allow", { ...allow, software: v }, setAllow)} color={color} disabled={d} />
              <PillToggle label="Equipment" value={allow.equipment} onChange={v => up("proj-defaults-allow", { ...allow, equipment: v }, setAllow)} color={color} disabled={d} />
            </div>
            <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/20 dark:bg-gray-800/10 p-3 space-y-2">
              <PillToggle label="Mobile" value={allow.mobile} onChange={v => up("proj-defaults-allow", { ...allow, mobile: v }, setAllow)} color={color} disabled={d} />
              {allow.mobile && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pl-4 space-y-2 border-l-2 border-gray-200 dark:border-gray-700 ml-1">
                  <PillToggle label="Require mobile phone allowance bill?" value={allow.requireMobileBill} onChange={v => up("proj-defaults-allow", { ...allow, requireMobileBill: v }, setAllow)} color={color} disabled={d} />
                  <ModInput label="Mobile phone bill reimbursement default terms" value={allow.mobileBillTerms} onChange={v => up("proj-defaults-allow", { ...allow, mobileBillTerms: v }, setAllow)} color={color} disabled={d} />
                </motion.div>
              )}
            </div>
            <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/20 dark:bg-gray-800/10 p-3 space-y-2">
              <PillToggle label="Vehicle Allowance" value={allow.vehicleAllowance} onChange={v => up("proj-defaults-allow", { ...allow, vehicleAllowance: v }, setAllow)} color={color} disabled={d} />
              {allow.vehicleAllowance && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pl-4 space-y-2 border-l-2 border-gray-200 dark:border-gray-700 ml-1">
                  <PillToggle label="Require copy of Business Insurance?" value={allow.requireBusinessInsurance} onChange={v => up("proj-defaults-allow", { ...allow, requireBusinessInsurance: v }, setAllow)} color={color} disabled={d} />
                  <PillToggle label="Require copy of Driving Licence?" value={allow.requireDrivingLicence} onChange={v => up("proj-defaults-allow", { ...allow, requireDrivingLicence: v }, setAllow)} color={color} disabled={d} />
                </motion.div>
              )}
            </div>
            <PillToggle label="Vehicle Hire" value={allow.vehicleHire} onChange={v => up("proj-defaults-allow", { ...allow, vehicleHire: v }, setAllow)} color={color} disabled={d} />
            <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/20 dark:bg-gray-800/10 p-3 space-y-2">
              <PillToggle label="Per Diem" value={allow.perDiem} onChange={v => up("proj-defaults-allow", { ...allow, perDiem: v }, setAllow)} color={color} disabled={d} />
              {allow.perDiem && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pl-4 space-y-2 border-l-2 border-gray-200 dark:border-gray-700 ml-1">
                  <ModSelect label="Per Diem Currency" value={allow.perDiemCurrency} onChange={v => up("proj-defaults-allow", { ...allow, perDiemCurrency: v }, setAllow)} options={CURRENCIES} color={color} disabled={d} />
                  <div className="grid grid-cols-2 gap-3">
                    <ModInput label="Per Diem Shoot Rate" value={allow.perDiemShootRate} onChange={v => up("proj-defaults-allow", { ...allow, perDiemShootRate: v }, setAllow)} type="number" color={color} disabled={d} />
                    <ModInput label="Per Diem Non-Shoot Rate" value={allow.perDiemNonShootRate} onChange={v => up("proj-defaults-allow", { ...allow, perDiemNonShootRate: v }, setAllow)} type="number" color={color} disabled={d} />
                  </div>
                </motion.div>
              )}
            </div>
            <PillToggle label="Living" value={allow.living} onChange={v => up("proj-defaults-allow", { ...allow, living: v }, setAllow)} color={color} disabled={d} />
          </div>
        </GlassSection>

        <GlassSection title="Meal Penalties" desc="Default penalty amounts when meals are not provided on time." color={color} delay={0.15}>
          <div className="grid grid-cols-3 gap-3">
            <ModInput label="Breakfast Penalty" value={meals.breakfastPenalty} onChange={v => up("proj-defaults-meals", { ...meals, breakfastPenalty: v }, setMeals)} type="number" color={color} disabled={d} />
            <ModInput label="Lunch Penalty" value={meals.lunchPenalty} onChange={v => up("proj-defaults-meals", { ...meals, lunchPenalty: v }, setMeals)} type="number" color={color} disabled={d} />
            <ModInput label="Dinner Penalty" value={meals.dinnerPenalty} onChange={v => up("proj-defaults-meals", { ...meals, dinnerPenalty: v }, setMeals)} type="number" color={color} disabled={d} />
          </div>
        </GlassSection>

        <GlassSection title="Notice" desc="Settings for 'Notice of termination of contract' emails." color={color} delay={0.2}>
          <div className="space-y-3">
            <div>
              <ModInput label="Notice Period" value={notice.noticePeriod} onChange={v => up("proj-defaults-notice", { ...notice, noticePeriod: v }, setNotice)} type="number" color={color} disabled={d} required />
              <span className="text-gray-400 dark:text-gray-500 mt-1 block px-1" style={{ fontSize: "0.48rem" }}>In days.</span>
            </div>
            <ModTextarea label="Notice Email Wording" value={notice.noticeWording} onChange={v => up("proj-defaults-notice", { ...notice, noticeWording: v }, setNotice)} maxLength={2000} color={color} disabled={d} helpText="Template used in notice of termination emails." />
          </div>
        </GlassSection>

      </div>
      <ActionFooter locked={locked} onLock={onLock} color={color} pct={pct} />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB 5: RATES-CREW
   ═══════════════════════════════════════════════════════ */
export function RatesCrewTab({ color, projectId, studioId, locked, onLock, onProgress }) {
  const d = locked;
  const MULTIPLIERS = ["1.0", "1.5", "2.0"];

  const [sixSeven, setSixSeven] = useState(() => loadS(projectId, "crew-6th7th", { sixthDayMultiplier: "1.5", seventhDayMultiplier: "2.0", showMinHoursInOffers: false }, studioId));
  const [ot, setOt] = useState(() => loadS(projectId, "crew-overtime", { customOtRate1: "", customOtRate2: "", customOtRate3: "" }, studioId));
  const [other, setOther] = useState(() => loadS(projectId, "crew-other", { cameraStandardDay: "", cameraContinuousDay: "", cameraSemiContinuousDay: "" }, studioId));

  const up = (key, val, setter) => { setter(val); saveS(projectId, key, val, studioId); };

  const pactTooltip = "For projects using the Film PACT/BECTU MMPA, this multiplier will only apply to crew who are on deals outside of the agreement.";

  const reqFields = [sixSeven.sixthDayMultiplier, sixSeven.seventhDayMultiplier];
  const pct = Math.round((reqFields.filter(Boolean).length / reqFields.length) * 100);
  useEffect(() => { onProgress?.(pct); }, [pct]);

  return (
    <motion.div key="rates-crew" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>
      <TabHeader label="Standard Crew" pct={pct} color={color} locked={locked} />
      <div className={d ? "opacity-50 pointer-events-none select-none" : ""}>
        <GlassSection title="6th/7th Days" desc="Fee multipliers for 6th and 7th day work." color={color} delay={0.05}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-gray-500 dark:text-gray-400 uppercase" style={{ fontSize: "0.52rem" }}>6th Day Fee Multiplier</span>
                  <TooltipIcon text={pactTooltip} color={color} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400" style={{ fontSize: "0.7rem" }}>x</span>
                  <div className="flex-1"><ModSelect label="" value={sixSeven.sixthDayMultiplier} onChange={v => up("crew-6th7th", { ...sixSeven, sixthDayMultiplier: v }, setSixSeven)} options={MULTIPLIERS} color={color} disabled={d} /></div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-gray-500 dark:text-gray-400 uppercase" style={{ fontSize: "0.52rem" }}>7th Day Fee Multiplier</span>
                  <TooltipIcon text={pactTooltip} color={color} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400" style={{ fontSize: "0.7rem" }}>x</span>
                  <div className="flex-1"><ModSelect label="" value={sixSeven.seventhDayMultiplier} onChange={v => up("crew-6th7th", { ...sixSeven, seventhDayMultiplier: v }, setSixSeven)} options={MULTIPLIERS} color={color} disabled={d} /></div>
                </div>
              </div>
            </div>
            <PillToggle label="Show minimum hours on 6th and 7th days in offers?" value={sixSeven.showMinHoursInOffers} onChange={v => up("crew-6th7th", { ...sixSeven, showMinHoursInOffers: v }, setSixSeven)} color={color} disabled={d} />
          </div>
        </GlassSection>
        <GlassSection title="Overtime" desc="Custom overtime rates for offers not using 'Calculated per agreement'." color={color} delay={0.1}>
          <div className="space-y-4">
            <ModInput label="Other" value={ot.customOtRate1} onChange={v => up("crew-overtime", { ...ot, customOtRate1: v }, setOt)} color={color} disabled={d} />
            <ModInput label="Camera - standard day" value={other.cameraStandardDay} onChange={v => up("crew-other", { ...other, cameraStandardDay: v }, setOther)} color={color} disabled={d} />
            <ModInput label="Camera - continuous day" value={other.cameraContinuousDay} onChange={v => up("crew-other", { ...other, cameraContinuousDay: v }, setOther)} color={color} disabled={d} />
            <ModInput label="Camera - semi-continuous day" value={other.cameraSemiContinuousDay} onChange={v => up("crew-other", { ...other, cameraSemiContinuousDay: v }, setOther)} color={color} disabled={d} />
          </div>
        </GlassSection>
      </div>
      <ActionFooter locked={locked} onLock={onLock} color={color} pct={pct} />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   STUB TABS — for all remaining tabs (rates-construction,
   rates-places, rates-departments, doc-signers,
   contracts-forms, admin, custom, notifications,
   timecard, subscriptions, chat, calendar, ai-knowledge-base)
   Each is 100% complete so they can be locked immediately.
   Replace with real content as you build them out.
   ═══════════════════════════════════════════════════════ */
function StubTab({ label, color, locked, onLock, onProgress, tabKey }) {
  useEffect(() => { onProgress?.(100); }, []);
  return (
    <motion.div key={tabKey} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>
      <TabHeader label={label} pct={100} color={color} locked={locked} />
      <GlassSection title={label} desc="This section is ready to be configured." color={color} delay={0.05}>
        <div className="py-6 text-center">
          <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.7rem" }}>
            {label} settings will appear here.
          </span>
        </div>
      </GlassSection>
      <ActionFooter locked={locked} onLock={onLock} color={color} pct={100} />
    </motion.div>
  );
}

export function RatesConstructionTab(props) { return <StubTab {...props} label="Construction" tabKey="rates-construction" />; }
export function RatesPlacesTab(props) { return <StubTab {...props} label="Places" tabKey="rates-places" />; }
export function RatesDepartmentsTab(props) { return <StubTab {...props} label="Departments" tabKey="rates-departments" />; }
export function DocSignersTab(props) { return <StubTab {...props} label="Signatures & Workflow" tabKey="doc-signers" />; }
export function ContractsFormsTab(props) { return <StubTab {...props} label="Contracts & Forms" tabKey="contracts-forms" />; }
export function AdminTab(props) { return <StubTab {...props} label="Admin" tabKey="admin" />; }
export function CustomTab(props) { return <StubTab {...props} label="Custom" tabKey="custom" />; }
export function NotificationsTab(props) { return <StubTab {...props} label="Notifications" tabKey="notifications" />; }
export function TimecardTab(props) { return <StubTab {...props} label="Timecard" tabKey="timecard" />; }
export function SubscriptionsTab(props) { return <StubTab {...props} label="Subscriptions" tabKey="subscriptions" />; }
export function ChatTab(props) { return <StubTab {...props} label="Chat" tabKey="chat" />; }
export function CalendarTab(props) { return <StubTab {...props} label="Calendar" tabKey="calendar" />; }
export function AIKnowledgeBaseTab(props) { return <StubTab {...props} label="AI Knowledge Base" tabKey="ai-knowledge-base" />; }