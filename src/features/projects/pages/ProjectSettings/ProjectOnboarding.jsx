// ProjectOnboarding.jsx
import { useState } from 'react';
import { Info, Plus, Eye, Download, Trash2, Minus, FileText,Lock } from 'lucide-react';
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { Switch } from "@/shared/components/ui/switch";
import EditableCheckboxField from "../../../../shared/components/wrappers/EditableCheckboxField";
import CardWrapper from "../../../../shared/components/wrappers/CardWrapper";
import { PageHeader } from "../../../../shared/components/PageHeader";
import SearchBar from "../../../../shared/components/SearchBar";

// Button Toggle Component
const ButtonToggleGroup = ({ label, options, selected, onChange, showInfo = false }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">{label}</Label>
        {showInfo && (
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Specify if an end date is required for offers</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="flex gap-2 flex-wrap">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-all ${
              selected === option.value
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const ProjectOnboarding = () => {
  const [formData, setFormData] = useState({
    offerEndDate: 'Optional',
    shareStatusDetermination: true,
    taxStatusHandling: 'Accounts approver required for self-employed or loan out',
    taxStatusQueryEmail: '',
    offerApproval: 'Production > Accounts',
    noticePeriod: 7,
    noticeEmailWording: `Dear [Loan Out Company Name] / [Crew member name],

(Original notice):

On behalf of Mirage Pictures Limited, I hereby confirm that your last day of engagement on Werwulf will be [finish date].

(Revised notice):

Further to your notice dated [date of previous notice], I hereby confirm that your revised last day of engagement on Werwulf will be [revised finish date].

Many thanks for your hard work on the production.`,
    pennyContracts: 3,
    crewSearchQuery: '',
    departmentFilter: 'All Departments',
    contractTemplates: {
      weekly: {
        standardCrew: { paye: false, selfEmployed: false, scheduleD: false, loanOut: false },
        dailyDayPlayer: { paye: false, selfEmployed: false, scheduleD: false, loanOut: false },
        construction: { paye: false, selfEmployed: false, scheduleD: false, loanOut: false },
        electrical: { paye: false, selfEmployed: false, scheduleD: false, loanOut: false },
        hod: { paye: false, selfEmployed: false, scheduleD: false, loanOut: false },
        rigging: { paye: false, selfEmployed: false, scheduleD: false, loanOut: false },
        transport: { paye: false, selfEmployed: false, scheduleD: false, loanOut: false }
      },
      daily: {
        standardCrew: { paye: false, selfEmployed: false, scheduleD: false, loanOut: false },
        dailyDayPlayer: { paye: false, selfEmployed: false, scheduleD: false, loanOut: false },
        construction: { paye: false, selfEmployed: false, scheduleD: false, loanOut: false },
        electrical: { paye: false, selfEmployed: false, scheduleD: false, loanOut: false },
        hod: { paye: false, selfEmployed: false, scheduleD: false, loanOut: false },
        rigging: { paye: false, selfEmployed: false, scheduleD: false, loanOut: false },
        transport: { paye: false, selfEmployed: false, scheduleD: false, loanOut: false }
      }
    },
    contractualTerms: {
      boxRental: false,
      mobileAllowance: false,
      statusDeterminationStatement: false,
      equipmentRental: false,
      dealMemo: false,
      softwareAllowance: false,
      livingAllowance: false,
      computerAllowance: false,
      vehicleAllowance: false,
      startForm: false
    },
    forms: {
      childProtectionDeclaration: false,
      policyAcknowledgement: false,
      ndaConfidentiality: false,
      driverDeclaration: false,
      conflictOfInterest: false
    },
    currentTemplates: {
      contracts: [
        { id: 1, name: 'BECTU DEAL MEMO' },
        { id: 2, name: 'BECTU DEAL MEMO PAYE' },
        { id: 3, name: 'CREW START FORM' },
        { id: 4, name: 'DEAL MEMO LOAN OUT' },
        { id: 5, name: 'DEAL MEMO PAYE' },
        { id: 6, name: 'DEAL MEMO SCHEDULE D' },
        { id: 7, name: 'SENIOR AGREEMENT LOAN OUT' },
        { id: 8, name: 'SENIOR AGREEMENT PAYE' },
        { id: 9, name: 'SENIOR AGREEMENT SELF-EMPLOYED' },
        { id: 10, name: 'STATUS DETERMINATION', deletable: true },
        { id: 11, name: 'TRANSPORT LOAN OUT' },
        { id: 12, name: 'TRANSPORT PAYE' },
        { id: 13, name: 'TRANSPORT SELF-EMPLOYED' }
      ],
      forms: [
        { id: 14, name: 'COMPUTER POLICY', deletable: true },
        { id: 15, name: 'CREW INFORMATION', deletable: true },
        { id: 16, name: 'POLICY ACKNOWLEDGEMENT', deletable: true }
      ],
      information: [
        { id: 17, name: 'MOBILE PHONE USE POLICY' },
        { id: 18, name: 'PRIVACY AND PROCEDURE BOOKLET' }
      ]
    }
  });

  const [crewMembers] = useState([
    { id: 1, name: 'Sarah Johnson', role: 'Director of Photography', department: 'Camera', contractType: 'Weekly', status: 'Standard' },
    { id: 2, name: 'Michael Chen', role: '1st AC', department: 'Camera', contractType: 'Weekly', status: 'Penny Contract' },
    { id: 3, name: 'Emily Rodriguez', role: 'Sound Mixer', department: 'Sound', contractType: 'Weekly', status: 'Penny Contract' },
    { id: 4, name: 'James Wilson', role: 'Key Grip', department: 'Grip', contractType: 'Daily', status: 'Standard' },
    { id: 5, name: 'Lisa Anderson', role: 'Gaffer', department: 'Electric', contractType: 'Weekly', status: 'Standard' },
    { id: 6, name: 'David Martinez', role: 'Production Designer', department: 'Art', contractType: 'Weekly', status: 'Penny Contract' },
    { id: 7, name: 'Jennifer Lee', role: 'Costume Designer', department: 'Costume', contractType: 'Weekly', status: 'Standard' },
    { id: 8, name: 'Robert Taylor', role: '2nd AC', department: 'Camera', contractType: 'Daily', status: 'Standard' }
  ]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-4">
      {/* Heading */}
      <div className="flex items-center justify-between bg-background border rounded-lg p-4 shadow-sm">
        <h2 className="text-base font-semibold">Onboarding</h2>
      </div>

      {/* Offer handling and Notice in 5:7 ratio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Offer handling */}
        <div className="lg:col-span-5">
        <CardWrapper 
          title="Offer handling" 
          variant="default"
          showLabel={true}
        >
          <div className="space-y-3 -mt-2.5 min-h-80">
            <div>
              <ButtonToggleGroup
                label="Offer end date"
                options={[
                  { value: 'Optional', label: 'Optional' },
                  { value: 'Mandatory', label: 'Mandatory' }
                ]}
                selected={formData.offerEndDate}
                onChange={(val) => updateField('offerEndDate', val)}
                showInfo={true}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <Label className="text-sm">Tax status handling</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Select how tax status should be handled</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select value={formData.taxStatusHandling} onValueChange={(val) => updateField('taxStatusHandling', val)}>
                  <SelectTrigger className="w-full h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Accounts approver required for self-employed or loan out">
                      Accounts approver required
                    </SelectItem>
                    <SelectItem value="No approval required">No approval required</SelectItem>
                    <SelectItem value="Approval required for all">Approval required</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="tax-query-email" className="text-sm">Tax status query email</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Email address for tax status queries</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="tax-query-email"
                  type="email"
                  value={formData.taxStatusQueryEmail}
                  onChange={(e) => updateField('taxStatusQueryEmail', e.target.value)}
                  placeholder="email@example.com"
                  className="w-full h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <Label className="text-sm">Offer approval</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Define the approval workflow</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select value={formData.offerApproval} onValueChange={(val) => updateField('offerApproval', val)}>
                <SelectTrigger className="w-full h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Production > Accounts">Production &gt; Accounts</SelectItem>
                  <SelectItem value="Accounts only">Accounts only</SelectItem>
                  <SelectItem value="Production only">Production only</SelectItem>
                  <SelectItem value="No approval required">No approval required</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 w-full border-t border-border pt-3">
              <div className="flex items-center gap-2 mb-1">
                <Label className="text-sm">Share status determination with crew members?</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Enable to share tax status determination information</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateField('shareStatusDetermination', true)}
                  className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                    formData.shareStatusDetermination === true
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => updateField('shareStatusDetermination', false)}
                  className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                    formData.shareStatusDetermination === false
                      ? 'bg-gray-100 text-gray-700 border-gray-300'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </CardWrapper>
        </div>

        {/* Notice */}
        <div className="lg:col-span-7">
        <CardWrapper 
          title="Notice" 
          variant="default"
          showLabel={true}
        >
          <div className="space-y-4 -mt-2.5 min-h-80 flex flex-col">
            <div className="space-y-1 flex flex-col flex-grow">
              <div className="flex items-center justify-between mb-1">
                <Label className="text-sm">Notice email wording</Label>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Notice period</Label>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 bg-purple-100 border-purple-300 hover:bg-purple-200 text-purple-700"
                    onClick={() => updateField('noticePeriod', Math.max(0, formData.noticePeriod - 1))}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    value={formData.noticePeriod}
                    onChange={(e) => updateField('noticePeriod', Number(e.target.value))}
                    className="text-center h-7 w-14 text-xs"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 bg-purple-100 border-purple-300 hover:bg-purple-200 text-purple-700"
                    onClick={() => updateField('noticePeriod', formData.noticePeriod + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <span className="text-xs text-muted-foreground ml-1">days</span>
                </div>
              </div>
              <Textarea
                value={formData.noticeEmailWording}
                onChange={(e) => updateField('noticeEmailWording', e.target.value)}
                rows={3}
                className="w-full resize-none font-mono text-xs flex-grow"
              />
            </div>
          </div>
        </CardWrapper>
        </div>
      </div>

      {/* Penny Contract Settings */}
      <CardWrapper 
        title="Penny Contract Settings" 
        variant="default"
        showLabel={true}
        actions={
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            <span>{formData.pennyContracts} Penny Contracts</span>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <strong>What is a Penny Contract?</strong>
                <p className="mt-1">
                  Penny Contracts protect sensitive rate information from department visibility.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Rate Visibility Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-xs font-semibold uppercase">Role</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold uppercase">Standard</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold uppercase">Penny</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { role: 'Crew Member (Self)', standard: true, penny: true },
                    { role: 'HOD (Head of Department)', standard: true, penny: false },
                    { role: 'Department Members', standard: true, penny: false },
                    { role: 'Production', standard: true, penny: true },
                    { role: 'Finance', standard: true, penny: true },
                    { role: 'Payroll', standard: true, penny: true }
                  ].map((item, idx) => (
                    <tr key={idx} className="border-b border-border">
                      <td className="py-2 px-3 text-sm">{item.role}</td>
                      <td className="py-2 px-3 text-center">
                        <Eye className="w-4 h-4 text-green-500 mx-auto" />
                      </td>
                      <td className="py-2 px-3 text-center">
                        {item.penny ? (
                          <Eye className="w-4 h-4 text-green-500 mx-auto" />
                        ) : (
                          <div className="flex items-center justify-center gap-1 text-red-500">
                            <Eye className="w-4 h-4" />
                            <span className="text-base">⃠</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardWrapper>

      {/* Required templates */}
      <CardWrapper 
        title="Required templates" 
        variant="default"
        showLabel={true}
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-3">Contracts</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 w-32"></th>
                    <th colSpan="4" className="text-center py-2 px-2 text-xs font-semibold uppercase border-b border-border">Weekly</th>
                    <th colSpan="4" className="text-center py-2 px-2 text-xs font-semibold uppercase border-b border-border">Daily</th>
                  </tr>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-1.5 px-2"></th>
                    <th className="text-center py-1.5 px-2">PAYE</th>
                    <th className="text-center py-1.5 px-2">Self-emp</th>
                    <th className="text-center py-1.5 px-2">Sch D</th>
                    <th className="text-center py-1.5 px-2">Loan</th>
                    <th className="text-center py-1.5 px-2">PAYE</th>
                    <th className="text-center py-1.5 px-2">Self-emp</th>
                    <th className="text-center py-1.5 px-2">Sch D</th>
                    <th className="text-center py-1.5 px-2">Loan</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(formData.contractTemplates.weekly).map((category) => (
                    <tr key={category} className="border-b border-border">
                      <td className="py-2 px-2 text-xs capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</td>
                      {['paye', 'selfEmployed', 'scheduleD', 'loanOut'].map((type) => (
                        <td key={`weekly-${type}`} className="py-2 px-2 text-center">
                          <input
                            type="checkbox"
                            checked={formData.contractTemplates.weekly[category][type]}
                            onChange={(e) => {
                              const newTemplates = { ...formData.contractTemplates };
                              newTemplates.weekly[category][type] = e.target.checked;
                              updateField('contractTemplates', newTemplates);
                            }}
                            className="w-4 h-4 text-purple-600 rounded"
                          />
                        </td>
                      ))}
                      {['paye', 'selfEmployed', 'scheduleD', 'loanOut'].map((type) => (
                        <td key={`daily-${type}`} className="py-2 px-2 text-center">
                          <input
                            type="checkbox"
                            checked={formData.contractTemplates.daily[category][type]}
                            onChange={(e) => {
                              const newTemplates = { ...formData.contractTemplates };
                              newTemplates.daily[category][type] = e.target.checked;
                              updateField('contractTemplates', newTemplates);
                            }}
                            className="w-4 h-4 text-purple-600 rounded"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Contractual terms</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
              {Object.keys(formData.contractualTerms).map((term) => (
                <EditableCheckboxField
                  key={term}
                  label={term.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                  checked={formData.contractualTerms[term]}
                  onChange={(val) => updateNestedField('contractualTerms', term, val)}
                  isEditing={true}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Forms</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
              {Object.keys(formData.forms).map((form) => (
                <EditableCheckboxField
                  key={form}
                  label={form.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                  checked={formData.forms[form]}
                  onChange={(val) => updateNestedField('forms', form, val)}
                  isEditing={true}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Custom forms</h3>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add custom form
            </Button>
          </div>

          <div className="pt-2">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Save required templates
            </Button>
          </div>
        </div>
      </CardWrapper>

      {/* Current templates - TWO COLUMN LAYOUT */}
      <CardWrapper 
        title="Current templates" 
        icon={FileText}
        variant="default"
        showLabel={true}
        description={
          <span>
            To add or remove templates,{' '}
            <a href="#" className="text-purple-600 hover:text-purple-800 underline">contact Team Engine</a>
          </span>
        }
      >
        <div className="space-y-4">
          {/* CONTRACTS */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">CONTRACTS</h3>
            <div className="grid grid-cols-2 gap-2">
              {formData.currentTemplates.contracts.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between py-2 px-3 bg-background border border-border rounded-lg hover:bg-muted/50 transition-all"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{template.name}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Eye className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Download className="w-4 h-4 text-blue-600" />
                    </Button>
                    {template.deletable && (
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FORMS */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">FORMS</h3>
            <div className="grid grid-cols-2 gap-2">
              {formData.currentTemplates.forms.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between py-2 px-3 bg-background border border-border rounded-lg hover:bg-muted/50 transition-all"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{template.name}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {template.deletable && (
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INFORMATION */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">INFORMATION</h3>
            <div className="grid grid-cols-2 gap-2">
              {formData.currentTemplates.information.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between py-2 px-3 bg-background border border-border rounded-lg hover:bg-muted/50 transition-all"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{template.name}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Eye className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Download className="w-4 h-4 text-blue-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardWrapper>
    </div>
  );
};

export default ProjectOnboarding;