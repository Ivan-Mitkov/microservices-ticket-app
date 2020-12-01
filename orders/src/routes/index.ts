import express, { Request, Response } from "express";
import { NotFoundError, requireAuth } from "@microauth/common";

import {Order} from "../models/Orders";

const router = express.Router();
router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const response = await Order.find({ userId: req.currentUser!.id }).populate(
    "ticket"
  );
  if (!response) {
    throw new NotFoundError();
  }

  // console.log(response);
  res.status(200).send(response);
});
export { router as indexOrderRouter };
