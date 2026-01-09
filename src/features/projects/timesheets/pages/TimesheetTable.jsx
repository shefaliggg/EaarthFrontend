import { Shield } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { generateMockCrewData } from "../config/mockCrewData(temp)";
import { TimesheetForm } from "../components/TimesheetTable/TimesheetForm";

function TimesheetTable() {
    const { week } = useParams();
    const [viewMode, setViewMode] = useState("table");
    // 'table' | 'print' | 'weekly-overview'

    const [approveViewMode, setApproveViewMode] = useState("single");
    // 'list' | 'single'

    const [isCrewSelfView, setIsCrewSelfView] = useState(true);

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

    const getDaysForWeek = (weekEndingDate) => {
        const end = new Date(weekEndingDate);
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(end);
            d.setDate(end.getDate() - i);
            days.push({
                date: d.toISOString().split('T')[0],
                day: d.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase(),
                dayNum: d.getDate(),
                month: d.toLocaleDateString('en-GB', { month: 'short' }),
                year: d.getFullYear(),
                label: d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()
            });
        }
        return days;
    };
    const daysOfWeek = useMemo(() => getDaysForWeek(selectedWeek), [selectedWeek]);

    const mockData = generateMockCrewData();
    const [allCrewMembers] = useState(mockData.map(crew => ({
        id: crew.id,
        name: crew.name,
        role: crew.role,
        department: crew.department
    })));
    const [mockCrewListData] = useState(generateMockCrewData());

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

    const [calendarSchedule, setCalendarSchedule] = useState({
        // Week 1 (Dec 2-8, 2025)
        '2025-12-02': { unit: 'Main', unitCall: '07:00', unitWrap: '17:30', workingHours: '10 (CWD)', cameraOT: '0.5', dayType: 'Shoot', dayNumber: 48, workplaces: ['Shepperton Studios'], set: 'Stage 7', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Studio Day - Stage 7' },
        '2025-12-03': { unit: 'Main', unitCall: '07:00', unitWrap: '18:15', workingHours: '10 (CWD)', cameraOT: '1.25', dayType: 'Shoot', dayNumber: 49, workplaces: ['Shepperton Studios'], set: 'Stage 7', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:30', mealEnd: '14:30', notes: 'Studio Day - Stage 7' },
        '2025-12-04': { unit: 'Main', unitCall: '08:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '0.0', dayType: 'Shoot', dayNumber: 50, workplaces: ['Sky Studios Elstree'], set: 'Stage 2', travelTo: '0.25', travelToPaid: 'Paid', travelFrom: '0.25', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Move to Elstree' },
        '2025-12-05': { unit: 'Main', unitCall: '07:30', unitWrap: '17:30', workingHours: '10 (CWD)', cameraOT: '0.0', dayType: 'Shoot', dayNumber: 51, workplaces: ['Sky Studios Elstree'], set: 'Stage 2', travelTo: '0.25', travelToPaid: 'Paid', travelFrom: '0.25', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Elstree - Stage 2' },
        '2025-12-06': { unit: 'Main', unitCall: '12:00', unitWrap: '22:30', workingHours: '10 (CWD)', cameraOT: '0.5', dayType: 'Shoot', dayNumber: 52, workplaces: ['Sky Studios Elstree'], set: 'Stage 2', travelTo: '0.25', travelToPaid: 'Paid', travelFrom: '0.25', travelFromPaid: 'Paid', mealStart: '18:00', mealEnd: '19:00', notes: 'Night Shoot - Elstree Stage 2', nightPenalty: 'Paid', nightPenaltyPaid: 'Paid' },
        '2025-12-07': { dayType: 'Rest', dayNumber: '-' },
        '2025-12-08': { dayType: 'Rest', dayNumber: '-' },

        // Week 2 (Dec 9-15, 2025) - Current week
        '2025-12-09': { unit: 'Main', unitCall: '06:00', unitWrap: '17:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 53, workplaces: ['Bourne Wood'], set: 'Exterior', travelTo: '0.5', travelToPaid: 'Paid', travelFrom: '0.5', travelFromPaid: 'Paid', mealStart: '12:30', mealEnd: '13:30', notes: 'Forest location shoot - Early call', dawn: 'Paid' },
        '2025-12-10': { unit: 'Main', unitCall: '06:30', unitWrap: '17:30', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 54, workplaces: ['Bourne Wood'], set: 'Exterior', travelTo: '0.5', travelToPaid: 'Paid', travelFrom: '0.5', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Bourne Wood - Continuation' },
        '2025-12-11': { unit: 'Main', unitCall: '07:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 55, workplaces: ['Crychan Forest'], set: 'Exterior', travelTo: '1.5', travelToPaid: 'Paid', travelFrom: '1.5', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Wales location - Travel allowance' },
        '2025-12-12': { unit: 'Main', unitCall: '07:00', unitWrap: '18:30', workingHours: '10 (CWD)', cameraOT: '1.5', dayType: 'Shoot', dayNumber: 56, workplaces: ['Crychan Forest'], set: 'Exterior', travelTo: '1.5', travelToPaid: 'Paid', travelFrom: '1.5', travelFromPaid: 'Paid', mealStart: '13:30', mealEnd: '14:30', notes: 'Wales - Day 2' },
        '2025-12-13': { unit: 'Main', unitCall: '14:00', unitWrap: '01:00', unitCallNextDay: false, unitWrapNextDay: true, workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 57, workplaces: ['Brecon Beacons'], set: 'Exterior', travelTo: '1.0', travelToPaid: 'Paid', travelFrom: '1.0', travelFromPaid: 'Paid', mealStart: '20:00', mealEnd: '21:00', mealStartNextDay: false, mealEndNextDay: false, notes: 'Night exterior - Brecon', nightPenalty: 'Paid', nightPenaltyPaid: 'Paid' },
        '2025-12-14': { dayType: 'Rest', dayNumber: '-' },
        '2025-12-15': { dayType: 'Rest', dayNumber: '-' },

        // Week 3 (Dec 16-22, 2025)
        '2025-12-16': { unit: 'Main', unitCall: '08:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '0.0', dayType: 'Shoot', dayNumber: 58, workplaces: ['Shepperton Studios'], set: 'Stage 7', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Back to Studio - Stage 7' },
        '2025-12-17': { unit: 'Main', unitCall: '08:00', unitWrap: '18:30', workingHours: '10 (CWD)', cameraOT: '0.5', dayType: 'Shoot', dayNumber: 59, workplaces: ['Shepperton Studios'], set: 'Stage 7', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Studio - Stage 7' },
        '2025-12-18': { unit: 'Main', unitCall: '08:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '0.0', dayType: 'Shoot', dayNumber: 60, workplaces: ['Shepperton Studios'], set: 'Stage 7', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Studio - Stage 7' },
        '2025-12-19': { unit: 'Main', unitCall: '08:00', unitWrap: '20:00', workingHours: '10 (CWD)', cameraOT: '2.0', dayType: 'Shoot', dayNumber: 61, workplaces: ['Shepperton Studios'], set: 'Stage 7', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '14:00', mealEnd: '15:00', lateMeal: '1.0', lateMealPaid: 'Paid', notes: 'Long day - VFX sequence' },
        '2025-12-20': { unit: 'Main', unitCall: '08:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '0.0', dayType: 'Shoot', dayNumber: 62, workplaces: ['Shepperton Studios'], set: 'Stage 7', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Studio - Stage 7' },
        '2025-12-21': { dayType: 'Rest', dayNumber: '-' },
        '2025-12-22': { dayType: 'Rest', dayNumber: '-' },

        // Week 4 (Dec 23-29, 2025) - Holiday Break
        '2025-12-23': { dayType: 'Rest', dayNumber: '-', notes: 'Holiday Break' },
        '2025-12-24': { dayType: 'Rest', dayNumber: '-', notes: 'Christmas Eve', isPublicHoliday: true },
        '2025-12-25': { dayType: 'Rest', dayNumber: '-', notes: 'Christmas Day', isPublicHoliday: true },
        '2025-12-26': { dayType: 'Rest', dayNumber: '-', notes: 'Boxing Day', isPublicHoliday: true },
        '2025-12-27': { dayType: 'Rest', dayNumber: '-', notes: 'Holiday Break' },
        '2025-12-28': { dayType: 'Rest', dayNumber: '-', notes: 'Holiday Break' },
        '2025-12-29': { dayType: 'Rest', dayNumber: '-', notes: 'Holiday Break' },

        // Week 5 (Dec 30, 2025 - Jan 5, 2026) - Holiday/Prep Week
        '2025-12-30': { unit: 'Main', unitCall: '09:00', unitWrap: '17:00', workingHours: '8 (CWD)', cameraOT: '0.0', dayType: 'Shoot', dayNumber: 63, workplaces: ['Warner Bros. Studios Leavesden'], set: 'Stage 12', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Prep/Rehearsal Day' },
        '2025-12-31': { dayType: 'Rest', dayNumber: '-', notes: 'New Years Eve' },
        '2026-01-01': { dayType: 'Rest', dayNumber: '-', notes: 'New Years Day', isPublicHoliday: true },
        '2026-01-02': { unit: 'Main', unitCall: '07:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 64, workplaces: ['Warner Bros. Studios Leavesden'], set: 'Stage 12', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Back to work - Stage 12' },
        '2026-01-03': { unit: 'Main', unitCall: '07:00', unitWrap: '17:30', workingHours: '10 (CWD)', cameraOT: '0.5', dayType: 'Shoot', dayNumber: 65, workplaces: ['Warner Bros. Studios Leavesden'], set: 'Stage 12', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Stage 12 - Interior' },
        '2026-01-04': { dayType: 'Rest', dayNumber: '-' },
        '2026-01-05': { dayType: 'Rest', dayNumber: '-' },

        // Week 6 (Jan 6-12, 2026)
        '2026-01-06': { unit: 'Main', unitCall: '07:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 66, workplaces: ['Warner Bros. Studios Leavesden'], set: 'Stage 12', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Stage 12 - Continues' },
        '2026-01-07': { unit: 'Main', unitCall: '07:30', unitWrap: '18:30', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 67, workplaces: ['Warner Bros. Studios Leavesden'], set: 'Stage 12', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:30', mealEnd: '14:30', notes: 'Stage 12' },
        '2026-01-08': { unit: 'Main', unitCall: '08:00', unitWrap: '19:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 68, workplaces: ['Warner Bros. Studios Leavesden'], set: 'Stage 12', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Stage 12' },
        '2026-01-09': { unit: 'Main', unitCall: '07:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 69, workplaces: ['Warner Bros. Studios Leavesden'], set: 'Stage 12', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Stage 12' },
        '2026-01-10': { unit: 'Main', unitCall: '07:00', unitWrap: '17:30', workingHours: '10 (CWD)', cameraOT: '0.5', dayType: 'Shoot', dayNumber: 70, workplaces: ['Warner Bros. Studios Leavesden'], set: 'Stage 12', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Stage 12' },
        '2026-01-11': { dayType: 'Rest', dayNumber: '-' },
        '2026-01-12': { dayType: 'Rest', dayNumber: '-' },

        // Week 7 (Jan 13-19, 2026)
        '2026-01-13': { unit: 'Main', unitCall: '06:00', unitWrap: '17:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 71, workplaces: ['Black Park'], set: 'Exterior', travelTo: '0.25', travelToPaid: 'Paid', travelFrom: '0.25', travelFromPaid: 'Paid', mealStart: '12:30', mealEnd: '13:30', notes: 'Location shoot - Early call', dawn: 'Paid' },
        '2026-01-14': { unit: 'Main', unitCall: '07:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 72, workplaces: ['Black Park'], set: 'Exterior', travelTo: '0.25', travelToPaid: 'Paid', travelFrom: '0.25', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Black Park - Day 2' },
        '2026-01-15': { unit: 'Main', unitCall: '08:00', unitWrap: '19:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 73, workplaces: ['Black Park'], set: 'Exterior', travelTo: '0.25', travelToPaid: 'Paid', travelFrom: '0.25', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Black Park - Final day' },
        '2026-01-16': { unit: 'Main', unitCall: '07:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 74, workplaces: ['Pinewood Studios'], set: 'Stage 5', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Move to Pinewood - Stage 5' },
        '2026-01-17': { unit: 'Main', unitCall: '08:00', unitWrap: '20:00', workingHours: '10 (CWD)', cameraOT: '2.0', dayType: 'Shoot', dayNumber: 75, workplaces: ['Pinewood Studios'], set: 'Stage 5', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '14:00', mealEnd: '15:00', lateMeal: '1.0', lateMealPaid: 'Paid', notes: 'Long day - Action sequence' },
        '2026-01-18': { dayType: 'Rest', dayNumber: '-' },
        '2026-01-19': { dayType: 'Rest', dayNumber: '-' },

        // Week 8 (Jan 20-26, 2026)
        '2026-01-20': { unit: 'Main', unitCall: '07:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 76, workplaces: ['Pinewood Studios'], set: 'Stage 5', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Pinewood - Stage 5' },
        '2026-01-21': { unit: 'Main', unitCall: '07:30', unitWrap: '18:30', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 77, workplaces: ['Pinewood Studios'], set: 'Stage 5', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:30', mealEnd: '14:30', notes: 'Pinewood - Stage 5' },
        '2026-01-22': { unit: 'Main', unitCall: '08:00', unitWrap: '19:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 78, workplaces: ['Pinewood Studios'], set: 'Stage 5', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Pinewood - Stage 5' },
        '2026-01-23': { unit: 'Main', unitCall: '13:00', unitWrap: '00:00', unitCallNextDay: false, unitWrapNextDay: true, workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 79, workplaces: ['Pinewood Studios'], set: 'Stage 5', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '19:00', mealEnd: '20:00', mealStartNextDay: false, mealEndNextDay: false, notes: 'Night shoot - Pinewood Stage 5', nightPenalty: 'Paid', nightPenaltyPaid: 'Paid' },
        '2026-01-24': { unit: 'Main', unitCall: '08:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '0.0', dayType: 'Shoot', dayNumber: 80, workplaces: ['Pinewood Studios'], set: 'Stage 5', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Pinewood - Stage 5' },
        '2026-01-25': { dayType: 'Rest', dayNumber: '-' },
        '2026-01-26': { dayType: 'Rest', dayNumber: '-' },

        // Week 9 (Jan 27-31, 2026) - Final week of January
        '2026-01-27': { unit: 'Main', unitCall: '07:00', unitWrap: '17:00', workingHours: '10 (CWD)', cameraOT: '0.0', dayType: 'Shoot', dayNumber: 81, workplaces: ['Ealing Studios'], set: 'Stage 1', travelTo: '0.25', travelToPaid: 'Paid', travelFrom: '0.25', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Move to Ealing - Stage 1' },
        '2026-01-28': { unit: 'Main', unitCall: '07:30', unitWrap: '18:30', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 82, workplaces: ['Ealing Studios'], set: 'Stage 1', travelTo: '0.25', travelToPaid: 'Paid', travelFrom: '0.25', travelFromPaid: 'Paid', mealStart: '13:30', mealEnd: '14:30', notes: 'Ealing - Stage 1 Interior' },
        '2026-01-29': { unit: 'Main', unitCall: '08:00', unitWrap: '19:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 83, workplaces: ['Ealing Studios'], set: 'Stage 1', travelTo: '0.25', travelToPaid: 'Paid', travelFrom: '0.25', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Ealing - Stage 1' },
        '2026-01-30': { unit: 'Main', unitCall: '07:00', unitWrap: '20:00', workingHours: '10 (CWD)', cameraOT: '3.0', dayType: 'Shoot', dayNumber: 84, workplaces: ['Ealing Studios'], set: 'Stage 1', travelTo: '0.25', travelToPaid: 'Paid', travelFrom: '0.25', travelFromPaid: 'Paid', mealStart: '14:00', mealEnd: '15:00', lateMeal: '1.0', lateMealPaid: 'Paid', notes: 'Long day - Climax sequence' },
        '2026-01-31': { unit: 'Main', unitCall: '08:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '0.0', dayType: 'Shoot', dayNumber: 85, workplaces: ['Ealing Studios'], set: 'Stage 1', travelTo: '0.25', travelToPaid: 'Paid', travelFrom: '0.25', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Ealing - Final day January' },
    });

    const [upgradeRoles, setUpgradeRoles] = useState([
        { id: '1', name: 'Senior Electrician', rate: 450 },
        { id: '2', name: 'Best Boy', rate: 480 },
        { id: '3', name: 'Gaffer', rate: 520 }
    ]);

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
        // Structure: Map<string, { label, rate: number, units: number, category }>
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

    // Handle department navigation (prev/next within same department)
    const handleDepartmentNavigation = (direction) => {
        const fullName = `${selectedCrewInfo.firstName} ${selectedCrewInfo.lastName}`;
        const currentCrew = allCrewMembers.find(c => c.name === fullName);
        if (!currentCrew) return;

        // Get all crew members in the same department
        const sameDepartmentCrew = allCrewMembers.filter(c => c.department === currentCrew.department);
        const currentIndexInDept = sameDepartmentCrew.findIndex(c => c.name === fullName);

        if (currentIndexInDept === -1) return;

        let newIndex;
        if (direction === 'prev') {
            newIndex = currentIndexInDept > 0 ? currentIndexInDept - 1 : sameDepartmentCrew.length - 1;
        } else {
            newIndex = currentIndexInDept < sameDepartmentCrew.length - 1 ? currentIndexInDept + 1 : 0;
        }

        const newCrew = sameDepartmentCrew[newIndex];
        const [firstName, ...lastNameParts] = newCrew.name.split(' ');
        const lastName = lastNameParts.join(' ');

        // Find the crew member in mock data to get their rates
        const crewData = mockCrewListData.find(c => c.name === newCrew.name);

        setSelectedCrewInfo({
            ...selectedCrewInfo,
            firstName: firstName,
            lastName: lastName,
            jobTitle: newCrew.role,
            department: newCrew.department,
            // Add rate information from mock data
            basicRate: crewData?.rate ? (crewData.contractType === 'Weekly' ? crewData.rate : crewData.rate * 5) : crewInfo.basicRate,
            dailyRate: crewData?.rate ? (crewData.contractType === 'Weekly' ? crewData.rate / 5 : crewData.rate) : crewInfo.dailyRate,
            hourlyRate: crewData?.rate ? (crewData.contractType === 'Weekly' ? crewData.rate / 5 / 11 : crewData.rate / 11) : crewInfo.hourlyRate,
            contractType: crewData?.contractCategory || crewInfo.contractType,
            employmentType: crewData?.contractType || crewInfo.employmentType,
        });
    };

    const handleWeekNavigation = (direction) => {
        const allWeeks = Object.keys(calendarSchedule)
            .map(date => {
                const d = new Date(date);
                const dayOfWeek = d.getDay();
                const diff = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
                const sunday = new Date(d);
                sunday.setDate(d.getDate() + diff);
                return sunday.toISOString().split('T')[0];
            })
            .filter((v, i, a) => a.indexOf(v) === i)
            .sort();

        const currentIndex = allWeeks.indexOf(selectedWeek);
        if (currentIndex === -1) return;

        let newIndex;
        if (direction === 'prev') {
            newIndex = currentIndex > 0 ? currentIndex - 1 : allWeeks.length - 1;
        } else {
            newIndex = currentIndex < allWeeks.length - 1 ? currentIndex + 1 : 0;
        }

        setSelectedWeek(allWeeks[newIndex]);
    };

    const getTimesheetStorageKey = (crewId, weekEnding) => {
        return `timesheet_${crewId}_${weekEnding}`;
    };

    const saveTimesheetToStorage = (crewId, weekEnding, data) => {
        try {
            const key = getTimesheetStorageKey(crewId, weekEnding);
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save timesheet to localStorage:', error);
        }
    };

    const loadTimesheetFromStorage = (crewId, weekEnding) => {
        try {
            const key = getTimesheetStorageKey(crewId, weekEnding);
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Failed to load timesheet from localStorage:', error);
            return null;
        }
    };

    useEffect(() => {
        const weekStatus = getWeekStatus(selectedWeek);
        const isFutureWeek = weekStatus === 'future';
        const isPastWeek = weekStatus === 'past';
        const isCurrentWeek = weekStatus === 'current';

        // First, try to load saved data from localStorage
        const currentCrew = currentUserRole === 'Crew' ? crewInfo : selectedCrewInfo;
        const crewId = currentCrew?.id || `${currentCrew?.firstName || ''}_${currentCrew?.lastName || ''}` || 'default';
        const savedData = loadTimesheetFromStorage(crewId, selectedWeek);

        // If saved data exists, use it instead of regenerating
        if (savedData && savedData.length > 0) {
            setEntries(savedData);
            return;
        }

        // Otherwise, generate new entries from calendar data
        setEntries(daysOfWeek.map((d, i) => {
            // Check if calendar data exists for this date
            const calendarData = calendarSchedule?.[d.date];

            // Generate data for past weeks AND current week using calendar schedule
            // DON'T populate future weeks - they should start empty
            if (!isFutureWeek && calendarData && calendarData.dayType && calendarData.dayType !== 'Rest') {
                // Count consecutive work days to determine 6th/7th day
                const consecutiveWorkDays = i; // Simplified - in real scenario would check previous entries
                const isSixthDay = consecutiveWorkDays === 5;
                const isSeventhDay = consecutiveWorkDays === 6;

                // Generate realistic crew times (can arrive before/after call, wrap before/after unit wrap)
                const generateCrewTimes = (unitCall, unitWrap) => {
                    const [callHour, callMin] = unitCall.split(':').map(Number);
                    const [wrapHour, wrapMin] = unitWrap.split(':').map(Number);

                    // 60% chance crew arrives BEFORE call time (prep work)
                    // 40% chance crew arrives AFTER call time (not needed for setup)
                    const arriveEarly = Math.random() < 0.6;
                    const timeVariation = 15 + Math.floor(Math.random() * 30); // 15-45 mins variation

                    // Calculate crew in time
                    let crewInMin = arriveEarly ? callMin - timeVariation : callMin + timeVariation;
                    let crewInHour = callHour;

                    if (crewInMin < 0) {
                        crewInMin += 60;
                        crewInHour -= 1;
                        if (crewInHour < 0) crewInHour += 24;
                    } else if (crewInMin >= 60) {
                        crewInMin -= 60;
                        crewInHour += 1;
                        if (crewInHour >= 24) crewInHour -= 24;
                    }

                    // 70% chance crew wraps AFTER unit wrap (cleanup, packing)
                    // 30% chance crew wraps BEFORE unit wrap (work finished early)
                    const wrapLate = Math.random() < 0.7;
                    const wrapVariation = 10 + Math.floor(Math.random() * 35); // 10-45 mins variation

                    // Calculate crew out time
                    let crewOutMin = wrapLate ? wrapMin + wrapVariation : wrapMin - wrapVariation;
                    let crewOutHour = wrapHour;
                    let isNextDay = false;

                    if (crewOutMin < 0) {
                        crewOutMin += 60;
                        crewOutHour -= 1;
                    } else if (crewOutMin >= 60) {
                        crewOutMin -= 60;
                        crewOutHour += 1;
                    }

                    if (crewOutHour >= 24) {
                        crewOutHour -= 24;
                        isNextDay = true;
                    }

                    const crewInTime = `${String(crewInHour).padStart(2, '0')}:${String(crewInMin).padStart(2, '0')}`;
                    const crewOutTime = `${String(crewOutHour).padStart(2, '0')}:${String(crewOutMin).padStart(2, '0')}`;

                    return { crewInTime, crewOutTime, isNextDay };
                };

                // Calculate PACT/BECTU overtime based on actual hours worked
                const calculatePACTOvertime = (inTime, outTime, nextDay) => {
                    const [inHour, inMin] = inTime.split(':').map(Number);
                    const [outHour, outMin] = outTime.split(':').map(Number);

                    // Convert to minutes from midnight
                    const inMinutes = inHour * 60 + inMin;
                    let outMinutes = outHour * 60 + outMin;
                    if (nextDay) outMinutes += 24 * 60;

                    const totalMinutes = outMinutes - inMinutes;
                    const totalHours = totalMinutes / 60;

                    // PACT/BECTU Film Agreement:
                    // - Standard day: 10 hours (inclusive of 1 hour meal break)
                    // - After 10 hours: Time and a half for next 2 hours (hours 11-12)
                    // - After 12 hours: Double time
                    // - Pre-call (before 07:00): Additional premium
                    // - Post-wrap (after 19:00): Additional premium

                    let preOT = 0;
                    let postOT = 0;
                    let cameraOT = 0;
                    let enhancedOT = 0;

                    // Pre-call premium (before 07:00)
                    if (inHour < 7) {
                        preOT = 1;
                    }

                    // Calculate camera OT (time and a half for hours 11-12, double time after)
                    if (totalHours > 10) {
                        const overtimeHours = totalHours - 10;
                        // Round to quarter-hour increments
                        const roundToQuarter = (hours) => Math.ceil(hours * 4) / 4;

                        if (overtimeHours <= 2) {
                            // Hours 11-12: time and a half
                            cameraOT = roundToQuarter(overtimeHours);
                        } else {
                            // First 2 hours at time and a half, rest at double time
                            cameraOT = 2.0;
                            enhancedOT = roundToQuarter(overtimeHours - 2);
                        }
                    }

                    // Post-wrap premium (working past 19:00)
                    if ((nextDay && outHour >= 0) || (!nextDay && outHour >= 19)) {
                        postOT = 1;
                    }

                    return { preOT, cameraOT, postOT, enhancedOT };
                };

                const { crewInTime, crewOutTime, isNextDay } = generateCrewTimes(
                    calendarData.unitCall || '07:00',
                    calendarData.unitWrap || '17:30'
                );

                const { preOT, cameraOT, postOT, enhancedOT } = calculatePACTOvertime(
                    crewInTime,
                    crewOutTime,
                    isNextDay
                );

                return {
                    ...d,
                    status: isPastWeek ? 'submitted' : 'not-started', // Past weeks are submitted, current is editable
                    dayType: 'Work',
                    unit: calendarData.unit || 'Main',
                    workplace: calendarData.workplaces || ['On Set'],
                    workplaceLocation: calendarData.workplaces?.[0] || 'Studio',
                    set: calendarData.set || '', // Set information from calendar

                    // Crew actual times (different from calendar times)
                    inTime: crewInTime,
                    inDateTime: '',
                    outTime: crewOutTime,
                    outDateTime: '',
                    nextDay: isNextDay,
                    isFlatDay: false,

                    // Pay Units based on calendar and 6th/7th day rules
                    standardDay: isSixthDay || isSeventhDay ? 0 : 1, // 6th/7th day gets 0 salary
                    sixthDay: isSixthDay ? 1 : 0,
                    seventhDay: isSeventhDay ? 1 : 0,
                    publicHoliday: calendarData.isPublicHoliday ? 1 : 0,
                    travelDay: 0,

                    upgrade: '',
                    isUpgraded: false,
                    upgradeRole: '',
                    upgradeRate: 0,
                    mealStatus: 'Per calendar day',

                    // Allowances calculated from actual crew times and PACT/BECTU rules
                    paidTravel: parseFloat(calendarData.travelTo || '0') > 0 ? 1 : 0,
                    cameraOT: cameraOT,
                    preOT: preOT,
                    postOT: postOT,
                    bta: calendarData.workplaces && calendarData.workplaces.length > 0 ? 1 : 0,
                    dawn: calendarData.dawn === 'Paid' ? 1 : 0,
                    night: calendarData.nightPenalty === 'Paid' ? 1 : 0,
                    lateMeal: 0,
                    brokenMeal: 0,
                    travel: parseFloat(calendarData.travelTo || '0') + parseFloat(calendarData.travelFrom || '0'),
                    otherOT: 0,
                    breakfast: true,
                    lunch: true,
                    dinner: true,
                    perDiemShoot: 0,

                    // Expenses
                    fuel: 0,
                    mileage: 0,
                    computer: 0,
                    software: 0,
                    box: i === 0 ? 1 : 0, // Box rental on first day
                    equipment: 0,
                    vehicle: 0,
                    mobile: 0,
                    living: 0,
                    perDiemNon: 0,
                    mealsAllowance: 0,
                    turnaround: 0,
                    additionalHour: 0,
                    enhancedOT: enhancedOT,

                    notes: calendarData.notes || '',
                    deptApproval: 'ARC'
                };
            }

            // Default Rest day for future weeks and weekend days
            return {
                ...d,
                status: 'not-started',
                dayType: 'Rest',
                unit: 'Main',
                workplace: [],
                workplaceLocation: '',
                set: '',

                // Pay Units Init - Don't auto-set standardDay=1 for Work days until time is entered
                standardDay: 0, // Changed: Start at 0, will be set to 1 when time entered or flat day clicked
                sixthDay: 0,
                seventhDay: 0,
                publicHoliday: 0,
                travelDay: 0,

                upgrade: '',
                isUpgraded: false,
                upgradeRole: '',
                upgradeRate: 0,
                inTime: '',
                inDateTime: '',
                outTime: '',
                outDateTime: '',
                nextDay: false,
                isFlatDay: false,
                mealStatus: 'Per calendar day',
                paidTravel: 0,
                cameraOT: 0,
                preOT: 0,
                postOT: 0,
                bta: 0,
                dawn: 0,
                night: 0,
                lateMeal: 0,
                brokenMeal: 0,
                travel: 0,
                otherOT: 0,
                breakfast: false,
                lunch: false,
                dinner: false,
                perDiemShoot: 0,

                // Init new fields
                fuel: 0,
                mileage: 0,
                computer: 0,
                software: 0,
                box: 0,
                equipment: 0,
                vehicle: 0,
                mobile: 0,
                living: 0,
                perDiemNon: 0,
                mealsAllowance: 0,
                turnaround: 0,
                additionalHour: 0,
                enhancedOT: 0,

                notes: '',
                deptApproval: 'ARC'
            };
        }));
    }, [selectedWeek, calendarSchedule, daysOfWeek, selectedCrewInfo, currentUserRole]);

    return (
        <div className="">
            <div className={`rounded-xl border-2 border-purple-500 shadow-2xl overflow-hidden bg-card`}>
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
                        shouldBeReadOnly = !canCrewSubmitWeek(selectedWeek);
                    } else if (currentUserRole === 'HOD' || currentUserRole === 'Payroll') {
                        // HOD and Payroll can edit past weeks
                        shouldBeReadOnly = false;
                    } else {
                        // Production and Finance cannot edit past weeks
                        shouldBeReadOnly = isPastWeek;
                    }

                    console.log('entries prop', entries);
                    // console.log('entriesToRender', entriesToRender);

                    return (
                        <>
                            {shouldBeReadOnly && (
                                <div
                                    className={`px-4 py-2 m-3 mb-0 rounded-lg border ${isDarkMode
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

                            <TimesheetForm
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
                                readOnly={shouldBeReadOnly}
                            />
                        </>
                    );

                })()}
            </div>
        </div>
    )
}

export default TimesheetTable