import {
  Listener,
  OrderCancelledEvent,
  Subjects,
  NotFoundError,
  OrderStatus,
} from "@microauth/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Order } from "../../models/Orders";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  //text of the event message
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  //how is called the group wich recieves this message
  queueGroupName = QUEUE_GROUP_NAME;
  //what to do when receive the message, here is the connection with nats
  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    //get order from DB
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!order) {
      throw new NotFoundError();
    }
    // change status to cancelled
    order.set({ status: OrderStatus.Cancelled });
    // console.log(order);
    await order.save();
    //ack the message
    msg.ack();
  }
}
