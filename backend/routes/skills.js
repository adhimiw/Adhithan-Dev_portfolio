import express from 'express';
import Skill from '../models/Skill.js';
import { protect } from '../middleware/auth.js';
import { emitToRoom, ROOMS } from '../services/socketService.js';

const router = express.Router();

// @route   GET api/skills
// @desc    Get all skills
// @access  Public
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/skills/:id
// @desc    Get skill by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ msg: 'Skill not found' });
    }

    res.json(skill);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Skill not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/skills
// @desc    Create a skill
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const newSkill = new Skill(req.body);
    const skill = await newSkill.save();

    // Emit WebSocket event for real-time updates
    const skills = await Skill.find();
    emitToRoom(ROOMS.SKILLS, 'skill-created', { skill, skills });
    emitToRoom(ROOMS.ADMIN, 'admin-notification', {
      type: 'skill',
      action: 'created',
      message: `New skill "${skill.name}" created`
    });

    res.json(skill);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/skills/:id
// @desc    Update a skill
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({ msg: 'Skill not found' });
    }

    // Emit WebSocket event for real-time updates
    const skills = await Skill.find();
    emitToRoom(ROOMS.SKILLS, 'skill-updated', { skill, skills });
    emitToRoom(ROOMS.ADMIN, 'admin-notification', {
      type: 'skill',
      action: 'updated',
      message: `Skill "${skill.name}" updated`
    });

    res.json(skill);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Skill not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/skills/:id
// @desc    Delete a skill
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ msg: 'Skill not found' });
    }

    const skillName = skill.name;
    await skill.deleteOne();

    // Emit WebSocket event for real-time updates
    const skills = await Skill.find();
    emitToRoom(ROOMS.SKILLS, 'skill-deleted', {
      deletedId: req.params.id,
      skills
    });
    emitToRoom(ROOMS.ADMIN, 'admin-notification', {
      type: 'skill',
      action: 'deleted',
      message: `Skill "${skillName}" deleted`
    });

    res.json({ msg: 'Skill removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Skill not found' });
    }
    res.status(500).send('Server Error');
  }
});

export default router;
