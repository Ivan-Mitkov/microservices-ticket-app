import {
  Listener,
  OrderCreatedEvent,
  Subjects,
  NotFoundError,
} from "@microauth/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queueGroupName";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  //text of the event message
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  //how is called the group wich recieves this message
  queueGroupName = QUEUE_GROUP_NAME;
  //what to do when receive the message, here is the connection with nats
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    //get delay from expiresAt
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    const testDelay = 12000;
    console.log("Waitng for:", delay, " millisecunds");
    //create new job
    await expirationQueue.add({ orderId: data.id }, { delay: delay });
    //ack the message
    msg.ack();
  }
}
