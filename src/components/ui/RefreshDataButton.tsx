import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from './shadcn/Button';
import { refreshAllData, refreshData } from '../../utils/queryUtils';
import { QUERY_KEYS } from '../../hooks/useQueryData';
import { useToast } from './use-toast';

interface RefreshDataButtonProps {
  dataType?: keyof typeof QUERY_KEYS;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
}

/**
 * A button component that refreshes data when clicked
 * @param dataType The type of data to refresh (from QUERY_KEYS). If not provided, all data will be refreshed.
 * @param className Additional CSS classes
 * @param variant Button variant
 * @param size Button size
 * @param showText Whether to show the text "Refresh" next to the icon
 */
const RefreshDataButton: React.FC<RefreshDataButtonProps> = ({
  dataType,
  className = '',
  variant = 'outline',
  size = 'sm',
  showText = false,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (dataType && QUERY_KEYS[dataType]) {
        await refreshData(QUERY_KEYS[dataType]);
        toast({
          title: 'Data refreshed',
          description: `${dataType} data has been refreshed.`,
          variant: 'success',
        });
      } else {
        await refreshAllData();
        toast({
          title: 'All data refreshed',
          description: 'All data has been refreshed from the server.',
          variant: 'success',
        });
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: 'Refresh failed',
        description: 'There was an error refreshing the data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`${className}`}
      onClick={handleRefresh}
      disabled={isRefreshing}
    >
      <RefreshCw
        className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''} ${showText ? 'mr-2' : ''}`}
      />
      {showText && 'Refresh'}
    </Button>
  );
};

export default RefreshDataButton;
