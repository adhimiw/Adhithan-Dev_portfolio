import { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { useNavigate } from 'react-router-dom';
import {
  IExperience,
  IAbout,
  getAbout,
  addExperience, // Import new functions
  updateExperience,
  deleteExperience
} from '../../services/dataService';
import { useAuth } from '../../contexts/AuthContext';
import ExperienceForm from '../../components/admin/ExperienceForm';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const ExperiencePage = () => {
  const [about, setAbout] = useState<IAbout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<IExperience | undefined>(undefined);
  const { token } = useAuth();
  const navigate = useNavigate();

  // Use useCallback to memoize fetchAbout
  const fetchAbout = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAbout();
      setAbout(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch about data:', err);
      setError('Failed to load experience data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array for useCallback

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]); // Call fetchAbout when component mounts or fetchAbout changes


  const handleAddClick = () => {
    setCurrentExperience(undefined);
    setShowForm(true);
  };

  const handleEditClick = (experience: IExperience) => {
    setCurrentExperience(experience);
    setShowForm(true);
  };

  const handleDeleteClick = async (experienceId: string) => {
    if (!window.confirm('Are you sure you want to delete this experience entry?')) {
      return;
    }

    try {
      setIsSubmitting(true);
      if (!token) {
        setError('Authentication token not found.');
        setIsSubmitting(false);
        return;
      }

      const updatedAbout = await deleteExperience(experienceId, token);
      setAbout(updatedAbout); // Update state with the result from the API

      setError(null);
    } catch (err) {
      console.error('Failed to delete experience:', err);
      setError('Failed to delete experience. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (experienceData: Omit<IExperience, '_id'>) => {
    try {
      setIsSubmitting(true);
      if (!token) {
        setError('Authentication token not found.');
        setIsSubmitting(false);
        return;
      }

      if (currentExperience) {
        // Update existing experience
        await updateExperience(currentExperience._id, experienceData, token);
      } else {
        // Add new experience
        await addExperience(experienceData, token);
      }

      // Refresh data from the server
      await fetchAbout();
      
      setShowForm(false);
      setCurrentExperience(undefined);
      setError(null);
    } catch (err) {
      console.error('Failed to save experience:', err);
      setError('Failed to save experience. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setCurrentExperience(undefined);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Experience Management</h1>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Experience
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {showForm ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {currentExperience ? 'Edit Experience' : 'Add Experience'}
          </h2>
          <ExperienceForm
            experience={currentExperience}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      ) : (
        <>
          {about && about.experience.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {about.experience.map((experience) => (
                  <li key={experience._id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{experience.position}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{experience.company}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(experience.startDate)} - {experience.current ? 'Present' : formatDate(experience.endDate)}
                        </p>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{experience.description}</p>
                        
                        {experience.responsibilities && experience.responsibilities.length > 0 && (
                          <div className="mt-2">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Responsibilities:</h4>
                            <ul className="mt-1 list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
                              {experience.responsibilities.map((responsibility, index) => (
                                <li key={index}>{responsibility}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEditClick(experience)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(experience._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          disabled={isSubmitting}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">No experience entries found. Click "Add Experience" to create one.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExperiencePage;
