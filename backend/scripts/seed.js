import About from '../models/About.js';
import Contact from '../models/Contact.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import connectDB from '../config/db.js';

const seedData = async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing data
    await About.deleteMany({});
    await Contact.deleteMany({});
    await Project.deleteMany({});
    await Skill.deleteMany({});

    // Create new about document
    await About.create({
      name: "Adhithan R",
      title: "Full Stack Developer",
      bio: "Passionate and skilled Full Stack Developer with a strong foundation in computer science and a specialization in AI. Eager to contribute to innovative projects and create impactful solutions.",
      location: "Sendurai, Ariyalur 621714",
      email: "adhithanraja6@gmail.com",
      education: [],
      experience: []
    });

    console.log('About data seeded successfully');

    // Seed contact data
    await Contact.create({
      email: "adhithanraja6@gmail.com",
      phone: "+91 1234567890",
      location: "Sendurai, Ariyalur 621714",
      socialLinks: [
        {
          name: "GitHub",
          url: "https://github.com/yourusername",
          icon: "github"
        },
        {
          name: "LinkedIn",
          url: "https://linkedin.com/in/yourusername",
          icon: "linkedin"
        }
      ]
    });

    console.log('Contact data seeded successfully');

    // Seed projects data
    const projects = [
      {
        title: "Portfolio Website",
        description: "A responsive portfolio website built with React and MongoDB",
        longDescription: "A full-stack portfolio website built with React, Express, and MongoDB. Features include project showcase, skills visualization, and contact form.",
        technologies: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
        images: ["portfolio1.jpg", "portfolio2.jpg"],
        githubLink: "https://github.com/yourusername/portfolio",
        liveLink: "https://yourusername.github.io/portfolio",
        featured: true
      },
      {
        title: "E-commerce Platform",
        description: "A full-featured e-commerce platform with payment integration",
        longDescription: "An e-commerce platform with product catalog, shopping cart, user authentication, and payment processing using Stripe.",
        technologies: ["React", "Node.js", "MongoDB", "Express", "Redux", "Stripe"],
        images: ["ecommerce1.jpg", "ecommerce2.jpg"],
        githubLink: "https://github.com/yourusername/ecommerce",
        liveLink: "https://yourusername.github.io/ecommerce",
        featured: true
      },
      {
        title: "Task Management App",
        description: "A task management application with drag-and-drop interface",
        longDescription: "A task management application with features like task creation, assignment, status tracking, and a drag-and-drop interface for easy management.",
        technologies: ["React", "TypeScript", "Firebase", "Material UI"],
        images: ["taskapp1.jpg", "taskapp2.jpg"],
        githubLink: "https://github.com/yourusername/taskapp",
        featured: false
      }
    ];

    await Project.insertMany(projects);
    console.log(`${projects.length} projects seeded successfully`);

    // Seed skills data
    const skills = [
      {
        category: "Frontend",
        name: "React",
        level: 5,
        icon: "react"
      },
      {
        category: "Frontend",
        name: "JavaScript",
        level: 5,
        icon: "javascript"
      },
      {
        category: "Frontend",
        name: "TypeScript",
        level: 4,
        icon: "typescript"
      },
      {
        category: "Frontend",
        name: "HTML/CSS",
        level: 5,
        icon: "html"
      },
      {
        category: "Backend",
        name: "Node.js",
        level: 4,
        icon: "nodejs"
      },
      {
        category: "Backend",
        name: "Express",
        level: 4,
        icon: "express"
      },
      {
        category: "Backend",
        name: "MongoDB",
        level: 4,
        icon: "mongodb"
      },
      {
        category: "Other",
        name: "Git",
        level: 5,
        icon: "git"
      }
    ];

    await Skill.insertMany(skills);
    console.log(`${skills.length} skills seeded successfully`);

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();