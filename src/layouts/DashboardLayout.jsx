import { Outlet } from "react-router-dom";
import Header from "@/shared/components/header/Header";
import AiChatWidget from "../features/ai/components/AIChatWidget";
import SuspenseOutlet from "../shared/components/SuspenseOutlet";
import { Footer } from "../shared/components/Footer";

const DashboardLayout = () => {

  return (
    <div className="flex-1 min-h-screen">
      <Header />
      <div className="p-6 min-h-[calc(100svh-68px-68px)]">
        <SuspenseOutlet />
        <AiChatWidget />
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;











