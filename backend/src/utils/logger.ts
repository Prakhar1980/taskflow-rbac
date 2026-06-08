import path from 'path';
import winston from 'winston';
import { env } from '../config/env';

const transports: winston.transport[] = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: path.join(process.cwd(), 'src', 'logs', 'error.log'),
    level: 'error'
  }),
  new winston.transports.File({
    filename: path.join(process.cwd(), 'src', 'logs', 'combined.log')
  })
];

export const logger = winston.createLogger({
  level: env.nodeEnv === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports
});
