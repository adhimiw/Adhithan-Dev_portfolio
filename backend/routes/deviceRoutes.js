import express from 'express';
import Device from '../models/Device.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Register a device (requires authentication)
router.post('/register', protect, async (req, res) => {
  try {
    const { deviceToken, deviceType, deviceName } = req.body;
    const userId = req.admin.email; // Use email as userId

    if (!deviceToken) {
      return res.status(400).json({ message: 'Device token is required' });
    }

    // Check if device already exists
    const existingDevice = await Device.findOne({ userId, deviceToken });

    if (existingDevice) {
      // Update existing device
      existingDevice.deviceType = deviceType || existingDevice.deviceType;
      existingDevice.deviceName = deviceName || existingDevice.deviceName;
      existingDevice.isActive = true;
      existingDevice.lastActive = new Date();

      await existingDevice.save();
      return res.status(200).json({ message: 'Device updated successfully', device: existingDevice });
    }

    // Create new device
    const newDevice = new Device({
      userId,
      deviceToken,
      deviceType: deviceType || 'web',
      deviceName: deviceName || 'Unknown Device',
      isActive: true,
      lastActive: new Date(),
    });

    await newDevice.save();
    res.status(201).json({ message: 'Device registered successfully', device: newDevice });
  } catch (error) {
    console.error('Error registering device:', error);
    res.status(500).json({ message: 'Error registering device' });
  }
});

// Unregister a device (requires authentication)
router.post('/unregister', protect, async (req, res) => {
  try {
    const { deviceToken } = req.body;
    const userId = req.admin.email;

    if (!deviceToken) {
      return res.status(400).json({ message: 'Device token is required' });
    }

    // Find and update device
    const device = await Device.findOne({ userId, deviceToken });

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Set device as inactive
    device.isActive = false;
    await device.save();

    res.status(200).json({ message: 'Device unregistered successfully' });
  } catch (error) {
    console.error('Error unregistering device:', error);
    res.status(500).json({ message: 'Error unregistering device' });
  }
});

// Get all devices for current user (requires authentication)
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.admin.email;
    const devices = await Device.find({ userId });

    res.status(200).json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ message: 'Error fetching devices' });
  }
});

export default router;
