import Redis from 'ioredis';
import { env } from './env';
import { logger } from '../utils/logger';

export const redisClient = env.redisUrl
  ? new Redis(env.redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false
    })
  : null;

export const connectRedis = async (): Promise<void> => {
  if (!redisClient) {
    logger.info('Redis is not configured. Task list caching is disabled.');
    return;
  }

  try {
    await redisClient.connect();
    logger.info('Connected to Redis');
  } catch (error) {
    logger.warn('Redis is unavailable. Continuing without cache.', error);
  }
};
