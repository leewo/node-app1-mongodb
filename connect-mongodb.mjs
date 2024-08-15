import mongoose from 'mongoose';

async function connectToMongoDB() {
  try {
    const uri = process.env.MONGODB_URI.replace('${MONGODB_PASSWORD}', process.env.MONGODB_PASSWORD); // MONGODB_URI에서 ${MONGODB_PASSWORD} 플레이스홀더를 사용. 이는 실제 비밀번호로 대체
    const clientOptions = {
      serverApi: { version: '1', strict: true, deprecationErrors: true }
    };

    await mongoose.connect(uri, clientOptions);
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

export default connectToMongoDB;
