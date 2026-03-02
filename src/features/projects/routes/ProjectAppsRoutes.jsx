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
    // ── Offers list ──────────────────────────────────────────────────────────
    { path: 'offers',              element: <MyOffer /> },

    // ── Create offer ─────────────────────────────────────────────────────────
    { path: 'offers/create',       element: <CreateOffer /> },
    { path: 'create/offers',       element: <CreateOfferDialog /> },
    { path: 'offers/create/bulk',  element: <BulkOfferCreate /> },

    // ── VIEW OFFER — single unified page for all roles ────────────────────────
    // Production Admin uses this to track status & take actions
    // Crew uses this to accept / request changes
    { path: 'offers/:id/view',              element: <ViewOffer /> },
    { path: 'offers/:id/review',            element: <ViewOffer /> },
    { path: 'offers/:id/production-check',  element: <ViewOffer /> },
    { path: 'offers/:id/accounts-check',    element: <ViewOffer /> },

    // ── Signing ───────────────────────────────────────────────────────────────
    { path: 'offers/:id/sign',     element: <ContractDocument /> },
    { path: 'offers/:id/contract', element: <ContractDocumentPage /> },

    // ── Edit ─────────────────────────────────────────────────────────────────
    { path: 'offers/:id/edit',     element: <EditOffer /> },
    { path: 'edit',                element: <EditOffer /> },

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