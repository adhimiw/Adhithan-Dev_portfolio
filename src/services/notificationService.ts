/**
 * Notification Service
 * Handles creating, storing, and managing notifications
 */

import axios from 'axios';
import { getAuthHeader } from './authService';

const API_URL = import.meta.env.VITE_API_URL || '';

// Notification types
export enum NotificationType {
  CONTACT = 'contact',
  SYSTEM = 'system',
  JOB = 'job',
  PROJECT = 'project',
  VISITOR = 'visitor',
}

// Notification priority
export enum NotificationPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

// Notification status
export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
  RESPONDED = 'responded',
}

// Notification interface
export interface INotification {
  _id?: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  metadata?: {
    contactId?: string;
    visitorId?: string;
    email?: string;
    name?: string;
    aiSummary?: string;
    aiSuggestedResponse?: string;
    category?: string;
    responseMessage?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Fetch all notifications
 * @returns Array of notifications
 */
export const fetchNotifications = async (): Promise<INotification[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/notifications`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * Create a new notification
 * @param notification The notification to create
 * @returns The created notification
 */
export const createNotification = async (notification: Omit<INotification, '_id'>): Promise<INotification> => {
  try {
    const response = await axios.post(`${API_URL}/api/notifications`, notification, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Update a notification
 * @param id The notification ID
 * @param updates The updates to apply
 * @returns The updated notification
 */
export const updateNotification = async (id: string, updates: Partial<INotification>): Promise<INotification> => {
  try {
    const response = await axios.put(`${API_URL}/api/notifications/${id}`, updates, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error updating notification:', error);
    throw error;
  }
};

/**
 * Mark a notification as read
 * @param id The notification ID
 * @returns The updated notification
 */
export const markNotificationAsRead = async (id: string): Promise<INotification> => {
  return updateNotification(id, { status: NotificationStatus.READ });
};

/**
 * Archive a notification
 * @param id The notification ID
 * @returns The updated notification
 */
export const archiveNotification = async (id: string): Promise<INotification> => {
  return updateNotification(id, { status: NotificationStatus.ARCHIVED });
};

/**
 * Delete a notification
 * @param id The notification ID
 * @returns Success status
 */
export const deleteNotification = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/api/notifications/${id}`, getAuthHeader());
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

/**
 * Process a new contact message and create a notification
 * @param contactData The contact form data
 * @returns The created notification
 */
export const processContactNotification = async (contactData: {
  name: string;
  email: string;
  message: string;
  _id?: string;
}): Promise<INotification> => {
  try {
    // Create a basic notification
    const notification: Omit<INotification, '_id'> = {
      type: NotificationType.CONTACT,
      title: `New message from ${contactData.name}`,
      message: contactData.message.substring(0, 100) + (contactData.message.length > 100 ? '...' : ''),
      priority: NotificationPriority.MEDIUM,
      status: NotificationStatus.UNREAD,
      metadata: {
        contactId: contactData._id,
        email: contactData.email,
        name: contactData.name,
      },
    };

    return createNotification(notification);
  } catch (error) {
    console.error('Error processing contact notification:', error);
    throw error;
  }
};

export default {
  fetchNotifications,
  createNotification,
  updateNotification,
  markNotificationAsRead,
  archiveNotification,
  deleteNotification,
  processContactNotification,
};
