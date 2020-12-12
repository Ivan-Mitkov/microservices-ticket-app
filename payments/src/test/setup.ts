import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import request from "supertest";
import { app } from "../app";
import dotenv from "dotenv";
declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
    }
  }
}

//mocks and real file with same path from this module
jest.mock("../nats-wrapper");
//for mocked stripe only
// jest.mock("../stripe");
dotenv.config();
// console.log(process.env.STRIPE_KEY);

let mongo: any;
//before test start create new instance of memory server
beforeAll(async () => {
  //clear natsWrapper publish mock
  jest.clearAllMocks();
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
  jest.clearAllMocks();

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
global.signin = (id?: string) => {
  //Build a jwt payload {id,email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };
  //create jwt
  const token = jwt.sign(payload, process.env.jwt!);
  //build session object {jwt:MY_JWT}
  const session = { jwt: token };
  //Turn that session into JSON
  const sessionJson = JSON.stringify(session);
  //Take JSON and encode it as based64
  const base64 = Buffer.from(sessionJson).toString("base64");
  //return a string, thats the cookie with the encoded data
  return [`express:sess=${base64}`];
};
