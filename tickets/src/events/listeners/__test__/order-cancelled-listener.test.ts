import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent, OrderStatus } from "@microauth/common";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import Ticket from "../../../models/Ticket";
const setup = async () => {
  //create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);
  //create and save a ticket
  const userId = mongoose.Types.ObjectId().toHexString();
  const orderId = mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "concert",
    price: 21,
    userId,
  });
  ticket.set(orderId);
  const savedTicket = await ticket.save();
  //create fake data object
  const data: OrderCancelledEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: savedTicket.id,
    },
  };
  //create fake message
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, ticket, data, msg };
};

it("should ack the message", async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it("should set the orderId of the ticket", async () => {
  const { listener, ticket, data, msg } = await setup();
  //listener has saved the updated ticket
  await listener.onMessage(data, msg);
  //get update ticket from DB and check orderId
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket?.orderId).toBeUndefined();
});

it("should publish ticket updated event ", async () => {
  const { listener, ticket, data, msg } = await setup();
  // console.log("first data: ", data);
  // console.log("first ticket: ", ticket);
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  // console.log(natsWrapper);
  //here we must use
  // @ts-ignore
  // console.log("mock-calls", natsWrapper.client.publish.mock.calls);

  //for TS is as jest.Mock natsWrapper is mocked so we are telling TS that this is jest.Mock
  const ticketUpdatedData = JSON.parse(
    //order in the array [2][1] 2 because this the third test so this the third ticket
    //or clear mocks before each test
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  // console.log("ticket updated:", ticketUpdatedData);
  // console.log("second data: ", data);
  expect(ticketUpdatedData.orderId).toBeUndefined();
});
