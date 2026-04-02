import { useState, useMemo, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Search, Shield, MoreVertical,
  Eye, CalendarDays, Copy, X, Loader2, AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

import CardWrapper    from '@/shared/components/wrappers/CardWrapper';
import { PageHeader } from '@/shared/components/PageHeader';

import {
  getProjectOffersThunk,
  selectProjectOffers,
  selectListLoading,
  cloneOfferThunk,
} from '../../crew/store/offer.slice';

// ─── helpers ──────────────────────────────────────────────────────────────────
const FALLBACK_PROJECT_ID = '697c899668977a7ca2b27462';
const isObjectId = (s) => /^[a-f\d]{24}$/i.test(String(s ?? ''));

const fmt = (d) =>
  d
    ? new Date(String(d).split('T')[0] + 'T00:00:00').toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : '—';

function offerToCrew(offer) {
  const id   = offer._id ?? offer.id ?? '';
  const name =
    offer.recipient?.fullName ||
    offer.recipient?.userId?.displayName ||
    offer.fullName || '—';
  const email =
    offer.recipient?.email ||
    offer.recipient?.userId?.email ||
    offer.email || '';
  const phone =
    offer.recipient?.mobileNumber ||
    offer.recipient?.phone || '';
  const jobTitle =
    offer.createOwnJobTitle && offer.newJobTitle
      ? offer.newJobTitle
      : offer.jobTitle || '—';

  return {
    _id:        id,
    offerCode:  offer.offerCode || '',
    name,
    email,
    phone,
    role:       jobTitle,
    department: offer.department || '',
    contract:   offer.dailyOrWeekly
      ? offer.dailyOrWeekly.charAt(0).toUpperCase() + offer.dailyOrWeekly.slice(1)
      : '—',
    status:     offer.status,
    startDate:  offer.startDate  ? String(offer.startDate).split('T')[0]  : null,
    endDate:    offer.endDate    ? String(offer.endDate).split('T')[0]    : null,
    contractId: offer.contractId ? String(offer.contractId)               : null,
    projectId:  offer.projectId  ? String(offer.projectId)                : null,
    protection: offer.protection ?? false,
  };
}

// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_MAP = {
  DRAFT:                    { label: 'Draft',                cls: 'bg-neutral-100 text-neutral-500 border-neutral-200' },
  SENT_TO_CREW:             { label: 'Sent to Crew',         cls: 'bg-amber-50 text-amber-600 border-amber-200'        },
  NEEDS_REVISION:           { label: 'Needs Revision',       cls: 'bg-orange-50 text-orange-600 border-orange-200'     },
  CREW_ACCEPTED:            { label: 'Crew Accepted',        cls: 'bg-blue-50 text-blue-600 border-blue-200'           },
  PRODUCTION_CHECK:         { label: 'Production Check',     cls: 'bg-violet-50 text-violet-600 border-violet-200'     },
  ACCOUNTS_CHECK:           { label: 'Accounts Check',       cls: 'bg-indigo-50 text-indigo-600 border-indigo-200'     },
  PENDING_CREW_SIGNATURE:   { label: 'Awaiting Signature',   cls: 'bg-purple-50 text-purple-600 border-purple-200'     },
  PENDING_UPM_SIGNATURE:    { label: 'Awaiting UPM Sign',    cls: 'bg-purple-50 text-purple-600 border-purple-200'     },
  PENDING_FC_SIGNATURE:     { label: 'Awaiting FC Sign',     cls: 'bg-purple-50 text-purple-600 border-purple-200'     },
  PENDING_STUDIO_SIGNATURE: { label: 'Awaiting Studio Sign', cls: 'bg-purple-50 text-purple-600 border-purple-200'     },
  COMPLETED:                { label: 'Completed',            cls: 'bg-emerald-50 text-emerald-600 border-emerald-200'  },
  CANCELLED:                { label: 'Cancelled',            cls: 'bg-red-50 text-red-500 border-red-200'              },
};

