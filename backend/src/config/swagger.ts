import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Scalable RBAC Task API',
      version: '1.0.0',
      description: 'REST API with authentication, refresh tokens, RBAC, task CRUD, validation, and pagination.'
    },
    servers: [
      {
        url: `http://localhost:${env.port}/api/${env.apiVersion}`,
        description: 'Local API server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/docs/*.ts', './src/routes/*.ts']
});
