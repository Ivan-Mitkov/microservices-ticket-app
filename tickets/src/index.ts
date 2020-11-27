import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  //check if env variable is defined
  if (!process.env.jwt) {
    throw new Error("ENV Variable Not Found");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("ENV Variable Not Found");
  }
  //connect to ClusterIp service
  // name: auth-mongo-srv
  // ports:
  //   port: 27017
  try {
    //connect to event bus
    //clusterId from infra/k8s/nats-depl.yaml spec: containers: args: [
    //   '-cid',
    //   'ticketing'
    // ]
    //clientId more or less random value
    //url from service in yaml
    await natsWrapper.connect("ticketing", "dsdsedf", "http://nats-srv:4222");
    //mongodb://[service]:[port]/[name of db mongo wiil create if not existing ]
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to mongo");
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log("Tickets service listen on port 3000");
  });
};

start();
