import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PageHeader } from "../../../../shared/components/PageHeader";
import ChatLeftSidebar from "../components/ChatLeftSidebar";
import ChatBox from "../components/ChatBox";
import VideoVoiceCommunication from "../components/VideoVoiceCommunication";
import CommingSoon from "../../../../shared/components/overlays/CommingSoon";
import { getTabForConversationType } from "../components/Chattypemapper";

function ProjectChat() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedChat, setSelectedChat] = useState(null);
  const location = useLocation();

  // 🔥 Handle navigation from notifications or external sources
  useEffect(() => {
    if (location.state?.selectedChat) {
      const chatData = location.state.selectedChat;

      console.log("📩 ProjectChat: Received chat data from location:", chatData);
      console.log("🔍 Chat type:", chatData.type);

      // ✅ Determine which tab to show based on chat type
      const tab = getTabForConversationType(chatData.type);
      
      console.log("📌 ProjectChat: Setting active tab to:", tab);

      // Set the correct tab
      setActiveTab(tab);

      // Set the selected chat
      setSelectedChat(chatData);

      // Clear the location state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleTabChange = (newTab) => {
    console.log("🔄 ProjectChat: Tab changed to:", newTab);
    setActiveTab(newTab);
    // Clear selection when switching tabs manually
    setSelectedChat(null);
  };

  const handleChatSelect = (chat) => {
    console.log("💬 ProjectChat: Chat selected:", chat);
    setSelectedChat(chat);
  };

  return (
    <div className='space-y-6 container mx-auto'>
      <PageHeader icon="MessageSquare" title="Project Chat" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Sidebar - Sticky */}
        <div className="lg:col-span-1">
          <ChatLeftSidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            selectedChat={selectedChat}
            onChatSelect={handleChatSelect}
          />
        </div>
        
        {/* Main Chat Area */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative">
            <VideoVoiceCommunication
              onMeetingNotes={() => console.log("Meeting Notes")}
              onTranscribe={() => console.log("Transcribe")}
              onVideoCall={() => console.log("Video Call")}
            />
            <CommingSoon />
          </div>

          <ChatBox selectedChat={selectedChat} />
        </div>
      </div>
    </div>
  );
}

export default ProjectChat;