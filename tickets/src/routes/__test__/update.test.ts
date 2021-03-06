import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import Ticket from "../../models/Ticket";
import { natsWrapper } from "../../nats-wrapper";

const generateValidId = () => {
  return new mongoose.Types.ObjectId().toHexString();
};
it("should return 404 if provided id does not exist", async () => {
  const id = generateValidId();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({ title: "title", price: 21 })
    .expect(404);
});
it("should return 401 if user is not authenticated", async () => {
  const id = generateValidId();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "title", price: 21 })
    .expect(401);
});
it("should return 401 if the user does not own the ticket", async () => {
  const user = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", user)
    .send({ title: "lklk", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({ title: "hjhgh", price: 12 })
    .expect(401);
});
it("should return 400 if the user provides invalid title or price", async () => {
  const user = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", user)
    .send({ title: "lklk", price: 20 });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", user)
    .send({ title: "", price: 12 })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", user)
    .send({ title: "dsds", price: -12 })
    .expect(400);
});
it("should update the ticket with valid price and tickets", async () => {
  const user = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", user)
    .send({ title: "lklk", price: 20 });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", user)
    .send({ title: "sadsd", price: 12 })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();
  console.log(ticketResponse.body);
  expect(ticketResponse.body.title).toEqual("sadsd");
  expect(ticketResponse.body.price).toEqual(12);
});

//TESTING MOCK NATS
it("should publish an event", async () => {
  //update ticket
  const user = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", user)
    .send({ title: "lklk", price: 20 });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", user)
    .send({ title: "sadsd", price: 12 })
    .expect(200);
  //check if mock published function is actualy invoked

  // console.log(natsWrapper);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("should reject update if the ticket is reserved ", async () => {
  const user = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", user)
    .send({ title: "lklk", price: 20 });
  //change the ticket
  const ticket = await Ticket.findById(response.body.id);
  ticket?.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await ticket?.save();
  //try to edit
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", user)
    .send({ title: "sadsd", price: 12 })
    .expect(400);
});
