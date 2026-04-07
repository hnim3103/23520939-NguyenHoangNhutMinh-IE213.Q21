import app from './server.js';
import mongodb from 'mongodb';
import dotenv from 'dotenv';
import MovieDAO from './dao/movieDAO.js';
import ReviewsDAO from './dao/reviewsDAO.js';

dotenv.config();

const MongoClient = mongodb.MongoClient;
const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 8080;

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    await MovieDAO.injectDB(client);
    await ReviewsDAO.injectDB(client);
    console.log('Connected to MongoDB');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

run().catch(console.error);

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});

