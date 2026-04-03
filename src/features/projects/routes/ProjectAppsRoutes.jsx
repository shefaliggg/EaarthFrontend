import { lazy } from 'react';

import MyOffer              from '../../crew/pages/Myoffer';
import ViewOffer            from '../../crew/pages/ViewOffers';
import Contracts            from '../../crew/pages/Contracts';
import ContractDocument     from '../../crew/pages/ContractDocument';
import ContractDocumentPage from '../../crew/pages/ContractDocumentPage';
import EditOffer            from '../../crew/pages/EditOfferForm';
import CrewReview           from '../../crew/pages/CrewReview';
import BulkOfferCreate      from '../../crew/pages/BulkOfferCreate';
import CreateOfferDialog    from '../../crew/components/CreateOfferDialog';
import CreateOffer          from '../../crew/pages/CreateOffer';
import CrewSearch           from '../../crew/pages/CrewSearch';
import CrewOnboarding       from '../../crew/pages/CrewOnboarding';
// import ProductionReview from '../../crew/components/roleActions/ProductionAdminActions/ProductionReview';


const ProjectAppCloud = lazy(() => import('../pages/ProjectApps/ProjectAppCloud'));
const ProjectChat     = lazy(() => import('../project-chat/pages/ProjectChat'));
const NotFound        = lazy(() => import('@/shared/pages/NotFound'));

const ProjectAppsRoutes = {
  path: "",
  children: [

    // ── Offers ────────────────────────────────────────────────────────────────
    { path: 'offers',                        element: <MyOffer /> },
    { path: 'offers/create',                 element: <CreateOffer /> },
    { path: 'offers/:id/edit',               element: <CreateOffer /> },
    { path: 'offers/create/bulk',            element: <BulkOfferCreate /> },
    { path: 'create/offers',                 element: <CreateOfferDialog /> },
    { path: 'offers/:id/view',               element: <ViewOffer /> },
    // { path: 'offers/:id/edit',               element: <EditOffer /> },
    { path: 'offers/:id/review',             element: <CrewReview /> },
    // { path: 'offers/:id/production-review',  element: <ProductionReview/> },
    { path: 'offers/:id/sign',               element: <ContractDocumentPage /> },
    { path: 'offers/:id/contract',           element: <ContractDocumentPage /> },

    // ── Contracts ─────────────────────────────────────────────────────────────
    { path: 'contracts',                     element: <Contracts /> },
    { path: 'contractdoc',                   element: <ContractDocument /> },

    // ── Other ─────────────────────────────────────────────────────────────────
    { path: 'onboarding',                    element: <CrewOnboarding /> },
    { path: 'crew-search',                   element: <CrewSearch /> },
    { path: 'cloud',                         element: <ProjectAppCloud /> },
    { path: 'chat',                          element: <ProjectChat /> },

  ],
};

export default ProjectAppsRoutes;