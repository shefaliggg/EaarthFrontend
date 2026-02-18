import { lazy } from 'react';
import ContractDetails from '../../contracts/pages/ContractDetails';

// Contract pages
const ContractList            = lazy(() => import('../../contracts/pages/ContractList'));
const ContractForm            = lazy(() => import('../../contracts/pages/ContractForm'));
const ContractPreview         = lazy(() => import('../../contracts/pages/ContractPreview'));
const DocumentDesignerStudio  = lazy(() => import('../../contracts/pages/Documentdesignerstudio'));

const ContractRoutes = {
  path: 'contractss',
  children: [
    {
      index: true,
      element: <ContractList />
    },
    {
      path: 'list',
      element: <ContractForm />
    },
    {
      path: ':id/edit',
      element: <ContractForm />
    },
    {
      path: ':id/preview',
      element: <ContractPreview />
    },
    {
      path: 'contract-details',   // ✅ navigate('../contract-details') from ContractForm
      element: <ContractDetails />
    },
    {
      path: 'designer',
      element: <DocumentDesignerStudio />
    }
  ],
};

export default ContractRoutes;