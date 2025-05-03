import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import PlaceholderImage from '../ui/PlaceholderImage';

interface CodeHeroSectionProps {
  name: string;
  title: string;
  bio: string;
  avatarUrl?: string;
}

const CodeHeroSection: React.FC<CodeHeroSectionProps> = ({
  name,
  title,
  bio,
  avatarUrl,
}) => {
  const { theme } = useTheme();
  const [typedBio, setTypedBio] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  // Log when avatar URL changes
  useEffect(() => {
    console.log("CodeHeroSection received avatarUrl:", avatarUrl);
  }, [avatarUrl]);

  // Typing animation for bio
  useEffect(() => {
    if (!bio) return;

    let currentIndex = 0;
    const maxLength = Math.min(bio.length, 150);

    const typingInterval = setInterval(() => {
      if (currentIndex < maxLength) {
        setTypedBio(bio.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 30);

    // Blinking cursor
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, [bio]);

  // Memoized code background to prevent re-rendering
  const CodeBackground = React.memo(() => {
    // Pre-generate the code pattern once
    const codePattern = React.useMemo(() => {
      const rows = [];
      for (let i = 0; i < 10; i++) { // Reduced from 20 rows
        const row = [];
        for (let j = 0; j < 25; j++) { // Reduced from 50 columns
          const openChar = Math.random() > 0.5 ? '{' : Math.random() > 0.5 ? '(' : Math.random() > 0.5 ? '[' : '<';
          const closeChar = openChar === '{' ? '}' : openChar === '(' ? ')' : openChar === '[' ? ']' : '>';
          const content = Math.random().toString(36).substring(2, 5);
          row.push(`${openChar}${content}${closeChar}`);
        }
        rows.push(row);
      }
      return rows;
    }, []);

    return (
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 left-0 w-full h-full font-mono text-xs">
          {codePattern.map((row, i) => (
            <div key={i} className="whitespace-nowrap overflow-hidden">
              {row.map((code, j) => (
                <span key={j} className="opacity-50">{code}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  });

  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
      {/* Code-like background elements */}
      <CodeBackground />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-2/3 space-y-6">
            {/* Terminal-like header */}
            <motion.div
              className="font-mono text-sm mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block bg-gray-800 dark:bg-gray-900 text-green-400 dark:text-green-500 px-2 py-1 rounded">
                $ portfolio --user="{name.toLowerCase().replace(/\s/g, '-')}" --mode="interactive"
              </div>
            </motion.div>

            <motion.h1
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 dark:from-blue-400 dark:to-purple-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {name}
            </motion.h1>

            <motion.h2
              className="text-xl font-medium text-muted-foreground sm:text-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="text-blue-500 dark:text-blue-400">function</span>{" "}
              <span className="text-yellow-600 dark:text-yellow-400">{title.replace(/\s/g, '')}()</span>{" "}
              <span className="text-gray-500">{"{..."}</span>
            </motion.h2>

            <motion.div
              className="font-mono text-sm md:text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <span className="text-green-600 dark:text-green-400">/**</span>
                <div className="text-gray-700 dark:text-gray-300 ml-2">
                  * {typedBio}
                  <span className={`inline-block w-2 h-4 bg-blue-500 ml-1 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}></span>
                </div>
                <span className="text-green-600 dark:text-green-400">*/</span>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-4 pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link
                to="/projects"
                className="inline-flex items-center gap-1 rounded-lg bg-primary px-5 py-2.5 text-center text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                <span className="font-mono">.viewProjects()</span>
                <ChevronRight size={16} />
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center gap-1 rounded-lg border border-input bg-background px-5 py-2.5 text-center text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span className="font-mono">.aboutMe()</span>
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="w-full md:w-1/3 flex justify-center"
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="relative">
              {/* Code editor frame */}
              <div className="absolute inset-0 -m-3 bg-gray-800 dark:bg-gray-900 rounded-xl shadow-xl"></div>

              {/* Editor header */}
              <div className="absolute top-0 left-0 right-0 h-6 bg-gray-700 dark:bg-gray-800 rounded-t-xl flex items-center px-2">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <div className="text-xs text-gray-300 ml-2 font-mono">profile.tsx</div>
              </div>

              {/* Profile image container */}
              <div className="relative w-64 h-64 rounded-lg overflow-hidden border-4 border-gray-700 dark:border-gray-800 shadow-xl mt-6">
                <PlaceholderImage
                  src={avatarUrl || '/api/about/avatar'}
                  alt={`${name}'s profile picture`}
                  className="w-full h-full object-cover"
                  fallbackSrc="/images/fallback-avatar.svg"
                  key={`avatar-${avatarUrl || 'default'}`} // Add key to force re-render when avatarUrl changes
                />

                {/* Code overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/70 flex items-end">
                  <div className="p-2 w-full font-mono text-xs text-white">
                    <div className="opacity-70">{"<Profile"}</div>
                    <div className="opacity-70 ml-4">{"name=\"" + name + "\""}</div>
                    <div className="opacity-70 ml-4">{"role=\"" + title + "\""}</div>
                    <div className="opacity-70">{"/>"}</div>
                  </div>
                </div>

                {/* Static glow effect instead of animated for better performance */}
                <div
                  className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-40"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CodeHeroSection;
