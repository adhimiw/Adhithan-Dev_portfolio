import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './backend/models/Admin.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const createAdmin = async () => {
  try {
    // Check if admin with this email already exists
    const adminByEmail = await Admin.findOne({ email: 'adhithanraja6@gmail.com' });

    if (adminByEmail) {
      console.log('Admin user with this email already exists. Updating...');

      // Update admin
      adminByEmail.username = 'admin';
      adminByEmail.password = 'idlypoDa@12';
      adminByEmail.isVerified = true;
      await adminByEmail.save();

      console.log('Admin user updated successfully');
    } else {
      // Check if username 'admin' is taken
      const adminByUsername = await Admin.findOne({ username: 'admin' });

      if (adminByUsername) {
        console.log('Username "admin" is already taken. Updating this user...');

        // Update existing admin
        adminByUsername.email = 'adhithanraja6@gmail.com';
        adminByUsername.password = 'idlypoDa@12';
        adminByUsername.isVerified = true;
        await adminByUsername.save();

        console.log('Admin user updated successfully');
      } else {
        // Create new admin
        const admin = await Admin.create({
          username: 'admin',
          email: 'adhithanraja6@gmail.com',
          password: 'idlypoDa@12',
          isVerified: true
        });

        console.log('Admin user created successfully:', admin.username);
      }
    }

    // Remove other admin users
    const result = await Admin.deleteMany({
      email: { $ne: 'adhithanraja6@gmail.com' }
    });

    console.log(`Removed ${result.deletedCount} other admin users`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB disconnected');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
