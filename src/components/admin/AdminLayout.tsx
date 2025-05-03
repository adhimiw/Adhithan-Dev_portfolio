import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';
import RealtimeNotification from '../ui/RealtimeNotification';
import NotificationBell from './NotificationBell';
import {
  LogOutIcon, MenuIcon, XIcon, UserIcon, SettingsIcon, HomeIcon,
  BriefcaseIcon, CodeIcon, PhoneIcon, GraduationCapIcon, BookOpenIcon,
  BarChartIcon, MessageSquareIcon, BotIcon, AwardIcon
} from '../ui/icons';

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
                <HomeIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
                Dashboard
              </Link>
              <Link
                to="/admin/about"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <UserIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
                About
              </Link>
              <Link
                to="/admin/education"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <GraduationCapIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
                Education
              </Link>
              <Link
                to="/admin/certificates"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <AwardIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
                Certificates
              </Link>
              <Link
                to="/admin/experience"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <BookOpenIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
                Experience
              </Link>
              <Link
                to="/admin/projects"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <BriefcaseIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
                Projects
              </Link>
              <Link
                to="/admin/skills"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <CodeIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
                Skills
              </Link>
              <Link
                to="/admin/contact"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <PhoneIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
                Contact
              </Link>
              <Link
                to="/admin/messages"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <MessageSquareIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
                Messages
              </Link>
              <Link
                to="/admin/settings"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <SettingsIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
                Settings
              </Link>
              <Link
                to="/admin/visitors"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <BarChartIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
                Visitor Stats
              </Link>
              <Link
                to="/admin/assistant"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <BotIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
                AI Assistant
              </Link>
              <button
                onClick={handleLogout}
                className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <LogOutIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
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
              <XIcon className="h-6 w-6" size={24} />
            ) : (
              <MenuIcon className="h-6 w-6" size={24} />
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
              <HomeIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
              Dashboard
            </Link>
            <Link
              to="/admin/about"
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <UserIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
              About
            </Link>
            <Link
              to="/admin/education"
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <GraduationCapIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
              Education
            </Link>
            <Link
              to="/admin/certificates"
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <AwardIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
              Certificates
            </Link>
            <Link
              to="/admin/experience"
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BookOpenIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
              Experience
            </Link>
            <Link
              to="/admin/projects"
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BriefcaseIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
              Projects
            </Link>
            <Link
              to="/admin/skills"
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <CodeIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
              Skills
            </Link>
            <Link
              to="/admin/contact"
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <PhoneIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
              Contact
            </Link>
            <Link
              to="/admin/messages"
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <MessageSquareIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
              Messages
            </Link>
            <Link
              to="/admin/settings"
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <SettingsIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
              Settings
            </Link>
            <Link
              to="/admin/visitors"
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BarChartIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
              Visitor Stats
            </Link>
            <Link
              to="/admin/assistant"
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BotIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
              AI Assistant
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <LogOutIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" size={20} />
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
