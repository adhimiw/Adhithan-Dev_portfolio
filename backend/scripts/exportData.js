import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import connectDB from '../config/db.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import About from '../models/About.js';
import Contact from '../models/Contact.js';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Directory where JSON files will be saved
const dataDir = join(__dirname, '../../public/data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const exportData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB for data export');

    // Export Projects
    const projects = await Project.find().sort({ createdAt: -1 });
    fs.writeFileSync(
      join(dataDir, 'projects.json'),
      JSON.stringify(projects, null, 2)
    );
    console.log(`Exported ${projects.length} projects`);

    // Export Skills
    const skills = await Skill.find();
    fs.writeFileSync(
      join(dataDir, 'skills.json'),
      JSON.stringify(skills, null, 2)
    );
    console.log(`Exported ${skills.length} skills`);

    // Export About
    const about = await About.findOne();
    fs.writeFileSync(
      join(dataDir, 'about.json'),
      JSON.stringify(about || {}, null, 2)
    );
    console.log('Exported about information');

    // Export Contact
    const contact = await Contact.findOne();
    fs.writeFileSync(
      join(dataDir, 'contact.json'),
      JSON.stringify(contact || {}, null, 2)
    );
    console.log('Exported contact information');

    console.log('All data exported successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error exporting data:', error);
    process.exit(1);
  }
};

// Run the export function
exportData();
