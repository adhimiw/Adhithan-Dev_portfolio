import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Mail, Calendar, Building, GraduationCap, Award } from 'lucide-react';
import { fetchAbout, type IAbout, type IEducation, type IExperience } from '../services/dataService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ResumeViewer from '../components/ui/ResumeViewer';

const AboutPage = () => {
  const [about, setAbout] = useState<IAbout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aboutData = await fetchAbout();
        setAbout(aboutData);
      } catch (error) {
        console.error('Error fetching about information:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!about) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Information Not Available</h2>
          <p className="mt-2 text-muted-foreground">
            About information is not available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Profile Section */}
      <section className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {about.name}
            </h1>
            <p className="mt-2 text-xl text-muted-foreground">
              {about.title}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="prose prose-neutral max-w-none dark:prose-invert"
          >
            <p>{about.bio}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            {about.resumeLink && (
              <ResumeViewer resumeUrl={about.resumeLink} showText={true} />
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 group"
        >
          {about.avatar && (
            <div className="relative mx-auto max-w-[300px]">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000 animate-pulse"></div>
              <div className="overflow-hidden rounded-full aspect-square border-4 border-primary/20 shadow-lg relative">
                <img
                  src={about.avatar}
                  alt={about.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="rounded-lg border p-4 space-y-3">
            {about.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={18} className="text-muted-foreground" />
                <span>{about.location}</span>
              </div>
            )}
            {about.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail size={18} className="text-muted-foreground" />
                <a href={`mailto:${about.email}`} className="hover:text-primary">
                  {about.email}
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Experience Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Work Experience</h2>
        <div className="space-y-8">
          {about.experience && about.experience.length > 0 ? (
            about.experience.map((exp, index) => (
              <ExperienceItem key={exp._id || index} experience={exp} />
            ))
          ) : (
            <p className="text-muted-foreground">No experience information available.</p>
          )}
        </div>
      </section>

      {/* Education Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Education</h2>
        <div className="space-y-8">
          {about.education && about.education.length > 0 ? (
            about.education.map((edu, index) => (
              <EducationItem key={edu._id || index} education={edu} />
            ))
          ) : (
            <p className="text-muted-foreground">No education information available.</p>
          )}
        </div>
      </section>

      {/* Link to Certificates Page */}
      <section className="mt-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            to="/certificates"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Award size={18} />
            <span>View My Certificates & Recognitions</span>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

interface ExperienceItemProps {
  experience: IExperience;
}

const ExperienceItem = ({ experience }: ExperienceItemProps) => {
  const startDate = new Date(experience.startDate);
  const endDate = experience.endDate ? new Date(experience.endDate) : null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg border p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <h3 className="font-semibold">{experience.position}</h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar size={14} />
          <span>
            {formatDate(startDate)} - {experience.current ? 'Present' : endDate ? formatDate(endDate) : ''}
          </span>
        </div>
      </div>
      <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
        <Building size={14} />
        <span>{experience.company}</span>
      </div>
      <p className="mt-4">{experience.description}</p>
      {experience.responsibilities && experience.responsibilities.length > 0 && (
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
          {experience.responsibilities.map((item) => (
            <li key={`${experience._id}-${item.substring(0, 10)}`}>{item}</li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

interface EducationItemProps {
  education: IEducation;
}

const EducationItem = ({ education }: EducationItemProps) => {
  const startDate = new Date(education.startDate);
  const endDate = education.endDate ? new Date(education.endDate) : null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg border p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <h3 className="font-semibold">
          {['SSLC', 'HSC', 'HSSC'].includes(education.level)
            ? `${education.field} (${education.level})`
            : `${education.degree || ''} in ${education.field}`}
        </h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar size={14} />
          <span>
            {formatDate(startDate)} - {education.current ? 'Present' : endDate ? formatDate(endDate) : ''}
          </span>
        </div>
      </div>

      <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
        <GraduationCap size={14} />
        <span>{education.institution}</span>
        {education.boardOrUniversity && (
          <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
            {education.boardOrUniversity}
          </span>
        )}
      </div>

      {/* Academic details */}
      <div className="mt-2 flex flex-wrap gap-2">
        {/* Percentage for school levels */}
        {['SSLC', 'HSC', 'HSSC'].includes(education.level) && education.percentage && (
          <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
            {education.percentage}%
          </span>
        )}

        {/* CGPA for college levels */}
        {education.cgpa && (
          <span className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
            CGPA: {education.cgpa}/10
          </span>
        )}

        {/* Semester progress */}
        {education.totalSemesters && (
          <span className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
            {education.completedSemesters || 0}/{education.totalSemesters} Semesters
            {education.current && education.completedSemesters &&
              ` (${Math.round((education.completedSemesters / education.totalSemesters) * 100)}% complete)`}
          </span>
        )}
      </div>

      {education.description && (
        <p className="mt-4 text-sm">{education.description}</p>
      )}
    </motion.div>
  );
};



export default AboutPage;
