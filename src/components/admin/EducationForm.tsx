import { useState, useEffect } from 'react';
import { IEducation } from '../../services/dataService';

interface EducationFormProps {
  education?: IEducation;
  onSubmit: (educationData: Omit<IEducation, '_id'>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

// Define the possible education levels based on the backend model
const educationLevels: IEducation['level'][] = [
  'SSLC',
  'HSC',
  'HSSC',
  'Undergraduate',
  'Postgraduate',
  'Doctorate',
  'Diploma',
  'Certificate',
  'Other'
];

const EducationForm = ({
  education,
  onSubmit,
  onCancel,
  isSubmitting
}: EducationFormProps) => {
  const [formData, setFormData] = useState<Omit<IEducation, '_id'>>({
    institution: '',
    level: 'Other',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    percentage: undefined,
    cgpa: undefined,
    totalSemesters: undefined,
    completedSemesters: undefined,
    boardOrUniversity: ''
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (education) {
      setFormData({
        institution: education.institution,
        level: education.level || 'Other',
        degree: education.degree || '',
        field: education.field,
        startDate: formatDateForInput(education.startDate),
        endDate: education.endDate ? formatDateForInput(education.endDate) : '',
        current: education.current,
        description: education.description || '',
        percentage: education.percentage,
        cgpa: education.cgpa,
        totalSemesters: education.totalSemesters,
        completedSemesters: education.completedSemesters,
        boardOrUniversity: education.boardOrUniversity || ''
      });
    }
  }, [education]);

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Handle number inputs
    if (type === 'number') {
      const numberValue = value === '' ? undefined : parseFloat(value);
      setFormData(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Auto-update completedSemesters when current is true and totalSemesters changes
    if (name === 'totalSemesters' && formData.current && value !== '') {
      setFormData(prev => ({
        ...prev,
        completedSemesters: parseInt(value)
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));

    // If current is checked
    if (name === 'current' && checked) {
      // Clear the end date
      setFormData(prev => ({
        ...prev,
        endDate: '',
        // For college education, set completedSemesters to totalSemesters if currently studying
        ...(prev.totalSemesters && ['Undergraduate', 'Postgraduate', 'Doctorate'].includes(prev.level)
          ? { completedSemesters: prev.totalSemesters }
          : {})
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Validate form
      if (!formData.institution || !formData.level || !formData.field || !formData.startDate) {
        setError('Please fill in Institution, Level, Field of Study, and Start Date.');
        return;
      }

      // Degree is required for higher education levels
      const schoolLevels = ['SSLC', 'HSC', 'HSSC'];
      if (!schoolLevels.includes(formData.level) && !formData.degree) {
        setError('Please provide a Degree for the selected Level.');
        return;
      }

      // If not current, end date is required
      if (!formData.current && !formData.endDate) {
        setError('Please provide an end date or mark as current');
        return;
      }

      // Format dates for API
      const formattedData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined
      };

      await onSubmit(formattedData);
    } catch (err) {
      setError('Failed to save education. Please try again.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="institution" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Institution <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="institution"
          name="institution"
          value={formData.institution}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Level <span className="text-red-500">*</span>
        </label>
        <select
          id="level"
          name="level"
          value={formData.level}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {educationLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      {/* Conditionally render Degree field based on level */}
      {!['SSLC', 'HSC', 'HSSC'].includes(formData.level) && (
        <div>
          <label htmlFor="degree" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Degree <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="degree"
            name="degree"
            value={formData.degree || ''}
            onChange={handleChange}
            required={!['SSLC', 'HSC', 'HSSC'].includes(formData.level)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      )}

      <div>
        <label htmlFor="field" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Field of Study <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="field"
          name="field"
          value={formData.field}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Start Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="current"
          name="current"
          checked={formData.current}
          onChange={handleCheckboxChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="current" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          Currently studying here
        </label>
      </div>

      {!formData.current && (
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required={!formData.current}
            disabled={formData.current}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      )}

      {/* Board or University */}
      <div>
        <label htmlFor="boardOrUniversity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Board/University
        </label>
        <input
          type="text"
          id="boardOrUniversity"
          name="boardOrUniversity"
          value={formData.boardOrUniversity || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Percentage field for school levels */}
      {['SSLC', 'HSC', 'HSSC'].includes(formData.level) && (
        <div>
          <label htmlFor="percentage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Percentage
          </label>
          <input
            type="number"
            id="percentage"
            name="percentage"
            min="0"
            max="100"
            step="0.01"
            value={formData.percentage || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      )}

      {/* CGPA and Semester fields for college levels */}
      {['Undergraduate', 'Postgraduate', 'Doctorate'].includes(formData.level) && (
        <>
          <div>
            <label htmlFor="cgpa" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              CGPA (out of 10)
            </label>
            <input
              type="number"
              id="cgpa"
              name="cgpa"
              min="0"
              max="10"
              step="0.01"
              value={formData.cgpa || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="totalSemesters" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Semesters
              </label>
              <input
                type="number"
                id="totalSemesters"
                name="totalSemesters"
                min="1"
                max="12"
                value={formData.totalSemesters || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="completedSemesters" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Completed Semesters
              </label>
              <input
                type="number"
                id="completedSemesters"
                name="completedSemesters"
                min="0"
                max={formData.totalSemesters || 12}
                value={formData.completedSemesters || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {formData.current && formData.totalSemesters && formData.completedSemesters && (
                <p className="mt-1 text-xs text-gray-500">
                  {formData.completedSemesters} of {formData.totalSemesters} semesters completed
                  ({Math.round((formData.completedSemesters / formData.totalSemesters) * 100)}%)
                </p>
              )}
            </div>
          </div>
        </>
      )}

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : education ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
};

export default EducationForm;
