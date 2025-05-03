import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAbout,
  fetchProjects,
  fetchSkills,
  fetchContact,
  updateAbout,
  updateProject,
  updateExperience,
  updateEducation,
  updateCertificate,
  type IAbout,
  type IProject,
  type ISkill,
  type IContact,
  type IExperience,
  type IEducation,
  type ICertificate
} from '../services/dataService';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useEffect } from 'react';

// Query keys
export const QUERY_KEYS = {
  ABOUT: 'about',
  PROJECTS: 'projects',
  SKILLS: 'skills',
  CONTACT: 'contact',
  EXPERIENCE: 'experience',
  EDUCATION: 'education',
  CERTIFICATES: 'certificates'
};

/**
 * Hook for fetching About data with React Query
 */
export const useAboutQuery = () => {
  const queryClient = useQueryClient();
  const { socket, joinRoom, isConnected } = useWebSocket();

  // Join the about room when connected
  useEffect(() => {
    if (isConnected) {
      joinRoom('about');
    }
  }, [isConnected, joinRoom]);

  // Set up WebSocket listener for about updates
  useEffect(() => {
    if (!socket) return;

    const handleAboutUpdate = (data: { about: IAbout }) => {
      console.log('About updated via WebSocket:', data.about);
      queryClient.setQueryData([QUERY_KEYS.ABOUT], data.about);
    };

    socket.on('about-updated', handleAboutUpdate);

    return () => {
      socket.off('about-updated', handleAboutUpdate);
    };
  }, [socket, queryClient]);

  return useQuery({
    queryKey: [QUERY_KEYS.ABOUT],
    queryFn: fetchAbout,
  });
};

/**
 * Hook for updating About data with React Query
 */
export const useUpdateAbout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ aboutData, token }: { aboutData: Partial<IAbout>; token: string }) =>
      updateAbout(aboutData, token),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEYS.ABOUT], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ABOUT] });
    },
  });
};

/**
 * Hook for fetching Projects data with React Query
 */
export const useProjectsQuery = () => {
  const queryClient = useQueryClient();
  const { socket, joinRoom, isConnected } = useWebSocket();

  // Join the projects room when connected
  useEffect(() => {
    if (isConnected) {
      joinRoom('projects');
    }
  }, [isConnected, joinRoom]);

  // Set up WebSocket listeners for project updates
  useEffect(() => {
    if (!socket) return;

    const handleProjectsUpdate = (data: { projects: IProject[] }) => {
      console.log('Projects updated via WebSocket:', data.projects);
      queryClient.setQueryData([QUERY_KEYS.PROJECTS], data.projects);
    };

    socket.on('project-created', handleProjectsUpdate);
    socket.on('project-updated', handleProjectsUpdate);
    socket.on('project-deleted', handleProjectsUpdate);

    return () => {
      socket.off('project-created', handleProjectsUpdate);
      socket.off('project-updated', handleProjectsUpdate);
      socket.off('project-deleted', handleProjectsUpdate);
    };
  }, [socket, queryClient]);

  return useQuery({
    queryKey: [QUERY_KEYS.PROJECTS],
    queryFn: fetchProjects,
  });
};

/**
 * Hook for fetching Skills data with React Query
 */
export const useSkillsQuery = () => {
  const queryClient = useQueryClient();
  const { socket, joinRoom, isConnected } = useWebSocket();

  // Join the skills room when connected
  useEffect(() => {
    if (isConnected) {
      joinRoom('skills');
    }
  }, [isConnected, joinRoom]);

  // Set up WebSocket listeners for skill updates
  useEffect(() => {
    if (!socket) return;

    const handleSkillsUpdate = (data: { skills: ISkill[] }) => {
      console.log('Skills updated via WebSocket:', data.skills);
      queryClient.setQueryData([QUERY_KEYS.SKILLS], data.skills);
    };

    socket.on('skill-created', handleSkillsUpdate);
    socket.on('skill-updated', handleSkillsUpdate);
    socket.on('skill-deleted', handleSkillsUpdate);

    return () => {
      socket.off('skill-created', handleSkillsUpdate);
      socket.off('skill-updated', handleSkillsUpdate);
      socket.off('skill-deleted', handleSkillsUpdate);
    };
  }, [socket, queryClient]);

  return useQuery({
    queryKey: [QUERY_KEYS.SKILLS],
    queryFn: fetchSkills,
  });
};

/**
 * Hook for fetching Contact data with React Query
 */
export const useContactQuery = () => {
  const queryClient = useQueryClient();
  const { socket, joinRoom, isConnected } = useWebSocket();

  // Join the contact room when connected
  useEffect(() => {
    if (isConnected) {
      joinRoom('contact');
    }
  }, [isConnected, joinRoom]);

  // Set up WebSocket listener for contact updates
  useEffect(() => {
    if (!socket) return;

    const handleContactUpdate = (data: { contact: IContact }) => {
      queryClient.setQueryData([QUERY_KEYS.CONTACT], data.contact);
    };

    socket.on('contact-updated', handleContactUpdate);

    return () => {
      socket.off('contact-updated', handleContactUpdate);
    };
  }, [socket, queryClient]);

  return useQuery({
    queryKey: [QUERY_KEYS.CONTACT],
    queryFn: fetchContact,
  });
};

/**
 * Utility function to invalidate all queries
 * Use this when you want to force a refresh of all data
 */
export const invalidateAllQueries = () => {
  const queryClient = useQueryClient();
  return queryClient.invalidateQueries();
};

/**
 * Utility function to invalidate a specific query
 */
export const invalidateQuery = (queryKey: string) => {
  const queryClient = useQueryClient();
  return queryClient.invalidateQueries({ queryKey: [queryKey] });
};
