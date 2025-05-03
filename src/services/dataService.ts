import axios from 'axios';
import { fallbackSkills, fallbackProjects, fallbackAbout, fallbackContact } from './fallbackData';

// Flag to track if backend is available
let isBackendAvailable = true;
let lastBackendCheckTime = 0;
const BACKEND_CHECK_INTERVAL = 30000; // 30 seconds

// Function to check if backend is available
const checkBackendAvailability = async (): Promise<boolean> => {
  const now = Date.now();

  // Only check if it's been more than 30 seconds since last check
  if (now - lastBackendCheckTime < BACKEND_CHECK_INTERVAL) {
    return isBackendAvailable;
  }

  try {
    const API_URL = import.meta.env.VITE_API_URL || '';
    await axios.get(`${API_URL}/api/health`, { timeout: 3000 });
    isBackendAvailable = true;
  } catch (error) {
    isBackendAvailable = false;
    console.warn('Backend server is not available. Using fallback data.');
  }

  lastBackendCheckTime = now;
  return isBackendAvailable;
};

// Types
export interface IProject {
  _id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  images: string[];
  githubLink?: string;
  liveLink?: string;
  month?: number;
  year?: number;
  featured: boolean;
  createdAt: string;
}

export interface ISkill {
  _id: string;
  category: string;
  name: string;
  level: number;
  icon?: string; // Already optional, but good to be explicit
}

export interface IEducation {
  _id: string;
  institution: string;
  level: 'SSLC' | 'HSC' | 'HSSC' | 'Undergraduate' | 'Postgraduate' | 'Doctorate' | 'Diploma' | 'Certificate' | 'Other';
  degree?: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  // New fields for marks/grades
  percentage?: number;
  cgpa?: number;
  totalSemesters?: number;
  completedSemesters?: number;
  boardOrUniversity?: string;
}

export interface IExperience {
  _id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  responsibilities: string[];
}

export interface ICertificate {
  _id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  category: 'Technical' | 'Professional' | 'Academic' | 'Other';
}

export interface IAbout {
  _id: string;
  name: string;
  title: string;
  bio: string;
  avatar?: string;
  location?: string;
  email?: string;
  resumeLink?: string;
  education: IEducation[];
  experience: IExperience[];
  certificates: ICertificate[];
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    github?: string;
    medium?: string;
  };
}

export interface ISocialLink {
  _id: string;
  name: string;
  url: string;
  icon?: string;
}

export interface IContact {
  _id: string;
  email: string;
  phone?: string;
  address?: string;
  location?: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
    medium?: string;
  } | ISocialLink[];
}

// Base API URL
const API_URL = import.meta.env.VITE_API_URL || '';

// Function to fetch projects
export const fetchProjects = async (): Promise<IProject[]> => {
  try {
    // Check if backend is available
    const backendAvailable = await checkBackendAvailability();
    if (!backendAvailable) {
      console.log('Using fallback projects data');
      return fallbackProjects;
    }

    const response = await axios.get(`${API_URL}/api/projects`, { timeout: 5000 });
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Use fallback data if API request fails
    return fallbackProjects;
  }
};

// Function to fetch a single project by ID
export const fetchProjectById = async (id: string): Promise<IProject | null> => {
  try {
    // Check if backend is available
    const backendAvailable = await checkBackendAvailability();
    if (!backendAvailable) {
      console.log('Using fallback project data');
      // Find the project in fallback data
      return fallbackProjects.find(project => project._id === id) || fallbackProjects[0];
    }

    const response = await axios.get(`${API_URL}/api/projects/${id}`, { timeout: 5000 });
    return response.data;
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    // Find the project in fallback data
    return fallbackProjects.find(project => project._id === id) || fallbackProjects[0];
  }
};

// Function to fetch skills
export const fetchSkills = async (): Promise<ISkill[]> => {
  try {
    // Check if backend is available
    const backendAvailable = await checkBackendAvailability();
    if (!backendAvailable) {
      console.log('Using fallback skills data');
      return fallbackSkills;
    }

    const response = await axios.get(`${API_URL}/api/skills`, { timeout: 5000 });
    return response.data;
  } catch (error) {
    console.error('Error fetching skills:', error);
    // Use fallback data if API request fails
    return fallbackSkills;
  }
};

// Function to fetch about information
export const fetchAbout = async (): Promise<IAbout | null> => {
  try {
    // Check if backend is available
    const backendAvailable = await checkBackendAvailability();
    if (!backendAvailable) {
      console.log('Using fallback about data');
      return fallbackAbout;
    }

    const response = await axios.get(`${API_URL}/api/about`, { timeout: 5000 });
    return response.data;
  } catch (error) {
    console.error('Error fetching about information:', error);
    // Use fallback data if API request fails
    return fallbackAbout;
  }
};

// Function to get about information (alias for fetchAbout)
export const getAbout = fetchAbout;

