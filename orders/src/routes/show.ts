import express, { Request, Response } from "express";
import {
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from "@microauth/common";

import { Order } from "../models/Orders";

const router = express.Router();
router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const response = await Order.findById(req.params.orderId).populate(
      "ticket"
    );
    if (!response) {
      throw new NotFoundError();
    }
    if (response.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    // console.log(response);
    res.status(200).send(response);
  }
);
export { router as showOrderRouter };
