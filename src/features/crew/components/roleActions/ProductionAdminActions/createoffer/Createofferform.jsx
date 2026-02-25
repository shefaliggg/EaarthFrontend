import { useState } from "react";
import { Card, CardContent } from "../../../../../../shared/components/ui/card";
import { Button } from "../../../../../../shared/components/ui/button";
import { Input } from "../../../../../../shared/components/ui/input";
import { Label } from "../../../../../../shared/components/ui/label";
import { Checkbox } from "../../../../../../shared/components/ui/checkbox";
import { Badge } from "../../../../../../shared/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../../shared/components/ui/tabs";
import { Plus, Trash2, User, Briefcase, DollarSign } from "lucide-react";

import { SectionHeader, FormField, SelectField, SliderCurrencyInput } from "./Ui";
import ContractsTab from "./Contractstab";
import AllowancesSection from "./Allowancessection";
import AdditionalNotesSection from "./Additionalnotessection";

import {
  DEPARTMENTS, STATUS_REASONS, CURRENCIES, SPECIAL_DAY_TYPES,
  cn, createDefaultRole,
} from "./Constants";

// Inner tab definitions for each role
const INNER_TABS = [
  { key: "details",    label: "Role Details" },
  { key: "contracts",  label: "Contracts" },
  { key: "allowances", label: "Allowances" },
];

/**
 * CreateOfferForm
 *
 * Contains all sections of the offer form:
 *   - Recipient
 *   - Tax Status
 *   - Roles & Rates (with inner tabs: Details / Contracts / Allowances per role)
 *   - Additional Notes
 *
 * Props:
 *   formData          {object}    top-level offer state
 *   setFormData       {function}  setter
 *   roles             {array}     array of role objects
 *   setRoles          {function}  setter
 *   expandedSections  {object}    { recipient, taxStatus, roles, notes }
 *   toggleSection     {function}  (key) => void
 */
