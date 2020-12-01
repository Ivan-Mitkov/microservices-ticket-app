import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import Order, { OrderStatus } from "../../models/Orders";
import Ticket from "../../models/Ticket";

//jest will import the mock nats-wrapper
import { natsWrapper } from "../../nats-wrapper";

it("returns an error if ticket does not exists ", async () => {
  const ticketId = mongoose.Types.ObjectId();
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId });

  expect(response.status).toEqual(404);
});
it("returns an error if ticket is already reserved ", async () => {
  //create a ticket and save it
  const ticket = Ticket.build({
    title: "Concert",
    price: 22,
  });
  await ticket.save();
  //create an order
  const order = Order.build({
    ticket,
    userId: "jkjlkjku",
    status: OrderStatus.Created,
    //not realy matters right now
    expiresAt: new Date(),
  });

  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket ", async () => {
  //create a ticket and save it
  const ticket = Ticket.build({
    title: "Concert",
    price: 22,
  });
  await ticket.save();
  // //create an order
  const order = Order.build({
    ticket,
    userId: "jkjlkjku",
    status: OrderStatus.Cancelled,
    //not realy matters right now
    expiresAt: new Date(),
  });

  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("Emits an order created event", async () => {
  //create a ticket and save it
  const ticket = Ticket.build({
    title: "Concert",
    price: 22,
  });
  await ticket.save();
  // //create an order
  const order = Order.build({
    ticket,
    userId: "jkjlkjku",
    status: OrderStatus.Cancelled,
    //not realy matters right now
    expiresAt: new Date(),
  });

  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
  //check if mock published function is actualy invoked

  // console.log(natsWrapper);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
