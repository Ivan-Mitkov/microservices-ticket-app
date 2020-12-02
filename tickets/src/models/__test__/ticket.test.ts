import Ticket from "../Ticket";

it("should implement optimistic concurrency control", async (done) => {
  //Create an instance of the ticket
  const ticket = Ticket.build({ title: "concert", price: 5, userId: "123" });
  //save the ticket to the DB
  await ticket.save();
  //fetch the ticket twice
  const firstTicket = await Ticket.findById(ticket.id);
  const secondTicket = await Ticket.findById(ticket.id);
  //make two separate changes to the ticket we fetch
  firstTicket?.set({ price: 10 });
  secondTicket?.set({ price: 15 });
  //save the first fetched ticket
  await firstTicket?.save();
  //save the second fetched ticket expect error
  //this not working
  // expect(async () => {
  //   await secondTicket?.save();
  // }).toThrow();
  try {
    await secondTicket?.save();
  } catch (error) {
    return done();
  }
  throw Error("Should not reach this point");
});

it("increments version number on multiple saves", async () => {
  //Create an instance of the ticket
  const ticket = Ticket.build({ title: "concert", price: 5, userId: "123" });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
