import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

interface ContactMessage {
  name: string;
  email: string;
  message: string;
  visitorId?: string;
  role?: string;
}

/**
 * Send a contact message
 * @param messageData - The message data
 */
export const sendContactMessage = async (messageData: ContactMessage): Promise<{ success: boolean; message: string }> => {
  try {
    // Add visitor information if available
    const visitorId = localStorage.getItem('visitorId');
    const role = localStorage.getItem('visitorRole');

    if (visitorId) {
      messageData.visitorId = visitorId;
    }

    if (role) {
      messageData.role = role;
    }

    const response = await axios.post(`${API_URL}/api/contact/message`, messageData);
    return response.data;
  } catch (error: any) {
    console.error('Error sending contact message:', error);

    // If we have a response from the server with an error message, use it
    if (error.response && error.response.data) {
      if (typeof error.response.data === 'string') {
        throw new Error(error.response.data);
      } else if (error.response.data.message) {
        throw new Error(error.response.data.message);
      }
    }

    // Otherwise, throw a generic error
    throw new Error('Failed to send message. Please try again later.');
  }
};

/**
 * Get all contact messages (admin only)
 * @param token - Admin authentication token
 */
export const getContactMessages = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/contact/messages`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    throw error;
  }
};

/**
 * Mark a message as read (admin only)
 * @param messageId - The ID of the message to mark as read
 * @param token - Admin authentication token
 */
export const markMessageAsRead = async (messageId: string, token: string) => {
  try {
    const response = await axios.put(`${API_URL}/api/contact/messages/${messageId}/read`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};
