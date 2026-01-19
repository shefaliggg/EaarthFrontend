
import React, { useState, useMemo, useEffect } from 'react';
import {
    FileText, ChevronRight, User, Calendar, Plus, Trash2, CheckCircle, Clock,
    Circle, Send, Eye, ShieldCheck, Building2, Banknote, CheckCircle2, BadgeCheck,
    FilePlus, Download, X, DollarSign, ChevronDown, Edit2, RotateCcw, ThumbsUp,
    Edit3, Lock, EyeOff, RefreshCw, Calculator, History, ChevronLeft,
    MoreHorizontal, Car, Check, ChevronsUpDown, Wallet, Save,
    Edit,
    GitGraph,
    ChartBarStacked,
    ChartColumnStacked
} from 'lucide-react';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../../shared/components/ui/popover';
import { TimesheetHeaderButtons } from '../TimesheetHeaderButtons';
import { WeekCompletionIndicator } from '../WeekCompletionIndicator';
import { TimesheetStatusWatermark } from '../TimesheetStatusWatermark';
import { SalarySidebarSignatures } from '../SalarySidebarSignatures';
import { calculatePACTBECTUOvertime, isDayComplete } from '../../config/timesheetCalculations';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../../../../../shared/components/ui/command';
import { cn } from '../../../../../shared/config/utils';
import TimesheetDataRow from './TimesheetDataRow';
import { Button } from '../../../../../shared/components/ui/button';
import { StatusBadge } from '../../../../../shared/components/badges/StatusBadge';
import { WeeklyGraphicalView } from './WeeklyGraphicalView';
import { useNavigate, useParams } from 'react-router-dom';
import { InfoTooltip } from '../../../../../shared/components/InfoTooltip';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

const LOCATIONS = [
    'BOURNE WOOD', 'BRECON BEACONS', 'CRYCHAN FOREST', 'DARTMOOR', 'FOREST OF DEAN',
    'REDLANDS WOOD', 'SHEPPERTON', 'SKY STUDIOS ELSTREE', 'STOCKERS FARM'
];

const MEAL_OPTIONS = [
    'Per calendar day',
    'Broken by 0.5 hours',
    'No meal (paid)',
    'No meal (unpaid)'
];

const PAID_TRAVEL_OPTIONS = [
    'None', '0.25', '0.5', '0.75', '1', '1.25', '1.5', '1.75', '2', '2.5', '3'
];

const t = (val) => val || '-';

const formatEntryDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
        const date = new Date(dateStr);
        const dayName = date.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase();
        const day = date.getDate();
        const month = date.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
        const year = date.getFullYear();
        return `${dayName}, ${day} ${month} ${year}`;
    } catch (e) {
        return dateStr;
    }
};

const OVERVIEW_FIELDS = [
    {
        k: 'salary',
        l: 'Salary',
        type: 'derived',
        getValue: (e) => {
            const s6 = Number(e.sixthDay);
            const s7 = Number(e.seventhDay);
            const ph = Number(e.publicHoliday);
            const tr = Number(e.travelDay);
            const tu = Number(e.turnaround);

            if ((!isNaN(s6) && s6 > 0) ||
                (!isNaN(s7) && s7 > 0) ||
                (!isNaN(ph) && ph > 0) ||
                (!isNaN(tr) && tr > 0) ||
                (!isNaN(tu) && tu > 0)) return 0;

            if (e.isFlatDay) return 1;

            if (e.dayType === 'Work') {
                const hasInTime = e.inTime && e.inTime.trim() !== '';
                const hasOutTime = e.outTime && e.outTime.trim() !== '';
                if (hasInTime && hasOutTime) return 1;
                return 0;
            }
            return '';
        }
    },
    { k: 'sixthDay', l: '6th Day', type: 'number' },
    { k: 'seventhDay', l: '7th Day', type: 'number' },
    { k: 'publicHoliday', l: 'Public Holiday', type: 'number' },
    { k: 'travelDay', l: 'Travel Day', type: 'number' },
    // { k: 'halfDay', l: 'Half Day', type: 'derived', getValue: (e) => e.dayType === 'Half Day' ? 1 : '' },
    // { k: 'training', l: 'Training', type: 'derived', getValue: (e) => e.dayType === 'Training' ? 1 : '' },
    // { k: 'driverCastTravel', l: 'Driver - Cast Travel', type: 'derived', getValue: (e) => e.dayType === 'Driver - Cast Travel' ? 1 : '' },
    // { k: 'holiday', l: 'Holiday', type: 'derived', getValue: (e) => e.dayType === 'Holiday' ? 1 : '' },
    // { k: 'sick', l: 'Sick', type: 'derived', getValue: (e) => e.dayType === 'Sick' ? 1 : '' },
    // { k: 'personalIssue', l: 'Personal issue', type: 'derived', getValue: (e) => e.dayType === 'Personal issue' ? 1 : '' },
    { k: 'turnaround', l: 'Turnaround', type: 'number' },
    { k: 'additionalHour', l: 'Add Hour', type: 'number' },
    { k: 'enhancedOT', l: 'Enhanced OT', type: 'number' },
    { k: 'cameraOT', l: 'Camera OT', type: 'number' },
    { k: 'postOT', l: 'Post OT', type: 'number' },
    { k: 'preOT', l: 'Pre OT', type: 'number' },
    { k: 'bta', l: 'BTA', type: 'number' },
    { k: 'lateMeal', l: 'Late Meal', type: 'number' },
    { k: 'brokenMeal', l: 'Broken Meal', type: 'number' },
    { k: 'travel', l: 'Travel Hours', type: 'number' },
    { k: 'dawn', l: 'Dawn', type: 'number' },
    { k: 'night', l: 'Night', type: 'number' }
];

const ALLOWANCE_FIELDS = [
    { k: 'perDiemShoot', l: 'Per Diem Shoot', type: 'bool' },
    { k: 'perDiemNon', l: 'Per Diem Non Shoot', type: 'bool' },
    { k: 'breakfast', l: 'Breakfast', type: 'bool' },
    { k: 'lunch', l: 'Lunch', type: 'bool' },
    { k: 'dinner', l: 'Dinner', type: 'bool' },
    { k: 'computer', l: 'Computer', type: 'derived' },
    { k: 'software', l: 'Software', type: 'derived' },
    { k: 'box', l: 'Box Rental', type: 'derived' },
    { k: 'equipment', l: 'Equipment', type: 'derived' },
    { k: 'vehicle', l: 'Vehicle', type: 'derived' },
    { k: 'mobile', l: 'Mobile', type: 'derived' },
    { k: 'living', l: 'Living', type: 'derived' },
    { k: 'fuel', l: 'Fuel', type: 'derived' },
    { k: 'mileage', l: 'Mileage', type: 'derived' }
];

