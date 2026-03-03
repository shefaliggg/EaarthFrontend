import { lazy } from 'react';
import MyOffer from '../../crew/pages/Myoffer';
import ViewOffer from '../../crew/pages/ViewOffers';   // ← NEW

import Contracts from '../../crew/pages/Contracts';
import ContractDocument from '../../crew/pages/ContractDocument';
import ContractDocumentPage from '../../crew/pages/ContractDocumentPage';
import EditOffer from '../../crew/pages/EditOfferForm';
import CrewReview from '../../crew/pages/CrewReview';
import BulkOfferCreate from '../../crew/pages/BulkOfferCreate';
import CreateOfferDialog from '../../crew/components/CreateOfferDialog';
import CreateOffer from '../../crew/pages/CreateOffer';
import CrewSearch from '../pages/CrewSearch';
import CrewOnboarding from '../../crew/pages/CrewOnboarding';

const ProjectApps         = lazy(() => import('../pages/ProjectApps/ProjectApps'));
const ProjectAppCloud     = lazy(() => import('../pages/ProjectApps/ProjectAppCloud'));
const ProjectChat         = lazy(() => import('../project-chat/pages/ProjectChat'));
const NotFound            = lazy(() => import('@/shared/pages/NotFound'));

const ProjectAppsRoutes = {
    path: "",
    children: [
         { path: 'offers', element: <MyOffer /> },
        { path: 'offers/:id/view', element: <ViewOffer /> },
        { path: 'offers/create', element: <CreateOffer /> },
        { path: 'create/offers', element: <CreateOfferDialog /> },
        { path: 'offers/create/bulk', element: <BulkOfferCreate /> },
        // { path: 'offers/:id/review', element: <ViewOffer /> },
        { path: 'offers/:id/sign', element: <ContractDocument /> },
        { path: 'offers/:id/production-check', element: <ViewOffer /> },
        { path: 'offers/:id/accounts-check', element: <ViewOffer /> },
        
        { path: 'offers/:id/review', element: <CrewReview /> },
        { path: 'offers/:id/production-check', element: <CrewReview /> },
        { path: 'offers/:id/accounts-check', element: <CrewReview /> },
        
        // Legacy routes (keep for backwards compatibility)
        { path: 'viewoffers', element: <ViewOffer /> },
  
        { path: 'contracts', element: <Contracts /> },
        { path: 'contractdoc', element: <ContractDocument /> }, 
        { path: 'offers/:id/sign', element: <ContractDocumentPage /> },
        { path: 'offers/:id/contract', element: <ContractDocumentPage /> },
        { path: 'edit', element: <EditOffer /> },
        { path: 'offers/:id/edit', element: <EditOffer /> },

    // ── Other pages ───────────────────────────────────────────────────────────
    { path: 'contracts',           element: <Contracts /> },
    { path: 'contractdoc',         element: <ContractDocument /> },
    { path: 'onboarding',          element: <CrewOnboarding /> },
    { path: 'crew-search',         element: <CrewSearch /> },
    { path: 'cloud',               element: <ProjectAppCloud /> },
    { path: 'chat',                element: <ProjectChat /> },
  ],
};

export default ProjectAppsRoutes;