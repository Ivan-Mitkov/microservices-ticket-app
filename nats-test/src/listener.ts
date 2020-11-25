import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";
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
  //subscribtion to the chanel and queue group
  /**
   * Configures the subscription to require manual acknowledgement of messages
   * using Message#acknowledge.
   * @param tf - true if manual acknowlegement is required.
   */
  const options = stan.subscriptionOptions().setManualAckMode(true);
  //https://docs.nats.io/nats-streaming-concepts/channels/subscriptions/queue-group
  //events go to just one member of queue group
  const subscription = stan.subscribe(
    "ticket:created",
    "listenerQueueGroup",
    options
  );
  subscription.on("message", (msg: Message) => {
    const data = msg.getData();
    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}, with data ${data}`);
    }

    //setManualAckMode(true);
    //we receive the message don't send it to other service in queue
    msg.ack();
  });
});

//intercept server and close client first
//DOESN't WORK ON WINDOWS
process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
