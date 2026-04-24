import { motion } from "framer-motion";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/shared/components/ui/toggle-group";
import { SettingsSection } from "@/features/projects/settings/components/shared/SettingsSection";
import { useState } from "react";
import { InfoTooltip } from "@/shared/components/InfoTooltip";
import { HelpCircle, Plus, Trash2, Building2, ChevronDown } from "lucide-react";
import { SelectMenu } from "@/shared/components/menus/SelectMenu";

const ALL_CURRENCIES = [
  "GBP", "USD", "EUR", "CAD", "AUD", "NZD", "DKK", "SEK", "NOK",
  "CHF", "JPY", "CNY", "INR", "ZAR", "AED", "SGD", "HKD", "MXN", "BRL",
];

const COUNTRIES = [
  "United Kingdom", "Ireland", "United States", "Canada", "Australia",
  "New Zealand", "Germany", "France", "Spain", "Italy", "Netherlands",
  "Belgium", "Switzerland", "Sweden", "Norway", "Denmark", "India",
  "Singapore", "Hong Kong", "Japan", "United Arab Emirates", "South Africa",
  "Brazil", "Mexico", "China", "South Korea", "Poland", "Portugal",
  "Austria", "Czechia", "Iceland",
];

const DEFAULT_COMPANIES = [
  {
    id: "co1",
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
    isPrimary: true,
  },
];

