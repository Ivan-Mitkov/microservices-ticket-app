import express from "express";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes//signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Auth service listen on port 3000");
});
