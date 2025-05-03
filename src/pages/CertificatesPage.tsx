import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchAbout, type IAbout, type ICertificate } from '../services/dataService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CertificateCard from '../components/certificates/CertificateCard';
import { Award } from 'lucide-react';

const CertificatesPage = () => {
  const [about, setAbout] = useState<IAbout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAbout = async () => {
      try {
        setLoading(true);
        const data = await fetchAbout();
        setAbout(data);
        setError(null);
      } catch (err) {
        console.error('Error loading about data:', err);
        setError('Failed to load certificates information');
      } finally {
        setLoading(false);
      }
    };

    loadAbout();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading certificates..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  // Group certificates by category
  const certificatesByCategory: Record<string, ICertificate[]> = {};
  
  if (about?.certificates) {
    about.certificates.forEach(cert => {
      if (!certificatesByCategory[cert.category]) {
        certificatesByCategory[cert.category] = [];
      }
      certificatesByCategory[cert.category].push(cert);
    });
  }

  // Sort categories in a specific order
  const categoryOrder = ['Technical', 'Professional', 'Academic', 'Other'];
  const sortedCategories = Object.keys(certificatesByCategory).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center">
          <Award className="mr-2 h-8 w-8" />
          Certificates & Recognition
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Professional certifications, awards, and recognitions that demonstrate my expertise and commitment to continuous learning.
        </p>
      </motion.div>

      {sortedCategories.length > 0 ? (
        sortedCategories.map((category, categoryIndex) => (
          <motion.section 
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * categoryIndex }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold tracking-tight mb-6">{category} Certificates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificatesByCategory[category].map((certificate, index) => (
                <CertificateCard 
                  key={certificate._id || index} 
                  certificate={certificate} 
                  index={index}
                />
              ))}
            </div>
          </motion.section>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No certificates available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;
