import mongoose from 'mongoose';

// MongoDB connection string - using MongoDB Atlas
const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || 'mongodb://127.0.0.1:27017/voting-app';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the VITE_MONGODB_URI environment variable in your .env file'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// Define a safe global object that works in both browser and Node.js
const globalObj = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {} as any;

// Create mongoose property on global object if it doesn't exist
if (!('mongoose' in globalObj)) {
  globalObj.mongoose = { conn: null, promise: null };
}

let cached = globalObj.mongoose;

async function connectToDatabase() {
  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    try {
      console.log('Connecting to MongoDB Atlas...');
      cached.promise = mongoose.connect(MONGODB_URI, opts);
      cached.conn = await cached.promise;
      console.log('Successfully connected to MongoDB');
      return cached.conn;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      cached.promise = null;
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

export default connectToDatabase;
