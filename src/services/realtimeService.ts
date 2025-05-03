import { useEffect, useState } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { fetchProjects, fetchSkills, fetchAbout, fetchContact } from './dataService';
import type { IProject, ISkill, IAbout, IContact } from './dataService';

// Room names (should match backend)
export const ROOMS = {
  PROJECTS: 'projects',
  SKILLS: 'skills',
  ABOUT: 'about',
  CONTACT: 'contact',
  ADMIN: 'admin',
  VISITORS: 'visitors'
};

/**
 * Hook for real-time projects data
 */
export const useRealtimeProjects = () => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { socket, joinRoom, isConnected } = useWebSocket();

  useEffect(() => {
    // Initial data fetch
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchProjects();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Join the projects room when connected
    if (isConnected) {
      joinRoom(ROOMS.PROJECTS);
    }

    // Set up event listeners
    if (socket) {
      // Project created
      socket.on('project-created', (data) => {
        setProjects(data.projects);
      });

      // Project updated
      socket.on('project-updated', (data) => {
        setProjects(data.projects);
      });

      // Project deleted
      socket.on('project-deleted', (data) => {
        setProjects(data.projects);
      });
    }

    // Cleanup
    return () => {
      if (socket) {
        socket.off('project-created');
        socket.off('project-updated');
        socket.off('project-deleted');
      }
    };
  }, [socket, joinRoom, isConnected]);

  return { projects, loading, error };
};

/**
 * Hook for real-time skills data
 */
export const useRealtimeSkills = () => {
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { socket, joinRoom, isConnected } = useWebSocket();

  useEffect(() => {
    // Initial data fetch
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchSkills();
        setSkills(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching skills:', err);
        setError('Failed to load skills');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Join the skills room when connected
    if (isConnected) {
      joinRoom(ROOMS.SKILLS);
    }

    // Set up event listeners
    if (socket) {
      // Skill created
      socket.on('skill-created', (data) => {
        setSkills(data.skills);
      });

      // Skill updated
      socket.on('skill-updated', (data) => {
        setSkills(data.skills);
      });

      // Skill deleted
      socket.on('skill-deleted', (data) => {
        setSkills(data.skills);
      });
    }

    // Cleanup
    return () => {
      if (socket) {
        socket.off('skill-created');
        socket.off('skill-updated');
        socket.off('skill-deleted');
      }
    };
  }, [socket, joinRoom, isConnected]);

  return { skills, loading, error };
};

/**
 * Hook for real-time about data
 */
export const useRealtimeAbout = () => {
  const [about, setAbout] = useState<IAbout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { socket, joinRoom, isConnected } = useWebSocket();

  useEffect(() => {
    // Initial data fetch
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchAbout();
        setAbout(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching about data:', err);
        setError('Failed to load about data');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Join the about room when connected
    if (isConnected) {
      joinRoom(ROOMS.ABOUT);
    }

    // Set up event listeners
    if (socket) {
      // About updated
      socket.on('about-updated', (data) => {
        setAbout(data.about);
      });
    }

    // Cleanup
    return () => {
      if (socket) {
        socket.off('about-updated');
      }
    };
  }, [socket, joinRoom, isConnected]);

  return { about, loading, error };
};

/**
 * Hook for real-time contact data
 */
export const useRealtimeContact = () => {
  const [contact, setContact] = useState<IContact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { socket, joinRoom, isConnected } = useWebSocket();

  useEffect(() => {
    // Initial data fetch
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchContact();
        setContact(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching contact data:', err);
        setError('Failed to load contact data');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Join the contact room when connected
    if (isConnected) {
      joinRoom(ROOMS.CONTACT);
    }

    // Set up event listeners
    if (socket) {
      // Contact updated
      socket.on('contact-updated', (data) => {
        setContact(data.contact);
      });
    }

    // Cleanup
    return () => {
      if (socket) {
        socket.off('contact-updated');
      }
    };
  }, [socket, joinRoom, isConnected]);

  return { contact, loading, error };
};
