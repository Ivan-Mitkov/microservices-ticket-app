import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { currentUser, errorHandler, NotFoundError } from "@microauth/common";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexRouter } from "./routes/index";
import { updateTicketRouter } from "./routes/update";

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
app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexRouter);
app.use(updateTicketRouter);

app.all("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
