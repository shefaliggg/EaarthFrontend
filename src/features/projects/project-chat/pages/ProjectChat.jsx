import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { PageHeader } from "../../../../shared/components/PageHeader";
import ChatLeftSidebar from "../components/ChatLeftSidebar/ChatLeftSidebar";
import ChatBox from "../components/ChatBox/ChatBox";
import useChatStore, { DEFAULT_PROJECT_ID } from "../store/chat.store";

function ProjectChat() {
  const [activeTab, setActiveTab] = useState("all");
  const location = useLocation();

  const reduxProject = useSelector((state) => state.project?.currentProject);
  const authUser = useSelector((state) => state.auth?.user);
  const userUser = useSelector((state) => state.user?.currentUser);
  const currentUser = authUser || userUser;

  const currentProject =
    reduxProject || { _id: DEFAULT_PROJECT_ID, name: "Default Project" };

  const {
    setSelectedChat,
    loadConversations,
    attachSocketListeners,
  } = useChatStore();

  // Attach socket listeners once
  useEffect(() => {
    attachSocketListeners();
  }, []);

  // Load conversations when project changes
  useEffect(() => {
    if (currentProject?._id && currentUser?._id) {
      loadConversations(currentProject._id, activeTab);
    }
  }, [currentProject?._id, activeTab, currentUser?._id]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSelectedChat(null);
  };

  return (
    <div className="space-y-6 container mx-auto">
      <PageHeader icon="MessageSquare" title="Project Chat" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <ChatLeftSidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        <div className="lg:col-span-3">
          <ChatBox />
        </div>
      </div>
    </div>
  );
}


export default ProjectChat;