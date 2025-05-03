import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Github, ExternalLink } from 'lucide-react';
import { fetchProjectById, type IProject } from '../services/dataService';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        navigate('/projects');
        return;
      }

      try {
        const projectData = await fetchProjectById(id);

        if (!projectData) {
          navigate('/projects');
          return;
        }

        setProject(projectData);
      } catch (error) {
        console.error('Error fetching project:', error);
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!project) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Project not found</h2>
          <p className="mt-2 text-muted-foreground">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/projects"
            className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="space-y-8">
      {/* Back Link and Title */}
      <div>
        <Link
          to="/projects"
          className="mb-4 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to all projects
        </Link>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {project.title}
        </h1>
      </div>

      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
          {project.images && project.images.length > 0 ? (
            <motion.img
              key={activeImageIndex}
              src={project.images[activeImageIndex]}
              alt={`${project.title} screenshot ${activeImageIndex + 1}`}
              className="h-full w-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No images available
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {project.images && project.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {project.images.map((image, index) => (
              <button
                key={`thumb-${project._id}-${index}`}
                onClick={() => setActiveImageIndex(index)}
                className={`relative min-w-[100px] overflow-hidden rounded border ${
                  activeImageIndex === index
                    ? 'border-primary ring-2 ring-primary ring-offset-2'
                    : 'border-muted hover:border-primary/50'
                }`}
              >
                <div className="aspect-video w-[100px]">
                  <img
                    src={image}
                    alt={`${project.title} thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          {/* Description */}
          <div className="space-y-4">
            <p className="text-lg">{project.description}</p>
            <div className="prose prose-neutral dark:prose-invert">
              <p>{project.longDescription}</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Technologies */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Links</h3>
            <div className="space-y-2">
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  <Github size={18} />
                  <span>Source Code</span>
                </a>
              )}
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  <ExternalLink size={18} />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>

          {/* Project Date */}
          {(project.month || project.year) && (
            <div>
              <h3 className="mb-1 text-lg font-semibold">Date</h3>
              <div className="text-sm text-muted-foreground">
                {project.month && project.year ?
                  `${new Date(0, project.month - 1).toLocaleString('default', { month: 'long' })} ${project.year}`
                  : project.year ? `${project.year}` : ''}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectDetailPage;
