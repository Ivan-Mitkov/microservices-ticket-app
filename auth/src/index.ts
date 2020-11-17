import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes//signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.all("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

const start = async () => {
  //connect to ClusterIp service
  // name: auth-mongo-srv
  // ports:
  //   port: 27017
  try {
    //mongodb://[service]:[port]/[name of db mongo wiil create if not existing ]
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to mongo");
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log("Auth service listen on port 3000");
  });
};

start();
