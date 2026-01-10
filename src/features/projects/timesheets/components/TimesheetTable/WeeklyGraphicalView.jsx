import React from 'react';
import { Clock, Coffee, Utensils, Zap, Briefcase, Moon, Sun, Truck, AlertCircle, CheckCircle2, BedDouble, Laptop, Box, Camera, Fuel, Smartphone, ChevronRight, Info, Calendar, DollarSign, MapPin, Users } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/config/utils";
import {
    Dialog,
    DialogContent,
} from "@/shared/components/ui/dialog"
import { X } from "lucide-react"
import { Button } from '../../../../../shared/components/ui/button';
import { DialogDescription, DialogHeader, DialogTitle } from '../../../../../shared/components/ui/dialog';
import { Badge } from '../../../../../shared/components/ui/badge';
import { StatusBadge } from '../../../../../shared/components/badges/StatusBadge';

// --- CONFIGURATION ---
const START_HOUR = 0;
const END_HOUR = 24;
const HOUR_HEIGHT = 34;
const GRID_HEIGHT = HOUR_HEIGHT * 24;

// Enhanced Color Palette with better contrast
const BLOCK_STYLES = {
  /* ───────────── MAIN WORK ───────────── */
  standardDay: {
    bg: 'bg-gradient-to-r from-violet-500 to-violet-600',
    border: 'border-primary/30',
    text: 'text-white',
    icon: Briefcase,
  },

  sixthDay: {
    bg: 'bg-gradient-to-r from-violet-700 to-violet-800',
    border: 'border-primary/30',
    text: 'text-white',
    icon: Calendar,
  },

  seventhDay: {
    bg: 'bg-gradient-to-r from-violet-900 to-violet-950',
    border: 'border-purple-900/30',
    text: 'text-white',
    icon: Calendar,
  },

  publicHoliday: {
    bg: 'bg-gradient-to-r from-emerald-500/90 to-emerald-600',
    border: 'border-emerald-700/30',
    text: 'text-white',
    icon: Users,
  },

  /* ───────────── OVERTIME (WARM ENERGY) ───────────── */
  preOT: {
    bg: 'bg-gradient-to-r from-amber-500/90 to-amber-600',
    border: 'border-amber-700/30',
    text: 'text-amber-950',
    icon: Zap,
  },

  postOT: {
    bg: 'bg-gradient-to-r from-orange-500/90 to-orange-600',
    border: 'border-orange-700/30',
    text: 'text-white',
    icon: Zap,
  },

  cameraOT: {
    bg: 'bg-gradient-to-r from-yellow-400/90 to-yellow-500',
    border: 'border-yellow-600/30',
    text: 'text-yellow-950',
    icon: Camera,
  },

  addHour: {
    bg: 'bg-gradient-to-r from-orange-600 to-orange-700',
    border: 'border-orange-800/30',
    text: 'text-white',
    icon: Clock,
  },

  enhancedOT: {
    bg: 'bg-gradient-to-r from-orange-700 to-orange-800',
    border: 'border-orange-900/30',
    text: 'text-white',
    icon: Zap,
  },

  /* ───────────── OVERLAYS & PENALTIES ───────────── */
  night: {
    bg: 'bg-slate-900/30 backdrop-blur-sm',
    border: 'border-slate-700/40 border-dashed',
    text: 'text-slate-200',
    icon: Moon,
    pattern:
      'repeating-linear-gradient(45deg, rgba(255,255,255,0.03), rgba(255,255,255,0.03) 6px, transparent 6px, transparent 12px)',
  },

  dawn: {
    bg: 'bg-gradient-to-r from-rose-400/80 to-rose-500/80',
    border: 'border-rose-600/30',
    text: 'text-white',
    icon: Sun,
  },

  travel: {
    bg: 'bg-sky-500/25',
    border: 'border-sky-500/40 border-dashed',
    text: 'text-sky-900 dark:text-sky-100',
    icon: Truck,
  },

  turnaround: {
    bg: 'bg-red-500/85',
    border: 'border-red-700/40',
    text: 'text-white',
    icon: AlertCircle,
  },

  /* ───────────── FALLBACK ───────────── */
  default: {
    bg: 'bg-muted',
    border: 'border-muted-foreground/30',
    text: 'text-foreground',
    icon: Clock,
  },
};

