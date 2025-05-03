import React, { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { type IProject, type IAbout, type IContact, type ISkill } from '../services/dataService';
import { useRealtimeSkills } from '../services/realtimeService';
import { useAboutQuery, useProjectsQuery, useContactQuery } from '../hooks/useQueryData';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CodeHeroSection from '../components/home/CodeHeroSection';
import AISkillsSection from '../components/home/AISkillsSection';
import SocialMediaCards from '../components/home/SocialMediaCards';
import NeuralNetworkBackground from '../components/ui/NeuralNetworkBackground';
import RefreshDataButton from '../components/ui/RefreshDataButton';
import Scene3D from '../components/3d/Scene3D';
import { Button } from '../components/ui/shadcn/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/shadcn/Card';
import { MaterialUIThemeProvider } from '../contexts/MaterialUIThemeContext';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error in component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

const HomePage = () => {
  const { skills, loading: skillsLoading, error: skillsError } = useRealtimeSkills();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Use React Query hooks for data fetching
  const {
    data: about,
    isLoading: isAboutLoading,
    error: aboutError
  } = useAboutQuery();

  const {
    data: projectsData,
    isLoading: isProjectsLoading,
    error: projectsError
  } = useProjectsQuery();

  const {
    data: contact,
    isLoading: isContactLoading,
    error: contactError
  } = useContactQuery();

  // Filter featured projects
  const projects = projectsData?.filter(project => project.featured) || [];

  // Remove excessive console logging for better performance

  // Show loading spinner if any data is still loading
  if (isAboutLoading || isProjectsLoading || isContactLoading || skillsLoading) {
    return <LoadingSpinner />;
  }

  // Memoize components to prevent unnecessary re-renders
  const MemoizedNeuralNetworkBackground = React.memo(() => (
    <NeuralNetworkBackground
      className="fixed inset-0 z-0"
      particleCount={25} // Reduced from default 30
      animated={false} // Disable animation for better performance
    />
  ));

  const MemoizedCodeHeroSection = React.memo(() => (
    <CodeHeroSection
      name={about?.name || 'Adhithan R'}
      title={about?.title || 'Full Stack Developer & AI Specialist'}
      bio={about?.bio || 'Passionate and skilled Full Stack Developer with a strong foundation in computer science and a specialization in AI. Eager to contribute to innovative projects and create impactful solutions.'}
      avatarUrl={about?.avatar}
    />
  ));

  return (
    <MaterialUIThemeProvider>
      <div className="relative space-y-0">
        {/* Neural Network Background - Memoized */}
        <MemoizedNeuralNetworkBackground />

        {/* Hero Section */}
        <div className="relative z-10">
          <div className="absolute top-4 right-4 z-20">
            <RefreshDataButton dataType="ABOUT" showText={true} />
          </div>
          <MemoizedCodeHeroSection />
        </div>

        {/* AI Skills Section */}
        <div className="relative z-10 bg-gradient-to-b from-white to-cyan-50/80 dark:from-black dark:to-gray-900">
          <AISkillsSection skills={skills} />
        </div>

        {/* 3D Scene Section */}
        <section className="relative z-10 py-16 bg-gradient-to-b from-cyan-50/80 to-white dark:from-gray-900 dark:to-black">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2">
                <motion.h2
                  className="text-2xl font-bold tracking-tight mb-4 sm:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 to-teal-700 dark:from-violet-500 dark:to-purple-500"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  My Portfolio Showcase
                </motion.h2>

                <motion.p
                  className="text-lg text-cyan-800 dark:text-purple-300 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Welcome to my professional portfolio, showcasing my projects, skills, and experience. This interactive platform highlights my work and expertise in web development and design.
                </motion.p>

                <motion.div
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {['Web Development', 'UI/UX Design', 'Responsive Design', 'MongoDB', 'React', 'Node.js'].map((tech, index) => (
                    <span
                      key={tech}
                      className="inline-flex items-center rounded-full bg-cyan-100 dark:bg-purple-900/50 px-3 py-1 text-sm font-medium text-cyan-700 dark:text-purple-300"
                    >
                      {tech}
                    </span>
                  ))}
                </motion.div>
              </div>

              <div className="w-full md:w-1/2">
                <motion.div
                  className="relative rounded-xl overflow-hidden shadow-2xl"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  {/* Portfolio showcase image */}
                  <div className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-xl group">
                    <img
                      src="/images/portfolio-showcase.jpg"
                      alt="Portfolio Showcase"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      onError={(e) => {
                        // Fallback to a placeholder if the image doesn't exist
                        e.currentTarget.src = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80";
                      }}
                    />

                    {/* Overlay with animated code-like elements */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-70
                                    transition-all duration-500 group-hover:opacity-90">
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 p-6 font-mono text-xs text-white/80"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          staggerChildren: 0.1,
                          delayChildren: 0.3
                        }}
                      >
                        {/* Tagline that appears at the top */}
                        <motion.div
                          className="absolute top-6 left-6 right-6 font-mono text-sm text-cyan-400 font-bold"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.7 }}
                        >
                          <motion.div
                            animate={{
                              color: ["#22d3ee", "#c084fc", "#4ade80", "#facc15", "#22d3ee"],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 8,
                              ease: "linear"
                            }}
                          >
                            // Turning ideas into elegant code
                          </motion.div>
                        </motion.div>

                        {/* Comment line with function */}
                        <motion.div
                          className="mb-3 text-gray-400 text-[10px]"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 }}
                        >
                          {"/* Function to create amazing web experiences */"}
                        </motion.div>

                        <motion.div
                          className="mb-1 opacity-80 transition-colors duration-300 hover:text-cyan-400"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{
                            scale: 1.05,
                            color: "#22d3ee",
                            textShadow: "0 0 8px rgba(34, 211, 238, 0.5)"
                          }}
                        >
                          {"<Portfolio>"}
                        </motion.div>

                        <motion.div
                          className="ml-4 opacity-90 transition-all duration-300 hover:text-purple-400 hover:ml-6"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          whileHover={{
                            scale: 1.05,
                            color: "#c084fc",
                            textShadow: "0 0 8px rgba(192, 132, 252, 0.5)"
                          }}
                        >
                          {"<Projects />"}
                        </motion.div>

                        <motion.div
                          className="ml-4 opacity-90 transition-all duration-300 hover:text-green-400 hover:ml-6"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          whileHover={{
                            scale: 1.05,
                            color: "#4ade80",
                            textShadow: "0 0 8px rgba(74, 222, 128, 0.5)"
                          }}
                        >
                          {"<Skills />"}
                        </motion.div>

                        <motion.div
                          className="ml-4 opacity-90 transition-all duration-300 hover:text-yellow-400 hover:ml-6"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 }}
                          whileHover={{
                            scale: 1.05,
                            color: "#facc15",
                            textShadow: "0 0 8px rgba(250, 204, 21, 0.5)"
                          }}
                        >
                          {"<Experience />"}
                        </motion.div>

                        <motion.div
                          className="opacity-80 transition-colors duration-300 hover:text-cyan-400"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.4 }}
                          whileHover={{
                            scale: 1.05,
                            color: "#22d3ee",
                            textShadow: "0 0 8px rgba(34, 211, 238, 0.5)"
                          }}
                        >
                          {"</Portfolio>"}
                        </motion.div>

                        {/* Function-like code at the bottom */}
                        <motion.div
                          className="mt-3 text-[10px] text-gray-400"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.6 }}
                        >
                          <span className="text-blue-400">function</span> <span className="text-yellow-400">createImpact</span>() {"{"}
                          <span className="ml-2 block">
                            <span className="text-purple-400">return</span> <span className="text-green-400">"innovative solutions"</span>;
                          </span>
                          {"}"}
                        </motion.div>
                      </motion.div>

                      {/* Animated cursor */}
                      <motion.div
                        className="absolute bottom-[7.5rem] left-[4.5rem] w-2 h-4 bg-white/70"
                        animate={{
                          opacity: [1, 0, 1],
                          transition: {
                            repeat: Infinity,
                            duration: 1
                          }
                        }}
                      />

                      {/* Animated typing indicator */}
                      <motion.div
                        className="absolute top-[3.5rem] right-6 px-2 py-1 bg-gray-800/50 rounded text-[10px] text-gray-400 border border-gray-700/50"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 1 }}
                      >
                        <motion.span
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          coding in progress...
                        </motion.span>
                      </motion.div>
                    </div>

                    {/* Decorative elements with hover animations */}
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <motion.div
                        className="w-3 h-3 rounded-full bg-red-500"
                        whileHover={{ scale: 1.5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                      <motion.div
                        className="w-3 h-3 rounded-full bg-yellow-500"
                        whileHover={{ scale: 1.5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                      <motion.div
                        className="w-3 h-3 rounded-full bg-green-500"
                        whileHover={{ scale: 1.5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="relative z-10 py-16 bg-gradient-to-b from-white to-cyan-50 dark:from-black dark:to-gray-900">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <motion.h2
                className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 to-teal-700 dark:from-violet-500 dark:to-purple-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Featured Projects
              </motion.h2>
              <motion.p
                className="text-cyan-800 dark:text-purple-300 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Explore my latest work showcasing innovative solutions and technical expertise
              </motion.p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <Card
                  key={project._id}
                  animated={true}
                  className="group overflow-hidden backdrop-blur-sm border border-white/10 dark:bg-gray-900/30 h-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 relative">
                    {project.images && project.images.length > 0 ? (
                      <>
                        <img
                          src={project.images[0]}
                          alt={project.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-80 transition-opacity duration-300"></div>
                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <i className="fas fa-image text-4xl opacity-30"></i>
                      </div>
                    )}

                    {/* Project title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold text-white text-xl">{project.title}</h3>
                    </div>
                  </div>

                  <CardContent className="space-y-3 p-5">
                    <CardDescription className="text-sm">
                      {project.description.substring(0, 100)}
                      {project.description.length > 100 ? '...' : ''}
                    </CardDescription>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <motion.span
                          key={`${project._id}-${tech}`}
                          className="inline-flex items-center rounded-full bg-cyan-100 dark:bg-purple-900/50 px-2.5 py-0.5 text-xs font-medium text-cyan-700 dark:text-purple-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                      {project.technologies.length > 3 && (
                        <motion.span
                          className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          +{project.technologies.length - 3}
                        </motion.span>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button
                      variant="link"
                      className="p-0 h-auto font-mono"
                      animated={true}
                      asChild
                    >
                      <Link to={`/projects/${project._id}`}>
                        <span>View Details</span>
                        <i className="fas fa-chevron-right ml-1 text-xs"></i>
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                variant="gradient"
                size="lg"
                className="rounded-full px-8 py-6 h-auto"
                animated={true}
                asChild
              >
                <Link to="/projects">
                  <span>View All Projects</span>
                  <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Social Media Cards Section */}
        <section className="relative z-10 py-16 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900/80">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h2
                className="text-3xl font-bold tracking-tight mb-4 sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Connect With Me
              </motion.h2>
              <motion.p
                className="text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Follow me on social media to stay updated with my latest projects and insights
              </motion.p>
            </motion.div>

            <SocialMediaCards
              instagramUrl={about?.socialLinks?.instagram}
              linkedinUrl={about?.socialLinks?.linkedin}
              githubUrl={about?.socialLinks?.github}
              mediumUrl={about?.socialLinks?.medium}
            />
          </div>
        </section>
      </div>
    </MaterialUIThemeProvider>
  );
};

export default HomePage;
