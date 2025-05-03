import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { ISkill } from '../../services/dataService';

// Local interface for mapping backend skills to frontend display
interface DisplaySkill {
  name: string;
  level: number; // 1-100
  category: 'frontend' | 'backend' | 'ai' | 'other';
}

// Alias DisplaySkill as Skill for use in the component
type Skill = DisplaySkill;

interface AISkillsSectionProps {
  skills?: ISkill[];
}

// Map backend skill categories to frontend categories
const mapCategory = (category: string): 'frontend' | 'backend' | 'ai' | 'other' => {
  const lowerCategory = category.toLowerCase();
  if (lowerCategory === 'frontend') return 'frontend';
  if (lowerCategory === 'backend' || lowerCategory === 'database') return 'backend';
  if (lowerCategory === 'ai/ml' || lowerCategory === 'data science') return 'ai';
  return 'other';
};

// Default skills as fallback if no skills are provided
const defaultSkills: DisplaySkill[] = [
  { name: 'React', level: 90, category: 'frontend' },
  { name: 'TypeScript', level: 85, category: 'frontend' },
  { name: 'Node.js', level: 88, category: 'backend' },
  { name: 'MongoDB', level: 80, category: 'backend' },
  { name: 'Express', level: 85, category: 'backend' },
  { name: 'TensorFlow', level: 75, category: 'ai' },
  { name: 'PyTorch', level: 70, category: 'ai' },
  { name: 'Machine Learning', level: 78, category: 'ai' },
  { name: 'NLP', level: 72, category: 'ai' },
  { name: 'Computer Vision', level: 68, category: 'ai' },
  { name: 'WebSockets', level: 82, category: 'backend' },
  { name: 'REST API', level: 92, category: 'backend' },
];

const AISkillsSection: React.FC<AISkillsSectionProps> = ({
  skills
}) => {
  const { theme } = useTheme();

  console.log('AISkillsSection received skills:', skills);
  console.log('Skills length:', skills?.length || 0);

  // Convert backend skills to display skills or use defaults if no skills provided
  const displaySkills: DisplaySkill[] = skills && skills.length > 0
    ? skills.map(skill => {
        console.log('Processing skill:', skill);
        return {
          name: skill.name,
          level: skill.level * 20, // Convert 1-5 scale to 1-100 scale
          category: mapCategory(skill.category)
        };
      })
    : defaultSkills;

  // Group skills by category
  const frontendSkills = displaySkills.filter(skill => skill.category === 'frontend');
  const backendSkills = displaySkills.filter(skill => skill.category === 'backend');
  const aiSkills = displaySkills.filter(skill => skill.category === 'ai');
  const otherSkills = displaySkills.filter(skill => skill.category === 'other');

  // Get category color
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'frontend':
        return theme === 'dark' ? 'from-blue-500 to-cyan-500' : 'from-blue-600 to-cyan-600';
      case 'backend':
        return theme === 'dark' ? 'from-green-500 to-emerald-500' : 'from-green-600 to-emerald-600';
      case 'ai':
        return theme === 'dark' ? 'from-purple-500 to-pink-500' : 'from-purple-600 to-pink-600';
      default:
        return theme === 'dark' ? 'from-gray-500 to-slate-500' : 'from-gray-600 to-slate-600';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'frontend':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        );
      case 'backend':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
            <line x1="6" y1="6" x2="6.01" y2="6"></line>
            <line x1="6" y1="18" x2="6.01" y2="18"></line>
          </svg>
        );
      case 'ai':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a8 8 0 0 0-8 8c0 1.5.5 2.5 1.5 3.5L12 22l6.5-8.5c1-1 1.5-2 1.5-3.5a8 8 0 0 0-8-8z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        );
    }
  };

  // Optimized skill bar with reduced animations
  const renderSkillBar = (skill: Skill, index: number) => {
    // Use React.memo to prevent unnecessary re-renders
    const SkillBar = React.memo(() => (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="font-medium">{skill.name}</span>
          <span className="text-sm text-muted-foreground">{skill.level}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <motion.div
            className={`h-2.5 rounded-full bg-gradient-to-r ${getCategoryColor(skill.category)}`}
            initial={{ width: 0 }}
            animate={{ width: `${skill.level}%` }}
            transition={{
              duration: 0.8,
              delay: Math.min(0.2 + index * 0.05, 1), // Cap the delay to prevent long waits
              ease: "easeOut"
            }}
          ></motion.div>
        </div>
      </div>
    ));

    return <SkillBar key={skill.name} />;
  };

  // Optimized category section with reduced animations
  const renderCategorySection = (title: string, categorySkills: Skill[], category: string) => {
    if (categorySkills.length === 0) return null;

    // Use React.memo to prevent unnecessary re-renders
    const CategorySection = React.memo(() => (
      <div className="mb-8">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-white bg-gradient-to-r ${getCategoryColor(category)} mb-4`}>
          {getCategoryIcon(category)}
          <span className="ml-2 font-medium">{title}</span>
        </div>

        <div>
          {categorySkills.map((skill, index) => renderSkillBar(skill, index))}
        </div>
      </div>
    ));

    return <CategorySection />;
  };

  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">Technical Proficiency</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My skills span across various domains with a special focus on AI and machine learning technologies.
            Here's a quantitative assessment of my technical capabilities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {renderCategorySection('Frontend Development', frontendSkills, 'frontend')}
            {renderCategorySection('Backend Development', backendSkills, 'backend')}
          </div>
          <div>
            {renderCategorySection('AI & Machine Learning', aiSkills, 'ai')}
            {renderCategorySection('Other Skills', otherSkills, 'other')}
          </div>
        </div>

        {/* AI-themed decorative elements */}
        <div className="absolute -bottom-10 right-0 w-40 h-40 opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M47.7,-57.2C59.5,-45.8,65.8,-28.6,68.9,-10.8C72.1,7.1,72.2,25.5,63.4,38.3C54.5,51.1,36.8,58.2,19.5,62.7C2.3,67.2,-14.4,69.1,-30.3,64C-46.2,58.9,-61.3,46.8,-67.8,31.1C-74.3,15.4,-72.2,-3.9,-65.1,-20.2C-58,-36.5,-45.9,-49.7,-32.1,-60.2C-18.2,-70.7,-2.6,-78.5,11.8,-76.9C26.2,-75.3,35.9,-68.5,47.7,-57.2Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="absolute -top-10 left-0 w-40 h-40 opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M54.6,-46.3C68.8,-35.3,77.5,-13.4,74.3,6.1C71.1,25.6,56,42.8,38.3,53.5C20.6,64.2,0.3,68.3,-22.2,64.5C-44.7,60.7,-69.5,48.9,-79.3,28.9C-89.1,8.9,-84,-19.4,-69.7,-38.8C-55.4,-58.2,-31.9,-68.7,-9.2,-67.1C13.5,-65.5,40.4,-57.3,54.6,-46.3Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default AISkillsSection;
