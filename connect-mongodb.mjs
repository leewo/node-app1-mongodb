import mongoose from 'mongoose';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

async function connectToMongoDB() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  async function connectToMongoDB() {
    try {
      const uri = process.env.MONGODB_URI.replace('${MONGODB_PASSWORD}', process.env.MONGODB_PASSWORD);
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

  console.log('await connectToMongoDB()');
  await connectToMongoDB();
};

export default connectToMongoDB;
