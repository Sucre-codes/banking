import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDb = async (): Promise<void> => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGO_URI);
};
