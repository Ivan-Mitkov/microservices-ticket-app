import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";
/**
 * orders are send to redis for the period of expiration
 * in order to be locked for editing
 * after lock period is passed are returned in service for process
 */
//properties stored in jobs object - just for help from TS
interface Payload {
  orderId: string;
}
//https://optimalbits.github.io/bull/
//code to enqueue a job before is send to redis
const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    //from expiration-depl.yaml
    host: process.env.REDIS_HOST,
  },
});

//code to process a job - after is received from redis
expirationQueue.process(async (job) => {
  //after receive event from redis we are publishing event that expiration is completed
  //ticket is open fro editing or buying
  const publisher = new ExpirationCompletePublisher(
    natsWrapper.client
  ).publish({ orderId: job.data.orderId });
  console.log(
    "publish expiration:complete event for orderId",
    job.data.orderId
  );
});

export { expirationQueue };
