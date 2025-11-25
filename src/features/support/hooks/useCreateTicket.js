import { useState } from "react";
import { toast } from "sonner";
import { createSupportTicket } from "../service/supportService";
import { useAuth } from "../../auth/context/AuthContext";

export const useCreateTicket = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // Check if user is logged in

  const submitTicket = async (ticketData, attachments = [], voiceNote = null) => {
    // Check if user is authenticated
    if (!user) {
      toast.error("You must be logged in to submit a ticket.");
      return false;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("subject", ticketData.subject);
      formData.append("category", ticketData.category);
      formData.append("priority", ticketData.priority);
      formData.append("initialDescription", ticketData.initialDescription);

      // Add attachments
      attachments.forEach((file) => formData.append("attachments", file));
      
      // Add voice note
      if (voiceNote) formData.append("attachments", voiceNote);

      // Call API - no token needed, uses httpOnly cookies
      const response = await createSupportTicket(formData);

      console.log("✅ Ticket created successfully:", response);
      toast.success("Support ticket created successfully!");
      return true;
    } catch (error) {
      console.error("❌ Failed to create support ticket:", error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please log in again.");
      } else {
        toast.error(
          error.response?.data?.message ||
          error.message ||
          "Failed to create support ticket. Please try again."
        );
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submitTicket, loading };
};