import { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { useNavigate } from 'react-router-dom';
import {
  IEducation,
  IAbout,
  getAbout,
  addEducation, // Import new functions
  updateEducation,
  deleteEducation
} from '../../services/dataService';
import { useAuth } from '../../contexts/AuthContext';
import EducationForm from '../../components/admin/EducationForm';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const EducationPage = () => {
  const [about, setAbout] = useState<IAbout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentEducation, setCurrentEducation] = useState<IEducation | undefined>(undefined);
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
      setError('Failed to load education data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array for useCallback if it doesn't depend on props/state

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]); // Call fetchAbout when component mounts or fetchAbout changes


  const handleAddClick = () => {
    setCurrentEducation(undefined);
    setShowForm(true);
  };

  const handleEditClick = (education: IEducation) => {
    setCurrentEducation(education);
    setShowForm(true);
  };

  const handleDeleteClick = async (educationId: string) => {
    if (!window.confirm('Are you sure you want to delete this education entry?')) {
      return;
    }

    try {
      setIsSubmitting(true);
      if (!token) {
        setError('Authentication token not found.');
        setIsSubmitting(false);
        return;
      }

      const updatedAbout = await deleteEducation(educationId, token);
      setAbout(updatedAbout); // Update state with the result from the API

      setError(null);
    } catch (err) {
      console.error('Failed to delete education:', err);
      setError('Failed to delete education. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (educationData: Omit<IEducation, '_id'>) => {
    try {
      setIsSubmitting(true);
      if (!token) {
        setError('Authentication token not found.');
        setIsSubmitting(false);
        return;
      }

      if (currentEducation) {
        // Update existing education
        await updateEducation(currentEducation._id, educationData, token);
      } else {
        // Add new education
        await addEducation(educationData, token);
      }

      // Refresh data from the server
      await fetchAbout();

      setShowForm(false);
      setCurrentEducation(undefined);
      setError(null);
    } catch (err) {
      console.error('Failed to save education:', err);
      setError('Failed to save education. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setCurrentEducation(undefined);
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Education Management</h1>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Education
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
            {currentEducation ? 'Edit Education' : 'Add Education'}
          </h2>
          <EducationForm
            education={currentEducation}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      ) : (
        <>
          {about && about.education.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {about.education.map((education) => (
                  <li key={education._id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {/* Display level and degree/field appropriately */}
                          {['SSLC', 'HSC', 'HSSC'].includes(education.level)
                            ? `${education.field} (${education.level})`
                            : `${education.degree || 'Degree N/A'} in ${education.field} (${education.level})`}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{education.institution}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(education.startDate)} - {education.current ? 'Present' : (education.endDate ? formatDate(education.endDate) : 'N/A')}
                        </p>

                        {/* Display marks/grades based on education level */}
                        {['SSLC', 'HSC', 'HSSC'].includes(education.level) && education.percentage && (
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            <span className="font-medium">Percentage:</span> {education.percentage}%
                          </p>
                        )}

                        {['Undergraduate', 'Postgraduate', 'Doctorate'].includes(education.level) && (
                          <>
                            {education.cgpa && (
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">CGPA:</span> {education.cgpa}/10
                              </p>
                            )}
                            {education.totalSemesters && (
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Semesters:</span> {education.completedSemesters || 0}/{education.totalSemesters}
                                {education.current && education.completedSemesters && education.totalSemesters &&
                                  ` (${Math.round((education.completedSemesters / education.totalSemesters) * 100)}% complete)`}
                              </p>
                            )}
                          </>
                        )}

                        {education.boardOrUniversity && (
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            <span className="font-medium">Board/University:</span> {education.boardOrUniversity}
                          </p>
                        )}

                        {education.description && (
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{education.description}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(education)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(education._id)}
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
              <p className="text-gray-500 dark:text-gray-400">No education entries found. Click "Add Education" to create one.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EducationPage;
