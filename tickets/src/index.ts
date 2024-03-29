import mongoose from "mongoose";
import { app } from "./app";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  console.log("Starting tickets service..");
  //check if env variable is defined
  if (!process.env.jwt) {
    throw new Error("ENV Variable Not Found");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("ENV Variable Not Found");
  }
  if (!process.env.NATS_URL) {
    throw new Error("ENV Variable Not Found");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("ENV Variable Not Found");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("ENV Variable Not Found");
  }
  //connect to ClusterIp service
  // name: auth-mongo-srv
  // ports:
  //   port: 27017
  try {
    //connect to event bus
    //clusterId from infra/k8s/nats-depl.yaml spec: containers: args: ['-cid', 'ticketing'
    //clientId more or less random value
    //url from service in yaml
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    //gracefull shutdown of the client
    //put it in index to be seen easily
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    //intercept server and close client first
    //DOESN't WORK ON WINDOWS
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
    //CONNECT LISTENERS
    new OrderCancelledListener(natsWrapper.client).listen();
    new OrderCreatedListener(natsWrapper.client).listen();

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