export let TEMP_SUMMARY_DATA = null;

export function TimesheetForm({
    allowanceCaps,
    salary,
    crewInfo,
    entries = [],
    crewType,
    customItems,
    onEntriesUpdate,
    currentUserRole = 'crew',
    projectSettings,
    calendarSchedule,
    upgradeRoles = [],
    readOnly = false,
    isPaid = false,
    contractCategory = 'PAYE',
}) {
    const navigate = useNavigate();
    const params = useParams();

    const [isVatRegistered, setIsVatRegistered] = useState(crewInfo?.isVATRegistered || false);
    const [exportMode, setExportMode] = useState('none');
    const [showGraphicalView, setShowGraphicalView] = useState(false);
    const [isEditingWeek, setIsEditingWeek] = useState(false);
    const [timesheetStatus, setTimesheetStatus] = useState('draft');
    const [localEntries, setLocalEntries] = useState([]);

    // Calculate week ending from entries (assuming last entry is Sunday)
    const calculatedWeekEnding = useMemo(() => {
        if (entries && entries.length > 0) {
            const lastEntry = entries[entries.length - 1];
            if (lastEntry && lastEntry.date) {
                // Convert YYYY-MM-DD to DD-MM-YYYY for the form
                const [y, m, d] = lastEntry.date.split('-');
                return `${d}-${m}-${y}`;
            }
        }
        return "16-11-2025"; // Fallback
    }, [entries]);

    // Paid Till Date (PTD) tracking - Mock data
    const [ptdDataByLabel] = useState({
        'Salary': 0.00,
        '6th Day': 0.00,
        '7th Day': 0.00,
        'Public Holiday': 0.00,
        'Travel Day': 0.00,
        'Turnaround': 85.00,
        'Add Hour': 140.00,
        'Enhanced O/T': 220.00,
        'Camera O/T': 850.50,
        'Post O/T': 180.25,
        'Pre O/T': 120.00,
        'BTA': 295.00,
        'Late Meal': 75.50,
        'Broken Meal': 40.00,
        'Travel': 110.00,
        'Dawn / Early': 0.00,
        'Night Pen': 0.00,
        'Computer': 0.00,
        'Software': 0.00,
        // Removed: 'Box': 50.00 - separate "Box" field no longer needed (keeping "Box Rental")
        'Equipment': 200.00,
        'Vehicle': 150.00,
        'Mobile': 80.00,
        'Living': 400.00,
        'Per Diem Shoot Rate': 0.00,
        'Per Diem Non Shoot Rate': 0.00,
        'Breakfast': 150.00,
        'Lunch': 200.00,
        'Dinner': 180.00,
        'Fuel': 250.00,
        'Mileage': 180.00,
        'Salary': 0.00
    });

    // Signatures State (Moved from SalarySidebarSignatures)
    const [signatures, setSignatures] = useState([
        { label: 'Crew Member', name: `${crewInfo.firstName} ${crewInfo.lastName}`, date: '16 Nov 2025 18:30', code: '8F2A-91', role: crewInfo.jobTitle },
        { label: 'HOD / Dept', name: 'Michael Chen', date: '16 Nov 2025 19:15', code: '7B3X-04', role: 'Location Manager' },
        { label: 'Production', name: 'Bernie Bellew', date: '18 Dec 2025 04:31', code: 'PD-782', role: 'Line Producer' },
        { label: 'Accounts', name: 'Dan Palmer', date: '18 Dec 2025 10:45', code: 'AC-441', role: 'Financial Controller' },
        { label: 'Payroll', name: 'Sarah Mitchell', date: '19 Dec 2025 14:20', code: 'PR-993', role: 'Payroll Manager' }
    ]);

    // Audit Logs State
    const [auditLogs, setAuditLogs] = useState([
        { date: '16 Nov 18:30', user: 'James Wilson', action: 'SUBMIT', details: 'Initial submission for approval' },
        { date: '16 Nov 19:15', user: 'Michael Chen', action: 'APPROVE', details: 'Departmental approval granted' },
        { date: '17 Nov 09:30', user: 'Bernie Bellew', action: 'REVIEW', details: 'Production review completed' }
    ]);

    // Set timesheet status based on isPaid prop
    useEffect(() => {
        if (isPaid) {
            setTimesheetStatus('paid');
        } else if (readOnly) {
            setTimesheetStatus('approved');
        }
    }, [isPaid, readOnly]);

    // Watch for changes when crew is editing - automatically set to draft
    useEffect(() => {
        if (isEditingWeek && currentUserRole === 'crew' && timesheetStatus !== 'draft') {
            setTimesheetStatus('draft');
        }
    }, [isEditingWeek, localEntries, currentUserRole]);

    // Helper function to merge calendar schedule data into entries
    const mergeCalendarDataIntoEntries = (entriesToMerge) => {
        if (!calendarSchedule) return entriesToMerge;

        return entriesToMerge.map(entry => {
            const calendarData = calendarSchedule[entry.date];
            if (!calendarData || !calendarData.dayType || calendarData.dayType === 'Rest') {
                return entry;
            }

            // Only pre-fill if entry doesn't already have data
            return {
                ...entry,
                // Sync day type from calendar
                dayType: entry.dayType || 'Work',
                // Sync unit
                unit: entry.unit || calendarData.unit || 'Main',
                // Sync workplace/location
                workplace: entry.workplace || ['On Set'],
                workplaceLocation: entry.workplaceLocation || calendarData.workplaces?.[0] || '',
                // Sync call/wrap times (only if not already filled)
                inTime: entry.inTime || calendarData.unitCall || '',
                outTime: entry.outTime || calendarData.unitWrap || '',
                nextDay: entry.nextDay || calendarData.unitWrapNextDay || false,
                // Sync camera OT
                cameraOT: entry.cameraOT || parseFloat(calendarData.cameraOT || '0'),
                // Sync paid travel
                paidTravel: entry.paidTravel || (parseFloat(calendarData.travelTo || '0') + parseFloat(calendarData.travelFrom || '0')),
                // Sync night penalty
                night: entry.night || (calendarData.nightPenaltyPaid === 'Paid' ? 1.5 : 0),
                // Sync dawn penalty
                dawn: entry.dawn || (calendarData.dawn === 'Paid' ? 1.5 : 0),
                // Sync late meal
                lateMeal: entry.lateMeal || parseFloat(calendarData.lateMeal || '0'),
                // Sync notes
                notes: entry.notes || calendarData.notes || '',
                // Sync public holiday
                publicHoliday: entry.publicHoliday || (calendarData.isPublicHoliday ? 1 : 0),
            };
        });
    };

    const handleRevise = () => {
        const initialEntries = entries.length > 0 ? entries : [];
        // Deep copy and merge calendar data
        const entriesWithCalendar = mergeCalendarDataIntoEntries(JSON.parse(JSON.stringify(initialEntries)));
        setLocalEntries(entriesWithCalendar);
        setIsEditingWeek(true);
        toast.info('Editing mode enabled');
    };

    // Crew-specific handlers
    const handleCrewEdit = () => {
        const initialEntries = entries.length > 0 ? entries : [];
        // Deep copy and merge calendar data
        const entriesWithCalendar = mergeCalendarDataIntoEntries(JSON.parse(JSON.stringify(initialEntries)));
        setLocalEntries(entriesWithCalendar);
        setIsEditingWeek(true);
        setTimesheetStatus('draft');
        toast.info('You can now edit your timesheet');
    };

    const handleCrewSave = () => {
        if (isEditingWeek && localEntries.length > 0 && onEntriesUpdate) {
            onEntriesUpdate(localEntries);
            setIsEditingWeek(false);
            // Check if all 7 days are filled - if yes, keep as draft, crew needs to submit
            setTimesheetStatus('draft');
            toast.success('Timesheet saved as draft');
        }
    };

    const handleCrewSubmit = () => {
        // Check if all 7 days have been completed (have in/out times OR flat day)
        const allDaysFilled = localEntries.length === 7 && localEntries.every(entry => isDayComplete(entry));

        if (!allDaysFilled) {
            const completedCount = localEntries.filter(entry => isDayComplete(entry)).length;
            toast.error(`Please complete all 7 days before submitting (${completedCount}/7 completed). Each day needs In/Out times or Flat Day marked.`);
            return;
        }

        if (onEntriesUpdate) {
            onEntriesUpdate(localEntries);
        }
        setIsEditingWeek(false);
        setTimesheetStatus('submitted');
        toast.success('Timesheet submitted for approval');
    };

    const handleRevert = () => {
        setIsEditingWeek(false);
        setLocalEntries([]);
        toast.warning('Changes reverted');
    };

    const handleRecalculate = () => {
        // Since calculations are reactive via useMemo, this acts as a confirmation
        // In a future update, this could reset manual overrides if requested
        toast.info('Recalculating...');
        setTimeout(() => {
            toast.success('Totals updated successfully');
        }, 300);
    };

    const handleApprove = () => {
        if (isEditingWeek && localEntries.length > 0 && onEntriesUpdate) {
            onEntriesUpdate(localEntries);
            setTimesheetStatus('revised');

            // Add Audit Log Entry
            const newLog = {
                date: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
                user: currentUserRole || 'accounts',
                action: 'REVISION',
                details: 'Timesheet revised and totals recalculated.'
            };
            setAuditLogs(prev => [newLog, ...prev]);

            toast.success('Week revised & saved!');
        } else {
            toast.success('Week approved!');
        }
        setIsEditingWeek(false);
        setLocalEntries([]);
    };

    const roundToQuarter = (hours) => Math.ceil(hours * 4) / 4;

    const updateLocalEntry = (dayIndex, field, value) => {
        if (!isEditingWeek) return;

        // Audit Log: Record change
        const currentEntry = localEntries[dayIndex];
        if (currentEntry) {
            const oldValue = currentEntry[field];
            // Simple equality check (loose for numbers/strings)
            if (oldValue != value) {
                const changeLog = {
                    date: new Date().toLocaleString(),
                    user: currentUserRole || 'admin',
                    action: 'Edit',
                    details: `${formatEntryDate(currentEntry.date)}: ${field} changed from '${oldValue}' to '${value}'`
                };
                setAuditLogs(prev => [changeLog, ...prev]);
            }
        }

        setLocalEntries(prev => {
            const updated = [...prev];
            const entry = { ...updated[dayIndex], [field]: value };

            // Handle Time & DateTime Logic
            if (field === 'inTime' || field === 'outTime' || field === 'nextDay') {
                const { inTime, outTime, date } = entry;

                if (inTime && outTime && date) {
                    let isNextDay = entry.nextDay;

                    // Auto-detect next day if time changed (Out < In implies next day)
                    if (field !== 'nextDay') {
                        // Simple string comparison works for HH:mm ("02:00" < "20:00")
                        isNextDay = outTime < inTime;
                    } else {
                        // If manually toggling nextDay, use the value
                        isNextDay = value;
                    }

                    try {
                        const inDateObj = new Date(`${date}T${inTime}:00`);
                        const outDateObj = new Date(`${date}T${outTime}:00`);

                        if (isNextDay) {
                            outDateObj.setDate(outDateObj.getDate() + 1);
                        }

                        entry.inDateTime = inDateObj.toISOString();
                        entry.outDateTime = outDateObj.toISOString();
                        entry.nextDay = isNextDay;
                    } catch (e) {
                        console.error("Invalid date calculation", e);
                    }
                }
            }

            // Handle Day Type Logic (Auto-set Travel/Turnaround)
            if (field === 'dayType') {
                if (value === 'Travel') {
                    entry.travelDay = 1;
                    // Reset standard work fields if switching to Travel (optional, but cleaner)
                    entry.turnaround = '';
                    entry.sixthDay = '';
                    entry.seventhDay = '';
                    entry.publicHoliday = '';
                } else if (value === 'Turnaround') {
                    entry.turnaround = 1;
                    // Reset others
                    entry.travelDay = '';
                    entry.sixthDay = '';
                    entry.seventhDay = '';
                    entry.publicHoliday = '';
                } else if (value === 'Travel & Turnaround') {
                    entry.travelDay = 1;
                    entry.turnaround = 1;
                } else if (value === 'Public holiday off') {
                    entry.publicHoliday = 1;
                    // Reset others
                    entry.travelDay = '';
                    entry.turnaround = '';
                    entry.sixthDay = '';
                    entry.seventhDay = '';
                } else {
                    // If switching away, clear flags if they were likely auto-set
                    if (entry.dayType === 'Travel') entry.travelDay = '';
                    if (entry.dayType === 'Turnaround') entry.turnaround = '';
                    if (entry.dayType === 'Public holiday off') entry.publicHoliday = '';
                }
            }

            // Auto-calculate PACT/BECTU overtime when in/out times or flat day changes
            if (field === 'inTime' || field === 'outTime' || field === 'isFlatDay' || field === 'dayType' || field === 'nextDay') {
                if (projectSettings && calendarSchedule) {
                    // Get calendar day for this entry
                    const calendarDay = calendarSchedule[entry.date];

                    // Calculate overtime based on PACT/BECTU Film Agreement
                    const overtimeCalcs = calculatePACTBECTUOvertime(
                        entry,
                        calendarDay,
                        projectSettings,
                        updated // Pass the week entries for 6th/7th day calculation
                    );

                    // Apply calculated overtime values
                    Object.assign(entry, overtimeCalcs);
                }
            }

            updated[dayIndex] = entry;
            return updated;
        });
    };

    // Helper formatting functions
    const c = (val) => typeof val === 'number' ? `£${val.toFixed(2)}` : '-';
    const n = (val) => typeof val === 'number' && val !== 0 ? val.toFixed(2) : '-';
    const _t_unused = (val) => val || '-';

    // --- Financial Calculations ---

    const activeSalary = useMemo(() => {
        const entriesToProcess = (isEditingWeek && localEntries.length > 0) ? localEntries : entries;
        if (entriesToProcess.length === 0) return salary;

        const standardDaily = crewInfo.dailyRate || 0;
        const standardHourly = crewInfo.hourlyRate || (standardDaily / 11);
        const itemsMap = new Map();

        const addToBucket = (category, label, rate, units) => {
            if (units <= 0) return;
            const key = `${category}_${label}_${rate.toFixed(2)}`;
            const existing = itemsMap.get(key) || { label, rate, units: 0, category };
            existing.units += units;
            itemsMap.set(key, existing);
        };

        let regularUnits = 0;
        let sixthDayUnits = 0;
        let seventhDayUnits = 0;
        let workDaysCount = 0;

        entriesToProcess.forEach((entry, index) => {
            const isUpgradedEntry = entry.isUpgraded === true || !!entry.isUpgraded;
            const upgradeSuffix = isUpgradedEntry ? ` (${entry.upgradeRole || 'Upgr'})` : '';
            const lbl = (baseLabel) => `${baseLabel}${upgradeSuffix}`;

            if (entry.dayType === 'Work') {
                workDaysCount++;

                const manualSixth = parseFloat(entry.sixthDay) || 0;
                const manualSeventh = parseFloat(entry.seventhDay) || 0;
                const manualPublic = parseFloat(entry.publicHoliday) || 0;

                // Determine if it is effectively a 6th or 7th day (manual override OR auto-detect)
                // Note: Auto-detection only applies if no other special types are set
                const isSixthDay = manualSixth > 0 || (!manualSixth && !manualSeventh && !manualPublic && workDaysCount === 6);
                const isSeventhDay = manualSeventh > 0 || (!manualSixth && !manualSeventh && !manualPublic && workDaysCount === 7);

                // Treat as upgraded if checkbox checked, even if rate not yet set (fallback to standard)
                const dailyRate = (isUpgradedEntry && entry.upgradeRate > 0) ? entry.upgradeRate : standardDaily;

                if (entry.isFlatDay) {
                    // Flat Day always counts as Salary (1 unit) regardless of position in week
                    if (isUpgradedEntry) {
                        addToBucket('basic', lbl('Salary'), dailyRate, 1);
                    } else {
                        regularUnits++;
                    }
                } else if (manualPublic > 0) {
                    // Handled in common section below to support non-Work days too
                } else if (isSixthDay) {
                    const units = manualSixth > 0 ? manualSixth : 1;
                    if (isUpgradedEntry) addToBucket('basic', lbl('6th Day'), dailyRate, units);
                    else sixthDayUnits += units;
                } else if (isSeventhDay) {
                    const units = manualSeventh > 0 ? manualSeventh : 1;
                    if (isUpgradedEntry) addToBucket('basic', lbl('7th Day'), dailyRate, units);
                    else seventhDayUnits += units;
                } else if (isUpgradedEntry) {
                    // Only count upgraded work day if in/out times are present
                    const hasInTime = entry.inTime && entry.inTime.trim() !== '';
                    const hasOutTime = entry.outTime && entry.outTime.trim() !== '';
                    if (hasInTime && hasOutTime) {
                        addToBucket('basic', lbl('Salary'), dailyRate, 1);
                    }
                } else {
                    // Only count regular work day if in/out times are present
                    const hasInTime = entry.inTime && entry.inTime.trim() !== '';
                    const hasOutTime = entry.outTime && entry.outTime.trim() !== '';
                    if (hasInTime && hasOutTime) {
                        regularUnits++;
                    }
                }
            }

            // Handle Custom Day Types - Create rows automatically when day type is selected
            if (entry.dayType === 'Half Day') {
                const effectiveDaily = (isUpgradedEntry && entry.upgradeRate > 0) ? entry.upgradeRate : standardDaily;
                addToBucket('basic', lbl('Half Day'), effectiveDaily * 0.5, 1);
            }

            if (entry.dayType === 'Training') {
                const effectiveDaily = (isUpgradedEntry && entry.upgradeRate > 0) ? entry.upgradeRate : standardDaily;
                addToBucket('basic', lbl('Training'), effectiveDaily, 1);
            }

            if (entry.dayType === 'Travel & Turnaround') {
                const effectiveDaily = (isUpgradedEntry && entry.upgradeRate > 0) ? entry.upgradeRate : standardDaily;
                // This day type combines Travel Day (full day) + Turnaround (OT)
                addToBucket('basic', lbl('Travel Day'), effectiveDaily, 1);
                // Turnaround is processed below in OT section
            }

            if (entry.dayType === 'Driver - Cast Travel') {
                const effectiveDaily = (isUpgradedEntry && entry.upgradeRate > 0) ? entry.upgradeRate : standardDaily;
                addToBucket('basic', lbl('Driver - Cast Travel'), effectiveDaily, 1);
            }

            // Day types that don't require In/Out times (paid days off, etc.)
            if (entry.dayType === 'Holiday') {
                const effectiveDaily = (isUpgradedEntry && entry.upgradeRate > 0) ? entry.upgradeRate : standardDaily;
                addToBucket('basic', lbl('Holiday'), effectiveDaily, 1);
            }

            if (entry.dayType === 'Sick') {
                const effectiveDaily = (isUpgradedEntry && entry.upgradeRate > 0) ? entry.upgradeRate : standardDaily;
                addToBucket('basic', lbl('Sick'), effectiveDaily, 1);
            }

            if (entry.dayType === 'Personal issue') {
                const effectiveDaily = (isUpgradedEntry && entry.upgradeRate > 0) ? entry.upgradeRate : standardDaily;
                addToBucket('basic', lbl('Personal issue'), effectiveDaily, 1);
            }

            // OT / Allowances
            // Use effective daily rate for OT calc
            const effectiveDaily = (isUpgradedEntry && entry.upgradeRate > 0) ? entry.upgradeRate : standardDaily;
            const hourlyRate = effectiveDaily / 11;

            // Travel Day (Full Day)
            addToBucket('basic', lbl('Travel Day'), effectiveDaily, parseFloat(entry.travelDay) || 0);

            // Public Holiday (Full Day)
            addToBucket('basic', lbl('Public Holiday'), effectiveDaily, parseFloat(entry.publicHoliday) || 0);

            addToBucket('overtime', lbl('Camera O/T'), hourlyRate * 2, parseFloat(entry.cameraOT) || 0);
            addToBucket('overtime', lbl('Pre O/T'), hourlyRate * 1.5, parseFloat(entry.preOT) || 0);
            addToBucket('overtime', lbl('Post O/T'), hourlyRate * 1.5, parseFloat(entry.postOT) || 0);
            addToBucket('overtime', lbl('BTA'), hourlyRate, parseFloat(entry.bta) || 0);
            addToBucket('overtime', lbl('Dawn / Early'), hourlyRate * 1.5, parseFloat(entry.dawn) || 0); // Assuming Dawn is 1.5x
            addToBucket('overtime', lbl('Night Pen'), hourlyRate * 1.5, parseFloat(entry.night) || 0); // Assuming Night is 1.5x
            addToBucket('overtime', lbl('Travel'), hourlyRate, parseFloat(entry.travel) || 0);

            // NEW OT Fields
            addToBucket('overtime', lbl('Turnaround'), hourlyRate * 1.5, parseFloat(entry.turnaround) || 0);
            addToBucket('overtime', lbl('Add Hour'), hourlyRate * 1.5, parseFloat(entry.additionalHour) || 0);
            addToBucket('overtime', lbl('Enhanced O/T'), hourlyRate * 2.0, parseFloat(entry.enhancedOT) || 0);

            // Meal Pens
            addToBucket('meal', lbl('Late Meal'), hourlyRate, parseFloat(entry.lateMeal) || 0);
            addToBucket('meal', lbl('Broken Meal'), hourlyRate, parseFloat(entry.brokenMeal) || 0);
            addToBucket('meal', lbl('Other O/T'), hourlyRate, parseFloat(entry.otherOT) || 0);

            // Allowances
            if (entry.perDiemShoot > 0) addToBucket('allowance', lbl('Per Diem Shoot Rate'), 1, entry.perDiemShoot);
            if (entry.perDiemNon > 0) addToBucket('allowance', lbl('Per Diem Non Shoot Rate'), 1, entry.perDiemNon);
            if (entry.breakfast) addToBucket('allowance', lbl('Breakfast'), 1, 1);
            if (entry.lunch) addToBucket('allowance', lbl('Lunch'), 1, 1);
            if (entry.dinner) addToBucket('allowance', lbl('Dinner'), 1, 1);

            // Extra Allowances
            if (entry.fuel > 0) addToBucket('allowance', 'Fuel', 1, parseFloat(entry.fuel));
            if (entry.mileage > 0) addToBucket('allowance', 'Mileage', 0.45, parseFloat(entry.mileage)); // Assuming 0.45 per mile
            if (entry.box > 0) addToBucket('allowance', 'Box Rental', 1, parseFloat(entry.box));
            if (entry.equipment > 0) addToBucket('allowance', 'Equipment', 1, parseFloat(entry.equipment));
            if (entry.vehicle > 0) addToBucket('allowance', 'Vehicle', 1, parseFloat(entry.vehicle));
            if (entry.mobile > 0) addToBucket('allowance', 'Mobile', 1, parseFloat(entry.mobile));
            if (entry.living > 0) addToBucket('allowance', 'Living', 1, parseFloat(entry.living));
            if (entry.computer > 0) addToBucket('allowance', 'Computer', 1, parseFloat(entry.computer));
            if (entry.software > 0) addToBucket('allowance', 'Software', 1, parseFloat(entry.software));
            // Removed: Meals Allowance field - no longer tracked in Financial Summary
            // if (entry.mealsAllowance > 0) addToBucket('allowance', 'Meals Allowance', 1, parseFloat(entry.mealsAllowance));
        });

        return {
            standardDaily,
            standardHourly,
            regularUnits,
            sixthDayUnits,
            seventhDayUnits,
            breakdowns: {
                basic: Array.from(itemsMap.values()).filter(i => i.category === 'basic'),
                overtime: Array.from(itemsMap.values()).filter(i => i.category === 'overtime'),
                meal: Array.from(itemsMap.values()).filter(i => i.category === 'meal'),
                allowance: Array.from(itemsMap.values()).filter(i => i.category === 'allowance'),
            }
        }
    }, [isEditingWeek, localEntries, entries, salary, crewInfo]);

    // Generate All Rows for Financial Grid
    const allRows = useMemo(() => {
        const s = activeSalary;
        const dr = s.standardDaily || 0;
        const hr = s.standardHourly || 0;

        const calc = (label, rate, units, type) => {
            const totalA = rate * units;
            const holiday = type !== 'allowance' ? totalA * 0.1207 : 0;
            return { label, rate, unit: units, totalA, holiday, totalAB: totalA + holiday, type };
        };

        const rows = [
            calc('Salary', dr, s.regularUnits, 'salary'),
            ...(s.breakdowns.basic || []).map((i) => calc(i.label, i.rate, i.units, 'salary')),
            calc('6th Day', dr, s.sixthDayUnits, 'salary'),
            calc('7th Day', dr, s.seventhDayUnits, 'salary'),
            ...(s.breakdowns.overtime || []).map((i) => calc(i.label, i.rate, i.units, 'ot')),
            ...(s.breakdowns.meal || []).map((i) => calc(i.label, i.rate, i.units, 'ot')),
            ...(s.breakdowns.allowance || []).map((i) => calc(i.label, i.rate, i.units, 'allowance')),
            ...customItems.map(i => calc(i.label, i.rate, i.unit, i.category))
        ];
        return rows;
    }, [activeSalary, customItems]);

    const summaryItemsList = [
        'Salary', '6th Day', '7th Day', 'Public Holiday', 'Travel Day',
        'Turnaround', 'Add Hour', 'Enhanced O/T', 'Camera O/T', 'Post O/T', 'Pre O/T', 'BTA',
        'Late Meal', 'Broken Meal', 'Travel', 'Dawn / Early', 'Night Pen',
        'Computer', 'Software', 'Box Rental', 'Equipment', 'Vehicle', 'Mobile', 'Living',
        'Per Diem Shoot Rate', 'Per Diem Non Shoot Rate', 'Breakfast', 'Lunch', 'Dinner', 'Fuel', 'Mileage'
    ];

    const summaryData = useMemo(() => {
        // Collect all potential labels from standard list, current rows, and PTD data
        const allLabels = new Set([
            ...summaryItemsList,
            ...allRows.map(r => r.label),
            ...Object.keys(ptdDataByLabel)
        ]);

        // Helper to get order index
        const getOrder = (label) => {
            // 1. Exact match
            const idx = summaryItemsList.indexOf(label);
            if (idx !== -1) return idx;

            // 2. Upgrade Salary Row (starts with "Upgrade:") -> Place after Salary (index 0)
            if (label.startsWith('Upgrade:')) return 0.5;

            // 3. Salary suffixed (e.g. "Salary (Senior Electrician)") -> Place after Salary
            if (label.startsWith('Salary (')) return 0.6;

            // 4. Suffixed items (e.g. "Lunch (Role)") -> Place right after their base item
            const parts = label.split(' (');
            if (parts.length > 1) {
                const base = parts[0];
                const baseIdx = summaryItemsList.indexOf(base);
                if (baseIdx !== -1) return baseIdx + 0.5; // Add 0.5 to place after base
            }

            return 999;
        };

        // Convert to array and sort
        const sortedLabels = Array.from(allLabels).sort((a, b) => {
            const ordA = getOrder(a);
            const ordB = getOrder(b);

            if (ordA !== ordB) return ordA - ordB;

            // Tie-breaking for same bucket
            // If one matches the base label exactly, it comes first
            const isStandardA = summaryItemsList.includes(a);
            const isStandardB = summaryItemsList.includes(b);

            if (isStandardA && !isStandardB) return -1;
            if (!isStandardA && isStandardB) return 1;

            return a.localeCompare(b);
        });

        // Build Rows
        const result = sortedLabels.map(label => {
            // Removed: Holiday Accrual - no longer tracked in Financial Summary
            // if (label === 'Holiday Accrual') return null; // Handle separately at the end

            // Special Case: Always show standard items even if 0
            const isStandard = summaryItemsList.includes(label);
            const row = allRows.find(r => r.label === label);
            const ptd = ptdDataByLabel[label] || 0;

            // If strictly no data anywhere AND not standard, skip
            if (!row && ptd === 0 && !isStandard) return null;

            return {
                label,
                u: row ? row.unit : 0,
                rate: row ? row.rate : 0,
                hRate: row && row.holiday ? row.rate * 0.1207 : 0,
                p: row ? row.totalA : 0,
                hTotal: row ? row.holiday : 0,
                total: row ? row.totalA : 0, // Base Amount
                ptd,
                isExtra: !isStandard
            };
        }).filter(Boolean);

        return result;
    }, [allRows, summaryItemsList, ptdDataByLabel]);

    //temporary data sharing with financial summary page since there is no real data
    useEffect(() => {
        TEMP_SUMMARY_DATA = summaryData;
    }, [summaryData]);


    const netTotal = allRows.reduce((sum, r) => sum + r.totalAB, 0);
    // VAT only applies to SCHD and Loan Out contracts (not PAYE), and only if VAT registered
    const vatAmount = (contractCategory === 'SCHD' || contractCategory === 'Loan Out') && isVatRegistered ? netTotal * 0.20 : 0;
    const grossTotal = netTotal + vatAmount;

    const totals = {
        net: netTotal,
        vat: vatAmount,
        gross: grossTotal
    };

    const entriesToRender = isEditingWeek ? localEntries : entries;

    return (
        <div
            className={`relative flex flex-col bg-card overflow-hidden`}
        >

            {/* TOP HEADER - Compact (with Loan Out company name support) */}
            <div className={`flex-none p-5 py-4 border-b flex justify-between items-start shadow-sm z-10 relative`}>

                <div className="flex gap-10">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-0.5">Name</span>
                        <span className="text-sm font-black uppercase text-purple-950 dark:text-gray-100">{crewInfo.firstName} {crewInfo.lastName}</span>
                        <span className="text-[10px] text-purple-600 font-medium">{crewInfo.role}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-0.5">Department</span>
                        <span className="text-xs font-bold uppercase text-gray-700 dark:text-gray-300">{crewInfo.department}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-0.5">Week Ending</span>
                        <span className="text-xs font-bold uppercase text-gray-700 dark:text-gray-300">Sun 16 Nov 2025</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-0.5">Contract</span>
                        <span className="text-xs font-bold uppercase text-gray-700 dark:text-gray-300">
                            {crewType === 'weekly' ? 'Weekly' : 'Daily'} / {contractCategory === 'SCHD' ? 'Sched D' : contractCategory === 'Loan Out' ? 'Loan Out' : contractCategory}
                        </span>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex items-center gap-2 pl-4 border-l border-purple-100">
                        {/* Crew-specific buttons */}
                        {currentUserRole === "crew" && (
                            <>
                                {!isEditingWeek && !readOnly && !isPaid ? (
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={handleCrewEdit}
                                        className="uppercase text-[10px] tracking-wider"
                                    >
                                        <Edit3 className="size-4" />
                                        Edit
                                    </Button>
                                ) : !readOnly && !isPaid ? (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={handleCrewSave}
                                            className="uppercase text-[10px] tracking-wider"
                                        >
                                            <Save className="size-4" />
                                            Save
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="default"
                                            onClick={handleCrewSubmit}
                                            className="uppercase text-[10px] tracking-wider bg-green-600 hover:bg-green-700"
                                        >
                                            <Send className="size-4" />
                                            Submit
                                        </Button>
                                    </>
                                ) : null}
                            </>
                        )}

                        {/* HOD/Finance/Payroll buttons */}
                        {currentUserRole !== "crew" && (
                            <>
                                {!isEditingWeek ? (
                                    <InfoTooltip
                                        content={"Revise Timesheet"}
                                    >
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={handleRevise}
                                        >
                                            <Edit3 className="size-3" />
                                        </Button>
                                    </InfoTooltip>
                                ) : (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleRevert}
                                            className="uppercase text-[10px] tracking-wider"
                                        >
                                            <RotateCcw className="size-4" />
                                            Revert
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={handleRecalculate}
                                            className="uppercase text-[10px] tracking-wider"
                                        >
                                            <Calculator className="size-4" />
                                            Recalculate
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="default"
                                            onClick={handleApprove}
                                            className="uppercase text-[10px] tracking-wider bg-green-600 hover:bg-green-700"
                                        >
                                            <CheckCircle2 className="size-4" />
                                            Save
                                        </Button>
                                    </>
                                )}
                            </>
                        )}
                        <InfoTooltip
                            content={"Graphical View of chart"}
                        >
                            <Button size={"icon"} variant={"outline"} onClick={() => setShowGraphicalView(true)}>
                                <ChartColumnStacked className="w-4 h-4" />
                            </Button>
                        </InfoTooltip>

                        {/* Audit Log */}
                        <Popover>
                            <InfoTooltip content="View Audit logs">
                                <PopoverTrigger asChild>
                                    <Button size="icon" variant="outline">
                                        <History className="w-4 h-4" />
                                    </Button>
                                </PopoverTrigger>
                            </InfoTooltip>


                            <PopoverContent className="w-80 p-0 z-50" align="end">
                                <div className="p-3 border-b bg-muted rounded-t-lg">
                                    <h4 className="font-bold text-xs uppercase text-gray-500 tracking-wider">
                                        Audit Log
                                    </h4>
                                </div>

                                <div className="max-h-60 overflow-y-auto p-2 space-y-2">
                                    {auditLogs.length === 0 ? (
                                        <div className="text-center text-gray-400 py-4 text-[10px]">
                                            No changes recorded since submission
                                        </div>
                                    ) : (
                                        auditLogs.map((log, i) => (
                                            <div key={i} className="text-[10px] border-b pb-2 last:border-0">
                                                <div className="flex justify-between text-muted-foreground mb-0.5">
                                                    <span>{log.date}</span>
                                                    <span className="font-bold">{log.user}</span>
                                                </div>
                                                <div className="text-gray-700 font-medium">{log.details}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>

                        <InfoTooltip
                            content={"Mileage & Fuel Reimbursement"}
                        >
                            <Button size={"icon"} variant={"outline"}
                                onClick={() => navigate(`/projects/${params.projectName}/fuel-mileage/2026-05-05?claim=#124322`)}
                            >
                                <Car className="w-4 h-4" />
                            </Button>
                        </InfoTooltip>

                        {/* Financial Summary Button */}
                        <InfoTooltip
                            content={"Financial Summary"}
                        >
                            <Button size={"icon"} variant={"outline"}
                                onClick={() => navigate("financial-summary")}
                            >
                                <Wallet className="w-4 h-4" />
                            </Button>
                        </InfoTooltip>
                        {/* Week Completion Indicator - Compact version for header */}

                        <WeekCompletionIndicator
                            weekEntries={localEntries}
                            compact={true}
                        />

                        <TimesheetHeaderButtons
                            currentUserRole={currentUserRole}
                            contractCategory={contractCategory}
                            onExportTimesheet={() => toast.info("Printing Pdf intiated.", { description: "currently not exporting pdf temporarily due to mock data" })}
                            onExportInvoice={() => toast.info("Printing Pdf intiated.", { description: "currently not exporting pdf temporarily due to mock data" })}
                            onFinanceAction={() => {/* TODO: Add functionality */ }}
                        />

                        {/* Status Badge - Far Right */}
                        {(() => {
                            const isFullyApproved =
                                signatures.length === 5 && signatures.every(s => s.name && s.date)

                            let status = "submitted"

                            if (isEditingWeek) {
                                status = "editing"
                            } else if (isFullyApproved) {
                                status = "approved"
                            }

                            return (
                                <StatusBadge
                                    status={status}
                                    size="sm"
                                    className={cn(
                                        "uppercase tracking-wider shadow-sm",
                                        isEditingWeek && "animate-pulse"
                                    )}
                                />
                            )
                        })()}
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT - Single Page Layout */}
            <div className="flex-1 grid grid-cols-[1fr_auto] overflow-hidden relative">
                {/* Status Watermark - Large diagonal across entire page */}
                <TimesheetStatusWatermark status={timesheetStatus} mode="watermark" />

                {/* LEFT COLUMN: Timecard Grid */}
                <div className="flex-1 flex flex-col border-r overflow-hidden">
                    <div className="overflow-x-auto">
                        {/* WIDTH LOCK */}
                        <div className="min-w-[1100px]">

                            <div className={cn("grid grid-cols-[110px_140px_130px_120px_1fr_1fr_120px]" +
                                " bg-purple-50/80 dark:bg-purple-900/20" +
                                " border-b text-[10px] font-black uppercase tracking-wider " +
                                "sticky top-0 z-10 py-0.5 px-3")}
                            >

                                <div className="p-2 border-r min-w-0">Date Calendar</div>
                                <div className="p-2 border-r min-w-0">Type / Unit Location</div>
                                <div className="p-2 border-r min-w-0">In / Out</div>
                                <div className="p-2 border-r min-w-0">Upgrade</div>
                                <div className="p-2 border-r text-center min-w-0">Overview</div>
                                <div className="p-2 border-r text-center min-w-0">Allowances</div>
                                <div className="p-2 min-w-0">Notes</div>
                            </div>

                            <div>
                                {entriesToRender.map((entry, idx) => {
                                    const autoValues = {};
                                    let workDaysCount = 0;

                                    const isComplete = isDayComplete(entry);
                                    if (entry.dayType === 'Work' && isComplete) {
                                        workDaysCount++;
                                        if (workDaysCount === 6) autoValues.sixthDay = 1;
                                        if (workDaysCount === 7) autoValues.seventhDay = 1;
                                    }
                                    if (entry.dayType === 'Travel') autoValues.travelDay = 1;
                                    if (entry.dayType === 'Turnaround') autoValues.turnaround = 1;

                                    return (
                                        <TimesheetDataRow
                                            key={idx}
                                            entry={entry}
                                            index={idx}
                                            isEditing={isEditingWeek}
                                            update={(f, v) => updateLocalEntry(idx, f, v)}
                                            upgradeRoles={upgradeRoles}
                                            autoValues={autoValues}
                                            currentUserRole={currentUserRole}
                                            calendarSchedule={calendarSchedule}
                                            t={t}
                                            HOURS={HOURS}
                                            MINUTES={MINUTES}
                                            MEAL_OPTIONS={MEAL_OPTIONS}
                                            OVERVIEW_FIELDS={OVERVIEW_FIELDS}
                                            ALLOWANCE_FIELDS={ALLOWANCE_FIELDS}
                                            LOCATIONS={LOCATIONS}
                                            formatEntryDate={formatEntryDate}
                                        />
                                    );
                                })}
                            </div>

                        </div>
                    </div>

                    <SalarySidebarSignatures
                        crewInfo={crewInfo}
                        signatures={signatures}
                    />
                </div>

                {/* RIGHT COLUMN: Financial Summary with Holiday Column */}
                <div className={`w-[360px] flex-none flex flex-col border-l bg-white dark:bg-[#0f0e13]`}>
                    <div className={`p-2.5 px-4 font-black text-center text-[10px] uppercase tracking-wider bg-purple-50/80 dark:bg-purple-900/20 border-b text-purple-800 dark:text-purple-300 flex items-center justify-center sticky top-0 z-10 shadow-sm`}>
                        Financial Summary <span className="opacity-70 ml-1">(Weekly Rate - {c(crewInfo.weeklyRate || crewInfo.dailyRate * 5)})</span>
                    </div>

                    {/* New Header with combined columns */}
                    <div className={`grid grid-cols-[2fr_1fr_0.8fr_1.2fr_1fr] text-[8px] font-black uppercase py-2 px-4 bg-muted border-b`}>
                        <div>ITEM</div>
                        <div className="text-center">RATE / HOL</div>
                        <div className="text-center">UNIT</div>
                        <div className="text-center">TOTAL A / B</div>
                        <div className="text-right">TOTAL</div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {summaryData.map((row, i) => (
                            <div key={i} className={`grid grid-cols-[2fr_1fr_0.8fr_1.2fr_1fr] ${row.hTotal > 0 ? 'py-2' : 'py-1'} px-4 text-[10px] items-center border-b ${row.total > 0 ? 'bg-purple-50/30 dark:bg-purple-900/10' : 'transparent'
                                }`}>
                                {/* Item name */}
                                <div className={`font-medium truncate leading-tight`}>
                                    {row.label}
                                </div>

                                {/* Rate / Holiday stacked */}
                                <div className="text-center  text-[10px]">
                                    {row.hTotal > 0 ? (
                                        <div className="flex flex-col leading-tight">
                                            <span >{n(row.rate)}</span>
                                            <span style={{ fontSize: '7px' }}>{c(row.hRate)}</span>
                                        </div>
                                    ) : (
                                        <span >{n(row.rate)}</span>
                                    )}
                                </div>

                                {/* Unit */}
                                <div className="text-center  text-[10px] font-medium">{n(row.u)}</div>

                                {/* Total A / Total B stacked */}
                                <div className="text-center  text-[10px]">
                                    {row.hTotal > 0 ? (
                                        <div className="flex flex-col leading-tight">
                                            <span >
                                                {c(row.p)}
                                            </span>
                                            <span style={{ fontSize: '7px' }}>
                                                {c(row.hTotal)}
                                            </span>
                                        </div>
                                    ) : (
                                        <span >
                                            {c(row.p)}
                                        </span>
                                    )}
                                </div>

                                {/* Final Total */}
                                <div className={`text-right  ${row.total > 0 ? 'font-bold' : ''}`}>
                                    {row.total > 0 ? c(row.total) : '-'}
                                </div>
                            </div>
                        ))}
                    </div>


                    <div className={`p-3 min-h-34 bg-[#181621]bg-purple-50 border-t flex-none`}>
                        <div className="space-y-1 mb-2">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="font-bold uppercase tracking-wider">Subtotal</span>
                                <span className=" font-bold">{c(totals.net)}</span>
                            </div>
                            {vatAmount > 0 && (
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="font-bold uppercase tracking-wider">VAT (20%)</span>
                                    <span className="">{c(totals.vat)}</span>
                                </div>
                            )}
                        </div>
                        <div className={`flex justify-between items-center pt-2 border-t-2`}>
                            <span className="text-[10px] font-black uppercase tracking-widest">Grand Total</span>
                            <span className="text-lg font-black">{c(totals.gross)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            {
                exportMode === 'timesheet' && (
                    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl w-full container max-h-full overflow-hidden flex flex-col relative">
                            <button onClick={() => setExportMode('none')} className="absolute top-4 right-4 z-50 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                            <div className="flex-1 overflow-auto bg-gray-100 p-8 flex justify-center">
                                <TimesheetPDFExport
                                    crewInfo={crewInfo}
                                    salary={activeSalary}
                                    weekEnding="16-11-2025"
                                    entries={entriesToRender}
                                    summaryData={summaryData}
                                    totals={{ net: netTotal, vat: vatAmount, gross: grossTotal }}
                                />
                            </div>
                        </div>
                    </div>
                )
            }

            {
                exportMode === 'data' && (
                    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl w-full container max-h-full overflow-hidden flex flex-col relative">
                            <button onClick={() => setExportMode('none')} className="absolute top-4 right-4 z-50 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                            <div className="flex-1 overflow-auto bg-gray-100 p-8 flex justify-center">
                                <TimesheetDataPDFExport
                                    crewInfo={{
                                        name: `${crewInfo.firstName} ${crewInfo.lastName}`,
                                        position: crewInfo.role,
                                        ...crewInfo
                                    }}
                                    weekEnding="16-11-2025"
                                    entries={entriesToRender.map((e, i) => {
                                        // Calculate date: Week Ending is Sun 16 Nov 2025.
                                        const baseDate = new Date(2025, 10, 16); // Month is 0-indexed (10=Nov)
                                        const dayOffset = 6 - i;
                                        const date = new Date(baseDate);
                                        date.setDate(baseDate.getDate() - dayOffset);

                                        const dateStr = date.toISOString().split('T')[0];

                                        // Construct ISO DateTime strings
                                        let inDateTime = "";
                                        let outDateTime = "";

                                        if (e.inTime) {
                                            inDateTime = `${dateStr}T${e.inTime}:00`;
                                        }

                                        if (e.outTime) {
                                            const outDate = new Date(date);
                                            if (e.inTime && e.outTime < e.inTime) {
                                                outDate.setDate(outDate.getDate() + 1);
                                            }
                                            const outDateStr = outDate.toISOString().split('T')[0];
                                            outDateTime = `${outDateStr}T${e.outTime}:00`;
                                        }

                                        return {
                                            date: dateStr,
                                            day: DAYS[i],
                                            dayNum: date.getDate(),
                                            month: date.toLocaleString('default', { month: 'short' }),
                                            year: date.getFullYear(),
                                            label: `${DAYS[i]} ${date.getDate()}`,
                                            status: 'submitted',
                                            dayType: e.dayType,
                                            unit: e.unit,
                                            workplace: e.workplace || [],
                                            workplaceLocation: e.workplaceLocation,
                                            upgrade: e.upgradeRole,
                                            inTime: e.inTime,
                                            inDateTime: inDateTime,
                                            outTime: e.outTime,
                                            outDateTime: outDateTime,
                                            nextDay: false,
                                            isFlatDay: e.isFlatDay,
                                            perDiem: e.perDiemShoot > 0 ? 'Shoot' : e.perDiemNon > 0 ? 'Non-Shoot' : ''
                                        };
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                )
            }

            <WeeklyGraphicalView
                entries={entriesToRender}
                weeklyRate={crewInfo.weeklyRate || crewInfo.dailyRate * 5}
                department={crewInfo.department}
                open={showGraphicalView}
                onOpenChange={setShowGraphicalView}
            />

            {/* <TimesheetExportModals
                exportMode={exportMode}
                setExportMode={setExportMode}
                crewInfo={crewInfo}
                activeSalary={activeSalary}
                entriesToRender={entriesToRender}
                summaryData={summaryData}
                netTotal={netTotal}
                vatAmount={vatAmount}
                grossTotal={grossTotal}
                isVatRegistered={isVatRegistered}
                contractCategory={contractCategory}
                companyName={companyName}
                crewType={crewType}
                allowanceCaps={allowanceCaps}
                customItems={customItems}
                holidayPayout={holidayPayout}
                signatures={signatures}
            /> */}
        </div >
    );
}