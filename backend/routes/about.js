import express from 'express';
import About from '../models/About.js';
import { protect } from '../middleware/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// @route   GET api/about
// @desc    Get about information
// @access  Public
router.get('/', async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({ msg: 'About information not found' });
    }
    res.json(about);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/about
// @desc    Create or update about information
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    // Check if about document already exists
    let about = await About.findOne();

    if (about) {
      // Update existing document
      about = await About.findOneAndUpdate(
        {}, // empty filter to match the first document
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      // Create new about document
      about = new About(req.body);
      await about.save();
    }

    res.json(about);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/about/education/:edu_id
// @desc    Update education entry
// @access  Private
router.put('/education/:edu_id', protect, async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({ msg: 'About information not found' });
    }

    // Find the index of the education entry to update
    const updateIndex = about.education.findIndex(
      edu => edu._id.toString() === req.params.edu_id
    );

    if (updateIndex === -1) {
      return res.status(404).json({ msg: 'Education entry not found' });
    }

    // Update the specific education entry
    // Make sure to merge existing fields with new ones, preserving the _id
    about.education[updateIndex] = {
      ...about.education[updateIndex].toObject(), // Keep existing fields like _id
      ...req.body // Apply updates from request body
    };

    await about.save();
    res.json(about.education[updateIndex]); // Return the updated entry

  } catch (err) {
    console.error('Error updating education:', err.message);
    res.status(500).send('Server Error');
  }
});


// @route   PUT api/about/education
// @desc    Add education
// @access  Private
router.put('/education', protect, async (req, res) => {
  try {
    let about = await About.findOne();

    if (!about) {
      return res.status(404).json({ msg: 'About information not found' });
    }

    // Add education to the beginning of the array
    about.education.unshift(req.body);
    await about.save();

    res.json(about);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/about/education/:edu_id
// @desc    Delete education
// @access  Private
router.delete('/education/:edu_id', protect, async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({ msg: 'About information not found' });
    }

    // Get remove index
    const removeIndex = about.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    if (removeIndex === -1) {
      return res.status(404).json({ msg: 'Education not found' });
    }

    // Remove education
    about.education.splice(removeIndex, 1);
    await about.save();

    res.json(about);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/about/experience/:exp_id
// @desc    Update experience entry
// @access  Private
router.put('/experience/:exp_id', protect, async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({ msg: 'About information not found' });
    }

    // Find the index of the experience entry to update
    const updateIndex = about.experience.findIndex(
      exp => exp._id.toString() === req.params.exp_id
    );

    if (updateIndex === -1) {
      return res.status(404).json({ msg: 'Experience entry not found' });
    }

    // Update the specific experience entry
    about.experience[updateIndex] = {
      ...about.experience[updateIndex].toObject(), // Keep existing fields like _id
      ...req.body // Apply updates from request body
    };

    await about.save();
    res.json(about.experience[updateIndex]); // Return the updated entry

  } catch (err) {
    console.error('Error updating experience:', err.message);
    res.status(500).send('Server Error');
  }
});


// @route   PUT api/about/experience
// @desc    Add experience
// @access  Private
router.put('/experience', protect, async (req, res) => {
  try {
    let about = await About.findOne();

    if (!about) {
      return res.status(404).json({ msg: 'About information not found' });
    }

    // Add experience to the beginning of the array
    about.experience.unshift(req.body);
    await about.save();

    res.json(about);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/about/experience/:exp_id
// @desc    Delete experience
// @access  Private
router.delete('/experience/:exp_id', protect, async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({ msg: 'About information not found' });
    }

    // Get remove index
    const removeIndex = about.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    if (removeIndex === -1) {
      return res.status(404).json({ msg: 'Experience not found' });
    }

    // Remove experience
    about.experience.splice(removeIndex, 1);
    await about.save();

    res.json(about);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/about/certificates/:cert_id
// @desc    Update certificate entry
// @access  Private
router.put('/certificates/:cert_id', protect, async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({ msg: 'About information not found' });
    }

    // Find the index of the certificate entry to update
    const updateIndex = about.certificates.findIndex(
      cert => cert._id.toString() === req.params.cert_id
    );

    if (updateIndex === -1) {
      return res.status(404).json({ msg: 'Certificate entry not found' });
    }

    // Update the specific certificate entry
    about.certificates[updateIndex] = {
      ...about.certificates[updateIndex].toObject(), // Keep existing fields like _id
      ...req.body // Apply updates from request body
    };

    await about.save();
    res.json(about.certificates[updateIndex]); // Return the updated entry

  } catch (err) {
    console.error('Error updating certificate:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/about/certificates
// @desc    Add certificate
// @access  Private
router.put('/certificates', protect, async (req, res) => {
  try {
    let about = await About.findOne();

    if (!about) {
      return res.status(404).json({ msg: 'About information not found' });
    }

    // Add certificate to the beginning of the array
    about.certificates.unshift(req.body);
    await about.save();

    res.json(about);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/about/certificates/:cert_id
// @desc    Delete certificate
// @access  Private
router.delete('/certificates/:cert_id', protect, async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({ msg: 'About information not found' });
    }

    // Get remove index
    const removeIndex = about.certificates
      .map(item => item.id)
      .indexOf(req.params.cert_id);

    if (removeIndex === -1) {
      return res.status(404).json({ msg: 'Certificate not found' });
    }

    // Remove certificate
    about.certificates.splice(removeIndex, 1);
    await about.save();

    res.json(about);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/about/avatar
// @desc    Get avatar image
// @access  Public
router.get('/avatar', async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about || !about.avatar) {
      // If no avatar in database, serve default image
      const defaultImagePath = path.join(__dirname, '../../public/profile.jpg');

      if (fs.existsSync(defaultImagePath)) {
        return res.sendFile(defaultImagePath);
      } else {
        return res.status(404).json({ msg: 'Avatar not found' });
      }
    }

    // If avatar is a URL, redirect to it
    if (about.avatar.startsWith('http')) {
      return res.redirect(about.avatar);
    }

    // If avatar is a local path, serve the file
    const avatarPath = path.join(__dirname, '../../public', about.avatar.replace(/^\//, ''));

    if (fs.existsSync(avatarPath)) {
      return res.sendFile(avatarPath);
    } else {
      return res.status(404).json({ msg: 'Avatar file not found' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
