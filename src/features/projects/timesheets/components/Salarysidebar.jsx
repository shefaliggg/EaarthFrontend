import React, { useState, useMemo } from 'react';
import { GreenSignatureStamp } from './GreenSignatureStamp';
import { SalarySidebarSignatures } from './SalarySidebarSignatures';
import { TimesheetNavigationHeader } from './TimesheetNavigationHeader';
import { TimesheetHeaderButtons } from './TimesheetHeaderButtons';
import { TimesheetExportModals } from './TimesheetExportModals';

import {
    FileText,
    ChevronRight,
    User,
    Calendar,
    Plus,
    Trash2,
    CheckCircle,
    Clock,
    Circle,
    Send,
    Eye,
    ShieldCheck,
    Building2,
    Banknote,
    CheckCircle2,
    BadgeCheck,
    FilePlus,
    Download,
    X,
    DollarSign,
    ChevronDown,
    Edit2,
    RotateCcw,
    ThumbsUp,
    Edit3,
    Lock,
    EyeOff,
    RefreshCw,
    Calculator,
    History,
    ChevronLeft,
    MoreHorizontal,
    Car,
    Check,
    ChevronsUpDown,
    Wallet,
    Save
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/shared/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/shared/components/ui/command';
import { calculatePACTBECTUOvertime, isDayComplete, getWeekCompletionStatus, isTelevisionContract } from '../utils/pactBectuCalculations';
import { WeekCompletionIndicator } from './WeekCompletionIndicator';
import { toast } from 'sonner';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

// --- Constants from CrewSubmitTimesheet ---
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

// Helper formatting functions
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
            // Check for special days that override Salary to 0 FIRST (before flat day check)
            const s6 = Number(e.sixthDay);
            const s7 = Number(e.seventhDay);
            const ph = Number(e.publicHoliday);
            const tr = Number(e.travelDay);
            const tu = Number(e.turnaround);

            // If it's a 6th/7th/public/travel/turnaround day, Salary is always 0 (even if flat day)
            if ((!isNaN(s6) && s6 > 0) ||
                (!isNaN(s7) && s7 > 0) ||
                (!isNaN(ph) && ph > 0) ||
                (!isNaN(tr) && tr > 0) ||
                (!isNaN(tu) && tu > 0)) return 0;

            // Now check flat day
            if (e.isFlatDay) return 1;

            // Only count as 1 salary unit if Work is selected AND (has times OR is flat day)
            if (e.dayType === 'Work') {
                // Check if in/out times are entered
                const hasInTime = e.inTime && e.inTime.trim() !== '';
                const hasOutTime = e.outTime && e.outTime.trim() !== '';

                // Return 1 only if times are entered
                if (hasInTime && hasOutTime) return 1;

                // Otherwise return 0 (no salary unit yet)
                return 0;
            }
            return '';
        }
    },
    { k: 'sixthDay', l: '6th Day', type: 'number' },
    { k: 'seventhDay', l: '7th Day', type: 'number' },
    { k: 'publicHoliday', l: 'Public Holiday', type: 'number' },
    { k: 'travelDay', l: 'Travel Day', type: 'number' },
    {
        k: 'halfDay',
        l: 'Half Day',
        type: 'derived',
        getValue: (e) => e.dayType === 'Half Day' ? 1 : ''
    },
    {
        k: 'training',
        l: 'Training',
        type: 'derived',
        getValue: (e) => e.dayType === 'Training' ? 1 : ''
    },
    {
        k: 'driverCastTravel',
        l: 'Driver - Cast Travel',
        type: 'derived',
        getValue: (e) => e.dayType === 'Driver - Cast Travel' ? 1 : ''
    },
    {
        k: 'holiday',
        l: 'Holiday',
        type: 'derived',
        getValue: (e) => e.dayType === 'Holiday' ? 1 : ''
    },
    {
        k: 'sick',
        l: 'Sick',
        type: 'derived',
        getValue: (e) => e.dayType === 'Sick' ? 1 : ''
    },
    {
        k: 'personalIssue',
        l: 'Personal issue',
        type: 'derived',
        getValue: (e) => e.dayType === 'Personal issue' ? 1 : ''
    },
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
    { k: 'computer', l: 'Computer', type: 'number' },
    { k: 'software', l: 'Software', type: 'number' },
    { k: 'box', l: 'Box Rental', type: 'number' },
    { k: 'equipment', l: 'Equipment', type: 'number' },
    { k: 'vehicle', l: 'Vehicle', type: 'number' },
    { k: 'mobile', l: 'Mobile', type: 'number' },
    { k: 'living', l: 'Living', type: 'number' },
    { k: 'fuel', l: 'Fuel', type: 'number' },
    { k: 'mileage', l: 'Mileage', type: 'number' }
];

const FINANCIAL_METADATA = {
    // Salary & Fees
    'Salary': { code: '10-001', tag: 'Labor - Basic' },
    '6th Day': { code: '10-002', tag: 'Labor - OT' },
    '7th Day': { code: '10-003', tag: 'Labor - OT' },
    'Public Holiday': { code: '10-004', tag: 'Labor - OT' },
    'Travel Day': { code: '10-005', tag: 'Labor - Travel' },
    'Holiday Accrual': { code: '10-006', tag: 'Labor - Accrual' },
    'Half Day': { code: '10-007', tag: 'Labor - Basic' },
    'Training': { code: '10-008', tag: 'Labor - Training' },
    'Driver - Cast Travel': { code: '10-009', tag: 'Labor - Travel' },
    'Holiday': { code: '10-010', tag: 'Labor - Holiday' },
    'Sick': { code: '10-011', tag: 'Labor - Sick' },
    'Personal issue': { code: '10-012', tag: 'Labor - Personal' },

    // Penalties & OT
    'Turnaround': { code: '15-001', tag: 'Penalty' },
    'Add Hour': { code: '15-002', tag: 'Overtime' },
    'Enhanced O/T': { code: '15-003', tag: 'Overtime' },
    'Camera O/T': { code: '15-004', tag: 'Overtime' },
    'Post O/T': { code: '15-005', tag: 'Overtime' },
    'Pre O/T': { code: '15-006', tag: 'Overtime' },
    'BTA': { code: '15-007', tag: 'Allowance' },
    'Late Meal': { code: '15-008', tag: 'Penalty' },
    'Broken Meal': { code: '15-009', tag: 'Penalty' },
    'Dawn': { code: '15-010', tag: 'Penalty' },
    'Night': { code: '15-011', tag: 'Penalty' },

    // Travel & Allowances
    'Travel': { code: '20-001', tag: 'Travel' },
    'Mileage': { code: '20-002', tag: 'Travel' },
    'Fuel': { code: '20-003', tag: 'Travel' },

    // Equipment & Box
    'Box Rental': { code: '30-001', tag: 'Rental' },
    'Equipment': { code: '30-002', tag: 'Rental' },
    'Computer': { code: '30-003', tag: 'Rental' },
    'Software': { code: '30-004', tag: 'Rental' },
    'Mobile': { code: '30-005', tag: 'Communication' },
    'Vehicle': { code: '30-006', tag: 'Rental' },

    // Per Diem & Living
    'Living': { code: '40-001', tag: 'Living' },
    'Per Diem Shoot Rate': { code: '40-002', tag: 'Per Diem' },
    'Per Diem Non Shoot Rate': { code: '40-003', tag: 'Per Diem' },
    'Breakfast': { code: '40-004', tag: 'Meal' },
    'Lunch': { code: '40-005', tag: 'Meal' },
    'Dinner': { code: '40-006', tag: 'Meal' },
    'Meals Allowance': { code: '40-007', tag: 'Meal' }
};

