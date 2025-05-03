import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

// Admin schema
const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to hash password
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Create Admin model
const Admin = mongoose.model('Admin', AdminSchema);

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');

    try {
      // Create admin user
      const admin = await Admin.create({
        username: 'portfolioadmin',
        email: 'portfolio@example.com',
        password: 'password123'
      });

      console.log('Admin user created successfully:', admin);
    } catch (error) {
      console.error('Error creating admin user:', error.message);
    } finally {
      // Close the connection
      mongoose.connection.close();
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