function StatusBadge({ status }) {
  const cfg = STATUS_MAP[status] ?? { label: status, cls: 'bg-neutral-100 text-neutral-500 border-neutral-200' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

// ─── Extend Confirmation Dialog ───────────────────────────────────────────────
function ExtendConfirmDialog({ crew, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-sm mx-4 rounded-2xl shadow-2xl overflow-hidden bg-white animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between bg-blue-600">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-white">Extend Contract</h2>
              <p className="text-[10px] text-blue-200 mt-0.5">{crew?.offerCode}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-4">
          <p className="text-[13px] text-neutral-700 leading-relaxed">
            You're about to extend the contract for{' '}
            <strong className="text-neutral-900">{crew?.name}</strong>{' '}
            ({crew?.role}).
          </p>

          {/* Current end date info */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-2.5 flex items-center gap-2.5">
            <CalendarDays className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">Current End Date</p>
              <p className="text-[12px] text-blue-800 font-semibold mt-0.5">{fmt(crew?.endDate)}</p>
            </div>
          </div>

          {/* Note */}
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-700 leading-relaxed">
              You'll be taken to the contract page where you can set the new end date and add notes before confirming the extension.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-neutral-200 text-neutral-700 text-[13px] font-semibold hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(crew)}
            className="flex-1 h-11 rounded-xl bg-blue-600 text-white text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <CalendarDays className="w-4 h-4" />
            Go to Contract
          </button>
        </div>
      </div>
    </div>
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
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
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

// ─── Clone dialog ─────────────────────────────────────────────────────────────
function CloneDialog({ crew, onClose, onConfirm, isLoading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-sm mx-4 rounded-2xl shadow-2xl overflow-hidden bg-white">
        <div className="px-5 py-4 flex items-center justify-between bg-violet-600">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Copy className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-white">Clone Offer</h2>
              <p className="text-[10px] text-violet-200 mt-0.5">{crew?.offerCode}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-5 py-4 space-y-3">
          <p className="text-[13px] text-neutral-700">
            Clone <strong>{crew?.name}'s</strong> offer ({crew?.role}) into a new Draft with the same terms — recipient cleared for a new crew member.
          </p>
          <div className="rounded-lg bg-violet-50 border border-violet-200 px-3 py-2.5 space-y-1">
            <p className="text-[10px] font-bold text-violet-700 uppercase tracking-wide">What gets copied</p>
            <p className="text-[11px] text-violet-600">Rates · Allowances · Schedule · Stipulations · Contract type</p>
          </div>
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
            <p className="text-[11px] text-amber-700">Recipient details will be blank — fill them in before sending.</p>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} disabled={isLoading}
            className="flex-1 h-11 rounded-xl border border-neutral-200 text-neutral-700 text-[13px] font-semibold hover:bg-neutral-50 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={() => onConfirm(crew)} disabled={isLoading}
            className="flex-1 h-11 rounded-xl bg-violet-600 text-white text-[13px] font-semibold flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-violet-700 transition-colors">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
            Clone Offer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── View Contract modal ──────────────────────────────────────────────────────
function ViewContractModal({ crew, onClose }) {
  if (!crew) return null;
  const rows = [
    { label: 'Offer Code',  value: crew.offerCode || '—' },
    { label: 'Contract ID', value: crew.contractId || '—' },
    { label: 'Email',       value: crew.email || '—' },
    { label: 'Phone',       value: crew.phone || '—' },
    { label: 'Department',  value: crew.department || '—' },
    { label: 'Role',        value: crew.role || '—' },
    { label: 'Contract',    value: crew.contract || '—' },
    { label: 'Start Date',  value: fmt(crew.startDate) },
    { label: 'End Date',    value: fmt(crew.endDate) },
    { label: 'Status',      isStatus: true },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 rounded-2xl shadow-2xl overflow-hidden bg-white">
        <div className="px-5 py-4 flex items-center justify-between bg-teal-600">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-[13px] font-bold select-none">
              {crew.name.trim().split(/\s+/).slice(0,2).map((w)=>w[0]?.toUpperCase()).join('')}
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-white">{crew.name}</h2>
              <p className="text-[10px] text-teal-200 mt-0.5">{crew.role} · {crew.department}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-5 py-4 space-y-2 max-h-[70vh] overflow-y-auto">
          {rows.map(({ label, value, isStatus }) => (
            <div key={label} className="flex items-center justify-between py-1.5 border-b border-neutral-100 last:border-0">
              <span className="text-[11px] text-neutral-500 font-medium">{label}</span>
              {isStatus
                ? <StatusBadge status={crew.status} />
                : <span className="text-[12px] text-neutral-800 font-medium text-right max-w-[55%] truncate">{value}</span>
              }
            </div>
          ))}
        </div>
        <div className="px-5 pb-5 pt-2">
          <button onClick={onClose}
            className="w-full h-10 rounded-xl border border-neutral-200 text-neutral-700 text-[13px] font-semibold hover:bg-neutral-50 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CrewSearch() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params   = useParams();

  const resolvedProjectId = useMemo(() => {
    if (isObjectId(params.projectId)) return params.projectId;
    if (isObjectId(params.id))        return params.id;
    return FALLBACK_PROJECT_ID;
  }, [params]);

  const proj = params.projectName ?? params.projectId ?? 'demo-project';

  const allOffers = useSelector(selectProjectOffers);
  const isLoading = useSelector(selectListLoading);

  // Only COMPLETED offers = crew with fully signed contracts
  const completedCrew = useMemo(
    () => allOffers.filter((o) => o.status === 'COMPLETED').map(offerToCrew),
    [allOffers]
  );

  useEffect(() => {
    dispatch(getProjectOffersThunk({ projectId: resolvedProjectId }));
  }, [dispatch, resolvedProjectId]);

  const [searchQuery,        setSearchQuery       ] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [cloneTarget,        setCloneTarget       ] = useState(null);
  const [viewTarget,         setViewTarget        ] = useState(null);
  const [extendTarget,       setExtendTarget      ] = useState(null); // confirm popup
  const [isCloning,          setIsCloning         ] = useState(false);

  const departments = useMemo(
    () => ['All Departments', ...new Set(completedCrew.map((c) => c.department).filter(Boolean))],
    [completedCrew]
  );

  const filteredCrew = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return completedCrew.filter((crew) => {
      const matchesSearch =
        crew.name.toLowerCase().includes(q)      ||
        crew.role.toLowerCase().includes(q)      ||
        crew.offerCode.toLowerCase().includes(q) ||
        crew.email.toLowerCase().includes(q);
      const matchesDept =
        selectedDepartment === 'All Departments' || crew.department === selectedDepartment;
      return matchesSearch && matchesDept;
    });
  }, [searchQuery, selectedDepartment, completedCrew]);

  // ── Extend → show confirmation popup, then navigate to contract view ───────
  // The actual date input + submission lives in LayoutProductionAdmin.
  // We pass ?openExtend=true so that page auto-opens the ExtendDialog.
  const handleExtendConfirm = (crew) => {
    setExtendTarget(null);
    navigate(`/projects/${proj}/offers/${crew._id}/view?openExtend=true`);
  };

  // ── Clone ──────────────────────────────────────────────────────────────────
  const handleCloneConfirm = async (crew) => {
    if (!crew._id) return;
    setIsCloning(true);
    toast.loading('Cloning offer…', { id: 'clone' });
    try {
      const result = await dispatch(cloneOfferThunk(crew._id));
      toast.dismiss('clone');
      if (!result.error && result.payload?._id) {
        toast.success('Offer cloned — fill in the new crew member\'s details');
        setCloneTarget(null);
        navigate(`/projects/${proj}/offers/${result.payload._id}/edit`);
      } else {
        toast.error(result.payload?.message || 'Failed to clone offer');
      }
    } catch (err) {
      toast.dismiss('clone');
      toast.error(err.message || 'Failed to clone offer');
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Crew Management" icon="Users" />

      {/* Search bar */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, role, offer code or email…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>
      </div>

      {/* Department filter */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedDepartment === dept
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <CardWrapper title={`Crew Members (${filteredCrew.length})`} icon="Users">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                {['Crew Member','Role','Department','Contract','Dates','Status','Protection','Actions'].map((h) => (
                  <th key={h}
                    className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600 ${h === 'Actions' ? 'text-center' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading crew…
                    </div>
                  </td>
                </tr>
              ) : filteredCrew.length > 0 ? (
                filteredCrew.map((crew) => (
                  <tr key={crew._id} className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-[10px] font-bold text-violet-700 shrink-0 select-none">
                          {crew.name.trim().split(/\s+/).slice(0,2).map((w)=>w[0]?.toUpperCase()).join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-gray-900 leading-tight truncate">{crew.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{crew.offerCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-gray-700">{crew.role}</td>
                    <td className="px-4 py-3 text-[12px] text-gray-700">{crew.department}</td>
                    <td className="px-4 py-3 text-[12px] text-gray-700">{crew.contract}</td>
                    <td className="px-4 py-3">
                      <div className="text-[11px] text-gray-600 space-y-0.5">
                        <p><span className="text-gray-400">Start:</span> {fmt(crew.startDate)}</p>
                        <p><span className="text-gray-400">End:</span> {fmt(crew.endDate)}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={crew.status} /></td>
                    <td className="px-4 py-3">
                      {crew.protection ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <Shield className="w-2.5 h-2.5" /> Protected
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <ActionMenu
                        crew={crew}
                        onViewContract={setViewTarget}
                        onExtend={setExtendTarget}
                        onClone={setCloneTarget}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-10 text-center text-gray-400 text-sm">
                    {completedCrew.length === 0
                      ? 'No completed contracts found for this project.'
                      : 'No crew members match your search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardWrapper>

      {viewTarget && <ViewContractModal crew={viewTarget} onClose={() => setViewTarget(null)} />}

      {cloneTarget && (
        <CloneDialog
          crew={cloneTarget}
          onClose={() => setCloneTarget(null)}
          onConfirm={handleCloneConfirm}
          isLoading={isCloning}
        />
      )}

      {/* Extend confirmation — lightweight popup before navigating */}
      {extendTarget && (
        <ExtendConfirmDialog
          crew={extendTarget}
          onClose={() => setExtendTarget(null)}
          onConfirm={handleExtendConfirm}
        />
      )}
    </div>
  );
}