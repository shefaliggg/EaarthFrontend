import { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector }      from 'react-redux';
import { useParams, useNavigate }        from 'react-router-dom';
import { Search, Filter, ArrowUpDown }   from 'lucide-react';
import { toast }                         from 'sonner';

import { PageHeader }    from '@/shared/components/PageHeader';
import CrewTable         from '../components/CrewMangemant/CrewTable';
import OfferActionDialog from '../components/onboarding/OfferActionDialog';

import {
  getProjectOffersThunk,
  selectProjectOffers,
  selectListLoading,
  cloneOfferThunk,
} from '../../crew/store/offer.slice';

const FALLBACK_PROJECT_ID = '697c899668977a7ca2b27462';
const isObjectId          = (s) => /^[a-f\d]{24}$/i.test(String(s ?? ''));

const fmtDate = (d) => {
  if (!d) return '—';
  const date = new Date(String(d).split('T')[0] + 'T00:00:00');
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' });
};

export function offerToCrew(offer) {
  const name =
    offer.recipient?.fullName ||
    offer.recipient?.userId?.displayName ||
    '—';

  const jobTitle =
    offer.createOwnJobTitle && offer.newJobTitle
      ? offer.newJobTitle
      : offer.jobTitle || '—';

  const noticeDays = offer.noticePeriod || null;
  const camOT      = offer.cameraOTSWD || offer.cameraOTSCWD || offer.cameraOTCWD || null;
  const otherOT    = offer.otherOT || null;
  const unit       = offer.unit || 'Main';
  const siteText   =
    offer.regularSiteOfWork === 'on_set'  ? 'On set'  :
    offer.regularSiteOfWork === 'off_set' ? 'Off set' : '—';

  const hasTravel = offer.allowances?.some?.(
    (a) => (a.key === 'vehicle' || a.key === 'mileage' || a.key === 'fuel') && a.enabled
  ) || false;

  return {
    _id:        offer._id ?? offer.id ?? '',
    offerCode:  offer.offerCode || '',
    name,
    jobTitle,
    department: offer.department || 'OTHER',
    unit,
    siteText,
    hasTravel,
    camOT,
    otherOT,
    startDate:  offer.startDate ? String(offer.startDate).split('T')[0] : null,
    endDate:    offer.endDate   ? String(offer.endDate).split('T')[0]   : null,
    noticeDays,
    feePerDay:  offer.feePerDay,
    contractId: offer.contractId ? String(offer.contractId) : null,
    projectId:  offer.projectId  ? String(offer.projectId)  : null,
    status:     offer.status,
    email:      offer.recipient?.email || '',
  };
}

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

  useEffect(() => {
    dispatch(getProjectOffersThunk({ projectId: resolvedProjectId, filters: { status: 'COMPLETED' } }));
  }, [dispatch, resolvedProjectId]);

  const completedCrew = useMemo(
    () =>
      allOffers
        .filter((o) => {
          if (o.status !== 'COMPLETED') return false;
          if (!o.contractId)            return false;
          const name = o.recipient?.fullName?.trim() ?? '';
          if (!name || name.toUpperCase() === 'NEW RECIPIENT') return false;
          return true;
        })
        .map(offerToCrew),
    [allOffers]
  );

  const [searchQuery, setSearchQuery] = useState('');

  const filteredSorted = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return completedCrew.filter((c) =>
      !q ||
      c.name.toLowerCase().includes(q)       ||
      c.jobTitle.toLowerCase().includes(q)   ||
      c.department.toLowerCase().includes(q) ||
      c.offerCode.toLowerCase().includes(q)  ||
      c.email.toLowerCase().includes(q)
    );
  }, [searchQuery, completedCrew]);

  const grouped = useMemo(() => {
    const map = {};
    for (const crew of filteredSorted) {
      const dept = crew.department?.trim() || 'OTHER';
      if (!map[dept]) map[dept] = [];
      map[dept].push(crew);
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredSorted]);

  const [dialog,    setDialog   ] = useState(null);
  const [isCloning, setIsCloning] = useState(false);

  const openDialog  = (type, crew) => setDialog({ type, crew });
  const closeDialog = ()            => setDialog(null);

  const handleViewContract = (crew) => {
    if (!crew.contractId) { toast.error('No contract linked to this offer'); return; }
    navigate(`/projects/${proj}/offers/${crew._id}/view`);
  };

  // Navigate → ?openExtend=true → LayoutProductionAdmin auto-opens ExtendDialog
  // CrewIdentityHeader shows only "Extend Contract" button
  const handleExtendConfirm = (crew) => {
    closeDialog();
    navigate(`/projects/${proj}/offers/${crew._id}/view?openExtend=true`);
  };

  // Navigate → ?openEndContract=true → LayoutProductionAdmin auto-opens EndContractDialog
  // CrewIdentityHeader shows only "End Contract" button
  const handleEndContractConfirm = (crew) => {
    closeDialog();
    navigate(`/projects/${proj}/offers/${crew._id}/view?openEndContract=true`);
  };

  // Navigate → ?openVoidReplace=true → LayoutProductionAdmin auto-opens VoidAndReplaceDialog
  // CrewIdentityHeader shows only "Void & Replace" button
  const handleVoidAndReplaceConfirm = (crew) => {
    closeDialog();
    navigate(`/projects/${proj}/offers/${crew._id}/view?openVoidReplace=true`);
  };

  const handleCloneConfirm = async (crew) => {
    if (!crew._id) return;
    setIsCloning(true);
    toast.loading('Cloning offer…', { id: 'clone' });
    try {
      const result = await dispatch(cloneOfferThunk(crew._id));
      toast.dismiss('clone');
      if (!result.error && result.payload?._id) {
        toast.success("Offer cloned — fill in the new crew member's details");
        closeDialog();
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

  const handleDialogConfirm = (payload) => {
    if (!dialog) return;
    if (dialog.type === 'extendContract')  handleExtendConfirm(dialog.crew);
    if (dialog.type === 'cloneOffer')      handleCloneConfirm(dialog.crew);
    if (dialog.type === 'endContract')     handleEndContractConfirm(dialog.crew);
    if (dialog.type === 'voidAndReplace')  handleVoidAndReplaceConfirm(dialog.crew);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Crew Search" icon="Users" />

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-3 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text" placeholder="Search..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-400"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="w-3.5 h-3.5" />
          Filter
          <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <ArrowUpDown className="w-3.5 h-3.5" />
          Sort
          <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <CrewTable
        crew={filteredSorted}
        grouped={grouped}
        isLoading={isLoading}
        isEmpty={completedCrew.length === 0}
        onViewContract={handleViewContract}
        onExtend={(c)          => openDialog('extendContract', c)}
        onClone={(c)           => openDialog('cloneOffer', c)}
        onEndContract={(c)     => openDialog('endContract', c)}
        onVoidAndReplace={(c)  => openDialog('voidAndReplace', c)}
      />

      <OfferActionDialog
        type={dialog?.type}
        offer={dialog?.crew}
        open={!!dialog}
        onClose={closeDialog}
        onConfirm={handleDialogConfirm}
        isLoading={dialog?.type === 'cloneOffer' ? isCloning : false}
      />
    </div>
  );
}