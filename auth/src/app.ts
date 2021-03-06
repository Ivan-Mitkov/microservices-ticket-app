import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler, NotFoundError } from "@microauth/common";

const app = express();
//traffic comes from ingress proxy so we tell express to trust this proxy
app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.all("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
