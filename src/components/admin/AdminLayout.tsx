import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, User, Settings, Home, Briefcase, Code, Phone, GraduationCap, BookOpen, BarChart, MessageSquare, Bot, Award } from 'lucide-react';
import { isAuthenticated } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';
import RealtimeNotification from '../ui/RealtimeNotification';
import NotificationBell from './NotificationBell';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setIsUserAuthenticated(authStatus);

      if (!authStatus) {
        navigate('/admin/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // After logout, redirect to login page
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, redirect to login page
      navigate('/admin/login');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 pt-5">
          <div className="flex flex-shrink-0 items-center justify-between px-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Portfolio Admin</h1>
            <div className="flex items-center space-x-3">
              {isUserAuthenticated && <NotificationBell />}
              <ThemeToggle />
            </div>
          </div>
          <div className="mt-5 flex flex-grow flex-col">
            <nav className="flex-1 space-y-1 px-2 pb-4">
              <Link
                to="/admin"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Home className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
                Dashboard
              </Link>
              <Link
                to="/admin/about"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <User className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
                About
              </Link>
              <Link
                to="/admin/education"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <GraduationCap className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
                Education
              </Link>
              <Link
                to="/admin/certificates"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Award className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
                Certificates
              </Link>
              <Link
                to="/admin/experience"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <BookOpen className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
                Experience
              </Link>
              <Link
                to="/admin/projects"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Briefcase className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
                Projects
              </Link>
              <Link
                to="/admin/skills"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Code className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
                Skills
              </Link>
              <Link
                to="/admin/contact"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Phone className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
                Contact
              </Link>
              <Link
                to="/admin/messages"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <MessageSquare className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
                Messages
              </Link>
              <Link
                to="/admin/settings"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Settings className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
                Settings
              </Link>
              <Link
                to="/admin/visitors"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <BarChart className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
                Visitor Stats
              </Link>
              <Link
                to="/admin/assistant"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Bot className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
                AI Assistant
              </Link>
              <button
                onClick={handleLogout}
                className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Portfolio Admin</h1>
        <div className="flex items-center space-x-3">
          {isUserAuthenticated && <NotificationBell />}
          <ThemeToggle />
          <button
            onClick={toggleMobileMenu}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800">
          <nav className="flex flex-col p-4 space-y-2">
            <Link
              to="/admin"
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
              Dashboard
            </Link>
            <Link
              to="/admin/about"
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
              About
            </Link>
            <Link
              to="/admin/education"
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <GraduationCap className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
              Education
            </Link>
            <Link
              to="/admin/certificates"
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Award className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
              Certificates
            </Link>
            <Link
              to="/admin/experience"
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BookOpen className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
              Experience
            </Link>
            <Link
              to="/admin/projects"
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Briefcase className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
              Projects
            </Link>
            <Link
              to="/admin/skills"
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Code className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
              Skills
            </Link>
            <Link
              to="/admin/contact"
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Phone className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
              Contact
            </Link>
            <Link
              to="/admin/messages"
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <MessageSquare className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
              Messages
            </Link>
            <Link
              to="/admin/settings"
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Settings className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
              Settings
            </Link>
            <Link
              to="/admin/visitors"
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BarChart className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
              Visitor Stats
            </Link>
            <Link
              to="/admin/assistant"
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Bot className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
              AI Assistant
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
              Logout
            </button>
          </nav>
        </div>
      )}

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Real-time notification component */}
      {isUserAuthenticated && <RealtimeNotification />}
    </div>
  );
};

export default AdminLayout;
