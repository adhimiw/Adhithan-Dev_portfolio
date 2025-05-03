import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageVisit } from '../../services/visitorService';

const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page visit when location changes
    const trackPage = async () => {
      await trackPageVisit(location.pathname);
    };

    // Only track if visitor ID exists
    if (localStorage.getItem('visitorId')) {
      trackPage();
    }
  }, [location.pathname]);

  // This component doesn't render anything
  return null;
};

export default PageTracker;
