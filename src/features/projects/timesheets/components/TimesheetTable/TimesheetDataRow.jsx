import { useState } from 'react';
import { Check, ChevronsUpDown, CheckCircle2, Minus } from 'lucide-react';
import { cn } from '@/shared/config/utils';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/shared/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem
} from '@/shared/components/ui/command';
import { TimesheetMiniField } from './TimesheetMiniField';

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

    return (
        <div
            className={cn(
                'w-full grid grid-cols-[0.7fr_0.9fr_0.7fr_0.6fr_2.2fr_2.0fr_0.6fr] border-b',
                theme.border,
                isEditing
                    ? 'bg-purple-50/10 border-purple-100'
                    : 'hover:bg-purple-50/20 dark:hover:bg-purple-900/10'
            )}
        >

            {/* 1️⃣ DATE */}
            <div className="p-2 border-r flex flex-col justify-center pl-3">
                <span className="font-bold text-[9px]">
                    {formatEntryDate(entry.date)}
                </span>

                {calendarData?.dayType === 'Shoot' && (
                    <div className="mt-1 space-y-0.5 text-[8px]">
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
            <div className="p-2 border-r flex flex-col gap-1">
                {isEditing ? (
                    <>
                        <select
                            value={entry.dayType}
                            onChange={(e) => update('dayType', e.target.value)}
                            className={cn(
                                'text-[9px] font-bold uppercase border rounded px-1 py-1',
                                entry.dayType === 'Work'
                                    ? 'bg-purple-50 border-purple-200'
                                    : 'bg-gray-50'
                            )}
                        >
                            <option value="">Select...</option>
                            {[
                                'Work', 'Rest', 'Travel', 'Turnaround', 'Holiday',
                                'Public holiday off', 'Personal issue', 'Sick',
                                'Training', 'Half Day', 'Travel & Turnaround',
                                'Driver - Cast Travel'
                            ].map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>

                        {isWork && (
                            <>
                                <div className="flex gap-1">
                                    <select
                                        value={entry.unit}
                                        onChange={(e) => update('unit', e.target.value)}
                                        className="flex-1 text-[9px] border rounded px-1"
                                    >
                                        <option value="Main">Main Unit</option>
                                        <option value="2nd">2nd Unit</option>
                                    </select>

                                    <select
                                        value={entry.workplace?.[0] || 'On Set'}
                                        onChange={(e) => update('workplace', [e.target.value])}
                                        className="flex-1 text-[9px] border rounded px-1 uppercase"
                                    >
                                        <option value="On Set">ON SET</option>
                                        <option value="Off Set">OFF SET</option>
                                    </select>
                                </div>

                                <div className="flex gap-1">
                                    <input
                                        value={entry.workplaceLocation || ''}
                                        onChange={(e) => update('workplaceLocation', e.target.value)}
                                        className="flex-1 text-[9px] border rounded px-2"
                                        placeholder="Location..."
                                    />
                                    <Popover open={openLocation} onOpenChange={setOpenLocation}>
                                        <PopoverTrigger asChild>
                                            <button className="h-5 w-5 border rounded">
                                                <ChevronsUpDown className="h-3 w-3" />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0 w-[200px]">
                                            <Command>
                                                <CommandInput placeholder="Search..." />
                                                <CommandEmpty>No result</CommandEmpty>
                                                <CommandGroup>
                                                    {LOCATIONS.map(loc => (
                                                        <CommandItem
                                                            key={loc}
                                                            onSelect={() => {
                                                                update('workplaceLocation', loc);
                                                                setOpenLocation(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    'mr-2 h-3 w-3',
                                                                    entry.workplaceLocation === loc ? 'opacity-100' : 'opacity-0'
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
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <div className="text-[8px] font-bold uppercase text-purple-700">
                            {entry.dayType}
                        </div>
                        {entry.dayType === 'Work' && (
                            <>
                                <div className="text-[8px] font-bold uppercase">
                                    {t(entry.unit)} • {entry.workplace?.[0]}
                                </div>
                                <div className="text-[9px] truncate">
                                    {t(entry.workplaceLocation)}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            {/* 3️⃣ IN / OUT */}
            <div className="p-2 border-r flex flex-col gap-1 text-[10px] font-mono">
                {isEditing && isWork ? (
                    <>
                        {/* IN */}
                        <div className="flex gap-1">
                            <select
                                disabled={entry.isFlatDay}
                                value={(entry.inTime || '').split(':')[0] || ''}
                                onChange={(e) =>
                                    update('inTime', `${e.target.value}:${(entry.inTime || '00:00').split(':')[1]}`)
                                }
                                className="flex-1 border rounded text-center"
                            >
                                <option value="">HH</option>
                                {HOURS.map(h => <option key={h}>{h}</option>)}
                            </select>
                            <select
                                disabled={entry.isFlatDay}
                                value={(entry.inTime || '').split(':')[1] || ''}
                                onChange={(e) =>
                                    update('inTime', `${(entry.inTime || '00:00').split(':')[0]}:${e.target.value}`)
                                }
                                className="flex-1 border rounded text-center"
                            >
                                <option value="">MM</option>
                                {MINUTES.map(m => <option key={m}>{m}</option>)}
                            </select>
                        </div>

                        <select
                            value={entry.mealStatus || ''}
                            onChange={(e) => update('mealStatus', e.target.value)}
                            className="text-[9px] border rounded"
                        >
                            {MEAL_OPTIONS.map(m => <option key={m}>{m}</option>)}
                        </select>

                        {/* OUT */}
                        <div className="flex gap-1 items-center">
                            <select
                                disabled={entry.isFlatDay}
                                value={(entry.outTime || '').split(':')[0] || ''}
                                onChange={(e) =>
                                    update('outTime', `${e.target.value}:${(entry.outTime || '00:00').split(':')[1]}`)
                                }
                                className="flex-1 border rounded text-center"
                            >
                                <option value="">HH</option>
                                {HOURS.map(h => <option key={h}>{h}</option>)}
                            </select>
                            <select
                                disabled={entry.isFlatDay}
                                value={(entry.outTime || '').split(':')[1] || ''}
                                onChange={(e) =>
                                    update('outTime', `${(entry.outTime || '00:00').split(':')[0]}:${e.target.value}`)
                                }
                                className="flex-1 border rounded text-center"
                            >
                                <option value="">MM</option>
                                {MINUTES.map(m => <option key={m}>{m}</option>)}
                            </select>

                            <button
                                onClick={() => update('nextDay', !entry.nextDay)}
                                className={cn(
                                    'h-6 w-5 text-[8px] border rounded',
                                    entry.nextDay ? 'bg-purple-600 text-white' : 'text-gray-400'
                                )}
                            >
                                +1
                            </button>
                        </div>

                        <div className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                checked={entry.isFlatDay || false}
                                onChange={(e) => update('isFlatDay', e.target.checked)}
                            />
                            <span className="text-[8px]">Flat Day</span>
                        </div>
                    </>
                ) : isWork ? (
                    <>
                        <div className="flex justify-center gap-1">
                            <div className="bg-purple-50 px-2 rounded">
                                {(entry.inTime || '--').split(':')[0]}
                            </div>
                            <div className="bg-purple-50 px-2 rounded">
                                {(entry.inTime || '--').split(':')[1]}
                            </div>
                        </div>
                        {entry.mealStatus && (
                            <div className="text-center text-[8px]">{entry.mealStatus}</div>
                        )}
                        <div className="flex justify-center gap-1">
                            <div className="bg-purple-50 px-2 rounded">
                                {(entry.outTime || '--').split(':')[0]}
                            </div>
                            <div className="bg-purple-50 px-2 rounded">
                                {(entry.outTime || '--').split(':')[1]}
                            </div>
                        </div>
                        {entry.isFlatDay && (
                            <div className="flex justify-center items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-purple-600" />
                                <span className="text-[7px]">Flat</span>
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
            <div className="p-2 border-r">
                {isEditing ? (
                    <>
                        <input
                            type="checkbox"
                            checked={entry.isUpgraded || false}
                            onChange={(e) => update('isUpgraded', e.target.checked)}
                        />
                        {entry.isUpgraded && (
                            <>
                                <select
                                    value={entry.upgradeRole || ''}
                                    onChange={(e) => {
                                        update('upgradeRole', e.target.value);
                                        const r = upgradeRoles.find(x => x.name === e.target.value);
                                        if (r) update('upgradeRate', r.rate);
                                    }}
                                    className="w-full text-[9px] border rounded"
                                >
                                    {upgradeRoles.map(r => (
                                        <option key={r.id} value={r.name}>{r.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={entry.upgradeRate || ''}
                                    onChange={(e) => update('upgradeRate', e.target.value)}
                                    className="w-full text-[9px] border rounded"
                                />
                            </>
                        )}
                    </>

                ) : entry.isUpgraded ? (
                    <div className="text-[9px]">
                        <div className="font-bold">{entry.upgradeRole}</div>
                        <div>£{entry.upgradeRate}</div>
                    </div>
                ) : (
                    <span className="flex justify-center">
                        <Minus />
                    </span>
                )}
            </div>

            {/* 5️⃣ OVERVIEW */}
            <div className="p-1 border-r">
                <div className="grid grid-cols-4 gap-1">
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
            <div className="p-2 border-r">
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
            <div className="p-2">
                {isEditing ? (
                    <textarea
                        value={entry.notes || ''}
                        onChange={(e) => update('notes', e.target.value)}
                        className="w-full h-10 text-[9px] border rounded"
                    />
                ) : entry.notes ? (
                    <div className="text-[8px] line-clamp-3">{entry.notes}</div>
                ) : (
                    <span className="text-[8px] text-gray-300 italic">-</span>
                )}
            </div>

        </div>
    );
};

export default TimesheetDataRow;
