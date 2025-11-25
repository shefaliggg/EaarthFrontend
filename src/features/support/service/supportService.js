import { axiosConfig } from "../../auth/config/axiosConfig";

/**
 * Create a new support ticket
 * No token needed - uses httpOnly cookies automatically
 */
export const createSupportTicket = async (formData) => {
  try {
    const response = await axiosConfig.post(
      "/support/tickets",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Support Ticket Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get all support tickets
 */
export const getSupportTickets = async (params = {}) => {
  try {
    const response = await axiosConfig.get("/support/tickets", { params });
    return response.data;
  } catch (error) {
    console.error("Get Tickets Error:", error);
    throw error;
  }
};

/**
 * Get a specific support ticket by ID
 */
export const getSupportTicketById = async (ticketId) => {
  try {
    const response = await axiosConfig.get(`/support/tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error("Get Ticket Error:", error);
    throw error;
  }
};

/**
 * Update a support ticket
 */
export const updateSupportTicket = async (ticketId, updateData) => {
  try {
    const response = await axiosConfig.put(
      `/support/tickets/${ticketId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error("Update Ticket Error:", error);
    throw error;
  }
};

/**
 * Delete (soft delete) a support ticket
 */
export const deleteSupportTicket = async (ticketId) => {
  try {
    const response = await axiosConfig.delete(`/support/tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error("Delete Ticket Error:", error);
    throw error;
  }
};

/**
 * Get all messages for a ticket
 */
export const getTicketMessages = async (ticketId) => {
  try {
    const response = await axiosConfig.get(`/support/tickets/${ticketId}/messages`);
    return response.data;
  } catch (error) {
    console.error("Get Messages Error:", error);
    throw error;
  }
};

/**
 * Add a new message to a ticket
 */
export const addTicketMessage = async (ticketId, formData) => {
  try {
    const response = await axiosConfig.post(
      `/support/tickets/${ticketId}/messages`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Add Message Error:", error);
    throw error;
  }
};

/**
 * Delete a message from a ticket
 */
export const deleteTicketMessage = async (ticketId, messageId) => {
  try {
    const response = await axiosConfig.delete(
      `/support/tickets/${ticketId}/messages/${messageId}`
    );
    return response.data;
  } catch (error) {
    console.error("Delete Message Error:", error);
    throw error;
  }
};