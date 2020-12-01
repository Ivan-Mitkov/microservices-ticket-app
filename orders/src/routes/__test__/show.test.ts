import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "football",
    price: 100,
    id: "jkljlk",
  });
  await ticket.save();
  return ticket;
};
it("should fetches the order", async () => {
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
  //Make request to get order for user
  const response = await request(app)
    .get(`/api/orders/${orderResponse.body.order.id}`)
    .set("Cookie", user)
    .expect(200);

  // console.log(response.body);
  // console.log(orderResponse.body);

  expect(response.body.id).toEqual(orderResponse.body.order.id);

  expect(response.body.ticket.id).toEqual(orderResponse.body.order.ticket.id);
});

it("should not fetch other user order", async () => {
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

  //Make request to get order for user
  await request(app)
    .get(`/api/orders/${orderResponse.body.order.id}`)
    .set("Cookie", user2)
    .expect(401);
});
