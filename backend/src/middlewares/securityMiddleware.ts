import compression from 'compression';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export const securityMiddleware = [
  helmet(),
  cors({
    origin: env.clientUrl,
    credentials: true
  }),
  compression(),
  mongoSanitize(),
  rateLimit({
    windowMs: env.rateLimitWindowMs,
    max: env.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests, please try again later'
    }
  }),
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  })
];
