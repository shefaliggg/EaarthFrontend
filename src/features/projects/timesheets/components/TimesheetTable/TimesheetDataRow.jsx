import { useState } from 'react';
import { Check, ChevronsUpDown, CheckCircle2, Minus, Plus } from 'lucide-react';
import { cn } from '@/shared/config/utils';
import { Checkbox } from "@/shared/components/ui/checkbox"
import { TimesheetMiniField } from './TimesheetMiniField';
import { Textarea } from '../../../../../shared/components/ui/textarea';
import { Input } from '../../../../../shared/components/ui/input';
import { SelectMenu } from '../../../../../shared/components/menus/SelectMenu';
import { Button } from '../../../../../shared/components/ui/button';
import { TableLocationSelect } from './TableLocationSelect';
import { DAY_TYPE_ITEMS, tableSelect, UNIT_ITEMS, WORKPLACE_ITEMS } from '../../config/TimesheetTableValues';
import { StatusBadge } from "@/shared/components/badges/StatusBadge"

const TimesheetDataRow = ({
    entry,
    index,
    isEditing,
    update,
    upgradeRoles,
    autoValues = {},
    currentUserRole = 'Crew',
    calendarSchedule,
    theme,
    t,
    HOURS,
    MINUTES,
    MEAL_OPTIONS,
    OVERVIEW_FIELDS,
    ALLOWANCE_FIELDS,
    LOCATIONS,
    formatEntryDate
}) => {
    const isWork = [
        'Work',
        'Travel',
        'Half Day',
        'Travel & Turnaround',
        'Driver - Cast Travel',
        'Training'
    ].includes(entry.dayType);

    const isCrewRestricted = currentUserRole === 'Crew';
    const calendarData = calendarSchedule?.[entry.date];
    const [openLocation, setOpenLocation] = useState(false);

    const HOUR_ITEMS = HOURS.map((h) => ({
        label: h,
        value: h,
    }));

    const MINUTE_ITEMS = MINUTES.map((m) => ({
        label: m,
        value: m,
    }));

    const MEAL_ITEMS = MEAL_OPTIONS.map((m) => ({
        label: m,
        value: m,
    }));

    return (
        <div
            className={cn(
                'grid grid-cols-[110px_140px_130px_120px_1fr_1fr_120px] border-b min-w-[1000px] px-3',
                isEditing
                    ? 'bg-purple-50/10 border-purple-100'
                    : 'hover:bg-purple-50/20 dark:hover:bg-purple-900/10'
            )}
        >

            {/* 1️⃣ DATE */}
            <div className="p-2 border-r flex flex-col justify-center min-w-0">

                <span className="font-bold text-[10px]">
                    {formatEntryDate(entry.date)}
                </span>

                {calendarData?.dayType === 'Shoot' && (
                    <div className="mt-1 space-y-0.5 text-[9px]">
                        <div className="font-bold uppercase text-purple-700">
                            {calendarData.unit || 'Main unit'}{' '}
                            <span className="font-medium normal-case">
                                {calendarData.workingHours || '(10 CWD)'}
                            </span>
                        </div>
                        <div>Shoot day #{calendarData.dayNumber || 'N/A'}</div>
                        <div className="font-mono font-bold">
                            {calendarData.unitCall || '00:00'}-{calendarData.unitWrap || '00:00'}
                        </div>
                    </div>
                )}
            </div>

            {/* 2️⃣ TYPE / UNIT / LOCATION */}
            <div className="p-2 border-r flex flex-col justify-center gap-1 min-w-0">
                {isEditing ? (
                    <>
                        {/* DAY TYPE */}
                        <SelectMenu
                            selected={entry.dayType}
                            onSelect={(v) => update("dayType", v)}
                            items={DAY_TYPE_ITEMS}
                            label="Select…"
                            className={cn(
                                tableSelect
                            )}
                        />

                        {isWork && (
                            <>
                                {/* UNIT + WORKPLACE */}
                                <div className="flex gap-1 min-w-0">
                                    {/* Unit */}
                                    <SelectMenu
                                        selected={entry.unit}
                                        onSelect={(v) => update("unit", v)}
                                        items={UNIT_ITEMS}
                                        className={cn(
                                            tableSelect
                                        )}
                                    />

                                    {/* Workplace */}
                                    <SelectMenu
                                        selected={entry.workplace?.[0] || "On Set"}
                                        onSelect={(v) => update("workplace", [v])}
                                        items={WORKPLACE_ITEMS}
                                        className={cn(
                                            tableSelect
                                        )}
                                    />
                                </div>


                                <TableLocationSelect
                                    value={entry.workplaceLocation}
                                    onChange={(v) => update("workplaceLocation", v)}
                                    items={LOCATIONS}
                                />
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <div className="text-[9px] font-bold uppercase text-purple-700">
                            {entry.dayType}
                        </div>

                        {entry.dayType === "Work" && (
                            <>
                                <div className="text-[9px] font-bold uppercase">
                                    {t(entry.unit)} • {entry.workplace?.[0]}
                                </div>
                                <div className="text-[10px] truncate">
                                    {t(entry.workplaceLocation)}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            {/* 3️⃣ IN / OUT */}
            <div className="p-2 border-r flex flex-col justify-center gap-1 min-w-0 font-mono">
                {isEditing && isWork ? (
                    <>
                        {/* IN */}
                        <div className="flex items-center justify-center gap-1 min-w-0">
                            <SelectMenu
                                selected={(entry.inTime || "").split(":")[0] || ""}
                                onSelect={(v) =>
                                    update(
                                        "inTime",
                                        `${v}:${(entry.inTime || "00:00").split(":")[1]}`
                                    )
                                }
                                items={HOUR_ITEMS}
                                label="HH"
                                className={cn(tableSelect)}
                            />

                            <span className="text-[8px] text-muted-foreground">:</span>

                            <SelectMenu
                                selected={(entry.inTime || "").split(":")[1] || ""}
                                onSelect={(v) =>
                                    update(
                                        "inTime",
                                        `${(entry.inTime || "00:00").split(":")[0]}:${v}`
                                    )
                                }
                                items={MINUTE_ITEMS}
                                label="MM"
                                className={cn(tableSelect)}
                            />
                        </div>

                        {/* MEAL */}
                        <SelectMenu
                            selected={entry.mealStatus || ""}
                            onSelect={(v) => update("mealStatus", v)}
                            items={MEAL_ITEMS}
                            label="Meal"
                            className={cn(tableSelect)}
                        />

                        {/* OUT */}
                        <div className="flex items-center justify-center gap-1 min-w-0">
                            <SelectMenu
                                selected={(entry.outTime || "").split(":")[0] || ""}
                                onSelect={(v) =>
                                    update(
                                        "outTime",
                                        `${v}:${(entry.outTime || "00:00").split(":")[1]}`
                                    )
                                }
                                items={HOUR_ITEMS}
                                label="HH"
                                className={cn(tableSelect)}
                            />

                            <span className="text-[8px] text-muted-foreground">:</span>

                            <SelectMenu
                                selected={(entry.outTime || "").split(":")[1] || ""}
                                onSelect={(v) =>
                                    update(
                                        "outTime",
                                        `${(entry.outTime || "00:00").split(":")[0]}:${v}`
                                    )
                                }
                                items={MINUTE_ITEMS}
                                label="MM"
                                className={cn(tableSelect)}
                            />
                        </div>
                        <button
                            onClick={() => update("nextDay", !entry.nextDay)}
                            className={cn(
                                tableSelect,
                                "font-bold",
                                entry.nextDay
                                    ? "bg-purple-600 text-white"
                                    : "text-muted-foreground"
                            )}
                        >
                            +1 DAY
                        </button>

                        {/* FLAT DAY */}
                        <div className="flex items-center justify-center gap-1 pt-0.5">
                            <Checkbox
                                checked={!!entry.isFlatDay}
                                onCheckedChange={(checked) =>
                                    update("isFlatDay", !!checked)
                                }
                                className="scale-[0.75]"
                            />
                            <span className="text-[8px] uppercase tracking-wide text-muted-foreground">
                                Flat Day
                            </span>
                        </div>
                    </>
                ) : isWork ? (
                    /* READ MODE — unchanged */
                    <>
                        <div className="flex justify-center gap-1">
                            <div className="bg-purple-50 px-2 rounded">
                                {(entry.inTime || "--").split(":")[0]}
                            </div>
                            <div className="bg-purple-50 px-2 rounded">
                                {(entry.inTime || "--").split(":")[1]}
                            </div>
                        </div>

                        {entry.mealStatus && (
                            <div className="text-center text-[9px]">{entry.mealStatus}</div>
                        )}

                        <div className="flex justify-center gap-1">
                            <div className="bg-purple-50 px-2 rounded">
                                {(entry.outTime || "--").split(":")[0]}
                            </div>
                            <div className="bg-purple-50 px-2 rounded">
                                {(entry.outTime || "--").split(":")[1]}
                            </div>
                        </div>

                        {entry.isFlatDay && (
                            <div className="flex justify-center items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-purple-600" />
                                <span className="text-[7px]">Flat Day</span>
                            </div>
                        )}
                    </>
                ) : (
                    <span className="flex justify-center">
                        <Minus />
                    </span>
                )}
            </div>

            {/* 4️⃣ UPGRADE */}
            <div className="p-2 border-r flex flex-col justify-center gap-1 min-w-0">
                {isEditing ? (
                    <>
                        {/* Upgrade Toggle */}
                        <div className="flex items-center gap-1">
                            <Checkbox
                                checked={!!entry.isUpgraded}
                                onCheckedChange={(checked) => update("isUpgraded", !!checked)}
                                className="scale-[0.75]"
                            />
                            <span className="text-[8px] uppercase tracking-wide text-muted-foreground">
                                Upgrade
                            </span>
                        </div>

                        {entry.isUpgraded && (
                            <>
                                {/* Role Selector */}
                                <SelectMenu
                                    label="Role"
                                    items={upgradeRoles.map((r) => ({ label: r.name, value: r.name }))}
                                    selected={entry.upgradeRole}
                                    onSelect={(v) => {
                                        update("upgradeRole", v);
                                        const r = upgradeRoles.find((x) => x.name === v);
                                        if (r) update("upgradeRate", r.rate);
                                    }}
                                    className={cn(tableSelect, "px-2!")}
                                />

                                {/* Rate Input + Steppers */}
                                <div className="flex items-center gap-1 group">
                                    <Input
                                        type="text"
                                        inputMode="numeric"
                                        value={entry.upgradeRate || ""}
                                        onChange={(e) => update("upgradeRate", e.target.value)}
                                        className={cn(
                                            tableSelect,
                                            "flex-1 text-right px-3! h-7! text-sm! rounded-sm"
                                        )}
                                    />

                                    <div className="flex flex-col space-y-[1px]">
                                        <Button
                                            size="icon"
                                            variant={"outline"}
                                            type="button"
                                            onClick={() =>
                                                update("upgradeRate", Number(entry.upgradeRate || 0) + 1)
                                            }
                                            className="h-4 w-7 flex items-center justify-center rounded-sm"
                                        >
                                            <Plus className="h-2 w-2" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant={"outline"}
                                            type="button"
                                            onClick={() =>
                                                update("upgradeRate", Math.max(0, Number(entry.upgradeRate || 0) - 1))
                                            }
                                            className="h-4 w-7 flex items-center justify-center rounded-sm"
                                        >
                                            <Minus className="h-2 w-2" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                ) : entry.isUpgraded ? (
                    // READ MODE
                    <div className="text-[9px] font-semibold text-purple-700 space-y-1">
                        <StatusBadge status={"information"} label={"Upgraded"} size={"sm"}/>
                        <div className="truncate">{entry.upgradeRole}</div>
                        <div>£{entry.upgradeRate}</div>
                    </div>
                ) : (
                    <span className="flex justify-center text-muted-foreground">
                        <Minus />
                    </span>
                )}
            </div>

            {/* 5️⃣ OVERVIEW */}
            <div className="p-1 border-r min-w-0">
                <div className="grid grid-cols-3 gap-1">
                    {OVERVIEW_FIELDS.map(f => {
                        const val = entry[f.k] ?? autoValues[f.k] ?? '';
                        return (
                            <TimesheetMiniField
                                key={f.k}
                                label={f.l}
                                value={val}
                                fieldKey={f.k}
                                type={f.type}
                                isEditing={isEditing}
                                disabled={isCrewRestricted}
                                onChange={update}
                            />
                        );
                    })}
                </div>
            </div>

            {/* 6️⃣ ALLOWANCES */}
            <div className="p-2 border-r min-w-0">
                <div className="grid grid-cols-3 gap-1">
                    {[...ALLOWANCE_FIELDS].map(f => {
                        const val = entry[f.k] ?? (f.type === 'bool' ? 0 : '')
                        return (
                            <TimesheetMiniField
                                key={f.k}
                                label={f.l}
                                value={val}
                                fieldKey={f.k}
                                type={f.type}
                                isEditing={isEditing}
                                onChange={update}
                            />
                        )
                    })}
                </div>
            </div>

            {/* 7️⃣ NOTES */}
            <div className="p-2 min-w-0">
                {isEditing ? (
                    <Textarea
                        value={entry.notes || ''}
                        onChange={(e) => update('notes', e.target.value)}
                        className="w-full min-w-0 h-10 text-[10px] rounded"
                        placeholder="Add notes here..."
                    />
                ) : entry.notes ? (
                    <div className="text-[9px] line-clamp-3">{entry.notes}</div>
                ) : (
                    <span className="text-[9px] text-gray-300 italic">-</span>
                )}
            </div>

        </div>
    );
};

export default TimesheetDataRow;
