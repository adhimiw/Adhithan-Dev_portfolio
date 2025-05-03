import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjects, deleteProject, IProject } from '../../services/dataService';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit, Trash2 } from 'lucide-react';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true); // Renamed to avoid conflict
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { token, loading: authLoading } = useAuth(); // Get auth loading state

  useEffect(() => {
    // Only load projects once authentication is confirmed (authLoading is false)
    if (!authLoading) {
      loadProjects();
    }
  }, [authLoading]); // Depend on authLoading

  const loadProjects = async () => {
    try {
      setProjectsLoading(true); // Use the renamed state setter
      const data = await fetchProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setProjectsLoading(false); // Use the renamed state setter
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    // Ensure token is available before attempting delete
    if (!token) {
      setError('Authentication token is missing. Please log in again.');
      return;
    }

    try {
      setIsDeleting(true);
      await deleteProject(id, token);

      // Remove the project from the state
      setProjects(prevProjects => prevProjects.filter(project => project._id !== id));

      setError(null);
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Show loading indicator while auth context or projects are loading
  if (authLoading || projectsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Projects</h1>
        <Link
          to="/admin/projects/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {projects.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
              No projects found. Create your first project!
            </li>
          ) : (
            projects.map((project) => (
              <li key={project._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      {project.images && project.images.length > 0 ? (
                        <img
                          src={project.images[0]}
                          alt={project.title}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 dark:text-gray-500 text-xs">No image</div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{project.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{project.description}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {project.month && project.year ?
                          `${new Date(0, project.month - 1).toLocaleString('default', { month: 'long' })} ${project.year}`
                          : project.year ? `${project.year}` : ''}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/admin/projects/${project._id}`}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(project._id)}
                      disabled={isDeleting}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProjectsPage;
