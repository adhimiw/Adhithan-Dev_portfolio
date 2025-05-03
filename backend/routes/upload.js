import express from 'express';
import { upload, documentUpload, cloudinary } from '../config/cloudinary.js';
import { protect } from '../middleware/auth.js';
import About from '../models/About.js';

const router = express.Router();

// @route   POST api/upload
// @desc    Upload an image
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Return the Cloudinary URL
    res.json({
      url: req.file.path,
      publicId: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: error.message || 'Server error during upload'
    });
  }
});

// @route   DELETE api/upload/:publicId
// @desc    Delete an image from Cloudinary
// @access  Private
router.delete('/:publicId', protect, async (req, res) => {
  try {
    const { publicId } = req.params;

    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(400).json({ error: 'Failed to delete image' });
    }
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      error: error.message || 'Server error during image deletion'
    });
  }
});

// @route   POST api/upload/resume
// @desc    Upload a resume and update the About model
// @access  Private
router.post('/resume', protect, documentUpload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get the URL of the uploaded file
    const resumeUrl = req.file.path;

    // Update the About model with the new resume link
    let about = await About.findOne();

    if (about) {
      about.resumeLink = resumeUrl;
      await about.save();
    } else {
      // If no About document exists yet, create one
      about = new About({
        name: 'Your Name',
        title: 'Your Title',
        bio: 'Your Bio',
        resumeLink: resumeUrl
      });
      await about.save();
    }

    // Return the Cloudinary URL and updated About object
    res.json({
      url: resumeUrl,
      publicId: req.file.filename,
      about: about
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({
      error: error.message || 'Server error during resume upload'
    });
  }
});

export default router;
