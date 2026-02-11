// src/features/chat/pages/ProjectChat.jsx
// ✅ Main chat page - coordinates sidebar and chatbox with proper data fetching

import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { PageHeader } from "../../../../shared/components/PageHeader";
import ChatLeftSidebar from "../components/ChatLeftSidebar/ChatLeftSidebar";
import ChatBox from "../components/ChatBox/ChatBox";
import { getTabForConversationType } from "../utils/Chattypemapper";
import useChatStore from "../store/chat.store";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

function ProjectChat() {
  const [activeTab, setActiveTab] = useState("all");
  const location = useLocation();
  
  // Manual project ID input for testing
  const [manualProjectId, setManualProjectId] = useState("697c899668977a7ca2b27462");
  const [useManualProject, setUseManualProject] = useState(true);
  
  // Get current project and user from Redux
  const reduxProject = useSelector((state) => state.project?.currentProject);
  const authUser = useSelector((state) => state.auth?.user);
  const userUser = useSelector((state) => state.user?.currentUser);
  const currentUser = authUser || userUser;
  
  // Use manual project if enabled, otherwise use Redux project
  const currentProject = useManualProject 
    ? { _id: manualProjectId, projectName: "Test Project" }
    : reduxProject;
  
  // Zustand store
  const {
    selectedChat,
    setSelectedChat,
    loadConversations,
    setCurrentUserId,
    disconnectSocket,
    socketInitialized,
  } = useChatStore();

  // ✅ STEP 1: Set current user ID FIRST (this initializes socket)
  useEffect(() => {
    if (currentUser?._id) {
      console.log("🚀 STEP 1: Setting current user ID:", currentUser._id);
      setCurrentUserId(currentUser._id);
    }

    // Cleanup socket on unmount
    return () => {
      console.log("👋 Cleaning up socket connection");
      disconnectSocket();
    };
  }, [currentUser?._id, setCurrentUserId, disconnectSocket]);

  // ✅ STEP 2: Load conversations AFTER socket is initialized
  useEffect(() => {
    if (currentProject?._id && currentUser?._id && socketInitialized) {
      console.log("📡 STEP 2: Loading conversations:", { 
        projectId: currentProject._id, 
        tab: activeTab,
        socketInitialized
      });
      loadConversations(currentProject._id, activeTab);
    }
  }, [currentProject?._id, activeTab, currentUser?._id, socketInitialized, loadConversations]);

  // 🔥 Handle navigation from notifications
  useEffect(() => {
    if (location.state?.selectedChat) {
      const chatData = location.state.selectedChat;
      
      console.log("📬 Navigated from notification:", chatData);
      
      const tab = getTabForConversationType(chatData.type);
      setActiveTab(tab);
      setSelectedChat(chatData);

      // Clear location state
      window.history.replaceState({}, document.title);
    }
  }, [location.state, setSelectedChat]);

  const handleTabChange = useCallback((newTab) => {
    console.log("📑 Tab changed to:", newTab);
    setActiveTab(newTab);
    setSelectedChat(null);
  }, [setSelectedChat]);

  const handleChatSelect = useCallback((chat) => {
    console.log("💬 Chat selected:", chat);
    setSelectedChat(chat);
  }, [setSelectedChat]);

  // Show loading if socket not initialized
  if (!socketInitialized) {
    return (
      <div className="space-y-6 container mx-auto">
        <PageHeader icon="MessageSquare" title="Project Chat" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Connecting to Chat...</h2>
            <p className="text-muted-foreground">Initializing real-time connection</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto">
      <PageHeader icon="MessageSquare" title="Project Chat" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-[calc(100vh-200px)]">
        {/* Left Sidebar - Conversations List */}
        <div className="lg:col-span-1">
          <ChatLeftSidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            selectedChat={selectedChat}
            onChatSelect={handleChatSelect}
          />
        </div>

        {/* Right Side - Chat Area */}
        <div className="lg:col-span-3">
          <ChatBox selectedChat={selectedChat} />
        </div>
      </div>
    </div>
  );
}

export default ProjectChat;