import { useState } from 'react';
import { Plus, X, Info, Check, Mail, Bell, CheckCircle2, Clock, FileCheck, Users, DollarSign, PenTool, Building2, Eye } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Textarea } from '@/shared/components/ui/textarea';
import FilterPillTabs from '../../../shared/components/FilterPillTabs';

function ProjectOnboarding() {
  const [activeTab, setActiveTab] = useState('production-approval');
  const [showNewOfferForm, setShowNewOfferForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const [offers, setOffers] = useState([
    {
      id: '1',
      fullName: 'ASHLEIGH SHUTTLEWORTH',
      email: 'ASHLEIGH7822@GMAIL.COM',
      phoneNumber: '07917130911',
      position: 'ASSISTANT LOCATION MANAGER',
      department: 'LOCATIONS',
      startDate: '10 NOV 2025',
      endDate: '19 DEC 2025',
      rate: '£1,750.00 WEEKLY (INCL. HOLIDAY)',
      lastUpdated: '11 NOV 2025, 13:00',
      currentStage: 'PRODUCTION APPROVAL',
      stages: {
        'CREATE OFFER': { status: 'APPROVED', approver: 'SUNNY SURANI', date: '10 NOV 2025, 10:00' },
        'PRODUCTION APPROVAL': { status: 'PENDING', approver: 'PRODUCTION MANAGER', checkedBy: 'JAMES MITCHELL', checkDate: '11 NOV 2025, 12:30' },
        'ACCOUNTS APPROVAL': { status: 'NOT_STARTED' },
        'CREW APPROVAL': { status: 'NOT_STARTED' },
        'PAYROLL APPROVAL': { status: 'NOT_STARTED' },
        'CREW SIGN': { status: 'NOT_STARTED' },
        'PRODUCTION SIGN': { status: 'NOT_STARTED' },
        'FINANCE SIGN': { status: 'NOT_STARTED' },
        'STUDIO SIGN': { status: 'NOT_STARTED' },
      }
    },
    {
      id: '2',
      fullName: 'JOHN WILLIAMS',
      email: 'JOHN.WILLIAMS@EMAIL.COM',
      phoneNumber: '07123456789',
      position: 'DIRECTOR OF PHOTOGRAPHY',
      department: 'CAMERA',
      startDate: '01 OCT 2025',
      endDate: '30 DEC 2025',
      rate: '£3,500.00 WEEKLY (INCL. HOLIDAY)',
      lastUpdated: '05 NOV 2025, 09:30',
      currentStage: 'ACCOUNTS APPROVAL',
      stages: {
        'CREATE OFFER': { status: 'APPROVED', approver: 'SUNNY SURANI', date: '01 OCT 2025, 09:00' },
        'PRODUCTION APPROVAL': { status: 'APPROVED', approver: 'JAMES MITCHELL', date: '02 OCT 2025, 11:00' },
        'ACCOUNTS APPROVAL': { status: 'PENDING', approver: 'RACHEL THOMPSON', checkedBy: 'RACHEL THOMPSON', checkDate: '05 NOV 2025, 08:45' },
        'CREW APPROVAL': { status: 'NOT_STARTED' },
        'PAYROLL APPROVAL': { status: 'NOT_STARTED' },
        'CREW SIGN': { status: 'NOT_STARTED' },
        'PRODUCTION SIGN': { status: 'NOT_STARTED' },
        'FINANCE SIGN': { status: 'NOT_STARTED' },
        'STUDIO SIGN': { status: 'NOT_STARTED' },
      }
    },
    {
      id: '3',
      fullName: 'SARAH MARTINEZ',
      email: 'SARAH.M@EMAIL.COM',
      phoneNumber: '07987654321',
      position: 'PRODUCTION DESIGNER',
      department: 'ART',
      startDate: '15 NOV 2025',
      endDate: '15 JAN 2026',
      rate: '£2,800.00 WEEKLY (INCL. HOLIDAY)',
      lastUpdated: '08 NOV 2025, 14:45',
      currentStage: 'CREW APPROVAL',
      stages: {
        'CREATE OFFER': { status: 'APPROVED', approver: 'SUNNY SURANI', date: '08 NOV 2025, 09:00' },
        'PRODUCTION APPROVAL': { status: 'APPROVED', approver: 'JAMES MITCHELL', date: '08 NOV 2025, 10:30' },
        'ACCOUNTS APPROVAL': { status: 'APPROVED', approver: 'RACHEL THOMPSON', date: '08 NOV 2025, 12:00' },
        'CREW APPROVAL': { status: 'PENDING', approver: 'SARAH MARTINEZ', checkedBy: 'SARAH MARTINEZ', checkDate: '08 NOV 2025, 14:30' },
        'PAYROLL APPROVAL': { status: 'NOT_STARTED' },
        'CREW SIGN': { status: 'NOT_STARTED' },
        'PRODUCTION SIGN': { status: 'NOT_STARTED' },
        'FINANCE SIGN': { status: 'NOT_STARTED' },
        'STUDIO SIGN': { status: 'NOT_STARTED' },
      }
    }
  ]);

  const [jobTitles, setJobTitles] = useState([
    {
      id: '1',
      isPrimary: true,
      roleName: 'ROLE 1',
      jobTitle: '',
      jobTitleSuffix: '',
      rateType: 'DAILY',
      currency: 'GBP',
      rateAmount: '',
      shiftHours: '',
      holidayPayInclusive: false,
      rateDescription: '',
      // Additional fields required by TabbedRoleConfiguration
      unit: '',
      department: '',
      subDepartment: '',
      regularSiteOfWork: '',
      engagement: '',
      startDate: '',
      endDate: '',
      dailyOrWeekly: '',
      workingWeek: '',
      workingInUK: '',
      feePerDay: '',
      overtimeType: 'CALCULATED',
      customOT: {
        nonShootOT: '',
        shootOT: '',
        minHrs6thDay: '',
        sixthDayHourly: '',
        minHrs7thDay: '',
        seventhDayHourly: '',
      },
      budgetCode: '',
    }
  ]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    isViaAgent: false,
    alternativeContract: '',
    allowSelfEmployed: 'YES',
    statusDeterminationReason: '',
    otherStatusReason: '',
    otherDealProvisions: '',
    additionalNotes: '',
  });

  const handleSave = () => {
    setShowNewOfferForm(false);
    setShowSuccessModal(true);
    setFormData({
      fullName: '',
      email: '',
      mobileNumber: '',
      isViaAgent: false,
      alternativeContract: '',
      allowSelfEmployed: 'YES',
      statusDeterminationReason: '',
      otherStatusReason: '',
      otherDealProvisions: '',
      additionalNotes: '',
    });
  };

  const filters = [
    { value: 'production-approval', label: 'PRODUCTION APPROVAL' },
    { value: 'accounts-approval', label: 'ACCOUNTS APPROVAL' },
    { value: 'crew-approval', label: 'CREW APPROVAL' },
    { value: 'payroll-approval', label: 'PAYROLL APPROVAL' },
    { value: 'crew-sign', label: 'CREW SIGN' },
    { value: 'production-sign', label: 'PRODUCTION SIGN' },
    { value: 'finance-sign', label: 'FINANCE SIGN' },
    { value: 'studio-sign', label: 'STUDIO SIGN' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          CREW ONBOARDING
        </h2>
        {!showNewOfferForm && activeTab === 'production-approval' && (
          <button
            onClick={() => setShowNewOfferForm(true)}
            className="px-6 py-3 rounded-lg font-bold bg-purple-700 text-white hover:bg-purple-600 dark:hover:bg-purple-800 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            NEW OFFER
          </button>
        )}
      </div>

      {/* WORKFLOW PROGRESS TRACKER */}
      <div className="p-6 rounded-xl border bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800/50 dark:to-gray-800/30 border-purple-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white">
            ONBOARDING WORKFLOW PROGRESS
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600 dark:text-gray-400">COMPLETED</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-600 animate-pulse"></div>
              <span className="text-gray-600 dark:text-gray-400">IN PROGRESS</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <span className="text-gray-600 dark:text-gray-400">PENDING</span>
            </div>
          </div>
        </div>

        {/* Workflow Timeline */}
        <div className="relative">
          <div className="absolute top-[52px] left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700"></div>
          <div
            className="absolute top-[52px] left-0 h-1 bg-gradient-to-r from-green-500 to-purple-600 transition-all duration-500"
            style={{ width: '22%' }}
          ></div>

          {/* Workflow Stages */}
          <div className="grid grid-cols-8 gap-4 relative">
            {[
              { id: 'production-approval', icon: FileCheck, label: 'PRODUCTION\nAPPROVAL' },
              { id: 'accounts-approval', icon: DollarSign, label: 'ACCOUNTS\nAPPROVAL' },
              { id: 'crew-approval', icon: Users, label: 'CREW\nAPPROVAL' },
              { id: 'payroll-approval', icon: FileCheck, label: 'PAYROLL\nAPPROVAL' },
              { id: 'crew-sign', icon: PenTool, label: 'CREW\nSIGN' },
              { id: 'production-sign', icon: PenTool, label: 'PRODUCTION\nSIGN' },
              { id: 'finance-sign', icon: DollarSign, label: 'FINANCE\nSIGN' },
              { id: 'studio-sign', icon: Building2, label: 'STUDIO\nSIGN' },
            ].map((stage, idx) => {
              const IconComponent = stage.icon;
              const isActive = activeTab === stage.id;
              const isComplete = stage.id === "production-approval"
              const isOngoing = stage.id === "production-approval"
              return (
                <div key={stage.id} className="flex flex-col items-center">
                  <button
                    onClick={() => setActiveTab(stage.id)}
                    className={`relative w-[104px] h-[104px] z-1 rounded-3xl border-2 flex flex-col gap-2 items-center justify-center mb-3 transition-all ${isComplete
                      ? "bg-green-500 border-green-600"
                      : isActive
                        ? 'bg-lavender-100 border-lavender-400 shadow-lg shadow-purple-500/50'
                        : 'bg-lavender-100 border-lavender-100 dark:bg-gray-700 dark:border-gray-600'
                      }`}
                  >
                    <IconComponent className={`w-8 h-8 mb-1 text-bold ${isComplete ? " text-white" : isActive ? 'text-lavender-600' : isActive ? 'text-white' : 'dark:text-gray-400 text-gray-400'}`} />
                    <span className={`text-xs font-bold text-center leading-tight ${isComplete ? "text-white" : isActive ? 'text-lavender-600' : 'dark:text-gray-400 text-gray-600'}`}>
                      {stage.label}
                    </span>
                    {isOngoing &&
                      <div className='absolute -z-10 -top-1.1 -left-1.1 w-[102%] h-[102%] rounded-3xl bg-lavender-600 animate-pulse'></div>
                    }
                  </button>
                  <div className="text-center text-[10px] font-bold text-gray-600 dark:text-gray-400">
                    STEP {idx + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-purple-200 dark:border-gray-700">
          {[
            { icon: Eye, label: 'TOTAL OFFERS', value: offers.length, color: 'blue' },
            { icon: CheckCircle2, label: 'COMPLETED', value: 0, color: 'green' },
            { icon: Clock, label: 'IN PROGRESS', value: offers.length, color: 'purple' },
            { icon: Users, label: 'AWAITING ACTION', value: offers.filter(o => o.currentStage === 'PRODUCTION APPROVAL').length, color: 'orange' },
          ].map((stat) => {
            const colorMap = {
              blue: { bg: 'bg-blue-100 dark:bg-blue-900', icon: 'text-blue-600 dark:text-blue-400' },
              green: { bg: 'bg-green-100 dark:bg-green-900', icon: 'text-green-600 dark:text-green-400' },
              purple: { bg: 'bg-purple-100 dark:bg-purple-900', icon: 'text-purple-600 dark:text-purple-400' },
              orange: { bg: 'bg-orange-100 dark:bg-orange-900', icon: 'text-orange-600 dark:text-orange-400' },
            };
            const IconComponent = stat.icon;
            return (
              <div key={stat.label} className="p-4 rounded-lg bg-white dark:bg-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg ${colorMap[stat.color].bg} flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 ${colorMap[stat.color].icon}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="py-4">
        <FilterPillTabs
          options={filters}
          value={activeTab}
          onChange={setActiveTab}
        />
      </div>


      {/* New Offer Form Modal */}
      {showNewOfferForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-6xl my-8 rounded-xl border shadow-2xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                NEW OFFER
              </h3>
              <button
                onClick={() => setShowNewOfferForm(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* RECIPIENT SECTION */}
              <div>
                <h4 className="text-lg font-bold mb-4 pb-2 border-b text-purple-700 dark:text-purple-400 border-gray-200 dark:border-gray-700">
                  RECIPIENT
                </h4>
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                      FULL NAME <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value.toUpperCase() })}
                      placeholder="ENTER FULL NAME"
                      className="uppercase dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <Label className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      EMAIL <span className="text-red-500">*</span>
                      <Info className="w-4 h-4 text-gray-500 dark:text-gray-400" title="Ensure this is the recipient's preferred email address" />
                    </Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value.toUpperCase() })}
                      placeholder="EMAIL@EXAMPLE.COM"
                      className="uppercase dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <Label className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                      MOBILE NUMBER <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      placeholder="07XXX XXXXXX"
                      className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isViaAgent"
                      checked={formData.isViaAgent}
                      onCheckedChange={(v) => setFormData({ ...formData, isViaAgent: v })}
                    />
                    <Label htmlFor="isViaAgent" className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      CHECK THE BOX IF THIS DEAL IS VIA AN AGENT
                    </Label>
                  </div>

                  <div>
                    <Label className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                      ALTERNATIVE CONTRACT
                    </Label>
                    <Select value={formData.alternativeContract} onValueChange={(v) => setFormData({ ...formData, alternativeContract: v })}>
                      <SelectTrigger className="dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                        <SelectValue placeholder="SELECT..." />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-900 dark:border-gray-700">
                        <SelectItem value="HOD">HOD</SelectItem>
                        <SelectItem value="NO_CONTRACT">NO CONTRACT (ALL OTHER DOCUMENTS TO BE PROCESSED)</SelectItem>
                        <SelectItem value="SENIOR_AGREEMENT">SENIOR AGREEMENT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* TAX STATUS SECTION */}
              <div>
                <h4 className="text-lg font-bold mb-4 pb-2 border-b text-purple-700 dark:text-purple-400 border-gray-200 dark:border-gray-700">
                  TAX STATUS
                </h4>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 block">
                      ALLOW AS SELF-EMPLOYED OR LOAN OUT? <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup value={formData.allowSelfEmployed} onValueChange={(v) => setFormData({ ...formData, allowSelfEmployed: v })}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="YES" id="selfEmpYes" />
                        <Label htmlFor="selfEmpYes" className="text-sm font-bold text-gray-700 dark:text-gray-300">YES</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="NO" id="selfEmpNo" />
                        <Label htmlFor="selfEmpNo" className="text-sm font-bold text-gray-700 dark:text-gray-300">NO</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                      STATUS DETERMINATION REASON <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.statusDeterminationReason} onValueChange={(v) => setFormData({ ...formData, statusDeterminationReason: v })}>
                      <SelectTrigger className="dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                        <SelectValue placeholder="SELECT..." />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-900 dark:border-gray-700">
                        <SelectItem value="HMRC_LIST">JOB TITLE APPEARS ON HMRC LIST OF 'ROLES NORMALLY TREATED AS SELF-EMPLOYED'</SelectItem>
                        <SelectItem value="CEST_ASSESSMENT">OUR CEST ASSESSMENT HAS CONFIRMED 'OFF-PAYROLL WORKING RULES (IR35) DO NOT APPLY'</SelectItem>
                        <SelectItem value="LORIMER_LETTER">YOU HAVE SUPPLIED A VALID LORIMER LETTER</SelectItem>
                        <SelectItem value="OTHER">OTHER</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.statusDeterminationReason === 'OTHER' && (
                    <div>
                      <Label className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                        OTHER STATUS DETERMINATION REASON <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={formData.otherStatusReason}
                        onChange={(e) => setFormData({ ...formData, otherStatusReason: e.target.value.toUpperCase() })}
                        placeholder="PLEASE SPECIFY"
                        className="uppercase dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* NOTES SECTION */}
              <div>
                <h4 className="text-lg font-bold mb-4 pb-2 border-b text-purple-700 dark:text-purple-400 border-gray-200 dark:border-gray-700">
                  NOTES
                </h4>
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                      OTHER DEAL PROVISIONS
                    </Label>
                    <Textarea
                      value={formData.otherDealProvisions}
                      onChange={(e) => setFormData({ ...formData, otherDealProvisions: e.target.value.toUpperCase() })}
                      placeholder="ENTER ADDITIONAL DEAL PROVISIONS..."
                      maxLength={300}
                      className="uppercase dark:bg-gray-900 dark:border-gray-700 dark:text-white resize-none"
                      rows={3}
                    />
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formData.otherDealProvisions.length} / 300
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                      ADDITIONAL NOTES
                    </Label>
                    <Textarea
                      value={formData.additionalNotes}
                      onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value.toUpperCase() })}
                      placeholder="ENTER ADDITIONAL NOTES..."
                      maxLength={300}
                      className="uppercase dark:bg-gray-900 dark:border-gray-700 dark:text-white resize-none"
                      rows={3}
                    />
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formData.additionalNotes.length} / 300
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowNewOfferForm(false)}
                  className="px-8 py-3 rounded-lg font-bold transition-all bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 py-3 rounded-lg font-bold bg-purple-700 text-white hover:bg-purple-600 dark:hover:bg-purple-800 transition-all"
                >
                  SAVE OFFER
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl p-8 max-w-md w-full shadow-2xl bg-white dark:bg-gray-800">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Check className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>

              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                OFFER SENT SUCCESSFULLY!
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/30">
                  <Mail className="w-5 h-5 text-purple-700 dark:text-purple-400" />
                  <div className="text-left flex-1">
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      EMAIL SENT
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      TO: {formData.email}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      FROM: noreply@eaarthstudios.com
                    </p>
                  </div>
                  <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>

                <div className="flex items-center justify-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                  <Bell className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                  <div className="text-left flex-1">
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      IN-APP NOTIFICATION
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      User not on platform - Email only
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-500">
                This dialog will close automatically in 5 seconds...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectOnboarding;