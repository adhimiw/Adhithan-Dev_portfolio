import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Phone, Linkedin, Github, Twitter, ExternalLink } from 'lucide-react';
import { fetchContact, fetchAbout, type IContact, type IAbout } from '../services/dataService';
import { sendContactMessage } from '../services/contactService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SocialMediaCards from '../components/home/SocialMediaCards';

const ContactPage = () => {
  const [contact, setContact] = useState<IContact | null>(null);
  const [about, setAbout] = useState<IAbout | null>(null);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<{
    message: string;
    type: 'success' | 'error' | null;
  }>({
    message: '',
    type: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contactData, aboutData] = await Promise.all([
          fetchContact(),
          fetchAbout()
        ]);
        setContact(contactData);
        setAbout(aboutData);
      } catch (error) {
        console.error('Error fetching contact information:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any existing status
    setFormStatus({
      message: '',
      type: null,
    });

    // Basic validation
    if (!formState.name || !formState.email || !formState.message) {
      setFormStatus({
        message: 'Please fill in all fields',
        type: 'error',
      });
      return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formState.email)) {
      setFormStatus({
        message: 'Please enter a valid email address',
        type: 'error',
      });
      return;
    }

    // Show loading state
    setFormStatus({
      message: 'Sending your message...',
      type: 'success',
    });

    try {
      // Send message to backend
      const result = await sendContactMessage({
        name: formState.name,
        email: formState.email,
        message: formState.message
      });

      // Check if the server returned a success message
      if (result && result.success) {
        setFormStatus({
          message: result.message || 'Your message has been sent. Thank you!',
          type: 'success',
        });

        // Reset form
        setFormState({
          name: '',
          email: '',
          message: '',
        });
      } else {
        // Handle partial success
        setFormStatus({
          message: result.message || 'Message sent but there might be a delay in response.',
          type: 'success',
        });
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      setFormStatus({
        message: error.message || 'Failed to send message. Please try again later.',
        type: 'error',
      });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Contact Me
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          I'd love to hear from you. Please feel free to get in touch.
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Get in Touch</h2>
            <p className="text-muted-foreground">
              Have a question or want to work together? Reach out using the form
              or contact me directly.
            </p>
          </div>

          {contact && (
            <div className="space-y-4">
              {contact.email && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>
              )}

              {contact.phone && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <a
                      href={`tel:${contact.phone.replace(/\D/g, '')}`}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </div>
              )}

              {contact.location && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {contact.location}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Social Links */}
          {contact?.socialLinks && contact.socialLinks.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Connect</h3>
              <div className="flex gap-4">
                {contact.socialLinks.map((link) => (
                  <a
                    key={link._id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label={link.name}
                  >
                    {getSocialIcon(link.name, link.icon)}
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formState.name}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Your email"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Your message"
                />
              </div>
            </div>

            {formStatus.message && (
              <div
                className={`rounded-md p-3 text-sm ${
                  formStatus.type === 'success'
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                }`}
              >
                {formStatus.message}
              </div>
            )}

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Send Message
              <Send size={16} className="ml-2" />
            </button>
          </form>
        </motion.div>
      </div>

      {/* Social Media Cards Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800"
      >
        <h2 className="text-2xl font-bold tracking-tight mb-6">Connect on Social Media</h2>
        <SocialMediaCards
          instagramUrl={about?.socialLinks?.instagram}
          linkedinUrl={about?.socialLinks?.linkedin}
          githubUrl={about?.socialLinks?.github}
          mediumUrl={about?.socialLinks?.medium}
        />
      </motion.div>
    </div>
  );
};

// Helper function to get icons for social links
const getSocialIcon = (name: string, icon?: string) => {
  const nameToLower = name.toLowerCase();

  if (nameToLower.includes('github')) {
    return <Github size={20} />;
  }

  if (nameToLower.includes('linkedin')) {
    return <Linkedin size={20} />;
  }

  if (nameToLower.includes('twitter')) {
    return <Twitter size={20} />;
  }

  // Default icon if no match is found
  return <ExternalLink size={20} />;
};

export default ContactPage;
