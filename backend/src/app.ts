import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware';
import { securityMiddleware } from './middlewares/securityMiddleware';
import routes from './routes';

export const app = express();

app.use(securityMiddleware);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.use(`/api/${env.apiVersion}`, routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFoundHandler);
app.use(errorHandler);
