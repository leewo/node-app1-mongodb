import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = 3000;

const uri = "mongodb+srv://xiphmash:password@cluster0.gvkuy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello, World! ES Modules are working!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});