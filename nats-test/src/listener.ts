import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import TicketCreatedListener from "./events/ticket-created-listener";
console.clear();

//create random client id
const id = randomBytes(4).toString("hex");
//create client
//in docs is frequently called stan but it's in effect client
const stan = nats.connect("ticketing", id, {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");
  //gracefull shutdown of the client
  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });
  new TicketCreatedListener(stan).listen();
});

//intercept server and close client first
//DOESN't WORK ON WINDOWS
process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
