import { Check, Edit2, Wallet, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TEMP_SUMMARY_DATA } from "../components/TimesheetTable/TimesheetForm";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table"
import CardWrapper from "../../../../shared/components/wrappers/CardWrapper";
import { StatusBadge } from "../../../../shared/components/badges/StatusBadge";

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

const FinancialSummary = () => {
    const data = TEMP_SUMMARY_DATA
    const currencySymbol = '£'
    const currentUserRole = 'Crew'
    const readOnly = false
    const allowanceCaps = {}
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
        <div>
            <div className="mx-auto space-y-6">
                {/* Main Financial Table */}
                <div className="bg-background rounded-lg shadow-sm overflow-hidden">
                    <Table className="text-xs">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="py-1.5 px-4 tracking-wider w-[25%]">
                                    Item
                                </TableHead>
                                <TableHead className="py-1.5 px-4 tracking-wider w-[15%]">
                                    Budget Code
                                </TableHead>
                                <TableHead className="py-1.5 px-4 tracking-wider w-[10%]">
                                    Tag
                                </TableHead>
                                <TableHead className="py-1.5 px-4 tracking-wider text-right w-[15%]">
                                    Balance to Pay
                                </TableHead>
                                <TableHead className="py-1.5 px-4 tracking-wider text-right w-[15%]">
                                    Current Week
                                </TableHead>
                                <TableHead className="py-1.5 px-4 tracking-wider text-right w-[15%]">
                                    Paid To Date
                                </TableHead>
                                <TableHead className="py-1.5 px-4 tracking-wider text-right w-[15%]">
                                    Total
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {data.map((row, idx) => {
                                const meta = financialMetadata[row.label] || { code: "---", tag: "General" }
                                const ptd = row.ptd || 0
                                const grandTotal = row.total + ptd
                                const isEditing = editingItem === row.label

                                return (
                                    <TableRow key={idx} >
                                        {/* Item */}
                                        <TableCell className="px-4">
                                            {row.label}
                                        </TableCell>

                                        <TableCell className="px-4">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editCode}
                                                    onChange={(e) => setEditCode(e.target.value)}
                                                    className="w-full px-2 py-0.5 text-sm font-mono border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    placeholder="Budget Code"
                                                />
                                            ) : (
                                                <div className="flex items-center gap-1">
                                                    <span className="font-mono text-gray-500 text-sm">
                                                        {meta.code}
                                                    </span>
                                                    {canEdit && (
                                                        <button
                                                            onClick={() => handleEditClick(row.label)}
                                                            className="p-0.5 hover:bg-purple-100 rounded transition-colors"
                                                        >
                                                            <Edit2 className="w-3 h-3 text-purple-600" />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </TableCell>

                                        {/* Tag */}
                                        <TableCell className="px-4">
                                            {isEditing ? (
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        type="text"
                                                        value={editTag}
                                                        onChange={(e) => setEditTag(e.target.value)}
                                                        className="flex-1 px-2 py-0.5 text-xs border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        placeholder="Tag"
                                                    />
                                                    <button
                                                        onClick={() => handleSaveEdit(row.label)}
                                                        className="p-0.5 bg-green-500 hover:bg-green-600 text-white rounded"
                                                    >
                                                        <Check className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="p-0.5 bg-gray-400 hover:bg-gray-500 text-white rounded"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1">
                                                   <StatusBadge size="sm" label={meta.tag} className={"bg-primary/10 text-primary"}/>
                                                    {canEdit && (
                                                        <button
                                                            onClick={() => handleEditClick(row.label)}
                                                            className="p-0.5 hover:bg-purple-100 rounded"
                                                        >
                                                            <Edit2 className="w-3 h-3 text-purple-600" />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </TableCell>

                                        {/* Balance */}
                                        <TableCell className="px-4 text-right">
                                            {(() => {
                                                const capKey = allowanceCapMap[row.label]
                                                if (capKey && allowanceCaps[capKey]) {
                                                    const cap = allowanceCaps[capKey].cap || 0
                                                    const paidTillDate = allowanceCaps[capKey].paidTillDate || 0
                                                    const balance = cap - paidTillDate
                                                    return (
                                                        <span className="font-mono text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                                                            {currencySymbol}{balance.toFixed(2)}
                                                        </span>
                                                    )
                                                }
                                                return <span className="text-gray-300">-</span>
                                            })()}
                                        </TableCell>

                                        {/* Current Week */}
                                        <TableCell
                                            className={`px-4 text-right font-mono ${row.total > 0
                                                ? "text-gray-900 dark:text-gray-100 font-bold"
                                                : "text-gray-300"
                                                }`}
                                        >
                                            <div className="flex flex-col items-end">
                                                <span>
                                                    {row.total > 0
                                                        ? `${currencySymbol}${row.total.toFixed(2)}`
                                                        : "-"}
                                                </span>
                                                {row.hTotal > 0 && (
                                                    <span className="text-xs text-gray-500 font-normal leading-none">
                                                        {currencySymbol}{row.hTotal.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>

                                        {/* PTD */}
                                        <TableCell
                                            className={`px-4 text-right font-mono ${ptd > 0
                                                ? "text-gray-900 dark:text-gray-100 font-bold"
                                                : "text-gray-300"
                                                }`}
                                        >
                                            {ptd > 0 ? `${currencySymbol}${ptd.toFixed(2)}` : "-"}
                                        </TableCell>

                                        {/* Total */}
                                        <TableCell className="px-4 text-right font-mono font-bold text-purple-700 dark:text-purple-400 bg-purple-50/30 dark:bg-purple-900/10">
                                            {currencySymbol}{grandTotal.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>

                        <TableFooter className="font-bold border-t-2 text-sm">
                            <TableRow>
                                <TableCell colSpan={3} className="py-2 px-4">
                                    Grand Total
                                </TableCell>
                                <TableCell className="py-2 px-4 text-right">
                                    {currencySymbol}{totalCurrent.toFixed(2)}
                                </TableCell>
                                <TableCell className="py-2 px-4 text-right">
                                    {currencySymbol}{totalPTD.toFixed(2)}
                                </TableCell>
                                <TableCell className="py-2 px-4 text-right text-purple-700 dark:text-purple-300">
                                    {currencySymbol}{totalCombined.toFixed(2)}
                                </TableCell>
                                <TableCell/>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>

                {/* Holiday Accrual Section */}
                <CardWrapper title=" Holiday Accrual" icon={Wallet}>
                    <div className="grid grid-cols-5 gap-3">
                        <div className="bg-card border rounded-lg p-3">
                            <div className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">This Invoice</div>
                            <div className="text-lg font-black text-green-700 dark:text-green-400">{currencySymbol}{holidayAccrual.thisInvoice.toFixed(2)}</div>
                        </div>
                        <div className="bg-card border rounded-lg p-3">
                            <div className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">Prior Balance</div>
                            <div className="text-lg font-black text-gray-700 dark:text-gray-300">{currencySymbol}{holidayAccrual.priorBalance.toFixed(2)}</div>
                        </div>
                        <div className="bg-card border rounded-lg p-3">
                            <div className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">Total Pot</div>
                            <div className="text-lg font-black text-purple-700 dark:text-purple-400">{currencySymbol}{holidayAccrual.totalPot.toFixed(2)}</div>
                        </div>
                        <div className="bg-card border rounded-lg p-3 relative group">
                            <div className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 mb-1 flex items-center justify-between">
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
                                        className="w-full px-2 text-sm font-mono border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                            <div className="text-xs uppercase font-bold text-background mb-1">Remaining</div>
                            <div className="text-lg font-black text-background">{currencySymbol}{holidayAccrual.remaining.toFixed(2)}</div>
                        </div>
                    </div>
                </CardWrapper>
            </div>
        </div>
    );
};

export default FinancialSummary