import axios from 'axios';

// Types
export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface IAdmin {
  _id: string;
  username: string;
  email: string;
  token?: string;
}

// Base API URL
const API_URL = import.meta.env.VITE_API_URL || '';

// Login function
export const login = async (credentials: ILoginCredentials): Promise<IAdmin> => {
  try {
    console.log('Attempting login with credentials:', { email: credentials.email, password: '******' });

    const response = await axios.post(`${API_URL}/api/auth/login`, credentials, {
      withCredentials: true
    });

    console.log('Login response:', { ...response.data, token: response.data.token ? 'Token exists' : 'No token' });

    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      console.log('Token stored in localStorage');
    } else {
      console.error('No token received from server');
    }

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register function (typically only used for initial setup)
export const register = async (credentials: IRegisterCredentials): Promise<IAdmin> => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, credentials, {
      withCredentials: true
    });

    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Logout function
export const logout = async (): Promise<void> => {
  try {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Try to call the logout API endpoint
        await axios.post(`${API_URL}/api/auth/logout`, {}, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          },
          // Set a timeout to prevent hanging if the server is not responding
          timeout: 3000
        });
        console.log('Logout API call successful');
      } catch (apiError) {
        // Log but don't throw - we still want to clear local storage
        console.warn('Logout API call failed, but proceeding with local logout:', apiError);
      }
    }

    // Always remove token from localStorage
    localStorage.removeItem('token');

    // Also clear any other auth-related items
    localStorage.removeItem('user');

    // Dispatch a custom event that other components can listen for
    window.dispatchEvent(new Event('auth-logout'));

    console.log('Logout completed, token removed from localStorage');
  } catch (error) {
    console.error('Logout error:', error);
    // Still remove token even if something unexpected happens
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw error;
  }
};

// Get current admin profile
export const getProfile = async (): Promise<IAdmin> => {
  try {
    const response = await axios.get(`${API_URL}/api/auth/profile`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// Add authorization header to axios requests
export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    },
    withCredentials: true
  };
};
