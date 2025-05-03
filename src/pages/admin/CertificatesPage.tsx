import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ICertificate,
  IAbout,
  getAbout,
  addCertificate,
  updateCertificate,
  deleteCertificate
} from '../../services/dataService';
import { useAuth } from '../../contexts/AuthContext';
import CertificateForm from '../../components/admin/CertificateForm';
import { PlusIcon, PencilIcon, TrashIcon, ExternalLinkIcon } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const CertificatesPage = () => {
  const [about, setAbout] = useState<IAbout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState<ICertificate | undefined>(undefined);
  const { token } = useAuth();
  const navigate = useNavigate();

  // Use useCallback to memoize fetchAbout
  const fetchAbout = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAbout();
      setAbout(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch about data:', err);
      setError('Failed to load certificates data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  const handleAddClick = () => {
    setCurrentCertificate(undefined);
    setShowForm(true);
  };

  const handleEditClick = (certificate: ICertificate) => {
    setCurrentCertificate(certificate);
    setShowForm(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) {
      return;
    }

    try {
      setIsSubmitting(true);
      if (!token) {
        setError('Authentication token not found.');
        setIsSubmitting(false);
        return;
      }

      await deleteCertificate(id, token);
      
      // Refresh data from the server
      await fetchAbout();
      
      setError(null);
    } catch (err) {
      console.error('Failed to delete certificate:', err);
      setError('Failed to delete certificate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (certificateData: Omit<ICertificate, '_id'>) => {
    try {
      setIsSubmitting(true);
      if (!token) {
        setError('Authentication token not found.');
        setIsSubmitting(false);
        return;
      }

      if (currentCertificate) {
        // Update existing certificate
        await updateCertificate(currentCertificate._id, certificateData, token);
      } else {
        // Add new certificate
        await addCertificate(certificateData, token);
      }

      // Refresh data from the server
      await fetchAbout();
      
      setShowForm(false);
      setCurrentCertificate(undefined);
      setError(null);
    } catch (err) {
      console.error('Failed to save certificate:', err);
      setError('Failed to save certificate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setCurrentCertificate(undefined);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Certificates & Recognition Management</h1>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Certificate
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {showForm ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {currentCertificate ? 'Edit Certificate' : 'Add Certificate'}
          </h2>
          <CertificateForm
            certificate={currentCertificate}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      ) : (
        <>
          {about && about.certificates && about.certificates.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {about.certificates.map((certificate) => (
                  <li key={certificate._id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {certificate.name}
                          </h3>
                          {certificate.credentialUrl && (
                            <a 
                              href={certificate.credentialUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="ml-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              <ExternalLinkIcon className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Issued by {certificate.issuer} • {formatDate(certificate.issueDate)}
                          {certificate.expiryDate && ` - ${formatDate(certificate.expiryDate)}`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Category: {certificate.category}
                          {certificate.credentialId && ` • ID: ${certificate.credentialId}`}
                        </p>
                        {certificate.description && (
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{certificate.description}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(certificate)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(certificate._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          disabled={isSubmitting}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">No certificates found. Click "Add Certificate" to create one.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CertificatesPage;
