import { Message } from "node-nats-streaming";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { Order, OrderStatus } from "../../../models/Orders";
import { Ticket } from "../../../models/Ticket";
import { ExpirationCompleteEvent } from "@microauth/common";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 21,
  });
  await ticket.save();

  const order = Order.build({
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    ticket: ticket,
    expiresAt: new Date(),
  });
  await order.save();
  //build fake data object
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, msg, ticket, order, data };
};

it("should update the order status to cancelled", async () => {
  const { listener, order, msg, ticket, data } = await setup();
  await listener.onMessage(data, msg);
  const cancelledOder = await Order.findById(order.id);
  expect(cancelledOder?.status).toEqual(OrderStatus.Cancelled);
});
it("emit an order cancelled event", async () => {
  const { listener, order, msg, ticket, data } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventData = JSON.parse(
    //calls is an array with all the times mock function has been invoked
    //called one time in previos expect so [1]
    (natsWrapper.client.publish as jest.Mock).mock.calls[1][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it("should ack the message ", async () => {
  const { listener, order, msg, ticket, data } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
