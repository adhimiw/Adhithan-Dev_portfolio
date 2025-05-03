import { useState, useEffect } from 'react';
import { fetchContact, IContact, ISocialLink } from '../../services/dataService';
import { getAuthHeader } from '../../services/authService';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

const ContactPage = () => {
  const [contact, setContact] = useState<Partial<IContact>>({
    email: '',
    phone: '',
    location: '',
    socialLinks: []
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSocialLink, setCurrentSocialLink] = useState<Partial<ISocialLink>>({
    name: '',
    url: '',
    icon: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentSocialLinkIndex, setCurrentSocialLinkIndex] = useState(-1);
  
  useEffect(() => {
    const loadContact = async () => {
      try {
        setLoading(true);
        const data = await fetchContact();
        if (data) {
          setContact(data);
        }
      } catch (err) {
        console.error('Error loading contact data:', err);
        setError('Failed to load contact information');
      } finally {
        setLoading(false);
      }
    };
    
    loadContact();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContact(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentSocialLink(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleOpenModal = (socialLink?: ISocialLink, index?: number) => {
    if (socialLink) {
      setCurrentSocialLink(socialLink);
      setCurrentSocialLinkIndex(index!);
      setIsEditing(true);
    } else {
      setCurrentSocialLink({
        name: '',
        url: '',
        icon: ''
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleSaveSocialLink = () => {
    if (isEditing) {
      // Update existing social link
      const updatedSocialLinks = [...(contact.socialLinks || [])];
      updatedSocialLinks[currentSocialLinkIndex] = currentSocialLink as ISocialLink;
      
      setContact(prev => ({
        ...prev,
        socialLinks: updatedSocialLinks
      }));
    } else {
      // Add new social link
      setContact(prev => ({
        ...prev,
        socialLinks: [...(prev.socialLinks || []), currentSocialLink as ISocialLink]
      }));
    }
    
    handleCloseModal();
  };
  
  const handleDeleteSocialLink = (index: number) => {
    if (!window.confirm('Are you sure you want to delete this social link?')) {
      return;
    }
    
    const updatedSocialLinks = [...(contact.socialLinks || [])];
    updatedSocialLinks.splice(index, 1);
    
    setContact(prev => ({
      ...prev,
      socialLinks: updatedSocialLinks
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      await axios.post(`${API_URL}/api/contact`, contact, getAuthHeader());
      setSaving(false);
      alert('Contact information saved successfully!');
    } catch (err) {
      console.error('Error saving contact information:', err);
      setError('Failed to save contact information');
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Contact Information</h1>
      
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={contact.email || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={contact.phone || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={contact.location || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Social Links</h2>
                <button
                  type="button"
                  onClick={() => handleOpenModal()}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Social Link
                </button>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md overflow-hidden">
                <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                  {contact.socialLinks && contact.socialLinks.length > 0 ? (
                    contact.socialLinks.map((link, index) => (
                      <li key={index} className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            {link.icon ? (
                              <img
                                src={link.icon}
                                alt={link.name}
                                className="h-4 w-4"
                              />
                            ) : (
                              <div className="text-gray-400 dark:text-gray-300 text-xs">{link.name.charAt(0)}</div>
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{link.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {link.url}
                              </a>
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => handleOpenModal(link, index)}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSocialLink(index)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                      No social links added yet.
                    </li>
                  )}
                </ul>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Social Link Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      {isEditing ? 'Edit Social Link' : 'Add Social Link'}
                    </h3>
                    <div className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Platform Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            value={currentSocialLink.name}
                            onChange={handleSocialLinkChange}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            URL
                          </label>
                          <input
                            type="url"
                            name="url"
                            id="url"
                            required
                            value={currentSocialLink.url}
                            onChange={handleSocialLinkChange}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="icon" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Icon (optional)
                          </label>
                          <input
                            type="text"
                            name="icon"
                            id="icon"
                            value={currentSocialLink.icon || ''}
                            onChange={handleSocialLinkChange}
                            placeholder="Icon name or URL"
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSaveSocialLink}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;
