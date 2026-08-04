import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async () => {
  try {
    if (!config.mongoUri || config.mongoUri.includes('<username>')) {
      console.warn('⚠️ MongoDB URI is not configured correctly. Skipping database connection.');
      return;
    }

    const conn = await mongoose.connect(config.mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Do not exit the process, allow the app to run without DB if it fails, or exit if strict dependency
    // process.exit(1); 
  }
};
