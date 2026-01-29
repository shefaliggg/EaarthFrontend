import React, { useState } from "react";
import { PageHeader } from "../../../../shared/components/PageHeader";
import ChatLeftSidebar from "../components/ChatLeftSidebar";
import ChatBox from "../components/ChatBox";
import VideoVoiceCommunication from "../components/VideoVoiceCommunication";
import CommingSoon from "../../../../shared/components/overlays/CommingSoon";
import CardWrapper from "../../../../shared/components/wrappers/CardWrapper";
import { Button } from "../../../../shared/components/ui/button";
import { Hash } from "lucide-react";

function ProjectChat() {
  const [activeTab, setActiveTab] = useState("team");
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className='space-y-6 container mx-auto'>
      <PageHeader icon="MessageSquare" title="Project Chat" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Sidebar - Sticky */}
        <div className="lg:col-span-1">
          
          <ChatLeftSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            selectedChat={selectedChat}
            onChatSelect={setSelectedChat}
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