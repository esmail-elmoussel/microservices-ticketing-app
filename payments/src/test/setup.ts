process.env.JWT_SECRET = "hasghdj";
process.env.MONGO_URI = "asdkj";
process.env.NATS_CLUSTER_ID = "asdk";
process.env.NATS_CLIENT_ID = "asd";
process.env.NATS_URL = "das";
process.env.STRIPE_SECRET_KEY = "asd";

import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Types } from "mongoose";

jest.mock("../nats-wrapper.ts");
jest.mock("../stripe.ts");

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

afterEach(async () => {
  jest.clearAllMocks();

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
  var register: (id?: string) => string;
}

global.register = (id?: string) => {
  const user = { email: "test@test.com", id: id || new Types.ObjectId() };

  const token = jwt.sign(user, process.env.JWT_SECRET as string);

  const sessionBody = JSON.stringify({ token });

  const cookie = Buffer.from(sessionBody).toString("base64");

  return `session=${cookie}`;
};
