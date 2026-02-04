import mongoose from 'mongoose';
import { env } from './env';
import { log } from 'console';

export const connectDb = async (): Promise<void> => {
  mongoose.set('strictQuery', true);
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('mongodb connected')
    }catch (error) {
    console.log('mongodb connection error',error)
  }
}