import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ApprovalWorkflowGuide } from "../components/ApprovalWorkflowGuide";

function TimesheetTable() {
    const { week } = useParams();

    /* ---------------- CORE VIEW STATE ---------------- */
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

    return (
        <div className="max-w-[1920px] mx-auto p-4 md:p-6 lg:p-8">
            <div className="grid grid-cols-1 gap-8 items-start">

                {/* APPROVE VIEW (Approval Workflow) */}
                {viewMode === 'table' && (
                    <div className="max-w-full overflow-x-auto space-y-6">

                        {/* Approval List or Single Crew View */}
                        {/* {approveViewMode === 'single' ? (
                            <div className="space-y-4">
                                {/* Clean Single Crew Header
                                <CrewSingleViewHeader
                                    isDarkMode={isDarkMode}
                                    onBack={() => {
                                        if (isCrewSelfView) {
                                            setViewMode('weekly-overview');
                                            setIsCrewSelfView(false);
                                        } else {
                                            setApproveViewMode('list');
                                        }
                                    }}
                                    onCrewSelect={(crewName) => {
                                        const crew = allCrewMembers.find(c => c.name === crewName);
                                        if (crew) {
                                            const [firstName, ...lastNameParts] = crew.name.split(' ');
                                            const lastName = lastNameParts.join(' ');
                                            setSelectedCrewInfo({
                                                ...selectedCrewInfo,
                                                firstName: firstName,
                                                lastName: lastName,
                                                jobTitle: crew.role,
                                                department: crew.department
                                            });
                                        }
                                    }}
                                    onDepartmentChange={(dept) => {
                                        const firstCrewInDept = allCrewMembers.find(c => c.department === dept);
                                        if (firstCrewInDept) {
                                            const [firstName, ...lastNameParts] = firstCrewInDept.name.split(' ');
                                            const lastName = lastNameParts.join(' ');
                                            setSelectedCrewInfo({
                                                ...selectedCrewInfo,
                                                firstName: firstName,
                                                lastName: lastName,
                                                jobTitle: firstCrewInDept.role,
                                                department: firstCrewInDept.department
                                            });
                                        }
                                    }}
                                    currentCrewName={`${selectedCrewInfo.firstName} ${selectedCrewInfo.lastName}`}
                                    currentJobTitle={selectedCrewInfo.jobTitle}
                                    currentPaymentType={(mockCrewListData.find(c => c.name === `${selectedCrewInfo.firstName} ${selectedCrewInfo.lastName}`)?.contractType || 'Weekly')}
                                    currentContractType={(mockCrewListData.find(c => c.name === `${selectedCrewInfo.firstName} ${selectedCrewInfo.lastName}`)?.contractCategory || 'PAYE')}
                                    department={selectedCrewInfo.department}
                                    availableDepartments={Array.from(new Set(allCrewMembers.map(c => c.department))).sort()}
                                    departmentCrewMembers={allCrewMembers
                                        .filter(c => c.department === selectedCrewInfo.department)
                                        .map(c => {
                                            const mockCrew = mockCrewListData.find(mc => mc.name === c.name);
                                            return {
                                                name: c.name,
                                                jobTitle: c.role,
                                                paymentType: (mockCrew?.contractType || 'Weekly'),
                                                contractType: (mockCrew?.contractCategory || 'PAYE')
                                            };
                                        })}
                                    onWeekChange={(direction) => {
                                        const currentDate = new Date(selectedWeek);
                                        const newDate = new Date(currentDate);
                                        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
                                        const newWeek = newDate.toISOString().split('T')[0];
                                        setSelectedWeek(newWeek);
                                    }}
                                    weekEnding={selectedWeek}
                                    weekStatus={(() => {
                                        const today = new Date();
                                        const weekDate = new Date(selectedWeek);
                                        const diffTime = weekDate.getTime() - today.getTime();
                                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                        if (Math.abs(diffDays) <= 7) return 'current';
                                        if (diffDays < -7) return 'past';
                                        return 'future';
                                    })()}
                                    holidayInc={mockCrewListData.find(c => c.name === `${selectedCrewInfo.firstName} ${selectedCrewInfo.lastName}`)?.holidayInc}
                                    auditLog={[
                                        {
                                            timestamp: '2025-12-14 10:23 AM',
                                            action: 'Timesheet Submitted',
                                            user: `${selectedCrewInfo.firstName} ${selectedCrewInfo.lastName}`,
                                            role: 'Crew'
                                        },
                                        {
                                            timestamp: '2025-12-14 02:45 PM',
                                            action: 'HOD Approved',
                                            user: 'Michael Chen',
                                            role: 'HOD - Camera'
                                        }
                                    ]}
                                    onPaymentTypeChange={(type) => {
                                        setCrewType(type === 'Weekly' ? 'weekly' : 'daily');
                                    }}
                                    onEmploymentTypeChange={(type) => {
                                        setEmploymentType(type);
                                    }}
                                    onCompanyNameChange={(name) => {
                                        setCompanyName(name);
                                    }}
                                    employmentType={employmentType}
                                    companyName={companyName}
                                    currentUserRole={currentUserRole}
                                    onRoleChange={setCurrentUserRole}
                                />

                                {/* Editable Timesheet with Approval Controls
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

                                        return shouldBeReadOnly ? (
                                            <TimesheetReadOnlyView
                                                isDarkMode={isDarkMode}
                                                weekEnding={selectedWeek}
                                                isPaid={isPaidWeek}
                                            >
                                                <SalarySidebar
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
                                                    readOnly={true}
                                                    isPaid={isPaidWeek}
                                                    contractCategory={(mockCrewListData.find(c => c.name === `${selectedCrewInfo.firstName} ${selectedCrewInfo.lastName}`)?.contractCategory || 'PAYE')}
                                                    companyName={companyName}
                                                    onCrewNavigate={handleDepartmentNavigation}
                                                    onCrewSelect={(crewName) => {
                                                        const [firstName, ...lastNameParts] = crewName.split(' ');
                                                        const lastName = lastNameParts.join(' ');
                                                        const crewData = mockCrewListData.find(c => c.name === crewName);
                                                        setSelectedCrewInfo({
                                                            ...selectedCrewInfo,
                                                            firstName: firstName,
                                                            lastName: lastName,
                                                            jobTitle: crewData?.role || selectedCrewInfo.jobTitle,
                                                            department: crewData?.department || selectedCrewInfo.department
                                                        });
                                                    }}
                                                    departmentCrewMembers={allCrewMembers
                                                        .filter(c => c.department === selectedCrewInfo.department)
                                                        .map(c => ({ name: c.name, role: c.role }))
                                                    }
                                                    canNavigatePrev={(() => {
                                                        const sameDeptCrew = allCrewMembers.filter(c => c.department === selectedCrewInfo.department);
                                                        const currentIndex = sameDeptCrew.findIndex(c => c.name === `${selectedCrewInfo.firstName} ${selectedCrewInfo.lastName}`);
                                                        return currentIndex > 0;
                                                    })()}
                                                    canNavigateNext={(() => {
                                                        const sameDeptCrew = allCrewMembers.filter(c => c.department === selectedCrewInfo.department);
                                                        const currentIndex = sameDeptCrew.findIndex(c => c.name === `${selectedCrewInfo.firstName} ${selectedCrewInfo.lastName}`);
                                                        return currentIndex < sameDeptCrew.length - 1;
                                                    })()}
                                                    onDepartmentNavigate={handleChangeDepartment}
                                                    onDepartmentSelect={(dept) => {
                                                        const firstCrewInDept = allCrewMembers.find(c => c.department === dept);
                                                        if (firstCrewInDept) {
                                                            const [firstName, ...lastNameParts] = firstCrewInDept.name.split(' ');
                                                            const lastName = lastNameParts.join(' ');
                                                            setSelectedCrewInfo({
                                                                ...selectedCrewInfo,
                                                                firstName: firstName,
                                                                lastName: lastName,
                                                                jobTitle: firstCrewInDept.role,
                                                                department: firstCrewInDept.department
                                                            });
                                                        }
                                                    }}
                                                    allDepartments={Array.from(new Set(allCrewMembers.map(c => c.department))).sort()}
                                                    canNavigatePrevDept={(() => {
                                                        const departments = Array.from(new Set(allCrewMembers.map(c => c.department))).sort();
                                                        const currentIndex = departments.indexOf(selectedCrewInfo.department);
                                                        return currentIndex > 0;
                                                    })()}
                                                    canNavigateNextDept={(() => {
                                                        const departments = Array.from(new Set(allCrewMembers.map(c => c.department))).sort();
                                                        const currentIndex = departments.indexOf(selectedCrewInfo.department);
                                                        return currentIndex < departments.length - 1;
                                                    })()}
                                                    onWeekNavigate={handleWeekNavigation}
                                                    onWeekSelect={(weekFormatted) => {
                                                        // Convert formatted week back to ISO date
                                                        const allWeeks = getAllWeeks();
                                                        const formattedWeeks = allWeeks.map(w => formatWeekEnding(w));
                                                        const index = formattedWeeks.indexOf(weekFormatted);
                                                        if (index !== -1) {
                                                            setSelectedWeek(allWeeks[index]);
                                                        }
                                                    }}
                                                    availableWeeks={getAllWeeks().map(w => formatWeekEnding(w))}
                                                    currentWeek={formatWeekEnding(selectedWeek)}
                                                    canNavigatePrevWeek={(() => {
                                                        const allWeeks = getAllWeeks();
                                                        const currentIndex = allWeeks.indexOf(selectedWeek);
                                                        return currentIndex > 0;
                                                    })()}
                                                    canNavigateNextWeek={(() => {
                                                        const allWeeks = getAllWeeks();
                                                        const currentIndex = allWeeks.indexOf(selectedWeek);
                                                        return currentIndex < allWeeks.length - 1;
                                                    })()}
                                                />
                                            </TimesheetReadOnlyView>
                                        ) : (
                                            <SalarySidebar
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
                                                contractCategory={(mockCrewListData.find(c => c.name === `${selectedCrewInfo.firstName} ${selectedCrewInfo.lastName}`)?.contractCategory || 'PAYE')}
                                                companyName={companyName}
                                                onCrewNavigate={handleDepartmentNavigation}
                                                onCrewSelect={(crewName) => {
                                                    const [firstName, ...lastNameParts] = crewName.split(' ');
                                                    const lastName = lastNameParts.join(' ');
                                                    const crewData = mockCrewListData.find(c => c.name === crewName);
                                                    setSelectedCrewInfo({
                                                        ...selectedCrewInfo,
                                                        firstName: firstName,
                                                        lastName: lastName,
                                                        jobTitle: crewData?.role || selectedCrewInfo.jobTitle,
                                                        department: crewData?.department || selectedCrewInfo.department
                                                    });
                                                }}
                                                departmentCrewMembers={allCrewMembers
                                                    .filter(c => c.department === selectedCrewInfo.department)
                                                    .map(c => ({ name: c.name, role: c.role }))
                                                }
                                                canNavigatePrev={(() => {
                                                    const sameDeptCrew = allCrewMembers.filter(c => c.department === selectedCrewInfo.department);
                                                    const currentIndex = sameDeptCrew.findIndex(c => c.name === `${selectedCrewInfo.firstName} ${selectedCrewInfo.lastName}`);
                                                    return currentIndex > 0;
                                                })()}
                                                canNavigateNext={(() => {
                                                    const sameDeptCrew = allCrewMembers.filter(c => c.department === selectedCrewInfo.department);
                                                    const currentIndex = sameDeptCrew.findIndex(c => c.name === `${selectedCrewInfo.firstName} ${selectedCrewInfo.lastName}`);
                                                    return currentIndex < sameDeptCrew.length - 1;
                                                })()}
                                                onDepartmentNavigate={handleChangeDepartment}
                                                onDepartmentSelect={(dept) => {
                                                    const firstCrewInDept = allCrewMembers.find(c => c.department === dept);
                                                    if (firstCrewInDept) {
                                                        const [firstName, ...lastNameParts] = firstCrewInDept.name.split(' ');
                                                        const lastName = lastNameParts.join(' ');
                                                        setSelectedCrewInfo({
                                                            ...selectedCrewInfo,
                                                            firstName: firstName,
                                                            lastName: lastName,
                                                            jobTitle: firstCrewInDept.role,
                                                            department: firstCrewInDept.department
                                                        });
                                                    }
                                                }}
                                                allDepartments={Array.from(new Set(allCrewMembers.map(c => c.department))).sort()}
                                                canNavigatePrevDept={(() => {
                                                    const departments = Array.from(new Set(allCrewMembers.map(c => c.department))).sort();
                                                    const currentIndex = departments.indexOf(selectedCrewInfo.department);
                                                    return currentIndex > 0;
                                                })()}
                                                canNavigateNextDept={(() => {
                                                    const departments = Array.from(new Set(allCrewMembers.map(c => c.department))).sort();
                                                    const currentIndex = departments.indexOf(selectedCrewInfo.department);
                                                    return currentIndex < departments.length - 1;
                                                })()}
                                                onWeekNavigate={handleWeekNavigation}
                                                onWeekSelect={(weekFormatted) => {
                                                    // Convert formatted week back to ISO date
                                                    const allWeeks = getAllWeeks();
                                                    const formattedWeeks = allWeeks.map(w => formatWeekEnding(w));
                                                    const index = formattedWeeks.indexOf(weekFormatted);
                                                    if (index !== -1) {
                                                        setSelectedWeek(allWeeks[index]);
                                                    }
                                                }}
                                                availableWeeks={getAllWeeks().map(w => formatWeekEnding(w))}
                                                currentWeek={formatWeekEnding(selectedWeek)}
                                                canNavigatePrevWeek={(() => {
                                                    const allWeeks = getAllWeeks();
                                                    const currentIndex = allWeeks.indexOf(selectedWeek);
                                                    return currentIndex > 0;
                                                })()}
                                                canNavigateNextWeek={(() => {
                                                    const allWeeks = getAllWeeks();
                                                    const currentIndex = allWeeks.indexOf(selectedWeek);
                                                    return currentIndex < allWeeks.length - 1;
                                                })()}
                                            />
                                        );
                                    })()}
                                </div>
                            </div>
                        ) : (
                            <CrewListViewWithApproval
                                isDarkMode={isDarkMode}
                                crewList={mockCrewListData}
                                weekStart={selectedWeek}
                                currentUserRole={currentUserRole}
                                onWeekChange={(direction) => {
                                    // Handle week navigation
                                    const currentDate = new Date(selectedWeek);
                                    const newDate = new Date(currentDate);

                                    if (direction === 'prev') {
                                        newDate.setDate(currentDate.getDate() - 7);
                                    } else {
                                        newDate.setDate(currentDate.getDate() + 7);
                                    }

                                    // Format as YYYY-MM-DD
                                    const newWeek = newDate.toISOString().split('T')[0];
                                    setSelectedWeek(newWeek);
                                }}
                                onCrewClick={(crew) => {
                                    // Handle crew click - navigate to single view
                                    const [firstName, ...lastNameParts] = crew.name.split(' ');
                                    const lastName = lastNameParts.join(' ');

                                    setSelectedCrewInfo({
                                        ...selectedCrewInfo,
                                        firstName: firstName,
                                        lastName: lastName,
                                        jobTitle: crew.role,
                                        department: crew.department
                                    });
                                    setApproveViewMode('single');
                                }}
                            />
                        )} */}
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