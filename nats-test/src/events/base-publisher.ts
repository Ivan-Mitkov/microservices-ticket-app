import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}
export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  private client: Stan;
  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T["data"]) {
    const dataToString = JSON.stringify(data);
    this.client.publish(this.subject, dataToString, () => {
      console.log("Event publish");
    });
  }
}
