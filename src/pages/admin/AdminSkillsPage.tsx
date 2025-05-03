import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ISkill } from '../../services/dataService';
import { useRealtimeSkills } from '../../services/realtimeService';
import { getAuthHeader } from '../../services/authService';
import WebSocketStatus from '../../components/ui/WebSocketStatus';
import AnimatedDataUpdate from '../../components/ui/AnimatedDataUpdate';
// import IconSearch from '../../components/admin/IconSearch'; // Removed IconSearch import
import BatchIconUpdate from '../../components/admin/BatchIconUpdate';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

// Define common skill categories
const skillCategories = [
  "Frontend", "Backend", "Database", "DevOps", "Mobile", "AI/ML", "Data Science", "Cloud", "Testing", "Other"
];

// Define predefined skills for suggestions
const predefinedSkills = [
  // Frontend
  "HTML", "CSS", "JavaScript", "TypeScript", "React", "Vue", "Angular", "Svelte", "jQuery", "Bootstrap", "Tailwind CSS", "Sass", "Less",
  // Backend
  "Node.js", "Express", "Python (Backend)", "Django", "Flask", "Java", "Spring", "Ruby", "Rails", "PHP", "Laravel", "Go", "Rust", "C#", ".NET",
  // Database
  "SQL (Database)", "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Oracle", "Microsoft SQL Server", "Firebase Realtime Database", "Firestore",
  // DevOps
  "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud Platform (GCP)", "Jenkins", "Git", "GitHub Actions", "GitLab CI", "Terraform", "Ansible",
  // Mobile
  "React Native", "Flutter", "Swift", "Kotlin", "Objective-C", "Java (Android)",
  // AI/ML/Data Science
  "Python (Data Science)", "R", "TensorFlow", "PyTorch", "Scikit-learn", "Keras", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter", "SQL (Data Science)", "Machine Learning", "Deep Learning", "Natural Language Processing (NLP)", "Computer Vision", "Data Analysis", "Data Visualization", "Big Data", "Apache Spark", "Hadoop",
  // Cloud (Specific Services)
  "AWS EC2", "AWS S3", "AWS Lambda", "AWS RDS", "Azure Virtual Machines", "Azure Blob Storage", "Azure Functions", "GCP Compute Engine", "GCP Cloud Storage", "GCP Cloud Functions",
  // Testing
  "Jest", "Mocha", "Chai", "Cypress", "Selenium", "JUnit", "PyTest",
  // Other
  "GraphQL", "REST API", "WebSockets", "Linux", "Bash", "PowerShell", "WordPress", "Shopify"
]
  .filter((value, index, self) => self.indexOf(value) === index) // Remove any remaining duplicates
  .sort(); // Sort alphabetically for better usability


