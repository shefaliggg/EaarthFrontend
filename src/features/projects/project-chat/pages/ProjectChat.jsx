import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { PageHeader } from "../../../../shared/components/PageHeader";
import ChatLeftSidebar from "../components/ChatLeftSidebar";
import ChatBox from "../components/ChatBox";
import VideoVoiceCommunication from "../components/VideoVoiceCommunication";
import CommingSoon from "../../../../shared/components/overlays/CommingSoon";
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
  const reduxProject = useSelector((state) => state.project.currentProject);
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
      console.log("🚀 STEP 1: Setting current user ID and initializing socket:", currentUser._id);
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
    // Wait for both user ID and project to be available
    // AND wait for socket to be initialized
    if (currentProject?._id && currentUser?._id && socketInitialized) {
      console.log("📡 STEP 2: Socket initialized, loading conversations:", { 
        projectId: currentProject._id, 
        tab: activeTab,
        userId: currentUser._id,
        socketInitialized
      });
      loadConversations(currentProject._id, activeTab);
    } else {
      console.log("⏳ Waiting for initialization:", {
        hasProject: !!currentProject?._id,
        hasUser: !!currentUser?._id,
        socketInitialized
      });
    }
  }, [currentProject?._id, activeTab, currentUser?._id, socketInitialized, loadConversations]);

  // 🔥 Handle navigation from notifications or external sources
  useEffect(() => {
    if (location.state?.selectedChat) {
      const chatData = location.state.selectedChat;
      
      console.log("📬 Navigated from notification:", chatData);
      console.log("🔍 Chat type:", chatData.type);
      
      // ✅ Determine which tab to show based on chat type
      const tab = getTabForConversationType(chatData.type);
      
      console.log("📌 ProjectChat: Setting active tab to:", tab);
      
      // Set the correct tab
      setActiveTab(tab);
      
      // Set the selected chat
      setSelectedChat(chatData);

      // Clear location state to prevent re-triggering
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

  const handleManualProjectSubmit = () => {
    if (manualProjectId.trim()) {
      setUseManualProject(true);
      console.log("✅ Using manual project ID:", manualProjectId);
    }
  };

  // Show project selector if no project
  if (!currentProject?._id) {
    return (
      <div className="space-y-6 container mx-auto">
        <PageHeader icon="MessageSquare" title="Project Chat" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-lg w-full p-8">
            <div className="text-6xl mb-6">💬</div>
            <h2 className="text-2xl font-semibold mb-2">Select a Project</h2>
            <p className="text-muted-foreground mb-6">
              Enter a project ID to start chatting
            </p>
            
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project ID</label>
                <Input
                  value={manualProjectId}
                  onChange={(e) => setManualProjectId(e.target.value)}
                  placeholder="Enter project ID"
                  className="font-mono text-sm"
                />
              </div>
              
              <Button 
                onClick={handleManualProjectSubmit}
                className="w-full"
                disabled={!manualProjectId.trim()}
              >
                Start Chat
              </Button>
              
              <div className="text-xs text-muted-foreground text-left bg-muted p-3 rounded">
                <p className="font-semibold mb-1">💡 Default Test Project ID:</p>
                <code className="block bg-background p-2 rounded mt-1">
                  697c899668977a7ca2b27462
                </code>
              </div>
            </div>

            <div className="mt-6 bg-muted p-4 rounded-lg text-left text-sm">
              <p className="font-semibold mb-2">🔍 Debug Info:</p>
              <pre className="text-xs overflow-auto">
                {JSON.stringify({
                  hasReduxProject: !!reduxProject,
                  hasUser: !!currentUser,
                  userId: currentUser?._id,
                  manualProjectId: manualProjectId
                }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading if no user
  if (!currentUser?._id) {
    return (
      <div className="space-y-6 container mx-auto">
        <PageHeader icon="MessageSquare" title="Project Chat" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Loading User...</h2>
            <p className="text-muted-foreground">Please wait while we load your profile</p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading if socket not initialized yet
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

      {/* Status Banner */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <span className="text-lg">✅</span>
            <div>
              <strong>Connected:</strong> {currentProject.projectName} | User: {currentUser._id} | Socket: {socketInitialized ? "✓" : "✗"}
            </div>
          </div>
          
          {useManualProject && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setUseManualProject(false);
                setSelectedChat(null);
              }}
            >
              Change Project
            </Button>
          )}
        </div>
      </div>

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

        {/* Right Side - Chat Area with Video/Voice Communication */}
        <div className="lg:col-span-3 space-y-4">
          {/* Video/Voice Communication Component */}
          <div className="relative">
            <VideoVoiceCommunication
              onMeetingNotes={() => console.log("Meeting Notes")}
              onTranscribe={() => console.log("Transcribe")}
              onVideoCall={() => console.log("Video Call")}
            />
            <CommingSoon />
          </div>

          {/* Chat Box */}
          <ChatBox selectedChat={selectedChat} />
        </div>
      </div>
    </div>
  );
}

export default ProjectChat;