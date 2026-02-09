// ProjectOnboarding.jsx
import { useState } from 'react';
import { 
  Info, Plus, Eye, Download, Trash2, Minus, FileText, Lock,
  Upload, Edit, CheckCircle, AlertCircle, Calendar, Users, Briefcase,
  FileCheck, Settings, Sparkles, Save, Building2, Shield, ScrollText,
  UserCog, Zap, Brain, Bot, Wand2, CheckSquare, X, File,
  ZoomIn, ZoomOut, Printer, ChevronLeft, ChevronRight, Clock
} from 'lucide-react';
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { Switch } from "@/shared/components/ui/switch";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Badge } from "@/shared/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
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
  const [activeTab, setActiveTab] = useState('general');
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
    departmentFilter: 'All Departments'
  });

  // Contract management state
  const [uploadedTemplates, setUploadedTemplates] = useState([
    { 
      id: '1', 
      name: 'Standard_Crew_Contract_v2.pdf', 
      category: 'Standard Crew', 
      uploadDate: '2026-02-01', 
      size: '245 KB'
    },
    { 
      id: '2', 
      name: 'HOD_Weekly_Template.docx', 
      category: 'HOD', 
      uploadDate: '2026-01-28', 
      size: '180 KB'
    }
  ]);

  const [selectedContracts, setSelectedContracts] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const crewCategories = [
    { name: 'Standard Crew', icon: Users, color: 'purple' },
    { name: 'Senior / Buyout', icon: UserCog, color: 'blue' },
    { name: 'Construction', icon: Building2, color: 'orange' },
    { name: 'Electrical', icon: Zap, color: 'amber' },
    { name: 'HOD', icon: Briefcase, color: 'green' },
    { name: 'Rigging', icon: Settings, color: 'red' },
    { name: 'Transport', icon: FileCheck, color: 'indigo' }
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

  const formCategories = {
    contractual: [
      { name: 'Box Rental', status: 'view' },
      { name: 'Computer Allowance', status: 'pending' },
      { name: 'Software Allowance', status: 'upload' },
      { name: 'Equipment Rental', status: 'view' },
      { name: 'Mobile Allowance', status: 'upload' },
      { name: 'Vehicle Allowance', status: 'pending' },
      { name: 'Living Allowance', status: 'view' },
      { name: 'Deal Memo (PACT BECTU)', status: 'upload' },
      { name: 'Status Determination', status: 'pending' },
      { name: 'Start Form', status: 'view' }
    ],
    standard: [
      { name: 'Child Protection Declaration', status: 'view' },
      { name: 'Conflict of Interest', status: 'pending' },
      { name: 'Driver Declaration', status: 'upload' },
      { name: 'NDA / Confidentiality', status: 'view' },
      { name: 'Policy Acknowledgement', status: 'pending' }
    ],
    tax: [
      { name: 'W-4 (Federal)', status: 'upload' },
      { name: 'I-9', status: 'view' },
      { name: 'State Tax Exemption', status: 'pending' }
    ],
    insurance: [
      { name: 'Certificate of Insurance', status: 'view' },
      { name: 'Child Support Notice', status: 'pending' },
      { name: 'Direct Deposit', status: 'upload' }
    ],
    other: [
      { name: 'Disability Disclosure', status: 'upload' },
      { name: 'Emergency Contact', status: 'view' },
      { name: 'Picture ID Release', status: 'pending' }
    ]
  };

  const selectAllForCategory = (categoryName) => {
    setSelectedContracts(prev => ({
      ...prev,
      [categoryName]: contractTypes.map(c => c.value)
    }));
  };

  const handleFileUpload = (event, category) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const newTemplate = {
        id: Date.now().toString(),
        name: file.name,
        category: category,
        uploadDate: new Date().toISOString().split('T')[0],
        size: `${Math.round(file.size / 1024)} KB`
      };
      setUploadedTemplates(prev => [...prev, newTemplate]);
    }
  };

  const removeTemplate = (id) => {
    setUploadedTemplates(prev => prev.filter(t => t.id !== id));
  };

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
      {/* Header with Action Buttons */}
      <div className="flex items-center justify-between bg-background border rounded-lg p-4 shadow-sm">
        <h2 className="text-base font-semibold">Onboarding</h2>
        <div className="flex gap-2">
          <Button 
            variant={activeTab === 'general' ? 'default' : 'ghost'} 
            size="sm"
            className={activeTab === 'general' ? '' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
            onClick={() => setActiveTab('general')}
          >
            General
          </Button>
          <Button 
            variant={activeTab === 'contracts' ? 'default' : 'ghost'} 
            size="sm"
            className={activeTab === 'contracts' ? '' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
            onClick={() => setActiveTab('contracts')}
          >
            Contract bundles
          </Button>
          <Button 
            variant={activeTab === 'forms' ? 'default' : 'ghost'} 
            size="sm"
            className={activeTab === 'forms' ? '' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
            onClick={() => setActiveTab('forms')}
          >
            Forms & Documents
          </Button>
        </div>
      </div>

      {/* General Tab Content */}
      {activeTab === 'general' && (
      <div className="space-y-4">
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

      {/* Choose design for contracts and forms */}
      <CardWrapper 
        title="Choose design for contracts and forms" 
        variant="default"
        showLabel={true}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Modern Design */}
          <div className="border-2 border-border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors bg-white">
            <div className="aspect-[3/4] bg-gray-100 rounded mb-2 flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-xs font-semibold text-center">Modern</h4>
          </div>

          {/* Classic Design */}
          <div className="border-2 border-primary rounded-lg p-3 cursor-pointer bg-primary/5 relative">
            <div className="aspect-[3/4] bg-gray-100 rounded mb-2 flex items-center justify-center relative">
              <FileText className="w-8 h-8 text-gray-400" />
              <div className="absolute -top-1 -right-1 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded">✓</div>
            </div>
            <h4 className="text-xs font-semibold text-center">Classic</h4>
          </div>

          {/* Creative Design */}
          <div className="border-2 border-border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors bg-white">
            <div className="aspect-[3/4] bg-gray-100 rounded mb-2 flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-xs font-semibold text-center">Creative</h4>
          </div>

          {/* Professional Design */}
          <div className="border-2 border-border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors bg-white">
            <div className="aspect-[3/4] bg-gray-100 rounded mb-2 flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-xs font-semibold text-center">Professional</h4>
          </div>

          {/* Elegant Design */}
          <div className="border-2 border-border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors bg-white">
            <div className="aspect-[3/4] bg-gray-100 rounded mb-2 flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-xs font-semibold text-center">Elegant</h4>
          </div>

          {/* Minimal Design */}
          <div className="border-2 border-border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors bg-white">
            <div className="aspect-[3/4] bg-gray-100 rounded mb-2 flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-xs font-semibold text-center">Minimal</h4>
          </div>
        </div>
      </CardWrapper>
      </div>
      )}

      {/* Contract Bundles Tab */}
      {activeTab === 'contracts' && (
      <div className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {crewCategories.map((category) => {
                const Icon = category.icon;
                const selectedCount = selectedContracts[category.name]?.length || 0;
                
                return (
                  <div key={category.name} className="border border-border rounded-lg hover:shadow-sm transition-shadow bg-white">
                    <div className={`p-2 bg-${category.color}-50/50 border-b border-border`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-3.5 h-3.5 text-${category.color}-600`} />
                          <span className="text-sm font-medium">{category.name}</span>
                          {selectedCount > 0 && (
                            <Badge className="bg-white text-xs px-1.5 py-0">{selectedCount}</Badge>
                          )}
                        </div>
                        <button className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">New form</span>
                        </button>
                      </div>
                    </div>
                    <div className="p-2 space-y-1">
                      {contractTypes.map((contract) => {
                        const StatusIcon = contract.status === 'view' ? Eye : contract.status === 'pending' ? Clock : Upload;
                        const iconColor = contract.status === 'upload' ? 'text-primary' : 'text-gray-400';
                        const statusText = contract.status === 'view' ? 'View' : contract.status === 'pending' ? 'Pending' : 'Upload';
                        
                        return (
                          <div key={contract.value} className="flex items-center justify-between hover:bg-muted/30 rounded px-2 py-1 cursor-pointer">
                            <span className="text-xs flex-1">
                              {contract.label.replace('Weekly - ', 'W-').replace('Daily - ', 'D-')}
                            </span>
                            <div className="flex items-center gap-1">
                              <StatusIcon className={`w-3.5 h-3.5 ${iconColor} hover:text-primary`} />
                              <span className={`text-xs ${iconColor}`}>{statusText}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
        <button className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-primary text-primary hover:bg-primary/5 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add Bundle</span>
        </button>
      </div>
      )}

      {/* Forms & Documents Tab */}
      {activeTab === 'forms' && (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {/* Contractual Forms */}
              <div className="border border-border rounded-lg hover:shadow-sm transition-shadow bg-white">
                <div className="p-2 bg-gray-50 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">Contractual Forms</h4>
                    <button className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">New form</span>
                    </button>
                  </div>
                </div>
                <div className="p-2 space-y-1">
                  {formCategories.contractual.map(form => {
                    const StatusIcon = form.status === 'view' ? Eye : form.status === 'pending' ? Clock : Upload;
                    const iconColor = form.status === 'upload' ? 'text-primary' : 'text-gray-400';
                    const statusText = form.status === 'view' ? 'View' : form.status === 'pending' ? 'Pending' : 'Upload';
                    
                    return (
                      <div key={form.name} className="flex items-center justify-between hover:bg-muted/30 rounded px-2 py-1 cursor-pointer">
                        <span className="text-xs leading-tight flex-1">{form.name}</span>
                        <div className="flex items-center gap-1">
                          <StatusIcon className={`w-3.5 h-3.5 ${iconColor} hover:text-primary`} />
                          <span className={`text-xs ${iconColor}`}>{statusText}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Standard Forms */}
              <div className="border border-border rounded-lg hover:shadow-sm transition-shadow bg-white">
                <div className="p-2 bg-gray-50 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">Standard Forms</h4>
                    <button className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">New form</span>
                    </button>
                  </div>
                </div>
                <div className="p-2 space-y-1">
                  {formCategories.standard.map(form => {
                    const StatusIcon = form.status === 'view' ? Eye : form.status === 'pending' ? Clock : Upload;
                    const iconColor = form.status === 'upload' ? 'text-primary' : 'text-gray-400';
                    const statusText = form.status === 'view' ? 'View' : form.status === 'pending' ? 'Pending' : 'Upload';
                    
                    return (
                      <div key={form.name} className="flex items-center justify-between hover:bg-muted/30 rounded px-2 py-1 cursor-pointer">
                        <span className="text-xs leading-tight flex-1">{form.name}</span>
                        <div className="flex items-center gap-1">
                          <StatusIcon className={`w-3.5 h-3.5 ${iconColor} hover:text-primary`} />
                          <span className={`text-xs ${iconColor}`}>{statusText}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tax & Compliance */}
              <div className="border border-border rounded-lg hover:shadow-sm transition-shadow bg-white">
                <div className="p-2 bg-gray-50 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">Tax & Compliance</h4>
                    <button className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">New form</span>
                    </button>
                  </div>
                </div>
                <div className="p-2 space-y-1">
                  {formCategories.tax.map(form => {
                    const StatusIcon = form.status === 'view' ? Eye : form.status === 'pending' ? Clock : Upload;
                    const iconColor = form.status === 'upload' ? 'text-primary' : 'text-gray-400';
                    const statusText = form.status === 'view' ? 'View' : form.status === 'pending' ? 'Pending' : 'Upload';
                    
                    return (
                      <div key={form.name} className="flex items-center justify-between hover:bg-muted/30 rounded px-2 py-1 cursor-pointer">
                        <span className="text-xs leading-tight flex-1">{form.name}</span>
                        <div className="flex items-center gap-1">
                          <StatusIcon className={`w-3.5 h-3.5 ${iconColor} hover:text-primary`} />
                          <span className={`text-xs ${iconColor}`}>{statusText}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Insurance & Legal */}
              <div className="border border-border rounded-lg hover:shadow-sm transition-shadow bg-white">
                <div className="p-2 bg-gray-50 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">Insurance & Legal</h4>
                    <button className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">New form</span>
                    </button>
                  </div>
                </div>
                <div className="p-2 space-y-1">
                  {formCategories.insurance.map(form => {
                    const StatusIcon = form.status === 'view' ? Eye : form.status === 'pending' ? Clock : Upload;
                    const iconColor = form.status === 'upload' ? 'text-primary' : 'text-gray-400';
                    const statusText = form.status === 'view' ? 'View' : form.status === 'pending' ? 'Pending' : 'Upload';
                    
                    return (
                      <div key={form.name} className="flex items-center justify-between hover:bg-muted/30 rounded px-2 py-1 cursor-pointer">
                        <span className="text-xs leading-tight flex-1">{form.name}</span>
                        <div className="flex items-center gap-1">
                          <StatusIcon className={`w-3.5 h-3.5 ${iconColor} hover:text-primary`} />
                          <span className={`text-xs ${iconColor}`}>{statusText}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Picture & More */}
              <div className="border border-border rounded-lg hover:shadow-sm transition-shadow bg-white">
                <div className="p-2 bg-gray-50 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">Picture & More</h4>
                    <button className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">New form</span>
                    </button>
                  </div>
                </div>
                <div className="p-2 space-y-1">
                  {formCategories.other.map(form => {
                    const StatusIcon = form.status === 'view' ? Eye : form.status === 'pending' ? Clock : Upload;
                    const iconColor = form.status === 'upload' ? 'text-primary' : 'text-gray-400';
                    const statusText = form.status === 'view' ? 'View' : form.status === 'pending' ? 'Pending' : 'Upload';
                    
                    return (
                      <div key={form.name} className="flex items-center justify-between hover:bg-muted/30 rounded px-2 py-1 cursor-pointer">
                        <span className="text-xs leading-tight flex-1">{form.name}</span>
                        <div className="flex items-center gap-1">
                          <StatusIcon className={`w-3.5 h-3.5 ${iconColor} hover:text-primary`} />
                          <span className={`text-xs ${iconColor}`}>{statusText}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
        <button className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-primary text-primary hover:bg-primary/5 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">New form group</span>
        </button>
      </div>
      )}
    </div>
  );
};

export default ProjectOnboarding;