import { Link, useLocation, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../ui/ThemeToggle';
import Footer from './Footer';
import { MenuIcon, XIcon } from '../ui/icons';

interface NavLinkProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
}

const NavLink = ({ to, label, icon }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to ||
    (to !== '/' && location.pathname.startsWith(to));

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        to={to}
        className={`text-base font-medium transition-all duration-300 hover:text-primary flex items-center relative ${
          isActive ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        <span className="relative">
          {label}
          {isActive && (
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
              layoutId="navIndicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </span>
        <span className="ml-1">{icon}</span>
      </Link>
    </motion.div>
  );
};

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Navigation items
  const navItems = [
    { path: '/', label: 'Home', icon: <i className="fas fa-home ml-1"></i> },
    { path: '/projects', label: 'Projects', icon: <i className="fas fa-code-branch ml-1"></i> },
    { path: '/about', label: 'About', icon: <i className="fas fa-user ml-1"></i> },
    { path: '/certificates', label: 'Certificates', icon: <i className="fas fa-award ml-1"></i> },
    { path: '/contact', label: 'Contact', icon: <i className="fas fa-envelope ml-1"></i> }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <motion.header
        className={`sticky top-0 z-30 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur border-b shadow-sm'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="container flex h-16 items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <i className="fas fa-code text-primary"></i>
              <span>Portfolio</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:gap-6 items-center">
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <NavLink to={item.path} label={item.label} icon={item.icon} />
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <ThemeToggle className="ml-2" />
            </motion.div>
          </nav>

          {/* Mobile Navigation Toggle */}
          <motion.button
            className="block md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </motion.button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="container md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="flex flex-col space-y-4 py-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <NavLink to={item.path} label={item.label} icon={item.icon} />
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="flex items-center pt-2"
                >
                  <span className="text-sm text-muted-foreground mr-2">Toggle Theme:</span>
                  <ThemeToggle />
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <motion.main
        className="container flex-1 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Outlet />
      </motion.main>

      <Footer />
    </div>
  );
};

export default Layout;
