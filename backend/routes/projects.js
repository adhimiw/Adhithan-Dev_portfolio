import express from 'express';
import Project from '../models/Project.js';
import { protect } from '../middleware/auth.js';
import { emitToRoom, ROOMS } from '../services/socketService.js';

const router = express.Router();

// @route   GET api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    // Construct full Cloudinary URLs for images
    const projectsWithFullImageUrls = projects.map(project => {
      const imagesWithFullUrls = project.images.map(image => {
        // Assuming the image is stored as a filename like 'image.jpg'
        // Construct the full Cloudinary URL. Replace 'YOUR_CLOUD_NAME' with your actual Cloudinary cloud name.
        // The folder 'portfolio' is based on the configuration in backend/config/cloudinary.js
        if (image && !image.startsWith('http')) {
          return `https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/portfolio/${image}`;
        }
        return image; // Return as is if it's already a URL or empty
      });
      return { ...project.toObject(), images: imagesWithFullUrls };
    });

    res.json(projectsWithFullImageUrls);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/projects/:id
// @desc    Get project by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/projects
// @desc    Create a project
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const project = await newProject.save();

    // Emit WebSocket event for real-time updates
    const projects = await Project.find().sort({ createdAt: -1 });
    emitToRoom(ROOMS.PROJECTS, 'project-created', { project, projects });
    emitToRoom(ROOMS.ADMIN, 'admin-notification', {
      type: 'project',
      action: 'created',
      message: `New project "${project.title}" created`
    });

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Emit WebSocket event for real-time updates
    const projects = await Project.find().sort({ createdAt: -1 });
    emitToRoom(ROOMS.PROJECTS, 'project-updated', { project, projects });
    emitToRoom(ROOMS.ADMIN, 'admin-notification', {
      type: 'project',
      action: 'updated',
      message: `Project "${project.title}" updated`
    });

    res.json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    const projectTitle = project.title;
    await project.deleteOne();

    // Emit WebSocket event for real-time updates
    const projects = await Project.find().sort({ createdAt: -1 });
    emitToRoom(ROOMS.PROJECTS, 'project-deleted', {
      deletedId: req.params.id,
      projects
    });
    emitToRoom(ROOMS.ADMIN, 'admin-notification', {
      type: 'project',
      action: 'deleted',
      message: `Project "${projectTitle}" deleted`
    });

    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).send('Server Error');
  }
});

export default router;
