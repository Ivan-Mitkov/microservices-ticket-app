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
import { stripe } from "../stripe";
import { Order } from "../models/Orders";
import { Payment } from "../models/Payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

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
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Order is already cancelled");
    }
    //https://stripe.com/docs/api/charges/create?lang=node
    const charge = await stripe.charges.create({
      currency: "bgn",
      amount: order.price * 100,
      source: token,
    });
    const payment = Payment.build({ orderId, stripeId: charge.id });
    await payment.save();
    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });
    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
