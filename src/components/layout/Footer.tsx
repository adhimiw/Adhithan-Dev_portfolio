import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Instagram, ExternalLink } from 'lucide-react';
import { useContactQuery, useAboutQuery } from '../../hooks/useQueryData';
import ResumeViewer from '../ui/ResumeViewer';

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
                <Github size={20} />
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
                <Linkedin size={20} />
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
                <Twitter size={20} />
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
                <Instagram size={20} />
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
                <ExternalLink size={20} />
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
