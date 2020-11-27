import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";
console.clear();

//create random client id
const id = randomBytes(4).toString("hex");
//create client
//in docs is frequently called stan but it's in effect client
const stan = nats.connect("ticketing", id, {
  url: "http://localhost:4222",
});

//listen to the connect event
stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  const publisher = new TicketCreatedPublisher(stan);
  publisher.publish({
    id: "1233",
    title: "concert",
    price: 20,
  });
  //data to share, can share only strings
  // const data = {
  //   id: "1233",
  //   title: "concert",
  //   price: 20,
  // };
  // //before sending convert to json
  // const dataToSend = JSON.stringify(data);
  // //call publish function to publish, first argument is the chanel the second data
  // //event is often called message in docs
  // stan.publish("ticket:created", dataToSend, () => {
  //   console.log("Event published");
  // });
});
