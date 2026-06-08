import http from 'http';
import { app } from './app';
import { connectDatabase } from './config/database';
import { connectRedis, redisClient } from './config/redis';
import { env } from './config/env';
import { logger } from './utils/logger';

const server = http.createServer(app);

const startServer = async () => {
  await connectDatabase();
  await connectRedis();

  server.listen(env.port, () => {
    logger.info(`API server listening on port ${env.port}`);
    logger.info(`Swagger docs: http://localhost:${env.port}/api-docs`);
  });
};

const shutdown = async (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully.`);
  server.close(async () => {
    if (redisClient && redisClient.status === 'ready') {
      await redisClient.quit();
    }
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

startServer().catch((error) => {
  logger.error('Failed to start server', error);
  process.exit(1);
});
