/**
 * Device Service
 * Handles device registration for push notifications
 */

import axios from 'axios';
import { getAuthHeader } from './authService';

const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Register a device for push notifications
 * @param deviceToken - The device token from OneSignal
 * @param deviceType - The type of device (web, android, ios)
 * @param deviceName - The name of the device
 */
export const registerDevice = async (
  deviceToken: string,
  deviceType: 'web' | 'android' | 'ios' = 'web',
  deviceName: string = navigator.userAgent
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.post(
      `${API_URL}/api/devices/register`,
      {
        deviceToken,
        deviceType,
        deviceName,
      },
      getAuthHeader()
    );
    
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error('Error registering device:', error);
    return { success: false, message: 'Failed to register device' };
  }
};

/**
 * Unregister a device from push notifications
 * @param deviceToken - The device token from OneSignal
 */
export const unregisterDevice = async (
  deviceToken: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.post(
      `${API_URL}/api/devices/unregister`,
      {
        deviceToken,
      },
      getAuthHeader()
    );
    
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error('Error unregistering device:', error);
    return { success: false, message: 'Failed to unregister device' };
  }
};

/**
 * Get all registered devices for the current user
 */
export const getDevices = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/devices`,
      getAuthHeader()
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching devices:', error);
    throw error;
  }
};

export default {
  registerDevice,
  unregisterDevice,
  getDevices,
};
