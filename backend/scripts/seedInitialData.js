import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import About from '../models/About.js';
import Contact from '../models/Contact.js';

dotenv.config();
connectDB();

const seedInitialData = async () => {
  try {
    // Check if About document exists
    const aboutExists = await About.countDocuments();
    if (aboutExists === 0) {
      const initialAbout = new About({
        name: 'Your Name',
        title: 'Your Title',
        bio: 'A brief bio about yourself.',
        education: [],
        experience: [],
        skills: [], // Assuming skills are part of About or linked
        awards: [],
        certifications: [],
        languages: [],
        interests: [],
        avatar: '', // Placeholder for avatar URL or path
        resume: '', // Placeholder for resume URL or path
        availableForWork: true,
        seoDescription: 'Your portfolio website.',
        seoKeywords: 'portfolio, development, programming',
      });
      await initialAbout.save();
      console.log('Initial About document created.');
    } else {
      console.log('About document already exists.');
    }

    // Check if Contact document exists
    const contactExists = await Contact.countDocuments();
    if (contactExists === 0) {
      const initialContact = new Contact({
        email: 'your.email@example.com',
        phone: '',
        address: '',
        socialLinks: [],
        contactFormEnabled: true,
        seoDescription: 'Contact information for your portfolio.',
        seoKeywords: 'contact, email, phone',
      });
      await initialContact.save();
      console.log('Initial Contact document created.');
    } else {
      console.log('Contact document already exists.');
    }

    console.log('Initial data seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding initial data:', error);
    process.exit(1);
  }
};

seedInitialData();
