import React, { useRef, useState } from 'react'
import { PageHeader } from '../../../../shared/components/PageHeader'
import { StatusBadge } from '../../../../shared/components/badges/StatusBadge'
import { ArrowRight, Calendar, Download, Fuel, Info, MapPin, Plus, Trash2, X } from 'lucide-react'
import { Button } from '../../../../shared/components/ui/button'
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router-dom'
import { AIReceiptScanner } from '../components/AIReceiptScanner'
import { Progress } from '../../../../shared/components/ui/progress'
import { PDFFormTemplate } from '../components/MileagePreviewDialog'
import { InfoPanel } from '../../../../shared/components/panels/InfoPanel'

function FuelAndMileageForm() {
    const [data, setData] = useState({
        homePostcode: '',
        studioPostcode: 'WD61FX',
        commuteMiles: 0,
        tripsInWeek: 5,
        weekendMiles: 0,
        fuelReceiptsNet: 0,
        fuelReceiptsGross: 0,
        vatRegistered: false // Changed to always start as false by default
    });

    const navigate = useNavigate();
    const params = useParams();

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
    const [claimType, setClaimType] = useState((data.fuelReceiptsNet > 0 || data.fuelReceiptsGross > 0) ? 'fuel' : 'mileage');
    const [serialNumber, setSerialNumber] = useState('0000001');
    const [showPreview, setShowPreview] = useState(false);
    const readOnly = false; //temporary data
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weekEnding = "2025-NOV-16" //temporary selected week

    const printRef = useRef(null);

    const generateId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

    // Initialize days with empty trips
    const [dailyTrips, setDailyTrips] = useState(
        DAYS.map((_, index) => ({
            dayIndex: index,
            trips: [{ id: generateId(), from: '', to: '', reason: '', miles: 0 }]
        }))
    );

    const getDates = () => {
        // Parse weekEnding "16-11-2025" or similar
        // If format is DD-MM-YYYY
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

    const getDailyTotal = (dayIndex) => {
        return dailyTrips[dayIndex].trips.reduce((sum, trip) => sum + (trip.miles || 0), 0);
    };

    const totalBusinessMiles = dailyTrips.reduce((sum, day) => sum + getDailyTotal(day.dayIndex), 0);

    const calcCommutingTotal = data.commuteMiles * data.tripsInWeek;

    const grandTotalMiles = totalBusinessMiles + calcCommutingTotal + data.weekendMiles;

    // -- Cost Calcs --

    // Crew WITHOUT Car Allowance
    const businessMileageCost = totalBusinessMiles * 0.45;

    // Crew WITH Car Allowance
    const businessPercentage = grandTotalMiles > 0 ? (totalBusinessMiles / grandTotalMiles) * 100 : 0;

    // Reimbursement for Fuel (With Allowance)
    const fuelReimbursementNet = data.fuelReceiptsNet * (businessPercentage / 100);
    const fuelReimbursementGross = data.fuelReceiptsGross * (businessPercentage / 100);
    const fuelReimbursement = data.vatRegistered ? fuelReimbursementNet : fuelReimbursementGross;


    // --- Actions ---

    const addTrip = (dayIndex) => {
        if (readOnly) return;
        setDailyTrips(prev => {
            const newTrips = [...prev];
            // Create a deep copy of the day we are modifying to ensure React detects the change
            const currentDay = newTrips[dayIndex];
            newTrips[dayIndex] = {
                ...currentDay,
                trips: [
                    ...currentDay.trips,
                    { id: generateId(), from: '', to: '', reason: '', miles: 0 }
                ]
            };
            return newTrips;
        });
    };

    const removeTrip = (dayIndex, tripId) => {
        if (readOnly) return;
        setDailyTrips(prev => {
            const newTrips = [...prev];
            const currentDay = newTrips[dayIndex];

            let updatedTrips = currentDay.trips.filter(t => t.id !== tripId);

            // If we removed the last one, add a new empty one
            if (updatedTrips.length === 0) {
                updatedTrips = [{ id: generateId(), from: '', to: '', reason: '', miles: 0 }];
            }

            newTrips[dayIndex] = {
                ...currentDay,
                trips: updatedTrips
            };
            return newTrips;
        });
    };

    const updateTrip = (dayIndex, tripId, field, value) => {
        if (readOnly) return;
        setDailyTrips(prev => {
            const newTrips = [...prev];
            const currentDay = newTrips[dayIndex];

            newTrips[dayIndex] = {
                ...currentDay,
                trips: currentDay.trips.map(t => {
                    if (t.id === tripId) {
                        return { ...t, [field]: value };
                    }
                    return t;
                })
            };

            return newTrips;
        });
    };

    const handleExportPDF = async () => {
        if (!printRef.current) return;
        toast.info("Printing Pdf intiated.", { description: "currently not exporting pdf temporarily due to mock data" })

        // try {
        //     // Show saving toast
        //     const loadingToast = toast.loading('Generating PDF...');

        //     // Force a small delay to ensure rendering of the hidden element
        //     await new Promise(resolve => setTimeout(resolve, 500));

        //     const canvas = await html2canvas(printRef.current, {
        //         scale: 3,
        //         useCORS: true,
        //         backgroundColor: '#ffffff',
        //         logging: false,
        //         windowWidth: 794,
        //         windowHeight: 1122,
        //         onclone: (clonedDoc) => {
        //             // Ensure styles are applied in the clone
        //             const element = clonedDoc.getElementById('mileage-form-export');
        //             if (element) {
        //                 element.style.display = 'block';
        //                 element.style.position = 'relative';
        //                 element.style.left = '0';
        //             }
        //         }
        //     });

        //     const imgData = canvas.toDataURL('image/png');
        //     const pdf = new jsPDF({
        //         orientation: 'portrait',
        //         unit: 'mm',
        //         format: 'a4'
        //     });

        //     // A4 portrait dimensions
        //     const pdfWidth = 210;
        //     const pdfHeight = 297;

        //     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        //     pdf.save(`Mileage_Form_${crewInfo.firstName}_${crewInfo.lastName}_${weekEnding}.pdf`);

        //     toast.dismiss(loadingToast);
        //     toast.success('Mileage form exported successfully!');
        // } catch (e) {
        //     console.error(e);
        //     toast.error('Failed to export PDF');
        // }
    };

    const handleSave = () => {
        // //  if (!onSave) return;
        // const total = data.vatRegistered ? fuelReimbursementNet : (fuelReimbursementGross > 0 ? fuelReimbursementGross : businessMileageCost);
        // const type = (data.fuelReceiptsNet > 0 || data.fuelReceiptsGross > 0) ? 'fuel' : 'mileage';

        // // Include trips in the saved data
        // const dataToSave = {
        //     ...data,
        //     trips: dailyTrips
        // };

        toast.info(`Save ${claimType} triggered.`, { description: "the data is currently not being saved temporarily due to mock data" })
        navigate(`/projects/${params.projectName}/fuel-mileage`)
        //  onSave(dataToSave, total, type);
    };

    return (
        <>
            <div className='space-y-6 container mx-auto'>
                <PageHeader
                    icon="Car"
                    title={"Mileage & Fuel Reimbursement"}
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
                        <InfoPanel title="Claim Instructions" icon={Info}>
                            {claimType === "mileage" ? (
                                <>
                                    <p>• <strong>Mileage Rate:</strong> £0.45 per mile for business use</p>
                                    <p>• <strong>Commute Deduction:</strong> Normal commute will be deducted</p>
                                    <p>• <strong>Trip Recording:</strong> Add all trips with purpose and distance</p>
                                    <p>• <strong>Submission:</strong> Within 30 days of week ending</p>
                                </>
                            ) : (
                                <>
                                    <p>• <strong>Eligibility:</strong> Only for crew with car allowance</p>
                                    <p>• <strong>Business %:</strong> Estimate business vs personal fuel</p>
                                    <p>• <strong>VAT Receipts:</strong> VAT and non-VAT separated</p>
                                    <p>• <strong>Receipt Retention:</strong> Keep originals for 6 months</p>
                                    <p>• <strong>Commute Costs:</strong> Not reimbursable</p>
                                </>
                            )}
                        </InfoPanel>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">

                        {/* LEFT COLUMN: Inputs & Settings */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* Commute Settings Card */}
                            <div className="bg-card rounded-2xl p-6 border shadow-sm">
                                <div className="mb-4">
                                    <h3 className="text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-primary" /> Commute Details
                                    </h3>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                                        Regular commuting costs are not reimbursable and will be automatically deducted from your claim.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Home Postcode</label>
                                            <input
                                                type="text"
                                                value={data.homePostcode}
                                                onChange={e => setData(d => ({ ...d, homePostcode: e.target.value }))}
                                                className="w-full bg-gray-50 dark:bg-[#2a2735] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-medium uppercase focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
                                                placeholder="POSTCODE"
                                                disabled={readOnly}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Studio Postcode</label>
                                            <input
                                                type="text"
                                                value={data.studioPostcode}
                                                onChange={e => setData(d => ({ ...d, studioPostcode: e.target.value }))}
                                                className="w-full bg-gray-50 dark:bg-[#2a2735] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-medium uppercase focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
                                                disabled={readOnly}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">One-way Commute (Miles)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={data.commuteMiles || ''}
                                                onChange={e => setData(d => ({ ...d, commuteMiles: parseFloat(e.target.value) || 0 }))}
                                                onWheel={e => e.currentTarget.blur()}
                                                className="w-full bg-gray-50 dark:bg-[#2a2735] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
                                                placeholder="0"
                                                disabled={readOnly}
                                            />
                                            <span className="absolute right-3 top-2 text-xs text-gray-400 font-bold">mi</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Weekly Trips</label>
                                            <input
                                                type="number"
                                                value={data.tripsInWeek || ''}
                                                onChange={e => setData(d => ({ ...d, tripsInWeek: parseFloat(e.target.value) || 0 }))}
                                                onWheel={e => e.currentTarget.blur()}
                                                className="w-full bg-gray-50 dark:bg-[#2a2735] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
                                                disabled={readOnly}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Weekend Miles</label>
                                            <input
                                                type="number"
                                                value={data.weekendMiles || ''}
                                                onChange={e => setData(d => ({ ...d, weekendMiles: parseFloat(e.target.value) || 0 }))}
                                                onWheel={e => e.currentTarget.blur()}
                                                className="w-full bg-gray-50 dark:bg-[#2a2735] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
                                                disabled={readOnly}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-500">Total Commute</span>
                                        <span className="text-lg font-mono font-bold text-gray-900 dark:text-white">{(calcCommutingTotal + data.weekendMiles).toFixed(1)} mi</span>
                                    </div>
                                </div>
                            </div>

                            {/* Fuel / Allowance Card */}
                            <div className="bg-card rounded-2xl p-6 border shadow-sm">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                                    <Fuel className="w-4 h-4" /> Fuel & Allowance
                                </h3>

                                <div className="space-y-4">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
                                        <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                        <div className="text-xs text-blue-700 dark:text-blue-300">
                                            <strong>Car Allowance?</strong> Fill this section. <br />
                                            <strong>Mileage only?</strong> Skip this section.
                                        </div>
                                    </div>

                                    {/* VAT Status Toggle */}
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#2a2735] rounded-lg border border-gray-200 dark:border-gray-700">
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">VAT Registered?</label>
                                        <button
                                            type="button"
                                            onClick={() => !readOnly && setData(d => ({ ...d, vatRegistered: !d.vatRegistered }))}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.vatRegistered ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                                                } ${readOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                            disabled={readOnly}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${data.vatRegistered ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex justify-between">
                                            <span>VAT Registered Fuel Receipts</span>
                                            <span className="text-purple-600 font-bold">Net Amount</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2 text-gray-400">£</span>
                                            <input
                                                type="number"
                                                value={data.fuelReceiptsNet || ''}
                                                onChange={e => setData(d => ({ ...d, fuelReceiptsNet: parseFloat(e.target.value) || 0 }))}
                                                onWheel={e => e.currentTarget.blur()}
                                                className="w-full bg-gray-50 dark:bg-[#2a2735] border border-gray-200 dark:border-gray-700 rounded-lg pl-7 pr-3 py-2 text-sm font-medium focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
                                                placeholder="0.00"
                                                readOnly={readOnly}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex justify-between">
                                            <span>Non-VAT Fuel Receipts</span>
                                            <span className="text-purple-600 font-bold">Gross Amount</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2 text-gray-400">£</span>
                                            <input
                                                type="number"
                                                value={data.fuelReceiptsGross || ''}
                                                onChange={e => setData(d => ({ ...d, fuelReceiptsGross: parseFloat(e.target.value) || 0 }))}
                                                onWheel={e => e.currentTarget.blur()}
                                                className="w-full bg-gray-50 dark:bg-[#2a2735] border border-gray-200 dark:border-gray-700 rounded-lg pl-7 pr-3 py-2 text-sm font-medium focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
                                                placeholder="0.00"
                                                readOnly={readOnly}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 dark:border-[#2f2b3e]">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs text-gray-500">Business Usage %</span>
                                        </div>
                                        <Progress value={businessPercentage.toFixed(1)} />
                                    </div>
                                </div>
                            </div>

                            {/* AI Receipt Scanner Card */}
                            {!readOnly && (
                                <AIReceiptScanner
                                    weekStartDate={dates[0] || new Date()}
                                    weekEndDate={dates[6] || new Date()}
                                    onReceiptsScanned={(receipts) => {
                                        // Auto-fill the fuel receipt fields
                                        const vatTotal = receipts
                                            .filter(r => r.isVATReceipt && (r.scanStatus === 'success' || r.scanStatus === 'date-warning'))
                                            .reduce((sum, r) => sum + (r.amount || 0), 0);

                                        const nonVatTotal = receipts
                                            .filter(r => !r.isVATReceipt && (r.scanStatus === 'success' || r.scanStatus === 'date-warning'))
                                            .reduce((sum, r) => sum + (r.amount || 0), 0);

                                        setData(d => ({
                                            ...d,
                                            fuelReceiptsNet: vatTotal,
                                            fuelReceiptsGross: nonVatTotal
                                        }));

                                        toast.success('Receipt amounts auto-filled!');
                                    }}
                                />
                            )}

                            {/* Total Claim Card (Sticky) */}
                            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 shadow-xl text-white sticky top-6">
                                <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-6">Estimated Claim</h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-4 border-b border-white/20">
                                        <span className="text-sm font-medium opacity-90">Business Mileage</span>
                                        <span className="font-mono font-bold">{totalBusinessMiles.toFixed(1)} mi</span>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold opacity-90 pb-1">Total Payable</span>
                                        <div className="text-right">
                                            <div className="text-3xl font-black tracking-tight">
                                                £{(data.vatRegistered ? fuelReimbursementNet : (fuelReimbursementGross > 0 ? fuelReimbursementGross : businessMileageCost)).toFixed(2)}
                                            </div>
                                            <div className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-1">
                                                {(data.fuelReceiptsNet > 0 || data.fuelReceiptsGross > 0) ? 'Fuel Allowance Claim' : 'Standard Mileage Claim'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN: Trip Log */}
                        <div className="lg:col-span-8 flex flex-col h-full overflow-hidden bg-card rounded-2xl border border-gray-200 dark:border-[#2f2b3e] shadow-sm">
                            <div className="p-6 border-b border-gray-200 dark:border-[#2f2b3e]">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-purple-600" /> Weekly Trip Log
                                    </h3>
                                    <div className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-full">
                                        Total: {totalBusinessMiles.toFixed(1)} mi
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-relaxed">
                                    Record all business trips for the week. Use Google Maps to calculate accurate mileage. Click the <Plus className="w-3 h-3 inline" /> icon to add multiple trips per day.
                                </p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-0">
                                {DAYS.map((dayName, idx) => {
                                    const dayData = dailyTrips[idx];
                                    const dayTotal = getDailyTotal(idx);
                                    const dateStr = dates[idx]?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

                                    return (
                                        <div key={dayName} className="border-b last:border-0">
                                            {/* Day Header */}
                                            <div className="bg-gray-50/50 dark:bg-[#2a2735]/30 px-6 py-3 flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-bold uppercase text-muted-foreground w-20">{dayName}</span>
                                                    <span className="text-xs font-mono text-gray-400 dark:text-gray-500">{dateStr}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs font-bold text-gray-400">Daily Total: {dayTotal > 0 ? dayTotal.toFixed(1) : '-'} mi</span>
                                                    {!readOnly && (
                                                        <button
                                                            onClick={() => addTrip(idx)}
                                                            className="p-1 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-md text-purple-600 transition-all"
                                                            title="Add Trip"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Trips List */}
                                            <div className="px-2">
                                                {/* Trip Table Header */}
                                                <div className="grid grid-cols-12 gap-3 px-4 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                                    <div className="col-span-3">From Location</div>
                                                    <div className="col-span-1"></div>
                                                    <div className="col-span-3">To Location</div>
                                                    <div className="col-span-3">Reason For Trip</div>
                                                    <div className="col-span-1 text-center">Miles</div>
                                                    <div className="col-span-1"></div>
                                                </div>
                                                {dayData.trips.map((trip, tripIdx) => (
                                                    <div key={trip.id} className="grid grid-cols-12 gap-3 py-3 px-4 items-center hover:bg-gray-50 dark:hover:bg-[#2a2735]/50 rounded-lg transition-colors group border-b border-dashed last:border-0 my-1">
                                                        <div className="col-span-3">
                                                            <input
                                                                placeholder="From..."
                                                                value={trip.from}
                                                                onChange={e => updateTrip(idx, trip.id, 'from', e.target.value)}
                                                                className="w-full bg-transparent border-none p-0 text-sm font-medium placeholder-gray-300 dark:placeholder-gray-600 focus:ring-0 text-gray-700 dark:text-gray-300"
                                                                disabled={readOnly}
                                                            />
                                                        </div>
                                                        <ArrowRight className='size-4 text-muted-foreground' />
                                                        <div className="col-span-3">
                                                            <input
                                                                placeholder="To..."
                                                                value={trip.to}
                                                                onChange={e => updateTrip(idx, trip.id, 'to', e.target.value)}
                                                                className="w-full bg-transparent border-none p-0 text-sm font-medium placeholder-gray-300 dark:placeholder-gray-600 focus:ring-0 text-gray-700 dark:text-gray-300"
                                                                disabled={readOnly}
                                                            />
                                                        </div>
                                                        <div className="col-span-3">
                                                            <input
                                                                placeholder="Reason..."
                                                                value={trip.reason}
                                                                onChange={e => updateTrip(idx, trip.id, 'reason', e.target.value)}
                                                                className="w-full bg-transparent border-none p-0 text-xs text-gray-500 placeholder-gray-300 dark:placeholder-gray-600 focus:ring-0"
                                                                disabled={readOnly}
                                                            />
                                                        </div>
                                                        <div className="col-span-1">
                                                            <div className="relative">
                                                                <input
                                                                    type="number"
                                                                    value={trip.miles === 0 ? '' : trip.miles}
                                                                    onChange={e => updateTrip(idx, trip.id, 'miles', parseFloat(e.target.value) || 0)}
                                                                    onWheel={e => e.currentTarget.blur()}
                                                                    className="w-full bg-background rounded-md px-2 py-1 text-right text-sm font-mono font-bold focus:ring-1 focus:ring-purple-500 outline-none dark:text-white"
                                                                    placeholder="0"
                                                                    disabled={readOnly}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-span-1 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {!readOnly && (
                                                                <button
                                                                    onClick={() => removeTrip(idx, trip.id)}
                                                                    className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                                                                >
                                                                    <Trash2 className="size-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showPreview && (
                <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center">
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

                        {/* Preview Content */}
                        <div className="flex-1 overflow-y-auto p-8 rounded-3xl mb-2">
                            <div className="flex justify-center">
                                <div className="shadow-2xl" style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}>
                                    <PDFFormTemplate
                                        crewInfo={crewInfo}
                                        weekEnding={weekEnding}
                                        data={data}
                                        dailyTrips={dailyTrips}
                                        dates={dates}
                                        totalBusinessMiles={totalBusinessMiles}
                                        calcCommutingTotal={calcCommutingTotal}
                                        grandTotalMiles={grandTotalMiles}
                                        businessPercentage={businessPercentage}
                                        fuelReimbursementNet={fuelReimbursementNet}
                                        fuelReimbursementGross={fuelReimbursementGross}
                                        businessMileageCost={businessMileageCost}
                                        serialNumber={serialNumber}
                                        getDailyTotal={getDailyTotal}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default FuelAndMileageForm