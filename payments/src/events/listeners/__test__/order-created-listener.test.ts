import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, OrderStatus } from "@microauth/common";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/Orders";

const setup = async () => {
  //create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);
  //create and save a ticket
  const userId = mongoose.Types.ObjectId().toHexString();

  //create fake data object
  const data: OrderCreatedEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId,
    expiresAt: "3232",
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
      price: 21,
    },
  };

  //create fake message
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

it("should ack the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
it("should replicate the order info ", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const order = await Order.findById(data.id);
  expect(order?.id).toEqual(data.id);
  expect(order?.price).toEqual(data.ticket.price);
});
