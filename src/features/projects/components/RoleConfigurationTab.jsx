import React, { useState } from 'react';
import { Plus, Trash2, Star, Briefcase, Info } from 'lucide-react';

// JobTitleAutocomplete Component
function JobTitleAutocomplete({ department, value, onChange, placeholder }) {
    const [isOpen, setIsOpen] = useState(false);
    const [filtered, setFiltered] = useState([]);

    const jobTitles = department ? JOB_TITLES_BY_DEPARTMENT[department] || [] : [];

    const handleInput = (text) => {
        onChange(text.toUpperCase());
        setIsOpen(true);
        setFiltered(jobTitles.filter(title => title.includes(text.toUpperCase())));
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={value}
                onChange={(e) => handleInput(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9575cd]"
            />
            {isOpen && filtered.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filtered.map((title) => (
                        <button
                            key={title}
                            onClick={() => {
                                onChange(title);
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-[#ede7f6] dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        >
                            {title}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// RoleAllowancesSection Component
function RoleAllowancesSection({ allowances = {}, onChange }) {
    const [expanded, setExpanded] = useState({});

    const handleAllowanceChange = (key, value) => {
        onChange({ ...allowances, [key]: value });
    };

    return (
        <div className="space-y-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">
                Configure allowances for this role (Box rental, equipment, per diem, etc.)
            </div>
        </div>
    );
}

// Main TabbedRoleConfiguration Component
export default function RoleConfigurationTab() {
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

    const departments = [
        'ACCOUNTS', 'ACTION_VEHICLES', 'AERIAL', 'ANIMALS', 'ANIMATION', 'ARMOURY', 'ART',
        'ASSETS', 'ASSISTANT_DIRECTORS', 'CAMERA', 'CAST', 'CHAPERONES', 'CHOREOGRAPHY',
        'CLEARANCES', 'COMPUTER_GRAPHICS', 'CONSTRUCTION', 'CONTINUITY', 'COSTUME',
        'COSTUME_FX', 'COVID_SAFETY', 'CREATURE_EFFECTS', 'DIT', 'DIGITAL_ASSETS',
        'DIGITAL_PLAYBACK', 'DIRECTOR', 'DOCUMENTARY', 'DRAPES', 'EPK', 'EDITORIAL',
        'ELECTRICAL', 'ELECTRICAL_RIGGING', 'FRANCHISE', 'GREENS', 'GREENSCREENS', 'GRIP',
        'HAIR_AND_MAKEUP', 'HEALTH_AND_SAFETY', 'IT', 'LOCATIONS', 'MARINE', 'MEDICAL',
        'MILITARY', 'MUSIC', 'PHOTOGRAPHY', 'PICTURE_VEHICLES', 'POST_PRODUCTION',
        'PRODUCTION', 'PROP_MAKING', 'PROPS', 'PROSTHETICS', 'PUBLICITY', 'PUPPETEER',
        'RIGGING', 'SFX', 'SCRIPT', 'SCRIPT_EDITING', 'SECURITY', 'SET_DEC', 'SOUND',
        'STANDBY', 'STORYBOARD', 'STUDIO_UNIT', 'STUNTS', 'SUPPORTING_ARTIST',
        'SUSTAINABILITY', 'TRANSPORT', 'TUTORS', 'UNDERWATER', 'VFX', 'VIDEO', 'VOICE'
    ]

    const [activeRoleId, setActiveRoleId] = useState(jobTitles[0]?.id || '1');

    const addRole = () => {
        const newRole = {
            id: Date.now().toString(),
            isPrimary: false,
            roleName: `ROLE ${jobTitles.length + 1}`,
            unit: '',
            department: '',
            subDepartment: '',
            jobTitle: '',
            jobTitleSuffix: '',
            regularSiteOfWork: '',
            engagement: '',
            startDate: '',
            endDate: '',
            dailyOrWeekly: '',
            workingWeek: '',
            workingInUK: '',
            currency: 'GBP',
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
            allowances: {},
        };
        setJobTitles([...jobTitles, newRole]);
        setActiveRoleId(newRole.id);
    };

    const removeRole = (id) => {
        if (jobTitles.length === 1) {
            alert('YOU MUST HAVE AT LEAST ONE ROLE');
            return;
        }

        const roleToRemove = jobTitles.find(r => r.id === id);
        if (roleToRemove?.isPrimary && jobTitles.length > 1) {
            const remainingRoles = jobTitles.filter(r => r.id !== id);
            remainingRoles[0].isPrimary = true;
            setJobTitles(remainingRoles);
        } else {
            setJobTitles(jobTitles.filter(r => r.id !== id));
        }

        if (activeRoleId === id) {
            setActiveRoleId(jobTitles[0].id);
        }
    };

    const updateRole = (id, updates) => {
        setJobTitles(jobTitles.map(r => r.id === id ? { ...r, ...updates } : r));
    };

    const setPrimary = (id) => {
        setJobTitles(jobTitles.map(r => ({ ...r, isPrimary: r.id === id })));
    };

    const activeRole = jobTitles.find(r => r.id === activeRoleId) || jobTitles[0];
    const roleIndex = jobTitles.findIndex(r => r.id === activeRoleId);

    if (!activeRole) return null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-xl border-2 p-6 bg-gradient-to-br from-[#ede7f6] to-blue-50 dark:from-gray-900/30 dark:to-blue-900/30 border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Briefcase className="w-6 h-6 text-[#7e57c2] dark:text-[#7e57c2]" />
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                ROLE CONFIGURATION
                            </h4>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            {jobTitles.length === 1
                                ? 'CONFIGURE THE ROLE DETAILS BELOW'
                                : `MANAGING ${jobTitles.length} DIFFERENT ROLES - SWITCH BETWEEN TABS TO CONFIGURE EACH`}
                        </p>
                    </div>

                    <div className="px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800/50">
                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400">TOTAL ROLES</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{jobTitles.length}</p>
                    </div>
                </div>
            </div>

            {/* Role Tabs */}
            <div className="rounded-xl border-2 overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                {/* Tab Headers */}
                <div className="flex items-center border-b overflow-x-auto bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700">
                    {jobTitles.map((role, index) => (
                        <button
                            key={role.id}
                            onClick={() => setActiveRoleId(role.id)}
                            className={`px-6 py-4 font-bold text-sm border-r flex items-center gap-2 whitespace-nowrap transition-all ${activeRoleId === role.id
                                ? 'bg-[#ede7f6] dark:bg-[#7e57c2]/30 text-[#7e57c2] dark:text-[#7e57c2] border-gray-200 dark:border-gray-200'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${activeRoleId === role.id
                                ? 'bg-[#7e57c2] text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                }`}>
                                {index + 1}
                            </div>

                            {role.roleName || `ROLE ${index + 1}`}

                            {role.isPrimary && (
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                        </button>
                    ))}

                    <button
                        onClick={addRole}
                        className="px-6 py-4 font-bold text-sm flex items-center gap-2 whitespace-nowrap transition-all text-[#7e57c2] dark:text-[#7e57c2] hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        <Plus className="w-4 h-4" />
                        ADD ROLE
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {/* Role Header Actions */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={activeRole.roleName}
                                onChange={(e) => updateRole(activeRole.id, { roleName: e.target.value.toUpperCase() })}
                                placeholder="E.G., CHARGEHAND, STANDBY, RIGGING"
                                className="px-3 py-2 rounded-lg border font-bold uppercase text-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                            />

                            {activeRole.isPrimary ? (
                                <span className="px-3 py-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs font-bold flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-current" />
                                    PRIMARY ROLE
                                </span>
                            ) : (
                                <button
                                    onClick={() => setPrimary(activeRole.id)}
                                    className="px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                >
                                    <Star className="w-4 h-4" />
                                    SET AS PRIMARY
                                </button>
                            )}
                        </div>

                        {jobTitles.length > 1 && (
                            <button
                                onClick={() => removeRole(activeRole.id)}
                                className="px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50"
                            >
                                <Trash2 className="w-4 h-4" />
                                DELETE ROLE
                            </button>
                        )}
                    </div>

                    {/* Role Fields */}
                    <div className="space-y-6">
                        {/* Basic Info Section */}
                        <div>
                            <h5 className="text-sm font-bold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 text-[#7e57c2] dark:text-[#7e57c2]">
                                BASIC INFORMATION
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                                        UNIT <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={activeRole.unit}
                                        onChange={(e) => updateRole(activeRole.id, { unit: e.target.value.toUpperCase() })}
                                        placeholder="E.G., MAIN, SECOND UNIT"
                                        className="w-full px-3 py-2 rounded-lg border font-bold uppercase text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                                        DEPARTMENT <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={activeRole.department}
                                        onChange={(e) => updateRole(activeRole.id, { department: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border font-bold uppercase text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                    >
                                        <option value="">SELECT DEPARTMENT...</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                                        SUB-DEPARTMENT
                                    </label>
                                    <input
                                        type="text"
                                        value={activeRole.subDepartment}
                                        onChange={(e) => updateRole(activeRole.id, { subDepartment: e.target.value.toUpperCase() })}
                                        placeholder="OPTIONAL"
                                        className="w-full px-3 py-2 rounded-lg border font-bold uppercase text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                                        JOB TITLE <span className="text-red-500">*</span>
                                    </label>
                                    <JobTitleAutocomplete
                                        department={activeRole.department}
                                        value={activeRole.jobTitle}
                                        onChange={(jobTitle) => updateRole(activeRole.id, { jobTitle })}
                                        placeholder="TYPE TO SEARCH..."
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                                        JOB TITLE SUFFIX
                                    </label>
                                    <input
                                        type="text"
                                        value={activeRole.jobTitleSuffix}
                                        onChange={(e) => updateRole(activeRole.id, { jobTitleSuffix: e.target.value.toUpperCase() })}
                                        placeholder="E.G., 'TO CAST #1'"
                                        className="w-full px-3 py-2 rounded-lg border font-bold uppercase text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block mb-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                                        REGULAR SITE OF WORK <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={activeRole.regularSiteOfWork}
                                        onChange={(e) => updateRole(activeRole.id, { regularSiteOfWork: e.target.value.toUpperCase() })}
                                        placeholder="E.G., VARIOUS LOCATIONS"
                                        className="w-full px-3 py-2 rounded-lg border font-bold uppercase text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                                        ENGAGEMENT <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={activeRole.engagement}
                                        onChange={(e) => updateRole(activeRole.id, { engagement: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border font-bold uppercase text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                    >
                                        <option value="">SELECT...</option>
                                        <option value="PAYE">PAYE</option>
                                        <option value="LOAN OUT">LOAN OUT</option>
                                        <option value="SELF-EMPLOYED">SELF-EMPLOYED</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                                        START DATE <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={activeRole.startDate}
                                        onChange={(e) => updateRole(activeRole.id, { startDate: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border font-bold uppercase text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                                        END DATE
                                    </label>
                                    <input
                                        type="date"
                                        value={activeRole.endDate}
                                        onChange={(e) => updateRole(activeRole.id, { endDate: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border font-bold uppercase text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                                        DAILY OR WEEKLY <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={activeRole.dailyOrWeekly}
                                        onChange={(e) => updateRole(activeRole.id, { dailyOrWeekly: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border font-bold uppercase text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                    >
                                        <option value="">SELECT...</option>
                                        <option value="DAILY">DAILY</option>
                                        <option value="WEEKLY">WEEKLY</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                                        WORKING WEEK <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={activeRole.workingWeek}
                                        onChange={(e) => updateRole(activeRole.id, { workingWeek: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border font-bold uppercase text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                    >
                                        <option value="">SELECT...</option>
                                        <option value="5 DAYS">5 DAYS</option>
                                        <option value="5.5 DAYS">5.5 DAYS</option>
                                        <option value="5/6 DAYS">5/6 DAYS</option>
                                        <option value="6 DAYS">6 DAYS</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                                        WORKING IN UK <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={activeRole.workingInUK}
                                        onChange={(e) => updateRole(activeRole.id, { workingInUK: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border font-bold uppercase text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                    >
                                        <option value="">SELECT...</option>
                                        <option value="YES">YES</option>
                                        <option value="NO">NO</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Rates Section */}
                        <div>
                            <h5 className="text-sm font-bold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 text-[#7e57c2] dark:text-[#7e57c2]">
                                RATES
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                                        CURRENCY <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={activeRole.currency}
                                        onChange={(e) => updateRole(activeRole.id, { currency: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border font-bold uppercase text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                    >
                                        <option value="GBP">GBP £</option>
                                        <option value="USD">USD $</option>
                                        <option value="EUR">EUR €</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                                        FEE PER DAY <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={activeRole.feePerDay}
                                        onChange={(e) => updateRole(activeRole.id, { feePerDay: e.target.value })}
                                        placeholder="0.00"
                                        className="w-full px-3 py-2 rounded-lg border font-bold text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Overtime Section */}
                        <div>
                            <h5 className="text-sm font-bold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 text-[#7e57c2] dark:text-[#7e57c2]">
                                OVERTIME
                            </h5>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={activeRole.overtimeType === 'CALCULATED'}
                                            onChange={() => updateRole(activeRole.id, { overtimeType: 'CALCULATED' })}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                            CALCULATED PER AGREEMENT
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={activeRole.overtimeType === 'CUSTOM'}
                                            onChange={() => updateRole(activeRole.id, { overtimeType: 'CUSTOM' })}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                            CUSTOM OVERTIME RATES
                                        </span>
                                    </label>
                                </div>

                                {activeRole.overtimeType === 'CUSTOM' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg border-2 border-dashed border-gray-200 bg-[#ede7f6] dark:bg-[#7e57c2]/20">
                                        <div>
                                            <label className="block mb-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                                                NON-SHOOT OT
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={activeRole.customOT.nonShootOT}
                                                onChange={(e) => updateRole(activeRole.id, {
                                                    customOT: { ...activeRole.customOT, nonShootOT: e.target.value }
                                                })}
                                                placeholder="0.00"
                                                className="w-full px-3 py-2 rounded-lg border font-bold text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                                                SHOOT OT
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={activeRole.customOT.shootOT}
                                                onChange={(e) => updateRole(activeRole.id, {
                                                    customOT: { ...activeRole.customOT, shootOT: e.target.value }
                                                })}
                                                placeholder="0.00"
                                                className="w-full px-3 py-2 rounded-lg border font-bold text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                                                MIN HRS (6TH DAY)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.5"
                                                value={activeRole.customOT.minHrs6thDay}
                                                onChange={(e) => updateRole(activeRole.id, {
                                                    customOT: { ...activeRole.customOT, minHrs6thDay: e.target.value }
                                                })}
                                                placeholder="0"
                                                className="w-full px-3 py-2 rounded-lg border font-bold text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                                                6TH DAY HOURLY
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={activeRole.customOT.sixthDayHourly}
                                                onChange={(e) => updateRole(activeRole.id, {
                                                    customOT: { ...activeRole.customOT, sixthDayHourly: e.target.value }
                                                })}
                                                placeholder="0.00"
                                                className="w-full px-3 py-2 rounded-lg border font-bold text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                                                MIN HRS (7TH DAY)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.5"
                                                value={activeRole.customOT.minHrs7thDay}
                                                onChange={(e) => updateRole(activeRole.id, {
                                                    customOT: { ...activeRole.customOT, minHrs7thDay: e.target.value }
                                                })}
                                                placeholder="0"
                                                className="w-full px-3 py-2 rounded-lg border font-bold text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                                                7TH DAY HOURLY
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={activeRole.customOT.seventhDayHourly}
                                                onChange={(e) => updateRole(activeRole.id, {
                                                    customOT: { ...activeRole.customOT, seventhDayHourly: e.target.value }
                                                })}
                                                placeholder="0.00"
                                                className="w-full px-3 py-2 rounded-lg border font-bold text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Allowances Section */}
                        <div>
                            <h5 className="text-sm font-bold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 text-[#7e57c2] dark:text-[#7e57c2]">
                                ALLOWANCES
                            </h5>
                            <RoleAllowancesSection
                                allowances={activeRole.allowances}
                                onChange={(allowances) => updateRole(activeRole.id, { allowances })}
                            />
                        </div>

                        {/* Role Summary */}
                        {activeRole.feePerDay && (
                            <div className={`rounded-lg border-2 p-4 ${activeRole.isPrimary
                                ? 'bg-[#ede7f6] dark:bg-[#7e57c2]/20 border-gray-200 dark:border-gray-300'
                                : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'
                                }`}>
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-[#7e57c2] dark:text-[#7e57c2] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold mb-2 text-gray-600 dark:text-gray-400">
                                            ROLE SUMMARY
                                        </p>
                                        <p className="font-bold text-gray-900 dark:text-white">
                                            {activeRole.roleName || `ROLE ${roleIndex + 1}`}: {activeRole.currency} £{activeRole.feePerDay} PER {activeRole.dailyOrWeekly || 'DAY'}
                                            {activeRole.isPrimary && ' (PRIMARY ROLE)'}
                                        </p>
                                        {activeRole.department && (
                                            <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                                                {activeRole.department} • {activeRole.engagement || 'ENGAGEMENT NOT SET'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Pro Tip */}
            {jobTitles.length === 1 && (
                <div className="rounded-lg border-2 border-dashed p-4 bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-[#7e57c2] dark:text-[#7e57c2] flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold mb-1 text-gray-900 dark:text-white">
                                💡 NEED MULTIPLE ROLES?
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                CLICK "ADD ROLE" AT THE TOP TO CONFIGURE MULTIPLE POSITIONS WITH DIFFERENT RATES FOR THE SAME CREW MEMBER
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}



