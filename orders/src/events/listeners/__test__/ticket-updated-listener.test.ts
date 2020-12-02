import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { TicketUpdatedEvent } from "@microauth/common";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/Ticket";

const setup = async () => {
  //create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  //create and save a ticket
  const id = mongoose.Types.ObjectId().toHexString();
  const userId = mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    id,
    price: 23,
    title: "concert",
  });
  const savedTicket = await ticket.save();
  //create a fake data event

  const data: TicketUpdatedEvent["data"] = {
    id: savedTicket.id,
    price: 12,
    userId,
    version: savedTicket.version + 1,
    title: "Big concert",
  };
  //create a fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  console.log(ticket);

  return { listener, data, ticket, msg };
};

it("should find update and save a ticket", async () => {
  const { listener, data, msg, ticket } = await setup();
  //call on message with the data object + message object
  await listener.onMessage(data, msg);
  //write assertion to make sure the ticket was found
  const foundTicket = await Ticket.findById(ticket.id);
  expect(foundTicket).toBeDefined();
  expect(foundTicket?.title).toEqual(data.title);
  expect(foundTicket?.price).toEqual(data.price);
  expect(foundTicket?.version).toEqual(data.version);
});

it("should ack a message", async () => {
  const { listener, data, msg } = await setup();
  //call on message with the data object + message object
  await listener.onMessage(data, msg);
  //write assertion to make sure ack function was called
  expect(msg.ack).toHaveBeenCalled();
});
