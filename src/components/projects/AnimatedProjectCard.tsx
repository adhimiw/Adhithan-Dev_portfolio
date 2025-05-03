import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import FloatingCard from '../ui/FloatingCard';
import PlaceholderImage from '../ui/PlaceholderImage';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  index: number;
}

const AnimatedProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  image,
  tags,
  liveUrl,
  githubUrl,
  index,
}) => {
  const { theme } = useTheme();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      custom={index}
      className="h-full"
    >
      <FloatingCard
        className="h-full rounded-xl overflow-hidden"
        depth={10}
        borderGlow={true}
      >
        <div className="flex flex-col h-full">
          {/* Project Image */}
          <div className="relative overflow-hidden h-48 border-0">
            <PlaceholderImage
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 border-0"
              fallbackWidth={400}
              fallbackHeight={200}
            />

            {/* Overlay with links */}
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full ${
                    theme === 'dark'
                      ? 'bg-primary text-white hover:bg-primary/80'
                      : 'bg-primary text-white hover:bg-primary/80'
                  } transition-colors`}
                  aria-label="View live site"
                >
                  <ExternalLink size={20} />
                </a>
              )}

              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full ${
                    theme === 'dark'
                      ? 'bg-primary text-white hover:bg-primary/80'
                      : 'bg-primary text-white hover:bg-primary/80'
                  } transition-colors`}
                  aria-label="View GitHub repository"
                >
                  <Github size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Project Content */}
          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold mb-2">{title}</h3>

            <p className="text-muted-foreground mb-4 line-clamp-3">{description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-auto mb-4">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className={`px-2 py-1 text-xs rounded-full ${
                    theme === 'dark'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* View Details Link */}
            <Link
              to={`/projects/${id}`}
              className={`inline-flex items-center text-sm font-medium ${
                theme === 'dark' ? 'text-primary hover:text-primary/80' : 'text-primary hover:text-primary/80'
              } transition-colors mt-auto`}
            >
              View Details
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </FloatingCard>
    </motion.div>
  );
};

export default AnimatedProjectCard;
