import { PageHeader } from "../../../../shared/components/PageHeader";
import ChatLeftSidebar from "../components/ChatLeftSidebar";
import TeamChatProduction from "../components/TeamChatProduction";
import VideoVoiceCommunication from "../components/VideoVoiceCommunication";

function ProjectChat() {
  return (
    <div className="space-y-6">
      <PageHeader icon="MessageSquare" title="Chat" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <ChatLeftSidebar />

        <div className="lg:col-span-3 space-y-6">
          <VideoVoiceCommunication
            onMeetingNotes={() => console.log("Meeting Notes")}
            onTranscribe={() => console.log("Transcribe")}
            onVideoCall={() => console.log("Video Call")}
          />

          <TeamChatProduction />
        </div>
      </div>
    </div>
  );
}

export default ProjectChat;
