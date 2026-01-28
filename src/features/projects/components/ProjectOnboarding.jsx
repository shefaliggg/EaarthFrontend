// ProjectOnboarding.jsx
import { useState } from 'react';
import { Info, Plus, Eye, Download, Trash2 } from 'lucide-react';
import EditableTextDataField from "../../../shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "../../../shared/components/wrappers/EditableSelectField";
import EditableCheckboxField from "../../../shared/components/wrappers/EditableCheckboxField";
import CardWrapper from "../../../shared/components/wrappers/CardWrapper";

// Button Toggle Component
const ButtonToggleGroup = ({ label, options, selected, onChange, showInfo = false }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {showInfo && <Info className="w-4 h-4 text-gray-400" />}
      </div>
      <div className="flex gap-2 flex-wrap">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
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

// Toggle Switch Component
const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-purple-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

// Number Input with Plus/Minus Buttons
const NumberInputWithControls = ({ label, value, onChange, unit = '' }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-purple-300 text-purple-600 hover:bg-purple-50 transition-all"
        >
          -
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center flex-1"
        />
        <button
          onClick={() => onChange(value + 1)}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-purple-300 text-purple-600 hover:bg-purple-50 transition-all"
        >
          +
        </button>
      </div>
      {unit && <p className="text-xs text-gray-500">{unit}</p>}
    </div>
  );
};

