import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}
abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;
  private client: Stan;
  //wait for 5s
  protected ackWait = 5 * 1000;
  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOtptions() {
    //subscribtion to the chanel and queue group
    /**
     * Configures the subscription to require manual acknowledgement of messages
     * using Message#acknowledge.
     * @param tf - true if manual acknowlegement is required.
     */
    return (
      this.client
        .subscriptionOptions()
        .setManualAckMode(true)
        //bring all events emited in the past before service start
        .setDeliverAllAvailable()
        //make register of not delivered events when service not working and send them when online
        .setDurableName(this.queueGroupName)
    );
  }

  listen() {
    const subscription = this.client.subscribe(
      //https://docs.nats.io/nats-streaming-concepts/channels/subscriptions/queue-group
      //events go to just one member of queue group
      this.subject,
      //when there is q group nats is going to persist durable name
      this.queueGroupName,
      this.subscriptionOtptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(`Message received ${this.subject} / ${this.queueGroupName}`);
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? //parse string
        JSON.parse(data)
      : //parse Buffer
        JSON.parse(data.toString("utf8"));
  }
}

export default Listener;
