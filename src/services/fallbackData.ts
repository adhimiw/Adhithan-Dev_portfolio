// Fallback data to use when API requests fail
import { ISkill, IProject, IAbout, IContact } from './dataService';

export const fallbackSkills: ISkill[] = [
  {
    _id: 'fallback-1',
    name: 'JavaScript',
    category: 'Frontend',
    level: 5,
    icon: 'javascript',
    description: 'Modern JavaScript including ES6+ features'
  },
  {
    _id: 'fallback-2',
    name: 'TypeScript',
    category: 'Frontend',
    level: 4,
    icon: 'typescript',
    description: 'Type-safe JavaScript development'
  },
  {
    _id: 'fallback-3',
    name: 'React',
    category: 'Frontend',
    level: 5,
    icon: 'react',
    description: 'Building modern user interfaces'
  },
  {
    _id: 'fallback-4',
    name: 'Node.js',
    category: 'Backend',
    level: 4,
    icon: 'nodejs',
    description: 'Server-side JavaScript runtime'
  },
  {
    _id: 'fallback-5',
    name: 'MongoDB',
    category: 'Backend',
    level: 4,
    icon: 'mongodb',
    description: 'NoSQL database for modern applications'
  }
];

export const fallbackProjects: IProject[] = [
  {
    _id: 'fallback-project-1',
    title: 'Portfolio Website',
    description: 'A modern portfolio website built with React, TypeScript, and Tailwind CSS. Features responsive design, dark mode, and dynamic content loading.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    images: ['/images/fallback-project.svg'],
    githubLink: 'https://github.com/yourusername/portfolio',
    liveLink: 'https://yourportfolio.com',
    month: 3,
    year: 2023,
    featured: true
  },
  {
    _id: 'fallback-project-2',
    title: 'AI Chat Application',
    description: 'An AI-powered chat application that uses natural language processing to provide intelligent responses to user queries.',
    technologies: ['React', 'Node.js', 'Socket.io', 'OpenAI API'],
    images: ['/images/fallback-project.svg'],
    githubLink: 'https://github.com/yourusername/ai-chat',
    liveLink: 'https://aichat.yourportfolio.com',
    month: 9,
    year: 2023,
    featured: true
  }
];

export const fallbackAbout: IAbout = {
  _id: 'fallback-about',
  name: 'Adhithan R',
  title: 'Full Stack Developer & AI Specialist',
  bio: 'Passionate and skilled Full Stack Developer with a strong foundation in computer science and a specialization in AI. Eager to contribute to innovative projects and create impactful solutions.',
  avatar: '/images/fallback-avatar.jpg',
  location: 'Chennai, India',
  email: 'contact@example.com',
  resumeLink: '#',
  education: [
    {
      _id: 'fallback-edu-1',
      institution: 'University of Technology',
      degree: 'Bachelor of Science in Computer Science',
      startDate: '2016-09-01',
      endDate: '2020-05-31',
      description: 'Graduated with honors. Specialized in Artificial Intelligence and Machine Learning.'
    }
  ],
  experience: [
    {
      _id: 'fallback-exp-1',
      company: 'Tech Innovations Inc.',
      position: 'Full Stack Developer',
      startDate: '2020-06-01',
      endDate: null,
      current: true,
      description: 'Developing modern web applications using React, Node.js, and MongoDB. Implementing AI features to enhance user experience.'
    }
  ],
  certificates: [
    {
      _id: 'fallback-cert-1',
      name: 'Advanced React Development',
      issuer: 'React Academy',
      category: 'Technical',
      issueDate: '2021-03-15',
      expiryDate: null,
      credentialId: 'REACT-ADV-2021',
      credentialUrl: '#',
      description: 'Advanced concepts in React including hooks, context, and performance optimization'
    }
  ],
  socialLinks: {
    linkedin: 'https://linkedin.com/in/yourusername',
    github: 'https://github.com/yourusername',
    instagram: 'https://instagram.com/yourusername',
    medium: 'https://medium.com/@yourusername'
  }
};

export const fallbackContact: IContact = {
  _id: 'fallback-contact',
  email: 'contact@example.com',
  phone: '+1 (123) 456-7890',
  address: 'Chennai, India',
  socialLinks: {
    linkedin: 'https://linkedin.com/in/yourusername',
    github: 'https://github.com/yourusername',
    twitter: 'https://twitter.com/yourusername'
  }
};
