

import { useRef, useEffect, useState } from 'react';
import { Loader2, MoreVertical, Eye, CalendarDays, Copy, X } from 'lucide-react';
import CardWrapper from '@/shared/components/wrappers/CardWrapper';

// ─── Formatters ───────────────────────────────────────────────────────────────

export const fmtDate = (d) => {
  if (!d) return '—';
  const date = new Date(String(d).split('T')[0] + 'T00:00:00');
  return date.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: '2-digit',
  });
};

const fmtDateRange = (start, end) => {
  if (!start && !end) return '—';
  return `${fmtDate(start)} – ${fmtDate(end)}`;
};

const fmtCurrency = (val) => {
  if (val === null || val === undefined || val === '') return '—';
  const n = parseFloat(val);
  if (isNaN(n)) return '—';
  return Math.round(n).toLocaleString('en-GB');
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ name }) {
  const safe     = String(name || '?');
  const initials = safe.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
  const COLORS   = [
    'bg-violet-500', 'bg-blue-500',   'bg-emerald-500',
    'bg-rose-500',   'bg-amber-500',  'bg-indigo-500',
    'bg-teal-500',   'bg-fuchsia-500','bg-sky-500',
  ];
  const color = COLORS[safe.charCodeAt(0) % COLORS.length];
  return (
    <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-[11px] font-bold shrink-0 select-none`}>
      {initials}
    </div>
  );
}

// ─── OT cell — X icon when absent, value when present ────────────────────────

function OTCell({ value }) {
  if (!value || value === '—') {
    return (
      <div className="flex justify-center">
        <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
          <X className="w-3 h-3 text-gray-400" />
        </div>
      </div>
    );
  }
  return (
    <span className="text-[12px] text-gray-700 font-medium">
      {fmtCurrency(value)}
    </span>
  );
}

// ─── Three-dot action menu ────────────────────────────────────────────────────

function ActionMenu({ crew, onViewContract, onExtend, onClone }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const hasContract = !!crew.contractId;

  return (
    <div className="relative flex justify-center" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-52 rounded-xl shadow-xl border border-neutral-200 bg-white overflow-hidden">
          <button
            onClick={() => { setOpen(false); onViewContract(crew); }}
            disabled={!hasContract}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12px] text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Eye className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            View Contract
          </button>

          <div className="h-px bg-neutral-100 mx-2" />

          <button
            onClick={() => { setOpen(false); onExtend(crew); }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12px] text-neutral-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            <CalendarDays className="w-3.5 h-3.5 shrink-0" />
            Extend Contract
          </button>

          <button
            onClick={() => { setOpen(false); onClone(crew); }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12px] text-neutral-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
          >
            <Copy className="w-3.5 h-3.5 shrink-0" />
            Clone for New Crew
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Single crew row ──────────────────────────────────────────────────────────

function CrewRow({ crew, onViewContract, onExtend, onClone }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors">

      {/* Name / Job Title */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar name={crew.name} />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-gray-900 leading-tight truncate">
              {crew.name}
            </p>
            <p className="text-[11px] text-gray-500 leading-tight truncate">
              {crew.jobTitle}
            </p>
          </div>
        </div>
      </td>

      {/* Workplace — unit + site */}
      <td className="px-4 py-3">
        <p className="text-[12px] text-gray-700 leading-tight">{crew.unit || '—'}</p>
        <p className="text-[11px] text-gray-400 leading-tight">{crew.siteText || '—'}</p>
      </td>

      {/* Travel */}
      <td className="px-4 py-3 text-center">
        <div className="flex justify-center">
          {crew.hasTravel ? (
            <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center">
              <span className="text-emerald-600 text-[10px] font-bold leading-none">✓</span>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
              <X className="w-3 h-3 text-gray-400" />
            </div>
          )}
        </div>
      </td>

      {/* Cam O/T */}
      <td className="px-4 py-3 text-center">
        <OTCell value={crew.camOT} />
      </td>

      {/* Other O/T */}
      <td className="px-4 py-3 text-center">
        <OTCell value={crew.otherOT} />
      </td>

      {/* First Day */}
      <td className="px-4 py-3">
        <span className="text-[12px] text-gray-700 whitespace-nowrap">
          {fmtDate(crew.startDate)}
        </span>
      </td>

      {/* Contract Start & End */}
      <td className="px-4 py-3">
        <span className="text-[12px] text-gray-700 whitespace-nowrap">
          {fmtDateRange(crew.startDate, crew.endDate)}
        </span>
      </td>

      {/* Last Day */}
      <td className="px-4 py-3">
        <span className="text-[12px] text-gray-700 whitespace-nowrap">
          {fmtDate(crew.endDate)}
        </span>
      </td>

      {/* Notice */}
      <td className="px-4 py-3">
        <span className="text-[12px] text-gray-500 whitespace-nowrap">
          {crew.noticeDays ? `${crew.noticeDays} days` : '—'}
        </span>
      </td>

      {/* Daily rate */}
      <td className="px-4 py-3">
        <span className="text-[12px] font-semibold text-gray-800">
          {fmtCurrency(crew.feePerDay)}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <ActionMenu
          crew={crew}
          onViewContract={onViewContract}
          onExtend={onExtend}
          onClone={onClone}
        />
      </td>
    </tr>
  );
}

// ─── Column headers ───────────────────────────────────────────────────────────

const HEADERS = [
  { label: 'NAME / JOB TITLE',    center: false },
  { label: 'WORKPLACE',           center: false },
  { label: 'TRAVEL',              center: true  },
  { label: 'CAM O/T',             center: true  },
  { label: 'OTHER O/T',           center: true  },
  { label: 'FIRST DAY',           center: false },
  { label: 'CONTRACT START & END',center: false },
  { label: 'LAST DAY',            center: false },
  { label: 'NOTICE',              center: false },
  { label: 'DAILY',               center: false },
  { label: 'ACTIONS',             center: true  },
];


export default function CrewTable({
  crew = [],
  grouped = [],        // preferred — pre-grouped by department
  isLoading = false,
  isEmpty = false,
  onViewContract,
  onExtend,
  onClone,
}) {
  // Fallback: if parent doesn't group, group here
  const departments = grouped.length
    ? grouped
    : (() => {
        const map = {};
        for (const c of crew) {
          const d = c.department || 'OTHER';
          if (!map[d]) map[d] = [];
          map[d].push(c);
        }
        return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
      })();

  const totalCount = crew.length || departments.reduce((s, [, rows]) => s + rows.length, 0);

  return (
    <CardWrapper title={`Crew Members (${totalCount})`} icon="Users">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">

          {/* ── Header ── */}
          <thead>
            <tr className="border-b-2 border-gray-200 bg-white">
              {HEADERS.map(({ label, center }) => (
                <th
                  key={label}
                  className={`px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap ${
                    center ? 'text-center' : 'text-left'
                  }`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          {/* ── Body ── */}
          <tbody>
            {isLoading ? (
              /* Skeleton */
              <>
                <tr>
                  <td colSpan={11} className="px-4 py-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading crew…
                    </div>
                  </td>
                </tr>
              </>
            ) : departments.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-16 text-center text-gray-400 text-sm">
                  {isEmpty
                    ? 'No completed contracts found. Only fully signed contracts appear here.'
                    : 'No crew members match your search.'}
                </td>
              </tr>
            ) : (
              departments.map(([dept, rows]) => (
                <>
                  {/* Department label row */}
                  <tr key={`dept-${dept}`}>
                    <td
                      colSpan={11}
                      className="px-4 pt-4 pb-1.5 bg-white"
                    >
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {dept}
                      </span>
                    </td>
                  </tr>

                  {/* Crew rows */}
                  {rows.map((c) => (
                    <CrewRow
                      key={c._id}
                      crew={c}
                      onViewContract={onViewContract}
                      onExtend={onExtend}
                      onClone={onClone}
                    />
                  ))}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      {!isLoading && totalCount > 0 && (
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 mt-0">
          <span className="text-[11px] text-gray-400">
            {totalCount} completed contract{totalCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </CardWrapper>
  );
}