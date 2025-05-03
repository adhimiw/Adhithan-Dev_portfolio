import { useState, useEffect } from 'react';
import axios from 'axios';

// Hook to track backend availability
export const useBackendStatus = () => {
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const API_URL = import.meta.env.VITE_API_URL || '';
    
    const checkBackendStatus = async () => {
      try {
        await axios.get(`${API_URL}/api/health`, { timeout: 3000 });
        if (isMounted) setIsBackendAvailable(true);
      } catch (error) {
        if (isMounted) setIsBackendAvailable(false);
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };

    // Initial check
    checkBackendStatus();

    // Set up interval to check periodically
    const intervalId = setInterval(checkBackendStatus, 30000); // Check every 30 seconds

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return { isBackendAvailable, isChecking };
};

export default useBackendStatus;
