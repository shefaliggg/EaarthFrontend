import { lazy } from 'react';
import MyOffer from '../../crew/pages/Myoffer';
// import ViewOffer from '../../crew/pages/ViewOffers';

import Contracts from '../../crew/pages/Contracts';
import ContractDocument from '../../crew/pages/ContractDocument';
import ContractDocumentPage from '../../crew/pages/ContractDocumentPage';
import EditOffer from '../../crew/pages/EditOfferForm';
import CrewReview from '../../crew/pages/CrewReview';
import BulkOfferCreate from '../../crew/pages/BulkOfferCreate';
import CreateOfferDialog from '../../crew/components/CreateOfferDialog';
import CreateOffer from '../../crew/pages/CreateOffer';
import CrewSearch from '../pages/CrewSearch';


// import ContractDocumentPage from '../../crew/pages/ContractDocumentPage';
// import ContractDocumentPage from '../../crew/pages/ContractDocumentPage';

const ProjectApps = lazy(() => import('../pages/ProjectApps/ProjectApps'));
const ProjectAppProps = lazy(() => import('../pages/ProjectApps/ProjectAppProps'));
const ProjectAppCostume = lazy(() => import('../pages/ProjectApps/ProjectAppCostume'));
const ProjectAppCatering = lazy(() => import('../pages/ProjectApps/ProjectAppCatering'));
const ProjectAppAccounts = lazy(() => import('../pages/ProjectApps/ProjectAppAccounts'));
const ProjectAppScript = lazy(() => import('../pages/ProjectApps/ProjectAppScript'));
const ProjectAppMarket = lazy(() => import('../pages/ProjectApps/ProjectAppMarket'));
const ProjectAppStocks = lazy(() => import('../pages/ProjectApps/ProjectAppStocks'));
const ProjectAppTransport = lazy(() => import('../pages/ProjectApps/ProjectAppTransport'));
const ProjectAppEPlayer = lazy(() => import('../pages/ProjectApps/ProjectAppEPlayer'));
const ProjectAppForms = lazy(() => import('../pages/ProjectApps/ProjectAppForms'));
const ProjectAppAnimals = lazy(() => import('../pages/ProjectApps/ProjectAppAnimals'));
const ProjectAppVehicles = lazy(() => import('../pages/ProjectApps/ProjectAppVehicles'));
const ProjectAppLocations = lazy(() => import('../pages/ProjectApps/ProjectAppLocations'));
const ProjectAppApproval = lazy(() => import('../pages/ProjectApps/ProjectAppApproval'));
const ProjectOnboarding = lazy(() => import('../pages/ProjectApps/ProjectOnboarding'));
const ProjectChat = lazy(() => import('../project-chat/pages/ProjectChat'));
const ProjectAppCloud = lazy(() => import('../pages/ProjectApps/ProjectAppCloud'));

const NotFound = lazy(() => import('@/shared/pages/NotFound'));

const ProjectAppsRoutes = {
    path: "",
    children: [
        // { path: 'props', element: <ProjectAppProps /> },
        // { path: 'costume', element: <ProjectAppCostume /> },
        // { path: 'catering', element: <ProjectAppCatering /> },
        // { path: 'accounts', element: <ProjectAppAccounts /> },
        // { path: 'script', element: <ProjectAppScript /> },
        // { path: 'market', element: <ProjectAppMarket /> },
        // { path: 'stocks', element: <ProjectAppStocks /> },
        // { path: 'transport', element: <ProjectAppTransport /> },
        // { path: 'e-player', element: <ProjectAppEPlayer /> },
        // { path: 'forms', element: <ProjectAppForms /> },
        // { path: 'animals', element: <ProjectAppAnimals /> },
        // { path: 'vehicles', element: <ProjectAppVehicles /> },
        // { path: 'locations', element: <ProjectAppLocations /> },
        // { path: 'approval', element: <ProjectAppApproval /> },
         { path: 'offers', element: <MyOffer /> },
        // { path: 'offers/:id/view', element: <ViewOffer /> },
        { path: 'offers/create', element: <CreateOffer /> },
        { path: 'create/offers', element: <CreateOfferDialog /> },
        { path: 'offers/create/bulk', element: <BulkOfferCreate /> },
        // { path: 'offers/:id/review', element: <ViewOffer /> },
        { path: 'offers/:id/sign', element: <ContractDocument /> },
        // { path: 'offers/:id/production-check', element: <ViewOffer /> },
        // { path: 'offers/:id/accounts-check', element: <ViewOffer /> },
        
        { path: 'offers/:id/review', element: <CrewReview /> },
        { path: 'offers/:id/production-check', element: <CrewReview /> },
        { path: 'offers/:id/accounts-check', element: <CrewReview /> },
        
        // Legacy routes (keep for backwards compatibility)
        // { path: 'viewoffers', element: <ViewOffer /> },
  
        { path: 'contracts', element: <Contracts /> },
        { path: 'contractdoc', element: <ContractDocument /> }, 
        { path: 'offers/:id/sign', element: <ContractDocumentPage /> },
        { path: 'offers/:id/contract', element: <ContractDocumentPage /> },
        { path: 'edit', element: <EditOffer /> },
        { path: 'offers/:id/edit', element: <EditOffer /> },

        
        // Other app routes
        { path: 'onboarding', element: <ProjectOnboarding /> },
        { path: 'crew-search', element: <CrewSearch /> },
        { path: 'cloud', element: <ProjectAppCloud /> },
        { path: 'chat', element: <ProjectChat /> },

    ],
};

export default ProjectAppsRoutes;











