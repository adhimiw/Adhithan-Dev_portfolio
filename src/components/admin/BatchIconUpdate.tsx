import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand, X, Check, AlertTriangle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { getAuthHeader } from '../../services/authService';
import { suggestIconForSkill } from '../../utils/iconUtils';
import { ISkill } from '../../services/dataService';

interface BatchIconUpdateProps {
  skills: ISkill[];
  onComplete: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || '';

const BatchIconUpdate: React.FC<BatchIconUpdateProps> = ({ skills, onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    updated: number;
    skipped: number;
    failed: number;
  }>({
    updated: 0,
    skipped: 0,
    failed: 0,
  });

  const handleBatchUpdate = async () => {
    if (skills.length === 0) return;
    
    setProcessing(true);
    setProgress(0);
    setResults({
      updated: 0,
      skipped: 0,
      failed: 0,
    });
    
    let updated = 0;
    let skipped = 0;
    let failed = 0;
    
    // Process skills one by one
    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i];
      
      // Skip skills that already have icons
      if (skill.icon) {
        skipped++;
        setResults(prev => ({ ...prev, skipped }));
        setProgress(Math.round(((i + 1) / skills.length) * 100));
        continue;
      }
      
      try {
        // Suggest an icon based on skill name
        const suggestedIcon = suggestIconForSkill(skill.name);
        
        // Update the skill with the suggested icon
        await axios.put(
          `${API_URL}/api/skills/${skill._id}`,
          { ...skill, icon: suggestedIcon },
          getAuthHeader()
        );
        
        updated++;
        setResults(prev => ({ ...prev, updated }));
      } catch (error) {
        console.error(`Error updating icon for skill ${skill.name}:`, error);
        failed++;
        setResults(prev => ({ ...prev, failed }));
      }
      
      // Update progress
      setProgress(Math.round(((i + 1) / skills.length) * 100));
    }
    
    // Wait a bit before finishing to show the final progress
    setTimeout(() => {
      setProcessing(false);
    }, 500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      >
        <Wand className="h-4 w-4 mr-2" />
        Auto-Update Icons
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                className="fixed inset-0 transition-opacity"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.75 }}
                exit={{ opacity: 0 }}
              >
                <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
              </motion.div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

              <motion.div
                className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 sm:mx-0 sm:h-10 sm:w-10">
                      <Wand className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                        Auto-Update Skill Icons
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          This will automatically suggest and update icons for all skills that don't have icons yet.
                          {skills.filter(skill => !skill.icon).length === 0 ? (
                            <span className="block mt-2 text-amber-600 dark:text-amber-400">
                              All skills already have icons. There's nothing to update.
                            </span>
                          ) : (
                            <span className="block mt-2">
                              <strong>{skills.filter(skill => !skill.icon).length}</strong> out of <strong>{skills.length}</strong> skills will be updated.
                            </span>
                          )}
                        </p>
                        
                        {processing && (
                          <div className="mt-4">
                            <div className="relative pt-1">
                              <div className="flex mb-2 items-center justify-between">
                                <div>
                                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200 dark:text-purple-200 dark:bg-purple-800">
                                    Progress
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs font-semibold inline-block text-purple-600 dark:text-purple-400">
                                    {progress}%
                                  </span>
                                </div>
                              </div>
                              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200 dark:bg-purple-900">
                                <motion.div
                                  style={{ width: `${progress}%` }}
                                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progress}%` }}
                                  transition={{ duration: 0.3 }}
                                ></motion.div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-md">
                                <div className="text-xs text-green-600 dark:text-green-400">Updated</div>
                                <div className="text-lg font-semibold text-green-700 dark:text-green-300">{results.updated}</div>
                              </div>
                              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-md">
                                <div className="text-xs text-yellow-600 dark:text-yellow-400">Skipped</div>
                                <div className="text-lg font-semibold text-yellow-700 dark:text-yellow-300">{results.skipped}</div>
                              </div>
                              <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
                                <div className="text-xs text-red-600 dark:text-red-400">Failed</div>
                                <div className="text-lg font-semibold text-red-700 dark:text-red-300">{results.failed}</div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {!processing && results.updated > 0 && (
                          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                            <div className="flex items-center text-green-700 dark:text-green-300">
                              <Check className="h-5 w-5 mr-2" />
                              <span className="font-medium">Update Complete!</span>
                            </div>
                            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                              Successfully updated {results.updated} skill icons.
                              {results.failed > 0 && (
                                <span className="text-amber-600 dark:text-amber-400 block mt-1">
                                  {results.failed} skills could not be updated.
                                </span>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  {!processing && results.updated === 0 ? (
                    <button
                      type="button"
                      onClick={handleBatchUpdate}
                      disabled={processing || skills.filter(skill => !skill.icon).length === 0}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? (
                        <span className="flex items-center">
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Processing...
                        </span>
                      ) : (
                        'Update Icons'
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onComplete();
                      }}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Done
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BatchIconUpdate;
