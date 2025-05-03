import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ISkill } from '../../services/dataService';
import { useRealtimeSkills } from '../../services/realtimeService';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { getAuthHeader } from '../../services/authService';
import WebSocketStatus from '../../components/ui/WebSocketStatus';
import AnimatedDataUpdate from '../../components/ui/AnimatedDataUpdate';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

const SkillsPage = () => {
  const { skills, loading, error: skillsError } = useRealtimeSkills();
  const { isConnected } = useWebSocket();
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Partial<ISkill>>({
    category: '',
    name: '',
    level: 3,
    icon: '' // Store icon URL directly
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Set error from real-time skills if present
  useEffect(() => {
    if (skillsError) {
      setError(skillsError);
    }
  }, [skillsError]);

  const handleOpenModal = (skill?: ISkill) => {
    console.log('Opening modal for skill:', skill); // Log 1
    if (skill) {
      setCurrentSkill(skill);
      setIsEditing(true);
    } else {
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
    console.log('Handling change:', name, value, type); // Log 3

    if (type === 'number') {
      setCurrentSkill(prev => ({
        ...prev,
        [name]: parseInt(value, 10)
      }));
    } else {
      setCurrentSkill(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handler for when an icon is selected from IconSearch
  const handleIconSelect = (iconUrl: string) => {
    console.log('Icon selected:', iconUrl); // Log for icon selection
    setCurrentSkill(prev => ({
      ...prev,
      icon: iconUrl
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    console.log('Submitting skill:', currentSkill); // Log 4

    try {
      if (isEditing) {
        // We don't need to manually update the skills list anymore
        // The WebSocket will handle the update
        await axios.put(`${API_URL}/api/skills/${currentSkill._id}`, currentSkill, getAuthHeader());
      } else {
        // We don't need to manually update the skills list anymore
        // The WebSocket will handle the update
        await axios.post(`${API_URL}/api/skills`, currentSkill, getAuthHeader());
      }

      handleCloseModal();
    } catch (err) {
      console.error('Error saving skill:', err);
      setError('Failed to save skill');
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

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <AnimatedDataUpdate
        dataKey={skills.length}
        animationType="highlight"
        className="bg-white dark:bg-gray-800 shadow sm:rounded-md"
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
                    dataKey={`${skill._id}-${skill.name}-${skill.level}-${skill.category}-${skill.icon}`} // Include icon in dataKey
                    animationType="highlight"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <motion.div
                          className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          {skill.icon ? (
                            <img
                              src={skill.icon} // Use the icon URL directly
                              alt={skill.name}
                              className="h-6 w-6"
                              onError={(e) => {
                                // Optional: Handle broken image links, e.g., show a default icon or the first letter
                                const target = e.target as HTMLImageElement;
                                target.onerror = null; // Prevent infinite loop
                                target.src = ''; // Clear src to prevent broken image icon
                                // You could replace this with a default icon or text
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<div class="text-gray-400 dark:text-gray-500 text-xs">${skill.name.charAt(0)}</div>`;
                                }
                              }}
                            />
                          ) : (
                            <div className="text-gray-400 dark:text-gray-500 text-xs">{skill.name.charAt(0)}</div>
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
            className="fixed inset-0 z-10 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <motion.div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.75 }}
                exit={{ opacity: 0 }}
              >
                <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900"></div>
              </motion.div>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              {/* Modal panel */}
              <motion.div
                className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <motion.h3
                        className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {isEditing ? 'Edit Skill' : 'Add Skill'}
                      </motion.h3>
                      <div className="mt-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              required
                              value={currentSkill.name}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </motion.div>

                          <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Category
                            </label>
                            <select
                              name="category"
                              id="category"
                              required
                              value={currentSkill.category}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                              <option value="">Select a category</option>
                              <option value="Frontend">Frontend</option>
                              <option value="Backend">Backend</option>
                              <option value="Database">Database</option>
                              <option value="DevOps">DevOps</option>
                              <option value="Mobile">Mobile</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Level (1-5)
                            </label>
                            <input
                              type="number"
                              name="level"
                              id="level"
                              required
                              min="1"
                              max="5"
                              value={currentSkill.level}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </form> {/* Closing form tag */}
                      </div> {/* Closing div for mt-4 */}
                    </div> {/* Closing div for sm:mt-0 */}
                  </div> {/* Closing div for sm:flex */}
                </div> {/* Closing div for bg-white */}
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <motion.button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
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
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillsPage;
