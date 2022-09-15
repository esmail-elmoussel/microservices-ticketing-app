process.env.JWT_SECRET = "asdkajsh";

import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

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
  var register: () => Promise<string[]>;
}

global.register = async () => {
  const registerResponse = await request(app)
    .post("/api/users/register")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  const cookie = registerResponse.get("Set-Cookie");

  return cookie;
};
