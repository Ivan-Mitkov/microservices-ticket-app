import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { NotFoundError, requireAuth, validateRequest } from "@microauth/common";
import { body } from "express-validator";

import Order from "../models/Orders";

const router = express.Router();
router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Ticket must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const response = await Order.find({});
    if (!response) {
      throw new NotFoundError();
    }
    // console.log(response);
    res.status(200).send(response);
  }
);
export { router as newOrderRouter };
