import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ExternalLink, Check, Lightbulb } from 'lucide-react';
import axios from 'axios';
import { suggestIconForSkill } from '../../utils/iconUtils';

// Icon libraries we'll use
const ICON_LIBRARIES = {
  SIMPLE_ICONS: 'Simple Icons',
  DEVICON: 'Devicon',
  SKILL_ICONS: 'Skill Icons',
};

interface IconSearchProps {
  onSelectIcon: (iconUrl: string) => void;
  initialValue?: string;
  skillName?: string;
}

interface IconResult {
  name: string;
  url: string;
  source: string;
}

const IconSearch: React.FC<IconSearchProps> = ({ onSelectIcon, initialValue = '', skillName = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<IconResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(initialValue);
  const [activeLibrary, setActiveLibrary] = useState<string>(ICON_LIBRARIES.SIMPLE_ICONS);
  const [suggestedIcon, setSuggestedIcon] = useState<string | null>(null);

  // Generate a suggestion based on skill name
  useEffect(() => {
    if (skillName && !initialValue) {
      const suggestion = suggestIconForSkill(skillName);
      setSuggestedIcon(suggestion);
    }
  }, [skillName, initialValue]);

  // Search for icons when the search term changes
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setResults([]);
      return;
    }

    const searchIcons = async () => {
      setLoading(true);
      try {
        let icons: IconResult[] = [];

        // Search in Simple Icons
        if (activeLibrary === ICON_LIBRARIES.SIMPLE_ICONS) {
          const simpleIconsUrl = `https://cdn.simpleicons.org`;

          // Fetch the simple-icons JSON data
          const response = await axios.get('https://unpkg.com/simple-icons@latest/icons.json');
          const data = response.data;
          let filteredIcons: IconResult[] = []; // Initialize as empty array

          // Check if data is an array
          if (Array.isArray(data)) {
            // Filter icons based on search term directly from the array
            filteredIcons = data
              .filter((icon: any) =>
                icon && icon.title && icon.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .slice(0, 20) // Limit results
              .map((icon: any) => ({
                name: icon.title,
                // Assuming the slug can be derived or is available in the icon object
                // If 'slug' isn't directly available, we might need to adjust how the URL is constructed
                // For now, let's assume a 'slug' property exists or derive it if possible
                url: `${simpleIconsUrl}/${icon.slug || icon.title.toLowerCase().replace(/\s+/g, '')}.svg`, // Use slug or generate one
                source: ICON_LIBRARIES.SIMPLE_ICONS
              }));
          } else {
            console.warn('Simple Icons data format is not an array:', data);
          }

          icons = [...icons, ...filteredIcons];
        }

        // Search in Devicon
        if (activeLibrary === ICON_LIBRARIES.DEVICON) {
          const deviconUrl = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

          // Fetch the devicon JSON data
          const response = await axios.get('https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.json');
          const data = response.data;

          // Filter icons based on search term
          const filteredIcons = data
            .filter((icon: any) =>
              icon.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(0, 20)
            .flatMap((icon: any) => {
              // Get the colored version if available, otherwise use the plain version
              const versions = icon.versions.svg || [];
              const preferredVersion = versions.includes('original') ? 'original' :
                                      versions.includes('plain') ? 'plain' : versions[0];

              if (!preferredVersion) return [];

              return {
                name: icon.name,
                url: `${deviconUrl}/${icon.name}/${icon.name}-${preferredVersion}.svg`,
                source: ICON_LIBRARIES.DEVICON
              };
            });

          icons = [...icons, ...filteredIcons];
        }

        // Search in Skill Icons
        if (activeLibrary === ICON_LIBRARIES.SKILL_ICONS) {
          const skillIconsUrl = 'https://skillicons.dev/icons';

          // Predefined list of common skill icons
          const commonSkills = [
            'js', 'ts', 'react', 'vue', 'angular', 'nodejs', 'python', 'java', 'cpp',
            'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'dart', 'flutter', 'aws',
            'azure', 'gcp', 'firebase', 'mongodb', 'mysql', 'postgresql', 'redis',
            'docker', 'kubernetes', 'git', 'github', 'gitlab', 'bitbucket', 'html',
            'css', 'sass', 'tailwind', 'bootstrap', 'materialui', 'figma', 'xd',
            'sketch', 'illustrator', 'photoshop', 'blender', 'unity', 'unreal'
          ];

          // Filter icons based on search term
          const filteredIcons = commonSkills
            .filter(skill =>
              skill.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(0, 20)
            .map(skill => ({
              name: skill.charAt(0).toUpperCase() + skill.slice(1),
              url: `${skillIconsUrl}/${skill}.svg`,
              source: ICON_LIBRARIES.SKILL_ICONS
            }));

          icons = [...icons, ...filteredIcons];
        }

        setResults(icons);
      } catch (error) {
        console.error('Error searching for icons:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the search
    const timer = setTimeout(() => {
      searchIcons();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, activeLibrary]);

  // Handle icon selection
  const handleSelectIcon = (iconUrl: string) => {
    setSelectedIcon(iconUrl);
    onSelectIcon(iconUrl);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Search for an icon
        </label>

        {/* Library selector */}
        <div className="flex space-x-2 mb-2">
          {Object.values(ICON_LIBRARIES).map((library) => (
            <button
              key={library}
              onClick={() => setActiveLibrary(library)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                activeLibrary === library
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {library}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for icons..."
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Suggested icon */}
      {suggestedIcon && !selectedIcon && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-700 rounded-md p-1">
            <img src={suggestedIcon} alt="Suggested icon" className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center text-sm text-amber-700 dark:text-amber-400">
              <Lightbulb className="h-4 w-4 mr-1" />
              <span>Suggested icon</span>
            </div>
            <div className="text-xs text-amber-600 dark:text-amber-500 truncate">{suggestedIcon}</div>
          </div>
          <button
            onClick={() => {
              setSelectedIcon(suggestedIcon);
              onSelectIcon(suggestedIcon);
              setSuggestedIcon(null);
            }}
            className="px-2 py-1 text-xs bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-300 rounded hover:bg-amber-200 dark:hover:bg-amber-700"
          >
            Use
          </button>
        </motion.div>
      )}

      {/* Selected icon preview */}
      {selectedIcon && (
        <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
          <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-700 rounded-md p-1">
            <img src={selectedIcon} alt="Selected icon" className="w-6 h-6" />
          </div>
          <div className="flex-1 text-sm truncate">{selectedIcon}</div>
          <button
            onClick={() => {
              setSelectedIcon(null);
              onSelectIcon('');
            }}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Search results */}
      <div className="mt-2">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : results.length > 0 ? (
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {results.length} results from {activeLibrary}
            </div>
            <div className="grid grid-cols-4 gap-2">
              <AnimatePresence>
                {results.map((icon, index) => (
                  <motion.div
                    key={`${icon.url}-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className={`relative p-2 border rounded-md cursor-pointer group hover:border-indigo-500 dark:hover:border-indigo-400 ${
                      selectedIcon === icon.url
                        ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => handleSelectIcon(icon.url)}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-700 rounded-md p-1 mb-1">
                        <img src={icon.url} alt={icon.name} className="w-6 h-6" />
                      </div>
                      <div className="text-xs text-center truncate w-full">{icon.name}</div>
                    </div>

                    {/* Selection indicator */}
                    {selectedIcon === icon.url && (
                      <div className="absolute -top-1 -right-1 bg-indigo-500 text-white rounded-full p-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                    )}

                    {/* Preview link */}
                    <a
                      href={icon.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3 w-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    </a>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : searchTerm.length >= 2 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            No icons found. Try a different search term or library.
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default IconSearch;
