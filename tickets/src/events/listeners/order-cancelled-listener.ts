import {
  Listener,
  OrderCancelledEvent,
  Subjects,
  NotFoundError,
} from "@microauth/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queueGroupName";
import Ticket from "../../models/Ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  //text of the event message
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  //how is called the group wich recieves this message
  queueGroupName = QUEUE_GROUP_NAME;
  //what to do when receive the message, here is the connection with nats
  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    //find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    //if no ticket throw error
    if (!ticket) {
      throw new NotFoundError();
    }
    //mark the ticket as being reserved by setting orderId
    ticket.set({ orderId: undefined });
    //save the ticket
    await ticket.save();
    //PUBLISH EVENT OR NOT SYNC WITH ORDERS TICKET if order is cancelled
    //await is to throw an error and not going to ack
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: undefined,
    });
    //ack the message
    msg.ack();
  }
}
