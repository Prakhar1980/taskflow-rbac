import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongoUri);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('Could not connect to MongoDB', error);
    process.exit(1);
  }
};
