import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Track a page visit
 * @param page - The page being visited
 */
export const trackPageVisit = async (page: string): Promise<void> => {
  try {
    const visitorId = localStorage.getItem('visitorId');

    if (!visitorId) {
      console.warn('No visitor ID found, page visit not tracked');
      return;
    }

    // Validate visitorId format before sending
    if (!/^[0-9a-fA-F]{24}$/.test(visitorId)) {
      // If the ID is invalid, simply return without tracking or logging an error
      // The App component now handles logging a warning if needed when deciding to render PageTracker
      return;
    }

    // Check if the API_URL is properly set
    if (!API_URL) {
      console.warn('API_URL is not set, using default URL');
      // Register a new visitor instead of trying to update an existing one
      try {
        const response = await axios.post('http://localhost:5000/api/visitors', {
          role: 'visitor'
        });

        if (response.data && response.data.visitorId) {
          localStorage.setItem('visitorId', response.data.visitorId);
          console.log('New visitor registered with ID:', response.data.visitorId);
        }
      } catch (registerError) {
        console.error('Error registering new visitor:', registerError);
      }
      return;
    }

    console.log('Tracking page visit with URL:', `${API_URL}/api/visitors/${visitorId}/page`);
    await axios.put(`${API_URL}/api/visitors/${visitorId}/page`, { pagePath: page });
  } catch (error) {
    console.error('Error tracking page visit:', error);

    // If we get a 404, the visitor ID might be invalid or the visitor record might have been deleted
    // Try to register a new visitor
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      try {
        console.log('Visitor not found, registering a new visitor');
        const response = await axios.post(`${API_URL}/api/visitors`, {
          role: 'visitor'
        });

        if (response.data && response.data.visitorId) {
          localStorage.setItem('visitorId', response.data.visitorId);
          console.log('New visitor registered with ID:', response.data.visitorId);

          // Now try to track the page visit with the new visitor ID
          await axios.put(`${API_URL}/api/visitors/${response.data.visitorId}/page`, { pagePath: page });
        }
      } catch (registerError) {
        console.error('Error registering new visitor:', registerError);
      }
    }

    // Don't throw error to prevent affecting user experience
  }
};

/**
 * Get visitor statistics (admin only)
 * @param token - Admin authentication token
 */
export const getVisitorStats = async (token: string) => {
  try {
    console.log('Making request to visitor stats with token:', token ? 'Token exists' : 'No token');

    // Ensure token is properly formatted
    const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

    // Set a timeout to prevent hanging if the server is not responding
    const response = await axios.get(`${API_URL}/api/visitors/stats`, {
      headers: {
        Authorization: authToken
      },
      withCredentials: true, // Include cookies in the request
      timeout: 5000 // 5 second timeout
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.error('Request timeout when fetching visitor statistics');
        throw new Error('Request timed out. The server may be unavailable.');
      }

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response from visitor stats API:', error.response.status, error.response.data);

        if (error.response.status === 401 || error.response.status === 403) {
          throw new Error('Authentication failed. Please log in again.');
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from visitor stats API');
        throw new Error('No response from server. Please check your connection.');
      }
    }

    console.error('Error fetching visitor statistics:', error);
    throw error;
  }
};

/**
 * Format visitor statistics for display
 * @param stats - Raw visitor statistics
 */
export const formatVisitorStats = (stats: any) => {
  // Format visitors by role for chart
  const roleData = stats.visitorsByRole.map((item: any) => ({
    name: item._id,
    value: item.count
  }));

  // Format visitors by date for chart
  const dateData = stats.visitorsByDate.map((item: any) => ({
    date: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}-${item._id.day.toString().padStart(2, '0')}`,
    visitors: item.count
  }));

  // Format most visited pages
  const pageData = stats.mostVisitedPages.map((item: any) => ({
    page: item._id,
    visits: item.count
  }));

  return {
    totalVisitors: stats.totalVisitors,
    roleData,
    dateData,
    pageData
  };
};
