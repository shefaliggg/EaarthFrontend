import { Shield } from "lucide-react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

function TimesheetTable() {
    const { week } = useParams();
    const [viewMode, setViewMode] = useState("table");
    // 'table' | 'print' | 'weekly-overview'

    const [approveViewMode, setApproveViewMode] = useState("list");
    // 'list' | 'single'

    const [isCrewSelfView, setIsCrewSelfView] = useState(false);

    /* ---------------- WEEK / ROUTING ---------------- */
    const [selectedWeek, setSelectedWeek] = useState(
        week || new Date().toISOString().split("T")[0]
    );

    /* ---------------- USER / ROLE ---------------- */
    const [currentUserRole, setCurrentUserRole] = useState("Crew");
    // Crew | HOD | Payroll | Finance | Production

    /* ---------------- CREW INFO ---------------- */
    const [selectedCrewInfo, setSelectedCrewInfo] = useState({
        firstName: "Luke",
        lastName: "Greenan",
        jobTitle: "Electrician",
        department: "Electrical",
    });

    const crewInfo = selectedCrewInfo;

    /* ---------------- TIMESHEET DATA ---------------- */
    const [entries, setEntries] = useState([]);
    const [customItems, setCustomItems] = useState([]);

    /* ---------------- PAY / CONTRACT ---------------- */
    const [crewType, setCrewType] = useState("weekly");
    const [employmentType, setEmploymentType] = useState("PAYE");
    const [companyName, setCompanyName] = useState("");

    const [allowanceCaps, setAllowanceCaps] = useState({});

    /* ---------------- UI / FLAGS ---------------- */
    const [showWorkflowGuide, setShowWorkflowGuide] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const [timesheetStatus, setTimesheetStatus] = useState("draft");

    const [viewingExpensesForWeek, setViewingExpensesForWeek] = useState(null);
    const [editingExpenses, setEditingExpenses] = useState(false);

    const [projectSettings] = useState({
        contractFramework: 'film', // 'film' | 'tv-band1' | 'tv-band2' | 'tv-band3' | 'equity' | 'custom'
        projectBudget: 50000000, // £50m
        standardWorkingWeek: 55, // Film: 55 hours / 5 days
        standardWorkingDay: 11, // Film: 11 hours + 1 hour lunch
        continuousWorkingDay: 10, // Film: 10 hours CWD
        sixthDayMultiplier: 1.5, // Film: 1.5T
        seventhDayMultiplier: 2.0, // Film: 2T
        thresholdRate: 3000, // £3000 threshold for Film PACT/BECTU
        timesheetSubmissionDeadlineDays: 2, // Days after week ending to submit timesheet
        overtimeRates: {
            cameraStandard: { enabled: true, rate: 2.0 }, // Film: 2T
            cameraContinuous: { enabled: true, rate: 1.5 }, // Film: 1.5T
            enhancedOT: { enabled: false, rate: 1.5 }, // Film: No Enhanced OT (TV only)
            preCallOT: { enabled: true, rate: 1.5 },
            postWrapOT: { enabled: true, rate: 1.5 },
        }
    });


    const getWeekStatus = (weekEnding) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const currentDayOfWeek = today.getDay();
        const daysUntilSunday = currentDayOfWeek === 0 ? 0 : 7 - currentDayOfWeek;
        const currentWeekEnding = new Date(today);
        currentWeekEnding.setDate(today.getDate() + daysUntilSunday);
        currentWeekEnding.setHours(0, 0, 0, 0);
        const selectedWeekEnding = new Date(weekEnding);
        selectedWeekEnding.setHours(0, 0, 0, 0);
        if (selectedWeekEnding.getTime() === currentWeekEnding.getTime()) return 'current';
        if (selectedWeekEnding.getTime() < currentWeekEnding.getTime()) return 'past';
        return 'future';
    };

    const canCrewSubmitWeek = (weekEnding) => {
        const weekStatus = getWeekStatus(weekEnding);

        // Crew can always submit current and future weeks
        if (weekStatus === 'current' || weekStatus === 'future') return true;

        // For past weeks, check if within deadline
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekEndingDate = new Date(weekEnding);
        weekEndingDate.setHours(0, 0, 0, 0);

        // Calculate days since week ended
        const daysSinceWeekEnded = Math.floor((today.getTime() - weekEndingDate.getTime()) / (1000 * 60 * 60 * 24));

        // Get deadline from settings (default 2 days if not set)
        const deadlineDays = projectSettings?.timesheetSubmissionDeadlineDays || 2;

        // Crew can submit if within deadline
        return daysSinceWeekEnded <= deadlineDays;
    };

    const calculateSalary = () => {
        // 1. Setup Standard Rates
        const standardDaily = crewInfo.dailyRate || 0;
        const standardHourly = crewInfo.hourlyRate || (standardDaily / 11);

        // 2. Initialize Buckets for aggregation
        // We will aggregate by "Key" (e.g. "Camera O/T") + "Rate" to group identical items
        // Structure: Map<string, { label: string, rate: number, units: number, category: string }>
        const itemsMap = new Map();

        const addToBucket = (category, label, rate, units, paidTill, paidTillColor) => {
            // Allow 0 units so we can pass mock metadata for standard fields
            // But filter out "Other O/T" if 0 to avoid clutter
            if (units <= 0 && label.includes('Other')) return;

            // Create a unique key based on label and rate to separate Standard vs Upgraded entries
            const key = `${category}_${label}_${rate.toFixed(2)}`;

            const existing = itemsMap.get(key) || { label, rate, units: 0, category, paidTill, paidTillColor };
            existing.units += units;
            itemsMap.set(key, existing);
        };

        let regularUnits = 0;

        entries.forEach(entry => {
            // Determine Rates for this Day
            const isUpgraded = entry.dayType === 'Work' && entry.isUpgraded && entry.upgradeRate > 0;
            const dailyRate = isUpgraded ? entry.upgradeRate : standardDaily;
            const hourlyRate = dailyRate / 11; // Assuming 11h day for derived hourly rate

            // Helper to distinguish items earned on upgraded days
            const labelSuffix = isUpgraded ? ` (Upgrade: ${entry.upgradeRole})` : '';

            // 1. Basic Pay / Units
            if (entry.dayType === 'Work') {
                // 6th consecutive day: count as worked but no salary (sixthDay=1, salary=0)
                if (entry.sixthDay > 0) {
                    // 6th day is worked but receives no pay (industry standard)
                    // Don't add to regularUnits or upgrade buckets
                } else if (isUpgraded) {
                    // Upgraded Day: Add to specific upgrade bucket
                    addToBucket('basic', `Upgrade: ${entry.upgradeRole}`, dailyRate, 1, "£800.00 • 2 Days • WE251025");
                } else if (entry.standardDay > 0) {
                    // Standard Day: Count towards standard units (only if standardDay is set)
                    regularUnits += 1;
                }
            }

            // 2. Overtime & Penalties (Apply specific day's rate + label suffix)
            // Camera O/T (2x)
            addToBucket('overtime', `Camera O/T${labelSuffix}`, hourlyRate * 2, entry.cameraOT, "£468.00 • 6 Hrs • WE251025");

            // Pre O/T (1.5x)
            addToBucket('overtime', `Pre O/T${labelSuffix}`, hourlyRate * 1.5, entry.preOT, "£175.50 • 3 Hrs • WE251025");

            // Post O/T (1.5x)
            addToBucket('overtime', `Post O/T${labelSuffix}`, hourlyRate * 1.5, entry.postOT, "£351.00 • 6 Hrs • WE251025");

            // BTA (1x)
            addToBucket('enhanced', `BTA${labelSuffix}`, hourlyRate, entry.bta, "£58.50 • 1.5 Hrs • WE251025");

            // Dawn (1.5x)
            addToBucket('unsoc', `Dawn / Early${labelSuffix}`, hourlyRate * 1.5, entry.dawn, "£87.75 • 1.5 Hrs • WE251025");

            // Night (1.5x)
            addToBucket('unsoc', `Night Pen${labelSuffix}`, hourlyRate * 1.5, entry.night, "£87.75 • 1.5 Hrs • WE251025");

            // Late Meal (1x)
            addToBucket('meal', `Late Meal${labelSuffix}`, hourlyRate, entry.lateMeal, "£39.00 • 1 Hr • WE251025");

            // Broken Meal (1x)
            addToBucket('meal', `Broken Meal${labelSuffix}`, hourlyRate, entry.brokenMeal, "£39.00 • 1 Hr • WE251025");

            // Travel (1x)
            addToBucket('travel', `Travel${labelSuffix}`, hourlyRate, entry.travel, "£78.00 • 2 Hrs • WE251025");

            // Other O/T (1x)
            addToBucket('overtime', `Other O/T${labelSuffix}`, hourlyRate, entry.otherOT, "£39.00 • 1 Hr • WE251025");

            // Per Diem (Flat Rate - Not affected by upgrade usually, but let's track)
            // Per Diem is usually a fixed allowance, not rate based.
            // We'll pass total separately or add here with fixed rate 1.
            if (entry.perDiem > 0) {
                addToBucket('allowance', 'Per Diem Shoot Rate', 1, entry.perDiem, "£150.00 • 5 Days • WE251025");
            }
        });

        // Convert Map to Arrays for Sidebar
        const getCategoryItems = (cat) =>
            Array.from(itemsMap.values())
                .filter(i => i.category === cat)
                .sort((a, b) => a.label.localeCompare(b.label));

        return {
            // Base Info
            standardDaily,
            standardHourly,
            regularUnits,
            salaryPaidTill: "£1,716.20 • 4 Days • WE251025",

            // Breakdowns
            breakdowns: {
                basic: getCategoryItems('basic'),
                overtime: getCategoryItems('overtime'),
                enhanced: getCategoryItems('enhanced'),
                unsoc: getCategoryItems('unsoc'),
                meal: getCategoryItems('meal'),
                travel: getCategoryItems('travel'),
                allowance: getCategoryItems('allowance'), // Per Diem mainly
            },

            // Legacy totals (for backwards compatibility if needed, though we should prefer breakdowns)
            perDiem: entries.reduce((sum, e) => sum + e.perDiem, 0)
        };
    };

    return (
        <div className="max-w-[1920px] mx-auto p-4 md:p-6 lg:p-8">
            <div className="grid grid-cols-1 gap-8 items-start">

                {/* APPROVE VIEW (Approval Workflow) */}
                {viewMode === 'table' && (
                    <div className="max-w-full overflow-x-auto space-y-6">

                        {/* Approval List or Single Crew View */}
                        {approveViewMode === 'single' ? (
                            <div className="space-y-4">
                                {/* Editable Timesheet with Approval Controls */}
                                <div className={`rounded-xl border-2 border-purple-500 p-4 shadow-2xl overflow-hidden ${isDarkMode ? 'bg-[#181621]' : 'bg-white'}`}>
                                    {(() => {
                                        const isPastWeek = getWeekStatus(selectedWeek) === 'past';

                                        // Determine if week is paid (more than 3 weeks old)
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        const weekEndingDate = new Date(selectedWeek);
                                        weekEndingDate.setHours(0, 0, 0, 0);
                                        const daysDifference = Math.floor((today.getTime() - weekEndingDate.getTime()) / (1000 * 60 * 60 * 24));
                                        const isPaidWeek = daysDifference > 21; // More than 3 weeks old = paid

                                        // Determine if the timesheet should be read-only
                                        let shouldBeReadOnly = false;
                                        if (currentUserRole === 'Crew') {
                                            // Crew can only edit if within submission deadline
                                            shouldBeReadOnly = !canCrewSubmitWeek(selectedWeek);
                                        } else if (currentUserRole === 'HOD' || currentUserRole === 'Payroll') {
                                            // HOD and Payroll can edit past weeks
                                            shouldBeReadOnly = false;
                                        } else {
                                            // Production and Finance cannot edit past weeks
                                            shouldBeReadOnly = isPastWeek;
                                        }

                                        return (
                                            <>
                                                {shouldBeReadOnly && (
                                                    <div
                                                        className={`mb-3 px-4 py-2 rounded-lg border ${isDarkMode
                                                                ? 'bg-blue-900/20 border-blue-500/30'
                                                                : 'bg-blue-50 border-blue-200'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Shield className="w-4 h-4 text-blue-600" />
                                                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                                                Read-Only View • Week Ending{" "}
                                                                {new Date(selectedWeek).toLocaleDateString("en-GB", {
                                                                    day: "2-digit",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* <SalarySidebar
                                                    isDarkMode={isDarkMode}
                                                    allowanceCaps={allowanceCaps}
                                                    setAllowanceCaps={setAllowanceCaps}
                                                    crewInfo={selectedCrewInfo}
                                                    salary={calculateSalary()}
                                                    entries={entries}
                                                    crewType={crewType}
                                                    setCrewType={setCrewType}
                                                    customItems={customItems}
                                                    setCustomItems={setCustomItems}
                                                    onEntriesUpdate={setEntries}
                                                    projectSettings={projectSettings}
                                                    calendarSchedule={calendarSchedule}
                                                    upgradeRoles={upgradeRoles}
                                                    currentUserRole={currentUserRole}
                                                    companyName={companyName}
                                                    onCrewNavigate={handleDepartmentNavigation}
                                                    onWeekNavigate={handleWeekNavigation}
                                                /> */}
                                            </>
                                        );

                                    })()}
                                </div>
                            </div>
                        ) : (
                            <div></div>
                            // <CrewListViewWithApproval
                            //     isDarkMode={isDarkMode}
                            //     crewList={mockCrewListData}
                            //     weekStart={selectedWeek}
                            //     currentUserRole={currentUserRole}
                            //     onWeekChange={(direction) => {
                            //         // Handle week navigation
                            //         const currentDate = new Date(selectedWeek);
                            //         const newDate = new Date(currentDate);

                            //         if (direction === 'prev') {
                            //             newDate.setDate(currentDate.getDate() - 7);
                            //         } else {
                            //             newDate.setDate(currentDate.getDate() + 7);
                            //         }

                            //         // Format as YYYY-MM-DD
                            //         const newWeek = newDate.toISOString().split('T')[0];
                            //         setSelectedWeek(newWeek);
                            //     }}
                            //     onCrewClick={(crew) => {
                            //         // Handle crew click - navigate to single view
                            //         const [firstName, ...lastNameParts] = crew.name.split(' ');
                            //         const lastName = lastNameParts.join(' ');

                            //         setSelectedCrewInfo({
                            //             ...selectedCrewInfo,
                            //             firstName: firstName,
                            //             lastName: lastName,
                            //             jobTitle: crew.role,
                            //             department: crew.department
                            //         });
                            //         setApproveViewMode('single');
                            //     }}
                            // />
                        )}
                    </div>
                )}

                {/* PRINT VIEW (Replaces Invoice) */}
                {/* {viewMode === 'print' && (
                    <div className="w-full overflow-x-auto bg-gray-100 p-4">
                        <TimesheetPrintView
                            entries={entries}
                            crewInfo={crewInfo}
                            salary={calculateSalary()}
                            weekEnding={selectedWeek}
                            status={timesheetStatus}
                        />
                    </div>
                )} */}

                {/* WEEKLY OVERVIEW (Crew's All Timesheets) */}
                {/* {viewMode === 'weekly-overview' && (
                    <CrewWeeklyTimesheetOverview
                        isDarkMode={isDarkMode}
                        crewName={`${crewInfo.firstName} ${crewInfo.lastName}`}
                        crewRole={crewInfo.position}
                        crewDepartment={crewInfo.department}
                        weeks={generateMockWeekData()}
                        onWeekClick={(weekEnding) => {
                            setSelectedWeek(weekEnding);
                            setViewMode('table');
                            setApproveViewMode('single');
                            setIsCrewSelfView(true); // Mark as crew viewing their own timesheet
                        }}
                        onViewExpenses={(weekEnding) => {
                            setViewingExpensesForWeek(weekEnding);
                        }}
                        onEditExpenses={(weekEnding) => {
                            setSelectedWeek(weekEnding);
                            setEditingExpenses(true);
                        }}
                        onDownloadPDF={(weekEnding) => {
                            alert(`Downloading PDF for week ending ${weekEnding}`);
                        }}
                        onBack={() => setViewMode('table')}
                    />
                )} */}

            </div>
        </div>
    )
}

export default TimesheetTable