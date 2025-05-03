import { queryClient } from '../contexts/QueryProvider';
import { QUERY_KEYS } from '../hooks/useQueryData';

/**
 * Utility function to invalidate all queries
 * Use this when you want to force a refresh of all data
 */
export const refreshAllData = () => {
  return queryClient.invalidateQueries();
};

/**
 * Utility function to invalidate a specific query
 * @param queryKey The key of the query to invalidate
 */
export const refreshData = (queryKey: string) => {
  return queryClient.invalidateQueries({ queryKey: [queryKey] });
};

/**
 * Utility function to refresh about data
 * Use this when you update about information and want to see the changes immediately
 */
export const refreshAboutData = () => {
  return refreshData(QUERY_KEYS.ABOUT);
};

/**
 * Utility function to refresh projects data
 * Use this when you update projects and want to see the changes immediately
 */
export const refreshProjectsData = () => {
  return refreshData(QUERY_KEYS.PROJECTS);
};

/**
 * Utility function to refresh skills data
 * Use this when you update skills and want to see the changes immediately
 */
export const refreshSkillsData = () => {
  return refreshData(QUERY_KEYS.SKILLS);
};

/**
 * Utility function to refresh contact data
 * Use this when you update contact information and want to see the changes immediately
 */
export const refreshContactData = () => {
  return refreshData(QUERY_KEYS.CONTACT);
};
