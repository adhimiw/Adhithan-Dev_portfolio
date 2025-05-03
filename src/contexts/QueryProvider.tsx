import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client with optimized settings for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch on window focus
      staleTime: 1000 * 60 * 15, // Data is fresh for 15 minutes (increased from 5)
      retry: 0, // Don't retry failed queries (reduced from 1)
      refetchInterval: false, // Don't automatically refetch (removed 3-minute interval)
      refetchOnMount: true, // Only refetch when component mounts
      refetchOnReconnect: false, // Don't refetch on reconnect
      cacheTime: 1000 * 60 * 30, // Cache data for 30 minutes
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Export the queryClient for direct access when needed
export { queryClient };
