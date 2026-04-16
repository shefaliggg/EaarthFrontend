import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppRoutes from "@/routes/AppRoutes";
import { Toaster } from "@/shared/components/ui/sonner";
import CallModal from "./features/projects/project-chat/components/call-modal/CallModal";
import IncomingCallToast from "./features/projects/project-chat/components/call-modal/IncomingCallToast";

const router = createBrowserRouter(AppRoutes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        expand={true}
        visibleToasts={5}
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
