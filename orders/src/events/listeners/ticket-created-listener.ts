import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@microauth/common";
import { Ticket } from "../../models/Ticket";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  //send event to one instance of orders service, so we are creating queuegroup
  queueGroupName = QUEUE_GROUP_NAME;
  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    //Ticket model in order service
    const { title, price, id } = data;
    const ticket = Ticket.build({ title, price, id });
    await ticket.save();
    //Accept message
    msg.ack();
  }
}
