import nats, { Message } from "node-nats-streaming";
console.clear();
//create client
//in docs is frequently called stan but it's in effect client
const stan = nats.connect("ticketing", "123", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");
  //subscribtion to the chanel
  const subscription = stan.subscribe("ticket:created");
  subscription.on("message", (msg: Message) => {
    const data = msg.getData();
    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}, with data ${data}`);
    }
  });
});
