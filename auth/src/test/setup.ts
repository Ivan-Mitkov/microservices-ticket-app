import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

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
