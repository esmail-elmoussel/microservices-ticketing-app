import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo: MongoMemoryServer;

process.env.JWT_SECRET = "asdkajsh";

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

afterEach(async () => {
  await removeAllCollections();
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.disconnect();
});

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];

    // @ts-ignore
    await collection.deleteMany();
  }
}
