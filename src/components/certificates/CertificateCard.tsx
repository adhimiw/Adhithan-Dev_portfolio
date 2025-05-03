import { motion } from 'framer-motion';
import { Award, Calendar, ExternalLink } from 'lucide-react';
import { ICertificate } from '../../services/dataService';
import { useTheme } from '../../contexts/ThemeContext';

interface CertificateCardProps {
  certificate: ICertificate;
  index: number;
}

const CertificateCard = ({ certificate, index }: CertificateCardProps) => {
  const { theme } = useTheme();
  
  const issueDate = new Date(certificate.issueDate);
  const expiryDate = certificate.expiryDate ? new Date(certificate.expiryDate) : null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  // Define gradient colors based on certificate category
  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'Technical':
        return theme === 'dark' 
          ? 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' 
          : 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)';
      case 'Professional':
        return theme === 'dark' 
          ? 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)' 
          : 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)';
      case 'Academic':
        return theme === 'dark' 
          ? 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)' 
          : 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)';
      default: // Other
        return theme === 'dark' 
          ? 'linear-gradient(135deg, #475569 0%, #64748b 100%)' 
          : 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)';
    }
  };

  const cardVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    hover: {
      y: -5,
      boxShadow: theme === 'dark'
        ? '0 10px 25px -5px rgba(0, 102, 255, 0.4)'
        : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{
        duration: 0.3,
        delay: index * 0.1
      }}
      className="h-full"
    >
      <div 
        className="relative h-full overflow-hidden rounded-lg shadow-md dark:shadow-gray-800"
        style={{ 
          background: getCategoryGradient(certificate.category),
          color: 'white'
        }}
      >
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="1" fill-rule="evenodd"/%3E%3C/svg%3E")',
            backgroundSize: '80px 80px'
          }}
        />

        <div className="relative p-6 flex flex-col h-full z-10">
          {/* Certificate icon */}
          <div className="mb-4">
            <Award className="h-10 w-10" />
          </div>

          {/* Certificate name */}
          <h3 className="text-xl font-bold mb-2">{certificate.name}</h3>
          
          {/* Issuer */}
          <p className="text-sm opacity-90 mb-2">{certificate.issuer}</p>
          
          {/* Date */}
          <div className="flex items-center text-xs opacity-80 mb-4">
            <Calendar className="h-3 w-3 mr-1" />
            <span>
              {formatDate(issueDate)}
              {expiryDate ? ` - ${formatDate(expiryDate)}` : ''}
            </span>
          </div>

          {/* Description */}
          {certificate.description && (
            <p className="text-sm opacity-90 mb-4 flex-grow">{certificate.description}</p>
          )}

          {/* Credential ID */}
          {certificate.credentialId && (
            <p className="text-xs opacity-70 mb-2">ID: {certificate.credentialId}</p>
          )}

          {/* View Certificate Link */}
          {certificate.credentialUrl && (
            <a
              href={certificate.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm mt-auto hover:underline"
            >
              <span>View Certificate</span>
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CertificateCard;
