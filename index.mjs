import express from 'express';
import mongoose from 'mongoose';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

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
    const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

    await mongoose.connect(uri, clientOptions);
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

connectToMongoDB();

app.get('/', (req, res) => {
  res.send('Hello, World! ES Modules are working!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed.');
  process.exit(0);
});