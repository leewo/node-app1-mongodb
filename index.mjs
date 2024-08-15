import express from 'express';
import mongoose from 'mongoose';
import v1Routes from './routes/v1/index.mjs';
import connectToMongoDB from './connect-mongodb.mjs';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.mjs';
import logger from './logger.mjs';

import dotenv from 'dotenv';
dotenv.config();

import dotenvSafe from 'dotenv-safe';
dotenvSafe.config({
  allowEmptyValues: true,
  example: '.env.example',
});

// swagger-jsdoc와 swagger-ui-express 패키지를 import
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import path from 'path';
import { fileURLToPath } from 'url';

logger.info(process.env.JWT_SECRET);
logger.info(process.env.NODE_ENV);
logger.info(process.env.PORT);
logger.info(process.env.MONGODB_URI);

async function startServer() {
  logger.info('try to connect connectToMongoDB()');
  await connectToMongoDB();
  logger.info('after connectToMongoDB()');

  const app = express();
  {
    logger.info('add express middleware');
    // JSON 요청 본문과 URL-encoded 데이터를 파싱할 수 있게 해주는 미들웨어
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // CORS 미들웨어를 추가
    const corsOptions = {
      origin: process.env.CORS_ORIGIN.split(','),   // CORS_ORIGIN 환경 변수를 사용하여 허용할 오리진을 설정 (ex: http://localhost:3000). 여러 개의 오리진을 허용하려면 쉼표로 구분 (ex: http://localhost:3000,http://localhost:3001)
      credentials: true,                            // 클라이언트에서 쿠키를 전송하려면 credentials 옵션을 true로 설정해야 한다
      optionsSuccessStatus: 200                     // CORS 요청에 대한 응답 상태 코드를 200으로 설정
    };
    app.use(cors(corsOptions));

    // 오류 처리 미들웨어를 추가
    app.use(errorHandler);

    app.use('/api/v1', v1Routes);

    // Swagger 미들웨어를 추가. /api-docs 경로로 API 문서를 확인할 수 있다
    // Swagger UI를 사용하여 API 문서를 시각적으로 확인할 수 있다
    // Swagger UI는 /api-docs 경로에 대한 GET 요청을 처리한다. 이 요청에 대한 응답으로 Swagger UI를 제공한다
    // Swagger UI는 Swagger 스펙을 사용하여 API 문서를 렌더링한다
    // Swagger 스펙은 OpenAPI 스펙을 사용하여 작성된 JSON 또는 YAML 파일이다
    {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      const options = {
        definition: {
          openapi: '3.0.0',
          info: {
            title: 'Sample API with Swagger',
            version: '1.0.0',
          },
        },
        apis: [path.join(__dirname, './routes/v1/*.mjs')], // API 스펙이 작성된 파일의 경로를 지정
      };

      const specs = swaggerJsdoc(options);
      app.use('/api-docs/v1', swaggerUi.serve, swaggerUi.setup(specs));
    }

    // 오류 처리 미들웨어를 추가
    app.use((err, req, res, next) => {
      logger.error(err.stack, { error: 'details' });
      res.status(500).send('Something broke!');
    });
  }

  const port = process.env.PORT;
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
}

startServer().catch(console.error);

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed.');
  process.exit(0);
});
