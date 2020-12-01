import request from "supertest";
import { app } from "../../app";

import {Ticket} from "../../models/Ticket";

const buildTicket = async () => {
  const ticket = Ticket.build({
    id:'jkl',
    title: "football",
    price: 100,
  });
  await ticket.save();
  return ticket;
};
it("should fetches orders for a particular user", async () => {
  //create three tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();
  //create two users
  const userOne = global.signin();
  const userTwo = global.signin();
  //create one order as user #1
  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);
  //create two order as user #2
  const orderOne = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);
  const orderTwo = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);
  //Make request to get orders for user#2
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .expect(200);

  //Make sure we only got orders for user#2
  // console.log(response.body);
  // console.log(orderOne.body);
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.body.order.id);
  expect(response.body[1].id).toEqual(orderTwo.body.order.id);
  expect(response.body[0].ticket.id).toEqual(orderOne.body.order.ticket.id);
  expect(response.body[1].ticket.id).toEqual(orderTwo.body.order.ticket.id);
});
