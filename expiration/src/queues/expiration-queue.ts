import Queue from "bull";
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
  console.log(
    "publish expiration:complete event for orderId",
    job.data.orderId
  );
});

export { expirationQueue };
