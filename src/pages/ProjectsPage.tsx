import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Search, X, ArrowRight } from 'lucide-react';
import { type IProject } from '../services/dataService';
import { useRealtimeProjects } from '../services/realtimeService';
import { useWebSocket } from '../contexts/WebSocketContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AnimatedProjectCard from '../components/projects/AnimatedProjectCard';
import ParallaxSection from '../components/ui/ParallaxSection';
import ScrollProgress from '../components/ui/ScrollProgress';
import WebSocketStatus from '../components/ui/WebSocketStatus';
import AnimatedDataUpdate from '../components/ui/AnimatedDataUpdate';
import WebSocketLoadingAnimation from '../components/ui/WebSocketLoadingAnimation';
import { useTheme } from '../contexts/ThemeContext';

const ProjectsPage = () => {
  const { projects, loading, error } = useRealtimeProjects();
  const [filteredProjects, setFilteredProjects] = useState<IProject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();
  const { isConnected } = useWebSocket();

  // Update filtered projects when projects change
  useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

  // Filter projects based on search term only
  useEffect(() => {
    let result = projects;

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        project =>
          project.title.toLowerCase().includes(term) ||
          project.description.toLowerCase().includes(term) ||
          project.longDescription.toLowerCase().includes(term)
      );
    }

    setFilteredProjects(result);
  }, [searchTerm, projects]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-0">
      {/* Scroll Progress Indicator */}
      <ScrollProgress position="top" />

      {/* Hero Section */}
      <ParallaxSection
        className="py-16 md:py-24"
        bgImage={theme === 'dark' ? 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=2070&auto=format&fit=crop' : 'https://plus.unsplash.com/premium_photo-1720287601920-ee8c503af775?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
        speed={0.3}
        overlayOpacity={theme === 'dark' ? 0.7 : 0.6}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6 text-white">
              My Projects
            </h1>
            <p className="text-xl text-white">
              Explore my portfolio of work spanning web development, mobile applications, and more.
              Each project represents a unique challenge and solution.
            </p>
          </motion.div>
        </div>
      </ParallaxSection>

      <div className="container mx-auto px-4 py-12 space-y-8">

      {/* Real-time connection indicator */}
      <div className="flex items-center justify-end mb-4">
        <WebSocketStatus />
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Technology filter removed as requested */}
      </div>

      {/* Loading Animation */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center py-6"
          >
            <WebSocketLoadingAnimation
              isLoading={loading}
              isConnected={isConnected}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <AnimatedDataUpdate
          dataKey={projects.length}
          animationType="highlight"
          className="rounded-lg"
        >
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                >
                  <AnimatedDataUpdate
                    dataKey={`${project._id}-${project.title}-${project.updatedAt}`}
                    animationType="highlight"
                    className="h-full rounded-lg"
                  >
                    <AnimatedProjectCard
                      id={project._id}
                      title={project.title}
                      description={project.description}
                      image={project.images && project.images.length > 0 ? project.images[0] : '/images/fallback-project.svg'}
                      tags={project.technologies.slice(0, 4)}
                      liveUrl={project.liveUrl}
                      githubUrl={project.githubUrl}
                      index={index}
                    />
                  </AnimatedDataUpdate>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </AnimatedDataUpdate>
      ) : (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border bg-card p-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Search size={48} className="mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold">No projects found</h3>
            <p className="mt-2 text-muted-foreground">
              No projects match your current search criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
              }}
              className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Clear search
            </button>
          </motion.div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProjectsPage;
