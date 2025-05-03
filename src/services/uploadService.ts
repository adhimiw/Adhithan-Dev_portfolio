import axios from 'axios';
import { getAuthHeader } from './authService';

// Base API URL
const API_URL = import.meta.env.VITE_API_URL || '';

// Types
export interface IUploadResponse {
  url: string;
  publicId: string;
}

// Upload image function
export const uploadImage = async (file: File): Promise<IUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(
      `${API_URL}/api/upload`,
      formData,
      {
        ...getAuthHeader(),
        headers: {
          ...getAuthHeader().headers,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};

// Upload resume function
export const uploadResume = async (file: File): Promise<IUploadResponse & { about: any }> => {
  try {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await axios.post(
      `${API_URL}/api/upload/resume`,
      formData,
      {
        ...getAuthHeader(),
        headers: {
          ...getAuthHeader().headers,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Resume upload error:', error);
    throw error;
  }
};

// Delete image function
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await axios.delete(
      `${API_URL}/api/upload/${publicId}`,
      getAuthHeader()
    );
  } catch (error) {
    console.error('Image delete error:', error);
    throw error;
  }
};
