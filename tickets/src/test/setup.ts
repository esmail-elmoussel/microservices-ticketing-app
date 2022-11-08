process.env.JWT_SECRET = "asdkajsh";

import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo: MongoMemoryServer;

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

declare global {
  var register: () => string;
}

global.register = () => {
  const user = { email: "test@test.com", id: "6369c450843085e34db4c18c" };

  const token = jwt.sign(user, process.env.JWT_SECRET as string);

  const sessionBody = JSON.stringify({ token });

  const cookie = Buffer.from(sessionBody).toString("base64");

  return `session=${cookie}`;
};
