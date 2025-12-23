import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/shared/components/PageHeader";
import { RecentTickets } from "../components/RecentTickets";
import { TicketDetail } from "../components/TicketDetail";
import SupportTicketModal from "../components/SupportTicketModal";
import { getSupportTickets, getSupportTicketById, addTicketMessage } from "../service/supportService";

export default function SupportDashboard() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendingReply, setSendingReply] = useState(false);

  // Transform ticket data from API format to UI format
  const transformTicket = (ticket) => ({
    id: ticket.ticketID || ticket._id,
    _id: ticket._id,
    ticketID: ticket.ticketID,
    subject: ticket.subject,
    description: ticket.initialDescription,
    status: ticket.status,
    priority: ticket.priority,
    category: ticket.category,
    created: new Date(ticket.createdAt),
    updated: new Date(ticket.updatedAt),
    assignedTo: ticket.assignedTo?.name || null,
    responses: ticket.messages?.map(msg => ({
      id: msg._id,
      author: msg.senderName || 'Unknown',
      role: msg.sender === 'user' ? 'user' : 'support',
      message: msg.content,
      timestamp: new Date(msg.createdAt),
      attachments: msg.attachments?.map(att => ({
        fileName: att.fileName,
        fileSize: att.fileSize,
        fileType: att.fileType,
        fileUrl: att.downloadUrl || att.fileUrl,
      })) || [],
    })) || [],
    attachments: ticket.attachments || [],
  });

  // Fetch tickets from API
  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSupportTickets();
      
      if (response.success) {
        const transformedTickets = response.data.map(transformTicket);
        
        setTickets(transformedTickets);
        
        // Auto-select first ticket if none selected and fetch its full details
        if (!selectedTicket && transformedTickets.length > 0) {
          // Fetch full ticket details including messages
          const ticketDetails = await getSupportTicketById(transformedTickets[0]._id);
          if (ticketDetails.success) {
            setSelectedTicket(transformTicket(ticketDetails.data));
          } else {
            setSelectedTicket(transformedTickets[0]);
          }
        } else if (selectedTicket) {
          // Update selected ticket with fresh data after reload
          const updatedTicket = transformedTickets.find(
            t => t._id === selectedTicket._id || t.id === selectedTicket.id
          );
          if (updatedTicket) {
            setSelectedTicket(updatedTicket);
          }
        }
      }
    } catch (err) {
      console.error('Error loading tickets:', err);
      setError(err.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  // Reload only the selected ticket's messages (not the full ticket list)
  const reloadTicketMessages = async () => {
    if (!selectedTicket?._id) return;
    
    try {
      const response = await getSupportTicketById(selectedTicket._id);
      if (response.success) {
        const updatedTicket = transformTicket(response.data);
        setSelectedTicket(updatedTicket);
        
        // Also update in tickets list
        setTickets(prev => prev.map(t => 
          t._id === updatedTicket._id ? updatedTicket : t
        ));
      }
    } catch (err) {
      console.error('Error reloading ticket:', err);
    }
  };

  // Load tickets on mount
  useEffect(() => {
    loadTickets();
  }, []);

  // Handle ticket selection - fetch full details including messages
  const handleSelectTicket = async (ticket) => {
    try {
      const response = await getSupportTicketById(ticket._id);
      if (response.success) {
        setSelectedTicket(transformTicket(response.data));
      } else {
        setSelectedTicket(ticket);
      }
    } catch (err) {
      console.error('Error fetching ticket details:', err);
      setSelectedTicket(ticket);
    }
  };

  // Handlers
  const handleSendReply = async (message, attachments = [], voiceNote = null) => {
    if (!selectedTicket?._id) {
      alert('Error: Ticket ID is missing. Please refresh the page.');
      return;
    }
    
    setSendingReply(true);
    try {
      const formData = new FormData();
      
      // Add text content
      if (message.trim()) {
        formData.append('content', message);
      }
      
      // Add attachments (photos/videos)
      if (attachments.length > 0) {
        attachments.forEach((attachment) => {
          formData.append('attachments', attachment.file);
        });
      }
      
      // Add voice note
      if (voiceNote?.blob) {
        formData.append('voiceNote', voiceNote.blob, 'voice-message.webm');
      }
      
      await addTicketMessage(selectedTicket._id, formData);
      
      // Only reload the current ticket's messages, not all tickets
      await reloadTicketMessages();
    } catch (err) {
      console.error('Error sending reply:', err);
      alert('Failed to send reply. Please try again.');
    } finally {
      setSendingReply(false);
    }
  };

  const handleCreateTicket = () => {
    setShowModal(true);
  };

  const handleTicketCreated = () => {
    // Reload tickets after creating a new one
    loadTickets();
  };

  return (
    <div className="min-h-screen container mx-auto space-y-4">
      {/* Page Header */}
      <PageHeader
        title="Help & Support"
        subtitle="View and manage your support tickets"
        icon="MessageSquare"
        primaryAction={{
          label: 'New Ticket',
          icon: 'Plus',
          clickAction: handleCreateTicket
        }}
      />

      {/* Chat-Style Layout */}
      <div className="grid grid-cols-12 gap-0 border border-border rounded-xl overflow-hidden bg-card shadow-sm" style={{ height: 'calc(100vh - 180px)' }}>
        {/* Left Sidebar - Ticket List */}
        <div className="col-span-3 border-r border-border overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading tickets...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center">
                <p className="text-sm text-destructive mb-2">Error loading tickets</p>
                <button 
                  onClick={loadTickets}
                  className="text-xs text-primary hover:underline"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">No tickets yet</p>
                <button 
                  onClick={handleCreateTicket}
                  className="text-xs text-primary hover:underline"
                >
                  Create your first ticket
                </button>
              </div>
            </div>
          ) : (
            <RecentTickets
              tickets={tickets}
              selectedTicket={selectedTicket}
              onSelectTicket={handleSelectTicket}
            />
          )}
        </div>

        {/* Right - Chat Area */}
        <div className="col-span-9 flex flex-col overflow-hidden">
          {selectedTicket ? (
            <TicketDetail
              ticket={selectedTicket}
              onSendReply={handleSendReply}
              sendingReply={sendingReply}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Select a ticket to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      <SupportTicketModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          handleTicketCreated();
        }}
      />
    </div>
  );
}
