import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>;
    }
  }
}
let mongo: any;
//before test start create new instance of memory server
beforeAll(async () => {
  process.env.jwt = "hjdshdskjh";
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  //reset all data
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

//stop memory server
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

//Define global function for getting authenticated user
//works only in tests
global.signin = async () => {
  const email = "test@test.com";
  const password = "123456";

  const response = await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(201);

  const cookie = response.get("Set-Cookie");
  return cookie;
};
