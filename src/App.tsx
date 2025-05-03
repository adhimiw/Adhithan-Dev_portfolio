import { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom'; // Removed useNavigate
import { AnimatePresence } from 'framer-motion';

// Import the no-blur CSS to prevent blur effects
import './styles/no-blur.css';

// Import backend status hook
import useBackendStatus from './hooks/useBackendStatus';

// Layout Components
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute'; // Import ProtectedRoute
import LoadingSpinner from './components/ui/LoadingSpinner';
import LoadingPage from './components/ui/LoadingPage';
import RoleSelector from './components/visitor/RoleSelector';
import PushNotificationManager from './components/PushNotificationManager';
import { ToastContainer } from './components/ui/toast';
import BackendStatusNotification from './components/ui/BackendStatusNotification';
// import { trackPageVisit } from './services/visitorService'; // Disabled due to MongoDB connection issues


// Lazy-loaded Pages - Public
const HomePage = lazy(() => import('./pages/HomePage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CertificatesPage = lazy(() => import('./pages/CertificatesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Lazy-loaded Pages - Admin
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const AdminProjectsPage = lazy(() => import('./pages/admin/ProjectsPage'));
const AdminProjectEditPage = lazy(() => import('./pages/admin/ProjectEditPage'));
const AdminAboutPage = lazy(() => import('./pages/admin/AboutPage'));
const EducationPage = lazy(() => import('./pages/admin/EducationPage'));
const ExperiencePage = lazy(() => import('./pages/admin/ExperiencePage'));
const AdminSkillsPage = lazy(() => import('./pages/admin/AdminSkillsPage'));
const AdminContactPage = lazy(() => import('./pages/admin/ContactPage'));
const MessagesPage = lazy(() => import('./pages/admin/MessagesPage'));
const AdminCertificatesPage = lazy(() => import('./pages/admin/CertificatesPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const VisitorStatsPage = lazy(() => import('./pages/admin/VisitorStatsPage'));


// PageTracker component to track page visits - DISABLED due to MongoDB connection issues
const PageTracker = () => { // Renamed from PageTrackerWrapper
  const location = useLocation();

  useEffect(() => {
    // Disabled visitor tracking due to MongoDB connection issues
    console.log('[PageTracker] Page tracking disabled for path:', location.pathname);

    // Original tracking code (commented out)
    /*
    const visitorId = localStorage.getItem('visitorId');
    console.log('[PageTracker] Reading visitorId from localStorage:', visitorId);
    if (visitorId && /^[0-9a-fA-F]{24}$/.test(visitorId)) {
      trackPageVisit(location.pathname);
    } else if (visitorId) {
      console.warn('Invalid visitor ID found in local storage, page visit not tracked:', visitorId);
    }
    */
  }, [location.pathname]);

  return null;
};



function App() {
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isBackendAvailable, isChecking } = useBackendStatus();

  useEffect(() => {
    // Check if visitor role is already selected
    const visitorRole = localStorage.getItem('visitorRole');
    const visitorId = localStorage.getItem('visitorId');
    const isValidVisitorId = visitorId && /^[0-9a-fA-F]{24}$/.test(visitorId);

    // Show role selector if role is missing OR visitorId is missing/invalid
    if (!visitorRole || !isValidVisitorId) {
      // Clear potentially inconsistent storage if needed
      if (!isValidVisitorId && visitorId) {
        localStorage.removeItem('visitorId'); // Remove invalid ID
      }
      if (!visitorRole && localStorage.getItem('visitorRole')) {
         localStorage.removeItem('visitorRole'); // Remove role if ID is invalid/missing
      }

      // Small delay to ensure the app is loaded first
      const timer = setTimeout(() => {
        setIsLoading(false); // Stop main loading
        setShowRoleSelector(true);
      }, 3000); // Longer delay to show the retro TV animation

      return () => clearTimeout(timer);
    } else {
      // If role is selected, just show loading for a bit
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleRoleSelected = () => {
    setShowRoleSelector(false);
    console.log('Visitor ID after role selection:', localStorage.getItem('visitorId'));
    // The PageTracker component will handle tracking the initial page visit after navigation
  };

  return (
    <BrowserRouter>
      <AnimatePresence>
        {isLoading && <LoadingPage minLoadingTime={4000} onLoadingComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {showRoleSelector && (
        <RoleSelector onRoleSelected={handleRoleSelected} />
      )}

      <Suspense fallback={<LoadingSpinner text="Loading content..." />}>
        {/* Render PageTracker only if loading is complete and a valid visitorId exists */}
        {!isLoading && localStorage.getItem('visitorId') && /^[0-9a-fA-F]{24}$/.test(localStorage.getItem('visitorId') || '') && (
          <PageTracker />
        )}
        <PushNotificationManager />
        <ToastContainer />
        {/* Show backend status notification when not loading */}
        {!isLoading && !isChecking && (
          <BackendStatusNotification isBackendAvailable={isBackendAvailable} />
        )}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:id" element={<ProjectDetailPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="certificates" element={<CertificatesPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          {/* Wrap AdminLayout and its children with ProtectedRoute */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="projects" element={<AdminProjectsPage />} />
            <Route path="projects/new" element={<AdminProjectEditPage />} />
            <Route path="projects/:id" element={<AdminProjectEditPage />} />
            <Route path="about" element={<AdminAboutPage />} />
            <Route path="education" element={<EducationPage />} />
            <Route path="certificates" element={<AdminCertificatesPage />} />
            <Route path="experience" element={<ExperiencePage />} />
            <Route path="skills" element={<AdminSkillsPage />} />
            <Route path="contact" element={<AdminContactPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="visitors" element={<VisitorStatsPage />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
