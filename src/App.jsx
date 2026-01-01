import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import { Toaster } from '@/shared/components/ui/sonner';

const router = createBrowserRouter(AppRoutes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;