const FinancialSummaryPage = ({
    onBack,
    data,
    currencySymbol = '£',
    currentUserRole = 'Crew',
    readOnly = false,
    allowanceCaps = {}
}) => {
    // Calculate Grand Totals (Holiday Accrual and Meals Allowance are now excluded from source data)
    const totalCurrent = data.reduce((sum, item) => sum + item.total, 0);
    const totalPTD = data.reduce((sum, item) => sum + (item.ptd || 0), 0);
    const totalCombined = totalCurrent + totalPTD;

    // Map of allowance labels to their cap keys
    const allowanceCapMap = {
        'Computer': 'computer',
        'Software': 'software',
        'Box Rental': 'box',
        'Equipment': 'equipment',
        'Vehicle': 'vehicle',
        'Mobile': 'mobile',
        'Living': 'living'
    };

    // State for editable budget codes and tags (only Finance and Payroll can edit)
    const [financialMetadata, setFinancialMetadata] = useState(FINANCIAL_METADATA);
    const [editingItem, setEditingItem] = useState(null);
    const [editCode, setEditCode] = useState('');
    const [editTag, setEditTag] = useState('');

    // Holiday Accrual state
    const [holidayAccrual, setHolidayAccrual] = useState({
        thisInvoice: 301.30,
        priorBalance: 1240.50,
        totalPot: 1541.80,
        payout: 0.00,
        remaining: 1541.80
    });

    const [isEditingPayout, setIsEditingPayout] = useState(false);
    const [editPayoutValue, setEditPayoutValue] = useState('0.00');

    const canEdit = !readOnly && (currentUserRole === 'Finance' || currentUserRole === 'Payroll');

    const handleEditClick = (label) => {
        if (!canEdit) {
            toast.error('Only Finance and Payroll roles can edit budget codes and tags');
            return;
        }
        const meta = financialMetadata[label] || { code: '---', tag: 'General' };
        setEditingItem(label);
        setEditCode(meta.code);
        setEditTag(meta.tag);
    };

    const handleSaveEdit = (label) => {
        if (!canEdit) {
            toast.error('Only Finance and Payroll roles can edit budget codes and tags');
            return;
        }
        setFinancialMetadata(prev => ({
            ...prev,
            [label]: { code: editCode, tag: editTag }
        }));
        setEditingItem(null);
        toast.success(`Updated ${label} budget code and tag`);
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        setEditCode('');
        setEditTag('');
    };

    const handleEditPayout = () => {
        if (!canEdit) {
            toast.error('Only Finance and Payroll roles can edit holiday accrual payout');
            return;
        }
        setEditPayoutValue(holidayAccrual.payout.toFixed(2));
        setIsEditingPayout(true);
    };

    const handleSavePayout = () => {
        if (!canEdit) {
            toast.error('Only Finance and Payroll roles can edit holiday accrual payout');
            return;
        }
        const newPayout = parseFloat(editPayoutValue) || 0;
        const newRemaining = holidayAccrual.totalPot - newPayout;
        setHolidayAccrual(prev => ({
            ...prev,
            payout: newPayout,
            remaining: newRemaining
        }));
        setIsEditingPayout(false);
        toast.success('Updated holiday accrual payout');
    };

    const handleCancelPayout = () => {
        setIsEditingPayout(false);
        setEditPayoutValue('0.00');
    };

    return (
        <div className="h-full w-full flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
            {/* Header */}
            <div className="flex-none px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm z-10 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all flex items-center gap-2 group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold">Back</span>
                </button>
                <div>
                    <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                        <Wallet className="w-5 h-5 text-purple-600" />
                        Financial Summary (Accounts Use Only)
                    </h2>
                    <p className="text-xs text-gray-500">
                        Breakdown of all earnings, budget codes, and paid-to-date totals.
                        <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold ${canEdit ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            Role: {currentUserRole} {canEdit ? '(Can Edit)' : '(View Only)'}
                        </span>
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Main Financial Table */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                                <tr className="border-b-2 border-purple-100 dark:border-purple-900/30 text-purple-900 dark:text-purple-300">
                                    <th className="py-1.5 px-4 font-black uppercase tracking-wider w-[25%]">Item</th>
                                    <th className="py-1.5 px-4 font-black uppercase tracking-wider w-[15%]">Budget Code</th>
                                    <th className="py-1.5 px-4 font-black uppercase tracking-wider w-[10%]">Tag</th>
                                    <th className="py-1.5 px-4 font-black uppercase tracking-wider text-right w-[15%]">Balance to Pay</th>
                                    <th className="py-1.5 px-4 font-black uppercase tracking-wider text-right w-[15%]">Current Week</th>
                                    <th className="py-1.5 px-4 font-black uppercase tracking-wider text-right w-[15%]">Paid To Date</th>
                                    <th className="py-1.5 px-4 font-black uppercase tracking-wider text-right w-[15%]">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {data.map((row, idx) => {
                                    const meta = financialMetadata[row.label] || { code: '---', tag: 'General' };
                                    const ptd = row.ptd || 0;
                                    const grandTotal = row.total + ptd;
                                    const isEditing = editingItem === row.label;

                                    return (
                                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                            <td className="py-1 px-4 font-bold text-gray-700 dark:text-gray-300 group-hover:text-purple-700">{row.label}</td>
                                            <td className="py-1 px-4">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editCode}
                                                        onChange={(e) => setEditCode(e.target.value)}
                                                        className="w-full px-2 py-0.5 text-[10px] font-mono border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        placeholder="Budget Code"
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-1 group/edit">
                                                        <span className="font-mono text-gray-500 text-[10px]">{meta.code}</span>
                                                        {canEdit && (
                                                            <button
                                                                onClick={() => handleEditClick(row.label)}
                                                                className="p-0.5 hover:bg-purple-100 rounded transition-colors"
                                                                title="Edit budget code and tag"
                                                            >
                                                                <Edit2 className="w-3 h-3 text-purple-600" />
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-1 px-4">
                                                {isEditing ? (
                                                    <div className="flex items-center gap-1">
                                                        <input
                                                            type="text"
                                                            value={editTag}
                                                            onChange={(e) => setEditTag(e.target.value)}
                                                            className="flex-1 px-2 py-0.5 text-[9px] border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                            placeholder="Tag"
                                                        />
                                                        <button
                                                            onClick={() => handleSaveEdit(row.label)}
                                                            className="p-0.5 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                                                        >
                                                            <Check className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="p-0.5 bg-gray-400 hover:bg-gray-500 text-white rounded transition-colors"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1">
                                                        <span className="inline-flex items-center px-1.5 py-0 rounded text-[9px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                                            {meta.tag}
                                                        </span>
                                                        {canEdit && (
                                                            <button
                                                                onClick={() => handleEditClick(row.label)}
                                                                className="p-0.5 hover:bg-purple-100 rounded transition-colors"
                                                                title="Edit budget code and tag"
                                                            >
                                                                <Edit2 className="w-3 h-3 text-purple-600" />
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-1 px-4 text-right">
                                                {(() => {
                                                    const capKey = allowanceCapMap[row.label];
                                                    if (capKey && allowanceCaps[capKey]) {
                                                        const cap = allowanceCaps[capKey].cap || 0;
                                                        const paidTillDate = allowanceCaps[capKey].paidTillDate || 0;
                                                        const balance = cap - paidTillDate;
                                                        return (
                                                            <span className="font-mono text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                                                                {currencySymbol}{balance.toFixed(2)}
                                                            </span>
                                                        );
                                                    }
                                                    return <span className="text-gray-300">-</span>;
                                                })()}
                                            </td>
                                            <td className={`py-1 px-4 text-right font-mono ${row.total > 0 ? 'text-gray-900 dark:text-gray-100 font-bold' : 'text-gray-300'}`}>
                                                <div className="flex flex-col items-end">
                                                    <span>{row.total > 0 ? `${currencySymbol}${row.total.toFixed(2)}` : '-'}</span>
                                                    {row.hTotal > 0 && (
                                                        <span className="text-[9px] text-gray-500 font-normal leading-none">
                                                            {currencySymbol}{row.hTotal.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className={`py-1 px-4 text-right font-mono ${ptd > 0 ? 'text-gray-900 dark:text-gray-100 font-bold' : 'text-gray-300'}`}>
                                                {ptd > 0 ? `${currencySymbol}${ptd.toFixed(2)}` : '-'}
                                            </td>
                                            <td className="py-1 px-4 text-right font-mono font-bold text-purple-700 dark:text-purple-400 bg-purple-50/30 dark:bg-purple-900/10">
                                                {currencySymbol}{grandTotal.toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="bg-gray-50 dark:bg-gray-800 font-bold border-t-2 border-gray-200 dark:border-gray-700 text-sm">
                                <tr>
                                    <td className="py-2 px-4 text-gray-900 dark:text-white" colSpan={3}>Grand Total</td>
                                    <td className="py-2 px-4 text-right text-gray-900 dark:text-white">{currencySymbol}{totalCurrent.toFixed(2)}</td>
                                    <td className="py-2 px-4 text-right text-gray-900 dark:text-white">{currencySymbol}{totalPTD.toFixed(2)}</td>
                                    <td className="py-2 px-4 text-right text-purple-700 dark:text-purple-300">{currencySymbol}{totalCombined.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Holiday Accrual Section */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700 rounded-lg p-4">
                        <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-green-800 dark:text-green-300 mb-3">
                            <Wallet className="w-4 h-4" />
                            Holiday Accrual
                        </h3>
                        <div className="grid grid-cols-5 gap-3">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-100 dark:border-green-800">
                                <div className="text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">This Invoice</div>
                                <div className="text-lg font-black text-green-700 dark:text-green-400">{currencySymbol}{holidayAccrual.thisInvoice.toFixed(2)}</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-100 dark:border-green-800">
                                <div className="text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">Prior Balance</div>
                                <div className="text-lg font-black text-gray-700 dark:text-gray-300">{currencySymbol}{holidayAccrual.priorBalance.toFixed(2)}</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-100 dark:border-green-800">
                                <div className="text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">Total Pot</div>
                                <div className="text-lg font-black text-purple-700 dark:text-purple-400">{currencySymbol}{holidayAccrual.totalPot.toFixed(2)}</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-100 dark:border-green-800 relative group">
                                <div className="text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1 flex items-center justify-between">
                                    Payout
                                    {!isEditingPayout && canEdit && (
                                        <button
                                            onClick={handleEditPayout}
                                            className="p-0.5 hover:bg-purple-100 rounded transition-colors"
                                            title="Edit payout amount"
                                        >
                                            <Edit2 className="w-3 h-3 text-purple-600" />
                                        </button>
                                    )}
                                </div>
                                {isEditingPayout ? (
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={editPayoutValue}
                                            onChange={(e) => setEditPayoutValue(e.target.value)}
                                            className="w-full px-2 py-1 text-sm font-mono border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="0.00"
                                        />
                                        <button
                                            onClick={handleSavePayout}
                                            className="p-1 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                                        >
                                            <Check className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={handleCancelPayout}
                                            className="p-1 bg-gray-400 hover:bg-gray-500 text-white rounded transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-lg font-black text-red-600 dark:text-red-400">{currencySymbol}{holidayAccrual.payout.toFixed(2)}</div>
                                )}
                            </div>
                            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-3 border border-green-400">
                                <div className="text-[9px] uppercase font-bold text-white/80 mb-1">Remaining</div>
                                <div className="text-lg font-black text-white">{currencySymbol}{holidayAccrual.remaining.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EditRow = ({ entry, index, update, upgradeRoles, autoValues = {}, currentUserRole = 'Crew', calendarSchedule }) => {
    const isWork = ['Work', 'Travel', 'Half Day', 'Travel & Turnaround', 'Driver - Cast Travel', 'Training'].includes(entry.dayType);
    const [openLocation, setOpenLocation] = React.useState(false);
    // Crew can only edit specific fields
    const isCrewRestricted = currentUserRole === 'Crew';

    // Get calendar data for this date
    const calendarData = calendarSchedule?.[entry.date];

    return (
        <div className="w-full grid grid-cols-[0.7fr_0.9fr_0.7fr_0.6fr_2.2fr_2.0fr_0.6fr] min-h-[60px] border-b border-purple-100 bg-purple-50/10 items-stretch">
            {/* 1. Date */}
            <div className="p-2 border-r border-purple-100 flex flex-col justify-center items-start pl-3">
                <span className="font-bold text-gray-800 dark:text-gray-200 text-[9px]">{formatEntryDate(entry.date)}</span>
                {calendarData && calendarData.dayType === 'Shoot' && (
                    <div className="flex flex-col mt-1.5 space-y-0.5 leading-none select-none">
                        <span className="text-[8px] font-bold uppercase text-purple-700 dark:text-purple-400">
                            {calendarData.unit || 'Main unit'} <span className="font-medium normal-case text-purple-600 dark:text-purple-300">{calendarData.workingHours || '(10 CWD)'}</span>
                        </span>
                        <span className="text-[8px] font-medium text-purple-600 dark:text-purple-300">Shoot day #{calendarData.dayNumber || '-'}</span>
                        <span className="text-[8px] font-bold font-mono text-purple-800 dark:text-purple-200">{calendarData.unitCall || '00:00'}-{calendarData.unitWrap || '00:00'}</span>
                    </div>
                )}
            </div>

            {/* 2. Type / Unit / Workplace */}
            <div className="p-2 border-r border-purple-100 flex flex-col justify-center gap-1.5">
                {/* Day Type - Prominent */}
                <select
                    value={entry.dayType}
                    onChange={(e) => update('dayType', e.target.value)}
                    className={`w-full text-[9px] font-bold text-center rounded px-1 py-1 outline-none focus:border-purple-400 uppercase tracking-wide border transition-colors ${entry.dayType === 'Work'
                            ? 'bg-purple-50 border-purple-200 text-purple-800'
                            : 'bg-gray-50 border-gray-200 text-gray-500'
                        }`}
                >
                    <option value="">Select...</option>
                    <option value="Work">Work</option>
                    <option value="Rest">Rest</option>
                    <option value="Travel">Travel</option>
                    <option value="Turnaround">Turnaround</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Public holiday off">Public holiday off</option>
                    <option value="Personal issue">Personal issue</option>
                    <option value="Sick">Sick</option>
                    <option value="Training">Training</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Travel & Turnaround">Travel & Turnaround</option>
                    <option value="Driver - Cast Travel">Driver - Cast Travel</option>
                </select>

                {isWork && (
                    <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                        {/* Unit & Workplace Row */}
                        <div className="flex gap-1">
                            <select
                                value={entry.unit}
                                onChange={(e) => update('unit', e.target.value)}
                                className="flex-1 min-w-0 text-[9px] bg-white border border-gray-200 rounded px-1 py-0.5 text-gray-700 outline-none focus:border-purple-300"
                            >
                                <option value="Main">Main Unit</option>
                                <option value="2nd">2nd Unit</option>
                            </select>

                            <select
                                value={entry.workplace?.[0] === 'On Set' || entry.workplace?.[0] === 'Off Set' ? entry.workplace[0] : 'On Set'}
                                onChange={(e) => update('workplace', [e.target.value])}
                                className="flex-1 min-w-0 text-[9px] bg-white border border-gray-200 rounded px-1 py-0.5 text-gray-700 outline-none focus:border-purple-300 uppercase"
                            >
                                <option value="On Set">ON SET</option>
                                <option value="Off Set">OFF SET</option>
                            </select>
                        </div>

                        {/* Location Input with Popover */}
                        <div className="flex items-center gap-1 relative">
                            <input
                                type="text"
                                value={entry.workplaceLocation || ''}
                                onChange={(e) => update('workplaceLocation', e.target.value)}
                                className="w-full text-[9px] bg-white border border-gray-200 rounded px-2 py-0.5 text-gray-700 placeholder-gray-400 outline-none focus:border-purple-300"
                                placeholder="Location..."
                            />
                            <Popover open={openLocation} onOpenChange={setOpenLocation}>
                                <PopoverTrigger asChild>
                                    <button className="h-5 w-5 flex items-center justify-center bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 text-gray-500">
                                        <ChevronsUpDown className="h-3 w-3" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-[200px]" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search location..." className="h-8 text-[10px]" />
                                        <CommandEmpty>No location found.</CommandEmpty>
                                        <CommandGroup>
                                            {LOCATIONS.map((loc) => (
                                                <CommandItem
                                                    key={loc}
                                                    value={loc}
                                                    onSelect={(currentValue) => {
                                                        update('workplaceLocation', loc);
                                                        setOpenLocation(false);
                                                    }}
                                                    className="text-[10px]"
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-3 w-3",
                                                            entry.workplaceLocation === loc ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {loc}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. In / Out */}
            <div className="p-2 border-r border-purple-100 flex flex-col justify-center gap-1.5">
                {isWork ? (
                    <>
                        {/* IN TIME */}
                        <div className="flex gap-1">
                            <select
                                disabled={entry.isFlatDay}
                                value={(entry.inTime || '').split(':')[0] || ''}
                                onChange={(e) => {
                                    const m = (entry.inTime || '').split(':')[1] || '00';
                                    update('inTime', `${e.target.value}:${m}`);
                                }}
                                className="flex-1 min-w-0 text-[9px] bg-purple-50/50 border border-purple-100 rounded text-center outline-none focus:border-purple-300 py-1 font-mono font-bold text-purple-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="" disabled>HH</option>
                                {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                            <select
                                disabled={entry.isFlatDay}
                                value={(entry.inTime || '').split(':')[1] || ''}
                                onChange={(e) => {
                                    const h = (entry.inTime || '').split(':')[0] || '08';
                                    update('inTime', `${h}:${e.target.value}`);
                                }}
                                className="flex-1 min-w-0 text-[9px] bg-purple-50/50 border border-purple-100 rounded text-center outline-none focus:border-purple-300 py-1 font-mono font-bold text-purple-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="" disabled>MM</option>
                                {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>

                        {/* MEAL */}
                        <select
                            value={entry.mealStatus || 'Per calendar day'}
                            onChange={(e) => update('mealStatus', e.target.value)}
                            className="w-full text-[9px] border border-gray-200 rounded px-1 py-0.5 outline-none focus:border-purple-300 bg-white text-gray-700"
                            title="Break Meal"
                        >
                            {MEAL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>

                        {/* OUT TIME */}
                        <div className="flex gap-1 items-center">
                            <div className="flex-1 flex gap-1 min-w-0">
                                <select
                                    disabled={entry.isFlatDay}
                                    value={(entry.outTime || '').split(':')[0] || ''}
                                    onChange={(e) => {
                                        const m = (entry.outTime || '').split(':')[1] || '00';
                                        update('outTime', `${e.target.value}:${m}`);
                                    }}
                                    className="flex-1 min-w-0 text-[9px] bg-purple-50/50 border border-purple-100 rounded text-center outline-none focus:border-purple-300 py-1 font-mono font-bold text-purple-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="" disabled>HH</option>
                                    {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                                </select>
                                <select
                                    disabled={entry.isFlatDay}
                                    value={(entry.outTime || '').split(':')[1] || ''}
                                    onChange={(e) => {
                                        const h = (entry.outTime || '').split(':')[0] || '18';
                                        update('outTime', `${h}:${e.target.value}`);
                                    }}
                                    className="flex-1 min-w-0 text-[9px] bg-purple-50/50 border border-purple-100 rounded text-center outline-none focus:border-purple-300 py-1 font-mono font-bold text-purple-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="" disabled>MM</option>
                                    {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                            <button
                                onClick={() => update('nextDay', !entry.nextDay)}
                                className={`flex-none h-6 w-5 rounded border text-[8px] font-bold transition-all flex items-center justify-center ${entry.nextDay
                                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                        : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50'
                                    }`}
                                title="Toggle Next Day"
                            >
                                +1
                            </button>
                        </div>

                        <div className="flex items-center gap-1.5 px-1">
                            <input
                                type="checkbox"
                                checked={entry.isFlatDay || false}
                                onChange={(e) => update('isFlatDay', e.target.checked)}
                                className="w-3 h-3 text-purple-600 rounded border-gray-300 cursor-pointer"
                                id={`flat-day-${index}`}
                            />
                            <label htmlFor={`flat-day-${index}`} className="text-[8px] text-gray-500 font-medium cursor-pointer">Flat Day</label>
                        </div>
                    </>
                ) : <div className="text-center text-gray-300">-</div>}
            </div>

            {/* 4. Upgrade */}
            <div className="p-2 border-r border-purple-100 flex flex-col justify-center gap-1.5">
                <div className="flex items-center gap-1">
                    <input
                        type="checkbox"
                        checked={entry.isUpgraded || false}
                        onChange={(e) => update('isUpgraded', e.target.checked)}
                        className="w-3 h-3 text-purple-600 rounded border-gray-300"
                        title="Upgrade?"
                    />
                    <div className={`flex-1 flex flex-col gap-0.5 ${!entry.isUpgraded ? 'opacity-50' : ''}`}>
                        <select
                            disabled={!entry.isUpgraded}
                            value={entry.upgradeRole || ''}
                            onChange={(e) => {
                                const roleName = e.target.value;
                                update('upgradeRole', roleName);
                                const role = upgradeRoles.find(r => r.name === roleName);
                                if (role) {
                                    update('upgradeRate', role.rate);
                                }
                            }}
                            className="w-full text-[9px] bg-white border border-gray-200 rounded px-1 py-0.5 text-purple-700 font-bold"
                        >
                            <option value="">Role...</option>
                            {upgradeRoles.map(role => (
                                <option key={role.id} value={role.name}>{role.name}</option>
                            ))}
                        </select>
                        {entry.isUpgraded && (
                            <input
                                type="number"
                                value={entry.upgradeRate || ''}
                                onChange={(e) => update('upgradeRate', parseFloat(e.target.value))}
                                className="w-full text-[9px] bg-white border border-gray-200 rounded px-1 py-0.5 text-gray-700"
                                placeholder="Rate (£)"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* 5. Overview (Swapped position) */}
            <div className="p-1 border-r border-purple-100 flex items-center bg-white">
                <div className="w-full flex flex-col gap-0.5">
                    <div className="grid grid-cols-4 gap-0.5">
                        {OVERVIEW_FIELDS.map((f) => {
                            const isDerived = f.type === 'derived';

                            // 1. Determine Display Value
                            let rawVal = entry[f.k];
                            if ((rawVal === undefined || rawVal === '' || rawVal === 0) && autoValues && autoValues[f.k] !== undefined) {
                                rawVal = autoValues[f.k];
                                if (rawVal === 0) rawVal = '';
                            }

                            // 2. Prepare Effective Entry for Derived Calculations (Salary)
                            const effectiveEntry = { ...entry };
                            if (autoValues) {
                                Object.keys(autoValues).forEach(k => {
                                    if (effectiveEntry[k] === undefined || effectiveEntry[k] === '' || effectiveEntry[k] === null || effectiveEntry[k] === 0) {
                                        effectiveEntry[k] = autoValues[k];
                                    }
                                });
                            }

                            const val = isDerived ? f.getValue(effectiveEntry) : rawVal;

                            return (
                                <div key={f.k} className="flex items-center justify-between bg-gray-50 px-1 rounded border border-gray-100 h-5">
                                    <span className="text-[7px] uppercase text-black font-medium tracking-tight">{f.l}</span>
                                    {f.type === 'bool' ? (
                                        <input
                                            type="checkbox"
                                            checked={!!val}
                                            onChange={(e) => update(f.k, e.target.checked ? 1 : 0)}
                                            disabled={isCrewRestricted}
                                            className={`w-3 h-3 rounded border-gray-300 text-black focus:ring-black ${isCrewRestricted ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        />
                                    ) : f.k === 'night' ? (
                                        <input
                                            type="checkbox"
                                            checked={Number(val) > 0}
                                            onChange={(e) => !isDerived && !isCrewRestricted && update(f.k, e.target.checked ? 1 : 0)}
                                            disabled={isDerived || isCrewRestricted}
                                            className={`w-3 h-3 rounded border-gray-300 text-purple-600 focus:ring-purple-500 ${(isDerived || isCrewRestricted) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        />
                                    ) : (
                                        <input
                                            type="number"
                                            value={val}
                                            onChange={(e) => !isDerived && !isCrewRestricted && update(f.k, e.target.value)}
                                            readOnly={isDerived || isCrewRestricted}
                                            className={`w-6 text-[8px] bg-transparent text-right font-mono outline-none p-0 ${Number(val) > 0 ? 'text-green-600 font-bold' : (Number(val) < 0 ? 'text-red-600 font-bold' : 'text-black')
                                                } ${isDerived ? 'opacity-70 cursor-default' : ''}`}
                                            placeholder={isDerived ? '' : '-'}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 6. Allowances (Swapped position) */}
            <div className="p-2 border-r border-purple-100 flex flex-col justify-center gap-1">
                <div className="w-full flex flex-col gap-0.5">
                    <div className="grid grid-cols-3 gap-0.5">
                        {[
                            { k: 'perDiemShoot', l: 'Per Diem Shoot', type: 'bool' },
                            { k: 'perDiemNon', l: 'Per Diem Non Shoot', type: 'bool' },
                            { k: 'breakfast', l: 'Breakfast', type: 'bool' },
                            { k: 'lunch', l: 'Lunch', type: 'bool' },
                            { k: 'dinner', l: 'Dinner', type: 'bool' },
                            ...ALLOWANCE_FIELDS
                        ].map((f) => {
                            const val = entry[f.k];
                            const isBool = f.type === 'bool';
                            // Determine if field is editable by crew
                            const isEditableByCrew = ['perDiemShoot', 'perDiemNon', 'breakfast', 'lunch', 'dinner'].includes(f.k);
                            // Should be disabled if restricted role AND not one of the allowed fields
                            const isDisabled = isCrewRestricted && !isEditableByCrew;

                            return (
                                <div key={f.k} className="flex items-center justify-between bg-gray-50 px-1 rounded border border-gray-100 h-5">
                                    <span className="text-[7px] uppercase text-black font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis mr-1" title={f.l}>{f.l}</span>
                                    {isBool ? (
                                        <input
                                            type="checkbox"
                                            checked={!!val}
                                            onChange={(e) => update(f.k, e.target.checked ? 1 : 0)}
                                            disabled={isDisabled}
                                            className={`w-3 h-3 rounded border-gray-300 text-purple-600 focus:ring-purple-500 ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        />
                                    ) : (
                                        <input
                                            type="number"
                                            value={val || ''}
                                            onChange={(e) => update(f.k, e.target.value)}
                                            disabled={isDisabled}
                                            readOnly={isDisabled}
                                            className={`w-8 text-[8px] bg-transparent text-right font-mono outline-none p-0 shrink-0 ${Number(val) > 0 ? 'text-green-600 font-bold' : (Number(val) < 0 ? 'text-red-600 font-bold' : 'text-black')
                                                } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                                            placeholder="-"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 7. Notes (Moved to end) */}
            <div className="p-2 border-r border-purple-100 flex flex-col justify-center gap-1.5">
                <textarea
                    value={entry.notes || ''}
                    onChange={(e) => update('notes', e.target.value)}
                    className="w-full h-10 bg-white border border-gray-200 rounded px-1 py-0.5 text-[9px] text-gray-700 placeholder-gray-400 outline-none resize-none focus:border-purple-300 transition-colors"
                    placeholder="Notes..."
                />
            </div>
        </div>
    );
};

export function SalarySidebar({
    isDarkMode,
    allowanceCaps,
    setAllowanceCaps,
    salary,
    crewInfo,
    entries = [],
    crewType,
    setCrewType,
    customItems,
    setCustomItems,
    onEntriesUpdate,
    isPennyContract,
    currentUserRole = 'Crew',
    projectSettings,
    calendarSchedule,
    upgradeRoles = [],
    readOnly = false,
    isPaid = false,
    contractCategory = 'PAYE',
    companyName = '',
    onCrewNavigate,
    onCrewSelect,
    departmentCrewMembers = [],
    canNavigatePrev = true,
    canNavigateNext = true,
    onDepartmentNavigate,
    onDepartmentSelect,
    allDepartments = [],
    canNavigatePrevDept = true,
    canNavigateNextDept = true,
    onWeekNavigate,
    onWeekSelect,
    availableWeeks = [],
    currentWeek = '',
    canNavigatePrevWeek = true,
    canNavigateNextWeek = true
}: Props) {
    const [payHoliday, setPayHoliday] = useState(false);
    const [isVatRegistered, setIsVatRegistered] = useState(crewInfo?.isVATRegistered || false);
    const [holidayPayout, setHolidayPayout] = useState < string > ('');
    const [selectedView, setSelectedView] = useState < string > ('All');
    const [exportMode, setExportMode] = useState < 'none' | 'invoice' | 'timesheet' | 'data' | 'all' > ('none');
    const [showGraphicalView, setShowGraphicalView] = useState(false);
    const [showMileageForm, setShowMileageForm] = useState(false);
    const [showFinancialSummary, setShowFinancialSummary] = useState(false);
    const [showCrewDropdown, setShowCrewDropdown] = useState(false);
    const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
    const [showWeekDropdown, setShowWeekDropdown] = useState(false);

    // Track edit mode
    const [isEditingWeek, setIsEditingWeek] = useState(false);

    // Track timesheet status
    const [timesheetStatus, setTimesheetStatus] = useState < 'draft' | 'submitted' | 'partly-approved' | 'approved' | 'revised' | 'rejected' | 'paid' > ('draft');

    // Local copy of entries for editing
    const [localEntries, setLocalEntries] = useState < any[] > ([]);

    // Shared day filter state
    const [selectedDays, setSelectedDays] = useState < Set < string >> (new Set(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']));

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
    const [ptdDataByLabel] = useState < Record < string, number>> ({
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
    const [auditLogs, setAuditLogs] = useState < {
        date,
        user,
        action,
        details,
    }[] > ([
        { date: '16 Nov 18:30', user: 'James Wilson', action: 'SUBMIT', details: 'Initial submission for approval' },
        { date: '16 Nov 19:15', user: 'Michael Chen', action: 'APPROVE', details: 'Departmental approval granted' },
        { date: '17 Nov 09:30', user: 'Bernie Bellew', action: 'REVIEW', details: 'Production review completed' }
    ]);

    const theme = {
        bg: isDarkMode ? 'bg-[#0f0e13]' : 'bg-white',
        card: isDarkMode ? 'bg-[#181621]' : 'bg-purple-50/30',
        border: isDarkMode ? 'border-gray-700' : 'border-purple-200',
        text: isDarkMode ? 'text-gray-200' : 'text-purple-950',
        textMuted: isDarkMode ? 'text-gray-400' : 'text-purple-700',
        accent: isDarkMode ? 'bg-purple-900/20 text-purple-400' : 'bg-purple-100 text-purple-800',
        headerBg: isDarkMode ? 'bg-[#1e1b29]' : 'bg-purple-50',
        input: isDarkMode ? 'bg-[#13111a] border-gray-700 text-white' : 'bg-white border-purple-200 text-purple-900',
    };

    // Set timesheet status based on isPaid prop
    React.useEffect(() => {
        if (isPaid) {
            setTimesheetStatus('paid');
        } else if (readOnly) {
            setTimesheetStatus('approved');
        }
    }, [isPaid, readOnly]);

    // Watch for changes when crew is editing - automatically set to draft
    React.useEffect(() => {
        if (isEditingWeek && currentUserRole === 'Crew' && timesheetStatus !== 'draft') {
            setTimesheetStatus('draft');
        }
    }, [isEditingWeek, localEntries, currentUserRole]);

    // Helper function to merge calendar schedule data into entries
    const mergeCalendarDataIntoEntries = (entriesToMerge[]) => {
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
                user: currentUserRole || 'Accounts',
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

    const roundToQuarter = (hours: number): number => Math.ceil(hours * 4) / 4;

    const updateLocalEntry = (dayIndex: number, field, value) => {
        if (!isEditingWeek) return;

        // Audit Log: Record change
        const currentEntry = localEntries[dayIndex];
        if (currentEntry) {
            const oldValue = currentEntry[field];
            // Simple equality check (loose for numbers/strings)
            if (oldValue != value) {
                const changeLog = {
                    date: new Date().toLocaleString(),
                    user: currentUserRole || 'Admin',
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

    const _formatEntryDate_unused = (dateStr) => {
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

    const _EditRow_unused = ({ entry, index, update }) => {
        const isWork = entry.dayType === 'Work';
        // Crew can only edit specific fields
        const isCrewRestricted = currentUserRole === 'Crew';

        return (
            <div className="flex-1 grid grid-cols-[0.85fr_0.9fr_1.3fr_1.5fr_2.5fr_1.3fr] min-h-[60px] border-b border-purple-100 bg-purple-50/10 items-stretch">
                {/* 1. Date */}
                <div className="p-2 border-r border-purple-100 flex flex-col justify-center items-start pl-3">
                    <span className="font-bold text-gray-800 text-[9px]">{formatEntryDate(entry.date)}</span>
                </div>

                {/* 2. Type / Unit / Workplace */}
                <div className="p-2 border-r border-purple-100 flex flex-col justify-center gap-1.5">
                    {/* Day Type - Prominent */}
                    <select
                        value={entry.dayType}
                        onChange={(e) => update('dayType', e.target.value)}
                        className={`w-full text-[9px] font-bold text-center rounded px-1 py-1 outline-none focus:border-purple-400 uppercase tracking-wide border transition-colors ${entry.dayType === 'Work'
                                ? 'bg-purple-50 border-purple-200 text-purple-800'
                                : 'bg-gray-50 border-gray-200 text-gray-500'
                            }`}
                    >
                        <option value="Work">Work</option>
                        <option value="Rest">Rest</option>
                        <option value="Holiday">Hol</option>
                        <option value="Travel">Trvl</option>
                    </select>

                    {entry.dayType === 'Work' && (
                        <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                            {/* Unit & Workplace Row */}
                            <div className="flex gap-1">
                                <select
                                    value={entry.unit}
                                    onChange={(e) => update('unit', e.target.value)}
                                    className="flex-1 min-w-0 text-[9px] bg-white border border-gray-200 rounded px-1 py-0.5 text-gray-700 outline-none focus:border-purple-300"
                                >
                                    <option value="Main">Main Unit</option>
                                    <option value="2nd">2nd Unit</option>
                                </select>

                                <select
                                    value={entry.workplace?.[0] || 'On Set'}
                                    onChange={(e) => update('workplace', [e.target.value])}
                                    className="flex-1 min-w-0 text-[9px] bg-white border border-gray-200 rounded px-1 py-0.5 text-gray-700 outline-none focus:border-purple-300 uppercase"
                                >
                                    <option value="On Set">ON SET</option>
                                    <option value="Off Set">OFF SET</option>
                                    <option value="Base">BASE</option>
                                </select>
                            </div>

                            {/* Location Input */}
                            <div className="relative">
                                <input
                                    list={`locations-${index}`}
                                    type="text"
                                    value={entry.workplaceLocation || ''}
                                    onChange={(e) => update('workplaceLocation', e.target.value)}
                                    className="w-full text-[9px] bg-white border border-gray-200 rounded px-2 py-0.5 text-gray-700 placeholder-gray-400 outline-none focus:border-purple-300"
                                    placeholder="Location..."
                                />
                                <datalist id={`locations-${index}`}>
                                    {LOCATIONS.map(loc => <option key={loc} value={loc} />)}
                                </datalist>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. In / Out */}
                <div className="p-2 border-r border-purple-100 flex flex-col justify-center gap-1.5">
                    {isWork ? (
                        <>
                            {/* IN TIME */}
                            <div className="flex gap-1">
                                <select
                                    value={(entry.inTime || '').split(':')[0] || ''}
                                    onChange={(e) => {
                                        const m = (entry.inTime || '').split(':')[1] || '00';
                                        update('inTime', `${e.target.value}:${m}`);
                                    }}
                                    className="flex-1 min-w-0 text-[9px] bg-purple-50/50 border border-purple-100 rounded text-center outline-none focus:border-purple-300 py-1 font-mono font-bold text-purple-900 cursor-pointer"
                                >
                                    <option value="" disabled>HH</option>
                                    {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                                </select>
                                <select
                                    value={(entry.inTime || '').split(':')[1] || ''}
                                    onChange={(e) => {
                                        const h = (entry.inTime || '').split(':')[0] || '08';
                                        update('inTime', `${h}:${e.target.value}`);
                                    }}
                                    className="flex-1 min-w-0 text-[9px] bg-purple-50/50 border border-purple-100 rounded text-center outline-none focus:border-purple-300 py-1 font-mono font-bold text-purple-900 cursor-pointer"
                                >
                                    <option value="" disabled>MM</option>
                                    {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>

                            {/* MEAL */}
                            <select
                                value={entry.mealStatus || 'Per calendar day'}
                                onChange={(e) => update('mealStatus', e.target.value)}
                                className="w-full text-[9px] bg-white border border-gray-200 rounded px-1 py-0.5 text-gray-700 outline-none focus:border-purple-300"
                                title="Break Meal"
                            >
                                {MEAL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>

                            {/* OUT TIME */}
                            <div className="flex gap-1 items-center">
                                <div className="flex-1 flex gap-1 min-w-0">
                                    <select
                                        value={(entry.outTime || '').split(':')[0] || ''}
                                        onChange={(e) => {
                                            const m = (entry.outTime || '').split(':')[1] || '00';
                                            update('outTime', `${e.target.value}:${m}`);
                                        }}
                                        className="flex-1 min-w-0 text-[9px] bg-purple-50/50 border border-purple-100 rounded text-center outline-none focus:border-purple-300 py-1 font-mono font-bold text-purple-900 cursor-pointer"
                                    >
                                        <option value="" disabled>HH</option>
                                        {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                    <select
                                        value={(entry.outTime || '').split(':')[1] || ''}
                                        onChange={(e) => {
                                            const h = (entry.outTime || '').split(':')[0] || '18';
                                            update('outTime', `${h}:${e.target.value}`);
                                        }}
                                        className="flex-1 min-w-0 text-[9px] bg-purple-50/50 border border-purple-100 rounded text-center outline-none focus:border-purple-300 py-1 font-mono font-bold text-purple-900 cursor-pointer"
                                    >
                                        <option value="" disabled>MM</option>
                                        {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <button
                                    onClick={() => update('nextDay', !entry.nextDay)}
                                    className={`flex-none h-6 w-5 rounded border text-[8px] font-bold transition-all flex items-center justify-center ${entry.nextDay
                                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                            : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50'
                                        }`}
                                    title="Toggle Next Day"
                                >
                                    +1
                                </button>
                            </div>

                            <div className="flex items-center gap-1.5 px-1">
                                <input
                                    type="checkbox"
                                    checked={entry.isFlatDay || false}
                                    onChange={(e) => update('isFlatDay', e.target.checked)}
                                    className="w-3 h-3 text-purple-600 rounded border-gray-300 cursor-pointer"
                                    id={`flat-day-${index}`}
                                />
                                <label htmlFor={`flat-day-${index}`} className="text-[8px] text-gray-500 font-medium cursor-pointer">Flat Day</label>
                            </div>
                        </>
                    ) : <div className="text-center text-gray-300">-</div>}
                </div>

                {/* 4. Upgrade / Notes */}
                <div className="p-2 border-r border-purple-100 flex flex-col justify-center gap-1.5">
                    <div className="flex items-center gap-1">
                        <input
                            type="checkbox"
                            checked={entry.isUpgraded || false}
                            onChange={(e) => update('isUpgraded', e.target.checked)}
                            className="w-3 h-3 text-purple-600 rounded border-gray-300"
                            title="Upgrade?"
                        />
                        <div className={`flex-1 flex flex-col gap-0.5 ${!entry.isUpgraded ? 'opacity-50' : ''}`}>
                            <select
                                disabled={!entry.isUpgraded}
                                value={entry.upgradeRole || ''}
                                onChange={(e) => {
                                    const roleName = e.target.value;
                                    update('upgradeRole', roleName);
                                    const role = upgradeRoles.find(r => r.name === roleName);
                                    if (role) {
                                        update('upgradeRate', role.rate);
                                    }
                                }}
                                className="w-full text-[9px] bg-white border border-gray-200 rounded px-1 py-0.5 text-purple-700 font-bold"
                            >
                                <option value="">Role...</option>
                                {upgradeRoles.map(role => (
                                    <option key={role.id} value={role.name}>{role.name}</option>
                                ))}
                            </select>
                            {entry.isUpgraded && (
                                <input
                                    type="number"
                                    value={entry.upgradeRate || ''}
                                    onChange={(e) => update('upgradeRate', parseFloat(e.target.value))}
                                    className="w-full text-[9px] bg-white border border-gray-200 rounded px-1 py-0.5 text-gray-700"
                                    placeholder="Rate (£)"
                                />
                            )}
                        </div>
                    </div>
                    <textarea
                        value={entry.notes || ''}
                        onChange={(e) => update('notes', e.target.value)}
                        className="w-full h-10 bg-yellow-50 border border-yellow-200 rounded px-1 py-0.5 text-[9px] text-yellow-900 placeholder-yellow-800/30 outline-none resize-none"
                        placeholder="Notes..."
                    />
                </div>

                {/* 5. Overtime & Penalties - Expanded */}
                <div className="p-1 border-r border-purple-100 flex items-center bg-white">
                    {isWork ? (
                        <div className="w-full grid grid-cols-3 gap-0.5">
                            {/* Row 1 */}
                            {[
                                { k: 'cameraOT', l: 'Cam' },
                                { k: 'preOT', l: 'Pre' },
                                { k: 'postOT', l: 'Pst' }
                            ].map((f) => (
                                <div key={f.k} className="flex items-center justify-between bg-gray-50 px-1 rounded border border-gray-100 h-5">
                                    <span className="text-[7px] uppercase text-gray-400">{f.l}</span>
                                    <input
                                        type="number"
                                        value={entry[f.k] || ''}
                                        onChange={(e) => update(f.k, e.target.value)}
                                        className="w-5 text-[8px] bg-transparent text-right font-mono text-gray-700 outline-none p-0"
                                        placeholder="-"
                                    />
                                </div>
                            ))}

                            {/* Row 2 */}
                            {[
                                { k: 'bta', l: 'BTA' },
                                { k: 'dawn', l: 'Dwn' },
                                { k: 'night', l: 'Ngt' }
                            ].map((f) => (
                                <div key={f.k} className="flex items-center justify-between bg-gray-50 px-1 rounded border border-gray-100 h-5">
                                    <span className="text-[7px] uppercase text-gray-400">{f.l}</span>
                                    <input
                                        type="number"
                                        value={entry[f.k] || ''}
                                        onChange={(e) => update(f.k, e.target.value)}
                                        className="w-5 text-[8px] bg-transparent text-right font-mono text-gray-700 outline-none p-0"
                                        placeholder="-"
                                    />
                                </div>
                            ))}

                            {/* Row 3 - NEW */}
                            {[
                                { k: 'turnaround', l: 'Trn' },
                                { k: 'additionalHour', l: 'Add' },
                                { k: 'enhancedOT', l: 'Enh' }
                            ].map((f) => (
                                <div key={f.k} className="flex items-center justify-between bg-red-50 px-1 rounded border border-red-100 h-5">
                                    <span className="text-[7px] uppercase text-red-400">{f.l}</span>
                                    <input
                                        type="number"
                                        value={entry[f.k] || ''}
                                        onChange={(e) => update(f.k, e.target.value)}
                                        className="w-5 text-[8px] bg-transparent text-right font-mono text-red-700 outline-none p-0"
                                        placeholder="-"
                                    />
                                </div>
                            ))}

                            {/* Row 4 - Meal Pens */}
                            {[
                                { k: 'lateMeal', l: 'Lat' },
                                { k: 'brokenMeal', l: 'Brk' },
                                { k: 'otherOT', l: 'Oth' }
                            ].map((f) => (
                                <div key={f.k} className="flex items-center justify-between bg-orange-50 px-1 rounded border border-orange-100 h-5">
                                    <span className="text-[7px] uppercase text-orange-400">{f.l}</span>
                                    <input
                                        type="number"
                                        value={entry[f.k] || ''}
                                        onChange={(e) => update(f.k, e.target.value)}
                                        className="w-5 text-[8px] bg-transparent text-right font-mono text-orange-700 outline-none p-0"
                                        placeholder="-"
                                    />
                                </div>
                            ))}

                            {/* Travel / Mileage */}
                            <div className="col-span-3 flex items-center gap-1 pt-1 border-t border-dashed border-gray-200 mt-0.5">
                                <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded px-1 flex-1">
                                    <span className="text-[7px] text-gray-400 uppercase">Tv Hr</span>
                                    <input
                                        type="number"
                                        value={entry.travel || ''}
                                        onChange={(e) => update('travel', e.target.value)}
                                        className="w-full text-[9px] bg-transparent text-right outline-none min-w-0"
                                        placeholder="-"
                                    />
                                </div>

                                <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded px-1 flex-1">
                                    <span className="text-[7px] text-gray-400 uppercase">Paid</span>
                                    <select
                                        value={entry.paidTravel || 'None'}
                                        onChange={(e) => update('paidTravel', e.target.value)}
                                        className="w-full text-[9px] bg-transparent text-right outline-none min-w-0 appearance-none"
                                    >
                                        {PAID_TRAVEL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>

                                <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded px-1 flex-1">
                                    <span className="text-[7px] text-gray-400 uppercase">Mil</span>
                                    <input
                                        type="number"
                                        value={entry.mileage || ''}
                                        onChange={(e) => update('mileage', e.target.value)}
                                        className="w-full text-[9px] bg-transparent text-right outline-none min-w-0"
                                        placeholder="-"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : <div className="w-full text-center text-gray-300">-</div>}
                </div>

                {/* 6. Allowances - Expanded */}
                <div className="p-2 border-r border-purple-100 flex flex-col justify-center gap-1">
                    {/* Standard Allowances */}
                    <div className="flex gap-0.5">
                        <button onClick={() => update('perDiemShoot', entry.perDiemShoot > 0 ? 0 : 1)} className={`flex-1 text-[7px] font-bold rounded border py-0.5 ${entry.perDiemShoot > 0 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-300'}`}>PD-S</button>
                        <button onClick={() => update('perDiemNon', entry.perDiemNon > 0 ? 0 : 1)} className={`flex-1 text-[7px] font-bold rounded border py-0.5 ${entry.perDiemNon > 0 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-300'}`}>PD-N</button>
                    </div>
                    <div className="flex gap-0.5">
                        {['B', 'L', 'D'].map((m) => {
                            const field = m === 'B' ? 'breakfast' : m === 'L' ? 'lunch' : 'dinner';
                            return (
                                <button
                                    key={m}
                                    onClick={() => update(field, !entry[field])}
                                    className={`flex-1 text-[7px] font-bold rounded border py-0.5 ${entry[field] ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-gray-200 text-gray-300'
                                        }`}
                                >
                                    {m}
                                </button>
                            );
                        })}
                    </div>

                    {/* Extra Allowances Grid */}
                    <div className="grid grid-cols-3 gap-0.5 mt-1 pt-1 border-t border-dashed border-gray-200">
                        {[
                            { k: 'fuel', l: 'Fuel' },
                            { k: 'box', l: 'Box' },
                            { k: 'equipment', l: 'Eqp' },
                            { k: 'vehicle', l: 'Veh' },
                            { k: 'mobile', l: 'Mob' },
                            { k: 'living', l: 'Liv' },
                            { k: 'computer', l: 'Cmp' },
                            { k: 'software', l: 'Sft' },
                            { k: 'mealsAllowance', l: 'Meal' }
                        ].map(a => (
                            <div key={a.k} className="flex items-center justify-between border border-gray-100 rounded px-0.5 bg-gray-50/50">
                                <span className="text-[6px] uppercase text-gray-400 leading-none">{a.l}</span>
                                <input
                                    type="number"
                                    value={entry[a.k] || ''}
                                    onChange={(e) => update(a.k, e.target.value)}
                                    className="w-4 text-[7px] bg-transparent text-right outline-none p-0 leading-none"
                                    placeholder="-"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 7. Approval (Check) */}
                <div className="p-2 flex items-center justify-center">

                </div>
            </div>
        );
    };

    // --- Financial Calculations ---

    const activeSalary = useMemo(() => {
        const entriesToProcess = (isEditingWeek && localEntries.length > 0) ? localEntries : entries;
        if (entriesToProcess.length === 0) return salary;

        const standardDaily = crewInfo.dailyRate || 0;
        const standardHourly = crewInfo.hourlyRate || (standardDaily / 11);
        const itemsMap = new Map < string, { label, rate: number, units: number, category }> ();

        const addToBucket = (category, label, rate: number, units: number) => {
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

        const calc = (label, rate: number, units: number, type: 'salary' | 'ot' | 'allowance') => {
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
            ...customItems.map(i => calc(i.label, i.rate, i.unit, i.category as any))
        ];
        return rows;
    }, [activeSalary, customItems]);

    const summaryItemsList = [
        'Salary', '6th Day', '7th Day', 'Public Holiday', 'Travel Day', 'Half Day', 'Training', 'Driver - Cast Travel',
        'Holiday', 'Sick', 'Personal issue',
        'Turnaround', 'Add Hour', 'Enhanced O/T', 'Camera O/T', 'Post O/T', 'Pre O/T', 'BTA',
        'Late Meal', 'Broken Meal', 'Travel', 'Dawn / Early', 'Night Pen',
        'Computer', 'Software', 'Box Rental', 'Equipment', 'Vehicle', 'Mobile', 'Living',
        'Per Diem Shoot Rate', 'Per Diem Non Shoot Rate', 'Breakfast', 'Lunch', 'Dinner', 'Fuel', 'Mileage'
    ];

    const summaryData = useMemo(() => {
        // Collect all potential labels from standard list, current rows, and PTD data
        const allLabels = new Set < string > ([
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

        // Removed: Holiday Accrual calculation and row - no longer tracked in Financial Summary
        /*
        // 4. ADD HOLIDAY ACCRUAL ROW
        // Sum of all holiday components from "Salary" through "Night Pen"
        // Items eligible for Holiday Accrual:
        const eligibleForHoliday = [
            'Salary', '6th Day', '7th Day', 'Public Holiday', 'Travel Day', 'Turnaround', 'Add Hour', 'Enhanced O/T',
            'Camera O/T', 'Post O/T', 'Pre O/T', 'BTA', 'Late Meal', 'Broken Meal', 'Travel', 'Dawn / Early',
            'Night Pen'
        ];

        // Calculate holiday strictly from rows that match these labels (or their upgrades)
        const totalCurrentHoliday = allRows.reduce((sum, r) => {
            // Check if this row is an eligible type
            // E.g. "Salary", "Salary (Upgrade)", "Turnaround (1st AD)"
            // Logic: Base label starts with one of the eligible labels
            const baseLabel = r.label.split(' (')[0];
            const isEligible = eligibleForHoliday.includes(baseLabel) || eligibleForHoliday.includes(r.label);
            
            if (isEligible) {
                return sum + (r.holiday || 0);
            }
            return sum;
        }, 0);

        const ptdHoliday = ptdDataByLabel['Holiday Accrual'] || 0;
        
        // Always show Holiday Accrual row
        result.push({
            label: 'Holiday Accrual',
            u: 1,
            rate: 0,
            hRate: 0,
            p: totalCurrentHoliday,
            hTotal: 0,
            total: totalCurrentHoliday, 
            ptd: ptdHoliday, 
            isExtra: false
        });
        */

        return result;
    }, [allRows, summaryItemsList, ptdDataByLabel]);

    const netTotal = allRows.reduce((sum, r) => sum + r.totalAB, 0);
    // VAT only applies to SCHD and Loan Out contracts (not PAYE), and only if VAT registered
    const vatAmount = (contractCategory === 'SCHD' || contractCategory === 'Loan Out') && isVatRegistered ? netTotal * 0.20 : 0;
    const grossTotal = netTotal + vatAmount;

    const totals = {
        net: netTotal,
        vat: vatAmount,
        gross: grossTotal
    };

    // --- Render Components ---

    const entriesToRender = isEditingWeek ? localEntries : entries;

    if (showFinancialSummary) {
        return (
            <FinancialSummaryPage
                onBack={() => setShowFinancialSummary(false)}
                data={summaryData}
                currencySymbol="£"
                currentUserRole={currentUserRole}
                readOnly={readOnly}
                allowanceCaps={allowanceCaps}
            />
        );
    }

    return (
        <div className={`relative h-full w-full flex flex-col ${theme.bg} ${theme.text} overflow-hidden font-sans text-[10px]`}>

            {/* TOP HEADER - Compact (with Loan Out company name support) */}
            <div className={`flex-none px-4 py-3 border-b ${theme.border} flex justify-between items-start bg-white dark:bg-gray-900 shadow-sm z-10 relative`}>

                <div className="flex gap-10">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest mb-0.5">Name</span>
                        <span className="text-sm font-black uppercase text-purple-950 dark:text-gray-100">{crewInfo.firstName} {crewInfo.lastName}</span>
                        <span className="text-[10px] text-purple-600 font-medium">{crewInfo.role}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest mb-0.5">Department</span>
                        <span className="text-xs font-bold uppercase text-gray-700 dark:text-gray-300">{crewInfo.department}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest mb-0.5">Week Ending</span>
                        <span className="text-xs font-bold uppercase text-gray-700 dark:text-gray-300">Sun 16 Nov 2025</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest mb-0.5">Contract</span>
                        <span className="text-xs font-bold uppercase text-gray-700 dark:text-gray-300">
                            {crewType === 'weekly' ? 'Weekly' : 'Daily'} / {contractCategory === 'SCHD' ? 'Sched D' : contractCategory === 'Loan Out' ? 'Loan Out' : contractCategory}
                        </span>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex items-center gap-2 pl-4 border-l border-purple-100">
                        {/* Crew-specific buttons */}
                        {currentUserRole === 'Crew' && (
                            <>
                                {!isEditingWeek && !readOnly && !isPaid ? (
                                    <button onClick={handleCrewEdit} className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider" title="Edit Timesheet">
                                        <Edit3 className="w-4 h-4" />
                                        Edit
                                    </button>
                                ) : !readOnly && !isPaid ? (
                                    <>
                                        <button onClick={handleCrewSave} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider" title="Save as Draft">
                                            <Save className="w-4 h-4" />
                                            Save
                                        </button>
                                        <button onClick={handleCrewSubmit} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider" title="Submit Timesheet">
                                            <Send className="w-4 h-4" />
                                            Submit
                                        </button>
                                    </>
                                ) : null}
                            </>
                        )}

                        {/* HOD/Finance/Payroll buttons */}
                        {currentUserRole !== 'Crew' && (
                            <>
                                {!isEditingWeek ? (
                                    <button onClick={handleRevise} className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 transition-all hover:scale-105 active:scale-95" title="Edit Timesheet">
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={handleRevert} className="px-3 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider" title="Revert Changes">
                                            <RotateCcw className="w-3.5 h-3.5" />
                                            Revert
                                        </button>
                                        <button onClick={handleRecalculate} className="px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider" title="Recalculate Totals">
                                            <Calculator className="w-3.5 h-3.5" />
                                            Recalculate
                                        </button>
                                        <button onClick={handleApprove} className="px-3 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-all shadow-sm hover:shadow-md flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider" title="Save Revision">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Revised
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                        <button onClick={() => setShowGraphicalView(true)} className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all" title="View Charts">
                            <Calculator className="w-4 h-4" />
                        </button>

                        {/* Audit Log */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all" title="Audit Log">
                                    <History className="w-4 h-4" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0 z-50" align="end">
                                <div className="p-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                                    <h4 className="font-bold text-xs uppercase text-gray-500 tracking-wider">Audit Log</h4>
                                </div>
                                <div className="max-h-60 overflow-y-auto p-2 space-y-2">
                                    {auditLogs.length === 0 ? (
                                        <div className="text-center text-gray-400 py-4 text-[10px]">No changes recorded since submission</div>
                                    ) : (
                                        auditLogs.map((log, i) => (
                                            <div key={i} className="text-[9px] border-b border-gray-50 pb-2 last:border-0">
                                                <div className="flex justify-between text-gray-400 mb-0.5">
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

                        <button
                            onClick={() => setShowMileageForm(true)}
                            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all"
                            title="Mileage & Fuel Reimbursement"
                        >
                            <Car className="w-4 h-4" />
                        </button>

                        {/* Financial Summary Button */}
                        <button
                            onClick={() => setShowFinancialSummary(true)}
                            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all"
                            title="Financial Summary"
                        >
                            <Wallet className="w-4 h-4" />
                        </button>

                        {/* Week Completion Indicator - Compact version for header */}
                        {isEditingWeek && localEntries.length > 0 && (
                            <WeekCompletionIndicator
                                weekEntries={localEntries}
                                isDarkMode={isDarkMode}
                                compact={true}
                            />
                        )}

                        <TimesheetHeaderButtons
                            currentUserRole={currentUserRole}
                            contractCategory={contractCategory}
                            onExportTimesheet={() => setExportMode('timesheet')}
                            onExportInvoice={() => setExportMode('invoice')}
                            onFinanceAction={() => {/* TODO: Add functionality */ }}
                        />

                        {/* Status Badge - Moved to Far Right */}
                        {(() => {
                            // All 5 boxes must have a name to be "Fully Approved"
                            // Note: If Payroll signature is optional/empty in initial state, user logic implies it must be filled for Green.
                            const isFullyApproved = signatures.length === 5 && signatures.every(s => s.name && s.date);

                            let badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                            let dotStyle = 'bg-emerald-500';
                            let label = 'Submitted';

                            if (isEditingWeek) {
                                badgeStyle = 'bg-yellow-50 text-yellow-700 border-yellow-200';
                                dotStyle = 'bg-yellow-500';
                                label = 'Editing';
                            } else if (isFullyApproved) {
                                badgeStyle = 'bg-green-100 text-green-700 border-green-300';
                                dotStyle = 'bg-green-600';
                                label = 'Approved';
                            }

                            return (
                                <div className={`h-8 px-3 rounded-lg flex items-center gap-2 border shadow-sm transition-all ${badgeStyle}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${dotStyle} ${isEditingWeek ? 'animate-pulse' : ''}`} />
                                    <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT - Single Page Layout */}
            <div className="flex-1 flex overflow-auto relative">
                {/* Status Watermark - Large diagonal across entire page */}
                <TimesheetStatusWatermark status={timesheetStatus} isDarkMode={isDarkMode} mode="watermark" />

                {/* LEFT COLUMN: Timecard Grid (Approx 65%) */}
                <div className={`flex-1 flex flex-col border-r ${theme.border} overflow-y-auto bg-white dark:bg-[#0f0e13]`}>
                    {/* Table Header */}
                    <div className={`grid grid-cols-[0.7fr_0.9fr_0.7fr_0.6fr_2.2fr_2.0fr_0.6fr] bg-purple-50/80 dark:bg-purple-900/20 border-b ${theme.border} text-[9px] font-black text-purple-800 dark:text-purple-300 uppercase tracking-wider sticky top-0 z-10 shadow-sm`}>
                        <div className="p-2 border-r border-purple-100 dark:border-gray-700 leading-tight">Date<br />Calendar</div>
                        <div className="p-2 border-r border-purple-100 dark:border-gray-700 leading-tight">Type / Unit<br />Location</div>
                        <div className="p-2 border-r border-purple-100 dark:border-gray-700">In / Out</div>
                        <div className="p-2 border-r border-purple-100 dark:border-gray-700">Upgrade</div>
                        <div className="p-2 border-r border-purple-100 dark:border-gray-700 text-center">Overview</div>
                        <div className="p-2 border-r border-purple-100 dark:border-gray-700 text-center">Allowances</div>
                        <div className="p-2">Notes</div>
                    </div>

                    {/* Rows */}
                    <div className="flex-1 flex flex-col divide-y divide-gray-50 dark:divide-gray-800 min-h-0">
                        {(() => {
                            let workDaysCount = 0;
                            return entriesToRender.map((entry, idx) => {
                                const autoValues = {};

                                // Only count days that are complete (have in/out times OR flat day)
                                // Day Type 'Work' alone is not enough
                                const isComplete = isDayComplete(entry);

                                if (entry.dayType === 'Work' && isComplete) {
                                    workDaysCount++;
                                    if (workDaysCount === 6) autoValues.sixthDay = 1;
                                    if (workDaysCount === 7) autoValues.seventhDay = 1;
                                }

                                if (entry.dayType === 'Travel') {
                                    autoValues.travelDay = 1;
                                }

                                if (entry.dayType === 'Turnaround') {
                                    autoValues.turnaround = 1;
                                }

                                return isEditingWeek ? (
                                    <EditRow
                                        key={idx}
                                        entry={entry}
                                        index={idx}
                                        update={(f, v) => updateLocalEntry(idx, f, v)}
                                        upgradeRoles={upgradeRoles}
                                        autoValues={autoValues}
                                        currentUserRole={currentUserRole}
                                        calendarSchedule={calendarSchedule}
                                    />
                                ) : (
                                    <div key={idx} className={`w-full grid grid-cols-[0.7fr_0.9fr_0.7fr_0.6fr_2.2fr_2.0fr_0.6fr] min-h-[60px] group hover:bg-purple-50/20 dark:hover:bg-purple-900/10 transition-colors border-b ${theme.border}`}>
                                        {/* Date */}
                                        <div className={`p-2 border-r ${theme.border} flex flex-col justify-center items-start pl-3`}>
                                            <span className="font-bold text-gray-800 dark:text-gray-200">{formatEntryDate(entry.date)}</span>
                                            {calendarSchedule?.[entry.date]?.dayType === 'Shoot' && (
                                                <div className="flex flex-col mt-1.5 space-y-0.5 leading-none select-none">
                                                    <span className="text-[8px] font-bold uppercase text-purple-700 dark:text-purple-400">
                                                        {calendarSchedule?.[entry.date]?.unit || 'Main unit'} <span className="font-medium normal-case text-purple-600 dark:text-purple-300">{calendarSchedule?.[entry.date]?.workingHours || '(10 CWD)'}</span>
                                                    </span>
                                                    <span className="text-[8px] font-medium text-purple-600 dark:text-purple-300">Shoot day #{calendarSchedule?.[entry.date]?.dayNumber || '-'}</span>
                                                    <span className="text-[8px] font-bold font-mono text-purple-800 dark:text-purple-200">{calendarSchedule?.[entry.date]?.unitCall || '00:00'}-{calendarSchedule?.[entry.date]?.unitWrap || '00:00'}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Type / Unit / Loc / Set */}
                                        <div className={`p-2 border-r ${theme.border} flex flex-col justify-center gap-0.5`}>
                                            <div className="text-[8px] font-bold text-purple-700 dark:text-purple-300 uppercase">
                                                {entry.dayType}
                                            </div>

                                            {entry.dayType === 'Work' && (
                                                <>
                                                    <div className="text-[8px] font-bold text-purple-900 dark:text-purple-300 uppercase">
                                                        {t(entry.unit) === 'Main' ? 'Main Unit' : entry.unit === '2nd' ? '2nd Unit' : t(entry.unit)} • {entry.workplace?.[0] === 'On Set' ? 'ON SET' : entry.workplace?.[0] === 'Off Set' ? 'OFF SET' : 'ON SET'}
                                                    </div>
                                                    <div className="text-[9px] font-medium text-gray-700 dark:text-gray-300 truncate leading-none" title={entry.workplaceLocation}>
                                                        {t(entry.workplaceLocation)}
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* In / Out */}
                                        <div className={`p-2 border-r ${theme.border} flex flex-col justify-center gap-1 font-mono text-[10px]`}>
                                            {entry.dayType === 'Work' ? (
                                                <>
                                                    {/* In Time */}
                                                    <div className="flex gap-1 w-full justify-center">
                                                        <div className="bg-purple-50/50 w-full rounded py-1 text-center font-bold text-gray-700 dark:text-gray-300 border border-transparent shadow-sm">
                                                            {(entry.inTime || '').split(':')[0] || '--'}
                                                        </div>
                                                        <div className="bg-purple-50/50 w-full rounded py-1 text-center font-bold text-gray-700 dark:text-gray-300 border border-transparent shadow-sm">
                                                            {(entry.inTime || '').split(':')[1] || '--'}
                                                        </div>
                                                    </div>

                                                    {/* Meal */}
                                                    {entry.mealStatus && (
                                                        <div className="w-full text-center truncate py-0.5" title={entry.mealStatus}>
                                                            <span className="text-[8px] text-purple-700/80 font-medium">{entry.mealStatus}</span>
                                                        </div>
                                                    )}

                                                    {/* Out Time */}
                                                    <div className="flex gap-1 w-full items-center justify-center">
                                                        <div className="flex-1 flex gap-1 min-w-0">
                                                            <div className="flex-1 bg-purple-50/50 rounded py-1 text-center font-bold text-gray-700 dark:text-gray-300 border border-transparent shadow-sm">
                                                                {(entry.outTime || '').split(':')[0] || '--'}
                                                            </div>
                                                            <div className="flex-1 bg-purple-50/50 rounded py-1 text-center font-bold text-gray-700 dark:text-gray-300 border border-transparent shadow-sm">
                                                                {(entry.outTime || '').split(':')[1] || '--'}
                                                            </div>
                                                        </div>
                                                        {entry.nextDay && (
                                                            <span className="flex-none h-6 w-6 flex items-center justify-center text-[8px] font-bold text-purple-600 bg-purple-50 border border-purple-200 rounded shadow-sm">
                                                                +1
                                                            </span>
                                                        )}
                                                    </div>

                                                    {entry.isFlatDay && (
                                                        <div className="flex items-center justify-center gap-1 mt-0.5">
                                                            <CheckCircle2 className="w-2.5 h-2.5 text-purple-600" />
                                                            <span className="text-[7px] text-gray-400 font-medium uppercase tracking-wide">Flat</span>
                                                        </div>
                                                    )}
                                                </>
                                            ) : <span className="text-center text-gray-300">-</span>}
                                        </div>

                                        {/* Upgrade */}
                                        <div className={`p-2 border-r ${theme.border} flex flex-col justify-center text-[9px]`}>
                                            {entry.isUpgraded ? (
                                                <div className="flex flex-col gap-0.5 items-start">
                                                    <div className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold text-[8px]">
                                                        UPGR
                                                    </div>
                                                    <div className="font-bold text-gray-700 leading-tight">
                                                        {entry.upgradeRole}
                                                    </div>
                                                    {entry.upgradeRate > 0 && (
                                                        <div className="text-gray-500 font-mono text-[8px]">
                                                            £{entry.upgradeRate}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-300 text-center">-</span>
                                            )}
                                        </div>

                                        {/* Overview Grid (Moved) */}
                                        <div className={`p-1 border-r ${theme.border} flex items-center`}>
                                            <div className="w-full flex flex-col gap-0.5">
                                                <div className="grid grid-cols-4 gap-0.5">
                                                    {OVERVIEW_FIELDS.map((f) => {
                                                        const isDerived = f.type === 'derived';

                                                        // Calculate effective entry with autoValues for correct display in read-only mode
                                                        const effectiveEntry = { ...entry };
                                                        if (autoValues) {
                                                            Object.keys(autoValues).forEach(k => {
                                                                if (effectiveEntry[k] === undefined || effectiveEntry[k] === '' || effectiveEntry[k] === null || effectiveEntry[k] === 0) {
                                                                    effectiveEntry[k] = autoValues[k];
                                                                }
                                                            });
                                                        }

                                                        const val = isDerived ? f.getValue(effectiveEntry) : (effectiveEntry[f.k] || '');
                                                        // For boolean types in read-only, show 1 if true
                                                        const displayVal = f.type === 'bool' ? (val ? '1' : '-') : (val || '-');

                                                        return (
                                                            <div key={f.k} className="flex items-center justify-between bg-gray-50 px-1 rounded border border-gray-100 h-5">
                                                                <span className="text-[7px] uppercase text-black font-medium tracking-tight">{f.l}</span>
                                                                <span className={`w-6 text-[8px] bg-transparent text-right font-mono p-0 ${(Number(val) > 0 || (f.type === 'bool' && val)) ? 'text-green-600 font-bold' : (Number(val) < 0 ? 'text-red-600 font-bold' : 'text-black')
                                                                    }`}>{displayVal}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Allowances (Updated Grid) */}
                                        <div className={`p-2 border-r ${theme.border} flex flex-col justify-center gap-1`}>
                                            <div className="w-full flex flex-col gap-0.5">
                                                <div className="grid grid-cols-3 gap-0.5">
                                                    {[
                                                        { k: 'perDiemShoot', l: 'PD Shoot', type: 'number' },
                                                        { k: 'perDiemNon', l: 'PD Non', type: 'number' },
                                                        { k: 'breakfast', l: 'Breakfast', type: 'bool' },
                                                        { k: 'lunch', l: 'Lunch', type: 'bool' },
                                                        { k: 'dinner', l: 'Dinner', type: 'bool' },
                                                        ...ALLOWANCE_FIELDS
                                                    ].map((f) => {
                                                        let val = entry[f.k];
                                                        const isBool = f.type === 'bool';

                                                        // Normalize value
                                                        if (val === undefined || val === '' || val === null) val = 0;
                                                        if (isBool && val === true) val = 1;
                                                        if (isBool && val === false) val = 0;

                                                        const numVal = parseFloat(val);
                                                        const isActive = numVal > 0;

                                                        // Display value: '1' for active booleans, or the number, or '-'
                                                        const displayVal = isActive ? (isBool ? '1' : (val || '-')) : '-';

                                                        return (
                                                            <div key={f.k} className="flex items-center justify-between bg-gray-50 px-1 rounded border border-gray-100 h-5">
                                                                <span className="text-[7px] uppercase text-black font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis" title={f.l}>{f.l}</span>
                                                                <span className={`min-w-[12px] text-[8px] bg-transparent text-right font-mono p-0 shrink-0 ${isActive ? 'text-green-600 font-bold' : 'text-black'
                                                                    }`}>{displayVal}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Notes (Moved) */}
                                        <div className={`p-2 border-r ${theme.border} flex flex-col justify-start text-[9px] overflow-hidden`}>
                                            {entry.notes ? (
                                                <div className="bg-white text-gray-700 p-1.5 rounded border border-gray-200 text-[8px] leading-tight line-clamp-3" title={entry.notes}>
                                                    {entry.notes}
                                                </div>
                                            ) : (
                                                <span className="text-gray-300 italic text-[8px]">-</span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })
                        })()}
                    </div>

                    {/* Weekly Claims Section - Moved to Header */}

                    {/* Signatures Footer */}
                    <SalarySidebarSignatures crewInfo={crewInfo} theme={theme} isDarkMode={isDarkMode} signatures={signatures} />
                    <div className={`hidden px-4 py-3 border-t ${theme.border} bg-purple-50 dark:bg-gray-800/50 h-[35mm] flex-none`}>
                        <div className="grid grid-cols-5 gap-2 h-full">
                            {[
                                { label: 'Crew Member', name: `${crewInfo.firstName} ${crewInfo.lastName}`, date: '16 Nov 18:30', code: '8F2A-91', role: crewInfo.jobTitle },
                                { label: 'HOD / Dept', name: 'Michael Chen', date: '16 Nov 19:15', code: '7B3X-04', role: 'Location Manager' },
                                { label: 'Production', name: 'Bernie Bellew', date: '18 Dec 04:31', code: 'PD-782', role: 'Line Producer' },
                                { label: 'Accounts', name: 'Dan Palmer', date: '18 Dec 10:45', code: 'AC-441', role: 'Financial Controller' },
                                { label: 'Payroll', name: '', date: '', code: '', role: '' }
                            ].map((sig) => (
                                <div key={sig.label} className={`border rounded p-1.5 flex flex-col shadow-sm relative overflow-hidden h-full ${theme.card} ${theme.border}`}>
                                    {/* APPROVED Stamp - Only show when signed */}
                                    {sig.name && (
                                        <div
                                            className="absolute top-1/2 left-1/2 z-10 pointer-events-none flex items-center gap-1 px-2 py-1 rounded"
                                            style={{
                                                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                                border: '2px solid rgba(34, 197, 94, 0.1)',
                                                transform: 'translate(-50%, -50%) rotate(-12deg)',
                                            }}
                                        >
                                            <BadgeCheck
                                                className="flex-none"
                                                style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    color: '#22c55e',
                                                    opacity: 0.1
                                                }}
                                            />
                                            <span
                                                className="text-[8px] font-black uppercase tracking-wide leading-none"
                                                style={{
                                                    color: '#22c55e',
                                                    opacity: 0.1
                                                }}
                                            >
                                                APPROVED
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[6px] font-black uppercase tracking-wider truncate text-purple-400" title={sig.label}>{sig.label}</span>
                                    </div>

                                    <div className="flex-1 flex flex-col justify-center gap-0.5 min-h-0">
                                        {/* Role/Title - shown when approved */}
                                        {sig.name && sig.role && (
                                            <div
                                                className="text-[7.5px] font-bold text-center leading-tight px-1"
                                                style={{
                                                    color: isDarkMode ? '#9ca3af' : '#4b5563'
                                                }}
                                            >
                                                {sig.role}
                                            </div>
                                        )}

                                        {/* Signature */}
                                        {sig.name ? (
                                            <div
                                                className="font-handwriting opacity-90 rotate-[-2deg] text-center"
                                                style={{
                                                    fontSize: '14px',
                                                    color: isDarkMode ? '#d8b4fe' : '#581c87',
                                                    lineHeight: '1.2'
                                                }}
                                            >
                                                {sig.name}
                                            </div>
                                        ) : (
                                            <div className="w-12 h-6 border-b border-dashed mx-auto border-gray-200 dark:border-gray-600"></div>
                                        )}

                                        {/* Timestamp - formatted as "on: DD Month YYYY HH:MM GMT" */}
                                        {sig.name && sig.date && (
                                            <div
                                                className="text-[6.5px] text-center leading-tight"
                                                style={{
                                                    color: '#9ca3af'
                                                }}
                                            >
                                                on: {sig.date} GMT
                                            </div>
                                        )}
                                    </div>

                                    {sig.name && (
                                        <div className="flex justify-between items-end pt-0.5 mt-1 border-t border-purple-50 dark:border-gray-700">
                                            <div className="flex flex-col leading-none">
                                                <span className="text-[5px] uppercase font-bold text-gray-400">Date</span>
                                                <span className="text-[6px] font-mono text-purple-800 dark:text-purple-300">{sig.date}</span>
                                            </div>
                                            <div className="flex flex-col items-end leading-none">
                                                <span className="text-[5px] uppercase font-bold text-gray-400">Ref</span>
                                                <span className="text-[6px] font-mono text-purple-800 dark:text-purple-300">{sig.code}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Financial Summary with Holiday Column */}
                <div className={`w-[110mm] flex-none flex flex-col border-l ${theme.border} bg-white dark:bg-[#0f0e13]`}>
                    <div className={`p-2.5 font-black text-center text-[9px] uppercase tracking-wider bg-purple-50/80 dark:bg-purple-900/20 border-b ${theme.border} text-purple-800 dark:text-purple-300 flex items-center justify-center sticky top-0 z-10 shadow-sm`}>
                        Financial Summary <span className="opacity-70 ml-1">(Weekly Rate - {c(crewInfo.weeklyRate || crewInfo.dailyRate * 5)})</span>
                    </div>

                    {/* New Header with combined columns */}
                    <div className={`grid grid-cols-[2fr_1fr_0.8fr_1.2fr_1fr] text-[7px] font-black uppercase py-2 px-2 ${isDarkMode ? 'bg-[#181621]' : 'bg-gray-50'} border-b ${theme.border} text-black`}>
                        <div>ITEM</div>
                        <div className="text-center">RATE / HOL</div>
                        <div className="text-center">UNIT</div>
                        <div className="text-center">TOTAL A / B</div>
                        <div className="text-right">TOTAL</div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {summaryData.map((row, i) => (
                            <div key={i} className={`grid grid-cols-[2fr_1fr_0.8fr_1.2fr_1fr] ${row.hTotal > 0 ? 'py-2' : 'py-1'} px-2 text-[8px] items-center border-b ${theme.border} ${row.total > 0 ? (isDarkMode ? 'bg-purple-900/10' : 'bg-purple-50/30') : 'transparent'
                                }`}>
                                {/* Item name */}
                                <div className={`font-medium truncate leading-tight text-black`}>
                                    {row.label}
                                </div>

                                {/* Rate / Holiday stacked */}
                                <div className="text-center font-mono text-[8px]">
                                    {row.hTotal > 0 ? (
                                        <div className="flex flex-col leading-tight">
                                            <span className="text-black">{n(row.rate)}</span>
                                            <span className="text-black" style={{ fontSize: '7px' }}>{c(row.hRate)}</span>
                                        </div>
                                    ) : (
                                        <span className="text-black">{n(row.rate)}</span>
                                    )}
                                </div>

                                {/* Unit */}
                                <div className="text-center font-mono text-[8px] text-black font-medium">{n(row.u)}</div>

                                {/* Total A / Total B stacked */}
                                <div className="text-center font-mono text-[8px]">
                                    {row.hTotal > 0 ? (
                                        <div className="flex flex-col leading-tight">
                                            <span className="text-black">
                                                {c(row.p)}
                                            </span>
                                            <span className="text-black" style={{ fontSize: '7px' }}>
                                                {c(row.hTotal)}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-black">
                                            {c(row.p)}
                                        </span>
                                    )}
                                </div>

                                {/* Final Total */}
                                <div className={`text-right font-mono text-black ${row.total > 0 ? 'font-bold' : ''}`}>
                                    {row.total > 0 ? c(row.total) : '-'}
                                </div>
                            </div>
                        ))}
                    </div>


                    <div className={`p-3 ${isDarkMode ? 'bg-[#181621]' : 'bg-purple-50'} border-t ${theme.border} h-[35mm] flex-none`}>
                        <div className="space-y-1 mb-2">
                            <div className="flex justify-between items-center text-[9px]">
                                <span className="font-bold uppercase tracking-wider text-black">Subtotal</span>
                                <span className="font-mono font-bold text-black">{c(totals.net)}</span>
                            </div>
                            {vatAmount > 0 && (
                                <div className="flex justify-between items-center text-[9px]">
                                    <span className="font-bold uppercase tracking-wider text-black">VAT (20%)</span>
                                    <span className="font-mono text-black">{c(totals.vat)}</span>
                                </div>
                            )}
                        </div>
                        <div className={`flex justify-between items-center pt-2 border-t-2 ${theme.border}`}>
                            <span className="text-[10px] font-black uppercase tracking-widest text-black">Grand Total</span>
                            <span className="text-lg font-black text-black">{c(totals.gross)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            {/* {exportMode === 'timesheet' && (
             <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm">
                 <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-full overflow-hidden flex flex-col relative">
                     <button onClick={() => setExportMode('none')} className="absolute top-4 right-4 z-50 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                         <X className="w-5 h-5 text-gray-600" />
                     </button>
                     <div className="flex-1 overflow-auto bg-gray-100 p-8 flex justify-center">
                         <TimesheetPDFExport 
                             isDarkMode={false}
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
        )}

        {exportMode === 'data' && (
             <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm">
                 <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-full overflow-hidden flex flex-col relative">
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
        )}

        {showGraphicalView && (
             <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm">
                 <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-full overflow-hidden flex flex-col relative">
                     <button onClick={() => setShowGraphicalView(false)} className="absolute top-4 right-4 z-50 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                         <X className="w-5 h-5 text-gray-600" />
                     </button>
                     <div className="flex-1 overflow-auto bg-gray-50 p-6">
                         <WeeklyGraphicalView 
                            entries={entriesToRender} 
                            weeklyRate={crewInfo.weeklyRate || crewInfo.dailyRate * 5}
                            department={crewInfo.department}
                         />
                     </div>
                 </div>
             </div>
        )}

        <MileageReimbursementForm 
            isOpen={showMileageForm}
            onClose={() => setShowMileageForm(false)}
            crewInfo={crewInfo}
            weekEnding={calculatedWeekEnding}
            readOnly={readOnly || timesheetStatus === 'submitted' || timesheetStatus === 'approved' || timesheetStatus === 'paid'}
        />

        <TimesheetExportModals
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
        </div>
    );
}