export default function CreateOfferForm({
  formData,
  setFormData,
  roles,
  setRoles,
  expandedSections,
  toggleSection,
}) {
  const [activeRoleTab, setActiveRoleTab] = useState(roles[0].id);
  const [roleInnerTab, setRoleInnerTab] = useState({});

  const getInnerTab = (id) => roleInnerTab[id] || "details";
  const setInnerTab = (id, tab) => setRoleInnerTab((p) => ({ ...p, [id]: tab }));

  // ── Role helpers ──────────────────────────────────────────────────────────

  const addRole = () => {
    const r = createDefaultRole(roles.length);
    setRoles([...roles, r]);
    setActiveRoleTab(r.id);
  };

  const removeRole = (id) => {
    if (roles.length <= 1) return;
    const next = roles.filter((r) => r.id !== id);
    if (activeRoleTab === id) setActiveRoleTab(next[0].id);
    setRoles(next);
  };

  const updateRole = (id, updates) =>
    setRoles(roles.map((r) => (r.id === id ? { ...r, ...updates } : r)));

  const updateRoleAllowances = (id, updates) =>
    setRoles(roles.map((r) =>
      r.id === id ? { ...r, allowances: { ...r.allowances, ...updates } } : r
    ));

  const updateSpecialDayRate = (roleId, type, amount) =>
    setRoles(roles.map((r) =>
      r.id === roleId
        ? { ...r, specialDayRates: r.specialDayRates.map((d) => d.type === type ? { ...d, amount } : d) }
        : r
    ));

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">

      {/* ── Recipient ── */}
      <Card className="border-0 shadow-sm py-0 overflow-hidden">
        <SectionHeader
          title="Recipient" icon={User}
          section="recipient" isOpen={expandedSections.recipient}
          onToggle={toggleSection}
        />
        {expandedSections.recipient && (
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField label="Full Name" required>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value.toUpperCase() })}
                  placeholder="ENTER FULL NAME" className="uppercase"
                />
              </FormField>
              <FormField label="Email" required tooltip="Preferred email for engine account">
                <Input
                  type="email" value={formData.emailAddress}
                  onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value.toLowerCase() })}
                  placeholder="email@example.com"
                />
              </FormField>
              <FormField label="Mobile Number">
                <Input
                  type="tel" value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  placeholder="+44 7XXX XXXXXX"
                />
              </FormField>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="isViaAgent" checked={formData.isViaAgent}
                onCheckedChange={(v) => setFormData({ ...formData, isViaAgent: v })}
              />
              <Label htmlFor="isViaAgent" className="text-sm font-medium cursor-pointer">
                Recipient is represented via an agent?
              </Label>
            </div>

            {formData.isViaAgent && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                <FormField label="Agent Name">
                  <Input
                    value={formData.agentName}
                    onChange={(e) => setFormData({ ...formData, agentName: e.target.value.toUpperCase() })}
                    placeholder="AGENT'S FULL NAME" className="uppercase"
                  />
                </FormField>
                <FormField label="Agent Email Address">
                  <Input
                    type="email" value={formData.agentEmailAddress}
                    onChange={(e) => setFormData({ ...formData, agentEmailAddress: e.target.value.toLowerCase() })}
                    placeholder="agent@example.com"
                  />
                </FormField>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* ── Tax Status ── */}
      <Card className="border-0 py-0 shadow-sm overflow-hidden">
        <SectionHeader
          title="Tax Status" icon={Briefcase}
          section="taxStatus" isOpen={expandedSections.taxStatus}
          onToggle={toggleSection}
        />
        {expandedSections.taxStatus && (
          <CardContent className="p-4 space-y-4">
            <FormField label="Allow as Self-Employed or Loan Out?">
              <div className="flex gap-6 pt-2">
                {["YES", "NO"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio" name="selfEmployed" value={opt}
                      checked={formData.allowAsSelfEmployedOrLoanOut === opt}
                      onChange={(e) => setFormData({ ...formData, allowAsSelfEmployedOrLoanOut: e.target.value })}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm font-medium">{opt}</span>
                  </label>
                ))}
              </div>
            </FormField>

            {formData.allowAsSelfEmployedOrLoanOut === "YES" && (
              <FormField label="Status Determination Reason">
                <SelectField
                  value={formData.statusDeterminationReason}
                  onChange={(v) => setFormData({ ...formData, statusDeterminationReason: v })}
                  options={STATUS_REASONS}
                />
              </FormField>
            )}

            {formData.statusDeterminationReason === "OTHER" && (
              <FormField label="Please Specify Other Reason">
                <Input
                  value={formData.otherStatusDeterminationReason}
                  onChange={(e) => setFormData({ ...formData, otherStatusDeterminationReason: e.target.value.toUpperCase() })}
                  placeholder="ENTER REASON" className="uppercase"
                />
              </FormField>
            )}

            <FormField label="Working in the UK?" required>
              <div className="flex gap-6 pt-2">
                {["YES", "NEVER"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio" name="workingInUK" value={opt}
                      checked={formData.isLivingInUk === (opt === "YES")}
                      onChange={() => setFormData({ ...formData, isLivingInUk: opt === "YES" })}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm font-medium">{opt}</span>
                  </label>
                ))}
              </div>
            </FormField>
          </CardContent>
        )}
      </Card>

      {/* ── Roles & Rates ── */}
      <Card className="border-0 py-0 shadow-sm overflow-hidden">
        <SectionHeader
          title="Roles & Rates" icon={DollarSign}
          section="roles" isOpen={expandedSections.roles}
          onToggle={toggleSection}
        />
        {expandedSections.roles && (
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-4">Configure one or more roles for this offer</p>

            <Tabs value={activeRoleTab} onValueChange={setActiveRoleTab}>
              {/* Role tabs + Add button */}
              <div className="flex items-center gap-2 mb-4">
                <TabsList className="h-auto p-0 bg-transparent gap-1">
                  {roles.map((role) => (
                    <TabsTrigger key={role.id} value={role.id} className="gap-2 data-[state=active]:bg-muted">
                      {role.isPrimaryRole && (
                        <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary px-2 py-0">
                          PRIMARY
                        </Badge>
                      )}
                      <span className="text-sm">{role.roleName}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                <Button variant="outline" size="sm" onClick={addRole} className="gap-1.5 ml-auto">
                  <Plus className="w-4 h-4" /> Add Role
                </Button>
              </div>

              {roles.map((role) => (
                <TabsContent key={role.id} value={role.id} className="space-y-4">
                  {roles.length > 1 && !role.isPrimaryRole && (
                    <div className="flex justify-end">
                      <Button variant="ghost" size="sm" className="text-destructive gap-2" onClick={() => removeRole(role.id)}>
                        <Trash2 className="w-4 h-4" /> Remove This Role
                      </Button>
                    </div>
                  )}

                  {/* Inner tabs: Role Details / Contracts / Allowances */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="flex border-b bg-muted/30">
                      {INNER_TABS.map(({ key, label }) => (
                        <button
                          key={key}
                          onClick={() => setInnerTab(role.id, key)}
                          className={cn(
                            "px-5 py-2.5 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors",
                            getInnerTab(role.id) === key
                              ? "border-primary text-primary bg-primary/5"
                              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <div className="p-4">

                      {/* ── Role Details ── */}
                      {getInnerTab(role.id) === "details" && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormField label="Unit" required>
                              <Input
                                value={role.unit}
                                onChange={(e) => updateRole(role.id, { unit: e.target.value.toUpperCase() })}
                                placeholder="E.G., MAIN, SECOND UNIT" className="uppercase"
                              />
                            </FormField>
                            <FormField label="Department" required>
                              <SelectField
                                value={role.department}
                                onChange={(v) => updateRole(role.id, { department: v })}
                                options={[{ value: "", label: "SELECT DEPARTMENT..." }, ...DEPARTMENTS.map((d) => ({ value: d, label: d }))]}
                              />
                            </FormField>
                            <FormField label="Sub-Department">
                              <Input
                                value={role.subDepartment}
                                onChange={(e) => updateRole(role.id, { subDepartment: e.target.value.toUpperCase() })}
                                placeholder="OPTIONAL" className="uppercase"
                              />
                            </FormField>
                          </div>

                          <FormField label="Job Title" required>
                            <Input
                              value={role.jobTitle}
                              onChange={(e) => updateRole(role.id, { jobTitle: e.target.value.toUpperCase() })}
                              placeholder="TYPE TO SEARCH..." className="uppercase"
                            />
                          </FormField>

                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                id={`searchAll-${role.id}`} checked={role.searchAllDepartments}
                                onCheckedChange={(v) => updateRole(role.id, { searchAllDepartments: v })}
                              />
                              <Label htmlFor={`searchAll-${role.id}`} className="text-xs cursor-pointer font-medium uppercase">
                                Search job titles from all departments?
                              </Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`ownTitle-${role.id}`} checked={role.createOwnJobTitle}
                                onCheckedChange={(v) => updateRole(role.id, { createOwnJobTitle: v })}
                              />
                              <Label htmlFor={`ownTitle-${role.id}`} className="text-xs cursor-pointer font-medium uppercase">
                                Create your own job title (only available to this project)
                              </Label>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField label="Job Title Suffix">
                              <Input
                                value={role.jobTitleSuffix}
                                onChange={(e) => updateRole(role.id, { jobTitleSuffix: e.target.value.toUpperCase() })}
                                placeholder="E.G., 'TO CAST #1'" className="uppercase"
                              />
                            </FormField>
                            <FormField label="Regular Site of Work (On Shoot Days)" required>
                              <Input
                                value={role.regularSiteOfWork}
                                onChange={(e) => updateRole(role.id, { regularSiteOfWork: e.target.value.toUpperCase() })}
                                placeholder="E.G., VARIOUS LOCATIONS" className="uppercase"
                              />
                            </FormField>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormField label="Start Date" required>
                              <Input type="date" value={role.startDate}
                                onChange={(e) => updateRole(role.id, { startDate: e.target.value })} />
                            </FormField>
                            <FormField label="End Date">
                              <Input type="date" value={role.endDate}
                                onChange={(e) => updateRole(role.id, { endDate: e.target.value })} />
                            </FormField>
                            <FormField label="Working Week">
                              <SelectField value={role.workingWeek}
                                onChange={(v) => updateRole(role.id, { workingWeek: v })}
                                options={[
                                  { value: "", label: "SELECT..." },
                                  { value: "5_DAYS", label: "5 DAYS" },
                                  { value: "5.5_DAYS", label: "5.5 DAYS" },
                                  { value: "5_6_DAYS", label: "5/6 DAYS" },
                                  { value: "6_DAYS", label: "6 DAYS" },
                                ]}
                              />
                            </FormField>
                          </div>

                          {/* Fee sliders */}
                          <div className="border rounded-lg p-4 bg-primary/5 space-y-5">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-5 h-5 text-primary" />
                              <h4 className="text-sm font-bold text-primary uppercase">Fee</h4>
                            </div>
                            <FormField label="Currency" required>
                              <SelectField
                                value={role.currency}
                                onChange={(v) => updateRole(role.id, { currency: v })}
                                options={CURRENCIES} className="w-48"
                              />
                            </FormField>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <SliderCurrencyInput
                                label="Fee Per Day Including Holiday"
                                value={role.feePerDay}
                                onChange={(v) => updateRole(role.id, { feePerDay: v })}
                                currency={role.currency} min={0} max={5000} step={50} required
                              />
                              <SliderCurrencyInput
                                label="Fee Per Week Including Holiday"
                                value={role.feePerWeek}
                                onChange={(v) => updateRole(role.id, { feePerWeek: v })}
                                currency={role.currency} min={0} max={25000} step={250}
                              />
                            </div>

                            {/* Special Day Rates */}
                            <div className="pt-4 border-t space-y-3">
                              <h5 className="text-xs font-bold text-primary uppercase">Special Day Rates</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {SPECIAL_DAY_TYPES.map((day) => {
                                  const dr = role.specialDayRates.find((d) => d.type === day.key);
                                  return (
                                    <SliderCurrencyInput
                                      key={day.key} label={day.label}
                                      value={dr?.amount || ""}
                                      onChange={(v) => updateSpecialDayRate(role.id, day.key, v)}
                                      currency={role.currency} min={0} max={5000} step={50}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ── Contracts ── */}
                      {getInnerTab(role.id) === "contracts" && (
                        <ContractsTab
                          role={role}
                          updateRole={updateRole}
                          formData={formData}
                          setFormData={setFormData}
                        />
                      )}

                      {/* ── Allowances ── */}
                      {getInnerTab(role.id) === "allowances" && (
                        <AllowancesSection
                          allowances={role.allowances}
                          currency={role.currency}
                          updateAllowances={(updates) => updateRoleAllowances(role.id, updates)}
                        />
                      )}

                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        )}
      </Card>

      {/* ── Additional Notes ── */}
      <AdditionalNotesSection
        formData={formData}
        setFormData={setFormData}
        isOpen={expandedSections.notes}
        onToggle={toggleSection}
      />
    </div>
  );
}