const ALLOWANCE_ICONS = {
    breakfast: Coffee,
    lunch: Utensils,
    dinner: Utensils,
    perDiem: DollarSign,
    lateMeal: AlertCircle,
    brokenMeal: AlertCircle,
    mealPenalty: DollarSign,
    mileage: Fuel,
    parking: MapPin,
    accommodation: BedDouble,
    equipment: Briefcase
};

export function WeeklyGraphicalView({
    entries,
    isDarkMode,
    fields = [],
    open,
    onOpenChange,
}) {

    const parseTime = (timeStr) => {
        if (!timeStr) return 8;
        const [h, m] = timeStr.split(':').map(Number);
        return h + (m / 60);
    };

    const formatTime = (hours) => {
        const normalized = hours % 24;
        const h = Math.floor(normalized);
        const m = Math.round((normalized - h) * 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    const weekBlocks = React.useMemo(() => {
        const dayMap = new Map();
        entries.forEach((_, i) => dayMap.set(i, []));

        entries.forEach((entry, dayIndex) => {
            if ((!entry.inTime || !entry.outTime) && entry.dayType === 'Work') return;
            if (entry.dayType !== 'Work' && !entry.inTime) return;

            let start = parseTime(entry.inTime);
            let end = parseTime(entry.outTime);

            if (entry.nextDay || end < start) {
                if (end < start) end += 24;
            }

            let logicalBlocks = [];
            let currentPos = start;

            // 1. Pre OT
            const preOT = parseFloat(entry.preOT) || 0;
            if (preOT > 0) {
                logicalBlocks.push({ key: 'preOT', label: `PRE OT`, hours: preOT, start: currentPos, duration: preOT });
                currentPos += preOT;
            }

            // 2. Main Work Block
            const postOT = parseFloat(entry.postOT) || 0;
            const cameraOT = parseFloat(entry.cameraOT) || 0;
            const totalDuration = end - start;
            let coreDuration = totalDuration - preOT - postOT - cameraOT;
            coreDuration = Math.max(0, coreDuration);

            let mainKey = 'standardDay';
            if (entry.sixthDay) mainKey = 'sixthDay';
            if (entry.seventhDay) mainKey = 'seventhDay';
            if (entry.publicHoliday) mainKey = 'publicHoliday';

            if (coreDuration > 0) {
                logicalBlocks.push({ key: mainKey, label: 'WORK', hours: coreDuration, start: currentPos, duration: coreDuration });
                currentPos += coreDuration;
            }

            // 3. Camera OT
            if (cameraOT > 0) {
                logicalBlocks.push({ key: 'cameraOT', label: `CAM OT`, hours: cameraOT, start: currentPos, duration: cameraOT });
                currentPos += cameraOT;
            }

            // 4. Post OT
            if (postOT > 0) {
                logicalBlocks.push({ key: 'postOT', label: `POST OT`, hours: postOT, start: currentPos, duration: postOT });
                currentPos += postOT;
            }

            // 5. Overlays
            const night = parseFloat(entry.night) || 0;
            if (night > 0) {
                logicalBlocks.push({ key: 'night', label: `NIGHT`, hours: night, start: end - night, duration: night, isOverlay: true });
            }

            const travel = parseFloat(entry.travel) || 0;
            if (travel > 0) {
                logicalBlocks.push({ key: 'travel', label: `TRAVEL`, hours: travel, start: start - travel, duration: travel, isOverlay: true });
            }

            logicalBlocks.forEach(block => {
                const blockStart = block.start;
                const blockEnd = block.start + block.duration;

                if (blockEnd <= 24) {
                    dayMap.get(dayIndex).push(block);
                }
                else if (blockStart < 24 && blockEnd > 24) {
                    const duration1 = 24 - blockStart;
                    dayMap.get(dayIndex).push({ ...block, duration: duration1 });

                    if (dayIndex + 1 < entries.length) {
                        const duration2 = blockEnd - 24;
                        dayMap.get(dayIndex + 1).push({ ...block, start: 0, duration: duration2, isCarryOver: true });
                    }
                }
                else if (blockStart >= 24) {
                    if (dayIndex + 1 < entries.length) {
                        dayMap.get(dayIndex + 1).push({ ...block, start: blockStart - 24 });
                    }
                }
            });
        });

        return dayMap;
    }, [entries]);

    const getAllowanceItems = (entry) => {
        const items = [];

        if (entry.breakfast) items.push({ key: 'breakfast', label: 'Breakfast', icon: ALLOWANCE_ICONS.breakfast, value: true });
        if (entry.lunch) items.push({ key: 'lunch', label: 'Lunch', icon: ALLOWANCE_ICONS.lunch, value: true });
        if (entry.dinner) items.push({ key: 'dinner', label: 'Dinner', icon: ALLOWANCE_ICONS.dinner, value: true });
        if (entry.perDiem > 0) items.push({ key: 'perDiem', label: `$${entry.perDiem}`, icon: ALLOWANCE_ICONS.perDiem, value: entry.perDiem });
        if (entry.lateMeal > 0) items.push({ key: 'lateMeal', label: `Late x${entry.lateMeal}`, icon: ALLOWANCE_ICONS.lateMeal, value: entry.lateMeal });
        if (entry.brokenMeal > 0) items.push({ key: 'brokenMeal', label: `Broken x${entry.brokenMeal}`, icon: ALLOWANCE_ICONS.brokenMeal, value: entry.brokenMeal });

        return items;
    };

    const getTotalHours = (blocks) => {
        return blocks
            .filter(b => !b.isOverlay && b.key !== 'night' && b.key !== 'travel')
            .reduce((sum, b) => sum + b.duration, 0)
            .toFixed(1);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                className={cn(
                    "p-0 overflow-hidden",
                    "max-w-[95vw] w-full h-[95vh]",
                )}
            >
                <div className="flex-1 overflow-auto space-y-2">
                    <DialogHeader className='p-3 pb-2 px-5 gap-1'>
                        <DialogTitle className="text-lg font-bold flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Weekly Schedule Overview
                        </DialogTitle>

                        <DialogDescription className="text-sm text-muted-foreground ">
                            Visual timeline of shifts, overtime, and allowances
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex w-full">

                        {/* TIME COLUMN (Enhanced) */}
                        <div className={cn(
                            "w-14 flex-shrink-0 sticky left-0 z-30 flex flex-col",
                        )}>
                            <div className={cn(
                                "h-16 flex items-center justify-center border-b sticky top-0 backdrop-blur-sm z-110",
                            )}>
                                <div className="flex flex-col items-center">
                                    <Clock className="w-4 h-4 text-gray-400 mb-1" />
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Time</span>
                                </div>
                            </div>

                            {/* 24 Hour Ticks with Day/Night Indicators */}
                            <div style={{ height: GRID_HEIGHT }} className="relative w-full">
                                {Array.from({ length: 24 }).map((_, i) => {
                                    const isNight = i >= 20 || i < 6;
                                    return (
                                        <div key={i} style={{ height: HOUR_HEIGHT, top: i * HOUR_HEIGHT }} className="absolute w-full group flex items-center justify-center">
                                            {/* Hour Label */}
                                            <div className={cn(
                                                "text-[10px] font-mono font-bold text-center relative z-10 py-1 rounded-r-md transition-all duration-200",
                                                isNight ? 'text-primary px-0' : 'px-1'
                                            )}>
                                                {isNight && (
                                                    <Moon className="w-2 h-2 inline mr-1 opacity-70 text-primary" />
                                                )}
                                                {i.toString().padStart(2, '0')}:00
                                            </div>

                                            {/* Enhanced Ticks */}
                                            <div className="absolute right-0 top-0 w-full h-px bg-muted-foreground/10"></div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Allowances Header */}
                            <div className={cn(
                                "h-20 border-t p-2 flex items-center justify-center",
                            )}>
                                <div className="rotate-180" style={{ writingMode: 'vertical-rl' }}>
                                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                                        Allowances
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* DAYS GRID */}
                        <div className="flex-1 flex min-w-[800px]">
                            {entries.map((entry, index) => {
                                const blocks = weekBlocks.get(index) || [];
                                const allowances = getAllowanceItems(entry);
                                const totalHours = getTotalHours(blocks);

                                return (
                                    <div key={index} className={cn(
                                        "flex-1 min-w-[120px] group/day",
                                        index !== entries.length - 1 && 'border-r'
                                    )}>

                                        {/* Enhanced Header */}
                                        <div className={cn(
                                            "h-16 border-b relative overflow-hidden",
                                            "sticky top-0 bg-background/70 backdrop-blur-sm z-110"
                                        )}>

                                            <div className="pl-3 pr-2 pt-2">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-[11px] font-bold text-muted-foreground uppercase">{entry.day}</span>
                                                            <span className={cn(
                                                                "text-lg font-black",
                                                            )}>{entry.dayNum}</span>
                                                        </div>

                                                        {entry.dayType === 'Work' && entry.inTime && entry.outTime ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="text-[9px] flex items-center font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full">
                                                                    {entry.inTime} <ChevronRight className="w-2 h-2 inline mx-0.5" /> {entry.outTime}
                                                                    {entry.nextDay && <span className="text-[8px] ml-0.5">*</span>}
                                                                </div>
                                                                <Badge variant={"outline"} className={" text-[8px] bg-background"}>
                                                                    {totalHours}h
                                                                </Badge>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant={"secondary"} className={"text-[8px]"}>
                                                                    {entry.dayType}
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {entry.dayType === 'Work' && (
                                                        <div className="text-[8px] shrink-0  font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                            Day {index + 1}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Timeline Area */}
                                        <div style={{ height: GRID_HEIGHT }} className="relative w-full">
                                            {Array.from({ length: 24 }).map((_, i) => {
                                                const isNight = i >= 20 || i < 6;
                                                return (
                                                    <div key={i} style={{ height: HOUR_HEIGHT, top: i * HOUR_HEIGHT }} className="absolute w-full">
                                                        <div className={cn(
                                                            "absolute inset-0",
                                                            isNight
                                                                ? "bg-primary/10"
                                                                : "bg-background"
                                                        )}></div>
                                                        <div className={cn(
                                                            "absolute top-0 w-full border-t border-muted-foreground/10",
                                                        )}></div>
                                                    </div>
                                                );
                                            })}

                                            {/* Timeline Blocks */}
                                            {blocks.map((block, bIdx) => {
                                                const style = BLOCK_STYLES[block.key] || BLOCK_STYLES.default;
                                                const Icon = style.icon;
                                                const top = block.start * HOUR_HEIGHT;
                                                const height = Math.max(block.duration * HOUR_HEIGHT, 3);
                                                const isOverlay = block.isOverlay;

                                                return (
                                                    <TooltipProvider key={bIdx}>
                                                        <Tooltip delayDuration={100}>
                                                            <TooltipTrigger asChild>
                                                                <div
                                                                    className={cn(
                                                                        "absolute rounded-md shadow-sm hover:scale-[1.02] hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center overflow-hidden cursor-help",
                                                                        style.bg,
                                                                        !isOverlay && 'border',
                                                                        style.border,
                                                                        isOverlay ? 'w-full left-0 z-10' : 'w-[85%] left-[7.5%] z-20',
                                                                    )}
                                                                    style={{
                                                                        top,
                                                                        height,
                                                                        backgroundImage: style.pattern,
                                                                        minHeight: '24px'
                                                                    }}
                                                                >
                                                                    {/* Block Content */}
                                                                    {height > 0 && (
                                                                        <div className="flex flex-col items-center justify-center p-1 w-full">
                                                                            <div className="flex items-center gap-1 mb-0.5">
                                                                                <Icon className={cn(
                                                                                    "w-3 h-3",
                                                                                    style.text,
                                                                                    isOverlay ? 'opacity-60' : 'opacity-90'
                                                                                )} />
                                                                                <span className={cn(
                                                                                    "text-[10px] font-bold uppercase truncate leading-none",
                                                                                    style.text
                                                                                )}>
                                                                                    {block.label}
                                                                                </span>
                                                                            </div>

                                                                            {height > 40 && (
                                                                                <>
                                                                                    <div className={cn(
                                                                                        "text-[9px] font-mono opacity-90 text-center leading-none",
                                                                                        style.text
                                                                                    )}>
                                                                                        {formatTime(block.start)} - {formatTime(block.start + block.duration)}
                                                                                    </div>
                                                                                    <div className={cn(
                                                                                        "text-[8px] font-bold mt-0.5 px-1.5 py-0.5 rounded-full",
                                                                                        isDarkMode ? 'bg-white/20' : 'bg-black/10',
                                                                                        style.text
                                                                                    )}>
                                                                                        {block.hours?.toFixed(1)}h
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent
                                                                side="right"
                                                                className="bg-gradient-to-br from-gray-900 to-gray-950 text-white border-gray-700 p-3 shadow-xl"
                                                            >
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <div className={cn("w-2 h-2 rounded-full", style.bg.replace('bg-gradient-to-r', 'bg'))}></div>
                                                                    <div className="font-bold">{block.label}</div>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                                    <div className="text-gray-400">Start</div>
                                                                    <div className="font-mono">{formatTime(block.start)}</div>
                                                                    <div className="text-gray-400">End</div>
                                                                    <div className="font-mono">{formatTime(block.start + block.duration)}</div>
                                                                    <div className="text-gray-400">Duration</div>
                                                                    <div className="font-bold">{block.duration?.toFixed(2)} hours</div>
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                );
                                            })}
                                        </div>

                                        {/* Enhanced Allowance Footer */}
                                        <div className={cn(
                                            "h-20 border-t p-2",
                                        )}>
                                            <div className="flex flex-wrap gap-1.5 justify-start">
                                                {allowances.length > 0 ? allowances.map((item, aIdx) => {
                                                    const Icon = item.icon;
                                                    return (
                                                        <StatusBadge icon={Icon} label={item.label} size='xs' className={"bg-primary/10 text-primary"} />
                                                    );
                                                }) : (
                                                    <div className={cn(
                                                        "text-[10px] italic h-full w-full text-muted-foreground text-center",
                                                    )}>
                                                        No allowances
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Enhanced Legend */}
                    <div className={cn(
                        "py-4 px-6 border-t bg-card"
                    )}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Info className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Block Types Legend</span>
                            </div>
                            <StatusBadge status={"information"} label={"Hover over blocks for details"} size='sm' />
                        </div>

                        <div className={`py-3 px-4 flex flex-wrap gap-x-6 gap-y-2`}>
                            {Object.entries(BLOCK_STYLES).map(([key, style]) => (
                                <div key={key} className="flex items-center gap-2">
                                    <div className={`w-2.5 h-2.5 rounded-full ${style.bg} border ${style.border}`}></div>
                                    <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    );
}