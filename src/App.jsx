import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppRoutes from "@/routes/AppRoutes";
import { Toaster } from "@/shared/components/ui/sonner";
import CallModal from "./features/projects/project-chat/components/CallModal/CallModal";
import IncomingCallToast from "./features/projects/project-chat/components/CallModal/IncomingCallToast";

const router = createBrowserRouter(AppRoutes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        expand={false}
        richColors
        toastOptions={{
          style: {
            background: "var(--background)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          },
        }}
      />
      <CallModal />
      <IncomingCallToast />
    </>
  );
}

export default App;