function ContactsSettings() {
  const [companies, setCompanies] = useState(DEFAULT_COMPANIES);
  const [expandedCompany, setExpandedCompany] = useState(DEFAULT_COMPANIES[0]?.id || null);

  const [base, setBase] = useState({
    addr1: "", addr2: "", city: "", postcode: "",
    country: "United Kingdom", telephone: "", email: "",
  });

  const [creator, setCreator] = useState({ name: "", email: "" });

  const [billing, setBilling] = useState({
    contactName: "", contactEmails: "", spvVatNumber: "",
    sameAsSpv: "yes", addr1: "", addr2: "", city: "",
    postcode: "", country: "United Kingdom",
  });

  const addCompany = () => {
    const newCo = {
      id: `co${Date.now()}`,
      name: "", registrationNumber: "", taxId: "",
      addressLine1: "", addressLine2: "", city: "", postcode: "",
      country: "United Kingdom", telephone: "", email: "",
      currencies: ["GBP"], isPrimary: false,
    };
    setCompanies([...companies, newCo]);
    setExpandedCompany(newCo.id);
  };

  const updateCompany = (id, patch) =>
    setCompanies(companies.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const deleteCompany = (id) => {
    if (companies.length <= 1) return;
    setCompanies(companies.filter((c) => c.id !== id));
  };

  const setPrimary = (id) =>
    setCompanies(companies.map((c) => ({ ...c, isPrimary: c.id === id })));

  const toggleCurrency = (co, code) => {
    const next = co.currencies.includes(code)
      ? co.currencies.filter((c) => c !== code)
      : [...co.currencies, code];
    updateCompany(co.id, { currencies: next });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col gap-5"
      >
        {/* ── Section 1: Companies ── */}
        <SettingsSection
          title="Companies"
          subtitle="Add one or more companies operating on this project. Each can have its own address, contact details, and currencies."
        >
          <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                {companies.length} {companies.length === 1 ? "company" : "companies"} registered
              </Label>
              <button
                onClick={addCompany}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white shadow-sm text-xs bg-violet-600 hover:bg-violet-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Company
              </button>
            </div>

            {companies.map((co, coIdx) => {
              const isExpanded = expandedCompany === co.id;
              return (
                <div
                  key={co.id}
                  className="rounded-lg border overflow-hidden"
                  style={{ borderColor: co.isPrimary ? "#8b5cf650" : undefined }}
                >
                  {/* Header row */}
                  <div
                    className="flex items-center justify-between px-4 py-3 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setExpandedCompany(isExpanded ? null : co.id)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 ${co.isPrimary ? "bg-violet-600" : "bg-muted-foreground/40"}`}>
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground uppercase truncate">
                            {co.name || `Company ${coIdx + 1} (Unnamed)`}
                          </span>
                          {co.isPrimary && (
                            <span className="shrink-0 px-1.5 py-0.5 rounded-full text-white uppercase tracking-wider text-[0.55rem] bg-violet-600">
                              Primary
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          {co.city && (
                            <span className="text-[0.65rem] text-muted-foreground">{co.city}, {co.country}</span>
                          )}
                          {co.taxId && (
                            <span className="text-[0.6rem] text-muted-foreground">• VAT: {co.taxId}</span>
                          )}
                          {co.currencies.length > 0 && (
                            <div className="flex gap-1">
                              {co.currencies.map((cur) => (
                                <span key={cur} className="px-1.5 py-px rounded-full text-white text-[0.55rem] bg-violet-400">
                                  {cur}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!co.isPrimary && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setPrimary(co.id); }}
                          className="px-2.5 py-1 rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors text-[0.65rem]"
                        >
                          Set Primary
                        </button>
                      )}
                      {companies.length > 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteCompany(co.id); }}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </div>

                  {/* Expanded form */}
                  {isExpanded && (
                    <div className="px-4 py-4 border-t border-border">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                        <div className="flex flex-col gap-1.5">
                          <Label className="text-xs font-medium">Company Name</Label>
                          <Input
                            className="placeholder:text-xs"
                            placeholder="Company Name"
                            value={co.name}
                            onChange={(e) => updateCompany(co.id, { name: e.target.value })}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <Label className="text-xs font-medium">Company Registration Number</Label>
                          <Input
                            className="placeholder:text-xs"
                            placeholder="Company Registration Number"
                            value={co.registrationNumber}
                            onChange={(e) => updateCompany(co.id, { registrationNumber: e.target.value })}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <Label className="text-xs font-medium">VAT / Tax ID Number</Label>
                          <Input
                            className="placeholder:text-xs"
                            placeholder="e.g. GB 123 4567 89"
                            value={co.taxId}
                            onChange={(e) => updateCompany(co.id, { taxId: e.target.value })}
                          />
                          <p className="text-[0.6rem] leading-relaxed text-muted-foreground">
                            VAT or tax registration number for this company's jurisdiction.
                          </p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <Label className="text-xs font-medium">Address Line 1</Label>
                          <Input
                            className="placeholder:text-xs"
                            placeholder="Address Line 1"
                            value={co.addressLine1}
                            onChange={(e) => updateCompany(co.id, { addressLine1: e.target.value })}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <Label className="text-xs font-medium">Address Line 2</Label>
                          <Input
                            className="placeholder:text-xs"
                            placeholder="Address Line 2"
                            value={co.addressLine2}
                            onChange={(e) => updateCompany(co.id, { addressLine2: e.target.value })}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <Label className="text-xs font-medium">City</Label>
                          <Input
                            className="placeholder:text-xs"
                            placeholder="City"
                            value={co.city}
                            onChange={(e) => updateCompany(co.id, { city: e.target.value })}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <Label className="text-xs font-medium">Postcode</Label>
                          <Input
                            className="placeholder:text-xs"
                            placeholder="Postcode"
                            value={co.postcode}
                            onChange={(e) => updateCompany(co.id, { postcode: e.target.value })}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <Label className="text-xs font-medium">Country</Label>
                          <SelectMenu
                            label="Select country"
                            selected={co.country}
                            onSelect={(v) => updateCompany(co.id, { country: v })}
                            items={COUNTRIES.map((c) => ({ label: c, value: c }))}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <Label className="text-xs font-medium">Telephone Number</Label>
                          <Input
                            className="placeholder:text-xs"
                            placeholder="Telephone Number"
                            type="tel"
                            value={co.telephone}
                            onChange={(e) => updateCompany(co.id, { telephone: e.target.value })}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <Label className="text-xs font-medium">Email Address</Label>
                          <Input
                            className="placeholder:text-xs"
                            placeholder="Email Address"
                            type="email"
                            value={co.email}
                            onChange={(e) => updateCompany(co.id, { email: e.target.value })}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5 lg:col-span-2">
                          <Label className="text-xs font-medium">Currencies</Label>
                          <div className="flex flex-wrap gap-1.5">
                            {ALL_CURRENCIES.map((code) => {
                              const isSelected = co.currencies.includes(code);
                              return (
                                <button
                                  key={code}
                                  onClick={() => toggleCurrency(co, code)}
                                  className={`px-2.5 py-1 rounded-md border text-[0.65rem] transition-colors ${
                                    isSelected
                                      ? "bg-violet-600 text-white border-violet-600"
                                      : "border-border text-muted-foreground hover:border-violet-400 hover:text-foreground"
                                  }`}
                                >
                                  {code}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </SettingsSection>

        {/* ── Section 2: Production Base ── */}
        <SettingsSection
          title="Production Base"
          subtitle="Shown to crew in their offer so they can contact you for help, and possibly in documents regarding mileage."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Address Line 1</Label>
              <Input
                className="placeholder:text-xs"
                placeholder="Address Line 1"
                value={base.addr1}
                onChange={(e) => setBase({ ...base, addr1: e.target.value })}
              />
              <p className="text-[0.6rem] leading-relaxed text-muted-foreground">
                The address of the Production Base for this project (from which mileage might be charged).
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Address Line 2</Label>
              <Input
                className="placeholder:text-xs"
                placeholder="Address Line 2"
                value={base.addr2}
                onChange={(e) => setBase({ ...base, addr2: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">City</Label>
              <Input
                className="placeholder:text-xs"
                placeholder="City"
                value={base.city}
                onChange={(e) => setBase({ ...base, city: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Postcode</Label>
              <Input
                className="placeholder:text-xs"
                placeholder="Postcode"
                value={base.postcode}
                onChange={(e) => setBase({ ...base, postcode: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5 lg:col-span-2">
              <Label className="text-xs font-medium">Country</Label>
              <SelectMenu
                label="Select country"
                selected={base.country}
                onSelect={(v) => setBase({ ...base, country: v })}
                items={COUNTRIES.map((c) => ({ label: c, value: c }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Telephone Number</Label>
              <Input
                className="placeholder:text-xs"
                placeholder="Telephone Number"
                type="tel"
                value={base.telephone}
                onChange={(e) => setBase({ ...base, telephone: e.target.value })}
              />
              <p className="text-[0.6rem] leading-relaxed text-muted-foreground">
                Helpful information shown to crew in their offer, so they can contact you with any questions.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Email Address</Label>
              <Input
                className="placeholder:text-xs"
                placeholder="Email Address"
                type="email"
                value={base.email}
                onChange={(e) => setBase({ ...base, email: e.target.value })}
              />
              <p className="text-[0.6rem] leading-relaxed text-muted-foreground">
                Helpful information shown to crew in their offer, so they can contact you with any questions.
              </p>
            </div>
          </div>
        </SettingsSection>

        {/* ── Section 3: Project Creator ── */}
        <SettingsSection
          title="Project Creator"
          subtitle="Contact details of who created this project."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Project Creator Name</Label>
              <Input
                className="placeholder:text-xs"
                placeholder="Project Creator Name"
                value={creator.name}
                onChange={(e) => setCreator({ ...creator, name: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Project Creator Email Address</Label>
              <Input
                className="placeholder:text-xs"
                placeholder="Project Creator Email Address"
                type="email"
                value={creator.email}
                onChange={(e) => setCreator({ ...creator, email: e.target.value })}
              />
            </div>
          </div>
        </SettingsSection>

        {/* ── Section 4: Billing ── */}
        <SettingsSection
          title="Billing"
          subtitle="Contact details for EAARTH to send invoices to."
        >
          <div className="flex flex-col gap-5 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium">Billing Contact Name</Label>
                <Input
                  className="placeholder:text-xs"
                  placeholder="Billing Contact Name"
                  value={billing.contactName}
                  onChange={(e) => setBilling({ ...billing, contactName: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium">Billing Contact Email(s)</Label>
                <Input
                  className="placeholder:text-xs"
                  placeholder="Billing Contact Email(s)"
                  type="email"
                  value={billing.contactEmails}
                  onChange={(e) => setBilling({ ...billing, contactEmails: e.target.value })}
                />
                <p className="text-[0.6rem] leading-relaxed text-muted-foreground">
                  Enter one or more email addresses, separated by commas.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1">
                  <Label className="text-xs font-medium">SPV Company VAT Number</Label>
                  <InfoTooltip content="The VAT number of the Special Purpose Vehicle company for this production.">
                    <span className="text-foreground hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-help">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </span>
                  </InfoTooltip>
                </div>
                <Input
                  className="placeholder:text-xs"
                  placeholder="SPV Company VAT Number"
                  value={billing.spvVatNumber}
                  onChange={(e) => setBilling({ ...billing, spvVatNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="h-px bg-border/40" />

            <div className="flex justify-between items-center">
              <Label className="text-xs text-muted-foreground">
                Billing address is same as SPV company?
              </Label>
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                spacing={0}
                value={billing.sameAsSpv}
                onValueChange={(val) => val && setBilling({ ...billing, sameAsSpv: val })}
              >
                <ToggleGroupItem value="yes" className="text-[0.6rem] px-2.5">YES</ToggleGroupItem>
                <ToggleGroupItem value="no" className="text-[0.6rem] px-2.5">NO</ToggleGroupItem>
              </ToggleGroup>
            </div>

            {billing.sameAsSpv === "no" && (
              <>
                <div className="h-px bg-border/40" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium">Billing Address Line 1</Label>
                    <Input
                      className="placeholder:text-xs"
                      placeholder="Billing Address Line 1"
                      value={billing.addr1}
                      onChange={(e) => setBilling({ ...billing, addr1: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium">Billing Address Line 2</Label>
                    <Input
                      className="placeholder:text-xs"
                      placeholder="Billing Address Line 2"
                      value={billing.addr2}
                      onChange={(e) => setBilling({ ...billing, addr2: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium">City</Label>
                    <Input
                      className="placeholder:text-xs"
                      placeholder="City"
                      value={billing.city}
                      onChange={(e) => setBilling({ ...billing, city: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium">Postcode</Label>
                    <Input
                      className="placeholder:text-xs"
                      placeholder="Postcode"
                      value={billing.postcode}
                      onChange={(e) => setBilling({ ...billing, postcode: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 lg:col-span-2">
                    <Label className="text-xs font-medium">Country</Label>
                    <SelectMenu
                      label="Select country"
                      selected={billing.country}
                      onSelect={(v) => setBilling({ ...billing, country: v })}
                      items={COUNTRIES.map((c) => ({ label: c, value: c }))}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </SettingsSection>
      </motion.div>
    </>
  );
}

export default ContactsSettings;