import { redisClient } from '../config/redis';
import { env } from '../config/env';

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    if (!redisClient || redisClient.status !== 'ready') return null;
    const value = await redisClient.get(key);
    return value ? (JSON.parse(value) as T) : null;
  },

  async set(key: string, value: unknown, ttl = env.cacheTtlSeconds): Promise<void> {
    if (!redisClient || redisClient.status !== 'ready') return;
    await redisClient.set(key, JSON.stringify(value), 'EX', ttl);
  },

  async delByPattern(pattern: string): Promise<void> {
    if (!redisClient || redisClient.status !== 'ready') return;
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  }
};
