import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isAuthenticated, logout as authLogout } from '../services/authService';

interface AuthContextType {
  isLoggedIn: boolean;
  token: string;
  loading: boolean; // Add loading state
  setIsLoggedIn: (value: boolean) => void;
  logout: () => Promise<void>; // Add logout function
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  token: '',
  loading: true, // Initialize loading as true
  setIsLoggedIn: () => {},
  logout: async () => {} // Empty implementation for the context default
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state management

  useEffect(() => {
    let isMounted = true; // Flag to prevent state update on unmounted component
    // Check if user is authenticated on mount
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);

      if (authenticated) {
        const storedToken = localStorage.getItem('token') || '';
        console.log('Retrieved token from localStorage:', storedToken ? 'Token exists' : 'No token');
        setToken(storedToken);
      } else {
        // Clear token if not authenticated
        setToken('');
      }
      // Set loading to false only if the component is still mounted
      if (isMounted) {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for storage events (for when token is added/removed in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };

    // Check authentication status periodically
    const intervalId = setInterval(checkAuth, 60000); // Check every minute

    window.addEventListener('storage', handleStorageChange);

    return () => {
      isMounted = false; // Set flag to false on unmount
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  // Implement logout function
  const handleLogout = async (): Promise<void> => {
    try {
      await authLogout();
      setIsLoggedIn(false);
      setToken('');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear the state even if the API call fails
      setIsLoggedIn(false);
      setToken('');
    }
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      token,
      loading,
      setIsLoggedIn,
      logout: handleLogout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
