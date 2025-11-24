import { useState } from 'react';
import { ArrowLeft, Info, Save, Check, Mail, Phone, Briefcase } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export default function CrewOfferConfiguration({ isDarkMode = false, onBack }) {
    const [activeTab, setActiveTab] = useState('MY OFFER');

    // Form data state
    const [formData, setFormData] = useState({
        // Recipient
        fullName: 'ASHLEIGH SHUTTLEWORTH',
        email: 'ASHLEIGH7822@GMAIL.COM',
        mobileNumber: '07917130911',
        isViaAgent: false,
        agentEmail: '',
        alternativeContract: '',

        // Unit and Department
        unit: 'MAIN',
        department: 'LOCATIONS',
        subDepartment: '',
        jobTitle: 'ASSISTANT LOCATION MANAGER',
        jobTitleSuffix: '',

        // Tax Status
        allowSelfEmployed: 'YES',
        statusDeterminationReason: '',
        otherStatusReason: '',

        // Place of Work
        regularSiteOfWork: 'OFF SET',
        workingInUK: 'YES',

        // Engagement
        startDate: '',
        endDate: '',
        dailyOrWeekly: 'WEEKLY',
        workingWeek: '5 DAYS',

        // Rates
        currency: 'GBP',
        feePerDay: '350.00',
        overtime: 'CALCULATED_PER_AGREEMENT',

        // Other
        budgetCode: '',
        otherDealProvisions: 'REGULAR BASE: FOREST OF DEAN',
        additionalNotes: 'PAYE',

        // Schedule
        standardWorkingHours: '11.0',
        hiatus1Start: '',
        hiatus1End: '',
        hiatus2Start: '',
        hiatus2End: '',
        hiatus3Start: '',
        hiatus3End: '',
        prePrepStart: '',
        prePrepEnd: '',
        prePrepTotalDays: '',
        prePrepNotes: '',
        prep1Start: '',
        prep1End: '',
        prep1Notes: '',
        block1Start: '',
        block1End: '',
        block1Notes: '',
        wrapStart: '',
        wrapEnd: '',
        wrapNotes: '',

        // Allowances - Box
        boxRental: false,
        boxDescription: '',
        boxPerWeek: '',
        boxCapType: 'FLAT_FIGURE',
        boxCap: '',
        boxCapPercentage: '',
        boxTerms: '',
        boxBudgetCode: '',
        boxPrep: false,
        boxShoot: false,
        boxWrap: false,

        // Allowances - Computer
        computerAllowance: true,
        computerPerWeek: '25.00',
        computerCapType: 'FLAT_FIGURE',
        computerCap: '250.00',
        computerCapPercentage: '',
        computerTerms: 'COMPUTER RENTAL IS REDUCED PRO-RATA ON A 5 DAY/WEEK BASIS, FOR WEEKLY HIRES.',
        computerBudgetCode: '',
        computerPrep: true,
        computerShoot: true,
        computerWrap: true,

        // Allowances - Software
        softwareAllowance: false,
        softwareDescription: '',
        softwarePerWeek: '',
        softwareCapType: 'FLAT_FIGURE',
        softwareCap: '',
        softwareCapPercentage: '',
        softwareTerms: '',
        softwareBudgetCode: '',
        softwarePrep: false,
        softwareShoot: false,
        softwareWrap: false,

        // Allowances - Equipment
        equipmentRental: false,
        equipmentDescription: '',
        equipmentPerWeek: '',
        equipmentDailyRate: '1/5',
        equipmentCapType: 'FLAT_FIGURE',
        equipmentCap: '',
        equipmentCapPercentage: '',
        equipmentTerms: '',
        equipmentBudgetCode: '',
        equipmentPrep: false,
        equipmentShoot: false,
        equipmentWrap: false,

        // Allowances - Mobile
        mobileAllowance: false,
        mobilePaidAs: 'FLAT_FEE',
        mobilePerWeek: '',
        mobileTerms: '',
        mobileBudgetCode: '',
        mobilePrep: false,
        mobileShoot: false,
        mobileWrap: false,

        // Allowances - Vehicle
        vehicleAllowance: true,
        vehiclePerWeek: '150.00',
        vehicleTerms: 'VEHICLE ALLOWANCE IS REDUCED PRO-RATA ON A 5 DAY/WEEK BASIS, FOR WEEKLY HIRES.',
        vehicleBudgetCode: '',
        vehiclePrep: true,
        vehicleShoot: true,
        vehicleWrap: true,
        vehicleHire: false,
        vehicleHireRate: '',
        vehicleHireTerms: '',
        vehicleHireBudgetCode: '',
        vehicleHirePrep: false,
        vehicleHireShoot: false,
        vehicleHireWrap: false,

        // Allowances - Per Diem 1
        perDiem1: false,
        perDiem1Currency: 'GBP',
        perDiem1ShootRate: '40.00',
        perDiem1NonShootRate: '40.00',
        perDiem1Terms: '',
        perDiem1BudgetCode: '',
        perDiem1Prep: false,
        perDiem1Shoot: false,
        perDiem1Wrap: false,

        // Allowances - Per Diem 2
        perDiem2: false,
        perDiem2Currency: 'GBP',
        perDiem2ShootRate: '40.00',
        perDiem2NonShootRate: '25.00',
        perDiem2Terms: '',
        perDiem2BudgetCode: '',
        perDiem2Prep: false,
        perDiem2Shoot: false,
        perDiem2Wrap: false,

        // Allowances - Living
        livingAllowance: false,
        livingCurrency: 'GBP',
        livingDaily: '',
        livingWeekly: '',
        livingTerms: '',
        livingBudgetCode: '',
        livingPrep: false,
        livingShoot: false,
        livingWrap: false,

        // Custom
        engagementTypeOverride: 'NO_OVERRIDE',
        contractTemplateOverride: 'DEPARTMENTAL',
        customContract: '',
        specialStips1: '',
        specialStips2: '',
        specialStips3: '',
    });

    const FormField = ({ label, required, tooltip, children }) => (
        <div>
            <label className={`block mb-2 text-sm font-bold flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {label}
                {required && <span className="text-red-500">*</span>}
                {tooltip && (
                    <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} title={tooltip}>
                        <Info className="w-4 h-4" />
                    </span>
                )}
            </label>
            {children}
        </div>
    );

    const Input = ({ value, onChange, placeholder = '', type = 'text' }) => (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            placeholder={placeholder}
            className={`w-full px-4 py-2 rounded-lg border font-bold uppercase ${isDarkMode
                ? 'bg-gray-900 border-gray-700 text-white placeholder:text-gray-500'
                : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
                }`}
        />
    );

    const Select = ({ value, onChange, options, placeholder = 'SELECT...' }) => (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border font-bold uppercase ${isDarkMode
                ? 'bg-gray-900 border-gray-700 text-white'
                : 'bg-white border-gray-200 text-gray-900'
                }`}
        >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    );

    const Textarea = ({ value, onChange, placeholder = '', maxLength = 300 }) => (
        <div>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value.toUpperCase())}
                placeholder={placeholder}
                maxLength={maxLength}
                rows={3}
                className={`w-full px-4 py-2 rounded-lg border font-bold uppercase resize-none ${isDarkMode
                    ? 'bg-gray-900 border-gray-700 text-white placeholder:text-gray-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
                    }`}
            />
            <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {value.length} / {maxLength}
            </div>
        </div>
    );

    const Checkbox = ({ checked, onChange, label }) => (
        <label className="flex items-center gap-2 cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#7e57c2] focus:ring-[#7e57c2]"
            />
            <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {label}
            </span>
        </label>
    );

    const RadioGroup = ({ value, onChange, options }) => (
        <div className="flex gap-6">
            {options.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        value={opt.value}
                        checked={value === opt.value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-4 h-4 border-gray-300 text-[#7e57c2] focus:ring-[#7e57c2]"
                    />
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {opt.label}
                    </span>
                </label>
            ))}
        </div>
    );

    return (
        <div className="space-y-6 px-2 pt-4">
            {/* Header */}
            <div className="flex items-center justify-between pr-2">
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    OFFER DETAILS OF {formData.fullName}
                </h1>
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={onBack}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        BACK TO WORKFLOW
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className={`flex items-center gap-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                {['MY OFFER', 'DETAILS', 'SCHEDULE', 'ALLOWANCES', 'CUSTOM'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-bold transition-all border-b-2 ${activeTab === tab
                            ? 'border-gray-200 text-[#7e57c2]'
                            : isDarkMode
                                ? 'border-transparent text-gray-400 hover:text-gray-200'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className={`rounded-xl border p-8 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                {/* MY OFFER TAB */}
                {activeTab === 'MY OFFER' && (
                    <div className="space-y-6">
                        {/* Offer Status Header */}
                        <div className={`p-6 rounded-xl border-2 ${isDarkMode ? 'bg-green-900/20 border-green-500' : 'bg-green-50 border-green-500'
                            }`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                        <Check className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {formData.fullName}
                                        </h2>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {formData.jobTitle}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="px-4 py-2 rounded-lg bg-green-500 text-white font-bold mb-2">
                                        OFFER PENDING
                                    </div>
                                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        LAST UPDATED: {new Date().toLocaleString('en-GB').toUpperCase()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                            }`}>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                CONTACT INFORMATION
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center gap-3">
                                    <Mail className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <div>
                                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>EMAIL</p>
                                        <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formData.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <div>
                                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>MOBILE</p>
                                        <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formData.mobileNumber}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Briefcase className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <div>
                                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>DEPARTMENT</p>
                                        <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formData.department}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Engagement Details */}
                        <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                            }`}>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                ENGAGEMENT DETAILS
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>START DATE</p>
                                    <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {formData.startDate || 'NOT SET'}
                                    </p>
                                </div>
                                <div>
                                    <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>END DATE</p>
                                    <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {formData.endDate || 'NOT SET'}
                                    </p>
                                </div>
                                <div>
                                    <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>WORKING PATTERN</p>
                                    <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {formData.dailyOrWeekly} - {formData.workingWeek}
                                    </p>
                                </div>
                                <div>
                                    <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>STANDARD HOURS</p>
                                    <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {formData.standardWorkingHours} HOURS
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Fees Summary */}
                        <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                            }`}>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                FEES SUMMARY
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className={`font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        FEE PER DAY (INCLUDING HOLIDAY)
                                    </span>
                                    <span className={`text-xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                                        £{formData.feePerDay}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={`font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        CURRENCY
                                    </span>
                                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {formData.currency}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={`font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        OVERTIME
                                    </span>
                                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {formData.overtime.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Allowances Summary */}
                        <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                            }`}>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                ALLOWANCES
                            </h3>
                            <div className="space-y-2">
                                {formData.computerAllowance && (
                                    <div className="flex justify-between items-center">
                                        <span className={`font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            💻 COMPUTER ALLOWANCE
                                        </span>
                                        <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            £{formData.computerPerWeek}/WEEK
                                        </span>
                                    </div>
                                )}
                                {formData.vehicleAllowance && (
                                    <div className="flex justify-between items-center">
                                        <span className={`font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            🚗 VEHICLE ALLOWANCE
                                        </span>
                                        <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            £{formData.vehiclePerWeek}/WEEK
                                        </span>
                                    </div>
                                )}
                                {!formData.computerAllowance && !formData.vehicleAllowance && (
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                        NO ALLOWANCES CONFIGURED
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Additional Notes */}
                        {(formData.otherDealProvisions || formData.additionalNotes) && (
                            <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                                }`}>
                                <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                    }`}>
                                    ADDITIONAL INFORMATION
                                </h3>
                                {formData.otherDealProvisions && (
                                    <div className="mb-4">
                                        <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                            OTHER DEAL PROVISIONS
                                        </p>
                                        <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {formData.otherDealProvisions}
                                        </p>
                                    </div>
                                )}
                                {formData.additionalNotes && (
                                    <div>
                                        <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                            ADDITIONAL NOTES
                                        </p>
                                        <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {formData.additionalNotes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* DETAILS TAB */}
                {activeTab === 'DETAILS' && (
                    <div className="space-y-8">
                        {/* Recipient */}
                        <div>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                RECIPIENT
                            </h3>
                            <div className="space-y-4">
                                <FormField label="FULL NAME" required>
                                    <Input
                                        value={formData.fullName}
                                        onChange={(v) => setFormData({ ...formData, fullName: v })}
                                    />
                                </FormField>

                                <FormField
                                    label="EMAIL"
                                    required
                                    tooltip="Ensure this is the recipient's preferred email address for use on their engine account"
                                >
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(v) => setFormData({ ...formData, email: v })}
                                    />
                                </FormField>

                                <FormField label="MOBILE NUMBER" required>
                                    <Input
                                        type="tel"
                                        value={formData.mobileNumber}
                                        onChange={(v) => setFormData({ ...formData, mobileNumber: v })}
                                    />
                                </FormField>

                                <Checkbox
                                    checked={formData.isViaAgent}
                                    onChange={(v) => setFormData({ ...formData, isViaAgent: v })}
                                    label="CHECK THE BOX IF THIS DEAL IS VIA AN AGENT"
                                />

                                {formData.isViaAgent && (
                                    <FormField label="AGENT EMAIL">
                                        <Input
                                            type="email"
                                            value={formData.agentEmail}
                                            onChange={(v) => setFormData({ ...formData, agentEmail: v })}
                                        />
                                    </FormField>
                                )}

                                <FormField label="ALTERNATIVE CONTRACT">
                                    <Select
                                        value={formData.alternativeContract}
                                        onChange={(v) => setFormData({ ...formData, alternativeContract: v })}
                                        options={[
                                            { value: 'HOD', label: 'HOD' },
                                            { value: 'NO_CONTRACT', label: 'NO CONTRACT (ALL OTHER DOCUMENTS TO BE PROCESSED)' },
                                            { value: 'SENIOR_AGREEMENT', label: 'SENIOR AGREEMENT' }
                                        ]}
                                    />
                                </FormField>
                            </div>
                        </div>

                        {/* Unit and Department */}
                        <div>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                UNIT AND DEPARTMENT
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="UNIT">
                                    <Select
                                        value={formData.unit}
                                        onChange={(v) => setFormData({ ...formData, unit: v })}
                                        options={[
                                            { value: 'MAIN', label: 'MAIN' },
                                            { value: 'SPLINTER_CAMERA', label: 'SPLINTER CAMERA' }
                                        ]}
                                    />
                                </FormField>

                                <FormField label="DEPARTMENT">
                                    <Select
                                        value={formData.department}
                                        onChange={(v) => setFormData({ ...formData, department: v })}
                                        options={[
                                            { value: 'LOCATIONS', label: 'LOCATIONS' },
                                            { value: 'CAMERA', label: 'CAMERA' },
                                            { value: 'ART', label: 'ART' },
                                            { value: 'PRODUCTION', label: 'PRODUCTION' }
                                        ]}
                                    />
                                </FormField>

                                <FormField label="SUB-DEPARTMENT">
                                    <Select
                                        value={formData.subDepartment}
                                        onChange={(v) => setFormData({ ...formData, subDepartment: v })}
                                        options={[
                                            { value: 'NEW', label: 'NEW' }
                                        ]}
                                    />
                                </FormField>
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                ROLE
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="JOB TITLE">
                                    <Input
                                        value={formData.jobTitle}
                                        onChange={(v) => setFormData({ ...formData, jobTitle: v })}
                                    />
                                </FormField>

                                <FormField label="JOB TITLE SUFFIX">
                                    <Input
                                        value={formData.jobTitleSuffix}
                                        onChange={(v) => setFormData({ ...formData, jobTitleSuffix: v })}
                                    />
                                </FormField>
                            </div>
                        </div>

                        {/* Tax Status */}
                        <div>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                TAX STATUS
                            </h3>
                            <div className="space-y-4">
                                <FormField label="ALLOW AS SELF-EMPLOYED OR LOAN OUT?" required>
                                    <RadioGroup
                                        value={formData.allowSelfEmployed}
                                        onChange={(v) => setFormData({ ...formData, allowSelfEmployed: v })}
                                        options={[
                                            { value: 'YES', label: 'YES' },
                                            { value: 'NO', label: 'NO' }
                                        ]}
                                    />
                                </FormField>

                                {formData.allowSelfEmployed === 'YES' && (
                                    <FormField label="STATUS DETERMINATION REASON" required>
                                        <Select
                                            value={formData.statusDeterminationReason}
                                            onChange={(v) => setFormData({ ...formData, statusDeterminationReason: v })}
                                            options={[
                                                { value: 'HMRC_LIST', label: "JOB TITLE APPEARS ON HMRC LIST OF 'ROLES NORMALLY TREATED AS SELF-EMPLOYED'" },
                                                { value: 'CEST_ASSESSMENT', label: "OUR CEST ASSESSMENT HAS CONFIRMED 'OFF-PAYROLL WORKING RULES (IR35) DO NOT APPLY'" },
                                                { value: 'LORIMER_LETTER', label: 'YOU HAVE SUPPLIED A VALID LORIMER LETTER' },
                                                { value: 'OTHER', label: 'OTHER' }
                                            ]}
                                        />
                                    </FormField>
                                )}
                            </div>
                        </div>

                        {/* Place of Work */}
                        <div>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                PLACE OF WORK
                            </h3>
                            <div className="space-y-4">
                                <FormField label="REGULAR SITE OF WORK (ON SHOOT DAYS)" tooltip="On set = crew whose overtime is calculated based on the shooting day. Off set = crew whose overtime is always based on a SWD.">
                                    <Select
                                        value={formData.regularSiteOfWork}
                                        onChange={(v) => setFormData({ ...formData, regularSiteOfWork: v })}
                                        options={[
                                            { value: 'ON_SET', label: 'ON SET' },
                                            { value: 'OFF_SET', label: 'OFF SET' }
                                        ]}
                                    />
                                </FormField>

                                <FormField label="WORKING IN THE UK?" tooltip="Yes = recipient will be required to submit sufficient proof of Right to Work in the UK.">
                                    <RadioGroup
                                        value={formData.workingInUK}
                                        onChange={(v) => setFormData({ ...formData, workingInUK: v })}
                                        options={[
                                            { value: 'YES', label: 'YES' },
                                            { value: 'NEVER', label: 'NEVER' }
                                        ]}
                                    />
                                </FormField>
                            </div>
                        </div>

                        {/* Engagement */}
                        <div>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                ENGAGEMENT
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="START DATE">
                                    <Input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(v) => setFormData({ ...formData, startDate: v })}
                                    />
                                </FormField>

                                <FormField label="END DATE" tooltip="The End date will appear in the contract if your templates have a slot for it.">
                                    <Input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(v) => setFormData({ ...formData, endDate: v })}
                                    />
                                </FormField>

                                <FormField label="DAILY OR WEEKLY">
                                    <Select
                                        value={formData.dailyOrWeekly}
                                        onChange={(v) => setFormData({ ...formData, dailyOrWeekly: v })}
                                        options={[
                                            { value: 'DAILY', label: 'DAILY' },
                                            { value: 'WEEKLY', label: 'WEEKLY' }
                                        ]}
                                    />
                                </FormField>

                                <FormField label="WORKING WEEK">
                                    <Select
                                        value={formData.workingWeek}
                                        onChange={(v) => setFormData({ ...formData, workingWeek: v })}
                                        options={[
                                            { value: '5 DAYS', label: '5 DAYS' },
                                            { value: '5.5 DAYS', label: '5.5 DAYS' },
                                            { value: '5/6 DAYS', label: '5/6 DAYS' },
                                            { value: '6 DAYS', label: '6 DAYS' }
                                        ]}
                                    />
                                </FormField>
                            </div>
                        </div>

                        {/* Rates */}
                        <div>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                RATES
                            </h3>
                            <div className="space-y-4">
                                <FormField label="CURRENCY">
                                    <Select
                                        value={formData.currency}
                                        onChange={(v) => setFormData({ ...formData, currency: v })}
                                        options={[
                                            { value: 'GBP', label: 'GBP' },
                                            { value: 'USD', label: 'USD' },
                                            { value: 'EUR', label: 'EUR' }
                                        ]}
                                    />
                                </FormField>

                                <FormField label="FEE PER DAY INCLUDING HOLIDAY">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>£</span>
                                        <Input
                                            value={formData.feePerDay}
                                            onChange={(v) => setFormData({ ...formData, feePerDay: v })}
                                        />
                                    </div>
                                </FormField>

                                <FormField label="OVERTIME">
                                    <RadioGroup
                                        value={formData.overtime}
                                        onChange={(v) => setFormData({ ...formData, overtime: v })}
                                        options={[
                                            { value: 'CALCULATED_PER_AGREEMENT', label: 'CALCULATED PER AGREEMENT' },
                                            { value: 'CUSTOM_OVERTIME_RATES', label: 'CUSTOM OVERTIME RATES' }
                                        ]}
                                    />
                                </FormField>
                            </div>
                        </div>

                        {/* Other */}
                        <div>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                OTHER
                            </h3>
                            <div className="space-y-4">
                                <FormField label="BUDGET CODE">
                                    <Input
                                        value={formData.budgetCode}
                                        onChange={(v) => setFormData({ ...formData, budgetCode: v })}
                                    />
                                </FormField>

                                <FormField label="OTHER DEAL PROVISIONS">
                                    <Textarea
                                        value={formData.otherDealProvisions}
                                        onChange={(v) => setFormData({ ...formData, otherDealProvisions: v })}
                                        maxLength={300}
                                    />
                                </FormField>

                                <FormField label="ADDITIONAL NOTES">
                                    <Textarea
                                        value={formData.additionalNotes}
                                        onChange={(v) => setFormData({ ...formData, additionalNotes: v })}
                                        maxLength={300}
                                    />
                                </FormField>
                            </div>
                        </div>
                    </div>
                )}

                {/* SCHEDULE TAB */}
                {activeTab === 'SCHEDULE' && (
                    <div className="space-y-8">
                        {/* Hours */}
                        <div>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                HOURS
                            </h3>
                            <FormField label="STANDARD WORKING HOURS">
                                <Select
                                    value={formData.standardWorkingHours}
                                    onChange={(v) => setFormData({ ...formData, standardWorkingHours: v })}
                                    options={[
                                        { value: '12.0', label: '12.0 (CONTINUOUS)' },
                                        { value: '11.0', label: '11.0 (PROJECT DEFAULT)' },
                                        { value: '10.0', label: '10.0' },
                                        { value: '9.0', label: '9.0' },
                                        { value: '8.0', label: '8.0' }
                                    ]}
                                />
                            </FormField>
                            <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                DEPARTMENT OVERTIME DEFAULTS: CAMERA O/T = NO, OTHER O/T = 30 BEFORE, 30 AFTER
                            </p>
                        </div>

                        {/* Hiatus 1-3 */}
                        {[1, 2, 3].map((num) => (
                            <div key={num}>
                                <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                    }`}>
                                    HIATUS {num}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField label={`HIATUS ${num} START`}>
                                        <Input type="date" value="" onChange={() => { }} />
                                    </FormField>
                                    <FormField label={`HIATUS ${num} END`}>
                                        <Input type="date" value="" onChange={() => { }} />
                                    </FormField>
                                </div>
                            </div>
                        ))}

                        {/* Pre Prep */}
                        <div>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                PRE PREP
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="PRE PREP START">
                                    <Input type="date" value={formData.prePrepStart} onChange={(v) => setFormData({ ...formData, prePrepStart: v })} />
                                </FormField>
                                <FormField label="PRE PREP END">
                                    <Input type="date" value={formData.prePrepEnd} onChange={(v) => setFormData({ ...formData, prePrepEnd: v })} />
                                </FormField>
                                <FormField label="PRE PREP TOTAL DAYS">
                                    <Input value={formData.prePrepTotalDays} onChange={(v) => setFormData({ ...formData, prePrepTotalDays: v })} />
                                </FormField>
                            </div>
                            <div className="mt-4">
                                <FormField label="PRE PREP NOTES">
                                    <Textarea value={formData.prePrepNotes} onChange={(v) => setFormData({ ...formData, prePrepNotes: v })} />
                                </FormField>
                            </div>
                        </div>

                        {/* Blocks 1-6 */}
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                            <div key={num}>
                                <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                    }`}>
                                    BLOCK {num}
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField label={`PREP ${num} START`}>
                                            <Input type="date" value="" onChange={() => { }} />
                                        </FormField>
                                        <FormField label={`PREP ${num} END`}>
                                            <Input type="date" value="" onChange={() => { }} />
                                        </FormField>
                                    </div>
                                    <FormField label={`PREP ${num} NOTES`}>
                                        <Textarea value="" onChange={() => { }} />
                                    </FormField>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField label={`BLOCK ${num} START`}>
                                            <Input type="date" value="" onChange={() => { }} />
                                        </FormField>
                                        <FormField label={`BLOCK ${num} END`}>
                                            <Input type="date" value="" onChange={() => { }} />
                                        </FormField>
                                    </div>
                                    <FormField label={`BLOCK ${num} NOTES`}>
                                        <Textarea value="" onChange={() => { }} />
                                    </FormField>
                                </div>
                            </div>
                        ))}

                        {/* Wrap */}
                        <div>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                WRAP
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="WRAP START">
                                    <Input type="date" value={formData.wrapStart} onChange={(v) => setFormData({ ...formData, wrapStart: v })} />
                                </FormField>
                                <FormField label="WRAP END">
                                    <Input type="date" value={formData.wrapEnd} onChange={(v) => setFormData({ ...formData, wrapEnd: v })} />
                                </FormField>
                            </div>
                            <div className="mt-4">
                                <FormField label="WRAP NOTES">
                                    <Textarea value={formData.wrapNotes} onChange={(v) => setFormData({ ...formData, wrapNotes: v })} />
                                </FormField>
                            </div>
                        </div>
                    </div>
                )}

                {/* ALLOWANCES TAB */}
                {activeTab === 'ALLOWANCES' && (
                    <div className="space-y-8">
                        {/* Box */}
                        <div>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                BOX
                            </h3>
                            <div className="space-y-4">
                                <Checkbox
                                    checked={formData.boxRental}
                                    onChange={(v) => setFormData({ ...formData, boxRental: v })}
                                    label="BOX RENTAL?"
                                />
                                {formData.boxRental && (
                                    <>
                                        <FormField label="BOX DESCRIPTION">
                                            <Input value={formData.boxDescription} onChange={(v) => setFormData({ ...formData, boxDescription: v })} />
                                        </FormField>
                                        <FormField label="BOX ALLOWANCE PER WEEK">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>£</span>
                                                <Input value={formData.boxPerWeek} onChange={(v) => setFormData({ ...formData, boxPerWeek: v })} />
                                            </div>
                                        </FormField>
                                        <FormField label="BOX ALLOWANCE CAP">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>£</span>
                                                <Input value={formData.boxCap} onChange={(v) => setFormData({ ...formData, boxCap: v })} />
                                            </div>
                                        </FormField>
                                        <FormField label="BOX ALLOWANCE CAP PERCENTAGE">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>%</span>
                                                <Input value={formData.boxCapPercentage} onChange={(v) => setFormData({ ...formData, boxCapPercentage: v })} />
                                            </div>
                                        </FormField>
                                        <FormField label="BOX ALLOWANCE TERMS">
                                            <Textarea value={formData.boxTerms} onChange={(v) => setFormData({ ...formData, boxTerms: v })} maxLength={250} />
                                        </FormField>
                                        <FormField label="PAYABLE IN">
                                            <div className="flex gap-4">
                                                <Checkbox checked={formData.boxPrep} onChange={(v) => setFormData({ ...formData, boxPrep: v })} label="PREP" />
                                                <Checkbox checked={formData.boxShoot} onChange={(v) => setFormData({ ...formData, boxShoot: v })} label="SHOOT" />
                                                <Checkbox checked={formData.boxWrap} onChange={(v) => setFormData({ ...formData, boxWrap: v })} label="WRAP" />
                                            </div>
                                        </FormField>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Computer */}
                        <div>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                COMPUTER
                            </h3>
                            <div className="space-y-4">
                                <Checkbox
                                    checked={formData.computerAllowance}
                                    onChange={(v) => setFormData({ ...formData, computerAllowance: v })}
                                    label="COMPUTER ALLOWANCE?"
                                />
                                {formData.computerAllowance && (
                                    <>
                                        <FormField label="COMPUTER ALLOWANCE PER WEEK">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>£</span>
                                                <Input value={formData.computerPerWeek} onChange={(v) => setFormData({ ...formData, computerPerWeek: v })} />
                                            </div>
                                        </FormField>
                                        <FormField label="COMPUTER ALLOWANCE CAP">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>£</span>
                                                <Input value={formData.computerCap} onChange={(v) => setFormData({ ...formData, computerCap: v })} />
                                            </div>
                                        </FormField>
                                        <FormField label="COMPUTER ALLOWANCE CAP PERCENTAGE">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>%</span>
                                                <Input value={formData.computerCapPercentage} onChange={(v) => setFormData({ ...formData, computerCapPercentage: v })} />
                                            </div>
                                        </FormField>
                                        <FormField label="COMPUTER ALLOWANCE TERMS">
                                            <Textarea value={formData.computerTerms} onChange={(v) => setFormData({ ...formData, computerTerms: v })} maxLength={250} />
                                        </FormField>
                                        <FormField label="PAYABLE IN">
                                            <div className="flex gap-4">
                                                <Checkbox checked={formData.computerPrep} onChange={(v) => setFormData({ ...formData, computerPrep: v })} label="PREP" />
                                                <Checkbox checked={formData.computerShoot} onChange={(v) => setFormData({ ...formData, computerShoot: v })} label="SHOOT" />
                                                <Checkbox checked={formData.computerWrap} onChange={(v) => setFormData({ ...formData, computerWrap: v })} label="WRAP" />
                                            </div>
                                        </FormField>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Software */}
                        <div>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                SOFTWARE
                            </h3>
                            <div className="space-y-4">
                                <Checkbox
                                    checked={formData.softwareAllowance}
                                    onChange={(v) => setFormData({ ...formData, softwareAllowance: v })}
                                    label="SOFTWARE ALLOWANCE?"
                                />
                                {formData.softwareAllowance && (
                                    <>
                                        <FormField label="SOFTWARE DESCRIPTION">
                                            <Input value={formData.softwareDescription} onChange={(v) => setFormData({ ...formData, softwareDescription: v })} />
                                        </FormField>
                                        <FormField label="SOFTWARE ALLOWANCE PER WEEK">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>£</span>
                                                <Input value={formData.softwarePerWeek} onChange={(v) => setFormData({ ...formData, softwarePerWeek: v })} />
                                            </div>
                                        </FormField>
                                        <FormField label="SOFTWARE ALLOWANCE CAP">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>£</span>
                                                <Input value={formData.softwareCap} onChange={(v) => setFormData({ ...formData, softwareCap: v })} />
                                            </div>
                                        </FormField>
                                        <FormField label="SOFTWARE ALLOWANCE CAP PERCENTAGE">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>%</span>
                                                <Input value={formData.softwareCapPercentage} onChange={(v) => setFormData({ ...formData, softwareCapPercentage: v })} />
                                            </div>
                                        </FormField>
                                        <FormField label="SOFTWARE ALLOWANCE TERMS">
                                            <Textarea value={formData.softwareTerms} onChange={(v) => setFormData({ ...formData, softwareTerms: v })} maxLength={250} />
                                        </FormField>
                                        <FormField label="PAYABLE IN">
                                            <div className="flex gap-4">
                                                <Checkbox checked={formData.softwarePrep} onChange={(v) => setFormData({ ...formData, softwarePrep: v })} label="PREP" />
                                                <Checkbox checked={formData.softwareShoot} onChange={(v) => setFormData({ ...formData, softwareShoot: v })} label="SHOOT" />
                                                <Checkbox checked={formData.softwareWrap} onChange={(v) => setFormData({ ...formData, softwareWrap: v })} label="WRAP" />
                                            </div>
                                        </FormField>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Equipment */}
                        <div>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                EQUIPMENT
                            </h3>
                            <div className="space-y-4">
                                <Checkbox
                                    checked={formData.equipmentRental}
                                    onChange={(v) => setFormData({ ...formData, equipmentRental: v })}
                                    label="EQUIPMENT RENTAL?"
                                />
                                {formData.equipmentRental && (
                                    <>
                                        <FormField label="EQUIPMENT DESCRIPTION">
                                            <Input value={formData.equipmentDescription} onChange={(v) => setFormData({ ...formData, equipmentDescription: v })} />
                                        </FormField>
                                        <FormField label="EQUIPMENT ALLOWANCE PER WEEK">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>£</span>
                                                <Input value={formData.equipmentPerWeek} onChange={(v) => setFormData({ ...formData, equipmentPerWeek: v })} />
                                            </div>
                                        </FormField>
                                        <FormField label="EQUIPMENT DAILY RATE">
                                            <Input value={formData.equipmentDailyRate} onChange={(v) => setFormData({ ...formData, equipmentDailyRate: v })} />
                                        </FormField>
                                        <FormField label="EQUIPMENT ALLOWANCE CAP">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>£</span>
                                                <Input value={formData.equipmentCap} onChange={(v) => setFormData({ ...formData, equipmentCap: v })} />
                                            </div>
                                        </FormField>
                                        <FormField label="EQUIPMENT ALLOWANCE CAP PERCENTAGE">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>%</span>
                                                <Input value={formData.equipmentCapPercentage} onChange={(v) => setFormData({ ...formData, equipmentCapPercentage: v })} />
                                            </div>
                                        </FormField>
                                        <FormField label="EQUIPMENT ALLOWANCE TERMS">
                                            <Textarea value={formData.equipmentTerms} onChange={(v) => setFormData({ ...formData, equipmentTerms: v })} maxLength={250} />
                                        </FormField>
                                        <FormField label="PAYABLE IN">
                                            <div className="flex gap-4">
                                                <Checkbox checked={formData.equipmentPrep} onChange={(v) => setFormData({ ...formData, equipmentPrep: v })} label="PREP" />
                                                <Checkbox checked={formData.equipmentShoot} onChange={(v) => setFormData({ ...formData, equipmentShoot: v })} label="SHOOT" />
                                                <Checkbox checked={formData.equipmentWrap} onChange={(v) => setFormData({ ...formData, equipmentWrap: v })} label="WRAP" />
                                            </div>
                                        </FormField>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Mobile */}
                        <div>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                MOBILE
                            </h3>
                            <div className="space-y-4">
                                <Checkbox
                                    checked={formData.mobileAllowance}
                                    onChange={(v) => setFormData({ ...formData, mobileAllowance: v })}
                                    label="MOBILE ALLOWANCE?"
                                />
                                {formData.mobileAllowance && (
                                    <>
                                        <FormField label="MOBILE PAID AS">
                                            <Select
                                                value={formData.mobilePaidAs}
                                                onChange={(v) => setFormData({ ...formData, mobilePaidAs: v })}
                                                options={[
                                                    { value: 'FLAT_FEE', label: 'FLAT FEE' },
                                                    { value: 'HOURLY_RATE', label: 'HOURLY RATE' }
                                                ]}
                                            />
                                        </FormField>
                                        <FormField label="MOBILE ALLOWANCE PER WEEK">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>£</span>
                                                <Input value={formData.mobilePerWeek} onChange={(v) => setFormData({ ...formData, mobilePerWeek: v })} />
                                            </div>
                                        </FormField>
                                        <FormField label="MOBILE ALLOWANCE TERMS">
                                            <Textarea value={formData.mobileTerms} onChange={(v) => setFormData({ ...formData, mobileTerms: v })} maxLength={250} />
                                        </FormField>
                                        <FormField label="PAYABLE IN">
                                            <div className="flex gap-4">
                                                <Checkbox checked={formData.mobilePrep} onChange={(v) => setFormData({ ...formData, mobilePrep: v })} label="PREP" />
                                                <Checkbox checked={formData.mobileShoot} onChange={(v) => setFormData({ ...formData, mobileShoot: v })} label="SHOOT" />
                                                <Checkbox checked={formData.mobileWrap} onChange={(v) => setFormData({ ...formData, mobileWrap: v })} label="WRAP" />
                                            </div>
                                        </FormField>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Vehicle */}
                        <div>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                VEHICLE
                            </h3>
                            <div className="space-y-4">
                                <Checkbox
                                    checked={formData.vehicleAllowance}
                                    onChange={(v) => setFormData({ ...formData, vehicleAllowance: v })}
                                    label="VEHICLE ALLOWANCE?"
                                />
                                {formData.vehicleAllowance && (
                                    <>
                                        <FormField label="VEHICLE ALLOWANCE PER WEEK">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>£</span>
                                                <Input value={formData.vehiclePerWeek} onChange={(v) => setFormData({ ...formData, vehiclePerWeek: v })} />
                                            </div>
                                        </FormField>
                                        <FormField label="VEHICLE ALLOWANCE TERMS">
                                            <Textarea value={formData.vehicleTerms} onChange={(v) => setFormData({ ...formData, vehicleTerms: v })} maxLength={250} />
                                        </FormField>
                                        <FormField label="PAYABLE IN">
                                            <div className="flex gap-4">
                                                <Checkbox checked={formData.vehiclePrep} onChange={(v) => setFormData({ ...formData, vehiclePrep: v })} label="PREP" />
                                                <Checkbox checked={formData.vehicleShoot} onChange={(v) => setFormData({ ...formData, vehicleShoot: v })} label="SHOOT" />
                                                <Checkbox checked={formData.vehicleWrap} onChange={(v) => setFormData({ ...formData, vehicleWrap: v })} label="WRAP" />
                                            </div>
                                        </FormField>
                                    </>
                                )}

                                <Checkbox
                                    checked={formData.vehicleHire}
                                    onChange={(v) => setFormData({ ...formData, vehicleHire: v })}
                                    label="VEHICLE HIRE?"
                                />
                                {formData.vehicleHire && (
                                    <>
                                        <FormField label="VEHICLE HIRE RATE">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>£</span>
                                                <Input value={formData.vehicleHireRate} onChange={(v) => setFormData({ ...formData, vehicleHireRate: v })} />
                                            </div>
                                        </FormField>
                                        <FormField label="VEHICLE HIRE TERMS">
                                            <Textarea value={formData.vehicleHireTerms} onChange={(v) => setFormData({ ...formData, vehicleHireTerms: v })} maxLength={250} />
                                        </FormField>
                                        <FormField label="PAYABLE IN">
                                            <div className="flex gap-4">
                                                <Checkbox checked={formData.vehicleHirePrep} onChange={(v) => setFormData({ ...formData, vehicleHirePrep: v })} label="PREP" />
                                                <Checkbox checked={formData.vehicleHireShoot} onChange={(v) => setFormData({ ...formData, vehicleHireShoot: v })} label="SHOOT" />
                                                <Checkbox checked={formData.vehicleHireWrap} onChange={(v) => setFormData({ ...formData, vehicleHireWrap: v })} label="WRAP" />
                                            </div>
                                        </FormField>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Per Diem 1 */}
                        <div>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                PER DIEM 1
                            </h3>
                            <div className="space-y-4">
                                <Checkbox
                                    checked={formData.perDiem1}
                                    onChange={(v) => setFormData({ ...formData, perDiem1: v })}
                                    label="PER DIEM 1?"
                                />
                                {formData.perDiem1 && (
                                    <>
                                        <FormField label="PER DIEM 1 CURRENCY">
                                            <Select
                                                value={formData.perDiem1Currency}
                                                onChange={(v) => setFormData({ ...formData, perDiem1Currency: v })}
                                                options={[
                                                    { value: 'GBP', label: 'GBP' },
                                                    { value: 'USD', label: 'USD' },
                                                    { value: 'EUR', label: 'EUR' }
                                                ]}
                                            />
                                        </FormField>
                                        <FormField label="PER DIEM 1 SHOOT RATE">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>£</span>
                                                <Input value={formData.perDiem1ShootRate} onChange={(v) => setFormData({ ...formData, perDiem1ShootRate: v })} />
                                            </div>
                                        </FormField>
                                        <FormField label="PER DIEM 1 NON-SHOOT RATE">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>£</span>
                                                <Input value={formData.perDiem1NonShootRate} onChange={(v) => setFormData({ ...formData, perDiem1NonShootRate: v })} />
                                            </div>
                                        </FormField>
                                        <FormField label="PER DIEM 1 TERMS">
                                            <Textarea value={formData.perDiem1Terms} onChange={(v) => setFormData({ ...formData, perDiem1Terms: v })} maxLength={250} />
                                        </FormField>
                                        <FormField label="PAYABLE IN">
                                            <div className="flex gap-4">
                                                <Checkbox checked={formData.perDiem1Prep} onChange={(v) => setFormData({ ...formData, perDiem1Prep: v })} label="PREP" />
                                                <Checkbox checked={formData.perDiem1Shoot} onChange={(v) => setFormData({ ...formData, perDiem1Shoot: v })} label="SHOOT" />
                                                <Checkbox checked={formData.perDiem1Wrap} onChange={(v) => setFormData({ ...formData, perDiem1Wrap: v })} label="WRAP" />
                                            </div>
                                        </FormField>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Per Diem 2 */}
                        <div>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                PER DIEM 2
                            </h3>
                            <div className="space-y-4">
                                <Checkbox
                                    checked={formData.perDiem2}
                                    onChange={(v) => setFormData({ ...formData, perDiem2: v })}
                                    label="PER DIEM 2?"
                                />
                                {formData.perDiem2 && (
                                    <>
                                        <FormField label="PER DIEM 2 CURRENCY">
                                            <Select
                                                value={formData.perDiem2Currency}
                                                onChange={(v) => setFormData({ ...formData, perDiem2Currency: v })}
                                                options={[
                                                    { value: 'GBP', label: 'GBP' },
                                                    { value: 'USD', label: 'USD' },
                                                    { value: 'EUR', label: 'EUR' }
                                                ]}
                                            />
                                        </FormField>
                                        <FormField label="PER DIEM 2 SHOOT RATE">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>£</span>
                                                <Input value={formData.perDiem2ShootRate} onChange={(v) => setFormData({ ...formData, perDiem2ShootRate: v })} />
                                            </div>
                                        </FormField>
                                        <FormField label="PER DIEM 2 NON-SHOOT RATE">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>£</span>
                                                <Input value={formData.perDiem2NonShootRate} onChange={(v) => setFormData({ ...formData, perDiem2NonShootRate: v })} />
                                            </div>
                                        </FormField>
                                        <FormField label="PER DIEM 2 TERMS">
                                            <Textarea value={formData.perDiem2Terms} onChange={(v) => setFormData({ ...formData, perDiem2Terms: v })} maxLength={250} />
                                        </FormField>
                                        <FormField label="PAYABLE IN">
                                            <div className="flex gap-4">
                                                <Checkbox checked={formData.perDiem2Prep} onChange={(v) => setFormData({ ...formData, perDiem2Prep: v })} label="PREP" />
                                                <Checkbox checked={formData.perDiem2Shoot} onChange={(v) => setFormData({ ...formData, perDiem2Shoot: v })} label="SHOOT" />
                                                <Checkbox checked={formData.perDiem2Wrap} onChange={(v) => setFormData({ ...formData, perDiem2Wrap: v })} label="WRAP" />
                                            </div>
                                        </FormField>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Living */}
                        <div>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                LIVING
                            </h3>
                            <div className="space-y-4">
                                <Checkbox
                                    checked={formData.livingAllowance}
                                    onChange={(v) => setFormData({ ...formData, livingAllowance: v })}
                                    label="LIVING ALLOWANCE?"
                                />
                                {formData.livingAllowance && (
                                    <>
                                        <FormField label="LIVING CURRENCY">
                                            <Select
                                                value={formData.livingCurrency}
                                                onChange={(v) => setFormData({ ...formData, livingCurrency: v })}
                                                options={[
                                                    { value: 'GBP', label: 'GBP' },
                                                    { value: 'USD', label: 'USD' },
                                                    { value: 'EUR', label: 'EUR' }
                                                ]}
                                            />
                                        </FormField>
                                        <FormField label="LIVING DAILY">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>£</span>
                                                <Input value={formData.livingDaily} onChange={(v) => setFormData({ ...formData, livingDaily: v })} />
                                            </div>
                                        </FormField>
                                        <FormField label="LIVING WEEKLY">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>£</span>
                                                <Input value={formData.livingWeekly} onChange={(v) => setFormData({ ...formData, livingWeekly: v })} />
                                            </div>
                                        </FormField>
                                        <FormField label="LIVING TERMS">
                                            <Textarea value={formData.livingTerms} onChange={(v) => setFormData({ ...formData, livingTerms: v })} maxLength={250} />
                                        </FormField>
                                        <FormField label="PAYABLE IN">
                                            <div className="flex gap-4">
                                                <Checkbox checked={formData.livingPrep} onChange={(v) => setFormData({ ...formData, livingPrep: v })} label="PREP" />
                                                <Checkbox checked={formData.livingShoot} onChange={(v) => setFormData({ ...formData, livingShoot: v })} label="SHOOT" />
                                                <Checkbox checked={formData.livingWrap} onChange={(v) => setFormData({ ...formData, livingWrap: v })} label="WRAP" />
                                            </div>
                                        </FormField>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* CUSTOM TAB */}
                {activeTab === 'CUSTOM' && (
                    <div className="space-y-8">
                        {/* Engagement Type */}
                        <div>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                ENGAGEMENT TYPE
                            </h3>
                            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                CURRENT ENGAGEMENT TYPE: PAYE
                            </p>
                            <FormField label="OVERRIDE TO:">
                                <RadioGroup
                                    value={formData.engagementTypeOverride}
                                    onChange={(v) => setFormData({ ...formData, engagementTypeOverride: v })}
                                    options={[
                                        { value: 'PAYE', label: 'PAYE' },
                                        { value: 'SELF_EMPLOYED', label: 'SELF-EMPLOYED' },
                                        { value: 'NO_OVERRIDE', label: 'NO OVERRIDE' }
                                    ]}
                                />
                            </FormField>
                        </div>

                        {/* Contract Template */}
                        <div>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                CONTRACT TEMPLATE
                            </h3>
                            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                CURRENT CONTRACT TEMPLATE: PAYE
                            </p>
                            <FormField label="OVERRIDE TO:">
                                <RadioGroup
                                    value={formData.contractTemplateOverride}
                                    onChange={(v) => setFormData({ ...formData, contractTemplateOverride: v })}
                                    options={[
                                        { value: 'DEPARTMENTAL', label: 'DEPARTMENTAL' },
                                        { value: 'STANDARD_CREW', label: 'STANDARD CREW' }
                                    ]}
                                />
                            </FormField>
                        </div>

                        {/* Special Stips */}
                        <div>
                            <h3 className={`text-lg font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-[#b39ddb] border-gray-700' : 'text-[#7e57c2] border-gray-200'
                                }`}>
                                AVAILABLE CUSTOM FIELDS
                            </h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map((num) => (
                                    <FormField key={num} label={`SPECIAL STIPS ${num}`}>
                                        <Textarea value="" onChange={() => { }} maxLength={500} />
                                    </FormField>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
                    <Button
                        className="bg-[#7e57c2] hover:bg-[#7e57c2] text-white px-8 py-3"
                        onClick={() => {
                            alert('OFFER SAVED SUCCESSFULLY');
                        }}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        SAVE OFFER
                    </Button>
                </div>
            </div>
        </div>
    );
}