const AdminSkillsPage = () => {
  const { skills, loading, error: skillsError } = useRealtimeSkills();
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Partial<ISkill>>({
    category: '',
    name: '',
    level: 3,
    icon: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Set error from real-time skills if present
  useEffect(() => {
    if (skillsError) {
      setError(skillsError);
    }
  }, [skillsError]);

  // Add keyboard event listener for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleCloseModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  // Listen for refresh events from the chatbot
  useEffect(() => {
    const handleRefreshSkills = async () => {
      console.log('Received refreshSkills event, refreshing skills data');
      try {
        // Fetch the latest skills data
        const response = await axios.get(`${API_URL}/api/skills`, getAuthHeader());
        console.log('Refreshed skills data:', response.data);
        // The data will be automatically updated via WebSocket, but this forces an immediate refresh
      } catch (err) {
        console.error('Error refreshing skills:', err);
      }
    };

    // Add event listener
    window.addEventListener('refreshSkills', handleRefreshSkills);

    // Clean up
    return () => {
      window.removeEventListener('refreshSkills', handleRefreshSkills);
    };
  }, []);

  const handleOpenModal = (skill?: ISkill) => {
    // Clear any previous errors
    setError(null);

    if (skill) {
      console.log('Editing skill:', skill);
      // Make a copy of the skill to avoid direct mutation
      setCurrentSkill({...skill});
      setIsEditing(true);
    } else {
      console.log('Creating new skill');
      // Reset form for new skill
      setCurrentSkill({
        category: '',
        name: '',
        level: 3,
        icon: ''
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Log the change for debugging
    console.log(`Field changed: ${name}, value: ${value}, type: ${type}`);

    if (type === 'number') {
      // For number inputs, convert to integer
      const numValue = value === '' ? 3 : parseInt(value, 10);
      setCurrentSkill(prev => ({
        ...prev,
        [name]: numValue
      }));
    } else {
      // For text and select inputs
      setCurrentSkill(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Validate form data
    if (!currentSkill.name || !currentSkill.category || !currentSkill.level) {
      console.error('Validation failed:', currentSkill);
      setError('Please fill in all required fields');
      setSaving(false);
      return;
    }

    console.log('Submitting skill data:', currentSkill);

    try {
      const authHeader = getAuthHeader();
      console.log('Auth header:', authHeader);

      if (isEditing) {
        console.log(`Updating skill with ID: ${currentSkill._id}`);
        // We don't need to manually update the skills list anymore
        // The WebSocket will handle the update
        const response = await axios.put(
          `${API_URL}/api/skills/${currentSkill._id}`,
          currentSkill,
          authHeader
        );
        console.log('Update response:', response.data);
      } else {
        console.log('Creating new skill');
        // We don't need to manually update the skills list anymore
        // The WebSocket will handle the update
        const response = await axios.post(
          `${API_URL}/api/skills`,
          currentSkill,
          authHeader
        );
        console.log('Create response:', response.data);
      }

      // Clear any previous errors
      setError(null);
      handleCloseModal();
    } catch (err: any) {
      console.error('Error saving skill:', err);
      // More detailed error message
      if (err.response) {
        console.error('Response error data:', err.response.data);
        setError(`Failed to save skill: ${err.response.data.msg || err.response.statusText || 'Unknown error'}`);
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError(`Failed to save skill: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    try {
      // We don't need to manually update the skills list anymore
      // The WebSocket will handle the update
      await axios.delete(`${API_URL}/api/skills/${id}`, getAuthHeader());
    } catch (err) {
      console.error('Error deleting skill:', err);
      setError('Failed to delete skill');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <motion.h1
            className="text-2xl font-semibold text-gray-900 dark:text-white mr-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Skills
          </motion.h1>
          <WebSocketStatus size="md" />
        </div>
        <div className="flex space-x-2">
          <BatchIconUpdate
            skills={skills}
            onComplete={() => {
              // The WebSocket will handle the updates
            }}
          />
          <motion.button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </motion.button>
        </div>
      </div>

      {error && (
        <motion.div
          className="mb-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md shadow-sm"
          role="alert"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd"></path>
            </svg>
            <span className="font-medium">{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 right-0 p-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
          >
            <span className="sr-only">Close</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </motion.div>
      )}

      <AnimatedDataUpdate
        dataKey={skills.length}
        animationType="highlight"
        className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md"
      >
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {skills.length === 0 ? (
            <motion.li
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
            >
              No skills found. Add your first skill!
            </motion.li>
          ) : (
            <AnimatePresence initial={false}>
              {skills.map((skill, index) => (
                <motion.li
                  key={skill._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    delay: index * 0.05
                  }}
                  className="px-6 py-4"
                >
                  <AnimatedDataUpdate
                    dataKey={`${skill._id}-${skill.name}-${skill.level}-${skill.category}`}
                    animationType="highlight"
                    className="rounded-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <motion.div
                          className="flex-shrink-0 h-10 w-10 rounded-md bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          {skill.icon ? (
                            <motion.img
                              src={skill.icon}
                              alt={skill.name}
                              className="h-6 w-6"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              whileHover={{ scale: 1.2 }}
                              onError={(e) => {
                                // If image fails to load, show the first letter instead
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  e.currentTarget.style.display = 'none';
                                  parent.innerHTML = `<div class="flex items-center justify-center h-full w-full text-gray-400 dark:text-gray-500 text-xs">${skill.name.charAt(0).toUpperCase()}</div>`;
                                }
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-6 w-6 bg-gray-100 dark:bg-gray-600 rounded-sm text-gray-400 dark:text-gray-500 text-xs">
                              {skill.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </motion.div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{skill.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {skill.category} • Level: {skill.level}/5
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <motion.button
                          onClick={() => handleOpenModal(skill)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(skill._id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </motion.button>
                      </div>
                    </div>
                  </AnimatedDataUpdate>
                </motion.li>
              ))}
            </AnimatePresence>
          )}
        </ul>
      </AnimatedDataUpdate>

      {/* Skill Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ backdropFilter: 'none', filter: 'none' }}
          >
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0" style={{ backdropFilter: 'none', filter: 'none' }}>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseModal} // Close on backdrop click
              ></motion.div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              {/* Modal panel */}
              <motion.div
                className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50 modal-content"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                style={{ backdropFilter: 'none', filter: 'none', WebkitBackdropFilter: 'none', WebkitFilter: 'none' }}
              >
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4" style={{ backdropFilter: 'none', filter: 'none' }}>
                  <div className="sm:flex sm:items-start" style={{ backdropFilter: 'none', filter: 'none' }}>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" style={{ backdropFilter: 'none', filter: 'none' }}>
                      <div className="flex justify-between items-center">
                        <motion.h3
                          className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          {isEditing ? 'Edit Skill' : 'Add Skill'}
                        </motion.h3>

                        <motion.button
                          type="button"
                          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                          onClick={handleCloseModal}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <span className="sr-only">Close</span>
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </motion.button>
                      </div>

                      {error && (
                        <motion.div
                          className="mt-2 p-2 text-sm bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-md"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd"></path>
                            </svg>
                            <span>{error}</span>
                          </div>
                        </motion.div>
                      )}
                      <div className="mt-4" style={{ backdropFilter: 'none', filter: 'none' }}>
                        <form id="skillForm" onSubmit={handleSubmit} className="space-y-4" style={{ backdropFilter: 'none', filter: 'none' }}>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              required
                              value={currentSkill.name || ''}
                              onChange={handleChange}
                              list="predefinedSkills" // Link to datalist
                              disabled={saving}
                              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              style={{ backdropFilter: 'none', filter: 'none' }}
                            />
                            {/* Datalist for suggestions */}
                            <datalist id="predefinedSkills">
                              {predefinedSkills.map((skill, index) => (
                                <option key={`skill-${index}-${skill}`} value={skill} />
                              ))}
                            </datalist>
                          </motion.div>

                          <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Category <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="category"
                              id="category"
                              required
                              value={currentSkill.category || ''}
                              onChange={handleChange}
                              disabled={saving}
                              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              style={{ backdropFilter: 'none', filter: 'none' }}
                            >
                              <option value="">Select a category</option>
                              {skillCategories.map(category => (
                                <option key={category} value={category}>{category}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Level (1-5) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name="level"
                              id="level"
                              required
                              min="1"
                              max="5"
                              value={currentSkill.level || 3}
                              onChange={handleChange}
                              disabled={saving}
                              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              style={{ backdropFilter: 'none', filter: 'none' }}
                            />
                          </div>

                          <div>
                            <label htmlFor="icon" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Icon URL (optional)
                            </label>
                            <input
                              type="text"
                              name="icon"
                              id="icon"
                              value={currentSkill.icon || ''}
                              onChange={handleChange}
                              placeholder="https://example.com/icon.svg"
                              disabled={saving}
                              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              style={{ backdropFilter: 'none', filter: 'none' }}
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              Enter a URL to an SVG or PNG icon (optional)
                            </p>
                          </div>

                          {/* Hidden submit button to enable form submission on Enter key */}
                          <button type="submit" className="hidden">Submit</button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse" style={{ backdropFilter: 'none', filter: 'none' }}>
                <motion.button
                  type="submit"
                  form="skillForm"
                  disabled={saving}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  style={{ backdropFilter: 'none', filter: 'none' }}
                >
                  {saving ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : 'Save'}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleCloseModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  style={{ backdropFilter: 'none', filter: 'none' }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSkillsPage;
