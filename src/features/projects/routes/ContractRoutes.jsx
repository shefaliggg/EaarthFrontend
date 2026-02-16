import { lazy } from 'react';

// Contract pages
const ContractList = lazy(() => import('../../contracts/pages/ContractList'));
const ContractForm = lazy(() => import('../../contracts/pages/ContractForm'));
const ContractPreview = lazy(() => import('../../contracts/pages/ContractPreview'));
const DocumentDesignerStudio = lazy(() => import('../../contracts/pages/Documentdesignerstudio'));

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
      path: 'designer',
      element: <DocumentDesignerStudio />
    }
  ],
};

export default ContractRoutes;