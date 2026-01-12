import React, { useState, useEffect, useRef } from 'react';
import {
    X,
    Plus,
    Trash2,
    Download,
    Save,
    Info,
    Banknote,
    Eye,
    Calendar,
    CreditCard,
    FileText
} from 'lucide-react';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
import { InfoPanel } from '../../../../shared/components/panels/InfoPanel';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { AIReceiptScanner } from '../../fuel-and-mileage/components/AIReceiptScanner';
import { PageHeader } from '../../../../shared/components/PageHeader';
import { PettyCashPDFTemplate } from '../components/PettyCashPDFTemplate';

function PettyCashForm() {
    const currentUserRole = 'Crew'
    const isAccountsRole = currentUserRole === 'Finance' || currentUserRole === 'Payroll';

    const [crewInfo, setCrewInfo] = useState({
        firstName: 'LUKE',
        lastName: 'GREENAN',
        department: 'ELECTRICAL - SHOOTING ELECTRICAL',
        role: 'SHOOTING ELECTRICIAN',
        contractType: 'PAYE',
        employmentType: 'WEEKLY',
        basicRate: 2145.25,
        dailyRate: 429.05,
        hourlyRate: 39.00,
        jobTitle: 'SHOOTING ELECTRICIAN',
        company: 'MIRAGE PICTURES LIMITED',
        isVATRegistered: true,
        startDate: '2025-10-20', // Contract Start Date
        endDate: '2025-12-21'   // Contract End Date
    });

    const [data, setData] = useState({
        department: crewInfo.department || '',
        title: crewInfo.jobTitle || crewInfo.role || '',
        entries: [],
        currency: 'GBP'
    });

    const readOnly = false; //temporary data
    const weekEnding = "2025-NOV-16" //temporary selected week
    const initialData = undefined
    const [showPreview, setShowPreview] = useState(false);
    const printRef = useRef(null);

    const navigate = useNavigate();
    const params = useParams();

    // Generate ID
    const generateId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

    // Initialize with some empty rows if no data
    useEffect(() => {
        if (initialData) {
            setData({ ...initialData });
        } else if (data.entries.length === 0) {
            // Start with 5 empty rows
            const emptyRows = Array(5).fill(null).map(() => ({
                id: generateId(),
                date: '',
                payee: '',
                description: '',
                category: '',
                net: 0,
                vat: 0,
                total: 0,
                code: '',
                set: '',
                categoryCode: '',
                ff2: '',
                ff3: ''
            }));
            setData(prev => ({ ...prev, entries: emptyRows }));
        }
    }, [initialData]);

    // Calculate Dates based on Week Ending
    const getDates = () => {
        const parts = weekEnding.split('-');
        let endDate = new Date();
        if (parts.length === 3) {
            endDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        }
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(endDate);
            d.setDate(endDate.getDate() - i);
            dates.push(d);
        }
        return dates;
    };

    const dates = getDates();

    // --- Calculations ---
    const totalNet = data.entries?.reduce((sum, entry) => sum + (entry.net || 0), 0);
    const totalVAT = data.entries?.reduce((sum, entry) => sum + (entry.vat || 0), 0);
    const grandTotal = data.entries?.reduce((sum, entry) => sum + (entry.total || 0), 0);

    // --- Actions ---
    const addRow = () => {
        if (readOnly) return;
        setData(prev => ({
            ...prev,
            entries: [
                ...prev.entries,
                {
                    id: generateId(),
                    date: '',
                    payee: '',
                    description: '',
                    category: '',
                    net: 0,
                    vat: 0,
                    total: 0,
                    code: '',
                    set: '',
                    categoryCode: '',
                    ff2: '',
                    ff3: ''
                }
            ]
        }));
    };

    const removeRow = (id) => {
        if (readOnly) return;
        setData(prev => ({
            ...prev,
            entries: prev.entries.filter(e => e.id !== id)
        }));
    };

    const updateEntry = (id, field, value) => {
        if (readOnly) return;
        setData(prev => ({
            ...prev,
            entries: prev.entries.map(entry => {
                if (entry.id === id) {
                    const updatedEntry = { ...entry, [field]: value };

                    // Auto-calculate total if net or vat changes
                    if (field === 'net' || field === 'vat') {
                        const net = field === 'net' ? (parseFloat(value) || 0) : (entry.net || 0);
                        const vat = field === 'vat' ? (parseFloat(value) || 0) : (entry.vat || 0);
                        updatedEntry.total = parseFloat((net + vat)?.toFixed(2));
                    }

                    // Auto-calculate net/vat if total changes (assuming 20% VAT as default logic if total is entered directly?? 
                    // Actually better to let user enter Net/VAT manually or handle via specific logic. 
                    // For now, let's keep it simple: manual entry or AI fill.)

                    return updatedEntry;
                }
                return entry;
            })
        }));
    };

    const handleExportPDF = async () => {
        if (!printRef.current) return;
        toast.info("Printing Pdf intiated.", { description: "currently not exporting pdf temporarily due to mock data" })
        // try {
        //     const loadingToast = toast.loading('Generating PDF...');
        //     await new Promise(resolve => setTimeout(resolve, 500));

        //     const canvas = await html2canvas(printRef.current, {
        //         scale: 3,
        //         useCORS: true,
        //         backgroundColor: '#ffffff',
        //         logging: false,
        //         windowWidth: 1000, // Wider for landscape-ish feel or A4 landscape? The image is landscape.
        //         windowHeight: 700,
        //         onclone: (clonedDoc) => {
        //             const element = clonedDoc.getElementById('petty-cash-export');
        //             if (element) {
        //                 element.style.display = 'block';
        //                 element.style.position = 'relative';
        //                 element.style.left = '0';
        //             }

        //             // Remove all styles to prevent html2canvas from parsing Tailwind's oklch colors
        //             const styles = clonedDoc.getElementsByTagName('style');
        //             const links = clonedDoc.getElementsByTagName('link');
        //             Array.from(styles).forEach(style => style.remove());
        //             Array.from(links).forEach(link => {
        //                 if (link.rel === 'stylesheet') link.remove();
        //             });
        //         }
        //     });

        //     const imgData = canvas.toDataURL('image/png');
        //     const pdf = new jsPDF({
        //         orientation: 'landscape',
        //         unit: 'mm',
        //         format: 'a4'
        //     });

        //     const pdfWidth = 297;
        //     const pdfHeight = 210;

        //     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        //     pdf.save(`Petty_Cash_${crewInfo.firstName}_${crewInfo.lastName}_${weekEnding}.pdf`);

        //     toast.dismiss(loadingToast);
        //     toast.success('Petty cash form exported successfully!');
        // } catch (e) {
        //     console.error(e);
        //     toast.error('Failed to export PDF');
        // }
    };

    const handleSave = () => {
        // if (!onSave) return;
        // onSave(data, grandTotal);
        // onClose();

        toast.info(`Save petty cash triggered.`, { description: "the data is currently not being saved temporarily due to mock data" })
        navigate(`/projects/${params.projectName}/fuel-mileage`)
    };

    return (
        <div className='space-y-6 container mx-auto'>
            <PageHeader
                icon="Banknote"
                title={"Petty Cash Voucher"}
                subtitle={
                    <span className='flex items-center gap-3'>
                        <span>LUKE GREEN</span>
                        <div className='flex items-center gap-2'>
                            <Calendar className="w-3 h-3" />
                            Week Ending 2025-NOV-16
                        </div>
                    </span>
                }

                secondaryActions={[
                    {
                        label: "View PDF Preview",
                        clickAction: () => setShowPreview(true),
                        icon: "Eye",
                        variant: "secondary",
                        size: "lg"
                    },
                    {
                        label: "Export PDF",
                        clickAction: () => handleExportPDF(),
                        icon: "Download",
                        variant: "outline",
                        size: "lg"
                    }
                ]}

                primaryAction={{
                    label: "Save Claim",
                    clickAction: () => handleSave(),
                    icon: "Save",
                    variant: "default",
                    size: "lg"
                }}
            />

            <div>
                {/* Instructions Banner */}
                <div className="mb-6">
                    <InfoPanel
                        title="Instructions"
                        icon={Info}
                        variant="success"
                    >
                        <p>1) Ensure you have an <strong>original</strong> receipt for each item claimed. Credit card receipts alone are not acceptable.</p>
                        <p>2) Fuel receipts must have Car reg, Make, Model, Colour and your name written on them (use Mileage Form for fuel).</p>
                        <p>3) Only one type of currency per form please.</p>
                        <p>4) Attach receipts to the back of the printed form or scan them alongside.</p>
                    </InfoPanel>
                </div>

                <div className="flex flex-col gap-6 w-full">

                    {/* TOP SECTION: AI Scanner & Totals */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        {/* AI Scanner */}
                        <div>
                            {!readOnly && (
                                <AIReceiptScanner
                                    weekStartDate={dates[0] || new Date()}
                                    weekEndDate={dates[6] || new Date()}
                                    onReceiptsScanned={(receipts) => {
                                        // Auto-fill rows based on scanned receipts
                                        const newEntries = receipts
                                            .filter(r => r.scanStatus === 'success' || r.scanStatus === 'date-warning')
                                            .map(r => ({
                                                id: generateId(),
                                                date: r.date ? r.date.toLocaleDateString('en-GB') : '',
                                                payee: r.merchant || 'Unknown Merchant',
                                                description: r.items.length > 0 ? r.items.join(', ') : (r.category || 'Expense'),
                                                category: r.category || 'General',
                                                net: r.amount ? (r.isVATReceipt ? (r.amount - (r.vatAmount || 0)) : r.amount) : 0,
                                                vat: r.vatAmount || 0,
                                                total: r.amount || 0
                                            }));

                                        setData(prev => ({
                                            ...prev,
                                            entries: [...prev.entries.filter(e => e.total > 0), ...newEntries] // Keep existing non-empty rows
                                        }));
                                        toast.success(`${newEntries.length} receipts added to form!`);
                                    }}
                                />
                            )}
                        </div>

                        {/* Totals Card */}
                        <div>
                            <div className="bg-white dark:bg-[#181621] rounded-2xl p-6 border border-gray-100 dark:border-[#2f2b3e] shadow-sm h-full">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" /> Claim Summary
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-[#2f2b3e]">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Amount</span>
                                        <span className=" font-bold text-gray-900 dark:text-white">£{totalNet?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-[#2f2b3e]">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">VAT Total</span>
                                        <span className=" font-bold text-gray-900 dark:text-white">£{totalVAT?.toFixed(2)}</span>
                                    </div>

                                    <div className="flex justify-between items-end pt-2">
                                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 pb-1">Total Payable</span>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">£{grandTotal?.toFixed(2)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM SECTION: Form Grid */}
                    <div className="w-full flex flex-col bg-white dark:bg-[#181621] rounded-2xl border border-gray-200 dark:border-[#2f2b3e] shadow-sm">
                        <div className="p-6 border-b border-gray-200 dark:border-[#2f2b3e] flex justify-between items-center">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-emerald-600" /> Expense Items
                                </h3>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                                    List each expense item separately.
                                </p>
                            </div>
                            {!readOnly && (
                                <button
                                    onClick={addRow}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                                >
                                    <Plus className="w-4 h-4" /> Add Row
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-[#2a2735] text-[10px] uppercase text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-[#2f2b3e]">
                                        <th className="px-4 py-3 font-bold w-12 text-center">RCPT</th>
                                        <th className="px-4 py-3 font-bold w-32">Date</th>
                                        <th className="px-4 py-3 font-bold w-48">To Whom Paid</th>
                                        <th className="px-4 py-3 font-bold min-w-[200px]">Purpose/Description</th>
                                        <th className="px-4 py-3 font-bold w-32">Expense Type</th>

                                        {/* Accounts Columns - Always visible as requested */}
                                        <>
                                            <th className="px-2 py-3 font-bold w-20 bg-gray-100 dark:bg-[#221e2e] border-l border-r border-gray-200 dark:border-[#2f2b3e]">Code</th>
                                            <th className="px-2 py-3 font-bold w-16 bg-gray-100 dark:bg-[#221e2e] border-r border-gray-200 dark:border-[#2f2b3e]">Tag</th>
                                            <th className="px-2 py-3 font-bold w-16 bg-gray-100 dark:bg-[#221e2e] border-r border-gray-200 dark:border-[#2f2b3e]">Cat</th>
                                            <th className="px-2 py-3 font-bold w-16 bg-gray-100 dark:bg-[#221e2e] border-r border-gray-200 dark:border-[#2f2b3e]">FF2</th>
                                            <th className="px-2 py-3 font-bold w-16 bg-gray-100 dark:bg-[#221e2e] border-r border-gray-200 dark:border-[#2f2b3e]">FF3 (VAT)</th>
                                        </>

                                        <th className="px-4 py-3 font-bold w-24 text-right">Net</th>
                                        <th className="px-4 py-3 font-bold w-20 text-right">VAT</th>
                                        <th className="px-4 py-3 font-bold w-24 text-right">Total</th>
                                        <th className="px-4 py-3 font-bold w-12"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-[#2f2b3e]">
                                    {data.entries?.map((entry, idx) => (
                                        <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2735]/50 transition-colors group">
                                            <td className="px-4 py-3 text-center text-xs  text-gray-400">{idx + 1}</td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="text"
                                                    placeholder="DD/MM/YYYY"
                                                    value={entry.date}
                                                    onChange={e => updateEntry(entry.id, 'date', e.target.value)}
                                                    className="w-full bg-transparent border-none p-0 text-sm font-medium focus:ring-0 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600"
                                                    disabled={readOnly}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="text"
                                                    value={entry.payee}
                                                    onChange={e => updateEntry(entry.id, 'payee', e.target.value)}
                                                    className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 text-gray-900 dark:text-white"
                                                    disabled={readOnly}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="text"
                                                    value={entry.description}
                                                    onChange={e => updateEntry(entry.id, 'description', e.target.value)}
                                                    className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 text-gray-900 dark:text-white"
                                                    disabled={readOnly}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <select
                                                    value={entry.category}
                                                    onChange={e => updateEntry(entry.id, 'category', e.target.value)}
                                                    className="w-full bg-transparent border-none p-0 text-xs focus:ring-0 text-gray-700 dark:text-gray-300"
                                                    disabled={readOnly}
                                                >
                                                    <option value="">Select...</option>
                                                    <option value="Props">Props</option>
                                                    <option value="Wardrobe">Wardrobe</option>
                                                    <option value="Catering">Catering</option>
                                                    <option value="Travel">Travel</option>
                                                    <option value="Office">Office</option>
                                                    <option value="Other">Other</option>
                                                    <option value="Parking & Congestion">Parking & Congestion</option>
                                                </select>
                                            </td>

                                            {/* Accounts Fields - Always visible */}
                                            <>
                                                <td className="px-2 py-3 bg-gray-50/50 dark:bg-[#221e2e]/50 border-l border-r border-gray-100 dark:border-[#2f2b3e]">
                                                    <input
                                                        type="text"
                                                        value={entry.code || ''}
                                                        onChange={e => updateEntry(entry.id, 'code', e.target.value)}
                                                        className="w-full bg-transparent border-none p-0 text-xs  text-gray-600 dark:text-gray-400 focus:ring-0"
                                                        placeholder="---"
                                                        disabled={readOnly}
                                                    />
                                                </td>
                                                <td className="px-2 py-3 bg-gray-50/50 dark:bg-[#221e2e]/50 border-r border-gray-100 dark:border-[#2f2b3e]">
                                                    <input
                                                        type="text"
                                                        value={entry.set || ''}
                                                        onChange={e => updateEntry(entry.id, 'set', e.target.value)}
                                                        className="w-full bg-transparent border-none p-0 text-xs  text-gray-600 dark:text-gray-400 focus:ring-0"
                                                        placeholder="-"
                                                        disabled={readOnly}
                                                    />
                                                </td>
                                                <td className="px-2 py-3 bg-gray-50/50 dark:bg-[#221e2e]/50 border-r border-gray-100 dark:border-[#2f2b3e]">
                                                    <input
                                                        type="text"
                                                        value={entry.categoryCode || ''}
                                                        onChange={e => updateEntry(entry.id, 'categoryCode', e.target.value)}
                                                        className="w-full bg-transparent border-none p-0 text-xs  text-gray-600 dark:text-gray-400 focus:ring-0"
                                                        placeholder="-"
                                                        disabled={readOnly}
                                                    />
                                                </td>
                                                <td className="px-2 py-3 bg-gray-50/50 dark:bg-[#221e2e]/50 border-r border-gray-100 dark:border-[#2f2b3e]">
                                                    <input
                                                        type="text"
                                                        value={entry.ff2 || ''}
                                                        onChange={e => updateEntry(entry.id, 'ff2', e.target.value)}
                                                        className="w-full bg-transparent border-none p-0 text-xs  text-gray-600 dark:text-gray-400 focus:ring-0"
                                                        placeholder="-"
                                                        disabled={readOnly}
                                                    />
                                                </td>
                                                <td className="px-2 py-3 bg-gray-50/50 dark:bg-[#221e2e]/50 border-r border-gray-100 dark:border-[#2f2b3e]">
                                                    <input
                                                        type="text"
                                                        value={entry.ff3 || ''}
                                                        onChange={e => updateEntry(entry.id, 'ff3', e.target.value)}
                                                        className="w-full bg-transparent border-none p-0 text-xs  text-gray-600 dark:text-gray-400 focus:ring-0"
                                                        placeholder="-"
                                                        disabled={readOnly}
                                                    />
                                                </td>
                                            </>

                                            <td className="px-4 py-3">
                                                <input
                                                    type="number"
                                                    value={entry.net || ''}
                                                    onChange={e => updateEntry(entry.id, 'net', parseFloat(e.target.value) || 0)}
                                                    onWheel={e => e.currentTarget.blur()}
                                                    className="w-full bg-transparent border-none p-0 text-right text-sm  focus:ring-0 text-gray-900 dark:text-white"
                                                    placeholder="0.00"
                                                    disabled={readOnly}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="number"
                                                    value={entry.vat || ''}
                                                    onChange={e => updateEntry(entry.id, 'vat', parseFloat(e.target.value) || 0)}
                                                    onWheel={e => e.currentTarget.blur()}
                                                    className="w-full bg-transparent border-none p-0 text-right text-sm  focus:ring-0 text-gray-500 dark:text-gray-400"
                                                    placeholder="0.00"
                                                    disabled={readOnly}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-right text-sm  font-bold text-gray-900 dark:text-white">
                                                    {entry.total?.toFixed(2)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {!readOnly && (
                                                    <button
                                                        onClick={() => removeRow(entry.id)}
                                                        className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50 dark:bg-[#2a2735] font-bold text-sm text-gray-900 dark:text-white border-t border-gray-200 dark:border-[#2f2b3e]">
                                    <tr>
                                        <td colSpan={10} className="px-4 py-3 text-right text-xs uppercase text-gray-500">Totals</td>
                                        <td className="px-4 py-3 text-right ">£{totalNet?.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right ">£{totalVAT?.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right  text-emerald-600">£{grandTotal?.toFixed(2)}</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* PDF Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 z-[200] h-svh bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
                        {/* Preview Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900">PDF Preview</h3>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleExportPDF}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-all"
                                >
                                    <Download className="w-4 h-4" />
                                    Export PDF
                                </button>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 rounded-3xl mb-2">
                            <div className="flex justify-center">
                                <div className="shadow-2xl" style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}>
                                    <PettyCashPDFTemplate
                                        crewInfo={crewInfo}
                                        weekEnding={weekEnding}
                                        data={data}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* HIDDEN PRINT TEMPLATE */}
            <div style={{
                position: 'fixed',
                left: '-99999px',
                top: '-99999px',
                visibility: 'hidden',
                pointerEvents: 'none',
                zIndex: -9999
            }}>
                <div
                    id="petty-cash-export"
                    ref={printRef}
                >
                    <PettyCashPDFTemplate
                        crewInfo={crewInfo}
                        weekEnding={weekEnding}
                        data={data}
                    />
                </div>
            </div>
        </div>
    );
}

export default PettyCashForm