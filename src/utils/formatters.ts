/**
 * Format a date string to a more readable format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Jan 2022")
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return '';
  
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric',
    month: 'short'
  };
  
  return date.toLocaleDateString('en-US', options);
};

/**
 * Format a date string to include day, month, and year
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Jan 15, 2022")
 */
export const formatFullDate = (dateString?: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return '';
  
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  return date.toLocaleDateString('en-US', options);
};
