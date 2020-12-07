import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent, OrderStatus } from "@microauth/common";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/Orders";

const setup = async () => {
  //create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);
  //create and save a ticket
  const userId = mongoose.Types.ObjectId().toHexString();
  const id = mongoose.Types.ObjectId().toHexString();
  const order = await Order.build({
    id,
    price: 15,
    userId,
    version: 0,
    status: OrderStatus.Created,
  });
  await order.save();
  //create fake data object
  const data: OrderCancelledEvent["data"] = {
    id,
    version: 1,
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
    },
  };

  //create fake message
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg, order };
};

it("should ack the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
it("should change the status", async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);
  const currOrder = await Order.findById(data.id);
  expect(currOrder?.id).toEqual(data.id);
  expect(currOrder?.status).toEqual(OrderStatus.Cancelled);
});
