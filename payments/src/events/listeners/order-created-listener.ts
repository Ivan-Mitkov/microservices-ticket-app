import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@microauth/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Order } from "../../models/Orders";
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const order = Order.build({
      id: data.id,
      userId: data.userId,
      status: data.status,
      price: data.ticket.price,
      version: data.version,
    });
    await order.save();
    msg.ack();
  }
}
