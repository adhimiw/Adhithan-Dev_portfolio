import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local file first (if it exists), then from .env
const envLocalPath = join(dirname(__dirname), '../.env.local');
const envPath = join(dirname(__dirname), '../.env');

// Try to load .env.local first, then fall back to .env
dotenv.config({ path: envLocalPath });
dotenv.config({ path: envPath });

const connectDB = async () => {
  try {
    // Set mongoose options
    mongoose.set('strictQuery', false);

    // Display connection string (without credentials)
    const mongoUriDisplay = process.env.MONGO_URI
      ? process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@')
      : 'Not defined';
    console.log(`Attempting to connect to MongoDB with URI: ${mongoUriDisplay}`);

    // Connect to MongoDB Atlas with improved options
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // Increased timeout to 30 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      connectTimeoutMS: 30000, // Connection timeout
      // Add these options to help with connection issues
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10, // Limit connection pool size
      minPoolSize: 1,
      maxIdleTimeMS: 30000, // Close idle connections after 30 seconds
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Don't exit the process, let the application handle the error
    throw error;
  }
};

export default connectDB;