// Function to update about information
export const updateAbout = async (aboutData: Partial<IAbout>, token: string): Promise<IAbout | null> => {
  try {
    const response = await axios.post(
      `${API_URL}/api/about`,
      aboutData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating about information:', error);
    throw error;
  }
};

// Function to add an education entry
export const addEducation = async (educationData: Omit<IEducation, '_id'>, token: string): Promise<IAbout | null> => {
  try {
    const response = await axios.put(
      `${API_URL}/api/about/education`,
      educationData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data; // Returns the updated About object
  } catch (error) {
    console.error('Error adding education:', error);
    throw error;
  }
};

// Function to update an education entry
export const updateEducation = async (id: string, educationData: Partial<Omit<IEducation, '_id'>>, token: string): Promise<IEducation | null> => {
  try {
    const response = await axios.put(
      `${API_URL}/api/about/education/${id}`,
      educationData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data; // Returns the updated Education entry
  } catch (error) {
    console.error(`Error updating education with ID ${id}:`, error);
    throw error;
  }
};

// Function to delete an education entry
export const deleteEducation = async (id: string, token: string): Promise<IAbout | null> => {
  try {
    const response = await axios.delete(
      `${API_URL}/api/about/education/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data; // Returns the updated About object
  } catch (error) {
    console.error(`Error deleting education with ID ${id}:`, error);
    throw error;
  }
};

// Function to add an experience entry
export const addExperience = async (experienceData: Omit<IExperience, '_id'>, token: string): Promise<IAbout | null> => {
  try {
    const response = await axios.put(
      `${API_URL}/api/about/experience`,
      experienceData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data; // Returns the updated About object
  } catch (error) {
    console.error('Error adding experience:', error);
    throw error;
  }
};

// Function to update an experience entry
export const updateExperience = async (id: string, experienceData: Partial<Omit<IExperience, '_id'>>, token: string): Promise<IExperience | null> => {
  try {
    const response = await axios.put(
      `${API_URL}/api/about/experience/${id}`,
      experienceData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data; // Returns the updated Experience entry
  } catch (error) {
    console.error(`Error updating experience with ID ${id}:`, error);
    throw error;
  }
};

// Function to delete an experience entry
export const deleteExperience = async (id: string, token: string): Promise<IAbout | null> => {
  try {
    const response = await axios.delete(
      `${API_URL}/api/about/experience/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data; // Returns the updated About object
  } catch (error) {
    console.error(`Error deleting experience with ID ${id}:`, error);
    throw error;
  }
};


// Function to add a certificate entry
export const addCertificate = async (certificateData: Omit<ICertificate, '_id'>, token: string): Promise<IAbout | null> => {
  try {
    const response = await axios.put(
      `${API_URL}/api/about/certificates`,
      certificateData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data; // Returns the updated About object
  } catch (error) {
    console.error('Error adding certificate:', error);
    throw error;
  }
};

// Function to update a certificate entry
export const updateCertificate = async (id: string, certificateData: Partial<Omit<ICertificate, '_id'>>, token: string): Promise<ICertificate | null> => {
  try {
    const response = await axios.put(
      `${API_URL}/api/about/certificates/${id}`,
      certificateData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data; // Returns the updated Certificate entry
  } catch (error) {
    console.error(`Error updating certificate with ID ${id}:`, error);
    throw error;
  }
};

// Function to delete a certificate entry
export const deleteCertificate = async (id: string, token: string): Promise<IAbout | null> => {
  try {
    const response = await axios.delete(
      `${API_URL}/api/about/certificates/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data; // Returns the updated About object
  } catch (error) {
    console.error(`Error deleting certificate with ID ${id}:`, error);
    throw error;
  }
};

// Function to fetch contact information
export const fetchContact = async (): Promise<IContact | null> => {
  try {
    // Check if backend is available
    const backendAvailable = await checkBackendAvailability();
    if (!backendAvailable) {
      console.log('Using fallback contact data');
      return fallbackContact;
    }

    const response = await axios.get(`${API_URL}/api/contact`, { timeout: 5000 });
    return response.data;
  } catch (error) {
    console.error('Error fetching contact information:', error);
    // Use fallback data if API request fails
    return fallbackContact;
  }
};

// Function to create a new project
export const createProject = async (projectData: Omit<IProject, '_id' | 'createdAt'>, token: string): Promise<IProject | null> => {
  try {
    const response = await axios.post(
      `${API_URL}/api/projects`,
      projectData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Function to update a project
export const updateProject = async (id: string, projectData: Partial<IProject>, token: string): Promise<IProject | null> => {
  try {
    const response = await axios.put(
      `${API_URL}/api/projects/${id}`,
      projectData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating project with ID ${id}:`, error);
    throw error;
  }
};

// Function to delete a project
export const deleteProject = async (id: string, token: string): Promise<boolean> => {
  try {
    await axios.delete(
      `${API_URL}/api/projects/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return true;
  } catch (error) {
    console.error(`Error deleting project with ID ${id}:`, error);
    throw error;
  }
};
