import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "@microauth/common";
import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/Ticket";

const setup = async () => {
  //create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  //create a fake data event
  const id = mongoose.Types.ObjectId().toHexString();
  const userId = mongoose.Types.ObjectId().toHexString();
  const data: TicketCreatedEvent["data"] = {
    id,
    price: 23,
    userId,
    version: 0,
    title: "concert",
  };
  //create a fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("should create and saves a ticket", async () => {
  const { listener, data, msg } = await setup();
  //call on message with the data object + message object
  await listener.onMessage(data, msg);
  //write assertion to make sure the ticket was created
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual(data.title);
});

it("should ack a message", async () => {
  const { listener, data, msg } = await setup();
  //call on message with the data object + message object
  await listener.onMessage(data, msg);
  //write assertion to make sure ack function was called
  expect(msg.ack).toHaveBeenCalled();
});
