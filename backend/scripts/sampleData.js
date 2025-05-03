import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import connectDB from '../config/db.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import About from '../models/About.js';
import Contact from '../models/Contact.js';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: join(dirname(__dirname), '../.env') });

// Sample Projects
const projects = [
  {
    title: 'E-Commerce Platform',
    description: 'A full-featured online shopping platform with product catalog, cart, and checkout functionality.',
    longDescription: 'This e-commerce application built with the MERN stack includes features like user authentication, product search and filtering, shopping cart management, payment processing with Stripe, order tracking, and an admin dashboard for managing products and orders.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Redux', 'JWT', 'Stripe'],
    images: [
      '/images/projects/ecommerce-1.jpg',
      '/images/projects/ecommerce-2.jpg',
    ],
    githubLink: 'https://github.com/username/ecommerce-project',
    liveLink: 'https://ecommerce-project.example.com',
    featured: true
  },
  {
    title: 'Task Management App',
    description: 'A productivity app for managing tasks, projects, and deadlines with team collaboration features.',
    longDescription: 'This task management application allows users to create, assign, and track tasks across different projects. Features include drag-and-drop task organization, priority levels, deadline notifications, file attachments, team collaboration, and progress reporting.',
    technologies: ['Vue.js', 'Firebase', 'Vuex', 'Tailwind CSS', 'Firebase Auth'],
    images: [
      '/images/projects/taskapp-1.jpg',
      '/images/projects/taskapp-2.jpg',
    ],
    githubLink: 'https://github.com/username/task-management',
    liveLink: 'https://task-management.example.com',
    featured: true
  },
  {
    title: 'Weather Dashboard',
    description: 'A weather application that provides current conditions and forecasts for locations worldwide.',
    longDescription: 'This weather dashboard utilizes the OpenWeatherMap API to display current weather conditions, hourly forecasts, and 7-day outlooks for any location. Features include location search, unit conversion, weather maps, and saving favorite locations.',
    technologies: ['JavaScript', 'HTML5', 'CSS3', 'API Integration', 'LocalStorage'],
    images: [
      '/images/projects/weather-1.jpg',
      '/images/projects/weather-2.jpg',
    ],
    githubLink: 'https://github.com/username/weather-dashboard',
    liveLink: 'https://weather-dashboard.example.com',
    featured: false
  }
];

// Sample Skills
const skills = [
  {
    category: 'Frontend',
    name: 'React',
    level: 5,
    icon: 'react'
  },
  {
    category: 'Frontend',
    name: 'JavaScript',
    level: 5,
    icon: 'javascript'
  },
  {
    category: 'Frontend',
    name: 'TypeScript',
    level: 4,
    icon: 'typescript'
  },
  {
    category: 'Frontend',
    name: 'HTML/CSS',
    level: 5,
    icon: 'html'
  },
  {
    category: 'Frontend',
    name: 'Vue.js',
    level: 3,
    icon: 'vue'
  },
  {
    category: 'Backend',
    name: 'Node.js',
    level: 4,
    icon: 'node'
  },
  {
    category: 'Backend',
    name: 'Express',
    level: 4,
    icon: 'express'
  },
  {
    category: 'Backend',
    name: 'MongoDB',
    level: 4,
    icon: 'mongodb'
  },
  {
    category: 'Backend',
    name: 'PostgreSQL',
    level: 3,
    icon: 'postgresql'
  },
  {
    category: 'Tools',
    name: 'Git',
    level: 4,
    icon: 'git'
  },
  {
    category: 'Tools',
    name: 'Docker',
    level: 3,
    icon: 'docker'
  },
  {
    category: 'Tools',
    name: 'AWS',
    level: 3,
    icon: 'aws'
  }
];

// Sample About Info
const about = {
  name: 'John Doe',
  title: 'Full Stack Developer',
  bio: 'I am a passionate full-stack developer with over 5 years of experience building web applications using modern technologies. I focus on creating clean, efficient, and user-friendly solutions that solve real-world problems. When I\'m not coding, I enjoy hiking, photography, and contributing to open-source projects.',
  avatar: '/images/profile.jpg',
  location: 'San Francisco, CA',
  email: 'john.doe@example.com',
  resumeLink: '/resume.pdf',
  education: [
    {
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: new Date('2012-09-01'),
      endDate: new Date('2016-05-15'),
      description: 'Graduated with honors. Specialized in Software Engineering and Data Structures.'
    },
    {
      institution: 'Stanford University',
      degree: 'Master of Science',
      field: 'Software Engineering',
      startDate: new Date('2016-09-01'),
      endDate: new Date('2018-06-15'),
      description: 'Focused on advanced web technologies and cloud computing.'
    }
  ],
  experience: [
    {
      company: 'Tech Innovations Inc.',
      position: 'Senior Full Stack Developer',
      startDate: new Date('2021-01-01'),
      current: true,
      description: 'Leading development of enterprise web applications with React, Node.js, and MongoDB.',
      responsibilities: [
        'Architecting scalable web applications',
        'Managing a team of junior developers',
        'Implementing CI/CD pipelines',
        'Optimizing application performance'
      ]
    },
    {
      company: 'Digital Solutions LLC',
      position: 'Full Stack Developer',
      startDate: new Date('2018-07-01'),
      endDate: new Date('2020-12-31'),
      description: 'Developed and maintained multiple client web applications.',
      responsibilities: [
        'Building responsive user interfaces with React',
        'Developing RESTful APIs with Node.js and Express',
        'Database design and optimization',
        'Implementing authentication and authorization'
      ]
    },
    {
      company: 'WebTech Startups',
      position: 'Junior Developer',
      startDate: new Date('2016-06-01'),
      endDate: new Date('2018-06-30'),
      description: 'Worked on frontend development for various startup projects.',
      responsibilities: [
        'Implementing UI designs using HTML, CSS, and JavaScript',
        'Building interactive features with jQuery and React',
        'Collaborating with designers and backend developers',
        'Writing unit tests for frontend components'
      ]
    }
  ]
};

// Sample Contact Info
const contact = {
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  socialLinks: [
    {
      name: 'GitHub',
      url: 'https://github.com/johndoe',
      icon: 'github'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/johndoe',
      icon: 'linkedin'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/johndoe',
      icon: 'twitter'
    }
  ]
};

// Function to clear the database and import sample data
const importData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing data
    await Project.deleteMany();
    await Skill.deleteMany();
    await About.deleteMany();
    await Contact.deleteMany();
    console.log('Previous data cleared');

    // Import new data
    await Project.insertMany(projects);
    console.log(`${projects.length} projects imported`);

    await Skill.insertMany(skills);
    console.log(`${skills.length} skills imported`);

    await About.create(about);
    console.log('About information imported');

    await Contact.create(contact);
    console.log('Contact information imported');

    console.log('Sample data imported successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Run the import function
importData();