const ProjectOnboarding = () => {
  const [formData, setFormData] = useState({
    // Offer Settings
    offerEndDate: 'Optional',
    
    // Offer handling
    shareStatusDetermination: true,
    taxStatusHandling: 'Accounts approver required for self-employed or loan out',
    taxStatusQueryEmail: 'stuntysturant@icloud.com',
    offerApproval: 'Production > Accounts',
    
    // Notice
    noticePeriod: 7,
    noticeEmailWording: `Dear [Loan Out Company Name] / [Crew member name],

(Original notice):

On behalf of Mirage Pictures Limited, I hereby confirm that your last day of engagement on Werewolf will be [finish date].

(Revised notice):

Further to your notice dated [date of previous notice], I hereby confirm that your revised last day of engagement on Werewolf will be [revised finish date].

Many thanks for your hard work on the production.`,
    
    // Penny Contract Settings
    pennyContracts: 3,
    
    // Rate Visibility Matrix
    rateVisibility: {
      crewMemberSelf: { standard: true, penny: true },
      hodHeadOfDepartment: { standard: true, penny: false },
      departmentMembers: { standard: true, penny: false },
      production: { standard: true, penny: true },
      finance: { standard: true, penny: true },
      payroll: { standard: true, penny: true }
    },
    
    // Crew filter
    crewSearchQuery: '',
    departmentFilter: 'All Departments',
    
    // Required templates - Contracts
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
    
    // Contractual terms
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
    
    // Forms
    forms: {
      childProtectionDeclaration: false,
      policyAcknowledgement: false,
      ndaConfidentiality: false,
      driverDeclaration: false,
      conflictOfInterest: false
    },
    
    // Current templates
    currentTemplates: {
      contracts: [
        { id: 1, name: 'BECTU DEAL MEMO', type: 'contract' },
        { id: 2, name: 'BECTU DEAL MEMO PAYE', type: 'contract' },
        { id: 3, name: 'CREW START FORM', type: 'contract' },
        { id: 4, name: 'DEAL MEMO LOAN OUT', type: 'contract' },
        { id: 5, name: 'DEAL MEMO PAYE', type: 'contract' },
        { id: 6, name: 'DEAL MEMO SCHEDULE D', type: 'contract' },
        { id: 7, name: 'SENIOR AGREEMENT LOAN OUT', type: 'contract' },
        { id: 8, name: 'SENIOR AGREEMENT PAYE', type: 'contract' },
        { id: 9, name: 'SENIOR AGREEMENT SELF-EMPLOYED', type: 'contract' },
        { id: 10, name: 'STATUS DETERMINATION', type: 'contract', deletable: true },
        { id: 11, name: 'TRANSPORT LOAN OUT', type: 'contract' },
        { id: 12, name: 'TRANSPORT PAYE', type: 'contract' },
        { id: 13, name: 'TRANSPORT SELF-EMPLOYED', type: 'contract' }
      ],
      forms: [
        { id: 14, name: 'COMPUTER POLICY', type: 'form', deletable: true },
        { id: 15, name: 'CREW INFORMATION', type: 'form', deletable: true },
        { id: 16, name: 'POLICY ACKNOWLEDGEMENT', type: 'form', deletable: true }
      ],
      information: [
        { id: 17, name: 'MOBILE PHONE USE POLICY', type: 'info' },
        { id: 18, name: 'PRIVACY AND PROCEDURE BOOKLET', type: 'info' }
      ]
    }
  });

  const [crewMembers] = useState([
    { id: 1, name: 'Sarah Johnson', role: 'Director of Photography', department: 'Camera', contractType: 'Weekly', status: 'Standard', action: 'Enable Protection' },
    { id: 2, name: 'Michael Chen', role: '1st AC', department: 'Camera', contractType: 'Weekly', status: 'Penny Contract', action: 'Remove Protection' },
    { id: 3, name: 'Emily Rodriguez', role: 'Sound Mixer', department: 'Sound', contractType: 'Weekly', status: 'Penny Contract', action: 'Remove Protection' },
    { id: 4, name: 'James Wilson', role: 'Key Grip', department: 'Grip', contractType: 'Daily', status: 'Standard', action: 'Enable Protection' },
    { id: 5, name: 'Lisa Anderson', role: 'Gaffer', department: 'Electric', contractType: 'Weekly', status: 'Standard', action: 'Enable Protection' },
    { id: 6, name: 'David Martinez', role: 'Production Designer', department: 'Art', contractType: 'Weekly', status: 'Penny Contract', action: 'Remove Protection' },
    { id: 7, name: 'Jennifer Lee', role: 'Costume Designer', department: 'Costume', contractType: 'Weekly', status: 'Standard', action: 'Enable Protection' },
    { id: 8, name: 'Robert Taylor', role: '2nd AC', department: 'Camera', contractType: 'Daily', status: 'Standard', action: 'Enable Protection' }
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

  const offerEndDateOptions = [
    { value: 'Optional', label: 'Optional' },
    { value: 'Mandatory', label: 'Mandatory' }
  ];

  const taxStatusHandlingOptions = [
    { value: 'Accounts approver required for self-employed or loan out', label: 'Accounts approver required for self-employed or loan out' },
    { value: 'Other option 1', label: 'Other option 1' },
    { value: 'Other option 2', label: 'Other option 2' }
  ];

  const offerApprovalOptions = [
    { value: 'Production > Accounts', label: 'Production > Accounts' },
    { value: 'Accounts > Production', label: 'Accounts > Production' },
    { value: 'Direct approval', label: 'Direct approval' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Configure onboarding and offer handling settings</h1>
      </div>

      {/* Offer Settings */}
      <CardWrapper 
        title="Offer Settings" 
        variant="default"
        showLabel={true}
      >
        <ButtonToggleGroup
          label="Offer end date"
          options={offerEndDateOptions}
          selected={formData.offerEndDate}
          onChange={(val) => updateField('offerEndDate', val)}
          showInfo={true}
        />
      </CardWrapper>

      {/* Offer handling */}
      <CardWrapper 
        title="Offer handling" 
        variant="default"
        showLabel={true}
        description="How you'd like offers to be reviewed prior to sending to crew."
      >
        <div className="space-y-6">
          {/* Share status determination with crew members */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Share status determination with crew members?
              </label>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <ToggleSwitch
              checked={formData.shareStatusDetermination}
              onChange={(val) => updateField('shareStatusDetermination', val)}
            />
          </div>

          {/* Row with Tax status handling and Tax status query email */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Tax status handling</label>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              <EditableSelectField
                value={formData.taxStatusHandling}
                items={taxStatusHandlingOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                isEditing={true}
                onChange={(val) => updateField('taxStatusHandling', val)}
              />
              <p className="text-xs text-gray-500">
                Available options are based on your 'Share status determination with crew members?' selection.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Tax status query email</label>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="email"
                value={formData.taxStatusQueryEmail}
                onChange={(e) => updateField('taxStatusQueryEmail', e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="stuntysturant@icloud.com"
              />
            </div>
          </div>

          {/* Offer approval */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Offer approval</label>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <EditableSelectField
              value={formData.offerApproval}
              items={offerApprovalOptions.map(opt => ({ value: opt.value, label: opt.label }))}
              isEditing={true}
              onChange={(val) => updateField('offerApproval', val)}
            />
            <p className="text-xs text-gray-500">
              Available options are based on your 'Tax status handling' selection.
            </p>
          </div>
        </div>
      </CardWrapper>

      {/* Notice */}
      <CardWrapper 
        title="Notice" 
        variant="default"
        showLabel={true}
        description="Settings for 'Notice of termination of contract' emails."
      >
        <div className="space-y-6">
          <NumberInputWithControls
            label="Notice period"
            value={formData.noticePeriod}
            onChange={(val) => updateField('noticePeriod', val)}
            unit="In days."
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Notice email wording</label>
            <textarea
              value={formData.noticeEmailWording}
              onChange={(e) => updateField('noticeEmailWording', e.target.value)}
              className="w-full min-h-[200px] p-3 rounded-md border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-mono"
            />
          </div>
        </div>
      </CardWrapper>

      {/* Penny Contract Settings */}
      <CardWrapper 
        title="Penny Contract Settings" 
        variant="default"
        showLabel={true}
        description="Manage confidential rate visibility for sensitive crew contracts"
        icon="ShieldCheck"
        actions={
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            <span>{formData.pennyContracts}</span>
            <span>Penny Contracts</span>
          </div>
        }
      >
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <strong>What is a Penny Contract?</strong>
              <p className="mt-1">
                Penny Contracts protect sensitive rate information from department visibility. When enabled, HOD and department members cannot see the crew member's rates, but Production, Finance, and Payroll maintain full access for processing and approval.
              </p>
            </div>
          </div>
        </div>

        {/* Rate Visibility Matrix */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Rate Visibility Matrix</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Role</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Standard Contract</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Penny Contract</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-700">Crew Member (Self)</td>
                  <td className="py-3 px-4 text-center">
                    <Eye className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Eye className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-700">HOD (Head of Department)</td>
                  <td className="py-3 px-4 text-center">
                    <Eye className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-red-500">
                      <Eye className="w-5 h-5" />
                      <span className="text-lg">⃠</span>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-700">Department Members</td>
                  <td className="py-3 px-4 text-center">
                    <Eye className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-red-500">
                      <Eye className="w-5 h-5" />
                      <span className="text-lg">⃠</span>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-700">Production</td>
                  <td className="py-3 px-4 text-center">
                    <Eye className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Eye className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-700">Finance</td>
                  <td className="py-3 px-4 text-center">
                    <Eye className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Eye className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-gray-700">Payroll</td>
                  <td className="py-3 px-4 text-center">
                    <Eye className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Eye className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Crew List with Search and Filter */}
        <div className="mt-8 space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search crew by name or role..."
              value={formData.crewSearchQuery}
              onChange={(e) => updateField('crewSearchQuery', e.target.value)}
              className="flex-1 h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={formData.departmentFilter}
              onChange={(e) => updateField('departmentFilter', e.target.value)}
              className="h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option>All Departments</option>
              <option>Camera</option>
              <option>Sound</option>
              <option>Grip</option>
              <option>Electric</option>
              <option>Art</option>
              <option>Costume</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Crew Member</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Role</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Department</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Contract Type</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {crewMembers.map((crew) => (
                  <tr key={crew.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{crew.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{crew.role}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{crew.department}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{crew.contractType}</td>
                    <td className="py-3 px-4">
                      {crew.status === 'Standard' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Standard
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          🔒 Penny Contract
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                        {crew.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardWrapper>

      {/* Required templates */}
      <CardWrapper 
        title="Required templates" 
        variant="default"
        showLabel={true}
        description={
          <span>
            Which of the following documents will you need in Engine? To update your project templates,{' '}
            <a href="#" className="text-purple-600 hover:text-purple-800">please contact Team Engine</a>.
          </span>
        }
      >
        <div className="space-y-6">
          {/* Contracts Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Contracts</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500"></th>
                    <th colSpan="4" className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">Weekly</th>
                    <th colSpan="4" className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">Daily</th>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-500"></th>
                    <th className="text-center py-2 px-4 text-xs font-medium text-gray-500">PAYE</th>
                    <th className="text-center py-2 px-4 text-xs font-medium text-gray-500">Self-employed</th>
                    <th className="text-center py-2 px-4 text-xs font-medium text-gray-500">Schedule D</th>
                    <th className="text-center py-2 px-4 text-xs font-medium text-gray-500">Loan Out</th>
                    <th className="text-center py-2 px-4 text-xs font-medium text-gray-500">PAYE</th>
                    <th className="text-center py-2 px-4 text-xs font-medium text-gray-500">Self-employed</th>
                    <th className="text-center py-2 px-4 text-xs font-medium text-gray-500">Schedule D</th>
                    <th className="text-center py-2 px-4 text-xs font-medium text-gray-500">Loan Out</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(formData.contractTemplates.weekly).map((category) => (
                    <tr key={category} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-700 capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</td>
                      {['paye', 'selfEmployed', 'scheduleD', 'loanOut'].map((type) => (
                        <td key={`weekly-${type}`} className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={formData.contractTemplates.weekly[category][type]}
                            onChange={(e) => {
                              const newTemplates = { ...formData.contractTemplates };
                              newTemplates.weekly[category][type] = e.target.checked;
                              updateField('contractTemplates', newTemplates);
                            }}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                        </td>
                      ))}
                      {['paye', 'selfEmployed', 'scheduleD', 'loanOut'].map((type) => (
                        <td key={`daily-${type}`} className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={formData.contractTemplates.daily[category][type]}
                            onChange={(e) => {
                              const newTemplates = { ...formData.contractTemplates };
                              newTemplates.daily[category][type] = e.target.checked;
                              updateField('contractTemplates', newTemplates);
                            }}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contractual terms */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Contractual terms</h3>
            <div className="grid grid-cols-2 gap-4">
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

          {/* Forms */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Forms</h3>
            <div className="grid grid-cols-2 gap-4">
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

          {/* Custom forms */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Custom forms</h3>
            <button className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-all">
              <Plus className="w-4 h-4" />
              Add custom form
            </button>
          </div>

          {/* Save button */}
          <div className="pt-4">
            <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all">
              Save required templates
            </button>
          </div>
        </div>
      </CardWrapper>

      {/* Current templates */}
      <CardWrapper 
        title="Current templates" 
        variant="default"
        showLabel={true}
        description={
          <span>
            To add or remove templates,{' '}
            <a href="#" className="text-purple-600 hover:text-purple-800">please contact Team Engine</a>
          </span>
        }
      >
        <div className="space-y-8">
          {/* CONTRACTS */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">CONTRACTS</h3>
            <div className="space-y-2">
              {formData.currentTemplates.contracts.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between py-3 px-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">{template.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-md transition-all">
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-md transition-all">
                      <Download className="w-4 h-4 text-blue-600" />
                    </button>
                    {template.deletable && (
                      <button className="p-2 hover:bg-red-50 rounded-md transition-all">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FORMS */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">FORMS</h3>
            <div className="space-y-2">
              {formData.currentTemplates.forms.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between py-3 px-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">{template.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {template.deletable && (
                      <button className="p-2 hover:bg-red-50 rounded-md transition-all">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INFORMATION */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">INFORMATION</h3>
            <div className="space-y-2">
              {formData.currentTemplates.information.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between py-3 px-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">{template.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-md transition-all">
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-md transition-all">
                      <Download className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardWrapper>

      {/* Save Button */}
      <div className="flex justify-end pt-6">
        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProjectOnboarding;