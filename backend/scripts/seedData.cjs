const seedData = async () => {
  try {
    const { default: connectDB } = await import('../config/db.js');
    const { default: Project } = await import('../models/Project.js');
    const { default: Skill } = await import('../models/Skill.js');
    const { default: About } = await import('../models/About.js');
    const { default: Contact } = await import('../models/Contact.js');

// Sample data
const projects = [
  {
    title: 'Portfolio Website',
    description: 'A professional portfolio website with MongoDB backend and static frontend',
    longDescription: 'This portfolio website showcases my projects, skills, and experience. It uses MongoDB for data storage and is deployed as a static site on GitHub Pages.',
    technologies: ['React', 'MongoDB', 'Node.js', 'Express', 'GitHub Pages'],
    images: ['portfolio-screenshot.jpg'],
    githubLink: 'https://github.com/username/portfolio',
    liveLink: 'https://username.github.io/portfolio',
    featured: true
  },
  {
    title: 'E-commerce Platform',
    description: 'A full-featured e-commerce platform with payment processing',
    longDescription: 'Built a complete e-commerce solution with product catalog, shopping cart, user authentication, and Stripe payment integration.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe API'],
    images: ['ecommerce-screenshot.jpg'],
    githubLink: 'https://github.com/username/ecommerce',
    liveLink: 'https://my-ecommerce-demo.netlify.app',
    featured: true
  },
  {
    title: 'Weather App',
    description: 'A weather application that displays current weather and forecasts',
    longDescription: 'This application fetches weather data from OpenWeatherMap API and displays current conditions and a 5-day forecast for any city in the world.',
    technologies: ['JavaScript', 'HTML', 'CSS', 'OpenWeatherMap API'],
    images: ['weather-app-screenshot.jpg'],
    githubLink: 'https://github.com/username/weather-app',
    liveLink: 'https://username.github.io/weather-app',
    featured: false
  }
];

const skills = [
  {
    category: 'Frontend',
    name: 'React',
    level: 5,
    icon: 'react-icon.svg'
  },
  {
    category: 'Frontend',
    name: 'JavaScript',
    level: 5,
    icon: 'javascript-icon.svg'
  },
  {
    category: 'Frontend',
    name: 'HTML/CSS',
    level: 4,
    icon: 'html5-icon.svg'
  },
  {
    category: 'Backend',
    name: 'Node.js',
    level: 4,
    icon: 'nodejs-icon.svg'
  },
  {
    category: 'Backend',
    name: 'Express',
    level: 4,
    icon: 'express-icon.svg'
  },
  {
    category: 'Database',
    name: 'MongoDB',
    level: 4,
    icon: 'mongodb-icon.svg'
  },
  {
    category: 'Database',
    name: 'SQL',
    level: 3,
    icon: 'sql-icon.svg'
  },
  {
    category: 'DevOps',
    name: 'Git',
    level: 4,
    icon: 'git-icon.svg'
  },
  {
    category: 'DevOps',
    name: 'Docker',
    level: 3,
    icon: 'docker-icon.svg'
  }
];

const about = {
  name: 'John Doe',
  title: 'Full Stack Developer',
  bio: 'Passionate full stack developer with 5+ years of experience building web applications. Specializing in JavaScript technologies including React, Node.js, and MongoDB. I love creating clean, efficient, and user-friendly applications.',
  avatar: 'profile.jpg',
  location: 'San Francisco, CA',
  email: 'johndoe@example.com',
  resumeLink: 'resume.pdf',
  education: [
    {
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: new Date('2014-09-01'),
      endDate: new Date('2018-05-31'),
      description: 'Graduated with honors. Focus on software engineering and web technologies.'
    }
  ],
  experience: [
    {
      company: 'Tech Innovations Inc.',
      position: 'Senior Full Stack Developer',
      startDate: new Date('2021-06-01'),
      current: true,
      description: 'Leading development of web applications for enterprise clients.',
      responsibilities: [
        'Architected and implemented scalable web applications',
        'Mentored junior developers',
        'Implemented CI/CD pipelines',
        'Optimized application performance'
      ]
    },
    {
      company: 'WebSolutions LLC',
      position: 'Full Stack Developer',
      startDate: new Date('2018-07-01'),
      endDate: new Date('2021-05-31'),
      description: 'Developed and maintained web applications for various clients.',
      responsibilities: [
        'Built responsive web applications using React',
        'Developed RESTful APIs using Node.js and Express',
        'Implemented database solutions with MongoDB and SQL',
        'Collaborated with design team to implement UI/UX improvements'
      ]
    }
  ]
};

const contact = {
  email: 'johndoe@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  socialLinks: [
    {
      name: 'GitHub',
      url: 'https://github.com/johndoe',
      icon: 'github-icon.svg'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/johndoe',
      icon: 'linkedin-icon.svg'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/johndoe',
      icon: 'twitter-icon.svg'
    }
  ]
};

const seedData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing data
    await Project.deleteMany();
    await Skill.deleteMany();
    await About.deleteMany();
    await Contact.deleteMany();

    console.log('Existing data cleared');

    // Seed new data
    await Project.insertMany(projects);
    console.log(`${projects.length} projects seeded`);

    await Skill.insertMany(skills);
    console.log(`${skills.length} skills seeded`);

    await About.create(about);
    console.log('About information seeded');

    await Contact.create(contact);
    console.log('Contact information seeded');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
