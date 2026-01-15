import React, { useMemo, useState } from 'react'
import { PageHeader } from '../../../../shared/components/PageHeader'
import { generateMockCrewData } from '../config/mockCrewData(temp)';
import { CircularProgress } from '../../../../shared/components/ui/ circular-progress';
import { WeekNavigator } from '../../../../shared/components/buttons/WeekNavigator';
import PrimaryStats from '../../../../shared/components/wrappers/PrimaryStats';
import SearchBar from '../../../../shared/components/SearchBar';
import { SelectMenu } from '../../../../shared/components/menus/SelectMenu';
import { Button } from '../../../../shared/components/ui/button';
import { Ban, Briefcase, CheckCircle2, CheckSquare, Square, ChevronDown, Eye, Flag, Users, X } from 'lucide-react';
import { cn } from '../../../../shared/config/utils';
import { motion, AnimatePresence } from "framer-motion";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/shared/components/ui/accordion";
import { toast } from 'sonner';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';

function CrewTimsheetManagmentDashboard() {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedCrewIds, setSelectedCrewIds] = useState(new Set());
    const [expandedCrewId, setExpandedCrewId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [contractFilter, setContractFilter] = useState('all');
    const [contractCategoryFilter, setContractCategoryFilter] = useState('all');
    const [showOnlyFlagged, setShowOnlyFlagged] = useState(false);
    const [flaggedIds, setFlaggedIds] = useState(new Set());
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [activeStatFilter, setActiveStatFilter] = useState(null);
    const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
    const [rejectionTarget, setRejectionTarget] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [viewMode, setViewMode] = useState('cards');
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
    const [selectedCrewInfo, setSelectedCrewInfo] = useState(crewInfo);

    const [crewList] = useState(generateMockCrewData());

    const [currentDate, setCurrentDate] = useState(() => {
        const now = new Date()
        return new Date(now.getFullYear(), now.getMonth(), now.getDate())
    })

    const goToPreviousWeek = () => {
        setCurrentDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7))
    }

    const goToNextWeek = () => {
        setCurrentDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7))
    }

    const goToToday = () => {
        const now = new Date()
        setCurrentDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()))
    }

    function calculateTotalHours(weekData) {
        return Object.values(weekData).reduce((sum, day) => {
            return sum + (parseFloat(day.hours || '0'));
        }, 0);
    }

    // Calculate statistics
    const stats = useMemo(() => {
        if (!crewList || !Array.isArray(crewList)) {
            return { total: 0, submitted: 0, pending: 0, approved: 0, flagged: 0, totalHours: 0, totalCost: 0 };
        }

        const total = crewList.length;
        const submitted = crewList.filter(c => c.submitted).length;
        const pending = crewList.filter(c => !c.submitted && !c.isOff).length;
        const approved = crewList.filter(c => c.approval.payroll === 'approved').length;
        const flagged = Array.from(flaggedIds).length;
        const totalHours = crewList.reduce((sum, crew) => {
            return sum + calculateTotalHours(crew.weekData);
        }, 0);
        const totalCost = crewList.reduce((sum, crew) => sum + (crew.totalCost || 0), 0);

        return { total, submitted, pending, approved, flagged, totalHours, totalCost };
    }, [crewList, flaggedIds]);

    // Get unique departments first
    const departments = useMemo(() => {
        if (!crewList || !Array.isArray(crewList)) {
            return [];
        }
        return Array.from(new Set(crewList.map(c => c.department))).sort();
    }, [crewList]);

    // Initialize collapsed departments with all departments (default collapsed view)
    const [collapsedDepartments, setCollapsedDepartments] = useState(() => new Set(departments));

    // Filter and sort crew
    const filteredCrew = useMemo(() => {
        if (!crewList || !Array.isArray(crewList)) {
            return [];
        }

        let filtered = crewList.filter(crew => {
            const matchesSearch = crew.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                crew.role.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDepartment = departmentFilter === 'all' || crew.department === departmentFilter;
            const matchesContract = contractFilter === 'all' || crew.contractType === contractFilter;
            const matchesContractCategory = contractCategoryFilter === 'all' || crew.contractCategory === contractCategoryFilter;
            const matchesStatus = statusFilter === 'all' ||
                getTimesheetStatus(crew.approval, crew.submitted, crew.isOff) === statusFilter;
            const matchesFlagged = !showOnlyFlagged || flaggedIds.has(crew.id);

            return matchesSearch && matchesDepartment && matchesContract && matchesContractCategory && matchesStatus && matchesFlagged;
        });

        // Sort
        filtered.sort((a, b) => {
            let aVal, bVal;

            switch (sortConfig.key) {
                case 'name':
                    aVal = a.name;
                    bVal = b.name;
                    break;
                case 'hours':
                    aVal = calculateTotalHours(a.weekData);
                    bVal = calculateTotalHours(b.weekData);
                    break;
                case 'cost':
                    aVal = a.totalCost || 0;
                    bVal = b.totalCost || 0;
                    break;
                default:
                    return 0;
            }

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [crewList, searchQuery, departmentFilter, contractFilter, contractCategoryFilter, statusFilter, showOnlyFlagged, flaggedIds, sortConfig]);

    // Group filtered crew by department
    const crewByDepartment = useMemo(() => {
        const grouped = new Map();

        filteredCrew.forEach(crew => {
            const deptCrew = grouped.get(crew.department) || [];
            deptCrew.push(crew);
            grouped.set(crew.department, deptCrew);
        });

        return Array.from(grouped.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    }, [filteredCrew]);

    const primaryStats = [
        {
            label: "Total Crew",
            value: stats.total,
            icon: "Users",
            iconColor: "text-blue-600 dark:text-blue-400",
            iconBg: "bg-blue-100 dark:bg-blue-900/30",
        },

        {
            label: "Submitted",
            value: stats.submitted,
            subLabel:
                stats.total > 0
                    ? `${((stats.submitted / stats.total) * 100).toFixed(0)}% of total`
                    : undefined,
            subLabelColor: "text-muted-foreground",
            icon: "CheckCircle2",
            color: "text-emerald-600 dark:text-emerald-400",
            iconColor: "text-emerald-600 dark:text-emerald-400",
            iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
        },

        {
            label: "Pending",
            value: stats.pending,
            icon: "Clock",
            color: "text-amber-600 dark:text-amber-400",
            iconColor: "text-amber-600 dark:text-amber-400",
            iconBg: "bg-amber-100 dark:bg-amber-900/30",
        },

        {
            label: "Approved",
            value: stats.approved,
            icon: "CheckSquare",
            color: "text-purple-600 dark:text-purple-400",
            iconColor: "text-purple-600 dark:text-purple-400",
            iconBg: "bg-purple-100 dark:bg-purple-900/30",
        },

        {
            label: "Flagged",
            value: stats.flagged,
            icon: "Flag",
            color: "text-red-600 dark:text-red-400",
            iconColor: "text-red-600 dark:text-red-400",
            iconBg: "bg-red-100 dark:bg-red-900/30",
        },

        {
            label: "Total Hours",
            value: stats.totalHours.toFixed(0),
            subLabel: `~${(stats.totalHours / 40).toFixed(1)} weeks`,
            subLabelColor: "text-muted-foreground",
            icon: "Timer",
            color: "text-cyan-600 dark:text-cyan-400",
            iconColor: "text-cyan-600 dark:text-cyan-400",
            iconBg: "bg-cyan-100 dark:bg-cyan-900/30",
        },

        {
            label: "Total Cost",
            value: `£${stats.totalCost.toLocaleString()}`,
            icon: "DollarSign",
            color: "text-green-600 dark:text-green-400",
            iconColor: "text-green-600 dark:text-green-400",
            iconBg: "bg-green-100 dark:bg-green-900/30",
        },
    ];

    const departmentItems = [
        { label: "All Departments", value: "all" },
        ...departments.map((dept) => ({
            label: dept,
            value: dept,
        })),
    ];

    const contractItems = [
        { label: "All Contracts", value: "all" },
        { label: "Daily", value: "Daily" },
        { label: "Weekly", value: "Weekly" },
    ];

    const contractCategoryItems = [
        { label: "All Categories", value: "all" },
        { label: "PAYE", value: "PAYE" },
        { label: "SCHD", value: "SCHD" },
        { label: "LOAN OUT", value: "LOAN OUT" },
        { label: "LONG FORM", value: "LONG FORM" },
    ];

    const statusItems = [
        { label: "All Statuses", value: "all" },
        { label: "Submitted", value: "Submitted" },
        { label: "Pending", value: "Pending" },
        { label: "Approved", value: "Approved" },
        { label: "Rejected", value: "Rejected" },
    ];

    function toggleSelectAll() {
        if (selectedCrewIds.size === filteredCrew.length) {
            setSelectedCrewIds(new Set());
        } else {
            setSelectedCrewIds(new Set(filteredCrew.map(c => c.id)));
        }
    }

    function toggleCrewSelection(id) {
        const newSelection = new Set(selectedCrewIds);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedCrewIds(newSelection);
    }

    function toggleFlag(id) {
        const newFlagged = new Set(flaggedIds);
        if (newFlagged.has(id)) {
            newFlagged.delete(id);
            toast.success('Flag removed');
        } else {
            newFlagged.add(id);
            toast.success('Timesheet flagged for review');
        }
        setFlaggedIds(newFlagged);
    }

    function handleBulkApprove() {
        if (selectedCrewIds.size === 0) {
            toast.error('No timesheets selected');
            return;
        }
        toast.success(`${selectedCrewIds.size} timesheet(s) approved`);
        setSelectedCrewIds(new Set());
    }

    function handleBulkReject() {
        if (selectedCrewIds.size === 0) {
            toast.error('No timesheets selected');
            return;
        }
        setRejectionTarget('bulk');
        setRejectionModalOpen(true);
    }

    function handleRejectSingle(crewId) {
        setRejectionTarget(crewId);
        setRejectionModalOpen(true);
    }

    function confirmRejection() {
        if (!rejectionReason.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        if (rejectionTarget === 'bulk') {
            toast.success(`${selectedCrewIds.size} timesheet(s) rejected: ${rejectionReason}`);
            setSelectedCrewIds(new Set());
        } else {
            toast.success(`Timesheet rejected: ${rejectionReason}`);
        }

        setRejectionModalOpen(false);
        setRejectionReason('');
        setRejectionTarget(null);
    }

    function cancelRejection() {
        setRejectionModalOpen(false);
        setRejectionReason('');
        setRejectionTarget(null);
    }

    function handleSort(key) {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    }

    const days = [
        { key: 'mon', label: 'Mon' },
        { key: 'tue', label: 'Tue' },
        { key: 'wed', label: 'Wed' },
        { key: 'thu', label: 'Thu' },
        { key: 'fri', label: 'Fri' },
        { key: 'sat', label: 'Sat' },
        { key: 'sun', label: 'Sun' }
    ];

    return (
        <div className='space-y-6 container mx-auto'>
            <PageHeader
                icon="CheckCircle"
                title={"Timesheet Approval Center"}
                subtitle={`Review and approve crew timesheets for the week`}
                extraActions={
                    <div className={`flex items-center gap-6`}>
                        <div className="flex items-center gap-4">
                            <CircularProgress value={stats.total > 0 ? ((stats.submitted / stats.total) * 100).toFixed(0) : 0} />
                            <div className=''>
                                <div className={`font-bold uppercase tracking-wider text-muted-foreground mb-1`}>
                                    Overall Progress
                                </div>
                                <div className={`text-sm font-bold`}>
                                    {stats.submitted} of {stats.total} submitted
                                </div>
                            </div>
                        </div>

                        <WeekNavigator
                            currentDate={currentDate}
                            onPreviousWeek={goToPreviousWeek}
                            onNextWeek={goToNextWeek}
                            onGoToCurrentWeek={goToToday}
                            className={"bg-background py-3 rounded-2xl border shadow"}
                        />
                    </div>
                }
            />

            <PrimaryStats stats={primaryStats} gridColumns={7} gridGap={4} useSecondaryCard={true} />
            <div>
                <div className='grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] gap-3 items-center'>
                    <SearchBar placeholder={"Search weeks"} value={searchQuery} onValueChange={(e) => setSearchQuery(e.target.value)} className={"w-[400px]  mr-5"} />
                    <SelectMenu
                        label="All Departments"
                        items={departmentItems}
                        selected={departmentFilter}
                        onSelect={setDepartmentFilter}
                        className={cn(
                            departmentFilter !== "all"
                                ? "ring-1 ring-purple-500 border-purple-500"
                                : "",
                            'w-full rounded-3xl'
                        )
                        }
                    />

                    <SelectMenu
                        label="All Contracts"
                        items={contractItems}
                        selected={contractFilter}
                        onSelect={setContractFilter}
                        className={cn(
                            contractFilter !== "all"
                                ? "ring-1 ring-purple-500 border-purple-500"
                                : "",
                            'w-full rounded-3xl'
                        )
                        }
                    />

                    <SelectMenu
                        label="All Categories"
                        items={contractCategoryItems}
                        selected={contractCategoryFilter}
                        onSelect={setContractCategoryFilter}
                        className={cn(
                            contractCategoryFilter !== "all"
                                ? "ring-1 ring-purple-500 border-purple-500"
                                : "",
                            'w-full rounded-3xl'
                        )
                        }
                    />

                    <SelectMenu
                        label="All Statuses"
                        items={statusItems}
                        selected={statusFilter}
                        onSelect={(value) => {
                            setStatusFilter(value);
                            setActiveStatFilter(null);
                        }}
                        className={cn(
                            statusFilter !== "all"
                                ? "ring-1 ring-purple-500 border-purple-500"
                                : "",
                            'w-full rounded-3xl'
                        )
                        }
                    />
                    <Button
                        variant={"outline"}
                        onClick={() => setShowOnlyFlagged(!showOnlyFlagged)}
                        className={cn(showOnlyFlagged ? "ring-1 ring-red-500 border-red-500" : "", "rounded-3xl text-destructive hover:bg-red-500")}
                    >
                        <Flag />
                        Flagged
                    </Button>
                </div>
                <div className='flex flex-row items-center justify-between py-2 pt-0 border-b'>
                    {filteredCrew.length !== crewList.length && (
                        <div className="text-center">
                            <span className={`text-sm text-muted-foreground`}>
                                Showing <span className="font-bold text-purple-600">{filteredCrew.length}</span> of {crewList.length} crew members
                            </span>
                        </div>
                    )}

                    {(searchQuery || statusFilter !== 'all') && (
                        <div className="flex items-center gap-2 pt-4">
                            <span className="text-xs font-bold text-gray-500">Active filters:</span>
                            {searchQuery && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                    <span className="text-xs font-bold text-purple-700 dark:text-purple-400">Search: "{searchQuery}"</span>
                                    <button onClick={() => setSearchQuery('')} className="hover:bg-purple-200 dark:hover:bg-purple-800/50 rounded p-0.5">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                            {statusFilter !== 'all' && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-purple-200 dark:bg-purple-900/30 rounded-lg">
                                    <span className="text-xs font-bold text-purple-700 dark:text-purple-400 capitalize">Status: {statusFilter}</span>
                                    <button onClick={() => setStatusFilter('all')} className="hover:bg-purple-200 dark:hover:bg-purple-800/50 rounded p-0.5">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                            <Button
                                variant={"outline"}
                                size={"sm"}
                                onClick={() => {
                                    setSearchQuery('');
                                    setDepartmentFilter('all');
                                    setContractFilter('all');
                                    setContractCategoryFilter('all');
                                    setStatusFilter('all');
                                    setShowOnlyFlagged(false);
                                    setActiveStatFilter(null);
                                }}
                            >
                                Clear all
                            </Button>
                        </div>
                    )}
                </div>
                {selectedCrewIds.size > 0 && (
                    <div className='flex items-center justify-between py-2 border-b'>
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <span className="text-sm font-bold text-purple-700 dark:text-purple-400">
                                    {selectedCrewIds.size} Crew selected
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                onClick={handleBulkApprove}
                            // className="px-6 py-3 rounded-xl font-bold transition-all bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 border-2 border-emerald-500 shadow-lg hover:scale-105"
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>Approve All</span>
                                </div>
                            </Button>
                            <Button
                                variant={"destructive"}
                                onClick={handleBulkReject}
                            // className="px-6 py-3 rounded-xl font-bold transition-all bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 border-2 border-red-500 shadow-lg hover:scale-105"
                            >
                                <div className="flex items-center gap-2">
                                    <Ban className="w-5 h-5" />
                                    <span>Reject All</span>
                                </div>
                            </Button>
                            <Button
                                variant={"outline"}
                                onClick={() => setSelectedCrewIds(new Set())}
                            // className={`px-6 py-3 rounded-xl font-bold transition-all  border-2  hover:bg-gray-100 dark:hover:bg-[#211d2e]`}
                            >
                                <div className="flex items-center gap-2">
                                    <X className="w-5 h-5" />
                                    <span>Clear Selection</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <Accordion
                type="multiple"
                className="space-y-3"
                defaultValue={crewByDepartment.map(([dept]) => dept)}
            >
                {crewByDepartment.map(([department, deptCrew], deptIdx) => {
                    const deptStats = {
                        total: deptCrew.length,
                        submitted: deptCrew.filter((c) => c.submitted).length,
                        approved: deptCrew.filter(
                            (c) => c.approval.payroll === "approved"
                        ).length,
                        totalCost: deptCrew.reduce(
                            (sum, c) => sum + (c.totalCost || 0),
                            0
                        ),
                    };

                    const completion =
                        deptStats.total > 0
                            ? (deptStats.submitted / deptStats.total) * 100
                            : 0;

                    return (
                        <AccordionItem
                            key={department}
                            value={department}
                            className="border-none"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: deptIdx * 0.05 }}
                                className="bg-card rounded-2xl border shadow-xl overflow-hidden"
                            >
                                {/* HEADER */}
                                <AccordionTrigger className="px-8 py-6 hover:no-underline bg-background border-b group">
                                    <div className="flex w-full items-center justify-between">
                                        {/* LEFT */}
                                        <div className="flex items-center gap-6 text-left">
                                            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-600 to-purple-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                <Briefcase className="w-6 h-6 text-white" />
                                            </div>

                                            <div>
                                                <h2 className="text-2xl font-black">
                                                    {department}
                                                </h2>

                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className="text-sm text-muted-foreground font-semibold">
                                                        {deptStats.total} crew
                                                    </span>

                                                    <span className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">
                                                        {deptStats.submitted}/{deptStats.total} submitted
                                                    </span>

                                                    <span className="text-sm text-purple-600 dark:text-purple-400 font-bold">
                                                        £{deptStats.totalCost.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <CircularProgress value={completion.toFixed(0)} size={56} />
                                    </div>
                                </AccordionTrigger>

                                {/* CONTENT */}
                                <AccordionContent>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.25 }}
                                        className="space-y-3"
                                    >
                                        <div className="p-6 space-y-3">
                                            {deptCrew.map((crew, idx) => {
                                                const isSelected = selectedCrewIds.has(crew.id);
                                                const isFlagged = flaggedIds.has(crew.id);
                                                const isExpanded = expandedCrewId === crew.id;
                                                const totalHours = calculateTotalHours(crew.weekData);
                                                // const status = getTimesheetStatus(crew.approval, crew.submitted, crew.isOff);
                                                const status = "submitted";

                                                return (
                                                    <motion.div
                                                        key={crew.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.02 }}
                                                        className={`relative rounded-2xl border-2 transition-all ${isSelected
                                                            ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                                                            : isFlagged
                                                                ? 'border-red-500 shadow-lg shadow-red-500/20'
                                                                : ""
                                                            } bg-card hover:shadow-xl group`}
                                                    >
                                                        {/* Main Row */}
                                                        <div className="p-6 flex items-center gap-6">
                                                            {/* Checkbox */}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleCrewSelection(crew.id);
                                                                }}
                                                                className={`p-2 rounded-xl transition-all bg-background
                                                                        }`}
                                                            >
                                                                {isSelected ? (
                                                                    <CheckSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                                                ) : (
                                                                    <Square className={`w-6 h-6 text-muted-foreground`} />
                                                                )}
                                                            </button>

                                                            {/* Avatar & Info */}
                                                            <div className="flex items-center gap-4 flex-1 min-w-[250px]">
                                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                                                                    <span className="text-lg font-black text-white">
                                                                        {crew.name.split(' ').map(n => n[0]).join('')}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <div className={`font-black  text-lg mb-1`}>{crew.name}</div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className={`text-sm text-muted-foreground`}>{crew.role}</span>
                                                                        <span className={`text-xs text-muted-foreground`}>•</span>
                                                                        <div className="flex items-center gap-1.5">
                                                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${crew.contractType === 'Daily'
                                                                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                                                                : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                                                                                }`}>
                                                                                {crew.contractType}
                                                                            </span>
                                                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${crew.contractCategory === 'PAYE'
                                                                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                                                                : crew.contractCategory === 'SCHD'
                                                                                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                                                                                    : crew.contractCategory === 'LOAN OUT'
                                                                                        ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400'
                                                                                        : 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400'
                                                                                }`}>
                                                                                {crew.contractCategory}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Week Days Mini View */}
                                                            <div className="flex items-center gap-1">
                                                                {days.map(day => {
                                                                    const dayData = crew.weekData[day.key];
                                                                    const hours = parseFloat(dayData.hours || '0');
                                                                    const hasData = hours > 0;
                                                                    const isWeekend = ['sat', 'sun'].includes(day.key);
                                                                    const isOvertime = hours > 12; // Consider over 12 hours as overtime

                                                                    return (
                                                                        <div
                                                                            key={day.key}
                                                                            className="flex flex-col items-center"
                                                                            title={`${day.label}: ${hours}h${isOvertime ? ' (OT)' : ''}${isWeekend ? ' (Weekend)' : ''}`}
                                                                        >
                                                                            <div className="text-[9px] font-bold text-gray-400 mb-1">
                                                                                {day.label[0]}
                                                                            </div>
                                                                            <div
                                                                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${hasData
                                                                                    ? isWeekend || isOvertime
                                                                                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 ring-2 ring-red-500'
                                                                                        : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                                                                                    }`}
                                                                            >
                                                                                {hasData ? hours.toFixed(1) : '-'}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>

                                                            {/* Total Hours */}
                                                            <div className="text-center min-w-[80px]">
                                                                <div className="text-xs font-bold text-gray-500 mb-1">TOTAL</div>
                                                                <div className={`text-2xl font-black `}>
                                                                    {totalHours.toFixed(1)}h
                                                                </div>
                                                                {/* OT/Extra Hours Indicator */}
                                                                {(() => {
                                                                    const otHours = (crew.sixthDay || 0) + (crew.seventhDay || 0) +
                                                                        (crew.cameraOT || 0) + (crew.preOT || 0) + (crew.postOT || 0);
                                                                    if (otHours > 0) {
                                                                        return (
                                                                            <div className="text-[10px] font-bold text-red-600 dark:text-red-400 mt-0.5">
                                                                                +{otHours.toFixed(1)}h OT
                                                                            </div>
                                                                        );
                                                                    }
                                                                    return null;
                                                                })()}
                                                            </div>

                                                            {/* Cost */}
                                                            <div className="text-center min-w-[100px]">
                                                                <div className="text-xs font-bold text-gray-500 mb-1">COST</div>
                                                                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                                                                    £{(crew.totalCost || 0).toLocaleString()}
                                                                </div>
                                                            </div>

                                                            {/* Status Badge */}
                                                            <div className="min-w-[120px]">
                                                                <div
                                                                    className={`px-4 py-2 rounded-xl font-bold text-sm text-center ${status === 'Approved'
                                                                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-2 border-purple-500'
                                                                        : status === 'Submitted'
                                                                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-500'
                                                                            : status === 'Pending'
                                                                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-2 border-amber-500'
                                                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-2 border-gray-300 dark:border-gray-600'
                                                                        }`}
                                                                >
                                                                    {status}
                                                                </div>
                                                            </div>

                                                            {/* Actions */}
                                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleFlag(crew.id);
                                                                    }}
                                                                    className={`p-2.5 rounded-xl border-2 transition-all hover:scale-110 ${isFlagged
                                                                        ? 'border-red-500 bg-red-100 dark:bg-red-900/30'
                                                                        : ` hover:border-red-500`
                                                                        }`}
                                                                    title={isFlagged ? 'Remove Flag' : 'Flag for Review'}
                                                                >
                                                                    <Flag className={`w-4 h-4 ${isFlagged ? 'text-red-600 dark:text-red-400' : ""}`} />
                                                                </button>

                                                                {crew.submitted && (
                                                                    <>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                toast.success(`Approved timesheet for ${crew.name}`);
                                                                            }}
                                                                            className="p-2.5 rounded-xl border-2 border-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all hover:scale-110"
                                                                            title="Approve"
                                                                        >
                                                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                                        </button>

                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleRejectSingle(crew.id);
                                                                            }}
                                                                            className="p-2.5 rounded-xl border-2 border-red-500 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all hover:scale-110"
                                                                            title="Reject"
                                                                        >
                                                                            <Ban className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                                        </button>
                                                                    </>
                                                                )}

                                                                <button
                                                                    onClick={(e) => {
                                                                        navigate(
                                                                            `/projects/${params.projectName}/timesheets/2026-01-18?userId=USR-12423`
                                                                        );
                                                                    }}
                                                                    className={`p-2.5 rounded-xl border-2  hover:border-purple-500 transition-all hover:scale-110`}
                                                                    title="View Details"
                                                                >
                                                                    <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Flag Indicator */}
                                                        {isFlagged && (
                                                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-orange-600" />
                                                        )}
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                </AccordionContent>
                            </motion.div>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    )
}

export default CrewTimsheetManagmentDashboard