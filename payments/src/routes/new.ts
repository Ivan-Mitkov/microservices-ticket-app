import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from "@microauth/common";

import { Order } from "../models/Orders";

const router = express.Router();
router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    //Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    //chek user
    if (order.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }
    //check order cancelled
    if(order.status===OrderStatus.Cancelled){
      throw new BadRequestError('Order is already cancelled')
    }
  }
);

export { router as createChargeRouter };
