// swaggerConfig.js
import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Management API',
      version: '1.0.0',
      description: 'API documentation for your Node.js application',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'User Management API',
      },
    ],
  },
  apis: [path.join(__dirname, './routes/*.mjs')], // 모든 라우트 파일을 포함
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;