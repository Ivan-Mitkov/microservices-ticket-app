import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  NotFoundError,
  OrderStatus,
} from "@microauth/common";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Order } from "../../models/Orders";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  //send event to one instance of orders service, so we are creating queuegroup
  queueGroupName = QUEUE_GROUP_NAME;
  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const { orderId, stripeId, id } = data;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    //check if order is already paid
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    //change it's status
    //ticket is unlocked in ticketSchema.methods.isReserved
    order.set({ status: OrderStatus.Complete });
    await order.save();
    //should emit an event but no other service will change this order
    //Accept message
    msg.ack();
  }
}
