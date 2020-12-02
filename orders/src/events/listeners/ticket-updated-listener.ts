import { Message } from "node-nats-streaming";
import { Subjects, TicketUpdatedEvent, Listener } from "@microauth/common";
import { Ticket } from "../../models/Ticket";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  //send event to one instance of orders service, so we are creating queuegroup
  queueGroupName = QUEUE_GROUP_NAME;
  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    //Ticket model in order service
    const { title, price, id, userId, version } = data;
    //CONCURRENCY find previous ticket
    const ticket = await Ticket.findByEvent({ id, version });
    //if version is out of order
    if (!ticket) {
      throw new Error("Tciket not found");
    }
    ticket.set({ title, price });
    await ticket.save();
    //Accept message
    msg.ack();
  }
}
