import React from 'react';
import { motion } from 'framer-motion';
import { useContactQuery, useAboutQuery } from '../../hooks/useQueryData';
import ResumeViewer from '../ui/ResumeViewer';
import { Link } from 'react-router-dom';

// Custom SVG icons to replace lucide-react
const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const TwitterIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const InstagramIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const ExternalLinkIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

const LockIcon = ({ size = 12 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const Footer: React.FC = () => {
  const { data: contact } = useContactQuery();
  const { data: about } = useAboutQuery();

  // Combine social links from both contact and about data
  const socialLinks = React.useMemo(() => {
    const links: Record<string, string> = {};

    // Add links from about data
    if (about?.socialLinks) {
      if (about.socialLinks.linkedin) links.linkedin = about.socialLinks.linkedin;
      if (about.socialLinks.github) links.github = about.socialLinks.github;
      if (about.socialLinks.instagram) links.instagram = about.socialLinks.instagram;
      if (about.socialLinks.medium) links.medium = about.socialLinks.medium;
    }

    // Add links from contact data (if it's an object)
    if (contact?.socialLinks && !Array.isArray(contact.socialLinks)) {
      if (contact.socialLinks.linkedin) links.linkedin = contact.socialLinks.linkedin;
      if (contact.socialLinks.github) links.github = contact.socialLinks.github;
      if (contact.socialLinks.twitter) links.twitter = contact.socialLinks.twitter;
      if (contact.socialLinks.instagram && !links.instagram) links.instagram = contact.socialLinks.instagram;
    }

    // Add links from contact data (if it's an array)
    if (contact?.socialLinks && Array.isArray(contact.socialLinks)) {
      contact.socialLinks.forEach(link => {
        const name = link.name.toLowerCase();
        if (name.includes('linkedin')) links.linkedin = link.url;
        if (name.includes('github')) links.github = link.url;
        if (name.includes('twitter')) links.twitter = link.url;
        if (name.includes('instagram')) links.instagram = link.url;
        if (name.includes('medium')) links.medium = link.url;
      });
    }

    return links;
  }, [about, contact]);

  // Get resume link from about data
  const resumeLink = about?.resumeLink || '/resume.pdf';

  return (
    <motion.footer
      className="border-t py-6 bg-background/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="container">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <motion.div
            className="mb-4 text-sm text-muted-foreground md:mb-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p>&copy; {new Date().getFullYear()} {about?.name || 'Portfolio'}. All rights reserved.</p>
            {contact?.email && (
              <p className="mt-1">
                <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">
                  {contact.email}
                </a>
              </p>
            )}
            <p className="mt-1 text-xs opacity-60 hover:opacity-100 transition-opacity">
              <Link to="/admin/login" className="flex items-center gap-1 hover:text-primary transition-colors">
                <LockIcon /> Admin
              </Link>
            </p>
          </motion.div>

          <div className="flex space-x-6">
            {socialLinks.github && (
              <motion.a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <GithubIcon />
              </motion.a>
            )}

            {socialLinks.linkedin && (
              <motion.a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <LinkedinIcon />
              </motion.a>
            )}

            {socialLinks.twitter && (
              <motion.a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <TwitterIcon />
              </motion.a>
            )}

            {socialLinks.instagram && (
              <motion.a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <InstagramIcon />
              </motion.a>
            )}

            {socialLinks.medium && (
              <motion.a
                href={socialLinks.medium}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Medium"
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <ExternalLinkIcon />
              </motion.a>
            )}

            {resumeLink && (
              <motion.div
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <ResumeViewer resumeUrl={resumeLink} iconOnly={true} />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
