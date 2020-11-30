import express, { Request, Response } from "express";
import {
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from "@microauth/common";

import Order, { OrderStatus } from "../models/Orders";

const router = express.Router();
router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    //update status
    order.status = OrderStatus.Cancelled;
    await order.save();
    //@TODO publish an event that order is cancelled

    res.status(204).send(order);
  }
);
export { router as deleteOrderRouter };
