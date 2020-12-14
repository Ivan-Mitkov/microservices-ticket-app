import express, { Request, Response } from "express";
import { NotFoundError } from "@microauth/common";

import Ticket from "../models/Ticket";

const router = express.Router();
router.get("/api/tickets", async (req: Request, res: Response) => {
  const response = await Ticket.find({ orderId: undefined });
  if (!response) {
    throw new NotFoundError();
  }
  // console.log(response);
  res.status(200).send(response);
});
export { router as indexRouter };
