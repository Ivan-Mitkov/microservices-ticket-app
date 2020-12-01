import { OrderStatus } from "@microauth/common";
import request from "supertest";
import { app } from "../../app";
import {Order} from "../../models/Orders";
import {Ticket} from "../../models/Ticket";
//jest will import the mock nats-wrapper
import { natsWrapper } from "../../nats-wrapper";

const buildTicket = async () => {
  const ticket = Ticket.build({
    id:'dss',
    title: "football",
    price: 100,
  });
  await ticket.save();
  return ticket;
};
it("should cancell the order", async () => {
  //create a tickets
  const ticketOne = await buildTicket();

  //create  users
  const user = global.signin();
  //create one order
  const orderResponse = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticketOne.id })
    .expect(201);
  // console.log(orderResponse);
  //Make request to cancel order for user
  await request(app)
    .delete(`/api/orders/${orderResponse.body.order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(orderResponse.body.order.id);
  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it("should not cancell other user order", async () => {
  //create a tickets
  const ticketOne = await buildTicket();

  //create  users
  const user = global.signin();
  const user2 = global.signin();
  //create one order
  const orderResponse = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  //Make request to cancel order for user
  await request(app)
    .delete(`/api/orders/${orderResponse.body.order.id}`)
    .set("Cookie", user2)
    .expect(401);
});

it("emit event when cancelled ", async () => {
  //create a tickets
  const ticketOne = await buildTicket();

  //create  users
  const user = global.signin();
  const user2 = global.signin();
  //create one order
  const orderResponse = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  //Make request to cancel order for user
  await request(app)
    .delete(`/api/orders/${orderResponse.body.order.id}`)
    .set("Cookie", user2)
    .expect(401);
  // console.log(natsWrapper);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
