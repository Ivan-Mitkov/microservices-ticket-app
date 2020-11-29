import express, { Request, Response } from "express";
import { NotFoundError } from "@microauth/common";

import Order from "../models/Orders";

const router = express.Router();
router.get("/api/orders/:orderId", async (req: Request, res: Response) => {
  const response = await Order.find({ id: req.params.orderId });
  if (!response) {
    throw new NotFoundError();
  }
  // console.log(response);
  res.status(200).send(response);
});
export { router as showOrderRouter };
