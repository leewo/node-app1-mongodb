import express from 'express';
import mongoose from 'mongoose';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/routes.mjs';

async function connectToMongoDB() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  async function getPasswordFromFile() {
    try {
      const password = await fs.readFile(path.join(__dirname, 'mongoDB cloud pw.txt'), 'utf-8');
      return password.trim(); // trim to remove any whitespace or newline characters
    } catch (error) {
      console.error('Error reading password file:', error);
      process.exit(1);
    }
  }

  async function connectToMongoDB() {
    try {
      const password = await getPasswordFromFile();
      const uri = `mongodb+srv://xiphmash:${password}@cluster0.gvkuy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
      const clientOptions = {
        serverApi: { version: '1', strict: true, deprecationErrors: true },

        /*
        아래 두 옵션이 명시적으로 적용되어 있지 않아도 최신 버전의 Mongoose (6.0 이상)에서는 이러한 옵션들이 기본적으로 true로 설정되어 있어 명시적으로 지정할 필요가 없다
        명시적으로 이 옵션들을 설정하고 싶거나 이전 버전의 Mongoose를 사용하고 있다면, 다음과 같이 코드를 수정하면 된다
        */
        // useNewUrlParser: true,    // MongoDB 드라이버의 새로운 URL 파서를 사용하도록 지시. 기존의 URL 파서는 더 이상 사용되지 않으며, 새로운 파서가 더 안정적
        // useUnifiedTopology: true  // MongoDB 드라이버의 새로운 토폴로지 엔진을 사용. 새로운 토폴로지 엔진은 연결 관리와 서버 모니터링을 개선하여 더 나은 성능과 안정성을 제공
      };

      await mongoose.connect(uri, clientOptions);
      console.log("Successfully connected to MongoDB!");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      process.exit(1);
    }
  }

  console.log('await connectToMongoDB()');
  await connectToMongoDB();
};

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

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed.');
  process.exit(0);
});