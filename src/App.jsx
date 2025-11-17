// src/App.tsx
import React, { Suspense } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import { Toaster } from '@/shared/components/ui/sonner';
import LoadingScreen from '@/shared/components/LoadingScreen';

const router = createBrowserRouter(AppRoutes);

function App() {
  return (
    <>
      <Suspense fallback={<LoadingScreen/>}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;