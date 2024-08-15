import express from 'express';
import mongoose from 'mongoose';
import routes from './routes/routes.mjs';
import connectToMongoDB from './connect-mongodb.mjs';

import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.JWT_SECRET);
console.log(process.env.NODE_ENV);
console.log(process.env.PORT);
console.log(process.env.MONGODB_URI);
// console.log(process.env.MONGODB_URI_TEST);
// console.log(process.env.MONGODB_URI_PROD);
// console.log(process.env.MONGODB_URI_DEV);
// console.log(process.env.MONGODB_URI_LOCAL);
// console.log(process.env.MONGODB_URI_LOCAL_TEST);
// console.log(process.env.MONGODB_URI_LOCAL_PROD);
// console.log(process.env.MONGODB_URI_LOCAL_DEV);
// console.log(process.env.MONGODB_URI_LOCAL_TEST_DEV);
// console.log(process.env.MONGODB_URI_LOCAL_PROD_DEV);
// console.log(process.env.MONGODB_URI_LOCAL_PROD_TEST);

async function startServer() {
  console.log('try to connect connectToMongoDB()');
  await connectToMongoDB();
  console.log('after connectToMongoDB()');

  const app = express();
  {
    console.log('add express middleware');
    // JSON 요청 본문과 URL-encoded 데이터를 파싱할 수 있게 해주는 미들웨어
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/api', routes);

    // 오류 처리 미들웨어를 추가
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something broke!');
    });
  }

  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer().catch(console.error);

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed.');
  process.exit(0);
});