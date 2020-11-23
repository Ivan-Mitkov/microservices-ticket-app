import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  //check if env variable is defined
  if (!process.env.jwt) {
    throw new Error("ENV Variable Not Found");
  }
  //connect to ClusterIp service
  // name: auth-mongo-srv
  // ports:
  //   port: 27017
  try {
    //mongodb://[service]:[port]/[name of db mongo wiil create if not existing ]
    await mongoose.connect("mongodb://tickets-mongo-srv:27017/tickets", {
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
