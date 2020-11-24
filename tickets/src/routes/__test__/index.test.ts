import request from "supertest";
import { app } from "../../app";
import Ticket from "../../models/Ticket";
import { createTicketRouter } from "../new";

const createTicket = (title: string, price: number) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price });
};
it("should fetch a list of tickets", async () => {
  const title = "Concert";
  const title2 = "Concert2";
  const price = 20.32;
  const price2 = 20.3;

  await createTicket(title, price);
  await createTicket(title2, price2);

  const ticketResponse = await request(app)
    .get(`/api/tickets`)
    .send()
    .expect(200);

  expect(ticketResponse.body.length).toEqual(2);
});
