import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';
import RetroTVLoader from '../components/ui/RetroTVLoader';
import { useTheme } from '../contexts/ThemeContext';

const NotFoundPage: React.FC = () => {
  const { theme } = useTheme();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    // Show the error message after a delay to simulate a TV error
    const timer = setTimeout(() => {
      setShowError(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flex min-h-[80vh] flex-col items-center justify-center text-center p-4 ${
      theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-100/50'
    }`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <RetroTVLoader
          text={showError ? "ERROR 404" : "SCANNING..."}
          size="lg"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showError ? 1 : 0, y: showError ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-3xl font-bold tracking-tight">Channel Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            We couldn't tune into the channel you requested. It might be on a different frequency or no longer broadcasting.
          </p>
          <div className="pt-4">
            <Link
              to="/"
              className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                theme === 'dark'
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              <Home className="mr-2 h-4 w-4" />
              Return to Main Channel
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
