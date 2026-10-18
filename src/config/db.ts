import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('strictQuery', true);

export const connectDB = async () => {
  if (!env.mongoDbUri) {
    throw new Error('MONGODB_URI is not defined');
  }

  const conn = await mongoose.connect(env.mongoDbUri, {
    serverSelectionTimeoutMS: 10_000,
  });
  console.log(
    `MongoDB connected: ${conn.connection.host}/${conn.connection.name}`
  );

  mongoose.connection.on('error', error => {
    console.error(`MongoDB error: ${error.message}`);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });
};
