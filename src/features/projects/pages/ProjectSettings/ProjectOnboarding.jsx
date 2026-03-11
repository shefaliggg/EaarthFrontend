// ProjectOnboarding.jsx
import { useState } from 'react';
import {
  Info, Plus, Eye, Minus, Clock,
  Pencil, ChevronUp, ChevronDown, Sparkles
} from 'lucide-react';

import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { Badge } from "@/shared/components/ui/badge";
import CardWrapper from "../../../../shared/components/wrappers/CardWrapper";


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

  const [activeTab, setActiveTab] = useState('general');
  const [bundleSubTab, setBundleSubTab] = useState('Standard Crew');

  const [formData, setFormData] = useState({
    offerEndDate: 'Optional',
    shareStatusDetermination: true,
    taxStatusHandling: 'Accounts approver required for self-employed or loan out',
    taxStatusQueryEmail: '',
    offerApproval: 'Production > Accounts',
    noticePeriod: 7,
    noticeEmailWording: `Dear [Loan Out Company Name] / [Crew member name],

(Original notice):

On behalf of Mirage Pictures Limited, I hereby confirm that your last day of engagement will be [finish date].

(Revised notice):

Further to your notice dated [date of previous notice], I hereby confirm that your revised last day of engagement will be [revised finish date].

Many thanks for your hard work on the production.`,
  });


  const crewCategories = [
    { name: 'Standard Crew' },
    { name: 'Senior / Buyout' },
    { name: 'Construction' },
    { name: 'Electrical' },
    { name: 'HOD' },
    { name: 'Rigging' },
    { name: 'Transport' }
  ];


  const contractTypes = [
    { label: 'Weekly - PAYE', value: 'weekly_paye', status: 'view' },
    { label: 'Weekly - Self-Employed', value: 'weekly_self_employed', status: 'pending' },
    { label: 'Weekly - Direct Hire', value: 'weekly_direct_hire', status: 'upload' },
    { label: 'Weekly - Loan Out', value: 'weekly_loan_out', status: 'view' },
    { label: 'Daily - PAYE', value: 'daily_paye', status: 'upload' },
    { label: 'Daily - Self-Employed', value: 'daily_self_employed', status: 'view' },
    { label: 'Daily - Direct Hire', value: 'daily_direct_hire', status: 'pending' },
    { label: 'Daily - Loan Out', value: 'daily_loan_out', status: 'upload' }
  ];

  const formGroups = [
    {
      name: 'Contractual Forms',
      forms: [
        { name: 'Box Rental', locked: true, isDefault: true, state: 'ready' },
        { name: 'Computer Allowance', locked: true, isDefault: true, state: 'ready' },
        { name: 'Crew Information Form', locked: true, isDefault: true, state: 'ready' },
        { name: 'Software Allowance', locked: false, isDefault: false, state: 'ready' },
        { name: 'Start Form', locked: true, isDefault: true, state: 'ready' }
      ]
    },
    {
      name: 'Standard Forms',
      forms: [
        { name: 'Child Protection Declaration', locked: false, isDefault: false, state: 'ready' },
        { name: 'Conflict of Interest', locked: false, isDefault: false, state: 'ready' },
        { name: 'Driver Declaration', locked: false, isDefault: false, state: 'ready' },
        { name: 'NDA / Confidentiality', locked: true, isDefault: true, state: 'ready' },
        { name: 'Policy Acknowledgement', locked: true, isDefault: true, state: 'ready' }
      ]
    },
    {
      name: 'Tax & Compliance',
      forms: [
        { name: 'W-4 (Federal)', locked: false, isDefault: false, state: 'upload' },
        { name: 'I-9', locked: false, isDefault: false, state: 'upload' },
        { name: 'State Tax Exemption', locked: false, isDefault: false, state: 'upload' },
        { name: 'Direct Deposit', locked: false, isDefault: false, state: 'ready' }
      ]
    },
    {
      name: 'Insurance & Legal',
      forms: [
        { name: 'Certificate of Insurance', locked: false, isDefault: false, state: 'ready' },
        { name: 'Child Support Notice', locked: false, isDefault: false, state: 'upload' },
        { name: 'Emergency Contact', locked: false, isDefault: false, state: 'ready' }
      ]
    },
    {
      name: 'Picture & More',
      forms: [
        { name: 'Disability Disclosure', locked: false, isDefault: false, state: 'ready' },
        { name: 'Picture ID Release', locked: false, isDefault: false, state: 'ready' }
      ]
    }
  ];

  const contractBundles = [
    {
      name: 'Weekly PAYE Standard Crew',
      code: 'WEEKLY PAYE',
      category: 'Standard Crew',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['PAYE Contract', 'Policy Acknowledgement', 'Crew Information Form', 'Start Form'],
      optional: ['P45 / P46']
    },
    {
      name: 'Weekly Self-Employed Standard Crew',
      code: 'WEEKLY SE',
      category: 'Standard Crew',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Self-Employed Contract', 'Self-Assessment Declaration', 'Certificate of Insurance'],
      optional: ['NDA / Confidentiality']
    },
    {
      name: 'Weekly Direct Hire Standard Crew',
      code: 'WEEKLY DH',
      category: 'Standard Crew',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Direct Hire Agreement', 'Policy Acknowledgement', 'Crew Information Form'],
      optional: ['Direct Deposit Form']
    },
    {
      name: 'Weekly Loan Out Standard Crew',
      code: 'WEEKLY LO',
      category: 'Standard Crew',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Loan Out Agreement', 'Certificate of Insurance', 'Company Details Form'],
      optional: ['NDA / Confidentiality']
    },
    {
      name: 'Daily PAYE Standard Crew',
      code: 'DAILY PAYE',
      category: 'Standard Crew',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['PAYE Contract', 'Policy Acknowledgement', 'Crew Information Form', 'Start Form'],
      optional: ['P45 / P46']
    },
    {
      name: 'Daily Self-Employed Standard Crew',
      code: 'DAILY SE',
      category: 'Standard Crew',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Self-Employed Contract', 'Self-Assessment Declaration', 'Certificate of Insurance'],
      optional: ['NDA / Confidentiality']
    },
    {
      name: 'Daily Direct Hire Standard Crew',
      code: 'DAILY DH',
      category: 'Standard Crew',
      status: 'Draft',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Direct Hire Agreement', 'Policy Acknowledgement', 'Crew Information Form'],
      optional: ['Direct Deposit Form']
    },
    {
      name: 'Daily Loan Out Standard Crew',
      code: 'DAILY LO',
      category: 'Standard Crew',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Loan Out Agreement', 'Certificate of Insurance', 'Company Details Form'],
      optional: ['NDA / Confidentiality']
    },
    {
      name: 'Weekly PAYE Senior / Buyout',
      code: 'WEEKLY PAYE',
      category: 'Senior / Buyout',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['PAYE Contract', 'Policy Acknowledgement', 'Crew Information Form', 'Start Form'],
      optional: ['P45 / P46']
    },
    {
      name: 'Weekly Self-Employed Senior / Buyout',
      code: 'WEEKLY SE',
      category: 'Senior / Buyout',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Self-Employed Contract', 'Self-Assessment Declaration', 'Certificate of Insurance'],
      optional: ['NDA / Confidentiality']
    },
    {
      name: 'Weekly Direct Hire Senior / Buyout',
      code: 'WEEKLY DH',
      category: 'Senior / Buyout',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Direct Hire Agreement', 'Policy Acknowledgement', 'Crew Information Form'],
      optional: ['Direct Deposit Form']
    },
    {
      name: 'Weekly Loan Out Senior / Buyout',
      code: 'WEEKLY LO',
      category: 'Senior / Buyout',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Loan Out Agreement', 'Certificate of Insurance', 'Company Details Form'],
      optional: ['NDA / Confidentiality']
    },
    {
      name: 'Daily PAYE Senior / Buyout',
      code: 'DAILY PAYE',
      category: 'Senior / Buyout',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['PAYE Contract', 'Policy Acknowledgement', 'Crew Information Form', 'Start Form'],
      optional: ['P45 / P46']
    },
    {
      name: 'Daily Self-Employed Senior / Buyout',
      code: 'DAILY SE',
      category: 'Senior / Buyout',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Self-Employed Contract', 'Self-Assessment Declaration', 'Certificate of Insurance'],
      optional: ['NDA / Confidentiality']
    },
    {
      name: 'Daily Direct Hire Senior / Buyout',
      code: 'DAILY DH',
      category: 'Senior / Buyout',
      status: 'Draft',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Direct Hire Agreement', 'Policy Acknowledgement', 'Crew Information Form'],
      optional: ['Direct Deposit Form']
    },
    {
      name: 'Daily Loan Out Senior / Buyout',
      code: 'DAILY LO',
      category: 'Senior / Buyout',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Loan Out Agreement', 'Certificate of Insurance', 'Company Details Form'],
      optional: ['NDA / Confidentiality']
    },
    {
      name: 'Weekly PAYE Construction',
      code: 'WEEKLY PAYE',
      category: 'Construction',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['PAYE Contract', 'Policy Acknowledgement', 'Crew Information Form', 'Start Form'],
      optional: ['P45 / P46']
    },
    {
      name: 'Weekly Self-Employed Construction',
      code: 'WEEKLY SE',
      category: 'Construction',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Self-Employed Contract', 'Self-Assessment Declaration', 'Certificate of Insurance'],
      optional: ['NDA / Confidentiality']
    },
    {
      name: 'Weekly Direct Hire Construction',
      code: 'WEEKLY DH',
      category: 'Construction',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Direct Hire Agreement', 'Policy Acknowledgement', 'Crew Information Form'],
      optional: ['Direct Deposit Form']
    },
    {
      name: 'Weekly Loan Out Construction',
      code: 'WEEKLY LO',
      category: 'Construction',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Loan Out Agreement', 'Certificate of Insurance', 'Company Details Form'],
      optional: ['NDA / Confidentiality']
    },
    {
      name: 'Daily PAYE Construction',
      code: 'DAILY PAYE',
      category: 'Construction',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['PAYE Contract', 'Policy Acknowledgement', 'Crew Information Form', 'Start Form'],
      optional: ['P45 / P46']
    },
    {
      name: 'Daily Self-Employed Construction',
      code: 'DAILY SE',
      category: 'Construction',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Self-Employed Contract', 'Self-Assessment Declaration', 'Certificate of Insurance'],
      optional: ['NDA / Confidentiality']
    },
    {
      name: 'Daily Direct Hire Construction',
      code: 'DAILY DH',
      category: 'Construction',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Direct Hire Agreement', 'Policy Acknowledgement', 'Crew Information Form'],
      optional: ['Direct Deposit Form']
    },
    {
      name: 'Daily Loan Out Construction',
      code: 'DAILY LO',
      category: 'Construction',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Loan Out Agreement', 'Certificate of Insurance', 'Company Details Form'],
      optional: ['NDA / Confidentiality']
    },
    {
      name: 'Weekly PAYE Electrical',
      code: 'WEEKLY PAYE',
      category: 'Electrical',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['PAYE Contract', 'Policy Acknowledgement', 'Crew Information Form', 'Start Form'],
      optional: ['P45 / P46']
    },
    {
      name: 'Weekly Self-Employed Electrical',
      code: 'WEEKLY SE',
      category: 'Electrical',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Self-Employed Contract', 'Self-Assessment Declaration', 'Certificate of Insurance'],
      optional: ['NDA / Confidentiality']
    },
    {
      name: 'Weekly Direct Hire Electrical',
      code: 'WEEKLY DH',
      category: 'Electrical',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Direct Hire Agreement', 'Policy Acknowledgement', 'Crew Information Form'],
      optional: ['Direct Deposit Form']
    },
    {
      name: 'Weekly Loan Out Electrical',
      code: 'WEEKLY LO',
      category: 'Electrical',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Loan Out Agreement', 'Certificate of Insurance', 'Company Details Form'],
      optional: ['NDA / Confidentiality']
    },
    {
      name: 'Daily PAYE Electrical',
      code: 'DAILY PAYE',
      category: 'Electrical',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['PAYE Contract', 'Policy Acknowledgement', 'Crew Information Form', 'Start Form'],
      optional: ['P45 / P46']
    },
    {
      name: 'Daily Self-Employed Electrical',
      code: 'DAILY SE',
      category: 'Electrical',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Self-Employed Contract', 'Self-Assessment Declaration', 'Certificate of Insurance'],
      optional: ['NDA / Confidentiality']
    },
    {
      name: 'Daily Direct Hire Electrical',
      code: 'DAILY DH',
      category: 'Electrical',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Direct Hire Agreement', 'Policy Acknowledgement', 'Crew Information Form'],
      optional: ['Direct Deposit Form']
    },
    {
      name: 'Daily Loan Out Electrical',
      code: 'DAILY LO',
      category: 'Electrical',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Loan Out Agreement', 'Certificate of Insurance', 'Company Details Form'],
      optional: ['NDA / Confidentiality']
    },
    {
      name: 'Weekly PAYE HOD',
      code: 'WEEKLY PAYE',
      category: 'HOD',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['PAYE Contract', 'Policy Acknowledgement', 'Crew Information Form', 'Start Form'],
      optional: ['P45 / P46']
    },
    {
      name: 'Weekly Self-Employed HOD',
      code: 'WEEKLY SE',
      category: 'HOD',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Self-Employed Contract', 'Self-Assessment Declaration', 'Certificate of Insurance'],
      optional: ['NDA / Confidentiality']
    },
    {
      name: 'Weekly Direct Hire HOD',
      code: 'WEEKLY DH',
      category: 'HOD',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Direct Hire Agreement', 'Policy Acknowledgement', 'Crew Information Form'],
      optional: ['Direct Deposit Form']
    },
    {
      name: 'Weekly Loan Out HOD',
      code: 'WEEKLY LO',
      category: 'HOD',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Loan Out Agreement', 'Certificate of Insurance', 'Company Details Form'],
      optional: ['NDA / Confidentiality']
    },
    {
      name: 'Daily PAYE HOD',
      code: 'DAILY PAYE',
      category: 'HOD',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['PAYE Contract', 'Policy Acknowledgement', 'Crew Information Form', 'Start Form'],
      optional: ['P45 / P46']
    },
    {
      name: 'Daily Self-Employed HOD',
      code: 'DAILY SE',
      category: 'HOD',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Self-Employed Contract', 'Self-Assessment Declaration', 'Certificate of Insurance'],
      optional: ['NDA / Confidentiality']
    },
    {
      name: 'Daily Direct Hire HOD',
      code: 'DAILY DH',
      category: 'HOD',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Direct Hire Agreement', 'Policy Acknowledgement', 'Crew Information Form'],
      optional: ['Direct Deposit Form']
    },
    {
      name: 'Daily Loan Out HOD',
      code: 'DAILY LO',
      category: 'HOD',
      status: 'Active',
      primaryForms: ['Box Rental', 'Computer Allowance', 'Crew Information Form', 'Mobile Allowance', 'Start Form', 'NDA / Confidentiality', 'Policy Acknowledgement'],
      documents: ['Loan Out Agreement', 'Certificate of Insurance', 'Company Details Form'],
      optional: ['NDA / Confidentiality']
    }
  ];

  const bundleSubTabs = [
    'Standard Crew',
    'Senior / Buyout',
    'Construction',
    'Electrical',
    'HOD',
    'Rigging',
    'Transport'
  ];

  const filteredContractBundles = contractBundles.filter(
    (bundle) => bundle.category === bundleSubTab
  );


  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };


  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between bg-background border rounded-lg p-4 shadow-sm">

        <h2 className="text-base font-semibold">Onboarding</h2>

        <div className="flex gap-2">

          <Button
            variant={activeTab === 'general' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('general')}
          >
            General
          </Button>

          <Button
            variant={activeTab === 'contracts' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('contracts')}
          >
            Contract categories
          </Button>

          <Button
            variant={activeTab === 'forms' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('forms')}
          >
            Forms & Documents
          </Button>

          <Button
            variant={activeTab === 'contract-bundles' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('contract-bundles')}
          >
            Contract bundles
          </Button>

        </div>
      </div>


      {/* ================= GENERAL TAB ================= */}

      {activeTab === 'general' && (
        <div className="space-y-4">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

            {/* Offer Handling */}
            <div className="lg:col-span-5">

              <CardWrapper title="Offer handling">

                <div className="space-y-4">

                  <ButtonToggleGroup
                    label="Offer end date"
                    options={[
                      { value: 'Optional', label: 'Optional' },
                      { value: 'Mandatory', label: 'Mandatory' }
                    ]}
                    selected={formData.offerEndDate}
                    onChange={(val) => updateField('offerEndDate', val)}
                    showInfo
                  />

                  <div className="grid grid-cols-2 gap-2">

                    <div className="space-y-1">

                      <Label className="text-sm">Tax status handling</Label>

                      <Select
                        value={formData.taxStatusHandling}
                        onValueChange={(val) => updateField('taxStatusHandling', val)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="Accounts approver required for self-employed or loan out">
                            Accounts approver required
                          </SelectItem>
                          <SelectItem value="No approval required">
                            No approval required
                          </SelectItem>
                          <SelectItem value="Approval required for all">
                            Approval required
                          </SelectItem>
                        </SelectContent>

                      </Select>

                    </div>

                    <div className="space-y-1">

                      <Label className="text-sm">Tax status query email</Label>

                      <Input
                        type="email"
                        value={formData.taxStatusQueryEmail}
                        onChange={(e) =>
                          updateField('taxStatusQueryEmail', e.target.value)
                        }
                        placeholder="email@example.com"
                        className="h-8 text-xs"
                      />

                    </div>

                  </div>

                </div>

              </CardWrapper>

            </div>


            {/* Notice */}
            <div className="lg:col-span-7">

              <CardWrapper title="Notice">

                <div className="space-y-3">

                  <div className="flex items-center justify-between">

                    <Label className="text-sm">Notice period</Label>

                    <div className="flex items-center gap-2">

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          updateField(
                            'noticePeriod',
                            Math.max(0, formData.noticePeriod - 1)
                          )
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>

                      <Input
                        type="number"
                        value={formData.noticePeriod}
                        onChange={(e) =>
                          updateField('noticePeriod', Number(e.target.value))
                        }
                        className="text-center h-7 w-14 text-xs"
                      />

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          updateField(
                            'noticePeriod',
                            formData.noticePeriod + 1
                          )
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>

                      <span className="text-xs text-muted-foreground">
                        days
                      </span>

                    </div>

                  </div>

                  <Textarea
                    value={formData.noticeEmailWording}
                    onChange={(e) =>
                      updateField('noticeEmailWording', e.target.value)
                    }
                    rows={4}
                    className="font-mono text-xs"
                  />

                </div>

              </CardWrapper>

            </div>

          </div>

        </div>
      )}


      {/* ================= CONTRACTS TAB ================= */}

      {activeTab === 'contracts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {crewCategories.map((category) => (
              <div
                key={category.name}
                className="border border-border rounded-lg bg-background hover:shadow-sm transition-shadow group/card"
              >
                <div className="flex items-center justify-between px-3 pt-3 pb-2 gap-1">
                  <div className="flex items-center gap-1.5 min-w-0 group/name">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {category.name}
                    </span>
                    <button
                      className="shrink-0 opacity-0 group-hover/name:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                      title="Rename"
                    >
                      <Pencil className="h-2.5 w-2.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      className="inline-flex items-center gap-0.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                      title="Add form type"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="h-px mx-3 bg-border" />

                <div className="px-3 py-2 space-y-0.5">
                  {contractTypes.map((contract, index) => {
                    const moveUpDisabled = index === 0;
                    const moveDownDisabled = index === contractTypes.length - 1;
                    const label = contract.label.replace(' - ', ' ');

                    return (
                      <div
                        key={contract.value}
                        className="flex items-center justify-between py-1 group/row"
                      >
                        <div className="flex items-center gap-1 min-w-0">
                          <div className="flex flex-col shrink-0 opacity-0 group-hover/row:opacity-100 transition-opacity">
                            <button
                              disabled={moveUpDisabled}
                              className="text-muted-foreground hover:text-primary disabled:opacity-20 disabled:cursor-default"
                              title="Move up"
                            >
                              <ChevronUp className="h-2.5 w-2.5" />
                            </button>
                            <button
                              disabled={moveDownDisabled}
                              className="text-muted-foreground hover:text-primary disabled:opacity-20 disabled:cursor-default"
                              title="Move down"
                            >
                              <ChevronDown className="h-2.5 w-2.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 min-w-0 group/name">
                            <span className="truncate text-xs text-muted-foreground">
                              {label}
                            </span>
                            <button
                              className="shrink-0 opacity-0 group-hover/name:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                              title="Rename"
                            >
                              <Pencil className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {contract.status === 'upload' && (
                            <button
                              className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                              title="Upload & convert template"
                            >
                              <Sparkles className="h-2.5 w-2.5" />
                              <span className="text-[8px] font-semibold uppercase tracking-wider">
                                Upload
                              </span>
                            </button>
                          )}

                          {contract.status === 'view' && (
                            <button
                              className="text-muted-foreground hover:text-primary transition-colors"
                              title="View template"
                            >
                              <Eye className="h-3 w-3" />
                            </button>
                          )}

                          {contract.status === 'pending' && (
                            <button
                              className="text-muted-foreground hover:text-primary transition-colors"
                              title="Pending"
                            >
                              <Clock className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-primary/40 text-sm font-medium text-primary hover:bg-primary/5 transition-colors">
            <Plus className="h-3.5 w-3.5" />
            Add Category
          </button>
        </div>

      )}

      {/* ================= CONTRACT BUNDLES TAB ================= */}
      {activeTab === 'contract-bundles' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {bundleSubTabs.map((subTab) => (
              <button
                key={subTab}
                onClick={() => setBundleSubTab(subTab)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                  bundleSubTab === subTab
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-muted-foreground border-transparent hover:bg-muted/80'
                }`}
              >
                {subTab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {filteredContractBundles.map((bundle) => (
              <div
                key={bundle.name}
                className="border border-border rounded-xl bg-background p-3 space-y-3"
              >
                <div className="flex items-center">
                  <h3 className="text-sm font-semibold text-foreground truncate min-w-0">
                    {bundle.name}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {bundle.primaryForms.map((formName) => (
                    <span
                      key={`${bundle.name}-${formName}`}
                      className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary"
                    >
                      {formName}
                    </span>
                  ))}
                </div>

                <div className="h-px bg-border" />

                <div className="flex flex-wrap gap-1.5">
                  {bundle.documents.map((documentName) => (
                    <span
                      key={`${bundle.name}-${documentName}`}
                      className="rounded-full bg-muted px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      {documentName}
                    </span>
                  ))}

                  {bundle.optional.map((optionalName) => (
                    <span
                      key={`${bundle.name}-${optionalName}`}
                      className="rounded-full border border-dashed border-border bg-background px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      {optionalName} OPT
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant={bundle.status === 'Active' ? 'default' : 'secondary'}>
                    {bundle.status}
                  </Badge>
                  <button className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredContractBundles.length === 0 && (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No bundles available for {bundleSubTab} yet.
            </div>
          )}

          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-primary/40 text-sm font-medium text-primary hover:bg-primary/5 transition-colors">
            <Plus className="h-3.5 w-3.5" />
            Add Bundle
          </button>
        </div>
      )}

      {/* ================= FORMS TAB ================= */}
      {activeTab === 'forms' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
              {formGroups.map((group) => (
                <div
                  key={group.name}
                  className="border border-border rounded-lg bg-background hover:shadow-sm transition-shadow group/card"
                >
                  <div className="px-3 pt-3 pb-2">
                    <span className="truncate text-sm font-semibold text-foreground block">
                      {group.name}
                    </span>
                  </div>

                  <div className="h-px mx-3 bg-border" />

                  <div className="px-3 py-2 space-y-0.5">
                    {group.forms.map((form) => {
                      return (
                        <div
                          key={form.name}
                          className="flex items-center justify-between py-1"
                        >
                          <span className="truncate text-xs text-muted-foreground">
                            {form.name}
                          </span>
                          <button
                            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="Preview template"
                          >
                            <Eye className="h-2.5 w-2.5" />
                            <span className="text-[8px] font-semibold uppercase tracking-wider">View</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>

          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-primary/40 text-sm font-medium text-primary hover:bg-primary/5 transition-colors">
            <Plus className="h-3.5 w-3.5" />
            Add Group
          </button>
        </div>
      )}

    </div>
  );
};

export default ProjectOnboarding;